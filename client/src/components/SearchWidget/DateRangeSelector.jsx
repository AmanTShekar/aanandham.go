import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';

const CustomDateInput = ({ value, onClick, placeholder }) => (
    <button
        onClick={onClick}
        style={{
            background: 'transparent',
            border: 'none',
            color: value ? '#222' : '#717171',
            fontSize: '14px',
            fontWeight: value ? '600' : '400',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}
    >
        {value || placeholder}
    </button>
);

const DateRangeSelector = ({ checkIn, checkOut, setCheckIn, setCheckOut }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1 }}>
                <DatePicker
                    selected={checkIn ? new Date(checkIn) : null}
                    onChange={(date) => setCheckIn(date ? date.toISOString().split('T')[0] : '')}
                    selectsStart
                    startDate={checkIn ? new Date(checkIn) : null}
                    endDate={checkOut ? new Date(checkOut) : null}
                    placeholderText="Add dates"
                    customInput={<CustomDateInput placeholder="Check in" />}
                    dateFormat="MMM d"
                    minDate={new Date()}
                />
            </div>
            <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 12px' }}></div>
            <div style={{ flex: 1 }}>
                <DatePicker
                    selected={checkOut ? new Date(checkOut) : null}
                    onChange={(date) => setCheckOut(date ? date.toISOString().split('T')[0] : '')}
                    selectsEnd
                    startDate={checkIn ? new Date(checkIn) : null}
                    endDate={checkOut ? new Date(checkOut) : null}
                    minDate={checkIn ? new Date(checkIn) : new Date()}
                    placeholderText="Add dates"
                    customInput={<CustomDateInput placeholder="Check out" />}
                    dateFormat="MMM d"
                />
            </div>
        </div>
    );
};

export default DateRangeSelector;
