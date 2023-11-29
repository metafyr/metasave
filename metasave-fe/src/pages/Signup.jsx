import React, { useState } from 'react';
import LeftSide from '../components/Register/LeftSide';
import RightSide1 from '../components/Register/RightSide1';
import RightSide2 from '../components/Register/RightSide2';
import RightSide3 from '../components/Register/RightSide3';

const Signup = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div
      className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400 via-pink-200 to-sky-300 min-h-screen h-full flex justify-center items-center'>
      <div className='md:px-16 px-8 py-16 w-full max-h-full overflow-y-auto grid md:grid-cols-2 justify-center items-center' style={{ height: '650px', width: '1200px' }}>
        <LeftSide />
        <div className='max-h-full
         overflow-y-auto'>
          {step === 1 && <RightSide1 onNext={handleNext} />}
          {step === 2 && <RightSide2 onNext={handleNext} onPrev={handlePrev} />}
          {step === 3 && <RightSide3 onPrev={handlePrev} />}
        </div>
      </div>
    </div>
  );
};

export default Signup;
