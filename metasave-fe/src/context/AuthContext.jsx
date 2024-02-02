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
import { createHelia } from 'helia'
import { dagJson } from '@helia/dag-json'

const helia = await createHelia()
const d = dagJson(helia)


const AuthContext = React.createContext()


export const AuthContextProvider = ({children}) => {
    const [web3auth, setWeb3Auth] = React.useState(null)
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [web3AuthProvider, setWeb3AuthProvider] = React.useState(null)
    const [pid, setPID] = React.useState(null)
    const [walletAddress, setWalletAddress] = React.useState(null)
    const [walletProvider, setWalletProvider] = React.useState(null)
    const [userDetails, setUserDetails] = React.useState()
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
            const res = await axios.post('http://localhost:5000/api/merkletree', {
                walletAddress,
                msg: 5000
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
                    newUser: false
                }
                return status
            }else{
                const proof = res.data.proof
                console.log(res.data)
                const root = res.data.root
                const msg = 5000
                const ZKProof = await walletProvider.getContract(addresses.ZKProof, abi.ZKProof)
                const verify = await ZKProof.verify(root, proof, walletAddress, msg)
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
        const walletProvider = getWalletProvider(web3authProvider)
        const walletAddress = await walletProvider.getAddress()
        setWalletProvider(walletProvider)
        setWalletAddress(walletAddress)
        setWeb3AuthProvider(web3authProvider)

        const verify = await verifyProof(walletAddress, walletProvider)

        if(verify.proceed == true){
            if(verify.newUser == true){
                window.location.replace('/register')
            }else{
                setLoggedIn(web3auth?.status === "connected" ? true : false)
                getCFAddress(web3authProvider)
                const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
                const IPFSid = await MetaSave.getIPFSFileName(walletAddress)
                const IPFScid = new CID(IPFSid)
                
                const IPFSdata = await d.get(IPFScid)
                setUserDetails(IPFSdata)
                console.log(IPFSdata)
                window.location.replace('/dashboard')
            }
        }else if (verify.proceed == false){
            console.log('verification failed')
            await web3auth.logout()
        }
    }

    const getCFAddress = async(web3authProvider) => {
        if(web3authProvider){
            const res = await axios.post('http://localhost:3000/aa', web3authProvider, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(res)
        }
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
        if(web3auth?.status === "connected"){
            getCFAddress(web3AuthProvider)
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