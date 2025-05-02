import { Link } from "react-router-dom";

export const AdminMenuComponent = () => {
  return (
    <nav className="admin-menu">
      <ul>
        <li><Link to="/administracion/agregar-producto">Agregar Producto</Link></li>
        <li><Link to="/administracion/listar-productos">Listar Productos</Link></li>
      </ul>
    </nav>
  );
};
