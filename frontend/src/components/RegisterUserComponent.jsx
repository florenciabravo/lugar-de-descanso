import React, { useState } from 'react';
import { useFetch } from "../hook/admin/useFetch";
import '../styles/RegisterUserComponent.css';

export const RegisterUserComponent = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const [resendError, setResendError] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [lastEmailRegistered, setLastEmailRegistered] = useState(null);

  const { data, isLoading, error, fetchData } = useFetch();

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'El nombre es obligatorio.';
    if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es obligatorio.';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Email inválido.';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await fetchData('http://localhost:8080/auth/register', 'POST', formData);

    if (!response?.error) {
      setSuccessMessage('¡Registro exitoso! Hemos enviado un correo de confirmación a tu dirección. Por favor revisa tu bandeja de entrada o spam.');
      setShowResend(true);
      setResendSuccess(null);
      setResendError(null);
      setLastEmailRegistered(formData.email);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      });
    } else {
      setSuccessMessage(null);

      if (response.message?.includes("ha sido registrado")) {
        setErrors({ email: "Este correo ya está en uso." });
      } else {
        setErrors({ general: response.message || "Error al registrar. Inténtalo más tarde." });
      }
    }
  };

  const handleResendConfirmation = async () => {
    setResendSuccess(null);
    setResendError(null);

    if (!lastEmailRegistered || !lastEmailRegistered.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setResendError('No hay un correo válido registrado para reenviar la confirmación.');
      return;
    }

    const response = await fetchData(`http://localhost:8080/auth/resend-confirmation?email=${lastEmailRegistered}`, 'POST');

    if (!response?.error) {
      setResendSuccess(`Correo de confirmación reenviado con éxitoa a ${lastEmailRegistered}.`);
    } else {
      setResendError('No se pudo reenviar el correo. Verifica el email.');
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="Nombre"
          value={formData.firstname}
          onChange={handleChange}
        />
        {errors.firstname && <p className="error">{errors.firstname}</p>}

        <input
          type="text"
          name="lastname"
          placeholder="Apellido"
          value={formData.lastname}
          onChange={handleChange}
        />
        {errors.lastname && <p className="error">{errors.lastname}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        {showResend && (
          <>
            <button
              type="button"
              className="resend-button"
              onClick={handleResendConfirmation}
              disabled={isLoading}
            >
              {isLoading ? 'Reenviando...' : '¿No recibiste el correo? Reenviar confirmación'}
            </button>
            {errors.general && <p className="error">{errors.general}</p>}
            {resendSuccess && <p className="success">{resendSuccess}</p>}
            {resendError && <p className="error">{resendError}</p>}
          </>
        )}

      </form>
    </div>
  );
};
