import React from "react";
import { addresses } from "../constants/addresses";
import { abi } from "../abi/index.js" 
import axios from 'axios'


const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
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
        const IPFSid = await MetaSave.getIPFSFileName(CFAddress)
        console.log(IPFSid)

        //fetch user details from ipfs id and store it in userDetails
        const res = await axios.get(`${serverUrl}/user/${IPFSid}`)
        console.log(res.data.data)
        setUserDetails(res.data.data)
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
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        try{
            const IPFSobj = await MetaSave.getFallData(CFAddress)
            console.log('fall details: ', IPFSobj)
            const result = [];
            // for (const subArray of IPFSobj) {
            //     const dataIPFS = subArray[0][1]
            //     const imgIPFS = subArray[0][0]
            //     const data = await fetchData(dataIPFS);
            //     if (data) {
            //         const jsonMap = {
            //             username: data.username,
            //             timestamp: data.timestamp,
            //             date: data.date,
            //             status: data.status,
            //             imgIPFS
            //         };
            //         result.push(jsonMap);
            //     }
            // }
            const dataIPFS = IPFSobj[0][1]
            const imgIPFS = IPFSobj[0][0]
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
            console.log(result)
            setFallDetails(result)
        }catch(err){
            console.log('no fall data for this user')
        }
    }
    
    return(
        <MainContext.Provider value={{
            serverUrl,
            userDetails,
            fallDetails,
            setFallDetails,
            setUserDetails,
            fetchUserDetails,
            fetchFallDetails
        }}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => React.useContext(MainContext)