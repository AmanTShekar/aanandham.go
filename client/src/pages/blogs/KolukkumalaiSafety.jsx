import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCar, FaFirstAid } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const KolukkumalaiSafety = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Is Kolukkumalai Trekking Safe? 2025 Safety Guide | Aanandham.go"
                description="Expert safety advice for the Kolukkumalai Sunrise Trek. Jeep safari risks, trekking difficulty, altitude sickness, and verified safe operators."
                keywords="Kolukkumalai Trek Safe, Munnar Jeep Safari Safety, Sunrise Trek Difficulty, Kolukkumalai Altitude Sickness, Safe Trekking Munnar"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1544509747-642f4c3a2727?w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#ef4444', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase' }}
                    >
                        Safety First
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Is Kolukkumalai Trekking Safe? <br /> What You Need to Know
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '800px' }}>
                <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                    <p style={{ marginBottom: '30px', fontSize: '20px' }}>
                        The sunrise at Kolukkumalai (7,130 ft) is legendary, but getting there involves one of the roughest off-road jeep rides in India. Is it safe for everyone? Here is the honest truth.
                    </p>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>The "Bone-Rattling" Jeep Ride</h2>
                    <div style={{ display: 'flex', gap: '20px', background: '#222', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
                        <FaCar size={40} color="#ef4444" style={{ flexShrink: 0 }} />
                        <div>
                            <p>
                                The 10km off-road trail from Suryanelli base camp to the peak consists of boulders and loose gravel. It is extremely bumpy.
                            </p>
                            <p style={{ marginTop: '10px', color: '#ccc' }}><strong>Advisory:</strong> Not recommended for pregnant women, people with severe back issues (slipped discs), or infants.</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>Trekking Difficulty</h2>
                    <p style={{ marginBottom: '20px' }}>
                        Once the jeep drops you off, there is a short 1.5km trek to the sunrise point (Tiger Face Rock). This part is **beginner-friendly**. The gradient is moderate, and anyone with basic fitness can do it.
                    </p>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>Safety Tips</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                            <FaShieldAlt color="var(--primary)" size={24} />
                            <div>
                                <strong>Hire Verified Drivers:</strong> Only local drivers know the terrain. Do not attempt to drive your own SUV up there.
                            </div>
                        </li>
                        <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                            <FaFirstAid color="var(--primary)" size={24} />
                            <div>
                                <strong>Carry Warm Clothing:</strong> Wind chill at 4 AM is severe. Hypothermia is a real risk if you are underdressed.
                            </div>
                        </li>
                    </ul>

                    <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '60px', border: '1px solid #333' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Book with Confidence</h3>
                        <p style={{ color: '#999', marginBottom: '24px' }}>
                            Aanandham.go partners only with certified jeep operators who prioritize safety over speed.
                        </p>
                        <Link to="/packages/kolukkumalai-sunrise" style={{
                            display: 'inline-block',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none'
                        }}>
                            View Safe Trek Packages
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KolukkumalaiSafety;
