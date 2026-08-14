"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';

// ── NEARBY LANDMARKS & EXPEDITION TRAILS ──
const NEARBY_PLACES = [
    {
        id: 'kolukkumalai',
        title: 'Kolukkumalai Sunrise Peak',
        category: 'High Peaks',
        distance: '4.5 km · 25 mins by 4x4 Jeep',
        altitude: '7,900 FT',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
        desc: 'The highest organic tea plantation on Earth. Accessible strictly via 4x4 Jeep safari over rugged rock terrain, revealing the legendary golden sunrise over rolling cloud beds.',
        highlight: 'Cloud Bed Sunrise'
    },
    {
        id: 'phantom-head',
        title: 'Phantom Head Ridge',
        category: 'Trails',
        distance: '1.2 km · 20 min ridge hike',
        altitude: '6,800 FT',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
        desc: 'A secret high-altitude ridge line resembling a phantom skull in silhouette. Offers an unobstructed 360-degree vista of the Suryanelli tea valleys and Anayirangal basin.',
        highlight: 'Secret Sunset Point'
    },
    {
        id: 'anayirangal',
        title: 'Anayirangal Lake & Meadows',
        category: 'Lakes & Waterfalls',
        distance: '6.0 km · 15 mins drive',
        altitude: '5,500 FT',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        desc: 'Translated as "the place where wild elephants drink", this emerald reservoir is bordered by misty pine forests and tea estates. Ideal for evening shoreline walks.',
        highlight: 'Wild Shoreline'
    },
    {
        id: 'lockhart-gap',
        title: 'Lockhart Gap Valley Vista',
        category: 'High Peaks',
        distance: '8.5 km · 20 mins drive',
        altitude: '6,200 FT',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
        desc: 'A colossal natural mountain gap carved between two monolithic granite cliffs, providing dramatic sunset gradients over the Bison Valley.',
        highlight: 'Granite Valley Gap'
    },
    {
        id: 'chinnakanal',
        title: 'Chinnakanal Spring Waterfalls',
        category: 'Lakes & Waterfalls',
        distance: '5.0 km · 12 mins drive',
        altitude: '5,900 FT',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80',
        desc: 'Pure mountain spring water cascading from high granite shelves, surrounded by wild cardamom plantations, cinnamon groves, and silver oaks.',
        highlight: 'Natural Spring Cascade'
    },
    {
        id: 'papathy-shola',
        title: 'Papathy Shola (Butterfly Sanctuary)',
        category: 'Trails',
        distance: '3.8 km · 15 mins by 4x4',
        altitude: '6,400 FT',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
        desc: 'A conserved high-altitude Shola rainforest habitat home to migratory mountain butterflies, rare orchids, and wild Nilgiri tahr trails.',
        highlight: 'Ancient Rainforest'
    }
];

