import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWind, FaCampground, FaMapMarkerAlt, FaCloud } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const VagamonGuide = () => {
    useEffect(() => {
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
                title="Vagamon Glamping Guide 2025: Pine Forests & Rolling Meadows | Aanandham.go"
                description="The ultimate guide to glamping in Vagamon. Discover the best pine forest stays, paragliding spots, and luxury tent stays in Kerala's Scotland."
                keywords="Vagamon Glamping, Vagamon Camping, Vagamon Premium Camping, Vagamon Tent Stay, Vagamon Pine Forest Stay, Paragliding Vagamon, Best Camping Vagamon, Vagamon Meadows Trek, Vagamon Glamping Packages, Kerala Glamping Vagamon"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": "Vagamon Glamping Guide 2025: Pine Forests & Rolling Meadows",
                    "description": "The ultimate guide to glamping in Vagamon. Discover the best pine forest stays, paragliding spots, and luxury tent stays in Kerala's Scotland.",
                    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
                    "author": {
                        "@type": "Brand",
                        "name": "Aanandham.go"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Aanandham.go",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://aanandham.in/pnglogo.svg"
                        }
                    },
                    "datePublished": "2025-01-07"
                }}
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80")',
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
                        Scotland of Asia
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Vagamon Glamping & <br /> Pine Forest Guide
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '1100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                            <p style={{ marginBottom: '30px', fontSize: '20px' }}>
                                Often called the <strong>Scotland of Asia</strong>, Vagamon is a misty paradise of rolling green meadows, pine forests, and Orchid gardens. Unlike the rugged adventure of Munnar, Vagamon offers a more <strong>serene glamping experience</strong> perfect for slow travel and soul-searching.
                            </p>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>1. The Pine Forest Experience</h2>
                            <p style={{ marginBottom: '20px' }}>
                                Imagine waking up surrounded by towering pine trees as the morning mist filters through the branches. Our verified <strong>Pine Forest Stays</strong> offer eco-friendly glamping pods that blend perfectly with the environment.
                            </p>
                            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #333' }}>
                                <FaCampground size={30} color="var(--primary)" style={{ marginBottom: '10px' }} />
                                <p><strong>Pro Tip:</strong> Visit the Pine Forests during sunset for the most magical golden-hour photography in Idukki.</p>
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>2. Paragliding over the Meadows</h2>
                            <p style={{ marginBottom: '20px' }}>
                                Vagamon is the paragliding hub of Kerala. If you're staying at one of our <strong>premium glamping sites</strong>, you're never more than 15 minutes away from the take-off points.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
                                    <FaWind size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
                                    <h4 style={{ fontWeight: '700' }}>Tandem Flights</h4>
                                    <p style={{ fontSize: '14px', color: '#888' }}>Fly with experts over the lush green valleys. Booking available via aanandham.go.</p>
                                </div>
                                <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
                                    <FaCloud size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
                                    <h4 style={{ fontWeight: '700' }}>Best Season</h4>
                                    <p style={{ fontSize: '14px', color: '#888' }}>September to February offers the best wind conditions for flight.</p>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>3. Vagamon Premium Camping & Glamping Packages</h2>
                            <p style={{ marginBottom: '30px' }}>
                                For those seeking the <strong>best camping in Vagamon</strong>, our premium packages include everything from traditional A-frame tents to luxury pods. Whether you are looking for a solo retreat or a group experience, <strong>Vagamon glamping</strong> with Aanandham ensures safety, comfort, and the most stunning views of the Western Ghats.
                            </p>

                            <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '60px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Ready for a Misty Retreat?</h3>
                                <p style={{ color: '#999', marginBottom: '24px' }}>Book the most aesthetic Pine Forest stays in Vagamon.</p>
                                <Link to="/hotels?search=Vagamon" style={{
                                    display: 'inline-block',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '16px 40px',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    textDecoration: 'none'
                                }}>
                                    Explore Vagamon Stays
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Instagram Reel */}
                    <div>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Vagamon Vibes</h3>
                            <div style={{ background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-permalink="https://www.instagram.com/reel/DBlAks-S2lP/?utm_source=ig_embed&amp;utm_campaign=loading"
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

export default VagamonGuide;
