import { FaStar } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ExperienceBookingCard = ({ experience, onReserve }) => {
    const { formatPrice, t } = usePreferences();

    return (
        <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-floating)',
            backgroundColor: 'var(--bg-white)',
            position: 'sticky',
            top: '120px'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-main)' }}>From {formatPrice(experience.price)}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>/ person</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--text-main)' }}>
                    <FaStar size={12} color="var(--accent)" />
                    <span style={{ fontWeight: '600' }}>{experience.rating}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>({experience.reviews} reviews)</span>
                </div>
            </div>

            <button
                onClick={onReserve}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'var(--shadow-md)';
                }}
            >
                Book Experience
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                You won't be charged yet
            </div>
        </div>
    );
};

export default ExperienceBookingCard;
