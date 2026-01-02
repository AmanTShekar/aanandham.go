import { IoMdTime, IoMdPeople } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ExperienceInfo = ({ experience }) => {
    const { t } = usePreferences();

    return (
        <div>
            {/* Host Info */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                            Experience hosted by {experience.host?.name || 'Local Expert'}
                        </h2>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <IoMdTime size={18} />
                                <span>{experience.duration} hours</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <IoMdPeople size={18} />
                                <span>Up to {experience.groupSize || 10} people</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={experience.host?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                            alt="Host"
                            style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>What you'll do</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
                    {experience.description || 'Join us for an unforgettable experience.'}
                </p>
            </div>

            {/* Included */}
            {experience.included && experience.included.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>What's included</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {experience.included.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-main)' }}>
                                <div style={{ color: 'var(--primary)' }}><FaCheck /></div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceInfo;
