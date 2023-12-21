import React from "react";

const MainContext = React.createContext()


export const MainContextProvider = ({children}) => {
    const serverUrl = 'https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new'
    const [userDetails, setUserDetails] = React.useState()
    return(
        <MainContext.Provider value={{
            serverUrl,
            userDetails,
            setUserDetails  
        }}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => React.useContext(MainContext)