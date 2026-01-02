import { FaStar } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ListingReviews = ({ listing, reviews, user, onWriteReview }) => {
    const { t } = usePreferences();

    return (
        <div style={{ paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaStar color="var(--primary)" />
                {listing.rating} · {reviews.length} reviews
            </h3>

            {/* Rating Bars Grid */}
            <div className="reviews-grid-responsive" style={{ marginBottom: '40px' }}>
                {['Cleanliness', 'Accuracy', 'Check-in', 'Communication', 'Location', 'Value'].map((cat) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '500' }}>{cat}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '140px' }}>
                            <div style={{ flex: 1, height: '4px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '95%', height: '100%', background: 'var(--text-main)' }}></div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>4.8</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Cards Grid */}
            <div className="reviews-grid-responsive">
                {reviews.slice(0, 6).map((review) => (
                    <div key={review._id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <img
                                src={review.user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                alt={review.user?.name}
                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>{review.user?.name}</div>
                                <div style={{ fontSize: '14px', color: '#717171' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div style={{ lineHeight: '1.6', fontSize: '15px', color: 'var(--text-main)' }}>
                            {review.comment}
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length > 6 && (
                <button style={{
                    marginTop: '32px',
                    padding: '12px 24px',
                    border: '1px solid var(--text-main)',
                    background: 'transparent',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    Show all {reviews.length} reviews
                </button>
            )}
        </div>
    );
};

export default ListingReviews;