// ── 4 BESPOKE WILDERNESS PILLARS (Tactile Sticky Field Notes) ──
const WILDERNESS_PILLARS = [
    {
        num: '01',
        title: 'High-Altitude Safety & Native Marshals',
        tag: 'DISPATCH #01',
        stamp: '100% MARSHAL GUIDED',
        stampColor: '#2D6A4F',
        paperBg: '#F3FBE8',
        inkColor: '#142818',
        tapeColor: 'rgba(213, 237, 85, 0.75)',
        tapeRotation: '-2.5deg',
        rotation: '-1.4deg',
        icon: 'fa-solid fa-shield-halved',
        noteQuote: '“Every ridge trail has a dedicated mountain marshal with radio contact & satellite coordinates.”',
        checkList: [
            '1:6 Guide-to-camper safety ratio',
            'Certified high-altitude first responders',
            'Pre-cleared forest department permits'
        ],
        desc: 'Every ridge trek, campfire session, and 4x4 ascent is supervised by certified local mountain marshals trained in high-altitude topography, medical response, and wildlife navigation.'
    },
    {
        num: '02',
        title: 'Thermal Insulated Pods & Private En-Suites',
        tag: 'DISPATCH #02',
        stamp: 'ALL-WEATHER SEALED',
        stampColor: '#C86D14',
        paperBg: '#FFF9ED',
        inkColor: '#2B1A08',
        tapeColor: 'rgba(229, 169, 59, 0.7)',
        tapeRotation: '2.2deg',
        rotation: '1.2deg',
        icon: 'fa-solid fa-tent',
        noteQuote: '“No damp sleeping bags or rocky ground. Real spring mattresses and steaming hot showers at 7,900 FT.”',
        checkList: [
            'Double-wall thermal canvas insulation',
            'Sanitized en-suite washrooms + geysers',
            'Organic cotton 300-threadcount duvets'
        ],
        desc: 'Engineered for mountain conditions: double-walled waterproof canvas, premium pocket-spring mattresses, fresh organic cotton duvets, and private sanitized washrooms with hot showers.'
    },
    {
        num: '03',
        title: 'Farm-to-Campfire Culinary Craft',
        tag: 'DISPATCH #03',
        stamp: 'LIVE MOUNTAIN GRILL',
        stampColor: '#A43E1B',
        paperBg: '#FDF4EC',
        inkColor: '#2E150A',
        tapeColor: 'rgba(244, 143, 107, 0.7)',
        tapeRotation: '-1.8deg',
        rotation: '-1.1deg',
        icon: 'fa-solid fa-fire-burner',
        noteQuote: '“Slow-cooked earthen clay pots, freshly ground spices, and estate-plucked cardamom tea by the starlight fire.”',
        checkList: [
            'Live BBQ with veg & non-veg options',
            'Kerala earthenware pot cooking',
            'Estate-fresh organic cardamom chai'
        ],
        desc: 'Hot live campfire barbecues, traditional Kerala earthen pot dishes, locally sourced spiced curries, and freshly brewed cardamom chai harvested directly from our surrounding plantations.'
    },
    {
        num: '04',
        title: '100% Zero-Trace Ecological Ethics',
        tag: 'DISPATCH #04',
        stamp: 'LEAVE NO TRACE',
        stampColor: '#1F6B43',
        paperBg: '#EEF8F1',
        inkColor: '#0A2514',
        tapeColor: 'rgba(142, 205, 161, 0.75)',
        tapeRotation: '2.0deg',
        rotation: '1.5deg',
        icon: 'fa-solid fa-leaf',
        noteQuote: '“Leaving the mountain ridges cleaner than we found them. Zero single-use plastic bottles permitted.”',
        checkList: [
            'Zero single-use plastics anywhere',
            '100% solar ambient pathway lights',
            'Direct local tribal youth employment'
        ],
        desc: 'No single-use plastics permitted on our ridges. 100% solar and low-voltage lighting, organic compost cycles, and direct reinvestment into local tribal youth employment and trail conservation.'
    }
];

// ── EXPEDITION CREATORS & MOUNTAIN MARSHALS ──
const TEAM_CREATORS = [
    {
        name: 'Suryanarayanan K.',
        role: 'Founder & Wilderness Architect',
        handle: '@surya.ridge',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
        specialty: 'High-Altitude Navigation & 4x4 Offroading',
        exp: '14+ Years in Western Ghats'
    },
    {
        name: 'Ananya Menon',
        role: 'Lead Expedition Host & Camp Marshal',
        handle: '@ananya.wildlife',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
        specialty: 'Camper Care & High-Altitude Safety',
        exp: 'Wilderness Safety Specialist'
    },
    {
        name: 'Muthuvel Pandian',
        role: 'Chief 4x4 Trail Master',
        handle: '@muthuvel.kolukkumalai',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85',
        specialty: 'Rugged Rock Ascent & Cloud Bed Lead',
        exp: '20+ Years Kolukkumalai Safari'
    }
];

