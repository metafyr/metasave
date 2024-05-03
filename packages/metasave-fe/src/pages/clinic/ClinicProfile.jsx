import React, { useState } from 'react'
import Sidebar from './Sidebar'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'

const ClinicProfile = () => {
  const [clinicName, setClinicName] = useState('Woodland Clinic')
  const [editingClinicName, setEditingClinicName] = useState(false)
  const [newClinicName, setNewClinicName] = useState('')
  const [emailAddress, setEmailAddress] = useState('Woodland@matasave.ai')
  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [phoneNumber1, setPhoneNumber1] = useState('9746424414')
  const [editingPhone1, setEditingPhone1] = useState(false)
  const [newPhone1, setNewPhone1] = useState('')
  const [phoneNumber2, setPhoneNumber2] = useState('9849349321')
  const [editingPhone2, setEditingPhone2] = useState(false)
  const [newPhone2, setNewPhone2] = useState('')
  const [addressLine, setAddressLine] = useState('Singapore')
  const [editingAddress, setEditingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState('')

  const handleEditClick = (field) => {
    switch (field) {
      case 'clinicName':
        setEditingClinicName(true)
        setNewClinicName(clinicName)
        break
      case 'email':
        setEditingEmail(true)
        setNewEmail(emailAddress)
        break
      case 'phone1':
        setEditingPhone1(true)
        setNewPhone1(phoneNumber1)
        break
      case 'phone2':
        setEditingPhone2(true)
        setNewPhone2(phoneNumber2)
        break
      case 'address':
        setEditingAddress(true)
        setNewAddress(addressLine)
        break
      default:
        break
    }
  }

  const handleSaveClick = (field) => {
    switch (field) {
      case 'clinicName':
        setClinicName(newClinicName)
        setEditingClinicName(false)
        break
      case 'email':
        setEmailAddress(newEmail)
        setEditingEmail(false)
        break
      case 'phone1':
        setPhoneNumber1(newPhone1)
        setEditingPhone1(false)
        break
      case 'phone2':
        setPhoneNumber2(newPhone2)
        setEditingPhone2(false)
        break
      case 'address':
        setAddressLine(newAddress)
        setEditingAddress(false)
        break
      default:
        break
    }
  }

  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-2 md:mb-0 ml-5">
            Clinic profile
          </h1>
          <LocalHospitalIcon className="text-[#3a3a3a] text-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-16 mx-5 mt-12">
          <div className="text-lg text-[#3a3a3a]">
            <div className="flex justify-between">
              Clinic name
              <DriveFileRenameOutlineOutlinedIcon
                className="text-[#3a3a3a]"
                onClick={() => handleEditClick('clinicName')}
              />
            </div>
            {editingClinicName ? (
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="text-sm text-black px-2 py-1 border-b-2 w-full"
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                />
                <button
                  className="mr-auto text-sm px-2 py-1"
                  onClick={() => handleSaveClick('clinicName')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5 className="mt-2 text-sm text-black">{clinicName}</h5>
                <div className="border border-gray-300 mt-2"></div>
              </div>
            )}
          </div>

          <div className="text-lg text-[#3a3a3a]">
            <div className="flex justify-between">
              Email address
              <DriveFileRenameOutlineOutlinedIcon
                className="text-[#3a3a3a]"
                onClick={() => handleEditClick('email')}
              />
            </div>
            {editingEmail ? (
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="text-sm text-black px-2 py-1 border-b-2 w-full"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  className="mr-auto text-sm px-2 py-1"
                  onClick={() => handleSaveClick('email')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5 className="mt-2 text-sm text-black">{emailAddress}</h5>
                <div className="border border-gray-300 mt-2"></div>
              </div>
            )}
          </div>

          <div className="text-lg text-[#3a3a3a]">
            <div className="flex justify-between">
              Phone number 1
              <DriveFileRenameOutlineOutlinedIcon
                className="text-[#3a3a3a]"
                onClick={() => handleEditClick('phone1')}
              />
            </div>
            {editingPhone1 ? (
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="text-sm text-black px-2 py-1 border-b-2 w-full"
                  value={newPhone1}
                  onChange={(e) => setNewPhone1(e.target.value)}
                />
                <button
                  className="mr-auto text-sm px-2 py-1"
                  onClick={() => handleSaveClick('phone1')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5 className="mt-2 text-sm text-black">{phoneNumber1}</h5>
                <div className="border border-gray-300 mt-2"></div>
              </div>
            )}
          </div>

          <div className="text-lg text-[#3a3a3a]">
            <div className="flex justify-between">
              Phone number 2
              <DriveFileRenameOutlineOutlinedIcon
                className="text-[#3a3a3a]"
                onClick={() => handleEditClick('phone2')}
              />
            </div>
            {editingPhone2 ? (
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="text-sm text-black px-2 py-1 border-b-2 w-full"
                  value={newPhone2}
                  onChange={(e) => setNewPhone2(e.target.value)}
                />
                <button
                  className="mr-auto text-sm px-2 py-1"
                  onClick={() => handleSaveClick('phone2')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5 className="mt-2 text-sm text-black">{phoneNumber2}</h5>
                <div className="border border-gray-300 mt-2"></div>
              </div>
            )}
          </div>

          <div className="text-lg text-[#3a3a3a]">
            <div className="flex justify-between">
              Address
              <DriveFileRenameOutlineOutlinedIcon
                className="text-[#3a3a3a]"
                onClick={() => handleEditClick('address')}
              />
            </div>
            {editingAddress ? (
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="text-sm text-black px-2 py-1 border-b-2 w-full"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <button
                  className="mr-auto text-sm px-2 py-1"
                  onClick={() => handleSaveClick('address')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h5 className="mt-2 text-sm text-black">{addressLine}</h5>
                <div className="border border-gray-300 mt-2"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4 mr-5">
          <button className="bg-[#4A9DFF] px-8 py-3 rounded-[15px] text-white hover:bg-blue-700">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClinicProfile
