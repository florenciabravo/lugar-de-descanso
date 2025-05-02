import { createContext, useEffect, useState } from "react";

export const RandomProductContext = createContext();

export const RandomProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const stored = sessionStorage.getItem("randomProducts");
            if (stored) {
                setProducts(JSON.parse(stored));
            } else {
                try {
                    const response = await fetch("http://localhost:8080/products");
                    if (response.ok) {
                        const data = await response.json();
                        const shuffled = [...data].sort(() => 0.5 - Math.random());
                        setProducts(shuffled);
                        sessionStorage.setItem("randomProducts", JSON.stringify(shuffled));
                    } else {
                        console.error("Error al obtener productos aleatorios");
                    }
                } catch (error) {
                    console.error("Error en fetch:", error);
                }
            }
        };

        fetchProducts();
    }, []);

    return (
        <RandomProductContext.Provider value={{ products, setProducts }}>
            {children}
        </RandomProductContext.Provider>
    );
};
