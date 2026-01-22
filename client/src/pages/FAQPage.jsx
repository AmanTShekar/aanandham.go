import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaCampground, FaMapMarkerAlt, FaShieldAlt, FaUtensils, FaTshirt, FaHiking, FaInfoCircle } from 'react-icons/fa';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const FAQPage = () => {
    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            const embedScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
            if (embedScript) document.body.removeChild(embedScript);
        };
    }, []);

    const categories = [
        {
            title: "Munnar & Suryanelli",
            items: [
                {
                    icon: <FaMapMarkerAlt />,
                    q: "Where exactly is Suryanelli compared to Munnar?",
                    a: "Suryanelli is located about 25km (1 hour drive) from Munnar town. It's much higher in altitude and is the base point for the famous Kolukkumalai trekking and sunrise viewpoints."
                },
                {
                    icon: <FaShieldAlt />,
                    q: "Are tent stays safe for solo female travelers and couples?",
                    a: "Yes! Aanandham.go only lists verified campsites with 24/7 on-site staff, fenced perimeters, and CCTV in common areas."
                },
                {
                    icon: <FaTshirt />,
                    q: "What should I pack for a night stay in Suryanelli?",
                    a: "Nights can get very cold (as low as 5°C). Pack heavy woolens, thermal wear, hiking shoes, and power banks."
                },
                {
                    icon: <FaInfoCircle />,
                    q: "Is alcohol or smoking allowed at the campsite?",
                    a: "Moderate consumption is allowed within your private tent area. However, loud music and creating a public nuisance are strictly prohibited to ensure a peaceful experience for everyone."
                }
            ]
        },
        {
            title: "Vagamon & Others",
            items: [
                {
                    icon: <FaCampground />,
                    q: "What makes Vagamon camping different?",
                    a: "Vagamon is the 'Scotland of Asia'. Camping here is focused on rolling meadows, pine forests, and paragliding activities. It's generally less crowded than Munnar."
                },
                {
                    icon: <FaHiking />,
                    q: "Do I need to book treks separately?",
                    a: "Most of our stays include a base trek. However, major treks like Kolukkumalai or Meesapulimala can be added as 'Experiences' during checkout."
                },
                {
                    icon: <FaInfoCircle />,
                    q: "Is 5G/Mobile network available at the camps?",
                    a: "Airtel and Jio usually have decent 4G/5G coverage at the Suryanelli base camps. However, once you trek up to Kolukkumalai peak, you should expect zero network—the perfect digital detox!"
                }
            ]
        },
        {
            title: "Safety & Logistics",
            items: [
                {
                    icon: <FaShieldAlt />,
                    q: "Are there wild animals near the tents?",
                    a: "Our campsites are located near forest fringes, but they are protected by solar fencing and 24/7 local guards. While wild elephant sightings are possible from a distance, our sites are safe and verified."
                },
                {
                    icon: <FaMapMarkerAlt />,
                    q: "Can we reach the camp in our own car (Swift/i20)?",
                    a: "Yes! All our base camps are accessible by any standard car (Hatchback/Sedan). Only the final off-road stretch to the sunrise peak requires a 4x4 Jeep, which we provide as part of the package."
                },
                {
                    icon: <FaInfoCircle />,
                    q: "How do I get a refund if it rains?",
                    a: "Camping is a monsoon-friendly activity in Kerala. We provide waterproof A-frame tents. Cancellations due to weather are only processed if there's an official government red alert (Red Alert) for the region."
                }
            ]
        }
    ];

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="FAQ | Travel & Camping Guide Kerala | Aanandham.go"
                description="Everything you need to know about camping in Munnar, Suryanelli, and Vagamon. Answers to safety, packing, locations, and booking questions."
                keywords="Munnar FAQ, Suryanelli Camping Questions, Vagamon Stay Info, Kerala Glamping Guide"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": categories.flatMap(cat => cat.items.map(item => ({
                        "@type": "Question",
                        "name": item.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.a
                        }
                    })))
                }}
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '40vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1504280390367-361c6d9e6342?w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '900', letterSpacing: '-2px' }}
                    >
                        How can we <span style={{ color: 'var(--primary)' }}>help?</span>
                    </motion.h1>
                    <p style={{ color: '#aaa', fontSize: '18px', marginTop: '10px' }}>Your ultimate guide to camping and trekking with Aanandham.go.</p>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '1100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                    {/* Left: FAQ Sections */}
                    <div style={{ gridColumn: 'span 2' }}>
                        {categories.map((cat, idx) => (
                            <div key={idx} style={{ marginBottom: '50px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    {cat.title}
                                </h2>
                                {cat.items.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        style={{
                                            background: '#0a0a0a',
                                            padding: '30px',
                                            borderRadius: '20px',
                                            marginBottom: '20px',
                                            border: '1px solid #1a1a1a'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <span style={{ color: 'var(--primary)', fontSize: '24px' }}>{item.icon}</span>
                                            <div>
                                                <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '12px' }}>{item.q}</h3>
                                                <p style={{ color: '#888', lineHeight: '1.7', fontSize: '16px' }}>{item.a}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Right: Instagram & Sidebar */}
                    <div>
                        <div style={{ position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Live from the Camp</h3>
                            <div style={{ background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-permalink="https://www.instagram.com/reel/DHvlJS2y0CS/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    data-instgrm-version="14"
                                    style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                                >
                                </blockquote>
                            </div>

                            <div style={{ marginTop: '40px', padding: '30px', background: 'var(--primary-gradient)', borderRadius: '24px', color: 'black' }}>
                                <h4 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '10px' }}>Still have questions?</h4>
                                <p style={{ marginBottom: '20px', fontWeight: '500' }}>Our agents are ready to help you plan your wild escape.</p>
                                <Link to="/contact" style={{ display: 'block', textAlign: 'center', background: 'black', color: 'white', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>
                                    Chat with Us
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FAQPage;
