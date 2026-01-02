import { useState, useEffect } from 'react';
import { bookingsAPI, authAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const TripsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = authAPI.getCurrentUser();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                const data = await bookingsAPI.getMyBookings();
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Failed to load your trips. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user?.id]);

    if (!user) {
        return (
            <div style={{ padding: '80px 40px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>Trips</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Please log in to view your trips.</p>
                <Link to="/login" style={{
                    padding: '14px 32px',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    Log in
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '80px 40px', maxWidth: '1280px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>Trips</h1>
                <div style={{ color: 'var(--text-secondary)' }}>Loading your trips...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '80px 40px', maxWidth: '1280px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>Trips</h1>
                <div style={{ color: '#c13515' }}>{error}</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1280px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', color: 'var(--text-main)' }}>Trips</h1>

            {bookings.length === 0 ? (
                <div style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>No trips booked... yet!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Time to dust off your bags and start planning your next adventure.</p>
                    <Link to="/" style={{
                        padding: '14px 24px',
                        border: '1px solid var(--text-main)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: '600',
                        display: 'inline-block',
                        transition: 'all 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Start searching
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {bookings.map((booking) => (
                        <div key={booking._id} style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'var(--bg-white)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={booking.listing?.image}
                                    alt={booking.listing?.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                                    {booking.listing?.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
                                    <FaMapMarkerAlt /> {booking.listing?.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                                    <FaCalendar />
                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid var(--border)',
                                    paddingTop: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--text-main)' }}>
                                        <FaMoneyBillWave color="var(--primary)" /> ${booking.totalPrice}
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: booking.status === 'confirmed' ? '#E6F4E7' : '#FFF8E6',
                                        color: booking.status === 'confirmed' ? '#008A05' : '#E07912',
                                        textTransform: 'capitalize'
                                    }}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TripsPage;
