require('dotenv').config()
const MNEMONIC = process.env["MNEMONIC"];
const ADMIN_PRIV_KEY = process.env["ADMIN_PRIV_KEY"];
const ALCHEMY_PROJECT_ID = process.env["ALCHEMY_PROJECT_ID"];

const maticmumbai_rpc_url = "https://rpc-mumbai.maticvigil.com/"
const amoy_rpc_url = "https://rpc-amoy.polygon.technology/"
const sepolia_rpc_url = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}`

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    maticmumbai: {
      provider: function() {
			  return new HDWalletProvider(MNEMONIC, maticmumbai_rpc_url);
			},
			network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    amoy: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, amoy_rpc_url);
      },
      network_id: 80002,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    sepolia: {
      provider: function() {
        return new HDWalletProvider(ADMIN_PRIV_KEY, sepolia_rpc_url);
      },
      network_id: 11155111,
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
