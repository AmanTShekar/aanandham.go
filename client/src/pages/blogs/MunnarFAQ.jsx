import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaCampground, FaMapMarkerAlt, FaShieldAlt, FaUtensils, FaTshirt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const MunnarFAQ = () => {
    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const faqs = [
        {
            icon: <FaMapMarkerAlt />,
            q: "Where exactly is Suryanelli compared to Munnar?",
            a: "Suryanelli is located about 25km (1 hour drive) from Munnar town. It's much higher in altitude and is the base point for the famous Kolukkumalai trekking and sunrise viewpoints."
        },
        {
            icon: <FaShieldAlt />,
            q: "Are tent stays safe for solo female travelers and couples?",
            a: "Yes! Aanandham.go only lists verified campsites with 24/7 on-site staff, fenced perimeters, and CCTV in common areas. Many sites also offer private 'Glamping' tents with attached washrooms for extra privacy."
        },
        {
            icon: <FaTshirt />,
            q: "What should I pack for a night stay in Suryanelli?",
            a: "Nights can get very cold (as low as 5°C). Must-packs include: Heavy woolens/jackets, thermal wear, hiking shoes, power banks (limited plugs), and personal toiletries."
        },
        {
            icon: <FaUtensils />,
            q: "What is the typical food served at the campsites?",
            a: "Most packages include a traditional Kerala dinner (Chapathi, Chicken Curry/Veg Kurma, Rice, Dal) and a simple breakfast. Evening BBQ and Campfire snacks are usually the highlight!"
        },
        {
            icon: <FaCampground />,
            q: "Can we reach the campsite in our own car?",
            a: "Direct road access is available to most base camps in Suryanelli. However, for Kolukkumalai and certain hilltop camps, only 4x4 Jeeps are allowed. We can arrange shared or private Jeeps for you."
        }
    ];

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Munnar & Suryanelli FAQ: All Your Tent Stay Questions Answered | Aanandham.go"
                description="Planning a tent stay in Munnar or Suryanelli? Find answers to frequently asked questions about safety, packing, food, and how to reach the best campsites."
                keywords="Munnar FAQ, Suryanelli Tent Stay Questions, Munnar Camping Tips, Kolukkumalai Jeep Safari FAQ, Glamping Kerala Info"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=80")',
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
                        Travelers' Q&A
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Munnar & Suryanelli <br /> <span style={{ color: 'var(--primary)' }}>Tent Stay FAQ</span>
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>

                    {/* Left: FAQ List */}
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FaQuestionCircle style={{ color: 'var(--primary)' }} /> Frequent Questions
                        </h2>

                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: '#111',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    marginBottom: '20px',
                                    border: '1px solid #222'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                                    <span style={{ color: 'var(--primary)', fontSize: '20px', marginTop: '4px' }}>{faq.icon}</span>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{faq.q}</h3>
                                </div>
                                <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', marginLeft: '35px' }}>
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Instagram Reel */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>Watch the Vibe</h2>
                        <div style={{ background: '#111', borderRadius: '24px', padding: '10px', border: '1px solid #222', overflow: 'hidden' }}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/reel/DHvlJS2y0CS/?utm_source=ig_embed&amp;utm_campaign=loading"
                                data-instgrm-version="14"
                                style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                            >
                            </blockquote>
                        </div>
                        <p style={{ marginTop: '20px', color: '#666', fontSize: '14px', textAlign: 'center', fontStyle: 'italic' }}>
                            A glimpse into our Suryanelli Camping nights.
                        </p>
                    </div>

                </div>

                {/* Call to Action */}
                <div style={{
                    background: 'var(--primary-gradient)',
                    padding: '60px 40px',
                    borderRadius: '32px',
                    textAlign: 'center',
                    marginTop: '80px',
                    color: 'black'
                }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>Ready to Book Your Escape?</h2>
                    <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>Join us at the best verified campsites in Munnar, Suryanelli, and Vagamon.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/hotels" style={{
                            background: 'black',
                            color: 'white',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}>
                            Browse Stays
                        </Link>
                        <Link to="/contact" style={{
                            background: 'transparent',
                            color: 'black',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            border: '2px solid black'
                        }}>
                            Inquire Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MunnarFAQ;
