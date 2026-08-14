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

// ── 4 BESPOKE WILDERNESS PILLARS WITH CINEMATIC PHOTOGRAPHY ──
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
            backgroundColor: '#070E08',
            color: '#FFFFFF',
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
                    1. HERO SECTION: CINEMATIC ATMOSPHERIC MOUNTAIN BANNER
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    position: 'relative',
                    minHeight: '92vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(140px, 18vh, 180px) 24px clamp(60px, 8vh, 100px)',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=85")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 35%',
                    backgroundAttachment: 'fixed',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Layered Obsidian & Forest Canopy Gradients */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(7, 14, 8, 0.82) 0%, rgba(11, 21, 14, 0.65) 45%, rgba(7, 14, 8, 0.98) 100%)',
                        zIndex: 1
                    }} />

                    {/* Radial Sunrise Glow in Center */}
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '800px',
                        height: '450px',
                        background: 'radial-gradient(circle, rgba(229, 169, 59, 0.22) 0%, rgba(213, 237, 85, 0.08) 45%, transparent 70%)',
                        zIndex: 1,
                        filter: 'blur(70px)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        
                        {/* Aanandham Brand Emblem & Coordinates Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '14px',
                                background: 'rgba(11, 21, 14, 0.85)',
                                border: '1px solid rgba(229, 169, 59, 0.45)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                padding: '8px 22px 8px 14px',
                                borderRadius: '999px',
                                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
                                marginBottom: '28px'
                            }}
                        >
                            <img
                                src="/logo.png"
                                alt="Aanandham Logo"
                                style={{
                                    height: '32px',
                                    width: '32px',
                                    objectFit: 'contain',
                                    borderRadius: '50%',
                                    border: '1px solid #E5A93B'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '800', letterSpacing: '0.8px', color: '#E5A93B', textTransform: 'uppercase' }}>
                                <span className="live-beacon"></span>
                                <span>AANANDHAM.GO · SURYANELLI RIDGE · 7,900 FT</span>
                            </div>
                        </motion.div>

                        {/* Grand Editorial Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(40px, 6.5vw, 76px)',
                                fontWeight: '800',
                                lineHeight: 1.08,
                                letterSpacing: '-0.035em',
                                color: '#FFFFFF',
                                maxWidth: '1040px',
                                margin: '0 auto 24px',
                                textShadow: '0 8px 30px rgba(0,0,0,0.6)'
                            }}
                        >
                            Born from the Mountains. Built for <span style={{ color: '#E5A93B' }}>Real Explorers</span>.
                        </motion.h1>

                        {/* Evocative Narrative Subhead */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(17px, 2.2vw, 21px)',
                                color: '#E1E9E2',
                                lineHeight: 1.65,
                                maxWidth: '820px',
                                margin: '0 auto 48px',
                                textShadow: '0 4px 16px rgba(0,0,0,0.5)'
                            }}
                        >
                            We traded fluorescent desks and rigid textbook classrooms for the raw ridges of the Western Ghats. Here is where the mist breathes, campfires roar, and nature teaches what screens never could.
                        </motion.p>

                        {/* Floating Frosted Glass Metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '16px',
                                maxWidth: '1020px',
                                margin: '0 auto'
                            }}
                        >
                            {[
                                { val: '7,900 FT', label: 'Summit Peak Altitude', sub: 'Kolukkumalai Sunrise Ridge' },
                                { val: '15,000+', label: 'Verified Campers', sub: 'Families, Solo & Groups Hosted' },
                                { val: '100%', label: 'Zero-Trace Sanctuary', sub: 'Strict Plastic-Free Protocol' },
                                { val: '4.98 ★', label: 'Expedition Score', sub: 'Over 1,200 Direct Reviews' }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(11, 21, 14, 0.75)',
                                        border: '1px solid rgba(255, 255, 255, 0.14)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        borderRadius: '24px',
                                        padding: '24px 20px',
                                        textAlign: 'center',
                                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
                                    }}
                                >
                                    <div style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '34px',
                                        fontWeight: '800',
                                        color: '#E5A93B',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '4px'
                                    }}>
                                        {stat.val}
                                    </div>
                                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px' }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#A2B6A6' }}>
                                        {stat.sub}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    2. OUT OF THE CLASSROOM: THE EDITORIAL STORY SECTION
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#0B150E',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '56px',
                            alignItems: 'center'
                        }}>
                            {/* Left: Editorial Narrative & Origin Charter */}
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
                                    color: '#FFFFFF',
                                    margin: '0 0 24px'
                                }}>
                                    From Rigid Textbooks to Living <span style={{ color: '#E5A93B' }}>Mountain Geography</span>
                                </h2>

                                <p style={{ fontSize: '16px', color: '#A2B6A6', lineHeight: 1.75, marginBottom: '20px' }}>
                                    In modern life, most of what we learn is second-hand: trapped in PDFs, lecture slides, fluorescent conference rooms, and 6-inch phone screens. We talk about weather, but never feel the icy morning wind bite our cheeks. We read about stars, but haven’t looked up into an unpolluted Milky Way in years.
                                </p>

                                <p style={{ fontSize: '16px', color: '#A2B6A6', lineHeight: 1.75, marginBottom: '32px' }}>
                                    Aanandham was founded in 2021 on a singular conviction: <strong style={{ color: '#FFFFFF' }}>true human revitalization happens outdoors</strong>. By engineering weather-proof, insulated dome sanctuaries on private mountain ridges, we made the raw wilderness accessible to everyone — without the hardships of leaking tents or compromised hygiene.
                                </p>

                                {/* Founder Quote Card */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(229, 169, 59, 0.12) 0%, rgba(213, 237, 85, 0.04) 100%)',
                                    borderLeft: '4px solid #E5A93B',
                                    borderRadius: '0 20px 20px 0',
                                    padding: '24px 28px',
                                    position: 'relative'
                                }}>
                                    <p style={{
                                        fontSize: '15px',
                                        fontStyle: 'italic',
                                        color: '#FFFFFF',
                                        lineHeight: 1.65,
                                        margin: '0 0 14px'
                                    }}>
                                        “No textbook or digital screen can replace the raw sensory awakening of standing above a rolling sea of clouds at 7,900 FT with hot cardamom tea in hand.”
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E5A93B', color: '#070E08', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>
                                            S
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF' }}>Suryanarayanan K.</div>
                                            <div style={{ fontSize: '11.5px', color: '#E5A93B' }}>Founder & Mountain Director · Aanandham.go</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Bespoke Visual Collage with Real Mountain Photos */}
                            <div style={{ position: 'relative' }}>
                                {/* Main Large Image */}
                                <div style={{
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                                        background: 'linear-gradient(to top, rgba(7, 14, 8, 0.95) 0%, transparent 100%)'
                                    }}>
                                        <div style={{ display: 'inline-block', background: '#E5A93B', color: '#070E08', fontSize: '11px', fontWeight: '900', padding: '4px 12px', borderRadius: '999px', marginBottom: '6px' }}>
                                            PRIVATE RIDGE SANCTUARY
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                            Suryanelli Basecamp · Overlooking Anayirangal Valley
                                        </div>
                                    </div>
                                </div>

                                {/* Overlapping Floating Feature Card */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-28px',
                                    left: '-24px',
                                    background: 'rgba(17, 34, 22, 0.95)',
                                    border: '1px solid rgba(213, 237, 85, 0.35)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '24px',
                                    padding: '18px 24px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    maxWidth: '320px'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(229, 169, 59, 0.2)', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                        <i className="fa-solid fa-cloud-sun"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                            360° Cloud Bed Bedding
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6' }}>
                                            Sunrise views above the cloud line
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    3. THE 4 UNCOMPROMISING WILDERNESS PILLARS (Photo Cards)
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#070E08',
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
                                    {/* Cinematic Background Image with Dark Fade */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: `url(${pillar.bg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.35,
                                        transition: 'opacity 0.4s ease, transform 0.4s ease'
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
                    4. SURROUNDING LANDMARKS & HIGH PEAKS (Interactive Tabs)
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '110px 24px',
                    background: '#0B150E',
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
                                    color: '#FFFFFF',
                                    margin: 0
                                }}>
                                    High Ridges & Wonders Around Us
                                </h2>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                padding: '6px',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
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
                                            color: activeCategory === cat ? '#070E08' : '#A2B6A6',
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
                                            background: '#112115',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '28px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
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
                                                background: 'rgba(255, 255, 255, 0.18)',
                                                color: '#FFFFFF',
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
                                                color: '#FFFFFF',
                                                margin: '0 0 12px'
                                            }}>
                                                {place.title}
                                            </h3>

                                            <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.65, margin: '0 0 24px', flex: 1 }}>
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
                    background: '#070E08',
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
                    6. ZERO-TRACE ENVIRONMENTAL PLEDGE
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '80px 24px',
                    background: '#0B150E'
                }}>
                    <div style={{
                        maxWidth: '1240px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, rgba(17, 34, 22, 0.9) 0%, rgba(11, 21, 14, 0.95) 100%)',
                        border: '1px solid rgba(229, 169, 59, 0.3)',
                        borderRadius: '32px',
                        padding: 'clamp(36px, 5vw, 60px)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '40px',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div className="star-badge" style={{ marginBottom: '14px' }}>
                                <span className="star-icon">★</span> OUR CONSERVATION PLEDGE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(26px, 3.5vw, 40px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                margin: '0 0 16px',
                                lineHeight: 1.2
                            }}>
                                Leaving the Western Ghats Cleaner Than We Found It
                            </h2>
                            <p style={{ fontSize: '14.5px', color: '#A2B6A6', lineHeight: 1.7, margin: 0 }}>
                                We are stewards of these mountains, not just hosts. Every camper who visits our ridge signs our digital Leave-No-Trace charter, supporting native reforestation and strict waste reclamation.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                'Zero Single-Use Plastic Bottle policy (refill stations across all pods)',
                                'Solar-powered ambient lighting & low-noise emergency backup',
                                '100% locally sourced plantation timber & low-impact platform decks',
                                'Local tribal youth employment with certified mountain rescue training'
                            ].map((pledge, pIdx) => (
                                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.04)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E5A93B', color: '#070E08', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', flexShrink: 0 }}>
                                        ✓
                                    </div>
                                    <span style={{ fontSize: '13.5px', color: '#E1E9E2', fontWeight: '600' }}>
                                        {pledge}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    7. ORGANIC CURVED NATURE CTA BANNER
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    padding: '60px 24px 110px',
                    background: '#070E08'
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
                        boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
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
