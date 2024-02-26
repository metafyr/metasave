import React, { useState } from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import Modal from './Modal' // Make sure this path is correct

const AddDevice = () => {
  const [devices, setDevices] = useState([
    { name: 'Fitbit Sense 2', id: '432534:34z:312', date: '12/02/2024' },
    // ...additional devices
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: '', id: '', date: '' })

  const handleAddDevice = () => {
    setDevices([...devices, newDevice])
    setNewDevice({ name: '', id: '', date: '' }) // Reset the form
    setModalOpen(false) // Close modal
  }
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-grow p-4 sm:ml-64">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Add your health device</h1>
            <button
              className="bg-[#AAF0D1] py-2 px-4 rounded"
              onClick={() => setModalOpen(true)}
            >
              Add New
            </button>
          </div>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddDevice}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add new device
            </h3>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Device Name"
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              />
              <input
                type="text"
                placeholder="Device ID"
                value={newDevice.id}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, id: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              />
              <input
                type="date"
                value={newDevice.date}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, date: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              />
            </div>
          </Modal>
          <div className="px-8 pt-6 pb-8 mb-4">
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-xl font-semibold">Devices</h2>
            </div>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {device.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {device.id}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {device.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddDevice
