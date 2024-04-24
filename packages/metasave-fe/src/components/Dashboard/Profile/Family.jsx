import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import '../../../styles/Family.css'
import { useMainContext } from '../../../context/MainContext';
import { useSignupContext } from '../../../pages/Signup';
import axios from 'axios'
import { useAuthContext } from '../../../context/AuthContext';


const NewCard = ({index, handleContactChange, contacts, userDetails, setUserDetails, setContacts}) => {
    const { serverUrl, insertUserDetails } = useMainContext()

    const { CFAddress, AAProvider } = useAuthContext()

    const [edit, setEdit] = React.useState(true)
    const [deleteThis, setDelete] = React.useState(false)

    const handleDelete = () => {
        setContacts([{name: '', phoneNumber: ''}])
        setDelete(false)
    }
    const handleSave = async() => {
        const newContact = contacts.slice(1);
        const mergedContacts = [...userDetails.contacts, ...newContact];

        const dummyData = userDetails
        dummyData.contacts = mergedContacts

        const res = await insertUserDetails(AAProvider, CFAddress, dummyData)
        
        if(res){
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                contacts: mergedContacts,
            }));
            setContacts([{ name: '', phoneNumber: '' }])
            setEdit(false)
        }
    }
    return (
        <div key={index} className='family-card'>
            <input onChange={(e) => handleContactChange(index, 'phoneNumber', e.target.value)} className='text-[#3a3a3a] poppins text-center !font-bold border-b-2 border-gray-400 bg-transparent focus:!outline-none'  />
            
            <input onChange={(e) => handleContactChange(index, 'name', e.target.value)} className='text-[#3a3a3a] poppins text-center border-b-2 !font-bold border-gray-400 bg-transparent focus:!outline-none'  />
            
            <div className='mt-5'>
                {
                deleteThis ?
                <>
                    <button onClick={() => setDelete(false)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-bl-[15px] w-full'>Cancel</button>
                    <button onClick={handleDelete} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-br-[15px] w-full'>Confirm</button>
                </>
                :
                    <button onClick={handleSave} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Save</button>
                }
                {!deleteThis && <button onClick={() => setDelete(true)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>}
            </div>
        </div>
    )
}

const Card = ({index, user, userDetails, setUserDetails}) => {
    const {serverUrl} = useMainContext()

    const [edit, setEdit] = React.useState(false)
    const [deleteThis, setDelete] = React.useState(false)
    const handleEdit = () => {
        setEdit(true)
    }

    const handleChange = (field, value) => {
        setUserDetails((prevDetails) => {
            const updatedContacts = [...prevDetails.contacts];
            updatedContacts[index][field] = value
      
            return {
              ...prevDetails,
              contacts: updatedContacts,
            };
        });
    }
    const handleDelete = async() => {
        const dummyData = userDetails
        dummyData.contacts = dummyData.contacts.filter((contact, i) => i !== index)
        console.log(dummyData)
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            contacts: prevDetails.contacts.filter((contact, i) => i !== index),
        }));

        
        const res = await axios.post(`${serverUrl}/register`, dummyData);
        if(res.status == 200){
            console.log('successful')
        }
        setDelete(false)
    }
    const handleSave = async() => {
        const res = await axios.post(`${serverUrl}/register`, userDetails);
        if(res.status == 200){
            console.log('successful')
        }
        setEdit(false)
    }
    return (
        <div key={index} className='family-card'>
            {edit ?
                <input onChange={(e) => handleChange('phoneNumber', e.target.value)} className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full' defaultValue={user.phoneNumber} />
            :
                <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{user.phoneNumber}</h3>
            }
            {edit ?
                <input onChange={(e) => handleChange('name', e.target.value)} className='text-[#3a3a3a] poppins text-center my-5 !font-bold bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3 w-full' defaultValue={user.name} />
            :
                <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>{user.name}</h3>
            }
            <div className='mt-5 button-container'>
                {
                deleteThis ?
                <>
                    <button onClick={() => setDelete(false)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-bl-[15px] w-full'>Cancel</button>
                    <button onClick={handleDelete} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-br-[15px] w-full'>Confirm</button>
                </>
                :
                edit ? 
                    <button onClick={handleSave} className='py-2 bg-green-500 hover:bg-green-800 text-white text-center rounded-bl-[15px] w-full'>Save</button>
                :
                    <button onClick={handleEdit} className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                }
                {!deleteThis && <button onClick={() => setDelete(true)} className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>}
            </div>
        </div>
    )
}

const Family = () => {
    const { userDetails, setUserDetails } = useMainContext()
    const { contacts, handleContactChange, addContact, setContacts } = useSignupContext()
  return (
    <div className='grid my-10'>
        {userDetails && userDetails.contacts && userDetails.contacts.map((user, index) => <Card setUserDetails={setUserDetails} userDetails={userDetails} index={index} user={user} /> )}
        {contacts && contacts.length > 1 && contacts.map((contact, index) => {
            if (index == 0){
                return null
            }
            else {
                return <NewCard userDetails={userDetails} setContacts={setContacts} setUserDetails={setUserDetails} contacts={contacts} handleContactChange={handleContactChange} index={index} />
            }
        })}
        <div onClick={addContact} className='family-card cursor-pointer justify-center items-center'>
            <AddIcon className='add-icon' />
        </div>
    </div>
  )
}

export default Family