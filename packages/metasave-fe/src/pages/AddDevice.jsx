import React, { useState } from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import Modal from './Modal' // Make sure this path is correct
import { useMainContext } from '../context/MainContext'
import { useAuthContext } from '../context/AuthContext'
import { abi } from '../abi'
import { addresses } from '../constants/addresses'
// import { createBluetooth } from 'node-ble'
import axios from 'axios'

// const { bluetooth, destroy } = createBluetooth()
// const adapter = await bluetooth.defaultAdapter()

const AddDevice = () => {
  const { devices, setDevices, serverUrl } = useMainContext()
  const { CFAddress, privKey, walletProvider } = useAuthContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: '', date: '', type: '' })

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

  const sendPrivKeyToDevice = async(type) => {
    try{
      
      const res = await axios.post('http://localhost:8000/privkey', {
        privKey,
        type
      })
      if(res){
        console.log(res.data.message)
        console.log('Device ID Received!', res.data.deviceId)
        return res.data.deviceId
      }
    }catch(err){
      console.log('Error while sending device to server: ', err)
      return 0
    }
  }

  const generateProof = async(deviceId) => {
    try{
      const ZKProof = await walletProvider.getContract(addresses.ZKProof, abi.ZKProof)
      
      let treeCID, treeRoot
      
      try {
        treeCID = await ZKProof.getMTIPFSid(0)
      } catch (error) {
        treeCID = ""
      }

      try {
        treeRoot = await ZKProof.getMTRoot(0)
      } catch (error) {
        treeRoot = ""
      }

      console.log("Device TreeCID: ", treeCID)
      console.log("Device TreeRoot: ", treeRoot)
      
      console.log('Checking Merkle Tree...')
      const res = await axios.post(`${serverUrl}/deviceMerkletree`, {
        deviceId,
        treeCID,
        CFAddress
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(res){
        console.log('Proof generated and stored in server!')
      }
    }catch(err){
      console.log('Error while generating proof: ', err)
    }
  }

  const handleAddDevice = async() => {
    newDevice.date = new Date().toLocaleDateString()
    setDevices([...devices, newDevice])
    setNewDevice({ name: '', id: '', ip: '', date: '' })
    setModalOpen(false)

    const deviceId = await sendPrivKeyToDevice(newDevice.type)

    generateProof(deviceId)

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
              {/* <input
                type="text"
                placeholder="Device UID"
                value={newDevice.id}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, id: e.target.value })
                }
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
              /> */}
              <select 
                name="" 
                id=""
                className="mt-2 px-4 py-2 bg-white text-sm w-full border rounded-md"
                onChange={(e) => 
                  setNewDevice({ ...newDevice, type: e.target.value })
                }
              >
                <option value="0">Select Device Type</option>
                <option value="1">Camera</option>
                <option value="2">Wearable</option>
              </select>
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
                    Device Type
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
                      {device.type}
                    </td>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {device.ip}
                    </td> */}
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
