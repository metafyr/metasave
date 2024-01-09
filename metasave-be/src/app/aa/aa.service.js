import { Injectable } from '@nestjs/common';
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from '@alchemy/aa-accounts';
import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LocalAccountSigner } from '@alchemy/aa-core';
import * as dotenv from 'dotenv';
import { defineChain } from 'viem';
dotenv.config();

@Injectable()
export class AAService {
  helloWorld() {
    return "lol";
  }

  async getCFaddress() {
    const PRIV_KEY = process.env.PRIV_KEY;
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

    const polygonMumbai = /*#__PURE__*/ defineChain({
      id: 80001,
      name: 'Polygon Mumbai',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://rpc.ankr.com/polygon_mumbai'],
        },
        alchemy: {
          http: ['https://polygon-mumbai.g.alchemy.com/v2']
        }
      },
      blockExplorers: {
        default: {
          name: 'PolygonScan',
          url: 'https://mumbai.polygonscan.com',
        },
      },
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      testnet: true,
    });

    const chain = polygonMumbai;
    const PRIVATE_KEY = PRIV_KEY;
    const owner = LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIVATE_KEY}`);
    const provider = new AlchemyProvider({
      apiKey: ALCHEMY_API_KEY,
      chain,
      entryPointAddress: ENTRY_POINT_ADDRESS
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          entryPointAddress: ENTRY_POINT_ADDRESS,
          rpcClient,
          owner,
          chain,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        })
    );

    return { provider };
}
}