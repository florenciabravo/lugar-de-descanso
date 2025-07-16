import { useEffect, useState } from "react";
import { useFetch } from "../hook/admin/useFetch";
import "../styles/CategoryFilterBar.css";

export const CategoryFilterBar = ({ baseProducts, filteredProducts, setFilteredProducts }) => {

    const { fetchData } = useFetch();

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const categoryData = await fetchData("http://localhost:8080/categories", "GET");
            if (Array.isArray(categoryData)) {
                setCategories(categoryData);
            }

            //Recuperar filtros desde sessionStorage
            const storedFilters = sessionStorage.getItem("selectedCategories");
            if (storedFilters) {
                const parsed = JSON.parse(storedFilters);
                if (Array.isArray(parsed)) setSelectedCategories(parsed);
            }
        };
        loadCategories();
    }, []);

    // Filtrar productos por categorías seleccionadas
    useEffect(() => {
        sessionStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));

        if (selectedCategories.length === 0) {
            setFilteredProducts(baseProducts);
        } else {
            const filtered = baseProducts.filter(product =>
                selectedCategories.includes(product.categoryTitle)
            );
            setFilteredProducts(filtered);
        }
    }, [selectedCategories, baseProducts, setFilteredProducts]);

    const handleToggleCategory = (categoryTitle) => {
        setSelectedCategories(prev =>
            prev.includes(categoryTitle)
                ? prev.filter(cat => cat !== categoryTitle)
                : [...prev, categoryTitle]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        sessionStorage.removeItem("selectedCategories");
    };

    return (
        <div className="filter-bar">
            <div className="category-buttons-container">
                <div className="category-buttons">
                    {categories.map(cat => (
                        <label key={cat.id} className={`category-button ${selectedCategories.includes(cat.title) ? 'active' : ''}`}>

                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat.title)}
                                onChange={() => handleToggleCategory(cat.title)}
                            />

                            <div className="category-content">
                                <img src={`http://localhost:8080${cat.imageUrl}`} alt={cat.title} className="category-image" />
                                <span>{cat.title}</span>
                            </div>

                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-info">
                <span>{selectedCategories.length > 0
                    ? `Mostrando ${filteredProducts.length} productos filtrados`
                    : `${filteredProducts.length} productos disponibles`
                }</span>

                {selectedCategories.length > 0 && (
                    <button onClick={handleClearFilters} className="clear-button">Limpiar filtros</button>
                )}
            </div>
        </div>
    );
};
