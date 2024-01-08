import { ethers } from "ethers";

export default class EthereumRpc {
  provider

  constructor(provider) {
    this.provider = provider;
  }

  async getChainId() {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  async getAddress() {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = await ethersProvider.getSigner();
      const address = signer.getAddress();
      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance() {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = await ethersProvider.getSigner();
      const address = signer.getAddress();
      const balance = ethers.utils.formatEther(
        await ethersProvider.getBalance(address)
      );
      return balance;
    } catch (error) {
      return ErrorEvent;
    }
  }

  async sendTransaction(destination, amount) {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();
      const tx = await (
        await signer
      ).sendTransaction({
        to: destination,
        value: ethers.utils.parseEther(amount),
        maxPriorityFeePerGas: "5000000000",
        maxFeePerGas: "6000000000000",
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      return ErrorEvent;
    }
  }

  async signMessage(message) {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();
      const signedMessage = await (await signer).signMessage(message);
      return signedMessage;
    } catch (error) {
      return ErrorEvent;
    }
  }

  async getPrivateKey() {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });
      return privateKey;
    } catch (error) {
      return ErrorEvent;
    }
  }
}
