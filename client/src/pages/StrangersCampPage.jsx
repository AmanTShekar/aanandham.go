import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCampground, FaUserFriends, FaFire, FaHiking } from 'react-icons/fa';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const StrangersCampPage = () => {
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
                title="Strangers to Friends: #1 Viral Camping Event in Munnar | Aanandham.go"
                description="Join Kerala's most popular camping event. Strangers to Friends is the ultimate solo traveler meet-up in Suryanelli, Munnar. Campfire, Trekking, & New Connections."
                keywords="Strangers to Friends Camp, Best Camping for Singles India, Solo Trip Kerala, Munnar Group Trip, Weekend Getaway from Kochi, Safe Solo Travel for Women, Kolukkumalai Sunrise Trek Package, Aanandham.go Viral Reels"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": "Strangers to Friends Camping Edition",
                    "startDate": "2025-01-20T16:00",
                    "endDate": "2025-01-21T10:00",
                    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                    "eventStatus": "https://schema.org/EventScheduled",
                    "location": {
                        "@type": "Place",
                        "name": "Aanandham.go Base Camp",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Suryanelli Estate",
                            "addressLocality": "Munnar",
                            "postalCode": "685618",
                            "addressRegion": "Kerala",
                            "addressCountry": "IN"
                        }
                    },
                    "image": [
                        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
                        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7"
                    ],
                    "description": "The ultimate social camping experience in Munnar. Meet new friends, enjoy a campfire, and trek to Kolukkumalai.",
                    "offers": {
                        "@type": "Offer",
                        "price": "1499",
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock",
                        "url": "https://aanandham.in/stories/strangers-camp"
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": "Aanandham.go",
                        "url": "https://aanandham.in"
                    }
                }}
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
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase' }}
                    >
                        Community Experience
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Strangers to Friends: <br /> A Camping Story
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                    {/* Main Story Content */}
                    <div>
                        <p style={{ fontSize: '20px', lineHeight: '1.8', color: '#e5e5e5', marginBottom: '30px' }}>
                            Looking for the <strong>#1 Community Camping Experience in Munnar</strong>?
                            Join our signature <strong>Strangers to Friends</strong> event.
                            Perfect for <strong>Solo Travelers, Couples, and Groups</strong> looking to meet new people.
                            We offer verified <strong>Safe Tent Stays</strong> in Suryanelli with premium <strong>Luxury Glamping</strong> vibes.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#a1a1aa', marginBottom: '24px' }}>
                            We noticed that many people trekking to **Kolukkumalai** or visiting **Suryanelli** were doing it alone. They wanted the adventure, but they also craved connection. So we launched the "Strangers to Friends" edition—a curated camping experience designed to break the ice.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#a1a1aa', marginBottom: '40px' }}>
                            No cliques allowed. Just a warm campfire, a sky full of stars (Verified Stargazing spots), and stories from around the world.
                        </p>

                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>What Happens at the Camp?</h2>

                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaUserFriends size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Ice-Breaking Sessions</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>Curated games and conversation starters that actually work. Skip the small talk.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaFire size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Campfire & Music</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>Unplugged acoustic sessions around a safe, controlled fire pit under the milky way.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaHiking size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Sunrise Trek</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>We wake up at 4 AM for a jeep safari to Kolukkumalai to watch the sunrise as a tribe.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/hotels?search=Suryanelli" style={{
                            display: 'inline-block',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            marginTop: '20px'
                        }}>
                            Book Your Spot
                        </Link>
                    </div>

                    {/* Instagram Reel Sidebar */}
                    <div>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>The Viral Vibe</h3>
                            <div style={{ background: '#111', borderRadius: '24px', padding: '12px', border: '1px solid #333' }}>
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

export default StrangersCampPage;
