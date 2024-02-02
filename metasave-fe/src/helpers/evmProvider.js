import { ContractFactory, ethers } from "ethers"

const ethersWeb3Provider = (provider) => {
    const getAddress = async () => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()

            const address = await signer.getAddress()
            return address
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }

    const getChainId = async () => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            return (await ethersProvider.getNetwork()).chainId.toString(16)
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }

    const getSignature = async (message) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()
            // Sign the message
            const signedMessage = await signer.signMessage(message)
            return signedMessage
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }

    const getPrivateKey = async () => {
        try {
            const privateKey = await provider?.request({
                method: "eth_private_key",
            })

            return privateKey
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const getContract = async (contractAddress, contractABI) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()

            const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer)

            return contract
        } catch (error) {
            console.log(error)
            return error
        }
    }

    return {
        getAddress,
        getChainId,
        getSignature,
        getPrivateKey,
        getContract,
    }
}

export default ethersWeb3Provider