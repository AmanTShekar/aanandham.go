"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '../../components/Footer';

// ── NEARBY ATTRACTIONS & PLACES DATA ──
const NEARBY_PLACES = [
    {
        id: 'kolukkumalai',
        title: 'Kolukkumalai Sunrise Peak',
        category: 'High-Altitude Peak',
        distance: '4.5 km · 25 mins by 4x4',
        altitude: '7,900 FT',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        desc: 'The highest organic tea estate on planet Earth. Accessible strictly via 4x4 Jeep safari through rugged rocky trails, offering the iconic golden sunrise over endless cloud beds.'
    },
    {
        id: 'phantom-head',
        title: 'Phantom Head Ridge',
        category: 'Guided Trekking Trail',
        distance: '1.2 km · 20 min walk',
        altitude: '6,800 FT',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        desc: 'A secret ridge formation that resembles a phantom skull when viewed from the valley. Unobstructed 360-degree panorama of the Western Ghats and Suryanelli tea hills.'
    },
    {
        id: 'anaerangal',
        title: 'Anaerangal Lake & Meadows',
        category: 'Lakeside & Kayaking',
        distance: '6.0 km · 15 mins drive',
        altitude: '5,500 FT',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        desc: 'Translated as "where elephants descend", this pristine reservoir is hugged by misty green pine trees and eucalyptus forests. Ideal for evening walks and kayaking.'
    },
    {
        id: 'lockhart-gap',
        title: 'Lockhart Gap Viewpoint',
        category: 'Valley Vista',
        distance: '8.5 km · 20 mins drive',
        altitude: '6,200 FT',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        desc: 'A natural gap between two colossal cliffs providing a breathtaking vantage of the Bison Valley below. Famous for dramatic evening sunset gradients and cool mountain breeze.'
    },
    {
        id: 'chinnakanal',
        title: 'Chinnakanal Forest Waterfalls',
        category: 'Natural Falls',
        distance: '5.0 km · 12 mins drive',
        altitude: '5,900 FT',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        desc: 'Cascading pristine spring water descending from steep granite rockfaces. Surrounded by wild cardamom plantations and aromatic silver oak trees.'
    },
    {
        id: 'papathy-shola',
        title: 'Papathy Shola (Butterfly Valley)',
        category: 'Biodiversity Forest',
        distance: '3.8 km · 15 mins by 4x4',
        altitude: '6,400 FT',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        desc: 'A preserved Shola forest ecosystem home to over 100 species of migratory hill butterflies, rare orchids, and wild Nilgiri tahr trails.'
    }
];

// ── THINGS TO DO DATA ──
const THINGS_TO_DO = [
    {
        icon: 'fa-solid fa-mountain-sun',
        title: 'Sunrise 4x4 Cloud Bed Safari',
        badge: 'MUST EXPERIENCE',
        desc: 'Depart basecamp at 4:30 AM in an open-top Mahindra 4x4 Jeep. Ride through hairpin plantation bends to catch the golden sun piercing through infinite sea-of-clouds.'
    },
    {
        icon: 'fa-solid fa-fire',
        title: 'Starlit Campfire & Barbecue',
        badge: 'NIGHT SPECIAL',
        desc: 'Gather around the open stone firepit under zero-light-pollution night skies. Enjoy live grilled chicken/paneer, local cardamom chai, and acoustic camp music.'
    },
    {
        icon: 'fa-solid fa-person-hiking',
        title: 'Guided Ridge & Tea Valley Treks',
        badge: 'ALL SKILL LEVELS',
        desc: 'Certified local marshals guide you along secret high-altitude ridge paths, teaching tea-leaf harvesting and mountain survival skills in a relaxed pace.'
    },
    {
        icon: 'fa-solid fa-spa',
        title: 'Morning Yoga & Breathwork',
        badge: 'WELLNESS',
        desc: 'Recharge your lungs with fresh mountain ozone at 6,500 FT. Guided sunrise pranayama and gentle stretching with panoramic misty valley backdrop.'
    },
    {
        icon: 'fa-solid fa-camera',
        title: 'Astrophotography & Milky Way Watch',
        badge: 'DARK SKY SPOT',
        desc: 'Suryanelli’s unique elevation and remote ridge location offer one of the darkest night sky zones in South India, ideal for spotting shooting stars.'
    },
    {
        icon: 'fa-solid fa-tent',
        title: 'Private Pod Luxury Glamping',
        badge: 'COMFORT IN WILD',
        desc: 'High-density insulated weather-proof tents equipped with thick spring mattresses, warm quilts, wooden decks, clean private washrooms, and solar lamps.'
    }
];

