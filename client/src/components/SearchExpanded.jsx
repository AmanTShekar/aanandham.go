import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchExpanded = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [activeField, setActiveField] = useState(null); // 'location', 'dates', 'guests'

    // Guest State
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
    });

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const wrapperRef = useRef(null);

    const isExperiences = pathname === '/experiences';

    // Places Autocomplete Hook
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
        initOnMount: isLoaded
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                clearSuggestions();
                setActiveField(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef, clearSuggestions]);

    const handleSearch = () => {
        const totalGuests = guests.adults + guests.children;
        const queryParams = new URLSearchParams();
        if (value) queryParams.append('search', value);
        if (startDate) queryParams.append('checkin', startDate.toISOString());
        if (endDate) queryParams.append('checkout', endDate.toISOString());
        if (totalGuests > 1) queryParams.append('guests', totalGuests);

        navigate(`/?${queryParams.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            clearSuggestions();
        }
    };

    const handleLocationSelect = (description) => {
        setValue(description, false);
        clearSuggestions();
        setActiveField('dates'); // Auto-advance
    };

    const updateGuest = (type, operation) => {
        setGuests(prev => {
            const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
            if (newValue < 0) return prev;
            if (type === 'adults' && newValue < 1) return prev; // Min 1 adult
            return { ...prev, [type]: newValue };
        });
    };

    const getTotalGuests = () => {
        let total = guests.adults + guests.children;
        let text = `${total} guest${total !== 1 ? 's' : ''}`;
        if (guests.infants > 0) text += `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`;
        if (guests.pets > 0) text += `, ${guests.pets} pet${guests.pets !== 1 ? 's' : ''}`;
        return text;
    };

    return (
        <motion.div
            ref={wrapperRef}
            layoutId="search-bar"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '850px',
                margin: '0 auto'
            }}
        >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', color: 'var(--text-main)' }}>
                <span
                    onClick={() => navigate('/')}
                    style={{
                        fontWeight: pathname === '/' ? '600' : '500',
                        borderBottom: pathname === '/' ? '2px solid var(--text-main)' : '2px solid transparent',
                        paddingBottom: '8px',
                        cursor: 'pointer',
                        color: pathname === '/' ? 'var(--text-main)' : 'var(--text-secondary)',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Stays
                </span>
                <span
                    onClick={() => navigate('/experiences')}
                    style={{
                        fontWeight: pathname === '/experiences' ? '600' : '500',
                        borderBottom: pathname === '/experiences' ? '2px solid var(--text-main)' : '2px solid transparent',
                        paddingBottom: '8px',
                        cursor: 'pointer',
                        color: pathname === '/experiences' ? 'var(--text-main)' : 'var(--text-secondary)',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Experiences
                </span>
                <span
                    onClick={() => navigate('/places')}
                    style={{
                        fontWeight: pathname.startsWith('/places') ? '600' : '500',
                        borderBottom: pathname.startsWith('/places') ? '2px solid var(--text-main)' : '2px solid transparent',
                        paddingBottom: '8px',
                        cursor: 'pointer',
                        color: pathname.startsWith('/places') ? 'var(--text-main)' : 'var(--text-secondary)',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Places
                </span>
            </div>

            {/* Search Bar Container */}
            <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-off-white)',
                borderRadius: 'var(--radius-full)',
                position: 'relative',
                width: '100%',
                border: '1px solid var(--border)',
                boxShadow: activeField ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
                height: '66px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Where Input */}
                <div
                    style={{
                        flex: 1.5,
                        padding: '14px 32px',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: activeField === 'location' ? 'white' : 'transparent',
                        boxShadow: activeField === 'location' ? 'var(--shadow-md)' : 'none',
                        zIndex: activeField === 'location' ? 10 : 1,
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => setActiveField('location')}
                    onMouseEnter={(e) => { if (activeField !== 'location') e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
                    onMouseLeave={(e) => { if (activeField !== 'location') e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <div style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '2px', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Where</div>
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setActiveField('location');
                        }}
                        disabled={!ready}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setActiveField('location')}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            width: '100%',
                            color: 'var(--text-main)',
                            background: 'transparent',
                            paddingLeft: '2px',
                            fontWeight: '500',
                            textOverflow: 'ellipsis'
                        }}
                    />

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {status === "OK" && activeField === 'location' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: '80px',
                                    left: 0,
                                    width: '400px',
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '24px 0',
                                    boxShadow: 'var(--shadow-xl)',
                                    zIndex: 100,
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    border: '1px solid var(--border-light)'
                                }}
                            >
                                {data.map(({ place_id, description, structured_formatting }) => (
                                    <div
                                        key={place_id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLocationSelect(description);
                                        }}
                                        style={{
                                            padding: '12px 32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <div style={{
                                            backgroundColor: 'var(--bg-off-white)',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FaMapMarkerAlt size={18} color="var(--text-main)" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
                                                {structured_formatting.main_text}
                                            </span>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                {structured_formatting.secondary_text}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ width: '1px', backgroundColor: 'var(--border)', margin: '14px 0' }}></div>

                {/* Date Range Picker (Unified) */}
                <div
                    style={{
                        flex: 2,
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: activeField === 'dates' ? 'white' : 'transparent',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: activeField === 'dates' ? 'var(--shadow-md)' : 'none',
                        zIndex: activeField === 'dates' ? 10 : 1,
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => setActiveField('dates')}
                    onMouseEnter={(e) => { if (activeField !== 'dates') e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
                    onMouseLeave={(e) => { if (activeField !== 'dates') e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    {/* Check in Display */}
                    <div style={{ flex: 1, padding: '14px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Check in</div>
                        <div style={{ fontSize: '14px', color: startDate ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                            {startDate ? startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates'}
                        </div>
                    </div>

                    <div style={{ width: '1px', backgroundColor: 'var(--border)', margin: '14px 0' }}></div>

                    {/* Check out Display */}
                    <div style={{ flex: 1, padding: '14px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Check out</div>
                        <div style={{ fontSize: '14px', color: endDate ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                            {endDate ? endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates'}
                        </div>
                    </div>

                    {/* Date Picker Popup */}
                    <AnimatePresence>
                        {activeField === 'dates' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: '80px',
                                    left: '-50px', // Center it roughly
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '24px',
                                    boxShadow: 'var(--shadow-xl)',
                                    zIndex: 100,
                                    border: '1px solid var(--border-light)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DatePicker
                                    selected={startDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    monthsShown={2}
                                    minDate={new Date()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ width: '1px', backgroundColor: 'var(--border)', margin: '14px 0' }}></div>

                {/* Guest Selector */}
                <div
                    style={{
                        flex: 1.5,
                        padding: '8px 8px 8px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: activeField === 'guests' ? 'white' : 'transparent',
                        boxShadow: activeField === 'guests' ? 'var(--shadow-md)' : 'none',
                        zIndex: activeField === 'guests' ? 10 : 1,
                        position: 'relative',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => setActiveField('guests')}
                    onMouseEnter={(e) => { if (activeField !== 'guests') e.currentTarget.style.backgroundColor = 'var(--border-light)'; }}
                    onMouseLeave={(e) => { if (activeField !== 'guests') e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Who</div>
                        <div style={{ fontSize: '14px', color: guests.adults + guests.children > 0 ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                            {getTotalGuests()}
                        </div>
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSearch();
                        }}
                        style={{
                            background: 'var(--primary-gradient)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
                        }}
                    >
                        <FaSearch size={18} />
                    </div>

                    {/* Guest Dropdown */}
                    <AnimatePresence>
                        {activeField === 'guests' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: '80px',
                                    right: 0,
                                    width: '400px',
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '24px',
                                    boxShadow: 'var(--shadow-xl)',
                                    zIndex: 100,
                                    cursor: 'default',
                                    border: '1px solid var(--border-light)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {[
                                    { type: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
                                    { type: 'children', label: 'Children', sub: 'Ages 2–12' },
                                    { type: 'infants', label: 'Infants', sub: 'Under 2' },
                                    { type: 'pets', label: 'Pets', sub: 'Bringing a service animal?' }
                                ].map((item, index) => (
                                    <div key={item.type} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px 0',
                                        borderBottom: index !== 3 ? '1px solid var(--border-light)' : 'none'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>{item.label}</div>
                                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.sub}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <button
                                                onClick={() => updateGuest(item.type, 'dec')}
                                                disabled={item.type === 'adults' ? guests[item.type] <= 1 : guests[item.type] <= 0}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: (item.type === 'adults' ? guests[item.type] <= 1 : guests[item.type] <= 0) ? 'not-allowed' : 'pointer',
                                                    opacity: (item.type === 'adults' ? guests[item.type] <= 1 : guests[item.type] <= 0) ? 0.3 : 1,
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                                                onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = 'var(--border)'; }}
                                            >
                                                <FaMinus size={12} color="var(--text-secondary)" />
                                            </button>
                                            <span style={{ width: '24px', textAlign: 'center', fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>{guests[item.type]}</span>
                                            <button
                                                onClick={() => updateGuest(item.type, 'inc')}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
                                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                            >
                                                <FaPlus size={12} color="var(--text-secondary)" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchExpanded;
