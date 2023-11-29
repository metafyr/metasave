import React from 'react';

const RightSide1 = ({ onNext }) => {
    return (
    <div className='glass-effect rounded-tr-[15px] rounded-br-[15px] md:rounded-tl-[0px] md:rounded-bl-[0px] rounded-tl-[15px] rounded-bl-[15px] h-full w-full py-10 px-10 flex flex-col justify-between'>
      <div>
        <h1 className='text-center text-[#D01987] poppins font-medium text-2xl'>Register</h1>
        <h1 className='text-center  poppins'>Step 1 of 3</h1>
        <div className='my-10'>
          <div className='mb-5'>
            <label className='text-[#505050] poppins'>Email</label>
            <input
              type="text"
              name=""
              className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              id=""
            />
          </div>
          <div className='mb-5'>
            <label className='text-[#505050] poppins'>Password</label>
            <input
              type="password"
              name=""
              className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              id=""
            />
          </div>
          <div className='mb-5'>
            <label className='text-[#505050] poppins'>Confirm Password</label>
            <input
              type="password"
              name=""
              className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              id=""
            />
          </div>
        </div>
      </div>
      <div className='text-center'>
      <button
          onClick={onNext}
          className='bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
        >
            Next
          </button>
      </div>
    </div>
  );
};

export default RightSide1;
