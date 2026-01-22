import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';

const DestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Parallax
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

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

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading destinations...</div>;

    return (
        <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
            <SEO
                title="Explore Kerala's Hidden Gems - Munnar, Vagamon & Wayanad | Aanandham.go"
                description="Discover the most premium and verified travel destinations in Kerala. From misty tea gardens to rolling meadows, explore the unseen with Aanandham.go."
            />

            <style>{`
                .destinations-bento-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 24px;
                    padding: 40px 0;
                }
                .bento-card {
                    position: relative;
                    border-radius: 32px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .bento-card:hover {
                    transform: translateY(-10px) scale(1.01);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                    border-color: var(--primary);
                }
                .bento-card:hover .card-overlay {
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
                }
                .bento-card:hover img {
                    transform: scale(1.1);
                }
                
                /* Bento Spans */
                .bento-card.large { grid-column: span 8; height: 500px; }
                .bento-card.tall { grid-column: span 4; height: 500px; }
                .bento-card.medium { grid-column: span 4; height: 400px; }
                .bento-card.small { grid-column: span 4; height: 400px; }

                @media (max-width: 1024px) {
                    .bento-card.large, .bento-card.tall, .bento-card.medium, .bento-card.small {
                        grid-column: span 6;
                        height: 400px;
                    }
                }
                @media (max-width: 768px) {
                    .destinations-bento-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .bento-card.large, .bento-card.tall, .bento-card.medium, .bento-card.small {
                        grid-column: span 1;
                        height: 350px;
                        border-radius: 24px;
                    }
                }

                .hero-gradient {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 70%, #0a0a0a 100%);
                    z-index: 1;
                }
            `}</style>

            {/* Cinematic Hero Section */}
            <div style={{ position: 'relative', height: '90vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <motion.div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1920&q=80")',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    y: y, scale: 1.1
                }} />
                <div className="hero-gradient" />

                <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ maxWidth: '800px' }}
                    >
                        <span style={{
                            color: 'var(--primary)', fontWeight: '800', letterSpacing: '6px',
                            textTransform: 'uppercase', fontSize: '14px', display: 'block', marginBottom: '20px'
                        }}>
                            Curated Experiences
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(48px, 8vw, 90px)', fontFamily: 'var(--font-serif)',
                            fontWeight: '900', lineHeight: '0.9', marginBottom: '30px', letterSpacing: '-2px'
                        }}>
                            Explore the <br /><span style={{ color: 'var(--primary)' }}>Unseen</span> Kerala
                        </h1>
                        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', maxWidth: '600px', marginBottom: '40px' }}>
                            From the misty peaks of Munnar to the hidden waterfalls of Wayanad, discover destinations that redefine luxury and adventure.
                        </p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ maxWidth: '500px', position: 'relative' }}
                        >
                            <input
                                type="text"
                                placeholder="Search destinations (e.g. Munnar, Wayanad...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '20px 30px', borderRadius: '100px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', fontSize: '16px', outline: 'none',
                                    backdropFilter: 'blur(10px)', transition: 'all 0.3s'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, color: 'rgba(255,255,255,0.5)' }}
                >
                    <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', margin: '0 auto' }} />
                </motion.div>
            </div>

            <div className="container" style={{ marginTop: '-100px', position: 'relative', zIndex: 3 }}>
                <div className="destinations-bento-grid">
                    {filteredDestinations.map((dest, i) => {
                        // Determine bento size based on index
                        let sizeClass = 'small';
                        if (i % 5 === 0) sizeClass = 'large';
                        else if (i % 5 === 1) sizeClass = 'tall';
                        else sizeClass = 'medium';

                        return (
                            <Link to={`/destinations/${dest._id}`} key={dest._id} style={{ textDecoration: 'none', gridColumn: sizeClass === 'large' ? 'span 8' : sizeClass === 'tall' ? 'span 4' : 'span 4' }}>
                                <motion.div
                                    className={`bento-card ${sizeClass}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <img
                                        src={dest.image || 'https://images.unsplash.com/photo-1596765792070-07bf10439402?auto=format&fit=crop&w=800&q=80'}
                                        alt={dest.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                    />
                                    <div className="card-overlay" style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                                        transition: 'background 0.3s ease'
                                    }} />

                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                                    }}>
                                        <h3 style={{
                                            fontSize: sizeClass === 'large' ? '42px' : '28px',
                                            fontWeight: '900', color: 'white', marginBottom: '12px',
                                            fontFamily: 'var(--font-serif)'
                                        }}>
                                            {dest.name}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.5',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden', marginBottom: '20px'
                                        }}>
                                            {dest.description || "Discover the hidden magic of this premium Kerala destination."}
                                        </p>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            color: 'var(--primary)', fontWeight: '700', fontSize: '14px',
                                            textTransform: 'uppercase', letterSpacing: '2px'
                                        }}>
                                            Explore Guide <span style={{ fontSize: '20px' }}>→</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Newsletter / CTA Section */}
            <section style={{ padding: '100px 0', textAlign: 'center', background: 'linear-gradient(to bottom, #0a0a0a, #000)' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'rgba(255,255,255,0.03)', padding: '80px 40px',
                            borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '20px' }}>Want to see the Unseen?</h2>
                        <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px' }}>
                            Join our community of explorers and get exclusive access to hidden trails and premium glamping spots.
                        </p>
                        <Link to="/signup" style={{
                            display: 'inline-block', padding: '18px 48px', background: 'var(--primary)',
                            color: 'white', borderRadius: '100px', fontWeight: '800', textDecoration: 'none',
                            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)', transition: 'all 0.3s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Join the Community
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default DestinationsPage;
