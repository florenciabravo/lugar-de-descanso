import { Link } from "react-router-dom";
import "../styles/ReservationSuccessPage.css";

export const ReservationSuccessPage = () => {
  return (
    <div className="reservation-success-container">
      <div className="reservation-success-card">
        <h2>🎉 ¡Reserva realizada con éxito!</h2>
        <p>Gracias por elegir Lugar de Descanso. Pronto recibirás un email con los detalles de tu reserva.</p>
        <Link to="/" className="reservation-home-button">Volver al inicio</Link>
      </div>
    </div>
  );
}
