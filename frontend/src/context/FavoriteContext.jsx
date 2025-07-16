import { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../hook/admin/useFetch";
import { AuthContext } from "./AuthContext";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);
  const { fetchData, isLoading, error } = useFetch();

  const fetchFavorites = async () => {
      if (!user) {
          setFavorites([]);
          return [];
      }

      const result = await fetchData("http://localhost:8080/favorites", "GET");

      if (result && !result.error) {
          setFavorites(result);
          return result;
      } else {
          setFavorites([]);
          return [];
      }
  };

  const isFavorite = (productId) => {
      return favorites.some((fav) => fav.productId === productId);
  };

  const toggleFavorite = async (productId) => {
      const currentlyFavorite = isFavorite(productId);
      const method = currentlyFavorite ? "DELETE" : "POST";
      const url = `http://localhost:8080/favorites/${productId}`;
      const result = await fetchData(url, method);

      if (result && !result.error) {
          setFavorites((prev) =>
              currentlyFavorite
                  ? prev.filter((fav) => fav.productId !== productId)
                  : [...prev, { productId }]
          );
          localStorage.setItem("favorites_updated", Date.now());
      } else {
          await fetchFavorites(); // fallback si falla la request
      }
  };

  useEffect(() => {
      fetchFavorites();
  }, [user]);

  useEffect(() => {
      const handleStorageChange = (event) => {
          if (event.key === "favorites_updated") {
              fetchFavorites();
          }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
      <FavoriteContext.Provider
          value={{ favorites, isFavorite, toggleFavorite, fetchFavorites, isLoading, error }}
      >
          {children}
      </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
