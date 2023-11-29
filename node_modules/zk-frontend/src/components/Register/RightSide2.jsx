import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RightSide2 = ({ onNext, onPrev }) => {
  const [contacts, setContacts] = useState([{ name: '', phoneNumber: '' }]);

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phoneNumber: '' }]);
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  return (
    <div className='glass-effect rounded-tr-[15px] rounded-br-[15px] md:rounded-tl-[0px] md:rounded-bl-[0px] rounded-tl-[15px] rounded-bl-[15px] h-full w-full py-10 px-10 flex flex-col justify-between'>
      <div>
        <h1 className='text-center text-[#D01987] poppins font-medium text-2xl'>Register</h1>
        <h1 className='text-center  poppins'>Step 2 of 3</h1>
        {/* Add additional form fields for step 2 */}
        <div className='my-10'>
          {/* ... (previous form fields) */}
          <div className='mb-5'>
            <label className='text-[#505050] poppins'>Name</label>
            <input
              type="text"
              name=""
              className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              id=""
            />
          </div>
          <div className='flex justify-between'>
            <div className='mb-5 flex-1'>
              <label className='text-[#505050] poppins'>Age</label>
              <input
                type="number"
                name="age"
                className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
                id="age"
              />
            </div>
            <div className='mb-5 flex-1 ml-4'>
              <label className='text-[#505050] poppins'>Gender</label>
              <select
                name="gender"
                className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
                id="gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className='mb-5 flex-1 ml-4'>
              <label className='text-[#505050] poppins'>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
                id="phoneNumber"
              />
            </div>
          </div>
          <div className='mb-5'>
            <label className='text-[#505050] poppins'>Address</label>
            <input
              type="text"
              name="addressLine1"
              className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
              id="addressLine1"
            />
          </div>
         
          {/* Contacts */}
          {contacts.map((contact, index) => (
            <div key={index} className='flex justify-between mb-5'>
              <div className='flex-1 mr-4'>
                <label className='text-[#505050] poppins'>Contact Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
                />
              </div>
              <div className='flex-1'>
                <label className='text-[#505050] poppins'>Phone Number</label>
                <input
                  type="tel"
                  value={contact.phoneNumber}
                  onChange={(e) => handleContactChange(index, 'phoneNumber', e.target.value)}
                  className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out'
                />
              </div>
            </div>
          ))}
          {contacts.length < 3 && (
            <button
              onClick={addContact}
              className='bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
            >
              + Add Contact
            </button>
          )}
        </div>
      </div>
      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
        >
          Previous
        </button>
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

export default RightSide2;
