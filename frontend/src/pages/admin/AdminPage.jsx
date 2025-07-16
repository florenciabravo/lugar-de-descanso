import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminMenuComponent } from "../../components/admin/AdminMenuComponent";
import { AddProductComponent } from "../../components/admin/AddProductComponent";
import { ListProductComponent } from "../../components/admin/ListProductComponent";
import { AddCategoryComponent } from '../../components/admin/AddCategoryComponent';
import { ListCategoryComponent } from "../../components/admin/ListCategoryComponent";
import { EditProductComponent } from "../../components/admin/EditProductComponent";
import { AddFeatureComponent } from "../../components/admin/AddFeatureComponent";
import { ListFeatureComponent } from "../../components/admin/ListFeatureComponent";
import { EditFeatureComponent } from '../../components/admin/EditFeatureComponent';
import { AdminUserListComponent } from "../../components/admin/AdminUserListComponent";

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
          <Route path="agregar-categoria" element={<AddCategoryComponent />} />
          <Route path="administrar-categoria" element={<ListCategoryComponent />} />
          <Route path="editar-producto/:id" element={<EditProductComponent />} />
          <Route path="agregar-caracteristicas" element={<AddFeatureComponent />} />
          <Route path="administrar-caracteristicas" element={<ListFeatureComponent />} />
          <Route path="editar-caracteristica/:id" element={<EditFeatureComponent />} />
          <Route path="administrar-usuarios" element={<AdminUserListComponent />} />
          <Route path="*" element={<h3 className="admin-comment">Seleccione una opción del menú</h3>} />
        </Routes>
      </div>
    </div>
  );
};
