import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Profile from '../components/Dashboard/Profile'
import Sidebar from '../components/Dashboard/Sidebar'
import DashboardPage from '../components/Dashboard/Dashboard'


const Dashboard = () => {
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