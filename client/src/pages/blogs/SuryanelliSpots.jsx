import React from 'react';
import { motion } from 'framer-motion';
import { FaWater } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const SuryanelliSpots = () => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            const embedScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
            if (embedScript) document.body.removeChild(embedScript);
        };
    }, []);

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Hidden Waterfalls & Secret Campgrounds in Suryanelli | Aanandham.go"
                description="Explore the unseen side of Munnar. Guide to secret waterfalls in Suryanelli, private campgrounds away from the crowd, and off-road jeep trails."
                keywords="Suryanelli Waterfalls, Secret Camping Spots Munnar, Offbeat Munnar Attractions, Hidden Gems Kerala, Private Tent Stay"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80")',
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
                        Hidden Gems
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Hidden Waterfalls & <br /> Secret Campgrounds
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '1100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                            <p style={{ marginBottom: '30px', fontSize: '20px' }}>
                                Suryanelli is famous for the Kolukkumalai sunrise, but few know about the hidden waterfalls tucked away in its valleys. If you want to escape the jeep crowds, this guide is for you.
                            </p>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>1. The "Phantom" Waterfall</h2>
                            <p style={{ marginBottom: '20px' }}>
                                Located just 20 minutes off-road from the base camp, this waterfall is unnamed on Google Maps. Locals call it the Phantom Falls because it disappears in summer.
                            </p>
                            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', gap: '15px' }}>
                                <FaWater size={30} color="var(--primary)" />
                                <div>
                                    <strong>How to reach:</strong> Ask for the "Old Tea Factory" route. We organize guided treks here for our guests.
                                </div>
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>2. Secret Campgrounds</h2>
                            <p style={{ marginBottom: '20px' }}>
                                Standard campsites can get noisy. Our curated <strong>"Private Valley"</strong> campgrounds are located on private estates accessible only by 4x4. No crowds, just you and the fireflies.
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#ccc', marginBottom: '30px' }}>
                                <li style={{ marginBottom: '10px' }}><strong>Tea Border Camp:</strong> Pitched right on the edge of the tea plantation.</li>
                                <li><strong>Cliff Edge Glamp:</strong> For adrenaline junkies who want a room with a view (literally).</li>
                            </ul>

                            <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '60px', border: '1px solid #333' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Want to find these spots?</h3>
                                <p style={{ color: '#999', marginBottom: '24px' }}>
                                    We don't publish coordinates publicly to protect nature. Book a stay with us to get the secret map.
                                </p>
                                <Link to="/hotels" style={{
                                    display: 'inline-block',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '16px 40px',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}>
                                    Explore Stays
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Instagram Reel */}
                    <div>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Explore More</h3>
                            <div style={{ background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-permalink="https://www.instagram.com/reel/DHvlJS2y0CS/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    data-instgrm-version="14"
                                    style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                                >
                                </blockquote>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <a href="https://www.instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                                    Follow @aanandham.go on Instagram
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SuryanelliSpots;
