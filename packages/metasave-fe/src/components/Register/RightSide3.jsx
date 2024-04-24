import React, { useState } from 'react';
import { useSignupContext } from '../../pages/Signup';
import axios from 'axios'
import { abi } from '../../abi';
import { addresses } from '../../constants/addresses.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useMainContext } from '../../context/MainContext.jsx';
import {encodeFunctionData} from 'viem'


const RightSide3 = ({ onPrev }) => {
  const { medications, setMedications, disease, setDisease, duration, setDuration, problemsFaced, setProblemsFaced, addProblemFaced, removeProblemFaced, removeMedication, addMedication, name, password, age, email, gender, phone, address, contacts } = useSignupContext()

  const { serverUrl, insertUserDetails } = useMainContext()

  const { CFAddress, AAProvider } = useAuthContext()
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    console.log(AAProvider)
  }, [])

  const handleFinish = async() => {
    const data = {
      CF: CFAddress,
      name,
      email,
      age,
      gender,
      phone,
      medications,
      address,
      contacts,
      disease,
      duration
    }

    // const data = {
    //   CF: CFAddress,
    //   name: 'Abhinav C V',
    //   age: 20,
    //   gender: 'Male',
    //   phone: "+919778393558",
    //   medications: "none",
    //   address: "dubai",
    //   contacts: "none",
    //   disease: "none",
    //   duration: "none"
    // }

    console.log(data)

    const res = await insertUserDetails(AAProvider, CFAddress, data)
    if(res){
      window.location.replace('/dashboard')
    }
  }
  return (
    <div className='glass-effect rounded-tr-[15px] rounded-br-[15px] md:rounded-tl-[0px] md:rounded-bl-[0px] rounded-tl-[15px] rounded-bl-[15px] h-full w-full py-10 px-10 flex flex-col justify-between'>
      <div>
        <h1 className='text-center text-[#D01987] poppins font-medium text-2xl'>Register</h1>
        <h1 className='text-center  poppins'>Step 3 of 3</h1>
        {/* Disease Name */}
        <div className='mb-5'>
          <label className='text-[#505050] poppins'>Disease Name</label>
          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
          />
          <label className='text-[#505050] poppins'>Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
          />
        </div>
        {/* Medications */}
        <div className='mb-5'>
          <label className='text-[#505050] poppins'>Medications</label>
          {medications.map((medication, index) => (
            <div key={index} className='flex justify-between mb-3'>
              <input
                type="text"
                value={medication}
                onChange={(e) => {
                  const updatedMedications = [...medications];
                  updatedMedications[index] = e.target.value;
                  setMedications(updatedMedications);
                }}
                className='mt-3 mr-4 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              />
              {index === medications.length - 1 && (
                <button
                  onClick={addMedication}
                  className='bg-[#75ACFF] text-[#EFEFEF] text-center px-2 py-2 mt-3 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
                >
                  +
                </button>
              )}
              {index < medications.length - 1 && (
                <button
                  onClick={() => removeMedication(index)}
                  className='bg-[#FF6B6B] text-[#EFEFEF] text-center px-2 py-2 mt-3 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Problems Faced */}
        <div className='mb-5'>
          <label className='text-[#505050] poppins'>Problems Faced</label>
          {problemsFaced.map((problem, index) => (
            <div key={index} className='flex justify-between mb-3'>
              <input
                type="text"
                value={problem}
                onChange={(e) => {
                  const updatedProblemsFaced = [...problemsFaced];
                  updatedProblemsFaced[index] = e.target.value;
                  setProblemsFaced(updatedProblemsFaced);
                }}
                className='mt-3 mr-4 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              />
              {index === problemsFaced.length - 1 && (
                <button
                  onClick={addProblemFaced}
                  className='bg-[#75ACFF] text-[#EFEFEF] text-center px-2 py-2 mt-3
                  rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
                >
                  +
                </button>
              )}
              {index < problemsFaced.length - 1 && (
                <button
                  onClick={() => removeProblemFaced(index)}
                  className='bg-[#FF6B6B] text-[#EFEFEF] text-center px-2 py-2 mt-3 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
        >
          Previous
        </button>
        {/* <Link to='/'> */}
          <button
            onClick={handleFinish}
            className={`bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Finishing...' : 'Finish'}
          </button>
        {/* </Link> */}

        </div>
        </div>
    );
};

export default RightSide3;


