import React from "react";
import { addresses } from "../constants/addresses";
import { abi } from "../abi/index.js" 


const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
    const serverUrl = 'http://localhost:5000/api'
    const [userDetails, setUserDetails] = React.useState(
        {
            CF: null,
            name: "Abhinav C V",
            age: "20",
            gender: "female",
            phone: "9778393558",
            medications: [
                "none"
            ],
            address: "Dubai",
            contacts: [
                {
                    name: "brother",
                    phoneNumber: "00000"
                }
            ],
            disease: "none",
            duration: "none"
        }
    )

    const fetchUserDetails = async (walletProvider, CFAddress) => {
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        const IPFSid = await MetaSave.getIPFSFileName(CFAddress)
        console.log(IPFSid)

        //fetch user details from ipfs id and store it in userDetails
        const res = await axios.get(`${serverUrl}/user/${IPFSid}`)
        setUserDetails(res.data.data)
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