export default function AboutPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('aanandham_user');
            if (saved) setCurrentUser(JSON.parse(saved));
        } catch (e) {}
    }, []);

    const handleLogout = () => {
        try { localStorage.removeItem('aanandham_user'); } catch (e) {}
        setCurrentUser(null);
    };

    const filteredPlaces = activeCategory === 'All' 
        ? NEARBY_PLACES 
        : NEARBY_PLACES.filter(p => p.category === activeCategory);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F8F9F5',
            color: '#121613',
            fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif',
            position: 'relative',
            overflowX: 'clip'
        }}>
            {/* ── UNIFIED REUSABLE SITE HEADER ── */}
            <SiteHeader 
                activePage="about" 
                currentUser={currentUser} 
                onLogout={handleLogout}
            />

            <main>
                {/* ─────────────────────────────────────────────────────────────
                    1. HERO SECTION: CINEMATIC ATMOSPHERIC MOUNTAIN HERO
                ───────────────────────────────────────────────────────────── */}
                <section 
                    className="hero-defensive-height"
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: 'clamp(120px, 16vh, 160px) 24px clamp(50px, 8vh, 80px)',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=95")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                        color: '#FFFFFF'
                    }}
                >
                    {/* Radial Obsidian Overlay (Matching Home Hero Lighting) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(14, 24, 17, 0.4) 0%, rgba(11, 21, 14, 0.88) 100%)'
                    }} />

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}
                    >
                        {/* Centered Brand Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}
                        >
                            <img
                                src="/logo.png"
                                alt="Aanandham Logo"
                                style={{
                                    height: '92px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.6))'
                                }}
                            />
                        </motion.div>

                        {/* Main Headline in Bricolage Grotesque */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(42px, 7vw, 84px)',
                                fontWeight: '800',
                                lineHeight: 1.05,
                                letterSpacing: '-0.04em',
                                color: '#FFFFFF',
                                marginBottom: '24px'
                            }}
                        >
                            <span className="text-hover-marker text-hover-marker-dark" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                <span className="marker-text">
                                    Our Story<span style={{ color: '#E5A93B' }}> & Ethos</span>
                                </span>
                            </span>
                            <br />
                            <span style={{ fontSize: '0.65em', fontWeight: '700', color: '#E1E9E2', letterSpacing: '-0.02em' }}>
                                Out of the Textbooks, Into the Wild
                            </span>
                        </motion.h1>

                        {/* Subtitle Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(16px, 2vw, 19px)',
                                color: 'rgba(255, 255, 255, 0.88)',
                                lineHeight: 1.65,
                                maxWidth: '760px',
                                margin: '0 auto clamp(24px, 4vh, 40px)'
                            }}
                        >
                            We built Aanandham to trade lecture halls, cubicles, and fluorescent screens for the raw 7,900 FT ridges of Kerala. Experience real nature with safety, warmth, and zero compromises.
                        </motion.p>

                        {/* Quick Action Button Cluster */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '14px'
                            }}
                        >
                            <Link
                                href="/#packages"
                                className="btn-lime"
                                style={{
                                    padding: '14px 34px',
                                    fontSize: '15px',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 30px rgba(213, 237, 85, 0.3)'
                                }}
                            >
                                ⛺ Explore Our Camps ↗
                            </Link>

                            <a
                                href="#ethos"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none',
                                    background: 'rgba(0, 0, 0, 0.45)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    color: '#FFFFFF',
                                    padding: '13px 30px',
                                    borderRadius: '999px',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                📜 Read Our Charter ↓
                            </a>

                            <a
                                href="https://instagram.com/aanandham.go"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    color: '#FFFFFF',
                                    padding: '13px 24px',
                                    borderRadius: '999px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                <i className="fa-brands fa-instagram" style={{ fontSize: '16px' }}></i>
                                <span>@aanandham.go</span>
                            </a>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── LIVE BASECAMP MARQUEE TICKER ── */}
                <div className="marquee-container" aria-hidden="true">
                    <div className="marquee-track">
                        {[
                            { icon: '★', label: '7,900 FT HIGH-ALTITUDE SUMMIT RIDGE', highlight: true },
                            { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 JEEP EXPEDITIONS' },
                            { icon: '🔥', label: 'STARLIT CAMPFIRE & FARM-TO-TABLE DINING' },
                            { icon: '⛺', label: 'THERMAL INSULATED PODS & CLEAN SHOWERS', highlight: true },
                            { icon: '🥾', label: 'SECRET PHANTOM HEAD PEAK TRAILS' },
                            { icon: '🔭', label: 'ZERO LIGHT-POLLUTION MILKY WAY STARGAZING', highlight: true },
                            { icon: '🌿', label: '100% LEAVE NO TRACE ECO CHARTER' },
                            { icon: '★', label: '7,900 FT HIGH-ALTITUDE SUMMIT RIDGE', highlight: true },
                            { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 JEEP EXPEDITIONS' }
                        ].map((item, idx) => (
                            <div key={idx} className="marquee-item" style={{ color: item.highlight ? '#E5A93B' : '#FFFFFF' }}>
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    2. OUT OF THE CLASSROOM: THE EDITORIAL STORY SECTION
                ───────────────────────────────────────────────────────────── */}
                <section id="ethos" style={{
                    padding: '110px 24px',
                    background: '#F8F9F5',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '56px',
                            alignItems: 'center'
                        }}>
                            {/* Left: Editorial Narrative */}
                            <div>
                                <div className="star-badge" style={{ marginBottom: '16px' }}>
                                    <span className="star-icon">★</span> OUR FOUNDING ETHOS
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                    fontSize: 'clamp(32px, 4.5vw, 52px)',
                                    fontWeight: '800',
                                    lineHeight: 1.12,
                                    letterSpacing: '-0.03em',
                                    color: '#0B150E',
                                    margin: '0 0 24px'
                                }}>
                                    From Textbook Theory to Living <span style={{ color: '#E5A93B' }}>Mountain Geography</span>
                                </h2>

                                <p style={{ fontSize: '16px', color: '#59655D', lineHeight: 1.75, marginBottom: '20px' }}>
                                    In modern life, most of what we experience is second-hand: trapped inside slide decks, fluorescent lecture rooms, and endless phone notifications. We study weather systems, but never stand above a raging sea of morning mist. We read about stars, but haven’t looked into a crystal clear Milky Way in years.
                                </p>

                                <p style={{ fontSize: '16px', color: '#59655D', lineHeight: 1.75, marginBottom: '32px' }}>
                                    Aanandham was founded in 2021 with a simple mission: <strong style={{ color: '#0B150E' }}>reconnecting people with raw nature without compromising comfort</strong>. By engineering weather-sealed, insulated dome sanctuaries on private mountain ridges, we made the wild accessible to families, couples, and solo travelers alike.
                                </p>

                                {/* Founder Quote Card */}
                                <div style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(11, 21, 14, 0.08)',
                                    borderLeft: '4px solid #E5A93B',
                                    borderRadius: '0 20px 20px 0',
                                    padding: '24px 28px',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
                                }}>
                                    <p style={{
                                        fontSize: '15px',
                                        fontStyle: 'italic',
                                        color: '#0B150E',
                                        lineHeight: 1.65,
                                        margin: '0 0 14px'
                                    }}>
                                        “No screen or textbook can replicate the sensory awakening of standing above a rolling sea of clouds at 7,900 FT with hot cardamom tea in hand.”
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E5A93B', color: '#0B150E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>
                                            S
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0B150E' }}>Suryanarayanan K.</div>
                                            <div style={{ fontSize: '11.5px', color: '#E5A93B' }}>Founder & Mountain Director · Aanandham.go</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Bespoke Visual Collage with Real Photography */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
                                    border: '1px solid rgba(11, 21, 14, 0.08)',
                                    position: 'relative'
                                }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=85"
                                        alt="Aanandham Geodesic Dome Camp"
                                        style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '24px',
                                        background: 'linear-gradient(to top, rgba(7, 14, 8, 0.92) 0%, transparent 100%)'
                                    }}>
                                        <div style={{ display: 'inline-block', background: '#E5A93B', color: '#070E08', fontSize: '11px', fontWeight: '900', padding: '4px 12px', borderRadius: '999px', marginBottom: '6px' }}>
                                            PRIVATE RIDGE SANCTUARY
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                            Suryanelli Basecamp · Overlooking Anayirangal Valley
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '-28px',
                                    left: '-24px',
                                    background: '#0B150E',
                                    border: '1px solid rgba(213, 237, 85, 0.35)',
                                    borderRadius: '24px',
                                    padding: '18px 24px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    maxWidth: '320px',
                                    color: '#FFFFFF'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(229, 169, 59, 0.2)', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                        <i className="fa-solid fa-cloud-sun"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                            360° Cloud Bed Views
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6' }}>
                                            Sunrise directly above cloud lines
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    3. THE 4 UNCOMPROMISING WILDERNESS PILLARS (Interactive Sticky Field Notes)
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '120px 24px 140px',
                    background: '#0B150E',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Atmospheric Ridge Glow & Mist Backlight */}
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1000px',
                        height: '450px',
                        background: 'radial-gradient(circle, rgba(213, 237, 85, 0.1) 0%, rgba(229, 169, 59, 0.05) 45%, transparent 70%)',
                        pointerEvents: 'none',
                        filter: 'blur(80px)'
                    }} />

                    <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '74px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION FIELD DISPATCHES
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(34px, 4.8vw, 54px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                The 4 Pillars of <span style={{ color: '#E5A93B' }}>Aanandham Hospitality</span>
                            </h2>
                            <p style={{ fontSize: '16.5px', color: '#A2B6A6', maxWidth: '680px', margin: '0 auto' }}>
                                Interactive field notes pinned directly from our 7,900 FT ridge basecamp. Hover or tap to inspect our unyielding wilderness protocols.
                            </p>
                        </div>

                        {/* 4 Tactile Sticky Field Notes Grid with Spring Physics */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '38px',
                            paddingTop: '24px'
                        }}>
                            {WILDERNESS_PILLARS.map((pillar, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 36 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{
                                        y: -18,
                                        rotate: 0,
                                        scale: 1.035,
                                        boxShadow: '0 32px 70px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        position: 'relative',
                                        background: pillar.paperBg,
                                        color: pillar.inkColor,
                                        borderRadius: '8px 8px 36px 8px',
                                        padding: '42px 28px 34px',
                                        boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0,0,0,0.15)',
                                        transform: `rotate(${pillar.rotation})`,
                                        transition: 'box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '460px',
                                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.04) 28px)',
                                        cursor: 'grab'
                                    }}
                                >
                                    {/* Textured Washi Tape Strip with Brass Pin on Top */}
                                    <motion.div
                                        whileHover={{ y: -2, rotate: 0 }}
                                        style={{
                                            position: 'absolute',
                                            top: '-14px',
                                            left: '50%',
                                            transform: `translateX(-50%) rotate(${pillar.tapeRotation})`,
                                            width: '130px',
                                            height: '28px',
                                            background: pillar.tapeColor,
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                                            borderLeft: '3px dashed rgba(0,0,0,0.25)',
                                            borderRight: '3px dashed rgba(0,0,0,0.25)',
                                            opacity: 0.95,
                                            zIndex: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#E5A93B',
                                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.4)',
                                            border: '1px solid rgba(0,0,0,0.2)'
                                        }} />
                                    </motion.div>

                                    {/* 3D Folded Dog-Ear Corner at Bottom Right */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.22) 50%, rgba(0,0,0,0.08) 100%)',
                                        borderTopLeftRadius: '14px',
                                        boxShadow: '-2px -2px 6px rgba(0,0,0,0.12)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Header Row: Dispatch Badge + Vintage Ink Stamp */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '900',
                                                letterSpacing: '1.2px',
                                                textTransform: 'uppercase',
                                                background: 'rgba(0,0,0,0.08)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(0,0,0,0.06)'
                                            }}>
                                                {pillar.tag}
                                            </span>
                                        </div>

                                        {/* Vintage Double-Bordered Ink Stamp */}
                                        <motion.div
                                            whileHover={{ rotate: 0, scale: 1.05 }}
                                            style={{
                                                border: `2px solid ${pillar.stampColor}`,
                                                outline: `1px dashed ${pillar.stampColor}`,
                                                outlineOffset: '2px',
                                                color: pillar.stampColor,
                                                padding: '4px 9px',
                                                borderRadius: '4px',
                                                fontSize: '9.5px',
                                                fontWeight: '900',
                                                letterSpacing: '0.9px',
                                                textTransform: 'uppercase',
                                                transform: 'rotate(-5deg)',
                                                opacity: 0.9,
                                                userSelect: 'none'
                                            }}
                                        >
                                            {pillar.stamp}
                                        </motion.div>
                                    </div>

                                    {/* Icon & Bold Headline */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '46px',
                                            height: '46px',
                                            borderRadius: '14px',
                                            background: 'rgba(0, 0, 0, 0.07)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            color: pillar.inkColor,
                                            flexShrink: 0,
                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <i className={pillar.icon}></i>
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                            fontSize: '21px',
                                            fontWeight: '800',
                                            lineHeight: 1.2,
                                            margin: 0,
                                            color: pillar.inkColor,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {pillar.title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: '13.5px',
                                        lineHeight: 1.7,
                                        margin: '0 0 20px',
                                        opacity: 0.92,
                                        fontWeight: '500'
                                    }}>
                                        {pillar.desc}
                                    </p>

                                    {/* Tactical Checklist Badges */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                                        {pillar.checkList.map((chk, cIdx) => (
                                            <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.08)',
                                                    color: pillar.stampColor,
                                                    fontSize: '11px',
                                                    fontWeight: '900'
                                                }}>
                                                    ✓
                                                </span>
                                                <span>{chk}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Field Quote with Signature */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '16px',
                                        borderTop: '1px dashed rgba(0, 0, 0, 0.18)',
                                        fontStyle: 'italic',
                                        fontSize: '12.5px',
                                        lineHeight: 1.55,
                                        opacity: 0.88,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '6px'
                                    }}>
                                        <span>✍</span>
                                        <span>{pillar.noteQuote}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    4. SURROUNDING LANDMARKS & HIGH PEAKS
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#F8F9F5',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            flexWrap: 'wrap',
                            gap: '24px',
                            marginBottom: '52px'
                        }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '14px' }}>
                                    <span className="star-icon">★</span> EXPEDITION CORRIDORS
                                </div>
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'clamp(30px, 4.5vw, 48px)',
                                    fontWeight: '800',
                                    color: '#0B150E',
                                    margin: 0
                                }}>
                                    High Ridges & Landmarks Around Us
                                </h2>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                background: '#FFFFFF',
                                padding: '6px',
                                borderRadius: '999px',
                                border: '1px solid rgba(11, 21, 14, 0.1)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                            }}>
                                {['All', 'High Peaks', 'Trails', 'Lakes & Waterfalls'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: '9px 20px',
                                            borderRadius: '999px',
                                            border: 'none',
                                            background: activeCategory === cat ? '#E5A93B' : 'transparent',
                                            color: activeCategory === cat ? '#070E08' : '#59655D',
                                            fontWeight: '800',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Landmark Card Grid */}
                        <motion.div layout style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '30px'
                        }}>
                            <AnimatePresence>
                                {filteredPlaces.map((place) => (
                                    <motion.div
                                        key={place.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="card-hover-lift"
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(11, 21, 14, 0.08)',
                                            borderRadius: '28px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: '0 16px 40px rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={place.image}
                                                alt={place.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '14px',
                                                left: '14px',
                                                background: 'rgba(7, 14, 8, 0.85)',
                                                border: '1px solid rgba(229, 169, 59, 0.4)',
                                                color: '#E5A93B',
                                                fontSize: '11.5px',
                                                fontWeight: '800',
                                                padding: '4px 12px',
                                                borderRadius: '999px',
                                                backdropFilter: 'blur(8px)'
                                            }}>
                                                ▲ {place.altitude}
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '14px',
                                                right: '14px',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                color: '#0B150E',
                                                fontSize: '11.5px',
                                                fontWeight: '700',
                                                padding: '4px 12px',
                                                borderRadius: '999px',
                                                backdropFilter: 'blur(8px)'
                                            }}>
                                                {place.highlight}
                                            </div>
                                        </div>

                                        <div style={{ padding: '26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '12.5px', color: '#E5A93B', fontWeight: '800', marginBottom: '8px' }}>
                                                <i className="fa-solid fa-compass" style={{ marginRight: '6px' }}></i>
                                                {place.distance}
                                            </div>
                                            
                                            <h3 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '22px',
                                                fontWeight: '800',
                                                color: '#0B150E',
                                                margin: '0 0 12px'
                                            }}>
                                                {place.title}
                                            </h3>

                                            <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, margin: '0 0 24px', flex: 1 }}>
                                                {place.desc}
                                            </p>

                                            <a
                                                href={`https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!%20I%20want%20to%20know%20how%20to%20visit%20${encodeURIComponent(place.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-lime"
                                                style={{
                                                    padding: '12px 20px',
                                                    fontSize: '13.5px',
                                                    fontWeight: '800',
                                                    textDecoration: 'none',
                                                    textAlign: 'center',
                                                    marginTop: 'auto'
                                                }}
                                            >
                                                Inquire Trail Route ↗
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    5. THE CREATORS & MOUNTAIN MARSHALS (Photo-First Portrait Showcase)
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '120px 24px',
                    background: '#0B150E',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION CREATORS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(34px, 4.8vw, 54px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                The Creators & <span style={{ color: '#E5A93B' }}>Mountain Marshals</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                The wilderness architects, expedition leads, and local ridge masters who live here and craft your Aanandham mountain journeys.
                            </p>
                        </div>

                        {/* Large Photo-First Portrait Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '32px'
                        }}>
                            {TEAM_CREATORS.map((member, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.12 }}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        position: 'relative',
                                        height: '520px',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                                        background: '#070E08',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Full-bleed Portrait Photo */}
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center 20%',
                                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />

                                    {/* Gradient Dark Scrim Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(180deg, rgba(7, 14, 8, 0.15) 0%, rgba(7, 14, 8, 0.4) 45%, rgba(7, 14, 8, 0.95) 90%)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Top Corner Experience Pill */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '20px',
                                        background: 'rgba(7, 14, 8, 0.75)',
                                        border: '1px solid rgba(229, 169, 59, 0.4)',
                                        color: '#E5A93B',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        padding: '6px 14px',
                                        borderRadius: '999px',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)'
                                    }}>
                                        ★ {member.exp}
                                    </div>

                                    {/* Bottom Content Container */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '32px 28px',
                                        zIndex: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    }}>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            color: '#D5ED55',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {member.handle}
                                        </div>

                                        <h3 style={{
                                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                            fontSize: '28px',
                                            fontWeight: '800',
                                            color: '#FFFFFF',
                                            lineHeight: 1.15,
                                            margin: '2px 0 4px',
                                            textShadow: '0 4px 12px rgba(0,0,0,0.6)'
                                        }}>
                                            {member.name}
                                        </h3>

                                        <div style={{
                                            fontSize: '15px',
                                            color: '#E5A93B',
                                            fontWeight: '800',
                                            marginBottom: '6px'
                                        }}>
                                            {member.role}
                                        </div>

                                        <div style={{
                                            fontSize: '13px',
                                            color: '#C8D8CB',
                                            lineHeight: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span style={{ color: '#D5ED55' }}>✦</span>
                                            <span>{member.specialty}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    6. ORGANIC CURVED NATURE CTA BANNER (With Mountain Backdrop)
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '80px 24px 120px',
                    background: '#F8F9F5'
                }}>
                    <div style={{
                        maxWidth: '1240px',
                        margin: '0 auto',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=90")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                        border: '1.5px solid rgba(213, 237, 85, 0.45)',
                        borderRadius: '36px',
                        padding: 'clamp(56px, 8vw, 96px) 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Layered Obsidian and Sunrise Gradient Backdrop */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(7, 14, 8, 0.82) 0%, rgba(11, 21, 14, 0.88) 55%, rgba(7, 14, 8, 0.96) 100%), radial-gradient(circle at 80% 50%, rgba(229, 169, 59, 0.35) 0%, transparent 60%)',
                            zIndex: 1
                        }} />

                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="star-badge" style={{ marginBottom: '18px' }}>
                                <span className="star-icon">★</span> EXPEDITIONS ARE LIVE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(34px, 5.2vw, 56px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                maxWidth: '840px',
                                margin: '0 0 18px',
                                lineHeight: 1.12,
                                textShadow: '0 8px 30px rgba(0,0,0,0.7)'
                            }}>
                                Ready to Swap the Screen for the <span style={{ color: '#E5A93B' }}>Sunrise Cloud Bed</span>?
                            </h2>
                            <p style={{
                                fontSize: '16.5px',
                                color: '#DCE7DE',
                                maxWidth: '660px',
                                margin: '0 0 40px',
                                lineHeight: 1.65,
                                textShadow: '0 4px 16px rgba(0,0,0,0.6)'
                            }}>
                                Reserve your verified geodesic dome, romantic cliffside tent, or 4x4 high-peak safari in Suryanelli & Kolukkumalai.
                            </p>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Link
                                    href="/#packages"
                                    className="btn-lime"
                                    style={{
                                        padding: '16px 42px',
                                        fontSize: '15.5px',
                                        fontWeight: '800',
                                        textDecoration: 'none',
                                        boxShadow: '0 10px 30px rgba(213, 237, 85, 0.4)'
                                    }}
                                >
                                    Explore Campsite Packages ↗
                                </Link>
                                <Link
                                    href="/contact"
                                    style={{
                                        padding: '16px 32px',
                                        borderRadius: '999px',
                                        background: 'rgba(11, 21, 14, 0.85)',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        color: '#FFFFFF',
                                        fontSize: '15.5px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>💬 Talk to Concierge</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── UNIFIED REUSABLE FOOTER ── */}
            <Footer />
        </div>
    );
}
