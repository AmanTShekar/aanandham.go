import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const DestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await destinationsAPI.getAllDestinations();
                setDestinations(data);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading destinations...</div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-off-white)', minHeight: '100vh', padding: '120px 0 80px 0' }}>
            <SEO
                title="Munnar Travel Guide - Top Places to Visit | Aanandham.go"
                description="Explore the hidden gems of Munnar. From the sunrise at Kolukkumalai to the misty trails of Vattavada, discover the best travel destinations in Kerala."
                keywords="Munnar Tourist Places, Kolukkumalai Sunrise, Vattavada Trekking, Suryanelli, Kerala Tourism Guide"
            />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>
                        Curated Travel Guide
                    </span>
                    <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', color: 'var(--text-main)', marginTop: '16px', lineHeight: '1.1' }}>
                        Destinations in Munnar
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '24px auto 0', lineHeight: '1.6' }}>
                        Beyond the tea gardens lie stories of ancient hills, wild forests, and clouds that touch the ground. Here is where you should go.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                    {destinations.map((dest, i) => (
                        <Link to={`/destinations/${dest._id}`} key={dest._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    backgroundColor: 'var(--bg-glass)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            >
                                <div style={{ height: '280px', overflow: 'hidden' }}>
                                    <img
                                        src={dest.image || 'https://images.unsplash.com/photo-1596765792070-07bf10439402?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                        alt={`Visit ${dest.name} - Munnar Tourism`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1596765792070-07bf10439402?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
                                        {dest.name}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px', flex: 1 }}>
                                        {dest.description || "Discover the beauty of this location. Perfect for nature lovers and adventure seekers."}
                                    </p>
                                    <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>
                                        Read Guide <span style={{ marginLeft: '8px' }}>→</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DestinationsPage;
