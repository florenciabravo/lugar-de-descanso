import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from "react-icons/fa";
import "../styles/WhatsAppButton.css";

const WhatsAppButton = ({ phoneNumber, message }) => {
    const isValidPhoneNumber = (number) => /^\d{6,15}$/.test(number);
    const handleClick = () => {
        if (!phoneNumber) {
            toast.error("Este producto aún no tiene un anfitrión asignado.");
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            toast.error("El número del anfitrión no es válido.");
            return;
        }

        if (!navigator.onLine) {
            toast.error("No hay conexión a internet.");
            return;
        }

        toast.success("Redirigiendo a WhatsApp...");
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
            window.open(url, "_blank");
        }, 1000);
    };

    return (
        <button className="whatsapp-button" onClick={handleClick} title="Contactar por WhatsApp">
            <FaWhatsapp size={28} />
        </button>
    );
};

export default WhatsAppButton;
