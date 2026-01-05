import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaLeaf } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const WayanadGlamping = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Top 5 Glamping Spots in Wayanad for Couples | Romantic Getaways"
                description="Discover the most romantic luxury glamping spots in Wayanad. Private forest cabins, glass houses with views, and premium amenities for couples."
                keywords="Wayanad Glamping Couples, Romantic Tent Stay Kerala, Wayanad Honeymoon Resorts, Luxury Camping Wayanad, Forest Cabin Kerala"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase' }}
                    >
                        Romantic Escapes
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Top 5 Glamping Spots <br /> in Wayanad for Couples
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '800px' }}>
                <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                    <p style={{ marginBottom: '30px', fontSize: '20px' }}>
                        Wayanad is Kerala's secret garden. While Munnar is for adventures, Wayanad is for romance. Imagine waking up in a glass dome surrounded by dense rainforest, with the sound of a private waterfall nearby. Here are our top 5 picks for romantic glamping.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '40px' }}>
                        {/* Spot 1 */}
                        <div style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid #333' }}>
                            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80" alt="Glass House" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>1. Nine00 Kandi Glass House</h3>
                                    <div style={{ display: 'flex', gap: '5px', color: 'var(--primary)' }}><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                </div>
                                <p style={{ color: '#aaa', marginBottom: '20px' }}>
                                    Famous for its glass-floored bridge and panoramic views. Sleep under the stars without leaving your bed.
                                </p>
                                <span style={{ background: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', color: '#ccc' }}>Featured: Glass Bridge</span>
                            </div>
                        </div>

                        {/* Spot 2 */}
                        <div style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid #333' }}>
                            <img src="https://images.unsplash.com/photo-1544980649-6f92025e14cb?w=800&q=80" alt="Forest Cabin" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                            <div style={{ padding: '30px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>2. Wild Planet Jungle Stay</h3>
                                <p style={{ color: '#aaa', marginBottom: '20px' }}>
                                    Located deep in the Nilgiri Biosphere. Typical A-frame cabins that offer total seclusion and wildlife spotting from your balcony.
                                </p>
                                <span style={{ background: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', color: '#ccc' }}>Featured: Wildlife</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ fontStyle: 'italic', color: '#888' }}>...Full list available for registered members.</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>Why Choose Glamping?</h2>
                    <p style={{ marginBottom: '30px' }}>
                        Glamping (Glamorous Camping) gives you the best of both worlds. You get the immersive sounds of nature—the crickets, the wind in the trees—along with a king-sized mattress, hot water, and room service. It is the ultimate compromise for couples who want adventure without discomfort.
                    </p>

                    <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '40px', border: '1px solid #333' }}>
                        <FaHeart size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Plan Your Honeymoon</h3>
                        <p style={{ color: '#999', marginBottom: '24px' }}>Get a customized Wayanad itinerary with our travel experts.</p>
                        <Link to="/contact" style={{
                            display: 'inline-block',
                            background: 'white',
                            color: 'black',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none'
                        }}>
                            Contact Us
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WayanadGlamping;
