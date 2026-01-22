import React from 'react';
import { motion } from 'framer-motion';
import { FaHandshake, FaBullhorn, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const CampingPartnership = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Camping Partner Kerala: Collaborate with Aanandham for Trip Planning"
                description="The ultimate destination for camping partners and trip planners in Kerala. Partner with Aanandham for verified tent stays, glamping collaborations, and group trips."
                keywords="Camping Partner Kerala, Trip Planner Collaboration, Munnar Camping Partnership, Vagamon Tent Stay Collaboration, Travel Influencer Kerala, Camping Planner India"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": "Partner with Aanandham: The Best Camping & Trip Planning Partner in Kerala",
                    "description": "Information on how to collaborate with Aanandham for group trips, influencer partnerships, and event planning in Munnar and Vagamon.",
                    "author": {
                        "@type": "Brand",
                        "name": "Aanandham.go"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Aanandham.go",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://aanandham.in/logo.png"
                        }
                    },
                    "datePublished": "2025-01-07"
                }}
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1200&q=80")',
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
                        Collaborate & Grow
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Your Trusted <br /> Camping Partner
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px', maxWidth: '900px' }}>
                <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#e5e5e5' }}>
                    <p style={{ marginBottom: '30px', fontSize: '20px', textAlign: 'center' }}>
                        At <strong>Aanandham</strong>, we believe that the best journeys are shared. We are opening our doors to <strong>trip planners</strong>, <strong>event organizers</strong>, and <strong>travel creators</strong> who want to bring their community to the magical hills of Munnar and Vagamon.
                    </p>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>1. For Professional Trip Planners</h2>
                    <p style={{ marginBottom: '20px' }}>
                        Managing a group trip is hard. Finding verified, safe, and premium campsites shouldn't be. When you become a <strong>camping partner</strong> with Aanandham, you get:
                    </p>
                    <ul style={{ marginBottom: '30px' }}>
                        <li>Direct access to our verified inventory of luxury tents and glamping pods.</li>
                        <li>Preferential rates for large groups and long-term bookings.</li>
                        <li>Dedicated on-ground assistance for check-ins, meals, and activities.</li>
                        <li>Customized itineraries including Kolukkumalai trekking and jeep safaris.</li>
                    </ul>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>2. Influencer & Creator Collaborations</h2>
                    <p style={{ marginBottom: '20px' }}>
                        Are you a storyteller on Instagram or YouTube? We offer **collaboration opportunities** for creators who align with our values of "Slow Travel" and "Nature First."
                    </p>
                    <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '24px', marginBottom: '30px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <FaBullhorn size={24} color="var(--primary)" />
                            <h4 style={{ fontWeight: '700', fontSize: '20px' }}>How it Works</h4>
                        </div>
                        <p style={{ fontSize: '16px' }}>
                            We provide the stay and the experience; you provide the high-quality content. We are specifically looking for creators focusing on sustainable travel, solo female travel, and adventure trekking.
                        </p>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '40px 0 20px', color: 'var(--text-main)' }}>3. Event & Community Organizers</h2>
                    <p style={{ marginBottom: '30px' }}>
                        From corporate team-building retreats to yoga workshops in the clouds, Aanandham is your <strong>camping planner</strong> of choice. We handle the logistics so you can focus on your community.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
                            <FaCalendarAlt size={24} color="var(--primary)" style={{ marginBottom: '15px' }} />
                            <h4 style={{ fontWeight: '700' }}>Event Planning</h4>
                            <p style={{ fontSize: '14px', color: '#888' }}>Full-service planning for private bonfires, open-air music, and workshops.</p>
                        </div>
                        <div style={{ background: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
                            <FaMapMarkedAlt size={24} color="var(--primary)" style={{ marginBottom: '15px' }} />
                            <h4 style={{ fontWeight: '700' }}>Custom Trails</h4>
                            <p style={{ fontSize: '14px', color: '#888' }}>Exclusive access to non-commercial trekking trails near Suryanelli.</p>
                        </div>
                    </div>

                    <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '24px', textAlign: 'center', marginTop: '60px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Join the Aanandham Partner Network</h3>
                        <p style={{ color: '#999', marginBottom: '24px' }}>Let's talk about your next project or trip.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <Link to="/contact" style={{
                                display: 'inline-block',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '16px 40px',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}>
                                Contact for Colab
                            </Link>
                            <a href="https://wa.me/919400987654" style={{
                                display: 'inline-block',
                                background: 'transparent',
                                color: 'white',
                                border: '1px solid var(--primary)',
                                padding: '16px 40px',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}>
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampingPartnership;
