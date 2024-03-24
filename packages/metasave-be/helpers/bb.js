import { AlchemyProvider } from '@alchemy/aa-alchemy'
import { LightSmartContractAccount } from '@alchemy/aa-accounts'
import { LocalAccountSigner } from '@alchemy/aa-core'
import dotenv from 'dotenv'
import { abi } from '../abi/index.js'
import { addresses } from '../constants/addresses.js'

dotenv.config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

const BB = async (privKey) => {
  try {
    const privateKey = `0x${privKey}`

    // Create a signer using the private key
    const owner = LocalAccountSigner.privateKeyToAccountSigner(privateKey)

    // Create an AlchemyProvider instance
    const provider = new AlchemyProvider({
      apiKey: ALCHEMY_API_KEY,
      chainId: 80001, // Chain ID for Polygon Mumbai
      entryPointAddress: ENTRY_POINT_ADDRESS,
    })

    // Connect the provider to a LightSmartContractAccount
    const account = new LightSmartContractAccount({
      rpcClient: provider,
      owner,
      entryPointAddress: ENTRY_POINT_ADDRESS,
    })

    // Get the user's address
    const userAddress = await account.getAddress()

    // Define a function to get the IPFS ID from the Metasave contract
    const getIPFSId = async () => {
      const Metasave = await account.getContract(
        addresses.MetaSave,
        abi.MetaSave
      )
      const ipfsId = await Metasave.getIPFSFileName(userAddress)
      return ipfsId
    }

    return { provider, userAddress, getIPFSId }
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to create provider.')
  }
}

export default BB
