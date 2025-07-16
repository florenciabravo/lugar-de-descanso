import React, { useState, useEffect } from 'react';
import '../styles/ShareProductModal.css';

export const ShareProductModal = ({ product, isOpen, onClose }) => {
    const [customMessage, setCustomMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const message = encodeURIComponent(customMessage || product.description);

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${message}&url=${shareUrl}`;
    const instagramMessage = `${customMessage || product.description} - ${shareUrl}`;

    return (
        <div className="share-modal-overlay">
            <div className="share-modal-wrapper">
                <div className="share-modal-content">
                    <h2>Compartir este producto</h2>
                    <img src={product.imageUrl} alt={product.title} className="share-product-image" />
                    <p>{product.description}</p>
                    <textarea
                        className="share-textarea"
                        placeholder="Agrega un mensaje personalizado"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                    />
                    <div className="share-buttons">
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(instagramMessage);
                                alert("Mensaje copiado. Pega en Instagram.");
                            }}
                        >
                            Instagram (copiar mensaje)
                        </button>
                    </div>
                    <button className="share-close-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
