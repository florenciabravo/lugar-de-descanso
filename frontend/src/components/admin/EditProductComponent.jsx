import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hook/admin/useFetch";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const EditProductComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: productData, isLoading: loadingProduct, error: errorProduct, fetchData: fetchProduct } = useFetch();
    const { data: categories, isLoading: loadingCategories, error: errorCategories, fetchData: fetchCategories } = useFetch();
    const { data: allFeatures, fetchData: fetchFeatures } = useFetch();
    const { isLoading: saving, error: errorSave, fetchData: saveProduct } = useFetch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [images, setImages] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const fileInputRef = useRef(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Obtener categorias
    useEffect(() => {
        fetchCategories("http://localhost:8080/categories", "GET");
    }, []);

    // Obtener caracteristicas
    useEffect(() => {
        fetchFeatures("http://localhost:8080/features", "GET");
    }, []);

    // Obtener producto cuando categorias esten listas
    useEffect(() => {
        if (!loadingCategories && categories) {
            fetchProduct(`http://localhost:8080/products/${id}`, "GET");
        }
    }, [id, loadingCategories, categories]);

    // Llenar campos cuando llega el producto
    useEffect(() => {
        if (productData) {
            setName(productData.name);
            setDescription(productData.description);
            setCategoryId(productData.category?.id?.toString() || "");

            const featureIds = productData.features?.map((f) => f.id.toString()) || [];
            setSelectedFeatures(featureIds);
        }
    }, [productData]);

    const handleFileChange = (e) => {
        const selectedFiles = [...e.target.files];
        setImages(selectedFiles);
    };

    // Manejador de guardado
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !categoryId || selectedFeatures.length === 0) {
            alert("Todos los campos, incluyendo al menos una característica, son obligatorios");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        images.forEach((image) => formData.append("images", image));
        selectedFeatures.forEach((featureId) => formData.append("features", featureId));

        const response = await saveProduct(`http://localhost:8080/products/${id}`, "PUT", formData);

        if (!response.error) {
            setSuccessMessage("Producto actualizado correctamente");
            setTimeout(() => navigate("/administracion/listar-productos"), 2000);
        }
    };

    if (loadingCategories || loadingProduct) return <p>Cargando...</p>;
    if (errorCategories || errorProduct) return <p>Error al cargar los datos</p>;

    return (
        <div>
            <h2>Editar producto</h2>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorSave && <p style={{ color: "red" }}>Error al guardar: {errorSave}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Categoría:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Selecciona una categoría</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>

                <div className="custom-file-input-wrapper">
                    <label className="file-label">Imágenes nuevas (opcional):</label>
                    <label className="custom-file-label">
                        Seleccionar Imágenes
                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>

                    <div className="file-info">
                        {images.length === 0
                            ? "No se seleccionaron imágenes nuevas"
                            : `${images.length} archivo(s) seleccionado(s)`}
                    </div>

                    {images.length > 0 && (
                        <div className="selected-files">
                            <ul>
                                {images.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label>Imágenes actuales:</label>
                    <ul>
                        {productData?.imageUrls?.map((url, index) => (
                            <li key={index}>
                                <img src={`${BASE_URL}${url}`} alt={`imagen-${index}}`} style={{ width: "100px" }} />
                                <span>{url.split("/").pop()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label>Características:</label>
                    {allFeatures?.map((feature) => (
                        <div key={feature.id} className="feature-label">
                            <input
                                type="checkbox"
                                id={`feature-${feature.id}`}
                                value={feature.id}
                                checked={selectedFeatures.includes(feature.id.toString())}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (e.target.checked) {
                                        setSelectedFeatures((prev) => [...prev, value]);
                                    } else {
                                        setSelectedFeatures((prev) => prev.filter((id) => id !== value));
                                    }
                                }}
                            />
                            <label htmlFor={`feature-${feature.id}`} className="feature-label">{feature.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar Producto"}
                </button>
            </form>
        </div>
    );
};
