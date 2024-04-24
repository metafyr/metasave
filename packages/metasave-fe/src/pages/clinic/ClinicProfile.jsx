import React from 'react'
import Sidebar from './Sidebar'
const ClinicProfile = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Clinic Profile</h1>
          <button className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClinicProfile
