import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guidesAPI } from '../services/api';

const GuidesPage = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await guidesAPI.getAllGuides();
                setGuides(data);
            } catch (error) {
                console.error('Failed to fetch guides:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);

    const categories = ['All', ...new Set(guides.map(g => g.category))];
    const filteredGuides = selectedCategory === 'All'
        ? guides
        : guides.filter(g => g.category === selectedCategory);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Travel Guides</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px' }}>
                Expert advice, tips, and inspiration for your next journey.
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: selectedCategory === cat ? '2px solid var(--text-main)' : '1px solid var(--border)',
                            backgroundColor: selectedCategory === cat ? 'var(--bg-off-white)' : 'white',
                            fontWeight: selectedCategory === cat ? '600' : '400',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {filteredGuides.map((guide) => (
                    <Link to={`/guides/${guide._id}`} key={guide._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-md)',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--primary)',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '8px'
                                }}>
                                    {guide.category}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.4' }}>{guide.title}</h3>
                                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                                    {new Date(guide.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GuidesPage;
