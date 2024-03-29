import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner } from "@alchemy/aa-core";
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import dotenv from 'dotenv'
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

// const polygonAmoy = /*#__PURE__*/ defineChain({
//     id: 80_001,
//     name: 'Ethereum Seplolia',
//     nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
//     rpcUrls: {
//         default: {
//             http: ['https://sepolia.infura.io/v3'],
//         },
//         alchemy: {
//             http: ['https://eth-sepolia.g.alchemy.com/v2']
//         }
//     },
//     blockExplorers: {
//         default: {
//           name: 'PolygonScan',
//           url: 'https://sepolia.etherscan.io',
//           apiUrl: 'https://sepolia.etherscan.io',
//         },
//     },
//     contracts: {
//         multicall3: {
//           address: '0xca11bde05977b3631167028862be2a173976ca11',
//           blockCreated: 25770160,
//         },
//     },
//     testnet: true,
// })

const chain = sepolia;

const AA = async(PRIV_KEY) => {
    try {
        const PRIVATE_KEY = `0x${PRIV_KEY}`;

        const owner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);

        const AAProvider = new AlchemyProvider({
            apiKey: ALCHEMY_API_KEY,
            chain,
            entryPointAddress: ENTRY_POINT_ADDRESS,
        }).connect(
        (rpcClient) =>
            new LightSmartContractAccount({
                rpcClient,
                owner,
                chain,
                entryPointAddress: ENTRY_POINT_ADDRESS,
                factoryAddress: getDefaultLightAccountFactoryAddress(chain),
            })
        )

        const CFaddress = await AAProvider.getAddress()

        AAProvider.withAlchemyGasManager({
            policyId: process.env.GAS_MANAGER_POLICY_ID,
        });

        return AAProvider
    } catch (error) {
        console.log(error)
    }
}

export default AA