import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';



const CustomRangeInput = ({ value, onClick, placeholder, textColor, placeholderColor, startDate, endDate }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            background: 'transparent',
            border: 'none',
            color: startDate ? textColor : placeholderColor,
            fontSize: '14px',
            fontWeight: startDate ? '600' : '400',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-sans)',
        }}
    >
        <FaCalendarAlt size={14} style={{ color: placeholderColor }} />
        {startDate ? (
            <span>
                {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                {endDate ? ` - ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
            </span>
        ) : placeholder}
    </button>
);

const DateRangeSelector = ({ checkIn, checkOut, setCheckIn, setCheckOut, theme = 'light' }) => {
    const isDark = theme === 'dark';
    const textColor = isDark ? 'white' : '#222';
    const placeholderColor = isDark ? '#a1a1aa' : '#717171';

    // Helper to safely parse dates (handles empty strings or potential hydration mismatches by checking validity)
    const safeDate = (d) => {
        if (!d) return null;
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const startDate = safeDate(checkIn);
    const endDate = safeDate(checkOut);

    const onChange = (dates) => {
        const [start, end] = dates;
        // Use local time for date string to avoid timezone shifts
        // Accessing YYYY-MM-DD components directly is safer than toLocaleDateString which depends on browser locale/timezone
        const formatDate = (date) => {
            if (!date) return '';
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        setCheckIn(formatDate(start));
        setCheckOut(formatDate(end));
    };

    return (
        <div style={{ width: '100%' }}>
            <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                minDate={new Date()}
                customInput={
                    <CustomRangeInput
                        placeholder="Check in - Check out"
                        textColor={textColor}
                        placeholderColor={placeholderColor}
                        startDate={startDate}
                        endDate={endDate}
                    />
                }
                dateFormat="MMM d"
                isClearable={true}
                placeholderText="Add dates"
            />
        </div>
    );
};

export default DateRangeSelector;
