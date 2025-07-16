import { useEffect, useState } from 'react';
import { useFetch } from '../hook/admin/useFetch';
import { DateRange } from 'react-date-range';
import { isToday } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../styles/AvailabilityCalendar.css';

export const AvailabilityCalendar = ({ productId }) => {
    const [bookedDates, setBookedDates] = useState([]);
    const { fetchData, isLoading, error } = useFetch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadDates = () => {
        fetchData(`http://localhost:8080/reservations/booked-dates/${productId}`, "GET")
            .then(result => {
                if (!result?.error) setBookedDates(result);
            });
    };

    useEffect(() => {
        loadDates();
    }, [productId]);

    // convierte string a formato YYYY-MM-DD para comparación
    const formatDate = (date) => date.toISOString().split("T")[0];

    // marca como ocupadas las fechas
    const isDateBooked = (date) => {
        return bookedDates.includes(formatDate(date));
    };

    if (isLoading) return <p className="calendar-loading">Cargando disponibilidad...</p>;

    if (error) {
        return (
            <div className="calendar-error">
                <p>No se pudo cargar la Disponibilidad. Intenta nuevamente más tarde.</p>
                <button className="button-retry" onClick={loadDates}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="calendar-container">
            <h4 className="calendar-title">Disponibilidad</h4>

            <DateRange
                editableDateInputs={false}
                showDateDisplay={false}
                onChange={() => {}}
                moveRangeOnFirstSelection={false}
                ranges={[{
                    startDate: new Date(),  // fecha actual
                    endDate: new Date(),
                    key: 'selection'
                }]}
                rangeColors={['transparent']} // oculta visual del rango
                months={isMobile ? 2 : 2}
                direction={isMobile ? "vertical" : "horizontal"}
                minDate={new Date()}
                dayContentRenderer={(date) => {
                    const booked = isDateBooked(date);
                    const today = isToday(date);
                    return (
                        <div
                            className={`day-content${booked ? ' booked-date' : ''}${today ? ' today-highlight' : ''}`}
                            title={booked ? 'No disponible' : ''}
                        >
                            {date.getDate()}
                        </div>
                    );
                }}
            />
        </div>
    );
};

