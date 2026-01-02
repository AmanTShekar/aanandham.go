import { FaUserFriends, FaRulerCombined, FaBed, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ListingRooms = ({ listing, onReserve }) => {
    const { formatPrice } = usePreferences();

    // Mock Room Types (In a real app, this would come from the API)
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

    return (
        <div id="available-rooms" style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>Available Rooms</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {roomTypes.map((room) => (
                    <div key={room.id} className="listing-room-card">
                        {/* Image Section */}
                        <div style={{ position: 'relative', height: '100%', minHeight: '180px' }}>
                            <img
                                src={room.image}
                                alt={room.name}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            {room.recommended && (
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    background: '#E61E4D',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    Top Choice
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div style={{ padding: '8px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#222' }}>{room.name}</h3>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#484848', marginBottom: '12px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaUserFriends /> Max {room.capacity}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaRulerCombined /> {room.size} sq ft</span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {room.features.slice(0, 4).map((feature, i) => (
                                    <span key={i} style={{ fontSize: '12px', background: '#F7F7F7', padding: '4px 8px', borderRadius: '4px', color: '#222', border: '1px solid #EBEBEB' }}>
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: room.cancellation.includes('Free') ? '#059669' : '#717171',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <FaCheckCircle size={12} /> {room.cancellation}
                            </div>
                        </div>

                        {/* Price & Action Section */}
                        <div className="room-price-section">
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#717171', textDecoration: 'line-through' }}>{formatPrice(room.price * 1.2)}</div>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#222' }}>{formatPrice(room.price)}</div>
                                <div style={{ fontSize: '12px', color: '#717171' }}>per night</div>
                            </div>

                            <button
                                onClick={() => onReserve(room)}
                                className="room-reserve-btn"
                            >
                                Reserve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingRooms;
