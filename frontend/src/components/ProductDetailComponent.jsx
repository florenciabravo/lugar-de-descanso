import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { useFetch } from '../hook/admin/useFetch';
import { ImageGalleryModal } from "./ImageGalleryModal";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { ProductPolicyBlock } from './ProductPolicyBlock';
import { SharePopover } from './SharePopover';
import { ReviewFormComponent } from "./ReviewFormComponent";
import { AuthContext } from "../context/AuthContext";

import '../styles/ProductDetailComponent.css';

export const ProductDetailComponent = () => {
    const { id } = useParams();
    const { data: product, fetchData: fetchProductData } = useFetch();
    const { fetchData: fetchReviewsData } = useFetch();

    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            await fetchProductData(`http://localhost:8080/products/${id}`, "GET");
            setLoading(false);
        };

        const fetchReviews = async () => {
            const res = await fetchReviewsData(`http://localhost:8080/reviews/product/${id}`, "GET");
            setReviews(Array.isArray(res) ? res : []);
        };

        const fetchAverageRating = async () => {
            const res = await fetch(`http://localhost:8080/reviews/product/${id}/average`);
            const avg = await res.json();
            setAverageRating(avg || 0);
        };

        const checkIfUserCanReview = async () => {
            if (user) {
                const reservations = await fetch(`http://localhost:8080/reservations/user/${user.id}`);
                const resJson = await reservations.json();
                const hasPastReservation = resJson.some(r => {
                    return (
                        Number(r.productId) === Number(id) &&
                        new Date(r.checkOutDate) < new Date()
                    );
                });
                setCanReview(hasPastReservation);
            }
        };

        fetchProduct();
        fetchReviews();
        fetchAverageRating();
        checkIfUserCanReview();
    }, [id, user]);

    if (loading) return <p>Cargando...</p>;
    if (!product) return <p>Producto no encontrado.</p>;

    const handleGoBack = () => { navigate('/'); };
    const toggleModal = () => { setIsModalOpen(!isModalOpen); };
    const openShareModal = () => setIsShareModalOpen(true);
    const closeShareModal = () => setIsShareModalOpen(false);

    return (
        <div className="product-detail">
            <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="header-buttons">
                    <button className="back-button" onClick={handleGoBack}>← Volver</button>
                    <button className="share-button" onClick={openShareModal}>Compartir</button>
                </div>
            </div>

            <p className="product-description">{product.description}</p>

            {Array.isArray(product.imageUrls) && product.imageUrls.length > 0 && (
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

            {isModalOpen && (
                <ImageGalleryModal imageUrls={product.imageUrls} onClose={toggleModal} />
            )}

            {isShareModalOpen && (
                <SharePopover product={product} onClose={closeShareModal} />
            )}

            {Array.isArray(product.features) && product.features.length > 0 && (
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

            <section className="availability-section">
                <AvailabilityCalendar productId={id} />
            </section>

            {Array.isArray(product.policies) && product.policies.length > 0 && (
                <ProductPolicyBlock policies={product.policies} />
            )}

            {/* Sección de valoraciones */}
            {canReview && (
                <ReviewFormComponent
                    productId={id}
                    userId={user.id}
                    onReviewAdded={(newReview) => {
                        fetchReviewsData(`http://localhost:8080/reviews/product/${id}`, "GET")
                            .then((res) => setReviews(Array.isArray(res) ? res : []));
                        fetch(`http://localhost:8080/reviews/product/${id}/average`)
                            .then(res => res.json())
                            .then(avg => setAverageRating(avg ?? 0));
                    }}
                />
            )}

            <section className="reviews-section">
                <h3>Valoraciones</h3>
                <p>Promedio: {Number(averageRating).toFixed(1)} ⭐️</p>

                {reviews.length === 0 ? (
                    <p>No hay valoraciones aún.</p>
                ) : (
                    <ul className="reviews-list">
                        {reviews.map((review) => (
                            <li key={review.id}>
                                <strong>{review.userFirstname} {review.userLastname}:</strong> {review.rating} ⭐️
                                <br />
                                {review.comment}
                                <br />
                                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

        </div>
    );
};