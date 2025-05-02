import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminMenuComponent } from "../../components/admin/AdminMenuComponent";
import { AddProductComponent } from "../../components/admin/AddProductComponent";
import { ListProductComponent } from "../../components/admin/ListProductComponent";
import "../../styles/admin/Admin.css";

export const AdminPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si el ancho de la pantalla es menor a 768px (dispositivo movil)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Ejecutar al montar el componente
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [])

  if (isMobile) {
    return <h2 className="admin-error"> Panel no disponible en dispositivos móviles </h2>;
  }

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      <AdminMenuComponent />

      {/* Aquí solo se muestra el contenido dependiendo de la opción seleccionada */}
      <div className="admin-content">
        <Routes>
          <Route path="agregar-producto" element={<AddProductComponent />} />
          <Route path="listar-productos" element={<ListProductComponent />} />
          <Route path="*" element={<h3 className="admin-comment">Seleccione una opción del menú</h3>} />
        </Routes>
      </div>
    </div>
  );
};
