import React from 'react';
import Personal from './Profile/Personal';
import Family from './Profile/Family';
import Vitals from './Profile/Vitals';

const Profile = () => {
  const [slide, setSlide] = React.useState('personal');
  

  return (
    <div className='px-5 py-5'>
      <div className='bg-[#FFEBFC] rounded-[25px]'>
        <div className='flex flex-col md:flex-row justify-center text-center md:justify-between'>
          <h1
            onClick={() => setSlide('personal')}
            className={`poppins font-semibold px-8 py-3 hover:bg-[#3a3a3a] cursor-pointer rounded-[25px] hover:text-white mb-2 md:mb-0 ${
              slide === 'personal' ? 'bg-[#3a3a3a] text-white' : 'text-[#3a3a3a]'
            }`}
          >
            Personal Info
          </h1>
          <h1
            onClick={() => setSlide('family')}
            className={`poppins font-semibold px-8 py-3 hover:bg-[#3a3a3a] cursor-pointer rounded-[25px] hover:text-white mb-2 md:mb-0 ${
              slide === 'family' ? 'bg-[#3a3a3a] text-white' : 'text-[#3a3a3a]'
            }`}
          >
            Family
          </h1>
          <h1
            onClick={() => setSlide('vitals')}
            className={`poppins font-semibold px-8 py-3 hover:bg-[#3a3a3a] cursor-pointer rounded-[25px] hover:text-white mb-2 md:mb-0 ${
              slide === 'vitals' ? 'bg-[#3a3a3a] text-white' : 'text-[#3a3a3a]'
            }`}
          >
            Vitals
          </h1>
        </div>
      </div>
      {slide === 'personal' ? <Personal /> : slide === 'family' ? <Family /> : <Vitals />}
    </div>
  );
};

export default Profile;
