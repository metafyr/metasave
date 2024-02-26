require('dotenv').config()
const mnemonic = process.env["MNEMONIC"];
// const infuraProjectId = process.env["INFURA_PROJECT_ID"];

const maticmumbai_rpc_url = "https://rpc-mumbai.maticvigil.com/"

const HDWalletProvider = require('@truffle/hdwallet-provider');
// import HDWalletProvider from '@truffle/hdwallet-provider';

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    maticmumbai: {
      provider: function() {
			  return new HDWalletProvider(mnemonic, maticmumbai_rpc_url);
			},
			network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin
    }
  }
};
