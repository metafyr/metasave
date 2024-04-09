import React, { useState } from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import Modal from './Modal' // Make sure this path is correct
import { useMainContext } from '../context/MainContext'
import { useAuthContext } from '../context/AuthContext'
import { abi } from '../abi'
import { addresses } from '../constants/addresses'

const AddDevice = () => {
  const { devices, setDevices } = useMainContext()
  const { CFAddress, privKey } = useAuthContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: '', id: '', ip: '', date: '' })

  const saveToBlockchain = async() => {
    try {
      const uoCallData = encodeFunctionData({
        abi: abi.MetaSave,
        functionName: "addDevice", 
        args: [CFAddress, newDevice.name, newDevice.id, newDevice.ip, newDevice.date],
      })
      const uo = await AAProvider.sendUserOperation({
        target: addresses.MetaSave,
        data: uoCallData,
      });
  
      const txHash = await AAProvider.waitForUserOperationTransaction(uo.hash)
      if(txHash){
        console.log("TX HASH: ", txHash)
        window.location.replace('/dashboard')
      }
    } catch (error) {
      console.log('Error while saving to blockchain: ', error)
    }
  }

  const sendPrivKeyToDevice = async() => {
    try{
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'BLE' }]
      });
      console.log('BLE Device:', device);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(import.meta.env.VITE_DEVICE_UUID);
      const characteristic = await service.getCharacteristic(import.meta.env.VITE_DEVICE_CHARACTERISTIC_ID);

      const dataArrayBuffer = new TextEncoder().encode(data);

      await characteristic.writeValue(dataArrayBuffer);

      console.log('Data sent successfully');
    }catch(err){
      console.log('Error while sending device to server: ', err)
    }
  }

  const handleAddDevice = () => {
    newDevice.date = new Date().toLocaleDateString()
    setDevices([...devices, newDevice])
    setNewDevice({ name: '', id: '', ip: '', date: '' })
    setModalOpen(false)

    // send PRIV_KEY to https://IP_ADDRESS:PORT/add-device
    sendPrivKeyToDevice()

    // call the SC function that maps device to user in blockchain
    // saveToBlockchain()
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
            <p className='text-red-500 text-sm'>*Both the device to be added and the current device should be connected to the same WiFi network.</p>
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
                type="text"
                placeholder="Device IP Address"
                value={newDevice.ip}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, ip: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              />
              {/* <input
                type="date"
                value={newDevice.date}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, date: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              /> */}
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
                    Device Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Device ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IP Address
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
                      {device.ip}
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
