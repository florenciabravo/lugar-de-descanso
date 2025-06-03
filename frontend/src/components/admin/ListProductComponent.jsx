import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from '../../hook/admin/useFetch';

export const ListProductComponent = () => {
  const [products, setProducts] = useState([]);
  const { fetchData, data, loading, error } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await fetchData(`http://localhost:8080/products`, "GET");
    if (data) setProducts(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto?");
    if (confirmDelete) {
      await fetchData(`http://localhost:8080/products/${id}`, "DELETE");
      fetchProducts(); // Recargar la lista después de eliminar
    }
  };

  return (
    <div className="list-product-container">
      <h2>Lista de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                  <button className="edit-btn" onClick={() => navigate(`/administracion/editar-producto/${product.id}`)}>Editar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};