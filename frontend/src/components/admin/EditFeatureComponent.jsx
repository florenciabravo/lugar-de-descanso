import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hook/admin/useFetch";

export const EditFeatureComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: featureData,
        isLoading: loadingFeature,
        error: errorFeature,
        fetchData: fetchFeature
    } = useFetch();

    const {
        isLoading: saving,
        error: errorSave,
        fetchData: updateFeature
    } = useFetch();

    const [name, setName] = useState("");
    const [icon, setIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState("");
    const [iconName, setIconName] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Cargar datos de la característica
    useEffect(() => {
        fetchFeature(`http://localhost:8080/features/${id}`, "GET");
    }, [id]);

    useEffect(() => {
        if (featureData) {
            setName(featureData.name);
            setIconPreview(`http://localhost:8080${featureData.iconUrl}`);
            setIconName(featureData.iconUrl.split("/").pop());
        }
    }, [featureData]);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIcon(file);
            setIconPreview(URL.createObjectURL(file));
            setIconName(file.name)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("El nombre es obligatorio");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (icon) formData.append("icon", icon);

        const response = await updateFeature(`http://localhost:8080/features/${id}`, "PUT", formData, true); // true indica multipart/form-data

        if (!response.error) {
            setSuccessMessage("Característica actualizada correctamente");
            setTimeout(() => navigate("/administracion/administrar-caracteristicas"), 2000);
        }
    };

    if (loadingFeature) return <p>Cargando característica...</p>;
    if (errorFeature) return <p>Error al cargar la característica: {errorFeature}</p>;

    return (
        <div>
            <h2>Editar Característica</h2>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorSave && <p style={{ color: "red" }}>Error al guardar: {errorSave}</p>}
            <form onSubmit={handleSubmit} className="admin-form">
                <div>
                    <label>Nombre:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Ícono:</label>
                    <label className="custom-file-label">Seleccionar Icono
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                    />
                    </label>
                    {iconPreview && (
                        <div className="image-preview-container">
                            <img src={iconPreview} alt="Ícono" height="50" />
                            {iconName && <span className="file-name">{iconName}</span>}
                        </div>
                    )}
                </div>
                <button type="submit" className="admin-button" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar Caracteristica"}
                </button>
            </form>
        </div>
    );
};
