import React from 'react'
import "../styles/ImageGalleryModal.css"; 

export const ImageGalleryModal = ({ imageUrls, onClose }) => {
  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="image-grid">
                {imageUrls.map((image, index) => (
                    <img key={index} src={`http://localhost:8080/${image}`} alt={`Imagen ${index + 1}`} />
                ))}
            </div>
        </div>
    </div>
  );
};
