import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import '../styles/NavBarComponent.css'

export const NavBarComponent = () => {
    const { user, logout } = useContext(AuthContext);

    const getInitials = (username) => {
        return username
            .split(' ')
            .map((n) => n[0].toUpperCase())
            .join('');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
                <div className="container-fluid">
                    <NavLink to='/' className="navbar-brand d-flex align-items-end fs-6 fw-light">
                        <img className="logo" src="./src/assets/LogoLD.png" alt="Lugares de Descanso" />
                        <p className="d-flex d-sm-block ms-1">Lugar de Descanso</p>
                    </NavLink>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav d-flex align-items-center">
                            {user ? (
                                <div className="user-nav">
                                    <div className="avatar mx-2">{getInitials(user.username)}</div>
                                    <span className="username me-3">{user.username}</span>
                                    <button onClick={logout} className="buttons">Cerrar Sesión</button>
                                </div>
                            ) : (
                                <>
                                    <NavLink to='/CrearCuenta' className="nav-link active"><button type="button" className="buttons">Crear Cuenta</button></NavLink>
                                    <NavLink to='/IniciarSesion' className="nav-link active"><button type="button" className="buttons">Iniciar Sesion</button></NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
