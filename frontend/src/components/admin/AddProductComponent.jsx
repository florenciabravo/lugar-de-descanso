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

    const handleFileChange = (e) => {
        const selectedFiles = [...e.target.files];
        setImages(selectedFiles);
    
        if (selectedFiles.length > 0) {
            setLocalError(null); // Limpiar el error si se seleccionaron imágenes
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

        //Construir FormData para enviar archivos
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        images.forEach((Image) => formData.append('images', Image));

        //Llamar al fetchData con POST
        const result = await fetchData("http://localhost:8080/products", "POST", formData);

        if (result && !result.error) {
            setSuccessMessage("Producto agregado exitosamente");

            //Resetear formulario
            setName("");
            setDescription("");
            setImages([]);
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
                    <label>Nombre</label>
                    <input
                        ref={focusRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripcion</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="custom-file-input-wrapper">
                    <label className="file-label">Imagenes</label>

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

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Producto"}
                </button>
            </form>

            {localError && <p className="error">{localError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
        </div>
    );
};