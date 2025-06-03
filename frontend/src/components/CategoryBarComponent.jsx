import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCounter } from "../hook/useCounter";
import '../styles/CategoryBarComponent.css';

export const CategoryBarComponent = ({ products }) => {
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const storedPage = Number(sessionStorage.getItem("currentPage")) || 1;
    const { currentPage, nextPage, prevPage, resetPage, setCurrentPage } = useCounter(storedPage, totalPages);

    useEffect(() => {
        sessionStorage.setItem("currentPage", currentPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedProducts(products.slice(start, end));
        setTotalPages(Math.max(1, Math.ceil(products.length / itemsPerPage)));
    }, [products, currentPage]);

    return (
        <div className='category-section'>
            <h5>Buscar por tipo de alojamiento</h5>

            <div className="product-grid">
                {paginatedProducts.map((product, index) => (
                    <div key={product.id || `product-${index}`} className="product-card">
                        <Link to={`/product/${product.id}`}>
                            <img
                                src={`http://localhost:8080${product.imageUrls[0]}`}
                                alt={product.name}
                                className="product-image"
                            />
                        </Link>
                        <h3 className="product-name">{product.name}</h3>
                        <p>{product.description}</p>
                    </div>
                ))}
            </div>

            {/* Controles de paginación */}
            <div className="pagination">
                <button onClick={resetPage} disabled={currentPage === 1}>Inicio</button>
                <button onClick={prevPage} disabled={currentPage === 1}>← Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente →</button>
            </div>
        </div>
    );
};
