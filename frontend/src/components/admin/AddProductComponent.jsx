import React, { useEffect, useState, useRef } from 'react';
import { useFetch } from '../../hook/admin/useFetch';

export const AddProductComponent = () => {
    const { data, isLoading, error, fetchData } = useFetch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [localError, setLocalError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const [features, setFeatures] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);

    const [locations, setLocations] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8080/categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error al cargar categorías", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch("http://localhost:8080/features");
                const data = await response.json();
                setFeatures(data);
            } catch (error) {
                console.error("Error al cargar características", error);
            }
        };

        fetchFeatures();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch("http://localhost:8080/locations");
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error("Error al cargar ubicaciones", error);
            }
        };

        fetchLocations();
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = [...e.target.files];
        setImages(selectedFiles);

        if (selectedFiles.length > 0) {
            setLocalError(null); // Limpiar el error si se seleccionaron imágenes
        }
    };

    const handleFeatureChange = (e) => {
        const value = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedFeatures([...selectedFeatures, value]);
        } else {
            setSelectedFeatures(selectedFeatures.filter(id => id !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Resetear error antes de enviar la peticion
        setLocalError(null);

        //Validar que al menos haya una imagen seleccionada
        if (images.length === 0) {
            setLocalError("Debes seleccionar al menos una imagen.");
            return;
        }

        if (!name || !description || !selectedCategoryId || !selectedLocationId || selectedFeatures.length === 0) {
            alert("Todos los campos, incluyendo al menos una característica, son obligatorios");
            return;
        }

        //Construir FormData para enviar archivos
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('categoryId', selectedCategoryId);
        formData.append('locationId', selectedLocationId);
        images.forEach((Image) => formData.append('images', Image));
        selectedFeatures.forEach(featureId => {
            formData.append("features", featureId);
        });

        //Llamar al fetchData con POST
        const result = await fetchData("http://localhost:8080/products", "POST", formData);

        if (result && !result.error) {
            setSuccessMessage("Producto agregado exitosamente");

            //Resetear formulario
            setName("");
            setDescription("");
            setSelectedCategoryId("");
            setSelectedLocationId("");
            setImages([]);
            setSelectedFeatures([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            //Ocultar mensaje depues de 4 segundos
            setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
        } else {
            // Si hay error en fetchData, setear en localError
            setLocalError(result?.error || "Ocurrio un error inesperado");
        }
    };

    const focusRef = useRef();

    useEffect(() => {
        focusRef.current.focus()
    }, []);

    return (
        <div>
            <h2>Agregar Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        ref={focusRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripcion:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Categoría:</label>
                    <select
                        className="category-select"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Ubicación:</label>
                    <select
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar ubicación</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.city}, {location.state}, {location.country}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="custom-file-input-wrapper">
                    <label className="file-label">Imagenes:</label>

                    <label className="custom-file-label">Seleccionar Imagenes
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
                            ? "Ningún archivo seleccionado"
                            : `${images.length} archivo(s) seleccionado(s)`
                        }
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
                    <label>Características:</label>
                    <div className="features-checkboxes">
                        {features.map((feature) => (
                            <label key={feature.id} className="feature-label">
                                <input
                                    type="checkbox"
                                    value={feature.id}
                                    checked={selectedFeatures.includes(feature.id)}
                                    onChange={handleFeatureChange}
                                />
                                {feature.name}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Producto"}
                </button>
            </form>

            {localError && <p className="error">{localError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
        </div>
    );
};