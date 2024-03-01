import React from "react";
import { Web3Auth } from "@web3auth/modal";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { identityCreation } from "../helpers/PolygonID";
import axios from 'axios'
import { getWalletProvider } from "../helpers/walletProvider.js";
import { addresses } from "../constants/addresses.js";
import { abi } from "../abi/index.js";
import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner } from "@alchemy/aa-core";
import { defineChain } from 'viem'
import { useMainContext } from "./MainContext.jsx";
import keccak256 from 'keccak256'


const AuthContext = React.createContext()


export const AuthContextProvider = ({children}) => {
    const [web3auth, setWeb3Auth] = React.useState(null)
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [web3AuthProvider, setWeb3AuthProvider] = React.useState(null)
    const [pid, setPID] = React.useState(null)
    const [walletAddress, setWalletAddress] = React.useState(null)
    const [walletProvider, setWalletProvider] = React.useState(null)
    const [AAProvider, setAAProvider] = React.useState(null)
    const [CFAddress, setCFAddress] = React.useState(null)
    const [privKey, setPrivKey] = React.useState(null)
    const { serverUrl } = useMainContext()
    const mumbaiChainConfig = {
        chainNamespace: "eip155",
        chainId: "0x13881",
        rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
        displayName: "Polygon Mumbai",
        blockExplorer: "https://mumbai.polygonscan.com",
        ticker: "MATIC",
        tickerName: "Polygon",
    }
    const initWeb3Auth = async() => {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
            config: {
                chainConfig: mumbaiChainConfig,
            },
        });
        const web3auth = new Web3Auth({
            clientId: "BJGWO2abSqntJyXgPZwpAZH9-BdnaoY_w6VFpeo-OVzyZaVMIt8F8lxodXXGU0wCmtARzvgsTbP6cdEGOiBznxI",
            web3AuthNetwork: "sapphire_devnet",
            chainConfig: mumbaiChainConfig,
        });
        const openloginAdapter = new OpenloginAdapter({
            adapterSettings: {
              loginConfig: {
                google: {
                  name: "Google Login",
                  verifier: "metasave-google",
                  typeOfLogin: "google",
                  clientId: '812141797831-m3vq0ll82e23vsgu0ns700l1b2etoagf.apps.googleusercontent.com'
                },
              },
            },
            privateKeyProvider
        });

        web3auth.configureAdapter(openloginAdapter);
        
        await web3auth.initModal();

        setWeb3Auth(web3auth)

        await checkLoggedIn(web3auth)
    }

    const verifyProof = async(walletAddress, walletProvider) => {
        try{
            let status = {
                status: "not verified",
                proceed: false,
                newUser: false
            }

            const privateKey = await walletProvider.getPrivateKey()
            const ZKProof = await walletProvider.getContract(addresses.ZKProof, abi.ZKProof)
            const treeCID = await ZKProof.getMTIPFSid()
            const treeRoot = await ZKProof.getMTRoot()
            console.log(treeCID, treeRoot)
            const msg = keccak256(privateKey).toString('hex')
            const res = await axios.post(`${serverUrl}/merkletree`, {
                walletAddress,
                msg,
                treeCID
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(res.data.newUser){
                status = {
                    status: "new user",
                    proceed: true,
                    newUser: true
                }
                return status
            }else{
                const proof = res.data.proof
                console.log(res.data)
                const root = res.data.root
                const verify = await ZKProof.verify(root, proof, walletAddress, `0x${msg}`)
                if(verify == true || verify == 'true'){
                    status = {
                        status: "verified",
                        proceed: true,
                        newUser: false
                    }
                }else{
                    status = {
                        status: "not verified",
                        proceed: false,
                        newUser: false
                    }
                }
                return status
            }
        }catch(err){
            console.log(err)
        }
    }

    const login = async() => {
        const web3authProvider = await web3auth?.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "google",
        });
        console.log('web3authprovider', web3authProvider)
        const walletProvider = getWalletProvider(web3authProvider)
        const walletAddress = await walletProvider.getAddress()
        const priv_key = await walletProvider.getPrivateKey()
        console.log('priv_key', priv_key)
        setWalletProvider(walletProvider)
        setWalletAddress(walletAddress)
        setWeb3AuthProvider(web3authProvider)
        setPrivKey(priv_key)

        const verify = await verifyProof(walletAddress, walletProvider)

        if(verify.proceed == true){
            if(verify.newUser == true){
                // const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
                // console.log('granting role')
                // const grantRole = await MetaSave.userSignUp()
                // if(grantRole){
                //     window.location.replace('/register')
                // }else{
                //     window.alert('Some error occured')
                //     await web3auth.logout()
                // }
                window.location.replace('/register')
            }else{
                setLoggedIn(web3auth?.status === "connected" ? true : false)
                const CF = getCFAddress(priv_key)
                const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
                const IPFSid = await MetaSave.getIPFSFileName(CF)
                if(!IPFSid){
                    window.location.replace('/register')
                }else{
                    window.location.replace('/dashboard')
                }
            }
        }else if (verify.proceed == false){
            console.log('verification failed')
            await web3auth.logout()
        }
    }

    const getCFAddress = async(PRIV_KEY) => {
        const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY
        const GAS_MANAGER_POLICY_ID = import.meta.env.VITE_GAS_MANAGER_POLICY_ID
        const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
        const PRIVATE_KEY = `0x${PRIV_KEY}`
        const polygonMumbai = /*#__PURE__*/ defineChain({
            id: 80_001,
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
                  apiUrl: 'https://mumbai.polygonscan.com/api',
                },
            },
            contracts: {
                multicall3: {
                  address: '0xca11bde05977b3631167028862be2a173976ca11',
                  blockCreated: 25770160,
                },
            },
            testnet: true,
        })
        
        const chain = polygonMumbai;

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

        AAProvider.withAlchemyGasManager({
            policyId: GAS_MANAGER_POLICY_ID
        });

        const CFAddress = await AAProvider.getAddress()

        console.log(CFAddress, AAProvider)

        setCFAddress(CFAddress)
        setAAProvider(AAProvider)

        return CFAddress
    }

    const getPID = async(web3authProvider) => {
        if(web3authProvider){
            const pKey = await walletProvider.getPrivateKey()
            const res = await identityCreation(pKey);
            setPID(res.did.string())
        }
    }

    const Logout = async() => {
        if(web3auth){
            await web3auth.logout()
            setLoggedIn(false)
            window.location.replace('/login')
        }
    }

    const checkLoggedIn = async(web3auth) => {
        console.log('checking logged in')
        if(web3auth?.status === "connected"){
            const web3AuthProvider = web3auth.provider
            const walletProvider = getWalletProvider(web3AuthProvider)
            const walletAddress = await walletProvider.getAddress()
            const priv_key = await walletProvider.getPrivateKey()
            console.log('priv_key', priv_key)

            setPrivKey(priv_key)
            setWalletProvider(walletProvider)
            setWalletAddress(walletAddress)
            setWeb3AuthProvider(web3AuthProvider)

            getCFAddress(priv_key)

            setLoggedIn(true)
        }
    }

    return(
        <AuthContext.Provider value={{
            web3auth,
            loggedIn,
            web3AuthProvider,
            walletAddress,
            walletProvider,
            AAProvider,
            CFAddress,
            Logout,
            checkLoggedIn,
            setWeb3AuthProvider,
            setLoggedIn,
            login,
            initWeb3Auth,
            setWeb3Auth,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => React.useContext(AuthContext)