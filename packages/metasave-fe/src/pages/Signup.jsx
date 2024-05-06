import React, { useState } from 'react';
import LeftSide from '../components/Register/LeftSide';
import RightSide1 from '../components/Register/RightSide1';
import RightSide2 from '../components/Register/RightSide2';
import RightSide3 from '../components/Register/RightSide3';

const SignupContext = React.createContext();

export const SignupProvider = ({ children }) => {

  // Step 1 inputs 
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [confirmpass, setConfirmPass] = useState('')
  const [error, setError] = useState({status: false, message: ''})
  // Step 1 inputs 


  // Step 2 inputs 
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [contacts, setContacts] = useState([{ name: '', phoneNumber: '' }]);
  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phoneNumber: '' }]);
    }
  }
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };
  // Step 2 inputs 


  // Step 3 inputs 
  const [disease, setDisease] = useState('');
  const [duration, setDuration] = useState('');
  const [medications, setMedications] = useState(['']);
  const [problemsFaced, setProblemsFaced] = useState(['']);
  const addMedication = () => {
    setMedications([...medications, '']);
  };
  const removeMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };
  const addProblemFaced = () => {
    setProblemsFaced([...problemsFaced, '']);
  };
  const removeProblemFaced = (index) => {
    const updatedProblemsFaced = [...problemsFaced];
    updatedProblemsFaced.splice(index, 1);
    setProblemsFaced(updatedProblemsFaced);
  };
  // Step 3 inputs 



  return (
    <SignupContext.Provider value={{ 
      email, 
      password,
      confirmpass,
      error,
      name,
      age,
      gender,
      phone,
      address,
      contacts,
      disease,
      duration,
      medications,
      problemsFaced,
      setMedications,
      addMedication,
      setDisease,
      setDuration,
      addProblemFaced,
      removeProblemFaced,
      removeMedication,
      setProblemsFaced,
      setContacts,
      setAddress,
      addContact,
      handleContactChange,
      setGender,
      setPhone,
      setAge,
      setName,
      setError,
      setPass,
      setConfirmPass,
      setEmail 
    }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignupContext = () => React.useContext(SignupContext);

const Signup = () => {
  const [step, setStep] = useState(2);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div
      className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400 via-pink-200 to-sky-300 min-h-screen h-full flex justify-center items-center'>
      <div className='md:px-16 px-8 py-16 w-full grid md:grid-cols-2 justify-center items-center' >
        <LeftSide />
        <div className=''>
          {/* <SignupProvider> */}
            {step === 1 && <RightSide1 onNext={handleNext} />}
            {step === 2 && <RightSide2 onNext={handleNext} onPrev={handlePrev} />}
            {step === 3 && <RightSide3 onPrev={handlePrev} />}
          {/* </SignupProvider> */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
