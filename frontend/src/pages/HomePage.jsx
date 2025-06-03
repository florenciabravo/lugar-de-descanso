import { useState, useContext, useEffect } from "react";
import { SeachBarComponent } from "../components/SeachBarComponent"
import { CategoryFilterBar } from "../components/CategoryFilterBar"
import { CategoryBarComponent } from "../components/CategoryBarComponent"
import { RecommendationBarComponent } from "../components/RecommendationBarComponent"
import { RandomProductContext } from "../context/RandomProductContext";

export const HomePage = () => {
    //productos aleatorios originales
    const { products } = useContext(RandomProductContext);
    const [filteredProducts, setFilteredProducts] = useState(products);

    //si los productos aleatorios cambian (al recargar), se actualiza el filtrado
    useEffect(() => {
        const storedFilters = sessionStorage.getItem("selectedCategories");

        if (storedFilters) {
            const selectedCategories = JSON.parse(storedFilters);

            if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
                const filtered = products.filter(product =>
                    selectedCategories.includes(product.category?.title)
                );
                setFilteredProducts(filtered);
            } else {
                setFilteredProducts(products);
            }
        } else {
            setFilteredProducts(products);
        }
    }, [products])

    return (
        <div className="home-page">
            <SeachBarComponent />
            <CategoryFilterBar 
                originalProducts={products}
                setFilteredProducts={setFilteredProducts}
            />
            <CategoryBarComponent products={filteredProducts} />
            <RecommendationBarComponent />
        </div>
    )
}
