import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Profile from '../components/Dashboard/Profile'
import Sidebar from '../components/Dashboard/Sidebar'
import DashboardPage from '../components/Dashboard/Dashboard'
import { useAuthContext } from '../context/AuthContext'
import { useMainContext } from '../context/MainContext'

const Dashboard = () => {
  const { initWeb3Auth, CFAddress, walletProvider } = useAuthContext()
  const { fetchUserDetails } = useMainContext()
  React.useEffect(() => {
    initWeb3Auth()
  }, [])
  
  React.useEffect(() => {
    if(CFAddress && walletProvider){
      console.log(CFAddress)
      fetchUserDetails(walletProvider, CFAddress)
    }
  }, [CFAddress, walletProvider])
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  )
}

export default Dashboard