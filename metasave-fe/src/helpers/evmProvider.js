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

    const getBalance = async () => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()

            // Get user's Ethereum public address
            const address = signer.getAddress()

            // Get user's balance in ether
            const res = ethers.formatEther(
                await ethersProvider.getBalance(address) // Balance is in wei
            )
            const balance = (+res).toFixed(4)
            return balance
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

    const sendTransaction = async (amount, destination) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()

            const amountBigInt = ethers.parseEther(amount)

            // Submit transaction to the blockchain
            const tx = await signer.sendTransaction({
                to: destination,
                value: amountBigInt,
                maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
                maxFeePerGas: "6000000000000", // Max fee per gas
            })

            return `Transaction Hash: ${tx.hash}`
        } catch (error) {
            console.log(error)
            return error
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

    const deployContract = async (contractABI, contractByteCode, initValue) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()
            const factory = new ContractFactory(JSON.parse(contractABI), contractByteCode, signer)

            // Deploy contract with "Hello World!" in the constructor and wait to finish
            const contract = await factory.deploy(initValue)
            console.log("Contract:", contract)
            console.log(`Deploying Contract at Target: ${contract.target}, waiting for confirmation...`)

            const receipt = await contract.waitForDeployment()
            console.log("Contract Deployed. Receipt:", receipt)

            return receipt
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const readContract = async (contractAddress, contractABI) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)
            const signer = await ethersProvider.getSigner()
            console.log(contractABI)

            const contract = new ethers.Contract(contractAddress, JSON.parse(contractABI), signer)

            // Read message from smart contract
            const message = await contract.message()
            return message
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const writeContract = async (contractAddress, contractABI, updatedValue) => {
        try {
            const ethersProvider = new ethers.BrowserProvider(provider)

            const signer = await ethersProvider.getSigner()

            const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer)

            // Send transaction to smart contract to update message
            const tx = await contract.update(updatedValue)

            // Wait for transaction to finish
            const receipt = await tx.wait()
            return receipt
        } catch (error) {
            console.log(error)
            return error
        }
    }

    return {
        getAddress,
        getBalance,
        getChainId,
        getSignature,
        sendTransaction,
        getPrivateKey,
        deployContract,
        readContract,
        writeContract,
    }
}

export default ethersWeb3Provider