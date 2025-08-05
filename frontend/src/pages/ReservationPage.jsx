import { useLocation, useParams, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useFetch } from "../hook/admin/useFetch";
import "../styles/ReservationPage.css";

export const ReservationPage = () => {
    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { productId } = useParams();

    const [confirming, setConfirming] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");

    const { fetchData, error } = useFetch();

    if (!user) return <Navigate to="/login" replace />;
    if (!state || !state.selectedRange || !state.product) {
        return <Navigate to={`/producto/${productId}`} />;
    }

    const { product, selectedRange } = state;
    const checkInDate = selectedRange[0].startDate;
    const checkOutDate = selectedRange[0].endDate;
    const nights =
        Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    const handleConfirmReservation = async () => {
        setConfirming(true);

        const body = {
            productId: Number(productId),
            checkInDate: checkInDate.toISOString().split("T")[0],
            checkOutDate: checkOutDate.toISOString().split("T")[0],
            phone,
            comment
        };

        const response = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/reservations`, "POST", body);

        if (response?.error || typeof response === "string") {
            alert(`Error: ${response?.error || response}`);
        } else {
            navigate("/reserva-exitosa", { replace: true });
        }

        setConfirming(false);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const response = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/users/me`, "GET");
            if (!response?.error) {
                setUserInfo(response);
            }
        };

        if (user?.username) {
            fetchUserInfo();
        }
    }, [user]);

    return (
        <div className="reservation-page">
            <h2>Confirmá tu reserva</h2>

            <section className="product-detail">
                <h3>{product.name}</h3>
                <p>{product.location.city}, {product.location.state}, {product.location.country}</p>
                <img
                    src={product.imageUrls?.[0] ? `${import.meta.env.VITE_BACKEND_URL}${product.imageUrls[0]}` : '/default-image.jpg'}
                    alt={product.name}
                    className="product-img"
                />
                <p>{product.description}</p>
            </section>

            <section className="user-detail">
                <h3>Tus datos</h3>
                {userInfo ? (
                    <>
                        <p><span className="label">Nombre:</span> {userInfo.name}</p>
                        <p><span className="label">Apellido:</span> {userInfo.lastName}</p>
                        <p><span className="label">Email:</span> {userInfo.email}</p>
                    </>
                ) : (
                    <p>Cargando datos del usuario...</p>
                )}
            </section>

            <section className="date-detail">
                <h3>Fechas seleccionadas</h3>
                <p><span className="label">Check-in:</span> {checkInDate.toLocaleDateString("es-AR")}</p>
                <p><span className="label">Check-out:</span> {checkOutDate.toLocaleDateString("es-AR")}</p>
                <p><span className="label">Cantidad de noches:</span> {nights} {nights === 1 ? "noche" : "noches"}</p>
            </section>

            <section className="extra-detail">
                <h3>Información adicional (opcional)</h3>

                <label htmlFor="phone">Teléfono:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: +54 9 351 1234567"
                    pattern="^\+?\d{7,15}$"
                />

                <label htmlFor="comment">Comentarios:</label>
                <textarea
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Podés indicar necesidades, horario estimado, etc."
                />
            </section>

            <button className="confirm-button" onClick={handleConfirmReservation} disabled={confirming}>
                {confirming ? "Confirmando..." : "Confirmar reserva"}
            </button>

            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
};
