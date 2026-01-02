import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packagesAPI } from '../services/api';

const TravelPackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState('All');

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await packagesAPI.getAllPackages();
                setPackages(data);
            } catch (error) {
                console.error('Failed to fetch packages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const filterPackages = (pkg) => {
        if (selectedDuration === 'All') return true;
        const days = parseInt(pkg.duration);
        if (isNaN(days)) return true;

        if (selectedDuration === 'Short (< 5 Days)') return days < 5;
        if (selectedDuration === 'Medium (5-10 Days)') return days >= 5 && days <= 10;
        if (selectedDuration === 'Long (> 10 Days)') return days > 10;
        return true;
    };

    const filteredPackages = packages.filter(filterPackages);
    const durationOptions = ['All', 'Short (< 5 Days)', 'Medium (5-10 Days)', 'Long (> 10 Days)'];

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Travel Packages</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px' }}>
                Curated travel experiences designed to give you the best of each destination. Flights, accommodation, and tours included.
            </p>

            {/* Duration Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
                {durationOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => setSelectedDuration(option)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: selectedDuration === option ? '2px solid var(--text-main)' : '1px solid var(--border)',
                            backgroundColor: selectedDuration === option ? 'var(--bg-off-white)' : 'white',
                            fontWeight: selectedDuration === option ? '600' : '400',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                {filteredPackages.map((pkg) => (
                    <Link to={`/packages/${pkg._id}`} key={pkg._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            background: 'white',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '240px', overflow: 'hidden' }}>
                                <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                />
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{pkg.title}</h3>
                                    <span style={{
                                        background: 'var(--bg-off-white)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>{pkg.duration}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {pkg.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>Starting from</span>
                                        <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '20px' }}>${pkg.price}</div>
                                    </div>
                                    <button className="btn-primary">View Details</button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TravelPackagesPage;
