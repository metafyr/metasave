import '../../styles/ImagePopup.css'; // Adjust the path as needed

const FallPopup = ({ onClose }) => {
  return (
    <div className='image-popup-overlay'>
      <div className='image-popup-container'>
        {/* <video loop autoPlay>
          <source src="/fall.mp4" alt={alt || 'Image'} className='image-popup-image' />
        </video> */}
        {/* <img src={`${PINATA_BASE_URL}/ipfs/${src}`} alt='Image' className='image-popup-image' /> */}
        
        <p className='text-center font-bold'>User fall detected!</p>
        <button 
          onClick={onClose} 
          className='image-popup-close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default FallPopup;
