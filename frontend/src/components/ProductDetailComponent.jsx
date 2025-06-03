import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { useFetch } from '../hook/admin/useFetch';
import { ImageGalleryModal } from "./ImageGalleryModal";
import { RandomProductContext } from "../context/RandomProductContext";
import '../styles/ProductDetailComponent.css';

export const ProductDetailComponent = () => {
    const { id } = useParams();
    const { data: product, fetchData } = useFetch();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { products } = useContext(RandomProductContext);

    useEffect(() => {
        const fetchProduct = async () => {
            await fetchData(`http://localhost:8080/products/${id}`, "GET");
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading || !product) {
        return <p>Cargando producto...</p>;
    }

    const handleGoBack = () => {
        navigate('/'); // Navega de vuelta a la página principal
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="product-detail">
            <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <button className="back-button" onClick={handleGoBack}>← Volver</button>
            </div>

            <p className="product-description">{product.description}</p>

            {product.imageUrls.length >= 5 && (
                <>
                    <div className="image-gallery">
                        <div className="main-image">
                            <img src={`http://localhost:8080${product.imageUrls[0]}`} alt="Imagen Principal" />
                        </div>
                        <div className="grid-images">
                            {product.imageUrls.slice(1, 5).map((image, index) => (
                                <img key={index} src={`http://localhost:8080${image}`} alt={`Imagen ${index + 2}`} />
                            ))}
                        </div>
                    </div>
                    <div className="view-more-container">
                        <button className="view-more" onClick={toggleModal}>Ver mas</button>
                    </div>
                </>
            )}
            {isModalOpen && <ImageGalleryModal imageUrls={product.imageUrls} onClose={toggleModal} />}

            {product.features && product.features.length > 0 && (
                <div className="product-features">
                    <h2 className="features-title">Características</h2>
                    <ul className="features-list">
                        {product.features.map((feature) => (
                            <li key={feature.id} className="feature-item">
                                <img
                                    src={`http://localhost:8080${feature.iconUrl}`}
                                    alt={feature.name}
                                    className="feature-icon"
                                />
                                <span>{feature.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};