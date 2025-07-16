import { useEffect, useState } from "react";
import { CategoryBarComponent } from "../components/CategoryBarComponent";
import { useFavorites } from "../context/FavoriteContext";
import { useFetch } from "../hook/admin/useFetch";

export const FavoritesPage = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const { favorites, fetchFavorites } = useFavorites();
    const { fetchData, isLoading, error } = useFetch();

    useEffect(() => {
        const loadFavorites = async () => {
            const updated = await fetchFavorites();
            const ids = updated.map(f => f.productId);
            const allProducts = await fetchData("http://localhost:8080/products", "GET");
            const filtered = allProducts.filter(p => ids.includes(p.id));
            setFavoriteProducts(filtered);
        };
        loadFavorites();
    }, [favorites.length]);

    if (isLoading) return <p>Cargando favoritos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="favorites-page">
            {favoriteProducts.length > 0 ? (
                <CategoryBarComponent products={favoriteProducts} title="Mis Productos Favoritos" />
            ) : (
                <p>No tenés productos favoritos aún.</p>
            )}
        </div>
    );
};
