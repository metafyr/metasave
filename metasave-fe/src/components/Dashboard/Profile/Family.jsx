import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import '../../../styles/Family.css'

const Family = () => {
  return (
    <div className='grid my-10'>
        <div className='family-card'>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 !font-bold'>+91 42042 04200</h3>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>Alosh Denny</h3>
            <div className='mt-5'>
                <button className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                <button className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>
            </div>
        </div>
        <div className='family-card'>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 !font-bold'>+91 42042 04200</h3>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>Alosh Denny</h3>
            <div className='mt-5'>
                <button className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                <button className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>
            </div>
        </div>
        <div className='family-card cursor-pointer justify-center items-center'>
            <AddIcon className='add-icon' />
        </div>
    </div>
  )
}

export default Family