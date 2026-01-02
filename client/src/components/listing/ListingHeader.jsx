import { FaStar, FaShare, FaRegHeart, FaHeart } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ListingHeader = ({ listing, reviewsCount, isInWishlist, onWishlistToggle, wishlistLoading }) => {
    const { t } = usePreferences();

    return (
        <>
            <h1 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                {listing.title || listing.location}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    <FaStar size={14} color="var(--accent)" />
                    <span style={{ fontWeight: '600' }}>{listing.rating}</span>
                    <span>·</span>
                    <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'var(--text-main)' }}>{reviewsCount} {t('reviews')}</span>
                    <span>·</span>
                    <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'var(--text-secondary)' }}>{listing.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                        <FaShare size={16} /> {t('share')}
                    </div>
                    <div
                        onClick={onWishlistToggle}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                            opacity: wishlistLoading ? 0.6 : 1,
                            color: 'var(--text-main)'
                        }}
                    >
                        {isInWishlist ? (
                            <FaHeart size={16} color="var(--primary)" />
                        ) : (
                            <FaRegHeart size={16} />
                        )}
                        {t('save')}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingHeader;
