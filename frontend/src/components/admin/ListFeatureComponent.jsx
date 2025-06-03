import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from '../../hook/admin/useFetch';

export const ListFeatureComponent = () => {
    const [features, setFeatures] = useState([]);
    const { fetchData, data, isLoading, error } = useFetch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        const result = await fetchData("http://localhost:8080/features", "GET");
        if (result && !result.error) {
            setFeatures(result);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de eliminar esta característica?");
        if (confirmDelete) {
            await fetchData(`http://localhost:8080/features/${id}`, "DELETE");
            fetchFeatures(); // Recargar después de eliminar
        }
    };

    return (
        <div className="list-feature-container">
            <h2>Lista de Características</h2>
            <button className="admin-button" onClick={() => navigate("/administracion/agregar-caracteristicas")}>
                Añadir nueva
            </button>

            {isLoading ? (
                <p>Cargando características...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Ícono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {features.map((feature) => (
                            <tr key={feature.id}>
                                <td>{feature.id}</td>
                                <td>{feature.name}</td>
                                <td>
                                    <img
                                        src={`http://localhost:8080${feature.iconUrl}`}
                                        alt={feature.name}
                                        style={{ width: "32px", height: "32px", objectFit: "contain" }}
                                    />
                                </td>
                                <td>
                                    <div className="button-group">
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(feature.id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/administracion/editar-caracteristica/${feature.id}`)}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
