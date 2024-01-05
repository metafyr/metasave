import React from 'react';
import '../../styles/ImagePopup.css'; // Adjust the path as needed

const ImagePopup = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div className='image-popup-overlay'>
      <div className='image-popup-container'>
        <img src={src} alt={alt || 'Image'} className='image-popup-image' />
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
