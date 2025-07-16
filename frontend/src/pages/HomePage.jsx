import { useRef, useState, useContext, useEffect } from "react";
import { SeachBarComponent } from "../components/SeachBarComponent"
import { CategoryFilterBar } from "../components/CategoryFilterBar"
import { CategoryBarComponent } from "../components/CategoryBarComponent"
import { RecommendationBarComponent } from "../components/RecommendationBarComponent"
import { RandomProductContext } from "../context/RandomProductContext";
import { useFetch } from "../hook/admin/useFetch";

export const HomePage = () => {
    //productos aleatorios originales
    const { products } = useContext(RandomProductContext);
    const [searchResults, setSearchResults] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const { fetchData } = useFetch();

    // Actualiza el filtrado base si cambian los productos
    useEffect(() => {
        if (!searchPerformed) {
            setFilteredProducts(products);
        }
    }, [products, searchPerformed]);

    const handleSearch = ({ destination, checkIn, checkOut }) => {
        setSearchPerformed(true);

        const cityParam = destination || '';

        const params = new URLSearchParams();
        params.append('city', cityParam);

        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);

        const url = `http://localhost:8080/products/search?${params.toString()}`;

        fetchData( url,
            "GET"
        ).then(data => {
            if (Array.isArray(data)) {
                setSearchResults(data);
                setFilteredProducts(data);
            } else {
                setSearchResults([]);
                setFilteredProducts([]);
            }
        });
    };

    const searchBarRef = useRef();

    const handleResetSearch = () => {
        setSearchPerformed(false);
        setSearchResults([]);
        setFilteredProducts(products);
        if (searchBarRef.current) {
            searchBarRef.current.reset();
        }
    };

    // De dónde viene la base para filtrar?
    const baseProducts = searchPerformed ? searchResults : products;

    return (
        <div className="home-page">
            <SeachBarComponent ref={searchBarRef} onSearch={handleSearch} />

            {searchPerformed && filteredProducts.length === 0 && (
                <div className="no-results-container">
                    <p className="no-results-text">
                        No se encontraron productos disponibles para la búsqueda seleccionada.
                    </p>
                    <button
                        className="button-reset"
                        onClick={handleResetSearch}
                    >
                        Ver todos los productos
                    </button>
                </div>
            )}

            <CategoryFilterBar
                baseProducts={baseProducts}
                filteredProducts={filteredProducts}
                setFilteredProducts={setFilteredProducts}
            />
            <CategoryBarComponent products={filteredProducts} />
            <RecommendationBarComponent />
        </div>
    )
}
