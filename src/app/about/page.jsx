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

// ── 4 BESPOKE WILDERNESS PILLARS ──
const WILDERNESS_PILLARS = [
    {
        num: '01',
        title: 'High-Altitude Safety & Native Marshals',
        tag: 'PERMIT & PROTOCOL',
        icon: 'fa-solid fa-shield-halved',
        bg: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        desc: 'Every ridge trek, campfire session, and 4x4 ascent is supervised by certified local mountain marshals trained in high-altitude topography, medical response, and wildlife navigation.'
    },
    {
        num: '02',
        title: 'Thermal Insulated Pods & Private En-Suites',
        tag: 'ALL-WEATHER COMFORT',
        icon: 'fa-solid fa-tent',
        bg: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        desc: 'Engineered for mountain conditions: double-walled waterproof canvas, premium pocket-spring mattresses, fresh organic cotton duvets, and private sanitized washrooms with hot showers.'
    },
    {
        num: '03',
        title: 'Farm-to-Campfire Culinary Craft',
        tag: 'LIVE GRILL & TEAS',
        icon: 'fa-solid fa-fire-burner',
        bg: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
        desc: 'Hot live campfire barbecues, traditional Kerala earthen pot dishes, locally sourced spiced curries, and freshly brewed cardamom chai harvested directly from our surrounding plantations.'
    },
    {
        num: '04',
        title: '100% Zero-Trace Ecological Ethics',
        tag: 'LEAVE NO TRACE',
        icon: 'fa-solid fa-leaf',
        bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        desc: 'No single-use plastics permitted on our ridges. 100% solar and low-voltage lighting, organic compost cycles, and direct reinvestment into local tribal youth employment and trail conservation.'
    }
];

