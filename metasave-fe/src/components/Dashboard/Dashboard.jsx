import React from 'react'
import dashImg from '../../assets/dashboardRight.png'

const Dashboard = () => {
  return (
    <div className='px-5 py-5'>
        <div className='rounded-[15px] bg-[#FFEBFC] px-16 py-5 flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-[#3a3a3a] text-4xl font-bold my-5'>Appolo Hospital</h1>
                <h3 className='text-[#3a3a3a] text-3xl font-semibold my-5'>Angamaly, Ernakulam</h3>
                <h4 className='text-[#3a3a3a] text-xl font-medium my-5'>Available doctors: <span>32</span></h4>
            </div>
            <img src={dashImg} alt="doctor image" />
        </div>
        <div className='my-10'>
            <div className='flex justify-between items-center'>
                <h1 className='poppins text-[#3a3a3a] text-3xl mb-5 font-bold'>Fall History</h1>
                <input type="date" name="" id="" value='2023-11-30' className='poppins text-2xl font-bold text-[#3a3a3a] focus:!outline-none' />
            </div>
            <div className='my-10 grid grid-cols-3 gap-5'>
                <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
                    <div className='flex flex-col mb-20'>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>3:12 AM</h3>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>Minor Fall</h3>
                    </div>
                    <h3 className='ml-auto text-[#505050] text-xl'><u>VIEW IMAGE</u></h3>
                </div>
                <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
                    <div className='flex flex-col mb-20'>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>3:12 AM</h3>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>Minor Fall</h3>
                    </div>
                    <h3 className='ml-auto text-[#505050] text-xl'><u>VIEW IMAGE</u></h3>
                </div>
                <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
                    <div className='flex flex-col mb-20'>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>3:12 AM</h3>
                        <h3 className='text-[#3a3a3a] poppins font-semibold my-3 text-xl'>Minor Fall</h3>
                    </div>
                    <h3 className='ml-auto text-[#505050] text-xl'><u>VIEW IMAGE</u></h3>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard