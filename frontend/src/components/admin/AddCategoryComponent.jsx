import React, { useState, useEffect, useRef } from 'react';
import { useFetch } from '../../hook/admin/useFetch';

export const AddCategoryComponent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const { isLoading, error, fetchData } = useFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert("Los campos son obligatorios");
            return;
        }

        if (!image) {
            alert("La imagen es obligatoria");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (image) formData.append("image", image);

        const result = await fetchData("http://localhost:8080/categories", "POST", formData);

        if (!result?.error) {
            alert("Categoría agregada correctamente");
            setTitle('');
            setDescription('');
            setImage(null);
            document.getElementById("imageInput").value = ""; // resetea input file
        }
    };

    const focusRef = useRef();

    useEffect(() => {
        focusRef.current.focus()
    }, []);

    return (
        <div className="admin-form-container">
            <h2>Agregar Categoría</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="title">Título:</label>
                    <input
                        ref={focusRef}
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                   <label className="file-label">Imagen representativa:</label>

                   <label className="custom-file-label">Seleccionar Imagen
                       <input
                           type="file"
                           id="imageInput"
                           name="image"
                           accept="image/*"
                           onChange={(e) => setImage(e.target.files[0])} 
                       />
                   </label>

                   <div className="file-info">
                       {image
                           ? `Archivo seleccionado: ${image.name}`
                           : "Ningún archivo seleccionado"
                       }
                   </div>
               </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Guardar Categoría"}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};
