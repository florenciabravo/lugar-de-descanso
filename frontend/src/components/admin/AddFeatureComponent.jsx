import React, { useState, useEffect, useRef } from 'react';
import { useFetch } from '../../hook/admin/useFetch';

export const AddFeatureComponent = () => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(null);
    const { isLoading, error, fetchData } = useFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        if (!icon) {
            alert("El ícono es obligatorio");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("icon", icon);

        const result = await fetchData("http://localhost:8080/features", "POST", formData);

        if (!result?.error) {
            alert("Característica agregada correctamente");
            setName('');
            setIcon(null);
            document.getElementById("iconInput").value = "";
        }
    };

    const focusRef = useRef();

    useEffect(() => {
        focusRef.current.focus();
    }, []);

    return (
        <div className="admin-form-container">
            <h2>Agregar Característica</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        ref={focusRef}
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="file-label">Ícono:</label>

                    <label className="custom-file-label">
                        Seleccionar Ícono
                        <input
                            type="file"
                            id="iconInput"
                            name="icon"
                            accept="image/*"
                            onChange={(e) => setIcon(e.target.files[0])}
                        />
                    </label>

                    <div className="file-info">
                        {icon
                            ? `Archivo seleccionado: ${icon.name}`
                            : "Ningún archivo seleccionado"
                        }
                    </div>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Agregar característica"}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};
