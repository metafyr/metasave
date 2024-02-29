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

    const fetchFallDetails = async(walletProvider, CFAddress) => {
        console.log('fetch fall details', CFAddress)
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        try{
            const IPFSobj = await MetaSave.getFallData(CFAddress)
            console.log('fall details: ', IPFSobj)
        }catch(err){
            console.log('no fall data for this user')
        }

        //fetch user details from ipfs id and store it in fallDetails
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