import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendar, FaUsers, FaUser, FaEnvelope, FaCreditCard, FaPrint, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { bookingsAPI, authAPI } from '../services/api';
import { usePreferences } from '../contexts/PreferencesContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const BookingModal = ({ isOpen, onClose, listing, isExperience = false, isPackage = false, initialData }) => {
    // If initialData has a room, start at details. Else start at rooms.
    const [step, setStep] = useState(initialData?.room ? 'details' : 'rooms');
    const [selectedRoom, setSelectedRoom] = useState(initialData?.room || null);
    const [startDate, setStartDate] = useState(initialData?.startDate || null);
    const [endDate, setEndDate] = useState(initialData?.endDate || null);
    const [guests, setGuests] = useState(initialData?.guests || 1);

    // Mock Room Types with realistic OTA data
    const roomTypes = [
        {
            id: 'standard',
            name: `${listing.title} - Standard`,
            description: 'Comfortable stay with all essential amenities.',
            price: listing.price,
            features: ['1 Queen Bed', 'City View', 'Free Wi-Fi'],
            capacity: 2,
            size: 350,
            cancellation: 'Free cancellation until 24h before',
            left: 5,
            image: listing.images?.[0] || listing.image
        },
        {
            id: 'deluxe',
            name: 'Deluxe Suite w/ Balcony',
            description: 'Extra space with private outdoor seating and premium view.',
            price: Math.round(listing.price * 1.4),
            features: ['1 King Bed', 'Ocean/City View', 'Balcony', 'Work Desk'],
            capacity: 3,
            size: 500,
            cancellation: 'Free cancellation',
            recommended: true,
            left: 2,
            image: listing.images?.[1] || listing.image
        },
        {
            id: 'executive',
            name: 'Executive Penthouse',
            description: 'Top-floor luxury with panoramic views and exclusive access.',
            price: Math.round(listing.price * 2.2),
            features: ['2 King Beds', 'Panoramic View', 'Jacuzzi', 'Butler Service', 'Lounge Access'],
            capacity: 4,
            size: 950,
            cancellation: 'Non-refundable',
            left: 1,
            image: listing.images?.[2] || listing.images?.[0] || listing.image
        }
    ];
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const { formatPrice, t } = usePreferences();
    const receiptRef = useRef();

    const user = authAPI.getCurrentUser();

    // Sync initialData when modal opens
    // Sync initialData or Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStartDate(initialData.startDate);
                setEndDate(initialData.endDate);
                setGuests(initialData.guests || 1);
                if (initialData.room) {
                    setSelectedRoom(initialData.room);
                    setStep('details');
                } else {
                    setSelectedRoom(null);
                    setStep('rooms');
                }
            } else {
                // Opened without data (e.g. Sidebar) - Start fresh
                setStep('rooms');
                setSelectedRoom(null);
                setStartDate(null);
                setEndDate(null);
                setGuests(1);
            }
        }
    }, [isOpen, initialData]);

    const calculateNights = () => {
        if (isExperience || isPackage) return 1;
        if (!startDate || !endDate) return 0;
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    const calculateTotal = () => {
        const pricePerNight = selectedRoom ? selectedRoom.price : listing.price;
        const requiredRooms = selectedRoom?.requiredRooms || 1;

        if (isExperience || isPackage) {
            return pricePerNight * guests;
        }
        return calculateNights() * pricePerNight * requiredRooms;
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const bookingData = {
                listingId: listing._id,
                checkIn: format(startDate, 'yyyy-MM-dd'),
                checkOut: format(endDate, 'yyyy-MM-dd'),
                guests,
                totalPrice: calculateTotal()
            };

            if (user) {
                bookingData.userId = user.id || user._id;
            } else {
                bookingData.guest = {
                    name: guestName,
                    email: guestEmail,
                    phone: guestPhone
                };
            }

            const newBooking = await bookingsAPI.createBooking(bookingData);
            setBookingDetails(newBooking);
            setStep('receipt');
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
            setStep('rooms'); // Reset to start
            setStartDate(null);
            setEndDate(null);
            setGuests(1);
            setGuestName('');
            setGuestEmail('');
            setGuestPhone('');
            setBookingDetails(null);
            setSelectedRoom(null);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="booking-modal-content" // Added class for print styling
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0', // Remove padding for window feel
                        maxWidth: step === 'receipt' ? '600px' : '1000px', // Window style
                        width: '95%',
                        height: '85vh', // Fixed height window
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                        {step === 'rooms' ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {/* Header / Filter Section */}
                                <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>Select Your Room</h2>
                                        <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)' }}><FaTimes size={24} /></button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Dates</label>
                                            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaCalendar color="#717171" />
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(dates) => {
                                                        const [start, end] = dates;
                                                        setStartDate(start);
                                                        setEndDate(end);
                                                    }}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    selectsRange
                                                    placeholderText="Select Check-in - Check-out"
                                                    className="custom-datepicker-input"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Guests</label>
                                            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaUsers color="#717171" />
                                                <input
                                                    type="number"
                                                    value={guests}
                                                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    max="20"
                                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Room List Scrollable */}
                                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {roomTypes.map((room) => {
                                            // Auto-Calculate Rooms Needed
                                            const requiredRooms = Math.ceil(guests / room.capacity);
                                            const totalPricePerNight = room.price * requiredRooms;

                                            return (
                                                <div
                                                    key={room.id}
                                                    style={{
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '16px',
                                                        padding: '0',
                                                        backgroundColor: 'white',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                        display: 'flex',
                                                        overflow: 'hidden',
                                                        minHeight: '220px'
                                                    }}
                                                >
                                                    {/* Left: Image */}
                                                    <div style={{ width: '35%', position: 'relative' }}>
                                                        <img
                                                            src={room.image}
                                                            alt={room.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                        {room.recommended && <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#E61E4D', color: 'white', fontWeight: '700', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}>RECOMMENDED</div>}
                                                    </div>

                                                    {/* Right: Content */}
                                                    <div style={{ width: '65%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: '#222' }}>{room.name} x {requiredRooms}</h3>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#222' }}>{formatPrice(totalPricePerNight)}</div>
                                                                    <div style={{ fontSize: '13px', color: '#717171' }}>per night ({requiredRooms} rooms)</div>
                                                                </div>
                                                            </div>

                                                            {requiredRooms > 1 && (
                                                                <div style={{ display: 'inline-block', background: '#FFF8F6', color: '#C13515', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
                                                                    Auto-selected {requiredRooms} rooms for {guests} guests
                                                                </div>
                                                            )}

                                                            <p style={{ color: '#717171', fontSize: '14px', marginBottom: '16px' }}>{room.description}</p>

                                                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#484848', marginBottom: '16px' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaUserFriends /> Max {room.capacity} / room</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaRulerCombined /> {room.size} sq ft</span>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                                            <div style={{ fontSize: '13px', fontWeight: '600', color: room.cancellation.includes('Free') ? '#059669' : '#717171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <FaCheckCircle size={14} /> {room.cancellation}
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRoom({ ...room, requiredRooms }); // Store required count
                                                                    setStep('details');
                                                                }}
                                                                style={{
                                                                    padding: '12px 24px',
                                                                    background: 'var(--primary)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '16px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Select
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : step === 'receipt' ? (
                            <div ref={receiptRef} className="receipt-container">
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ color: '#10B981', fontSize: '48px', marginBottom: '16px' }}>
                                        <FaCheckCircle />
                                    </div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Payment Successful!</h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>Your booking has been confirmed.</p>
                                </div>

                                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px', backgroundColor: '#F9FAFB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Receipt ID</span>
                                        <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{bookingDetails?._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{listing.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{listing.location}</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>Check-in</span>
                                            <span style={{ fontWeight: '600' }}>{format(new Date(bookingDetails?.checkIn), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>Check-out</span>
                                            <span style={{ fontWeight: '600' }}>{format(new Date(bookingDetails?.checkOut), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>Total Amount Paid</span>
                                            <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>{formatPrice(bookingDetails?.totalPrice)}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            <FaCreditCard /> Paid with Card ending in 4242
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }} className="no-print">
                                    <button
                                        onClick={handlePrint}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: 'white',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <FaPrint /> Print Receipt
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                                <style>{`
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .booking-modal-content, .booking-modal-content * {
                                        visibility: visible;
                                    }
                                    .booking-modal-content {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        box-shadow: none !important;
                                    }
                                    .no-print {
                                        display: none !important;
                                    }
                                }
                            `}</style>
                            </div>
                        ) : step === 'payment' ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Payment</h2>
                                    <button onClick={() => setStep('details')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Back</button>
                                </div>

                                <form onSubmit={handlePaymentSubmit}>
                                    <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ fontWeight: '600' }}>Total to pay</span>
                                            <span style={{ fontWeight: '700', fontSize: '18px' }}>{formatPrice(calculateTotal())}</span>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Card Information</label>
                                            <div style={{ position: 'relative' }}>
                                                <FaCreditCard style={{ position: 'absolute', left: '12px', top: '14px', color: '#9CA3AF' }} />
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    defaultValue="4242 4242 4242 4242"
                                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Expiration</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    defaultValue="12/25"
                                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    defaultValue="123"
                                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            background: 'var(--primary-gradient)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1,
                                            boxShadow: 'var(--shadow-md)'
                                        }}
                                    >
                                        {loading ? 'Processing Payment...' : `Pay ${formatPrice(calculateTotal())}`}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>
                                        {user ? (isPackage ? 'Book Package' : t('bookStay')) : t('guestCheckout')}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setStep('rooms')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '600' }}>Change Room</button>
                                        <button
                                            onClick={handleClose}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            <FaTimes size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Room Summary */}
                                {selectedRoom && (
                                    <div style={{ marginBottom: '24px', padding: '12px', background: '#F0FFF4', border: '1px solid #10B981', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Selected Room</div>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>{selectedRoom.name}</div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>{formatPrice(selectedRoom.price)}/night</div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <img
                                            src={listing.image}
                                            alt={listing.title}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: 'var(--radius-md)',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>
                                                {listing.title}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{listing.location}</p>
                                            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
                                                {formatPrice(listing.price)} / {isPackage ? 'person' : t('night')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {!user && (
                                    <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)' }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>{t('guestDetails')}</h4>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                                <FaUser style={{ marginRight: '8px' }} />
                                                {t('fullName')}
                                            </label>
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                placeholder="John Doe"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'var(--bg-white)',
                                                    color: 'var(--text-main)'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                                <FaEnvelope style={{ marginRight: '8px' }} />
                                                {t('email')}
                                            </label>
                                            <input
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                placeholder="john@example.com"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'var(--bg-white)',
                                                    color: 'var(--text-main)'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginTop: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                                Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={guestPhone}
                                                onChange={(e) => setGuestPhone(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'var(--bg-white)',
                                                    color: 'var(--text-main)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>
                                        <FaCalendar style={{ marginRight: '8px' }} />
                                        {isExperience || isPackage ? 'Date' : t('dates')}
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '16px',
                                        backgroundColor: 'var(--bg-white)'
                                    }}>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => {
                                                if (isExperience || isPackage) {
                                                    setStartDate(date);
                                                    setEndDate(date);
                                                } else {
                                                    const [start, end] = date;
                                                    setStartDate(start);
                                                    setEndDate(end);
                                                }
                                            }}
                                            startDate={startDate}
                                            endDate={endDate}
                                            selectsRange={!isExperience && !isPackage}
                                            inline
                                            minDate={new Date()}
                                            monthsShown={1}
                                            dateFormat="yyyy/MM/dd"
                                        />
                                    </div>
                                    {!isExperience && !isPackage && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '12px',
                                            fontSize: '14px',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <div>
                                                <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{t('checkIn')}</span>
                                                {startDate ? format(startDate, 'MMM dd, yyyy') : '-'}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{t('checkOut')}</span>
                                                {endDate ? format(endDate, 'MMM dd, yyyy') : '-'}
                                            </div>
                                        </div>
                                    )}
                                    {(isExperience || isPackage) && startDate && (
                                        <div style={{ marginTop: '12px', textAlign: 'center', fontWeight: '600', color: 'var(--text-main)' }}>
                                            {format(startDate, 'MMM dd, yyyy')}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                        <FaUsers style={{ marginRight: '8px' }} />
                                        {t('guests')}
                                    </label>
                                    <input
                                        type="number"
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                        min="1"
                                        max={listing.details?.guests || 10}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            backgroundColor: 'var(--bg-white)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>

                                {(isExperience || isPackage || calculateNights() > 0) && (
                                    <div style={{
                                        backgroundColor: 'var(--bg-light)',
                                        padding: '16px',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                {(isExperience || isPackage)
                                                    ? `${formatPrice(selectedRoom?.price || listing.price)} x ${guests} guests`
                                                    : `${formatPrice(selectedRoom?.price || listing.price)} x ${calculateNights()} ${t('night')}s`
                                                }
                                            </span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                {formatPrice((isExperience || isPackage) ? (selectedRoom?.price || listing.price) * guests : (selectedRoom?.price || listing.price) * calculateNights())}
                                            </span>
                                        </div>
                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>{t('total')}</span>
                                                <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>
                                                    {formatPrice(calculateTotal())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        if (!user && (!guestName || !guestEmail || !guestPhone)) {
                                            alert('Please enter your name, email, and phone number to continue.');
                                            return;
                                        }
                                        setStep('payment');
                                    }}
                                    disabled={!startDate || !endDate}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'var(--primary-gradient)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: !startDate || !endDate ? 'not-allowed' : 'pointer',
                                        opacity: !startDate || !endDate ? 0.5 : 1,
                                        transition: 'all 0.2s ease',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    Continue to Payment
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingModal;
