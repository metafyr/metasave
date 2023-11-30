import React from 'react'
import Navbar from '../components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Profile from '../components/Dashboard/Profile'
import Sidebar from '../components/Dashboard/Sidebar'


const Dashboard = () => {
  return (
    <>
      {/* <Navbar /> */}

      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  )
}

export default Dashboard