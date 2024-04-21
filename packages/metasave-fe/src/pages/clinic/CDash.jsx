import React from 'react'
import { Routes, Route } from 'react-router-dom'
// import Profile from '../components/Dashboard/Profile'
import Sidebar from './Sidebar'
import ClinicDash from './ClinicDash'
import ClinicProfile from './ClinicProfile'

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Routes>
          <Route path="/" element={<ClinicDash />} />
          <Route path="/profile" element={<ClinicProfile />} />
        </Routes>
      </div>
    </>
  )
}

export default Dashboard
