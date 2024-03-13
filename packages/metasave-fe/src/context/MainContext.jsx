import React from "react";
import { addresses } from "../constants/addresses";
import { abi } from "../abi/index.js" 
import axios from 'axios'



const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
    const [fallPopup, setFallPopup] = React.useState(false)
    const [walletProvider, setWalletProvider] = React.useState()
    const [CFAddress, setCFAddress] = React.useState()
    React.useEffect(() => {
        if(walletProvider && CFAddress){
            const fallRef = ref(database, '/fall');
            onValue(fallRef, (snapshot) => {
                if(snapshot.exists()){
                    console.log('fall detected')
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
        setWalletProvider(walletProvider)
        setCFAddress(CFAddress)
        const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
        try{
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

            // Iterate over the array and store objects with unique timestamps
            result.forEach(obj => {
                const timestamp = obj.timestamp;
                // If timestamp doesn't exist in the uniqueObjects, store the object
                if (!uniqueObjects[timestamp]) {
                    uniqueObjects[timestamp] = obj;
                }
                // Else, ignore the duplicate timestamp
            });

            // Extract values (unique objects) from the uniqueObjects object
            const uniqueArray = Object.values(uniqueObjects);

            // Now uniqueArray contains objects with unique timestamps
            console.log(uniqueArray);
            setFallDetails(uniqueArray)
        }catch(err){
            console.log('no fall data for this user')
        }
    }
    
    return(
        <MainContext.Provider value={{
            serverUrl,
            userDetails,
            fallDetails,
            fallPopup,
            setFallPopup,
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