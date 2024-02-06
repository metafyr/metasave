import React from "react";
import { addresses } from "../constants/addresses";
import { abi } from "../abi/index.js" 


const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
    const serverUrl = 'http://localhost:5000/api'
    const [userDetails, setUserDetails] = React.useState()

    const fetchUserDetails = async (walletProvider, CFAddress) => {
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        const IPFSid = await MetaSave.getIPFSFileName(CFAddress)
        console.log(IPFSid)

        //fetch user details from ipfs id and store it in userDetails
    }
    
    return(
        <MainContext.Provider value={{
            serverUrl,
            userDetails,
            setUserDetails,
            fetchUserDetails
        }}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => React.useContext(MainContext)