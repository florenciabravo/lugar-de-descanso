import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hook/admin/useFetch";

export const ListCategoryComponent = () => {
    const [categories, setCategories] = useState([]);
    const { fetchData, isLoading, error } = useFetch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const result = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/categories`, "GET");
        if (result && !result.error) {
            setCategories(result);
        }
    };

    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(
            `¿Estás seguro de que deseas eliminar la categoría "${title}"?\n\nEsta acción podría afectar productos asociados.`
        );
        
        if (confirmDelete) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
    
                if (response.ok) {
                    alert(`Categoría "${title}" eliminada correctamente.`);
                    fetchCategories();
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || `No se pudo eliminar la categoría "${title}".`);
                }
    
            } catch (err) {
                alert(`Error inesperado: ${err.message}`);
            }
        }
    };

    return (
        <div className="list-feature-container">
            <h2>Lista de Categorías</h2>
            <button className="admin-button" onClick={() => navigate("/administracion/agregar-categoria")}>
                Añadir nueva
            </button>

            {isLoading ? (
                <p>Cargando categorías...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.title}</td>
                                <td>{category.description}</td>
                                <td>
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${category.imageUrl}`}
                                        alt={category.title}
                                        style={{ width: "48px", height: "48px", objectFit: "cover" }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(category.id, category.title)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
