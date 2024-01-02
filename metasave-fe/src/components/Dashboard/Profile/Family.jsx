import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import '../../../styles/Family.css'
import { useMainContext } from '../../../context/MainContext';
import { useSignupContext } from '../../../pages/Signup';

const Family = () => {
    const { userDetails } = useMainContext()
    const { contacts, handleContactChange, addContact } = useSignupContext()
  return (
    <div className='grid my-10'>
        {userDetails && userDetails.contacts.map((user, index) => {
            const [edit, setEdit] = React.useState(false)
            const [deleteThis, setDelete] = React.useState(false)
            const handleEdit = (i) => {
                setEdit(true)
                console.log(i)
            }
            const handleDelete = (i) => {
                setDelete(false)
                console.log(i)
            }
            const handleSave = (i) => {
                setEdit(false)
                console.log(i)
            }
            return (
                <div key={index} className='family-card'>
                    {edit ?
                        <input className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full' defaultValue={user.phoneNumber} />
                    :
                        <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{user.phoneNumber}</h3>
                    }
                    {edit ?
                        <input className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full' defaultValue={user.name} />
                    :
                        <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{user.name}</h3>
                    }
                    <div className='mt-5'>
                        {
                        deleteThis ?
                        <>
                            <button onClick={() => handleDelete(index)} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Confirm</button>
                            <button onClick={() => setDelete(false)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Cancel</button>
                        </>
                        :
                        edit ? 
                            <button onClick={() => handleSave(index)} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Save</button>
                        :
                            <button onClick={() => handleEdit(index)} className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                        }
                        {!deleteThis && <button onClick={() => setDelete(true)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>}
                    </div>
                </div>
            )
        })}
        {contacts.map((contact, index) => {
            const [edit, setEdit] = React.useState(true)
            const [deleteThis, setDelete] = React.useState(false)
            const handleEdit = (i) => {
                setEdit(true)
                console.log(i)
            }
            const handleDelete = (i) => {
                setDelete(false)
                console.log(i)
            }
            const handleSave = (i) => {
                setEdit(false)
                console.log(i)
            }
            return (
                <div key={index} className='family-card'>
                    {edit ?
                        <input onChange={(e) => handleContactChange(index, 'phoneNumber', e.target.value)} className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full'  />
                    :
                        <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{contact.phoneNumber}</h3>
                    }
                    {edit ?
                        <input onChange={(e) => handleContactChange(index, 'name', e.target.value)} className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full'  />
                    :
                        <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{contact.name}</h3>
                    }
                    <div className='mt-5'>
                        {
                        deleteThis ?
                        <>
                            <button onClick={() => handleDelete(index)} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Confirm</button>
                            <button onClick={() => setDelete(false)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Cancel</button>
                        </>
                        :
                        edit ? 
                            <button onClick={() => handleSave(index)} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Save</button>
                        :
                            <button onClick={() => handleEdit(index)} className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                        }
                        {!deleteThis && <button onClick={() => setDelete(true)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>}
                    </div>
                </div>
            )
        })}
        <div onClick={addContact} className='family-card cursor-pointer justify-center items-center'>
            <AddIcon className='add-icon' />
        </div>
    </div>
  )
}

export default Family