// ── TEAM MEMBERS ──
const TEAM_MEMBERS = [
    {
        name: 'Suryanarayanan',
        role: 'Founder & Lead Explorer',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Born in the Western Ghats, Surya started Aanandham to share his lifelong passion for Suryanelli’s cloud beds. He personally inspects every single trail we hike.',
        tags: ['High Altitude', 'Jeep Offroading', 'Trail Navigation']
    },
    {
        name: 'Ananya Iyer',
        role: 'Head of Guest Safety & Glamping',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Ananya ensures every camper experiences the thrill of wilderness without ever compromising on warm comfort, strict 24/7 security, and female-friendly hospitality.',
        tags: ['Guest Safety', 'Glamping Luxury', 'Retreat Planning']
    },
    {
        name: 'Rahul Chandran',
        role: 'Senior Operations & 4x4 Marshal',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Master of the rugged Kolukkumalai terrain. Rahul coordinates our fleet of 4x4 safari vehicles and emergency mountain response protocols.',
        tags: ['4x4 Fleet', 'Emergency Response', 'Camp Logistics']
    }
];

export default function AboutPage() {
    const [selectedPlace, setSelectedPlace] = useState(NEARBY_PLACES[0]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F8F9F5',
            color: '#121613',
            fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif',
            position: 'relative',
            overflowX: 'clip'
        }}>

            {/* ── ACCESSIBILITY: SKIP TO CONTENT LINK ── */}
            <a href="#about-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* Tourist Attractions & Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://aanandham.in"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "About Aanandham & Nearby Attractions",
                                "item": "https://aanandham.in/about"
                            }
                        ]
                    })
                }}
            />

            {/* ── TOP HEADER ── */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                padding: '16px 28px',
                backgroundColor: 'rgba(14, 24, 17, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/" className="text-hover-marker text-hover-marker-dark">
                        <img
                            src="/logo.png"
                            alt="Aanandham.go"
                            style={{
                                height: '36px',
                                width: 'auto',
                                objectFit: 'contain',
                                borderRadius: '6px'
                            }}
                        />
                        <span className="marker-text" style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: '26px',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em'
                        }}>
                            Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        opacity: 0.9
                    }}>
                        <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px' }}></i> Back to Home
                    </Link>
                    <Link href="/contact" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                        Contact
                    </Link>
                    <Link href="/login" className="btn-lime" style={{ padding: '9px 24px', fontSize: '13.5px', textDecoration: 'none' }}>
                        Log In
                    </Link>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    className="nav-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                    <i className={isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
                </button>
            </header>

            {/* ── RESPONSIVE MOBILE DRAWER ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 998,
                            background: '#0E1A11',
                            color: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '100px 32px 40px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '20px', fontWeight: '800' }}>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#E5A93B', textDecoration: 'none' }}>
                                About Us
                            </Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Contact & Inquiries
                            </Link>
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Member Log In
                            </Link>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <a
                                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    color: '#25D366',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    padding: '12px'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                <span>WhatsApp Concierge (24/7)</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main id="about-content">

            {/* ── HERO BANNER ── */}
            <section style={{
                position: 'relative',
                paddingTop: '160px',
                paddingBottom: '100px',
                background: 'linear-gradient(180deg, #101E13 0%, #08120A 100%)',
                color: '#FFFFFF',
                textAlign: 'center',
                paddingLeft: '24px',
                paddingRight: '24px'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="star-badge" style={{ color: '#E5A93B', marginBottom: '16px' }}>
                        <span style={{ color: '#E5A93B' }}>★</span> ABOUT AANANDHAM.GO
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                        fontSize: 'clamp(40px, 6.5vw, 72px)',
                        fontWeight: '800',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.05,
                        marginBottom: '24px'
                    }}>
                        From Textbooks to <span style={{ color: '#E5A93B' }}>Mountain Trails</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(16px, 2vw, 20px)',
                        color: '#A2B6A6',
                        lineHeight: 1.65,
                        margin: '0 auto 48px',
                        maxWidth: '720px'
                    }}>
                        We aren’t a giant corporate travel agency. We started as local students escaping college classrooms to explore the hidden ridges of Suryanelli — and built Kerala’s most trusted verified wilderness camp.
                    </p>

                    {/* Live Stats Pill Banner */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '28px 24px',
                        maxWidth: '820px',
                        margin: '0 auto'
                    }}>
                        {[
                            { val: '500+', label: 'Expeditions Hosted' },
                            { val: '15,000+', label: 'Happy Campers' },
                            { val: '50+', label: 'Verified Ridge Pods' },
                            { val: '4.9 ★', label: 'Guest Rating' }
                        ].map((stat, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    color: '#E5A93B',
                                    marginBottom: '4px'
                                }}>
                                    {stat.val}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR STORY & ETHOS (GRID) ── */}
            <section style={{ maxWidth: '1240px', margin: '80px auto', padding: '0 24px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    <div>
                        <div className="star-badge" style={{ marginBottom: '10px' }}>
                            <span className="star-icon">★</span> THE AANANDHAM STORY
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: 'clamp(32px, 4vw, 44px)',
                            fontWeight: '800',
                            letterSpacing: '-0.03em',
                            color: '#121613',
                            lineHeight: 1.15,
                            marginBottom: '20px'
                        }}>
                            We Don’t Sell Hotel Rooms. We Sell Mornings in the Clouds.
                        </h2>
                        <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.7, marginBottom: '16px' }}>
                            Munnar town is beautiful, but the true spirit of the Western Ghats lies outside the tourist traffic. In Suryanelli’s quiet tea ridges, where the mist rolls right through your tent door at dawn.
                        </p>
                        <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.7, marginBottom: '28px' }}>
                            Every single campsite, safari jeep, and trek trail under <strong>Aanandham.go</strong> is personally tested by our team. If we wouldn't bring our own families to stay there, we will not list it.
                        </p>

                        <div style={{
                            padding: '20px 24px',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            borderLeft: '4px solid #E5A93B',
                            border: '1px solid rgba(18, 22, 19, 0.08)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                        }}>
                            <p style={{ margin: 0, fontStyle: 'italic', color: '#121613', fontSize: '15px', fontWeight: '600', lineHeight: 1.6 }}>
                                “We practice strict Leave-No-Trace camping, solar-powered night illumination, and work directly with local tribal guides to keep these mountains pure.”
                            </p>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80"
                            alt="Aanandham Glamp"
                            style={{
                                width: '100%',
                                height: '480px',
                                objectFit: 'cover',
                                borderRadius: '32px',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '24px',
                            left: '24px',
                            background: 'rgba(14, 24, 17, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '16px 20px',
                            borderRadius: '20px',
                            color: '#FFFFFF'
                        }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                ★ SURYANELLI RIDGE
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '700' }}>
                                6,500 FT High-Altitude Glamping
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NEARBY ATTRACTIONS & SCENIC SPOTS ("NEAR THINGS") ── */}
            <section style={{
                background: '#FFFFFF',
                padding: '100px 24px',
                borderTop: '1px solid rgba(18, 22, 19, 0.06)',
                borderBottom: '1px solid rgba(18, 22, 19, 0.06)'
            }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
                    <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
                        <div className="star-badge" style={{ marginBottom: '8px' }}>
                            <span className="star-icon">★</span> PLACES NEAR BASECAMP
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: 'clamp(32px, 4.5vw, 48px)',
                            fontWeight: '800',
                            letterSpacing: '-0.035em',
                            color: '#121613',
                            lineHeight: 1.15,
                            marginBottom: '14px'
                        }}>
                            Nearby Attractions & Scenic Peaks
                        </h2>
                        <p style={{ fontSize: '16px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                            Explore all top peaks, lakes, and Shola valleys located right within 15–25 minutes of Aanandham basecamp in Suryanelli.
                        </p>
                    </div>

                    {/* Nearby Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '28px'
                    }}>
                        {NEARBY_PLACES.map((place) => (
                            <motion.div
                                key={place.id}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.25 }}
                                style={{
                                    background: '#F8F9F5',
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(18, 22, 19, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                    <img
                                        src={place.image}
                                        alt={place.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'rgba(0,0,0,0.65)',
                                        color: '#E5A93B',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        padding: '5px 12px',
                                        borderRadius: '999px',
                                        backdropFilter: 'blur(6px)'
                                    }}>
                                        {place.altitude}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '16px',
                                        left: '16px',
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#121613',
                                        fontSize: '11.5px',
                                        fontWeight: '800',
                                        padding: '4px 12px',
                                        borderRadius: '999px'
                                    }}>
                                        {place.distance}
                                    </div>
                                </div>

                                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                                            {place.category}
                                        </span>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>
                                            {place.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                                            {place.desc}
                                        </p>
                                    </div>

                                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(18, 22, 19, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#121613' }}>
                                            Included in Safari Route
                                        </span>
                                        <Link href="/contact" style={{ color: '#121613', fontWeight: '800', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Inquire ↗
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── THINGS TO DO SECTION ── */}
            <section style={{ maxWidth: '1240px', margin: '100px auto', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
                    <div className="star-badge" style={{ marginBottom: '8px' }}>
                        <span className="star-icon">★</span> WILDERNESS ITINERARY
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                        fontSize: 'clamp(32px, 4.5vw, 48px)',
                        fontWeight: '800',
                        letterSpacing: '-0.035em',
                        color: '#121613',
                        lineHeight: 1.15,
                        marginBottom: '14px'
                    }}>
                        Signature Things to Do at Camp
                    </h2>
                    <p style={{ fontSize: '16px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                        From 4:30 AM sunrise safaris to twilight fireside barbecues, here is what your weekend at Aanandham feels like.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {THINGS_TO_DO.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -4 }}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '32px 28px',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '16px',
                                        background: '#F1F3EC',
                                        color: '#121613',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <span style={{
                                        fontSize: '10.5px',
                                        fontWeight: '800',
                                        letterSpacing: '0.8px',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        background: '#E5A93B',
                                        color: '#121613'
                                    }}>
                                        {item.badge}
                                    </span>
                                </div>

                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '20px',
                                    fontWeight: '800',
                                    color: '#121613',
                                    marginBottom: '10px'
                                }}>
                                    {item.title}
                                </h3>

                                <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── MEET THE PATHFINDERS (TEAM) ── */}
            <section style={{
                background: '#FFFFFF',
                padding: '100px 24px',
                borderTop: '1px solid rgba(18, 22, 19, 0.06)',
                borderBottom: '1px solid rgba(18, 22, 19, 0.06)'
            }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px' }}>
                        <div className="star-badge" style={{ marginBottom: '8px' }}>
                            <span className="star-icon">★</span> EXPEDITION LEADERS
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: 'clamp(32px, 4vw, 44px)',
                            fontWeight: '800',
                            letterSpacing: '-0.03em',
                            color: '#121613',
                            marginBottom: '12px'
                        }}>
                            Meet the Pathfinders
                        </h2>
                        <p style={{ fontSize: '15.5px', color: '#59655D', margin: 0 }}>
                            We are mountain lovers, certified trek marshals, and local natives who live and breathe the Western Ghats.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px'
                    }}>
                        {TEAM_MEMBERS.map((member, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: '#F8F9F5',
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(18, 22, 19, 0.08)'
                                }}
                            >
                                <div style={{ height: '260px', overflow: 'hidden' }}>
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', color: '#121613', margin: '0 0 4px' }}>
                                        {member.name}
                                    </h3>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                                        {member.role}
                                    </div>
                                    <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.6, marginBottom: '16px' }}>
                                        “{member.bio}”
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {member.tags.map((t, tIdx) => (
                                            <span
                                                key={tIdx}
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    background: '#FFFFFF',
                                                    border: '1px solid rgba(18,22,19,0.08)',
                                                    padding: '3px 10px',
                                                    borderRadius: '999px',
                                                    color: '#121613'
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PARTNERSHIP / CTA BANNER ── */}
            <section style={{
                background: 'linear-gradient(180deg, #101E13 0%, #08120A 100%)',
                color: '#FFFFFF',
                padding: '90px 24px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="star-badge" style={{ color: '#E5A93B', marginBottom: '16px' }}>
                        <span style={{ color: '#E5A93B' }}>★</span> JOIN THE EXPEDITION
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                        fontSize: 'clamp(36px, 5vw, 54px)',
                        fontWeight: '800',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.1,
                        marginBottom: '20px'
                    }}>
                        Ready to Experience <span style={{ color: '#E5A93B' }}>Suryanelli’s Peak?</span>
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: '#A2B6A6',
                        lineHeight: 1.65,
                        marginBottom: '36px'
                    }}>
                        Book a weekend glamping pod, join our group offsite, or talk to our marshals to customize your sunrise trek.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link href="/contact" className="btn-lime" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none' }}>
                            Book Your Camp Stay ↗
                        </Link>
                        <Link href="/login" style={{
                            padding: '14px 28px',
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#FFFFFF',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '999px',
                            textDecoration: 'none'
                        }}>
                            Member Login
                        </Link>
                    </div>
                </div>
            </section>

            </main>

            {/* ── SHARED FOOTER ── */}
            <Footer />

            {/* ── FLOATING WHATSAPP CONCIERGE BUTTON ── */}
            <a
                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Concierge!%20I%20would%20like%20to%20know%20about%20upcoming%20camp%20batches"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-whatsapp-btn"
                aria-label="Chat with Aanandham Concierge on WhatsApp"
            >
                <i className="fa-brands fa-whatsapp"></i>
            </a>

        </div>
    );
}
