import { FaStar, FaChevronDown, FaBed, FaBath, FaRulerCombined, FaUserFriends } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';


const ListingBookingCard = ({ listing, reviewsCount, onReserve }) => {
    const { formatPrice, t } = usePreferences();
    const handleReserveClick = () => {
        if (onReserve) onReserve();
    };

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

            {/* Room Specs / Details */}
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
                    marginBottom: '16px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.1s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                Check Availability
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#717171', marginBottom: '24px' }}>
                You won't be charged yet
            </div>


        </div>
    );
};

export default ListingBookingCard;
