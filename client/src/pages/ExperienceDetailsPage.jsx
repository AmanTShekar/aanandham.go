import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { experiencesAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
const ExperienceDetailsPage = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                const data = await experiencesAPI.getExperienceById(id);
                setExperience(data);
            } catch (error) {
                console.error('Failed to fetch experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!experience) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Experience not found</div>;
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '80px' }}>
            <SEO
                title={`${experience.title} - Munnar Experiences | Aanandham.go`}
                description={experience.description}
                image={experience.image}
            />

            {/* Mobile Header Image */}
            <div className="mobile-only" style={{ height: '300px', width: '100%' }}>
                <img src={experience.image} alt={experience.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div className="container" style={{ paddingTop: '40px' }}>
                {/* Desktop Header Gallery (Simplified) */}
                <div className="desktop-only" style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '16px',
                    height: '400px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    marginBottom: '40px'
                }}>
                    <img src={experience.image} alt={experience.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
                        <img src={experience.images?.[0] || experience.image} alt="Experience detail 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={experience.images?.[1] || experience.image} alt="Experience detail 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div className="experience-grid-responsive">
                    {/* Main Content */}
                    <div>
                        <div style={{ paddingBottom: '32px', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {experience.category}
                            </span>
                            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', margin: '8px 0', lineHeight: '1.2' }}>
                                {experience.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '16px', color: 'var(--text-secondary)' }}>
                                <span>{experience.location}</span>
                                <span>•</span>
                                <span>{experience.duration}</span>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '32px', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
                            <img
                                src={experience.host?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                alt={`Host ${experience.host?.name}`}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: '700' }}>Hosted by {experience.host?.name || 'Local Guide'}</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Certified Experience Host</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ paddingBottom: '32px', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>What you'll do</h2>
                            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {experience.description}
                            </p>
                        </div>

                        {/* Itinerary */}
                        {experience.itinerary && experience.itinerary.length > 0 && (
                            <div style={{ paddingBottom: '32px', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Itinerary</h2>
                                <div style={{ borderLeft: '2px solid var(--border-light)', paddingLeft: '32px', marginLeft: '10px' }}>
                                    {experience.itinerary.map((item, idx) => (
                                        <div key={idx} style={{ position: 'relative', marginBottom: '32px' }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: '-41px',
                                                top: '0',
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                background: 'var(--primary)',
                                                border: '4px solid white'
                                            }} />
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>{item.time}</div>
                                            <div style={{ fontSize: '18px', fontWeight: '600' }}>{item.activity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions */}
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>What's included</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                {experience.inclusions && experience.inclusions.map((inc, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        backgroundColor: 'var(--bg-glass)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        fontWeight: '600'
                                    }}>
                                        <span style={{ color: 'var(--primary)', fontSize: '20px' }}>✓</span>
                                        {inc}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Card */}
                    <div>
                        <div style={{
                            position: 'sticky',
                            top: '120px',
                            borderRadius: '24px',
                            padding: '32px',
                            boxShadow: 'var(--shadow-xl)',
                            backgroundColor: 'var(--bg-glass)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800' }}>₹{experience.price}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>/ person</span>
                            </div>

                            <div style={{
                                border: '1px solid var(--border-light)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                                    <div>{experience.date || 'Select Date'}</div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Category</div>
                                    <div>{experience.category}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '18px',
                                    borderRadius: '12px',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    marginBottom: '16px'
                                }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            >
                                Reserve Spot
                            </button>

                            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                You won't be charged yet
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    listing={experience}
                    isExperience={true}
                />
            </div>
        </div>
    );
};

export default ExperienceDetailsPage;
