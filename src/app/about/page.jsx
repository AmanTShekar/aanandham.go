"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';

// ── NEARBY ATTRACTIONS & SANCTUARIES DATA ──
const NEARBY_PLACES = [
    {
        id: 'kolukkumalai',
        title: 'Kolukkumalai Sunrise Peak',
        category: 'High Peaks',
        distance: '4.5 km · 25 mins by 4x4 Jeep',
        altitude: '7,900 FT',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        desc: 'The highest organic tea plantation on Earth. Accessible strictly via 4x4 Jeep safari over rugged rock terrain, revealing the legendary golden sunrise over rolling cloud beds.'
    },
    {
        id: 'phantom-head',
        title: 'Phantom Head Ridge',
        category: 'Trails',
        distance: '1.2 km · 20 min ridge hike',
        altitude: '6,800 FT',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        desc: 'A secret high-altitude ridge line resembling a phantom skull in silhouette. Offers an unobstructed 360-degree vista of the Suryanelli tea valleys and Anayirangal basin.'
    },
    {
        id: 'anayirangal',
        title: 'Anayirangal Lake & Meadows',
        category: 'Lakes & Waterfalls',
        distance: '6.0 km · 15 mins drive',
        altitude: '5,500 FT',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        desc: 'Translated as "the place where wild elephants drink", this emerald reservoir is bordered by misty pine forests and tea estates. Ideal for evening shoreline walks.'
    },
    {
        id: 'lockhart-gap',
        title: 'Lockhart Gap Valley Vista',
        category: 'High Peaks',
        distance: '8.5 km · 20 mins drive',
        altitude: '6,200 FT',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        desc: 'A colossal natural mountain gap carved between two monolithic granite cliffs, providing dramatic sunset gradients over the Bison Valley.'
    },
    {
        id: 'chinnakanal',
        title: 'Chinnakanal Spring Waterfalls',
        category: 'Lakes & Waterfalls',
        distance: '5.0 km · 12 mins drive',
        altitude: '5,900 FT',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        desc: 'Pure mountain spring water cascading from high granite shelves, surrounded by wild cardamom plantations, cinnamon groves, and silver oaks.'
    },
    {
        id: 'papathy-shola',
        title: 'Papathy Shola (Butterfly Sanctuary)',
        category: 'Trails',
        distance: '3.8 km · 15 mins by 4x4',
        altitude: '6,400 FT',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        desc: 'A conserved high-altitude Shola rainforest habitat home to migratory mountain butterflies, rare orchids, and wild Nilgiri tahr trails.'
    }
];

// ── WILDERNESS STANDARDS ──
const WILDERNESS_PILLARS = [
    {
        num: '01',
        title: 'Safety First & High Altitude Marshals',
        icon: 'fa-solid fa-shield-heart',
        desc: 'Every trek and safari is guided by certified local mountain marshals trained in wilderness first-aid, high-altitude terrain management, and wildlife tracking.'
    },
    {
        num: '02',
        title: 'Thermal Insulated Pods & Clean Washrooms',
        icon: 'fa-solid fa-tent',
        desc: 'Say goodbye to thin camping mats on rocky dirt. Our weather-sealed pods feature thick spring mattresses, fresh duvet linens, wooden decks, and private sanitized washrooms.'
    },
    {
        num: '03',
        title: 'Authentic Campfire Dining & Local Flavors',
        icon: 'fa-solid fa-fire-burner',
        desc: 'Hot Kerala campfire barbecues, live grilled delicacies, homemade vegetable curries, and freshly brewed cardamom chai harvested directly from our adjoining estate.'
    },
    {
        num: '04',
        title: '100% Zero-Trace & Eco-Preservation',
        icon: 'fa-solid fa-leaf',
        desc: 'We operate strictly under Leave No Trace ethics: zero single-use plastics, solar-powered illumination, organic waste composting, and full local tribal employment.'
    }
];

