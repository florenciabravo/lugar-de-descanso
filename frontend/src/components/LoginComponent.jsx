import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RegisterUserComponent.css';

export const LoginComponent = () => {
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (!success) {
      setError('Correo o contraseña incorrectos.');
    } else {
      navigate(redirectPath || "/");
    }
  };

  useEffect(() => {
    if (user) {
      navigate(redirectPath || '/');
    }
  }, [user, navigate, redirectPath]);

  return (
    <div className="register-container">
      <h2>Iniciar sesión</h2>

      {/* Mensaje solo si vino desde /reservas/:id */}
      {redirectPath && (
        <p className="error">
          Necesitás iniciar sesión para completar la reserva. Si no tenés cuenta, podés registrarte.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
