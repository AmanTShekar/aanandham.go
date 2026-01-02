import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaWifi, FaCoffee, FaSwimmingPool, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';

const PremiumListingCard = ({ listing, index }) => {
    const navigate = useNavigate();
    const { formatPrice } = usePreferences();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={{
                display: 'flex',
                flexDirection: 'column', // Changed to column for grid
                background: 'var(--bg-off-white)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                height: '100%', // Full height of grid cell
                minHeight: '480px'
            }}
            onClick={() => navigate(`/listings/${listing._id || listing.id}`)}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        >
            {/* Image Section */}
            <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={listing.image}
                    alt={`${listing.title} - Luxury Stay in ${listing.location}`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
                    {listing.category}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0, lineHeight: '1.4' }}>{listing.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#333', padding: '4px 8px', borderRadius: '8px', flexShrink: 0 }}>
                            <FaStar color="#FFD700" size={12} />
                            <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>{listing.rating}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', marginBottom: '16px' }}>
                        <FaMapMarkerAlt size={14} flexShrink={0} />
                        <span style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.location}</span>
                    </div>

                    {/* Amenities Preview */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {listing.amenities?.slice(0, 3).map((amenity, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '12px', background: '#262626', padding: '4px 10px', borderRadius: '6px' }}>
                                {amenity}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #333' }}>
                    <div>
                        <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block' }}>Starts from</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>{formatPrice(listing.price)}</span>
                            <span style={{ color: '#a1a1aa', fontSize: '13px' }}>/ night</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PremiumListingCard;