// ── MILESTONE JOURNEY (2021 - 2026) ──
const TIMELINE_MILESTONES = [
    {
        year: '2021',
        title: 'The First Suryanelli Ridge Pod',
        desc: 'Started with 4 geodesic weather-proof pods on a private cliffside overlooking the cloud bed, guided by 2 local mountain drivers.'
    },
    {
        year: '2023',
        title: 'Kolukkumalai Sunrise 4x4 Network',
        desc: 'Formed Kerala’s premier verified 4x4 off-road team, securing exclusive early sunrise permits for the world’s highest tea estate.'
    },
    {
        year: '2024',
        title: 'Expansion to Vagamon & Wayanad',
        desc: 'Introduced eco-conscious pine hill glamping in Vagamon and remote rainforest treehouses in Wayanad, crossing 10,000 verified happy campers.'
    },
    {
        year: '2026',
        title: 'Digital Platform & Zero-Trace Charter',
        desc: 'Launched real-time campsite availability, seamless WhatsApp dispatch, and full solar-powered energy across all 5 sanctuary locations.'
    }
];

// ── WILDERNESS LEADERSHIP TEAM ──
const TEAM_MEMBERS = [
    {
        name: 'Suryanarayanan K.',
        role: 'Founder & Mountain Director',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Born in the Western Ghats, Surya has spent 14+ years exploring hidden ridges, establishing eco-friendly campsite infrastructure, and championing local youth employment.',
        tags: ['High Altitude Navigation', '4x4 Offroading', 'Eco Tourism']
    },
    {
        name: 'Ananya Menon',
        role: 'Head of Camper Safety & Hospitality',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Ananya ensures every guest enjoys the magic of wilderness with absolute peace of mind, dedicated 24/7 security, and female-friendly campsite accommodations.',
        tags: ['Camp Hygiene', 'Wellness Retreats', 'Safety Protocols']
    },
    {
        name: 'Muthuvel Pandian',
        role: 'Chief 4x4 Marshal & Expedition Lead',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'A 20-year veteran of the grueling Kolukkumalai rocky trails, Muthuvel navigates hair-raising hairpin bends with effortless precision and infectious mountain smiles.',
        tags: ['4x4 Vehicle Safety', 'Kolukkumalai Routes', 'Wildlife Tracking']
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
            backgroundColor: '#0B150E',
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

            <main style={{ paddingTop: '80px' }}>
                {/* ─────────────────────────────────────────────────────────────
                    1. HERO SECTION: MAJESTIC HIGH-ALTITUDE RIDGE BANNER
                ───────────────────────────────────────────────────────────── */}
                <section style={{
                    position: 'relative',
                    padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 8vw, 100px)',
                    overflow: 'hidden',
                    background: 'radial-gradient(circle at 50% 20%, rgba(28, 54, 35, 0.6) 0%, #0B150E 75%)'
                }}>
                    {/* Atmospheric Ambient Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '700px',
                        height: '350px',
                        background: 'radial-gradient(circle, rgba(213, 237, 85, 0.12) 0%, rgba(11, 21, 14, 0) 70%)',
                        pointerEvents: 'none',
                        filter: 'blur(60px)'
                    }} />

                    <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(213, 237, 85, 0.12)', border: '1px solid rgba(213, 237, 85, 0.3)', padding: '6px 18px', borderRadius: '999px', color: '#E5A93B', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}
                        >
                            <span className="live-beacon"></span>
                            OUR WILDERNESS HERITAGE · MUNNAR & WESTERN GHATS
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(36px, 6vw, 68px)',
                                fontWeight: '800',
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                color: '#FFFFFF',
                                maxWidth: '960px',
                                margin: '0 auto 24px'
                            }}
                        >
                            Born on the Ridges of Kerala. Crafted for <span style={{ color: '#E5A93B' }}>True Explorers</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(16px, 2.2vw, 20px)',
                                color: '#A2B6A6',
                                lineHeight: 1.65,
                                maxWidth: '780px',
                                margin: '0 auto 48px'
                            }}
                        >
                            We founded Aanandham to make the awe-inspiring cloud beds of Suryanelli, Kolukkumalai, and Wayanad safely accessible without sacrificing comfort, sanitation, or deep environmental ethics.
                        </motion.p>

                        {/* Fast Metrics Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                maxWidth: '980px',
                                margin: '0 auto'
                            }}
                        >
                            {[
                                { num: '7,900 FT', label: 'Max Peak Elevation', sub: 'Kolukkumalai Sunrise Ridge' },
                                { num: '15,000+', label: 'Verified Campers', sub: 'Across 5 Basecamp Sanctuaries' },
                                { num: '100%', label: 'Zero-Trace Ethics', sub: 'Single-Use Plastic Free Camps' },
                                { num: '4.98 ★', label: 'Average Guest Rating', sub: 'Google & Airbnb Verified' }
                            ].map((stat, i) => (
                                <div key={i} className="card-hover-lift" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px 18px', textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#E5A93B', marginBottom: '4px' }}>
                                        {stat.num}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#8E9B92' }}>
                                        {stat.sub}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    2. THE ORIGIN & ETHOS STORY (Split Photographic Narrative)
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '100px 24px', background: '#0E1A11', position: 'relative' }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        
                        {/* Left Photographic Stack */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"
                                    alt="Aanandham Sunrise Ridge Camp"
                                    style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Floating Quote Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-24px',
                                right: '20px',
                                background: '#122316',
                                border: '1px solid rgba(213, 237, 85, 0.3)',
                                borderRadius: '20px',
                                padding: '18px 24px',
                                maxWidth: '300px',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
                            }}>
                                <div style={{ color: '#E5A93B', fontSize: '20px', fontWeight: '900', lineHeight: 1, marginBottom: '6px' }}>“</div>
                                <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '600', lineHeight: 1.5, marginBottom: '8px' }}>
                                    We don't conquer nature; we listen to the mist and protect every ridge.
                                </div>
                                <div style={{ fontSize: '11px', color: '#A2B6A6', fontWeight: '700' }}>
                                    — Aanandham Wilderness Charter
                                </div>
                            </div>
                        </div>

                        {/* Right Narrative Text */}
                        <div>
                            <div className="star-badge" style={{ marginBottom: '16px' }}>
                                <span className="star-icon">★</span> OUR ROOTS
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.025em', margin: '0 0 20px', lineHeight: 1.2 }}>
                                From a Single Campfire in Suryanelli to Kerala’s Premier Wilderness Collective.
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', lineHeight: 1.75, marginBottom: '20px' }}>
                                Aanandham began when a group of native Western Ghats naturalists and mountain 4x4 drivers saw that modern camping had become chaotic, crowded, and disrespectful to fragile mountain ecologies.
                            </p>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', lineHeight: 1.75, marginBottom: '32px' }}>
                                We set out to build something entirely different: intimate, secluded sanctuary camps situated on private high-elevation cliffs where families, couples, and solo travelers can awaken above the clouds in total safety and luxury.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
                                    <div style={{ color: '#E5A93B', fontSize: '20px', marginBottom: '6px' }}>
                                        <i className="fa-solid fa-seedling"></i>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>Local Native Guides</div>
                                    <div style={{ fontSize: '12px', color: '#8E9B92' }}>100% of our marshals are born and raised in local tea hill villages.</div>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px' }}>
                                    <div style={{ color: '#E5A93B', fontSize: '20px', marginBottom: '6px' }}>
                                        <i className="fa-solid fa-lock"></i>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>Private Cliff Estates</div>
                                    <div style={{ fontSize: '12px', color: '#8E9B92' }}>Zero trespassing, gated camp perimeters with 24/7 onsite marshals.</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    3. OUR 4 UNCOMPROMISING WILDERNESS PILLARS
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '100px 24px', background: '#0B150E' }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> OUR COMMITMENT
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.025em', margin: '0 0 12px' }}>
                                The Four Pillars of Aanandham Sanctuary
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                Designed to deliver the raw intensity of mountain heights with the refined comfort of a boutique resort.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                            {WILDERNESS_PILLARS.map((pillar, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -6 }}
                                    style={{
                                        background: '#101F14',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px',
                                        padding: '36px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(213, 237, 85, 0.12)', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                            <i className={pillar.icon}></i>
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#8E9B92' }}>
                                            {pillar.num}
                                        </span>
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.3 }}>
                                        {pillar.title}
                                    </h3>
                                    <p style={{ fontSize: '13.5px', color: '#A2B6A6', lineHeight: 1.65, margin: 0 }}>
                                        {pillar.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    4. EXPLORE KERALA WILDERNESS LANDMARKS (Filterable Tab Grid)
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '100px 24px', background: '#0E1A11' }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '48px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '12px' }}>
                                    <span className="star-icon">★</span> SURROUNDING WONDERS
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                                    Landmarks Around Our Basecamps
                                </h2>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                {['All', 'High Peaks', 'Trails', 'Lakes & Waterfalls'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '999px',
                                            border: 'none',
                                            background: activeCategory === cat ? '#E5A93B' : 'transparent',
                                            color: activeCategory === cat ? '#121613' : '#A2B6A6',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Landmark Grid */}
                        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
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
                                            background: '#122316',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '24px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={place.image}
                                                alt={place.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0, 0, 0, 0.75)', color: '#E5A93B', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                                {place.altitude}
                                            </div>
                                            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                                {place.category}
                                            </div>
                                        </div>

                                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '12px', color: '#E5A93B', fontWeight: '700', marginBottom: '6px' }}>
                                                <i className="fa-solid fa-location-dot" style={{ marginRight: '6px' }}></i>
                                                {place.distance}
                                            </div>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 10px' }}>
                                                {place.title}
                                            </h3>
                                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>
                                                {place.desc}
                                            </p>

                                            <a
                                                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!%20Can%20you%20guide%20me%20on%20visiting%20this%20location?"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-lime"
                                                style={{
                                                    padding: '10px 18px',
                                                    fontSize: '13px',
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
                    5. OUR MILESTONE TIMELINE (2021 TO 2026)
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '100px 24px', background: '#0B150E' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> OUR TIMELINE
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                                How We Grew Across the Western Ghats
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                            {/* Vertical Line */}
                            <div style={{ position: 'absolute', left: '23px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(213, 237, 85, 0.2)' }} />

                            {TIMELINE_MILESTONES.map((m, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#122316', border: '2px solid #E5A93B', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                                        {m.year}
                                    </div>
                                    <div style={{ background: '#101F14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px 28px', flex: 1 }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px' }}>
                                            {m.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.6, margin: 0 }}>
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────────────────────────
                    6. WILDERNESS LEADERSHIP & EXPEDITION MARSHALS
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '100px 24px', background: '#0E1A11' }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> THE EXPEDITION TEAM
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#FFFFFF', margin: '0 0 12px' }}>
                                Guided by True Mountain People
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '600px', margin: '0 auto' }}>
                                Meet the seasoned leaders who personally oversee camp logistics, guest safety, and high-altitude trail navigation.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                            {TEAM_MEMBERS.map((member, i) => (
                                <div key={i} className="card-hover-lift" style={{ background: '#101F14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '28px', overflow: 'hidden', padding: '28px' }}>
                                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5A93B' }}
                                        />
                                        <div>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 4px' }}>
                                                {member.name}
                                            </h3>
                                            <div style={{ fontSize: '12.5px', color: '#E5A93B', fontWeight: '700' }}>
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '13.5px', color: '#A2B6A6', lineHeight: 1.65, margin: '0 0 20px' }}>
                                        {member.bio}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {member.tags.map((tag, tIdx) => (
                                            <span key={tIdx} style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#D5ED55', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
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
                    7. ORGANIC CURVED NATURE CTA BANNER
                ───────────────────────────────────────────────────────────── */}
                <section style={{ padding: '80px 24px 100px', background: '#0B150E' }}>
                    <div style={{
                        maxWidth: '1240px',
                        margin: '0 auto',
                        background: 'radial-gradient(circle at 80% 50%, rgba(229, 169, 59, 0.25) 0%, rgba(18, 35, 22, 0.95) 60%, #0D1C10 100%)',
                        border: '1px solid rgba(213, 237, 85, 0.3)',
                        borderRadius: '36px',
                        padding: 'clamp(40px, 6vw, 70px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div className="star-badge" style={{ marginBottom: '16px' }}>
                            <span className="star-icon">★</span> EXPEDITIONS ARE OPEN
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.025em', maxWidth: '780px', margin: '0 0 16px', lineHeight: 1.15 }}>
                            Ready to Experience the High Ridges Above the Clouds?
                        </h2>
                        <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '600px', margin: '0 0 32px', lineHeight: 1.65 }}>
                            Reserve your verified geodesic ridge tent, 4x4 sunrise safari, or custom group campsite in Suryanelli and Munnar.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/#packages" className="btn-lime" style={{ padding: '14px 36px', fontSize: '15px', fontWeight: '800', textDecoration: 'none' }}>
                                View Campsite Packages ↗
                            </Link>
                            <Link href="/contact" style={{ padding: '14px 28px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#FFFFFF', fontSize: '15px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
