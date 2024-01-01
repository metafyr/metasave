import React,{useState} from 'react';
import dashImg from '../../assets/dashboardRight.svg';
import ImagePopup from './ImagePopup';

const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const openPopup = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className='px-5 py-5'>
      <div className='md:flex justify-between rounded-[15px] bg-[#FFEBFC] px-5 py-2'>
        <div className='md:w-1/2 flex flex-col'>
          <h1 className='text-[#3a3a3a] text-4xl font-bold my-3 md:my-5'>Appolo Hospital</h1>
          <h3 className='text-[#3a3a3a] text-xl md:text-3xl font-semibold my-3 md:my-5'>
            Angamaly, Ernakulam
          </h3>
          <h4 className='text-[#3a3a3a] text-base md:text-xl font-medium my-3 md:my-5'>
            Available doctors: <span>32</span>
          </h4>
        </div>
        <img src={dashImg} alt='doctor image' className='md:w-1/3' />
      </div>
      <div className='my-10'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <h1 className='poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0 font-bold'>
            Fall History
          </h1>
          <input
            type='date'
            name=''
            id=''
            value='2023-11-30'
            className='poppins text-base md:text-2xl font-bold text-[#3a3a3a] focus:outline-none'
          />
        </div>
        <div className='my-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
            <div className='flex flex-col mb-3 md:mb-20'>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                3:12 AM
              </h3>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                Minor Fall
              </h3>
            </div>
            <h3 
              className='ml-auto text-[#505050] md:text-xl text-base cursor-pointer'
              onClick={() => openPopup(dashImg)} 
            >
              <u>VIEW IMAGE</u>
            </h3>
          </div>
          <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
            <div className='flex flex-col mb-3 md:mb-20'>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                4:52 AM
              </h3>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                Minor Fall
              </h3>
            </div>
            <h3 
              className='ml-auto text-[#505050] md:text-xl text-base cursor-pointer'
              onClick={() => openPopup(dashImg)} 
            >
              <u>VIEW IMAGE</u>
            </h3>
          </div>
          <div className='rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between'>
            <div className='flex flex-col mb-3 md:mb-20'>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                3:12 AM
              </h3>
              <h3 className='text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl'>
                Minor Fall
              </h3>
            </div>
            <h3 
              className='ml-auto text-[#505050] md:text-xl text-base cursor-pointer'
              onClick={() => openPopup(dashImg)} 
            >
              <u>VIEW IMAGE</u>
            </h3>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <ImagePopup 
          src={currentImage} 
          alt='Dashboard Image' 
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Dashboard;
