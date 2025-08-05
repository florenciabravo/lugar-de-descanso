import { useEffect, useState } from "react";
import { useFetch } from "../hook/admin/useFetch";
import { format } from "date-fns";
import "../styles/ReservationHistoryPage.css";

export const ReservationHistoryPage = () => {
    const { fetchData, isLoading, error } = useFetch();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const data = await fetchData(
                `${import.meta.env.VITE_BACKEND_URL}/reservations/my-reservations`,
                "GET"
            );
            if (data && !data.error) {
                setReservations(data);
            }
        };

        fetchReservations();
    }, []);

    if (isLoading) return <p>Cargando reservas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="reservation-history-container">
            <h2>Mi historial de reservas</h2>
            {reservations.length === 0 ? (
                <p>No tenés reservas anteriores.</p>
            ) : (
                <div className="reservation-cards">
                    {reservations.map((res) => (
                        <div key={res.id} className="reservation-card">
                            <img
                                src={res.productImageUrl ? `${import.meta.env.VITE_BACKEND_URL}${res.productImageUrl}` : '/default-image.jpg'}
                                alt={res.productName}
                                className="reservation-card-image"
                            />
                            <div className="reservation-card-info">
                                <h3>{res.productName}</h3>
                                <p><strong>Reservado el:</strong> {format(new Date(res.createdAt), "dd/MM/yyyy HH:mm")}</p>
                                <p><strong>Desde:</strong> {format(new Date(res.checkInDate), "dd/MM/yyyy")}</p>
                                <p><strong>Hasta:</strong> {format(new Date(res.checkOutDate), "dd/MM/yyyy")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
