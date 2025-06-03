import { Link } from "react-router-dom";

export const AdminMenuComponent = () => {
  return (
    <nav className="admin-menu">
      <ul>
        <li><Link to="/administracion/agregar-producto">Agregar Producto</Link></li>
        <li><Link to="/administracion/listar-productos">Listar Productos</Link></li>
        <li><Link to="/administracion/agregar-categoria">Agregar Categoría</Link></li>
        <li><Link to="/administracion/administrar-caracteristicas">Administrar Características</Link></li>
        <li><Link to="/administracion/administrar-usuarios">Administrar Usuarios</Link></li>
      </ul>
    </nav>
  );
};
