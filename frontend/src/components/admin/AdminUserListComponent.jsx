import { useEffect, useState } from "react";
import { useFetch } from "../../hook/admin/useFetch";

export const AdminUserListComponent = () => {
    const [users, setUsers] = useState([]);
    const { fetchData, data, isLoading, error } = useFetch();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await fetchData("http://localhost:8080/users", "GET");
        if (result && !result.error) {
            setUsers(result);
        }
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        const confirmChange = window.confirm(
            `¿Deseas cambiar el rol de ${user.firstname} a ${newRole}?`
        );

        if (confirmChange) {
            const result = await fetchData(
                `http://localhost:8080/users/${user.id}/role`,
                "PUT",
                { role: newRole } 
            );
            if (result && !result.error) {
                fetchUsers(); // Recargar lista después del cambio
            }
        }
    };

    return (
        <div className="admin-user-list">
            <h2>Administrar Usuarios</h2>

            {isLoading ? (
                <p>Cargando usuarios...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstname} {user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="admin-button"
                                        onClick={() => handleRoleToggle(user)}
                                    >
                                        Cambiar a {user.role === "ADMIN" ? "USER" : "ADMIN"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
