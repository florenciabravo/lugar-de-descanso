import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetch } from "../hook/admin/useFetch";
import { DateRange } from "react-date-range";
import { addDays, eachDayOfInterval, parseISO } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import '../styles/ReservationFormComponent.css';

export const ReservationFormComponent = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedRange, setSelectedRange] = useState([
        {
            //startDate: new Date(),
            //endDate: addDays(new Date(), 1),
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [bookedDates, setBookedDates] = useState([]);

    const {
        data: product,
        isLoading,
        error,
        fetchData
    } = useFetch();

    useEffect(() => {
        fetchData(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, "GET");
    }, [productId]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations/booked-dates/${productId}`);
                const dates = await res.json();


                const parsedDates = dates.map(d => parseISO(d));
                setBookedDates(parsedDates);
            } catch (err) {
                console.error("Error al obtener las fechas reservadas", err);
            }
        };

        fetchBookedDates();
    }, [productId]);

    useEffect(() => {
        if (location.state?.fromSuccessPage) {
          navigate("/", { replace: true });
        }
      }, [location, navigate]);      

    const handleDateChange = (ranges) => {
        setSelectedRange([ranges.selection]);
    };

    const handleContinue = async () => {
        const checkIn = selectedRange[0].startDate;
        const checkOut = selectedRange[0].endDate;

        if (checkIn >= checkOut) {
            alert("La fecha de salida debe ser posterior a la de entrada.");
            return;
        }

        navigate(`/reservar/${productId}/confirmar`, {
            state: {
                product,
                selectedRange,
            }
        });
    };

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar el producto.</p>;

    return (
        <div className="reservation-form-wrapper">
            <div className="reservation-form-container">
                <h3 className="reservation-form-title"
                >Selecciona tus fechas para: {product?.name}
                </h3>

                <div className="date-picker-wrapper">
                    <DateRange
                        classNames={{
                            daySelected: "ld-daySelected",
                            dayInRange: "ld-dayInRange",
                            dayStartEdge: "ld-dayStartEdge",
                            dayEndEdge: "ld-dayEndEdge",
                            dayNumber: "ld-dayNumber"
                        }}
                        editableDateInputs={true}
                        onChange={handleDateChange}
                        moveRangeOnFirstSelection={false}
                        ranges={selectedRange}
                        minDate={new Date()}
                        disabledDates={bookedDates}
                        dayContentRenderer={(date) => {
                            const isBooked = bookedDates.some(
                                (booked) =>
                                    booked.getFullYear() === date.getFullYear() &&
                                    booked.getMonth() === date.getMonth() &&
                                    booked.getDate() === date.getDate()
                            );

                            return (
                                <div className={`day-content${isBooked ? " booked-date" : ""}`} title={isBooked ? "No disponible" : ""}>
                                    <span className="ld-dayNumber">{date.getDate()}</span>
                                </div>
                            );
                        }}
                    />
                </div>

                <button className="calendar-continue-button" onClick={handleContinue}>
                    Continuar
                </button>
            </div>
        </div>
    );
};
