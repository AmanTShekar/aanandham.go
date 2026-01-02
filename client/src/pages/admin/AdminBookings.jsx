import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await adminAPI.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await adminAPI.updateBooking(bookingId, { status: newStatus });
            fetchBookings();
        } catch (error) {
            console.error('Failed to update booking:', error);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.listing?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#008A05';
            case 'cancelled': return '#dddddd';
            default: return '#E07912';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'confirmed': return '#E6F4E7';
            case 'cancelled': return '#f7f7f7';
            default: return '#FFF8E6';
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading bookings...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            Bookings Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all reservations and booking statuses
                        </p>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        {bookings.length} Total Bookings
                    </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#717171' }} />
                    <input
                        type="text"
                        placeholder="Search by guest name or property title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            border: '2px solid #E8E8E8',
                            borderRadius: '12px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
                    />
                </div>

                {/* Bookings Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #E8E8E8'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E8E8E8' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Property</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Guest</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Dates</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Total</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600', color: '#222', fontSize: '14px' }}>
                                            {booking.listing?.title || 'Deleted Listing'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: '#717171',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                fontWeight: '700'
                                            }}>
                                                {booking.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span style={{ fontSize: '14px', color: '#222' }}>
                                                {booking.user?.name || 'Unknown User'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                        ${booking.totalPrice}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: getStatusBg(booking.status),
                                            color: getStatusColor(booking.status),
                                            textTransform: 'capitalize'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                        title="Confirm Booking"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            border: 'none',
                                                            backgroundColor: '#E6F4E7',
                                                            color: '#008A05',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                        title="Cancel Booking"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            border: 'none',
                                                            backgroundColor: '#FFE8EC',
                                                            color: '#FF385C',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <FaTimesCircle />
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #E8E8E8',
                                                        backgroundColor: 'white',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminBookings;
