import React from 'react'
import AddIcon from '@mui/icons-material/Add';

const Family = () => {
  return (
    <div className='grid grid-cols-3 gap-10 my-10'>
        <div className='bg-[#B3DEE2] pt-5 flex flex-col justify-center rounded-[15px]'>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 !font-bold'>+91 42042 04200</h3>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>Alosh Denny</h3>
            <div className='flex mt-5'>
                <button className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                <button className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>
            </div>
        </div>
        <div className='bg-[#B3DEE2] pt-5 flex flex-col justify-center rounded-[15px]'>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 !font-bold'>+91 42042 04200</h3>
            <h3 className='text-[#3a3a3a] poppins text-center my-5 font-semibold'>Alosh Denny</h3>
            <div className='flex mt-5'>
                <button className='py-2 bg-[#3A3A3A] hover:bg-[#252525] text-white text-center rounded-bl-[15px] w-full'>Edit</button>
                <button className='py-2 bg-[#CE576D] hover:bg-[#a92b42] text-white text-center rounded-br-[15px] w-full'>Delete</button>
            </div>
        </div>
        <div className='bg-[#B3DEE2] flex cursor-pointer justify-center align-center w-full items-center rounded-[15px]'>
            <AddIcon className='text-[#3a3a3a] !text-6xl' />
        </div>
    </div>
  )
}

export default Family