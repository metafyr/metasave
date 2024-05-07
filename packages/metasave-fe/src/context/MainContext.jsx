import React from "react";
import { addresses } from "../constants/addresses";
import { abi } from "../abi/index.js" 
import axios from 'axios'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import {encodeFunctionData} from 'viem'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

initializeApp(firebaseConfig)

const database = getDatabase()

const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
    const [fallPopup, setFallPopup] = React.useState(false)
    const [walletProvider, setWalletProvider] = React.useState()
    const [CFAddress, setCFAddress] = React.useState()
    const [devices, setDevices] = React.useState([
        { name: 'Fitbit Sense 2', id: '432534:34z:312', date: '12/02/2024' },
        // ...additional devices
    ])
    React.useEffect(() => {
        if(walletProvider && CFAddress){
            const fallRef = ref(database, '/fall');
            onValue(fallRef, (snapshot) => {
                if(snapshot.exists()){
                    console.log('fall detected', snapshot.val())
                    setFallPopup(true)
                    fetchFallDetails(walletProvider, CFAddress)
                    remove(fallRef)
                }
            });
        }
    }, [walletProvider, CFAddress])
    const serverUrl = 'http://localhost:5000/api'
    const [userDetails, setUserDetails] = React.useState(
        {
            
        }
    )

    const [fallDetails, setFallDetails] = React.useState(
        {
            //fall details
        }
    )

    const fetchUserDetails = async (walletProvider, CFAddress) => {
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        console.log('fetchin user details')
        try{
            const IPFSid = await MetaSave.getIPFSFileName(CFAddress)
            console.log(IPFSid)

            //fetch user details from ipfs id and store it in userDetails
            const res = await axios.get(`${serverUrl}/user/${IPFSid}`)
            console.log(res.data.data)
            setUserDetails(res.data.data)
        }catch(err){
            console.log('No user data for this user')
        }
    }

    async function fetchFallData(cid) {
        try {
            const res = await axios.get(`${serverUrl}/falldata?dataIPFSid=${cid}`);
            if(res){
                console.log(res.data.dataIPFSdata)
                return res.data.dataIPFSdata
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const fetchFallDetails = async(walletProvider, CFAddress) => {
        console.log('fetch fall details', CFAddress)
        setWalletProvider(walletProvider)
        setCFAddress(CFAddress)
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        try{
            console.log('fetching fall details')
            const IPFSobj = await MetaSave.getFallData(CFAddress)
            console.log('fall details: ', IPFSobj)
            const result = [];
            for (let i = 0; i < IPFSobj.length; i++) {
                const dataIPFS = IPFSobj[i][1]
                const imgIPFS = IPFSobj[i][0]
                console.log(dataIPFS, imgIPFS)
                const data = await fetchFallData(dataIPFS);
                if (data) {
                    const jsonMap = {
                        username: data.username,
                        timestamp: data.timestamp,
                        date: data.date,
                        status: data.status,
                        imgIPFS
                    };
                    result.push(jsonMap);
                }
            }
            console.log(result)
            const uniqueObjects = {};

            result.forEach(obj => {
                const timestamp = obj.timestamp;
                if (!uniqueObjects[timestamp]) {
                    uniqueObjects[timestamp] = obj;
                }
            });

            const uniqueArray = Object.values(uniqueObjects);

            console.log(uniqueArray);
            setFallDetails(uniqueArray)
        }catch(err){
            console.log('No fall data for this user')
        }
    }

    const fetchDevices = async(walletProvider, CFAddress) => {
        try {
            // call the SC function that fetches all devices connected to the user
        } catch (error) {
            console.log('No devices found', error)
        }
    }

    const insertUserDetails = async(AAProvider, CFAddress, data) => {
        const res = await axios.post(`${serverUrl}/user`, {data})

        const IPFSid = res.data.CID

        console.log("IPFS ID: ", IPFSid)
        console.log("CFAddress: ", CFAddress)

        const uoCallData = encodeFunctionData({
            abi: abi.MetaSave,
            functionName: "setIPFSFileName",
            args: [CFAddress, IPFSid],
        })
        const uo = await AAProvider.sendUserOperation({
            target: addresses.MetaSave,
            data: uoCallData,
        });

        const txHash = await AAProvider.waitForUserOperationTransaction(uo.hash)
        if(txHash){
            console.log("TX HASH: ", txHash)
            return true
        }else{
            return false
        }
    
    }
    
    return(
        <MainContext.Provider value={{
            serverUrl,
            userDetails,
            fallDetails,
            fallPopup,
            devices,
            setDevices,
            setFallPopup,
            setFallDetails,
            setUserDetails,
            fetchUserDetails,
            fetchFallDetails,
            insertUserDetails,
            fetchDevices
        }}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => React.useContext(MainContext)