import { Navigate } from "react-router-dom";

// Verifica si el usuario tiene el rol ADMIN antes de permitir el acceso
export const PrivateRouteAdmin = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/" replace />;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload?.authorities || payload?.role || [];

        if (!roles.includes("ADMIN") && !roles.includes("ROLE_ADMIN")) {
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (e) {
        return <Navigate to="/" replace />;
    }
};