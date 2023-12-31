import React from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';

const Vitals = () => {
  return (
    
    <div className='my-10 grid grid-cols-1 md:grid-cols-4 gap-5'>
        <div className='col-span-1 md:col-span-3'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='bg-[#FFEBFC] rounded-[15px] px-5 py-5 flex flex-col'>
                    <h1 className='text-[#3a3a3a] text-xl font-semibold poppins'>Body Weight</h1>
                    <div className='flex mt-10 items-baseline'>
                        <span className='poppins text-7xl'>72</span>
                        <span className='poppins font-medium text-xl'>kg</span>
                    </div>
                </div>
                <div className='bg-[#E27396] rounded-[15px] px-5 py-5 flex flex-col'>
                    <h1 className='text-white text-xl font-semibold poppins'>Body Mass Index</h1>
                    <div className='flex mt-10 items-baseline'>
                        <span className='poppins text-7xl text-white'>31</span>
                    </div>
                </div>
                <div className='bg-[#FFEBFC] rounded-[15px] px-5 py-5 flex flex-col'>
                    <h1 className='text-[#3a3a3a] text-xl font-semibold poppins'>Pulse Rate</h1>
                    <div className='flex mt-10 items-baseline'>
                        <span className='poppins text-7xl'>69</span>
                    </div>
                </div>
                <div className='md:col-span-2 bg-[#FFEBFC] rounded-[15px] px-5 py-5 flex justify-between'>
                    <div className='flex flex-col justify-between'>
                        <h1 className='text-[#3a3a3a] text-xl font-semibold poppins'>Blood Glucose Level</h1>
                        <TimelineIcon className='text-[#3a3a3a] !text-9xl' />
                    </div>
                    <div className='flex mt-auto items-baseline'>
                        <span className='poppins text-7xl'>70</span>
                        <span className='poppins font-medium text-2xl'>mg/dL</span>
                    </div>
                </div>
                <div className='bg-[#FFEBFC] rounded-[15px] px-5 py-5 flex flex-col'>
                    <h1 className='text-[#3a3a3a] text-xl font-semibold poppins'>Body Temperature</h1>
                    <div className='flex mt-10 items-baseline'>
                        <span className='poppins text-7xl'>36.9°</span>
                        <span className='poppins font-medium text-4xl'>c</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='bg-[#EAF2D7] rounded-[15px] px-5 py-10 flex flex-col justify-between'>
            <h1 className='text-[#3a3a3a] text-xl font-semibold poppins'>Sugar Level</h1>
            <div className='flex mt-10 items-baseline'>
                <span className='poppins text-7xl'>90</span>
                <span className='poppins font-medium text-4xl'>mg/dL</span>
            </div>
        </div>
    </div>
  )
}

export default Vitals;
