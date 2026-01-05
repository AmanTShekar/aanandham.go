import { FaStar, FaBed, FaBath, FaRulerCombined, FaUserFriends, FaEnvelope, FaUsers } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';


const ListingBookingCard = ({ listing, reviewsCount, onReserve, onInquire, onGroupInquire }) => {
    const { formatPrice, t } = usePreferences();
    const handleInquireClick = () => {
        if (onInquire) onInquire();
    };

    const handleGroupInquireClick = () => {
        if (onGroupInquire) onGroupInquire();
    };

    const handleReserveClick = () => {
        if (onReserve) onReserve();
    };

    const propertyType = listing.propertyType || 'hotel';
    const bookingType = listing.bookingType || 'instant';
    const supportsGroups = listing.supportsGroups || false;
    const isTent = propertyType === 'tent' || propertyType === 'campsite';
    const isHotel = propertyType === 'hotel' || propertyType === 'resort';

    return (
        <div style={{
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
            position: 'sticky',
            top: '120px'
        }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <span style={{ fontSize: '26px', fontWeight: '700', color: '#222' }}>{formatPrice(listing.price)}</span>
                    <span style={{ color: '#717171', fontSize: '15px' }}> / night</span>
                </div>
            </div>

            {/* Property Type Badge */}
            <div style={{ marginBottom: '16px' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: isTent ? '#10b981' : '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {isTent ? '🏕️ Tent Stay' : '🏨 Hotel'}
                </span>
                {supportsGroups && (
                    <span style={{
                        display: 'inline-block',
                        marginLeft: '8px',
                        padding: '6px 12px',
                        background: '#f59e0b',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        👥 Groups Welcome
                    </span>
                )}
            </div>

            {/* Date & Guest Picker Widget */}

            <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F7F7F7', borderRadius: '16px', border: '1px solid #EBEBEB' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#222' }}>
                        <FaUserFriends style={{ color: '#717171' }} />
                        <span>Up to {listing.details.guests} People</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#222' }}>
                        <FaRulerCombined style={{ color: '#717171' }} />
                        <span>{listing.details.bedrooms * 350} sq ft</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#222' }}>
                        <FaBed style={{ color: '#717171' }} /> {listing.details.beds} {listing.details.beds === 1 ? 'Bed' : 'Beds'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#222' }}>
                        <FaBath style={{ color: '#717171' }} /> {listing.details.baths} {listing.details.baths === 1 ? 'Bath' : 'Baths'}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#717171', marginBottom: '12px', letterSpacing: '0.5px' }}>Top Amenities</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#484848' }}>
                        {listing.amenities?.slice(0, 4).map((amenity, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '4px', height: '4px', background: '#222', borderRadius: '50%', marginTop: '8px' }}></div>
                                {amenity}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Booking Buttons - Different for Hotels vs Tents */}
            {isHotel && bookingType === 'instant' && (
                <button
                    onClick={handleReserveClick}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--primary-gradient)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        transition: 'transform 0.1s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Book Now
                </button>
            )}

            {/* For Tents or Inquiry-based properties */}
            {(isTent || bookingType === 'inquiry') && (
                <button
                    onClick={handleInquireClick}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--primary-gradient)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        transition: 'transform 0.1s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FaEnvelope size={18} />
                    Send Inquiry
                </button>
            )}

            {/* Group Booking Button - Only if property supports groups */}
            {supportsGroups && (
                <button
                    onClick={handleGroupInquireClick}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '16px',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                    }}
                >
                    <FaUsers size={16} />
                    Group/Event Booking
                </button>
            )}

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#717171', marginBottom: '8px' }}>
                {isHotel && bookingType === 'instant' ? 'You won\'t be charged yet' : 'We\'ll respond within 24 hours'}
            </div>

            {supportsGroups && listing.maxGroupSize && (
                <div style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#f59e0b',
                    fontWeight: '600',
                    marginTop: '8px'
                }}>
                    Can accommodate groups up to {listing.maxGroupSize} people
                </div>
            )}
        </div>
    );
};

export default ListingBookingCard;
