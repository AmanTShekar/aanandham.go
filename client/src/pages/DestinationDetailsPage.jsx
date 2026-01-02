import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import { FaMoneyBillWave, FaLanguage, FaCalendarAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const DestinationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const data = await destinationsAPI.getDestinationById(id);
                setDestination(data);
            } catch (error) {
                console.error('Failed to fetch destination:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading...</div>;
    if (!destination) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Destination not found</div>;

    return (
        <div style={{ paddingBottom: '80px', backgroundColor: 'var(--bg-off-white)' }}>
            <SEO
                title={`${destination.name} - Travel Guide & Tips | Aanandham.go`}
                description={`Plan your trip to ${destination.name}. ${destination.description || 'Discover the best places to visit, things to do, and where to stay.'}`}
                keywords={`${destination.name} Tourism, Visit ${destination.name}, ${destination.name} Travel Guide, Munnar Attractions`}
                image={destination.image}
            />

            {/* Hero Image */}
            <div style={{ height: '600px', width: '100%', position: 'relative' }}>
                <img src={destination.image} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '60px 0',
                    color: 'white'
                }}>
                    <div className="container">
                        <span style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700', opacity: 0.9, display: 'block', marginBottom: '8px' }}>
                            DESTINATION GUIDE
                        </span>
                        <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: '900', marginBottom: '24px', lineHeight: '1' }}>{destination.name}</h1>
                        <p style={{ fontSize: '24px', maxWidth: '800px', fontWeight: '300', lineHeight: '1.4', opacity: 0.9 }}>{destination.description}</p>
                    </div>
                </div>
            </div>

            <div className="container destination-grid-responsive" style={{ marginTop: '60px' }}>
                {/* Main Content */}
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>About {destination.name}</h2>
                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '50px', whiteSpace: 'pre-line' }}>
                        {destination.details || "Experience the magic of this unique destination. From breathtaking landscapes to rich cultural heritage, there is something for everyone."}
                    </p>

                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>Highlights</h3>
                    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px', padding: 0, listStyle: 'none' }}>
                        {destination.highlights && destination.highlights.map((highlight, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '24px',
                                backgroundColor: 'var(--bg-glass)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                fontSize: '16px'
                            }}>
                                <span style={{ color: 'var(--primary)', fontSize: '24px' }}>•</span> {highlight}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sidebar */}
                <div>
                    <div style={{
                        padding: '40px',
                        backgroundColor: 'var(--bg-glass)',
                        border: '1px solid var(--border)',
                        borderRadius: '32px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        position: 'sticky',
                        top: '120px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px', color: 'var(--text-main)' }}>Quick Facts</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <FaCalendarAlt size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Best Time to Visit</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px' }}>{destination.bestTimeToVisit || 'All Year Round'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <FaMoneyBillWave size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Currency</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px' }}>{destination.currency || 'INR'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <FaLanguage size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Language</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '16px' }}>{destination.language || 'English, Malayalam'}</div>
                            </div>
                        </div>

                        <button
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '50px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => navigate(`/hotels?search=${encodeURIComponent(destination.name)}`)}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            Find Stays in {destination.name}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationDetailsPage;
