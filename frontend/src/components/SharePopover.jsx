import React, { useState } from 'react';
import '../styles/SharePopover.css';

export const SharePopover = ({ product, onClose }) => {
    const [customMessage, setCustomMessage] = useState('');

    if (!product) return null;

    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const imageUrl = `http://localhost:8080${product.imageUrls?.[0] || ''}`;
    const message = encodeURIComponent(customMessage || product.description);

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${message}&url=${shareUrl}`;

    // Acción para usar la API de compartir nativa (en móviles)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: customMessage || product.description,
                    url: shareUrl,
                });
            } catch (err) {
                alert('Compartir cancelado.');
            }
        } else {
            alert('Tu navegador no soporta compartir nativo.');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${customMessage || product.description} - ${shareUrl}`);
        alert('Enlace copiado.');
    };

    return (
        <div className="popover-backdrop" onClick={onClose}>
            <div className="popover" onClick={(e) => e.stopPropagation()}>
                <h4 className="popover-title">Compartir este producto</h4>

                <div className="popover-header">
                    <img src={imageUrl} alt={product.name} className="popover-img" />
                    <p className="popover-description">{product.description}</p>
                </div>

                <textarea
                    placeholder="Agrega un mensaje personalizado"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                />

                <button onClick={handleNativeShare}>Compartir desde el teléfono</button>

                <div className="popover-icons">
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="popover-icon-link">
                        <i className="ri-facebook-circle-fill"></i> 
                    </a>
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="popover-icon-link">
                        <i className="ri-twitter-x-fill"></i> 
                    </a>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${customMessage || product.description} - ${shareUrl}`);
                            alert('Enlace copiado con mensaje.');
                        }}
                        className="popover-icon-link"
                    >
                        <i className="ri-link"></i> Copiar Enlace
                    </button>
                </div>

                <button className="popover-close" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};
