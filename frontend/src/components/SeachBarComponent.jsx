import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../styles/SearchBarComponent.css';
import { useFetch } from '../hook/admin/useFetch';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const SeachBarComponent = forwardRef((props, ref) => {
    const { onSearch } = props;

    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const { data: locationData, fetchData: fetchLocations } = useFetch();

    useEffect(() => {
        fetchLocations("http://localhost:8080/locations", "GET");
    }, []);

    useEffect(() => {
        if (locationData && Array.isArray(locationData)) {
            const cities = [...new Set(locationData.map(loc => loc.city))];
            setAvailableCities(cities);
        }
    }, [locationData]);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setSearch('');
            setDateRange({
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            });
            setShowCalendar(false);
        }
    }));

    const filterSuggestions = (value) => {
        const filtered = availableCities.filter(city =>
            city.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.length > 0) {
            filterSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (city) => {
        setSearch(city);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let checkIn = "";
        let checkOut = "";

        // Solo toma fechas si el usuario abrió el calendario Y seleccionó rango válido
        if (showCalendar && dateRange) {
            checkIn = dateRange.startDate.toISOString().split('T')[0];
            checkOut = dateRange.endDate.toISOString().split('T')[0];
        }

        if (onSearch) {
            onSearch({
                destination: search,
                checkIn: checkIn,
                checkOut: checkOut
            });
        }
    };

    return (
        <>
            <div className='search-section'>
                <h3 className='search-title'>Busca ofertas en hoteles, casas y mucho mas</h3>
                <p className="search-description">Encontrá el hospedaje ideal según tu destino y fechas disponibles</p>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="search-fields-container">
                        <div className="autocomplete-wrapper">

                            <div className="input-with-icon">
                                <FaMapMarkerAlt className="input-icon" />
                                <input
                                    type='text'
                                    placeholder='¿A donde vamos ? '
                                    value={search}
                                    onChange={handleInputChange}
                                    onFocus={() => {
                                        if (search.length > 0) {
                                            filterSuggestions(search);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                />
                            </div>

                            {showSuggestions && (
                                <ul className="suggestions-list">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((city, index) => (
                                            <li key={index} onClick={() => handleSuggestionClick(city)}>
                                                {city}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-match">No se encontraron coincidencias</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        <button type="button" onClick={() => setShowCalendar(!showCalendar)} className="calendar-toggle">
                            <FaRegCalendarAlt />
                            Check in - Check out
                        </button>

                        <button className='button-search' type='submit'>Buscar</button>

                    </div>

                    {showCalendar && (
                        <DateRange
                            editableDateInputs={true}
                            onChange={item => setDateRange(item.selection)}
                            moveRangeOnFirstSelection={false}
                            ranges={[dateRange]}
                            months={2}
                            direction="horizontal"
                        />
                    )}

                </form>

            </div>
        </>
    )
});