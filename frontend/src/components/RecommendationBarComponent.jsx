import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hook/admin/useFetch";
import '../styles/RecommendationBarComponent.css'

export const RecommendationBarComponent = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const { fetchData } = useFetch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            const data = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/products`, "GET");

            if (Array.isArray(data)) {
                setRecommendedProducts(data);
            }
        };

        fetchRecommendedProducts();
    }, []);

    const handleClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="recommendation-section">
            <h5>Recomendaciones</h5>
            <div className="recommendation-carousel">
                {recommendedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="recommendation-card"
                        onClick={() => handleClick(product.id)}
                    >
                        <img src={`${import.meta.env.VITE_BACKEND_URL}${product.imageUrls[0]}`} alt="Imagen Principal" />
                        <div className="recommendation-info">
                            <h6>{product.name}</h6>
                            <p>{product.city?.name}</p>
                            <p className="rating">⭐ {product.averageRating?.toFixed(1)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
