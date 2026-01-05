import React from 'react';
import { motion } from 'framer-motion';
import { FaMountain, FaCampground, FaHistory, FaCloudSun } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const MunnarGuide = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="The Ultimate Guide to Munnar Tent Camping 2025 | Aanandham.go"
                description="Everything you need to know about camping in Munnar. Best spots in Suryanelli, tent stay prices, Kolukkumalai trekking guide, and safety tips for glamping."
                keywords="Munnar Tent Camping Guide, Best Camping Spots Munnar, Suryanelli Tent Stay Price, Kolukkumalai Trek Details, Glamping Kerala Guide"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=80")',
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
                        Camping Guide
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        The Ultimate Guide to <br /> Munnar Tent Camping
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '800px' }}>
                {/* Content */}
                <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                    <p style={{ marginBottom: '30px', fontSize: '20px' }}>
                        Munnar isn't just about tea gardens anymore. It has become the <strong style={{ color: 'var(--primary)' }}>camping capital of Kerala</strong>. With temperatures dropping to 5°C and sunrises that float above the clouds, a tent stay in Munner is a bucket-list experience. Here is your complete guide to planning the perfect trip.
                    </p>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>1. Where to Camp: Suryanelli vs. Vattavada</h2>
                    <p style={{ marginBottom: '20px' }}>
                        The two main camping hubs are **Suryanelli** (near Kolukkumalai) and **Vattavada** (near Top Station).
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#ccc', marginBottom: '30px' }}>
                        <li style={{ marginBottom: '10px' }}><strong>Suryanelli:</strong> Choose this for the classic "Phantom Hill" views and easy access to the Kolukkumalai Sunrise Trek. It is windier but offers the best panoramas.</li>
                        <li><strong>Vattavada:</strong> Known for its vegetable farms and forests. It is quieter, warmer, and ideal for forest glamping experiences.</li>
                    </ul>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>2. Best Time to Camp</h2>
                    <p style={{ marginBottom: '20px' }}>
                        Camping is a year-round activity, but the experience changes with seasons:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '10px' }}>Winter (Nov - Feb)</h3>
                            <p style={{ fontSize: '14px', color: '#999' }}>Coldest nights (single digits). Clear skies for stargazing. Best for bonfires.</p>
                        </div>
                        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '10px' }}>Monsoon (Jun - Aug)</h3>
                            <p style={{ fontSize: '14px', color: '#999' }}>Misty, dramatic landscapes. Look for waterproof "A-Frame" cabins instead of canvas tents.</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>3. Packing Essentials</h2>
                    <p style={{ marginBottom: '30px' }}>
                        Don't underestimate the cold. Even in summer, nights depend on the wind chill factor.
                        <br />
                        <strong>Must-haves:</strong> Thermal wear, good hiking shoes (for the sunrise trek), power bank (charging points are limited in tents), and a torch.
                    </p>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>4. Is it Safe for Couples?</h2>
                    <p style={{ marginBottom: '40px' }}>
                        Absolutely. Aanandham.go verifies every listing for privacy and security. Our recommended <Link to="/hotels" style={{ color: 'var(--primary)' }}>Premium Glamping Tents</Link> come with private restrooms, fenced perimeters, and on-site staff 24/7.
                    </p>

                    <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '60px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Ready to Experience the Wild?</h3>
                        <p style={{ color: '#999', marginBottom: '24px' }}>Book verified tent stays in Munnar starting from ₹1,500.</p>
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
        </div>
    );
};

export default MunnarGuide;