// ── EXPEDITION TEAM MEMBERS ──
const TEAM_MEMBERS = [
    {
        name: 'Suryanarayanan K.',
        role: 'Founder & Mountain Director',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
        exp: '14+ Years in Western Ghats',
        bio: 'Born and raised along the Suryanelli ridgelines, Surya founded Aanandham to replace commercial mass-tourism with intimate, sustainable mountain living.',
        tags: ['High Altitude Navigation', '4x4 Offroading', 'Eco-Architecture']
    },
    {
        name: 'Ananya Menon',
        role: 'Head of Camper Care & Safety',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        exp: 'Wilderness Safety Specialist',
        bio: 'Ananya oversees all camp operations, female solo-traveler safety, pristine hygiene standards, and bespoke family expedition hospitality.',
        tags: ['Camp Hygiene', 'Wellness Retreats', 'First-Aid Certified']
    },
    {
        name: 'Muthuvel Pandian',
        role: 'Chief 4x4 Trail Marshal',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        exp: '20+ Years Kolukkumalai Driver',
        bio: 'The undisputed master of the rocky Kolukkumalai terrain. Muthuvel navigates sheer drop-offs with absolute serenity and infectious mountain smiles.',
        tags: ['Off-Road Safety', 'Wildlife Tracking', 'Trail Logistics']
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
                    3. THE 4 UNCOMPROMISING WILDERNESS PILLARS
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#0B150E',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> OUR CORE STANDARDS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                The 4 Pillars of <span style={{ color: '#E5A93B' }}>Aanandham Hospitality</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                Crafted to ensure you experience authentic raw heights with the hygiene, warmth, and security of a private boutique stay.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '28px'
                        }}>
                            {WILDERNESS_PILLARS.map((pillar, idx) => (
                                <div
                                    key={idx}
                                    className="card-hover-lift"
                                    style={{
                                        position: 'relative',
                                        borderRadius: '28px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        background: '#0E1A11',
                                        minHeight: '380px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        padding: '32px 28px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: `url(${pillar.bg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.35
                                    }} />

                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(180deg, rgba(14, 26, 17, 0.4) 0%, rgba(7, 14, 8, 0.96) 65%)'
                                    }} />

                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                            <div style={{
                                                width: '52px',
                                                height: '52px',
                                                borderRadius: '16px',
                                                background: 'rgba(229, 169, 59, 0.2)',
                                                border: '1px solid rgba(229, 169, 59, 0.4)',
                                                color: '#E5A93B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '22px'
                                            }}>
                                                <i className={pillar.icon}></i>
                                            </div>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                background: 'rgba(255, 255, 255, 0.12)',
                                                color: '#D5ED55',
                                                padding: '4px 12px',
                                                borderRadius: '999px',
                                                letterSpacing: '0.8px'
                                            }}>
                                                {pillar.tag}
                                            </span>
                                        </div>

                                        <div style={{ fontSize: '13px', color: '#E5A93B', fontWeight: '800', marginBottom: '6px' }}>
                                            PILLAR {pillar.num}
                                        </div>

                                        <h3 style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '21px',
                                            fontWeight: '800',
                                            color: '#FFFFFF',
                                            lineHeight: 1.25,
                                            margin: '0 0 12px'
                                        }}>
                                            {pillar.title}
                                        </h3>

                                        <p style={{
                                            fontSize: '13.5px',
                                            color: '#B2C4B5',
                                            lineHeight: 1.65,
                                            margin: 0
                                        }}>
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </div>
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
                    5. WILDERNESS LEADERSHIP & EXPEDITION MARSHALS
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#0B150E',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION LEADERSHIP
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                Guided by True Mountain People
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '620px', margin: '0 auto' }}>
                                Our marshals and directors live on these ridges. They know every mist pocket, hairpin curve, and sunrise angle by heart.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '32px'
                        }}>
                            {TEAM_MEMBERS.map((member, i) => (
                                <div
                                    key={i}
                                    className="card-hover-lift"
                                    style={{
                                        background: '#0E1A11',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '32px',
                                        padding: '32px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 20px 48px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '22px' }}>
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            style={{
                                                width: '78px',
                                                height: '78px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #E5A93B'
                                            }}
                                        />
                                        <div>
                                            <h3 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '20px',
                                                fontWeight: '800',
                                                color: '#FFFFFF',
                                                margin: '0 0 4px'
                                            }}>
                                                {member.name}
                                            </h3>
                                            <div style={{ fontSize: '13px', color: '#E5A93B', fontWeight: '800' }}>
                                                {member.role}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: '#8E9B92', marginTop: '2px' }}>
                                                {member.exp}
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.7, margin: '0 0 24px', flex: 1 }}>
                                        {member.bio}
                                    </p>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {member.tags.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                style={{
                                                    background: 'rgba(213, 237, 85, 0.1)',
                                                    border: '1px solid rgba(213, 237, 85, 0.25)',
                                                    color: '#D5ED55',
                                                    fontSize: '11.5px',
                                                    fontWeight: '700',
                                                    padding: '5px 12px',
                                                    borderRadius: '999px'
                                                }}
                                            >
                                                ✓ {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    6. ORGANIC CURVED NATURE CTA BANNER
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '60px 24px 110px',
                    background: '#F8F9F5'
                }}>
                    <div style={{
                        maxWidth: '1240px',
                        margin: '0 auto',
                        background: 'radial-gradient(circle at 80% 50%, rgba(229, 169, 59, 0.3) 0%, rgba(18, 35, 22, 0.95) 55%, #070E08 100%)',
                        border: '1px solid rgba(213, 237, 85, 0.35)',
                        borderRadius: '36px',
                        padding: 'clamp(48px, 7vw, 84px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div className="star-badge" style={{ marginBottom: '16px' }}>
                            <span className="star-icon">★</span> EXPEDITIONS ARE LIVE
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: 'clamp(32px, 5vw, 54px)',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em',
                            maxWidth: '820px',
                            margin: '0 0 18px',
                            lineHeight: 1.15
                        }}>
                            Ready to Swap the Screen for the <span style={{ color: '#E5A93B' }}>Sunrise Cloud Bed</span>?
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#C3D4C6',
                            maxWidth: '640px',
                            margin: '0 0 36px',
                            lineHeight: 1.65
                        }}>
                            Reserve your verified geodesic dome, romantic cliffside tent, or 4x4 high-peak safari in Suryanelli & Kolukkumalai.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link
                                href="/#packages"
                                className="btn-lime"
                                style={{
                                    padding: '15px 38px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    textDecoration: 'none'
                                }}
                            >
                                Explore Campsite Packages ↗
                            </Link>
                            <Link
                                href="/contact"
                                style={{
                                    padding: '15px 30px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    color: '#FFFFFF',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>💬 Talk to Concierge</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── UNIFIED REUSABLE FOOTER ── */}
            <Footer />
        </div>
    );
}
