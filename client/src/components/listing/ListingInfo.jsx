import { IoMdTrophy } from 'react-icons/io';
import { FaWifi, FaSwimmingPool, FaCar, FaSnowflake } from 'react-icons/fa';
import { MdKitchen, MdOutlinePets } from 'react-icons/md';
import { usePreferences } from '../../contexts/PreferencesContext';

const ListingInfo = ({ listing }) => {
    const { t } = usePreferences();

    const amenityIcons = {
        'Wifi': <FaWifi />,
        'Pool': <FaSwimmingPool />,
        'Kitchen': <MdKitchen />,
        'Free parking': <FaCar />,
        'Air conditioning': <FaSnowflake />,
        'Pets allowed': <MdOutlinePets />
    };

    return (
        <div>
            {/* Host Info */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                            {t('hostedBy')} {listing.host?.name || 'Host'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {listing.details?.guests || 4} {t('guests')} · {listing.details?.bedrooms || 2} {t('bedrooms')} · {listing.details?.beds || 2} {t('beds')} · {listing.details?.baths || 1} {t('baths')}
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={listing.host?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                            alt="Host"
                            style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid var(--border)' }}
                        />
                        {listing.host?.isSuperhost && (
                            <div style={{ position: 'absolute', bottom: 0, right: -4, background: 'var(--primary-gradient)', borderRadius: '50%', padding: '4px', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>
                                <IoMdTrophy color="white" size={12} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>{t('aboutPlace')}</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
                    {listing.description || 'Beautiful property in a great location with all the amenities you need for a comfortable stay.'}
                </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>{t('whatOffers')}</h3>
                    <div className="amenities-grid-responsive">
                        {listing.amenities.map((amenity, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-main)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{amenityIcons[amenity] || '•'}</span> {amenity}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingInfo;
