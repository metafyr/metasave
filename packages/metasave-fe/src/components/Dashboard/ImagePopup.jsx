import React from 'react';
import '../../styles/ImagePopup.css'; // Adjust the path as needed

const PINATA_BASE_URL = import.meta.env.VITE_PINATA_BASE_URL

const ImagePopup = ({ src, alt, onClose }) => {
  if (!src) return null;
  return (
    <div className='image-popup-overlay'>
      <div className='image-popup-container'>
        {/* <video loop autoPlay>
          <source src="/fall.mp4" alt={alt || 'Image'} className='image-popup-image' />
        </video> */}
        <img src={`${PINATA_BASE_URL}/ipfs/${src}`} alt='Image' className='image-popup-image' />
        <button 
          onClick={onClose} 
          className='image-popup-close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;
