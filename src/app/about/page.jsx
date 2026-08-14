"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';

// ── REUSABLE FRAMER MOTION ULTRA-CLEAN REVEAL VARIANTS ──
const sectionReveal = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.06
        }
    }
};

const cardReveal = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    }
};

const stickyReveal = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
};

// ── 1. ELEVATION TIERS & TERRAIN PROFILE ──
const ELEVATION_TIERS = [
    {
        altitude: '7,900 FT',
        name: 'Kolukkumalai Sunrise Peak',
        badge: 'SUMMIT RIDGE',
        desc: 'World’s highest organic tea plantation, accessible only via rugged 4x4 Jeep safaris across granite boulders. Experience sunrise floating above sea-of-clouds.',
        temp: '10°C - 16°C',
        icon: 'fa-solid fa-mountain-sun'
    },
    {
        altitude: '6,800 FT',
        name: 'Phantom Head Cliffline',
        badge: 'SUNSET TRAIL',
        desc: 'A secret high-altitude ridge line resembling a skull in silhouette. Offers panoramic 360-degree views of the Suryanelli valley and elephant corridors.',
        temp: '12°C - 18°C',
        icon: 'fa-solid fa-compass'
    },
    {
        altitude: '6,500 FT',
        name: 'Aanandham Basecamp Pods',
        badge: 'SANCTUARY BASE',
        desc: 'Our private weather-sealed geodesic dome sanctuary. Insulated from high winds, featuring private hot-water en-suites and starlit campfire circles.',
        temp: '14°C - 20°C',
        icon: 'fa-solid fa-tent'
    },
    {
        altitude: '5,500 FT',
        name: 'Anayirangal Lake Basin',
        badge: 'EMERALD WATERWAY',
        desc: 'The historic watering ground for wild mountain elephants, framed by pine forests and rolling tea gardens along the lake shoreline.',
        temp: '16°C - 22°C',
        icon: 'fa-solid fa-water'
    }
];

// ── 2. THE 4 PILLARS OF AANANDHAM HOSPITALITY (Vibrant Colored Sticky Notes) ──
const WILDERNESS_PILLARS = [
    {
        id: '01',
        title: 'Certified Native Mountain Marshals',
        tag: 'FIELD DISPATCH · 01',
        stamp: '100% MARSHAL GUIDED',
        stampColor: '#1E3A1E',
        paperBg: '#FEF08A', // Sunlit Canary Yellow
        inkColor: '#1A1D0E',
        tapeColor: 'rgba(234, 179, 8, 0.9)',
        tapeRotation: '-2.5deg',
        rotation: '-1.6deg',
        icon: 'fa-solid fa-shield-halved',
        metric: '1:6 Guide-to-Camper Ratio',
        desc: 'Every ridge trek, campfire session, and 4x4 ascent is supervised by certified local mountain marshals trained in high-altitude topography, medical response, and wildlife tracking.',
        specs: [
            '100% native Suryanelli ridge navigators',
            'Real-time satellite & radio coordination',
            'State Forest Department clearance & permits'
        ],
        memo: '“The mountain demands respect. We ensure you feel the raw power of the ridge with total peace of mind.”'
    },
    {
        id: '02',
        title: 'Thermal Insulated Pods & En-Suites',
        tag: 'FIELD DISPATCH · 02',
        stamp: 'ALL-WEATHER SEALED',
        stampColor: '#1A381E',
        paperBg: '#D9F99D', // Electric Mountain Lime
        inkColor: '#0F2414',
        tapeColor: 'rgba(132, 204, 22, 0.9)',
        tapeRotation: '2.4deg',
        rotation: '1.4deg',
        icon: 'fa-solid fa-tent',
        metric: '12°C Weather Insulated',
        desc: 'Engineered for true mountain comfort: double-walled waterproof canvas, premium pocket-spring mattresses, 300-threadcount duvets, and private hot-water washrooms.',
        specs: [
            'Double-wall insulated geodesic architecture',
            'Sanitized en-suite washrooms with instant hot geysers',
            '100% waterproof heavy-gauge storm canvas'
        ],
        memo: '“No damp sleeping bags. Step out into the clouds and return to a warm, hotel-grade bed.”'
    },
    {
        id: '03',
        title: 'Farm-to-Campfire Culinary Craft',
        tag: 'FIELD DISPATCH · 03',
        stamp: 'LIVE MOUNTAIN GRILL',
        stampColor: '#4A1D08',
        paperBg: '#FED7AA', // Warm Sunburst Amber / Peach
        inkColor: '#2D1406',
        tapeColor: 'rgba(251, 146, 60, 0.9)',
        tapeRotation: '-1.8deg',
        rotation: '-1.2deg',
        icon: 'fa-solid fa-fire-burner',
        metric: 'Live Earthen Pot BBQ',
        desc: 'Live campfire grills, authentic Kerala earthen-pot curries cooked over open woodfire, and estate-plucked organic cardamom chai brewed fresh on the ridge.',
        specs: [
            'Freshly grilled BBQ with veg and non-veg options',
            'Slow-cooked traditional clay pot recipes',
            'Estate-fresh organic cardamom & tea tastings'
        ],
        memo: '“Hot food tastes twice as good under a blanket of stars at 7,900 FT.”'
    },
    {
        id: '04',
        title: '100% Zero-Trace Conservation Charter',
        tag: 'FIELD DISPATCH · 04',
        stamp: 'LEAVE NO TRACE',
        stampColor: '#0A331E',
        paperBg: '#A7F3D0', // Fresh Alpine Mint
        inkColor: '#062817',
        tapeColor: 'rgba(52, 211, 153, 0.9)',
        tapeRotation: '2.0deg',
        rotation: '1.6deg',
        icon: 'fa-solid fa-leaf',
        metric: '0g Single-Use Plastic',
        desc: 'Strict environmental ethics: zero single-use plastics permitted, 100% solar ambient night lighting, organic composting, and direct reinvestment into local tribal youth employment.',
        specs: [
            'Complete ban on disposable plastic bottles',
            'Low-voltage solar pathway illumination',
            'Direct livelihood support for native families'
        ],
        memo: '“We leave the ridgelines cleaner, quieter, and wilder than when we found them.”'
    }
];

// ── 3. OUR EVOLUTION TIMELINE (2021 — 2026) ──
const TIMELINE_MILESTONES = [
    {
        year: '2021',
        title: 'Pitching the First Ridge Dome',
        tag: 'THE SPARK',
        desc: 'Frustrated by mass-market hotel tourism, founder Surya pitched the first prototype geodesic dome on a quiet Suryanelli cliffside to prove real wilderness camping could be comfortable.'
    },
    {
        year: '2022',
        title: 'Solar Power & Zero-Trace Protocol',
        tag: 'ECO MILESTONE',
        desc: 'Transformed the campsite into a self-sustaining eco-sanctuary with solar battery arrays, rainwater harvesting, and a strict ban on single-use plastics across all trails.'
    },
    {
        year: '2024',
        title: 'The Off-Road 4x4 Fleet Expansion',
        tag: 'EXPEDITION FLEET',
        desc: 'Assembled our dedicated fleet of custom 4x4 safari Jeeps and recruited veteran local tribal marshals to lead sunrise expeditions up the rugged Kolukkumalai peak.'
    },
    {
        year: '2026',
        title: '15,000+ Campers & Verified Standard',
        tag: 'WHERE WE STAND',
        desc: 'Over 15,000 explorers hosted with a 4.98 ★ expedition score. Aanandham is now recognized as Kerala’s premier high-altitude wilderness retreat.'
    }
];

// ── 4. NEARBY LANDMARKS & TRAILS ──
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

// ── 5. EXPEDITION CREATORS & MOUNTAIN MARSHALS ──
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

// ── 6. VERIFIED EXPLORER REVIEWS & CHRONICLES ──
const CAMPER_REVIEWS = [
    {
        name: 'Dr. Arvind & Shweta',
        type: 'Couple · Dome Stay',
        rating: 5,
        date: 'Hosted Dec 2025',
        quote: 'Waking up inside the geodesic dome with the morning mist drifting right outside the panoramic window is something we will never forget. The hot showers and campfire BBQ were extraordinary.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
        name: 'Karthik Raja',
        type: 'Solo Trekker · Jeep Safari',
        rating: 5,
        date: 'Hosted Jan 2026',
        quote: 'Muthuvel’s 4x4 Jeep driving to Kolukkumalai peak at 4:30 AM is peak adrenaline. You literally watch the sun ignite the clouds from 7,900 FT. 10/10 safety and hospitality.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
        name: 'Meera Nambiar & Family',
        type: 'Family of 4 · Private Sanctuary',
        rating: 5,
        date: 'Hosted Jan 2026',
        quote: 'We brought our two kids (8 and 11) for their first real camping trip. Clean washrooms, cozy blankets, zero plastic, and safe trails. The kids didn’t ask for an iPad once!',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
];

// ── 7. ABOUT & BASECAMP FAQS ──
const ABOUT_FAQS = [
    {
        num: '01',
        q: 'Where is Aanandham Basecamp located, and how do we reach it?',
        a: 'Aanandham is located in Suryanelli, near Munnar, perched at 6,500 FT along the Western Ghats ridgeline. We provide safe parking for standard vehicles at our Suryanelli base point, from where our dedicated 4x4 Jeeps transport you up to the private sanctuary ridge.'
    },
    {
        num: '02',
        q: 'Is it safe for solo female travelers and families with young children?',
        a: 'Absolutely. We maintain a strict 1:6 marshal-to-guest ratio, well-lit perimeter pathways, 24/7 on-site staff, private sanitized washrooms with hot water geysers, and locked thermal insulated domes. Over 40% of our guests are families and solo female explorers.'
    },
    {
        num: '03',
        q: 'What should we pack for the high-altitude weather?',
        a: 'Night temperatures hover between 10°C and 16°C. We provide thermal insulated duvets, but recommend bringing a windproof jacket, comfortable hiking shoes, a woolen cap/beanie, and personal toiletries. We provide towels, soaps, and hot water.'
    },
    {
        num: '04',
        q: 'How does your Leave-No-Trace zero plastic policy work?',
        a: 'We do not permit single-use plastic water bottles or polythene packaging on our ridges. We provide pure mountain spring water in sanitized copper dispensers and reusable flasks. All camp waste is organically composted or transported down for municipal recycling.'
    }
];

export default function AboutPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeFaq, setActiveFaq] = useState(0);
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

    const ctaRef = useRef(null);
    const { scrollYProgress: ctaScrollProgress } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"]
    });
    const ctaBgScale = useTransform(ctaScrollProgress, [0, 0.5, 1], [1.0, 1.16, 1.28]);
    const ctaBgY = useTransform(ctaScrollProgress, [0, 1], ["-6%", "6%"]);

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
                                className="hero-brand-logo"
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
                            className="hero-headline"
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
                            className="hero-subtitle"
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
                                className="hero-instagram-btn"
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
                <motion.section 
                    id="ethos" 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '110px 24px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '56px',
                            alignItems: 'center'
                        }}>
                            {/* Left: Editorial Narrative */}
                            <motion.div variants={cardReveal}>
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

                                {/* Founder Quote Card with Spring Hover */}
                                <motion.div 
                                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(11, 21, 14, 0.08)',
                                        borderLeft: '4px solid #E5A93B',
                                        borderRadius: '0 20px 20px 0',
                                        padding: '24px 28px',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                                        cursor: 'default'
                                    }}
                                >
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
                                </motion.div>
                            </motion.div>

                            {/* Right: Bespoke Visual Collage with Real Photography */}
                            <motion.div variants={cardReveal} style={{ position: 'relative' }}>
                                <div style={{
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
                                    border: '1px solid rgba(11, 21, 14, 0.08)',
                                    position: 'relative'
                                }}>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                                        background: 'linear-gradient(to top, rgba(7, 14, 8, 0.92) 0%, transparent 100%)',
                                        pointerEvents: 'none'
                                    }}>
                                        <div style={{ display: 'inline-block', background: '#E5A93B', color: '#070E08', fontSize: '11px', fontWeight: '900', padding: '4px 12px', borderRadius: '999px', marginBottom: '6px' }}>
                                            PRIVATE RIDGE SANCTUARY
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                                            Suryanelli Basecamp · Overlooking Anayirangal Valley
                                        </div>
                                    </div>
                                </div>

                                <motion.div 
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '-28px',
                                        left: '-24px',
                                        background: '#0B150E',
                                        border: '1.5px solid rgba(213, 237, 85, 0.4)',
                                        borderRadius: '24px',
                                        padding: '18px 24px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        maxWidth: '320px',
                                        color: '#FFFFFF',
                                        zIndex: 3
                                    }}
                                >
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
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    3. SURYANELLI RIDGE GEOGRAPHY & ELEVATION METER (Staggered Cascade)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '100px 24px',
                        background: '#070E08',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                        color: '#FFFFFF'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">▲</span> RIDGE TOPOGRAPHY
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                The Suryanelli <span style={{ color: '#E5A93B' }}>Altitude Spectrum</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                From the emerald tea shorelines of Anayirangal Lake to the rugged 7,900 FT granite summit of Kolukkumalai.
                            </p>
                        </div>

                        {/* Altitude Scale Grid */}
                        <motion.div 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '24px'
                            }}
                        >
                            {ELEVATION_TIERS.map((tier, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -10, 
                                        borderColor: 'rgba(229, 169, 59, 0.6)',
                                        boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(229, 169, 59, 0.25)' 
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        background: '#0D1A10',
                                        border: '1px solid rgba(229, 169, 59, 0.25)',
                                        borderRadius: '24px',
                                        padding: '30px 24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '32px',
                                            fontWeight: '800',
                                            color: '#E5A93B',
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {tier.altitude}
                                        </span>
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '12px',
                                            background: 'rgba(229, 169, 59, 0.15)',
                                            color: '#E5A93B',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px'
                                        }}>
                                            <i className={tier.icon}></i>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#D5ED55', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        {tier.badge}
                                    </div>

                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '19px',
                                        fontWeight: '800',
                                        color: '#FFFFFF',
                                        margin: '0 0 10px',
                                        lineHeight: 1.25
                                    }}>
                                        {tier.name}
                                    </h3>

                                    <p style={{ fontSize: '13.5px', color: '#A2B6A6', lineHeight: 1.65, margin: '0 0 20px', flex: 1 }}>
                                        {tier.desc}
                                    </p>

                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '12px',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        color: '#8E9B92'
                                    }}>
                                        <span>Avg Temp:</span>
                                        <strong style={{ color: '#FFFFFF' }}>{tier.temp}</strong>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    4. THE 4 UNCOMPROMISING WILDERNESS PILLARS (Vibrant Colored Sticky Notes with Spring Physics)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '120px 24px 140px',
                        background: '#0B150E',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Atmospheric Ridge Glow & Mist Backlight */}
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1000px',
                        height: '450px',
                        background: 'radial-gradient(circle, rgba(229, 169, 59, 0.14) 0%, rgba(213, 237, 85, 0.08) 45%, transparent 70%)',
                        pointerEvents: 'none',
                        filter: 'blur(80px)'
                    }} />

                    <div style={{ width: '100%', maxWidth: 'min(100%, 1340px)', margin: '0 auto', position: 'relative', zIndex: 2, boxSizing: 'border-box' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '74px' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(229, 169, 59, 0.18)',
                                border: '1.5px solid #E5A93B',
                                color: '#E5A93B',
                                padding: '8px 22px',
                                borderRadius: '999px',
                                fontSize: '12.5px',
                                fontWeight: '900',
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 24px rgba(229, 169, 59, 0.3)',
                                marginBottom: '16px'
                            }}>
                                <span style={{ color: '#E5A93B', fontSize: '15px' }}>★</span> EXPEDITION FIELD DISPATCHES
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
                                Handcrafted wilderness standards written on the ridge. Hover or tap to inspect our unyielding comfort and safety protocols.
                            </p>
                        </div>

                        {/* 4 Vibrant Colored Sticky Notes Grid with Staggered Cascading Reveal (4 in a Row Centered) */}
                        <motion.div 
                            variants={staggerContainer}
                            className="pillars-sticky-grid"
                            style={{
                                paddingTop: '20px'
                            }}
                        >
                            {WILDERNESS_PILLARS.map((pillar, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={stickyReveal}
                                    whileHover={{
                                        y: -20,
                                        rotate: 0,
                                        scale: 1.04,
                                        boxShadow: '0 36px 80px -10px rgba(0, 0, 0, 0.55), 0 16px 30px -6px rgba(0, 0, 0, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                    style={{
                                        position: 'relative',
                                        background: pillar.paperBg,
                                        color: pillar.inkColor,
                                        borderRadius: '10px 10px 40px 10px',
                                        padding: '44px 36px 36px',
                                        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.38), 0 6px 16px rgba(0,0,0,0.18)',
                                        transform: `rotate(${pillar.rotation})`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '440px',
                                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.04) 28px)',
                                        cursor: 'grab'
                                    }}
                                >
                                    {/* Textured Washi Tape Strip with Brass Pin on Top */}
                                    <motion.div
                                        whileHover={{ y: -3, scale: 1.04, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        style={{
                                            position: 'absolute',
                                            top: '-14px',
                                            left: '50%',
                                            transform: `translateX(-50%) rotate(${pillar.tapeRotation})`,
                                            width: '140px',
                                            height: '28px',
                                            background: pillar.tapeColor,
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
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
                                            background: '#FFFFFF',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.4)',
                                            border: '1.5px solid #E5A93B'
                                        }} />
                                    </motion.div>

                                    {/* 3D Folded Dog-Ear Corner at Bottom Right */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.22) 50%, rgba(0,0,0,0.08) 100%)',
                                        borderTopLeftRadius: '16px',
                                        boxShadow: '-2px -2px 6px rgba(0,0,0,0.14)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Header Row: Dispatch Badge + Mini Logo + Metric Pill + Vintage Ink Stamp */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <img
                                                src="/logo.png"
                                                alt="Aanandham Logo"
                                                style={{
                                                    height: '26px',
                                                    width: '26px',
                                                    objectFit: 'contain',
                                                    borderRadius: '50%',
                                                    border: '1px solid rgba(0,0,0,0.15)'
                                                }}
                                            />
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

                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                background: 'rgba(0,0,0,0.06)',
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                color: pillar.stampColor
                                            }}>
                                                ★ {pillar.metric}
                                            </span>
                                        </div>

                                        {/* Vintage Double-Bordered Ink Stamp with Pop on Hover */}
                                        <motion.div
                                            whileHover={{ rotate: 0, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
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
                                                transform: 'rotate(-4deg)',
                                                opacity: 0.95,
                                                userSelect: 'none',
                                                background: 'rgba(255,255,255,0.45)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {pillar.stamp}
                                        </motion.div>
                                    </div>

                                    {/* Icon & Bold Headline */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '16px',
                                            background: 'rgba(0, 0, 0, 0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '22px',
                                            color: pillar.inkColor,
                                            flexShrink: 0,
                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <i className={pillar.icon}></i>
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                            fontSize: '23px',
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
                                        fontSize: '14.5px',
                                        lineHeight: 1.7,
                                        margin: '0 0 20px',
                                        opacity: 0.94,
                                        fontWeight: '500'
                                    }}>
                                        {pillar.desc}
                                    </p>

                                    {/* Tactical Checklist Badges */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '22px' }}>
                                        {pillar.specs.map((chk, cIdx) => (
                                            <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: '700', opacity: 0.92 }}>
                                                <span style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.08)',
                                                    color: pillar.stampColor,
                                                    fontSize: '11px',
                                                    fontWeight: '900',
                                                    flexShrink: 0
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
                                        paddingTop: '18px',
                                        borderTop: '1px dashed rgba(0, 0, 0, 0.18)',
                                        fontStyle: 'italic',
                                        fontSize: '13px',
                                        lineHeight: '1.6',
                                        opacity: '0.9',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px'
                                    }}>
                                        <span style={{ fontSize: '15px' }}>✍</span>
                                        <span>{pillar.memo}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    5. OUR MILESTONE TIMELINE (2021 — 2026) (Staggered Cascade)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '110px 24px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> OUR JOURNEY
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#0B150E',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                From A Solitary Ridge Tent to <span style={{ color: '#E5A93B' }}>Kerala’s Premier Basecamp</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', maxWidth: '640px', margin: '0 auto' }}>
                                Our 5-year evolution driven by passion for raw wilderness, local tribal empowerment, and uncompromised camper safety.
                            </p>
                        </div>

                        {/* Milestone Cards Grid */}
                        <motion.div 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '24px'
                            }}
                        >
                            {TIMELINE_MILESTONES.map((mile, mIdx) => (
                                <motion.div
                                    key={mIdx}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -10, 
                                        boxShadow: '0 20px 45px rgba(0,0,0,0.09)' 
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(11, 21, 14, 0.08)',
                                        borderRadius: '26px',
                                        padding: '32px 26px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                                        position: 'relative',
                                        cursor: 'default'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '36px',
                                            fontWeight: '800',
                                            color: '#0B150E',
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {mile.year}
                                        </span>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            background: 'rgba(229, 169, 59, 0.15)',
                                            color: '#C86D14',
                                            padding: '4px 10px',
                                            borderRadius: '999px'
                                        }}>
                                            {mile.tag}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '19px',
                                        fontWeight: '800',
                                        color: '#0B150E',
                                        margin: '0 0 10px',
                                        lineHeight: 1.25
                                    }}>
                                        {mile.title}
                                    </h3>

                                    <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                        {mile.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    6. SURROUNDING LANDMARKS & HIGH PEAKS (Category Tabs & Staggered Reveal)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '110px 24px',
                        background: '#0B150E',
                        position: 'relative',
                        color: '#FFFFFF'
                    }}
                >
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
                                    High Ridges & Landmarks Around Us
                                </h2>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                background: '#121F14',
                                padding: '6px',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
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
                        <motion.div 
                            layout 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '30px'
                            }}
                        >
                            <AnimatePresence>
                                {filteredPlaces.map((place) => (
                                    <motion.div
                                        key={place.id}
                                        layout
                                        variants={cardReveal}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ 
                                            y: -10,
                                            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
                                        }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                        style={{
                                            background: '#0E1A11',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '28px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                            <motion.img
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    7. THE CREATORS & MOUNTAIN MARSHALS (Photo-First Portrait Showcase)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '120px 24px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION CREATORS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(34px, 4.8vw, 54px)',
                                fontWeight: '800',
                                color: '#0B150E',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                The Creators & <span style={{ color: '#E5A93B' }}>Mountain Marshals</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', maxWidth: '640px', margin: '0 auto' }}>
                                The wilderness architects, expedition leads, and local ridge masters who live here and craft your Aanandham mountain journeys.
                            </p>
                        </div>

                        {/* Large Photo-First Portrait Cards */}
                        <motion.div 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '32px'
                            }}
                        >
                            {TEAM_CREATORS.map((member, i) => (
                                <motion.div
                                    key={i}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -12,
                                        boxShadow: '0 30px 70px rgba(0,0,0,0.22)' 
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        position: 'relative',
                                        height: '520px',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(11, 21, 14, 0.12)',
                                        boxShadow: '0 24px 60px rgba(0,0,0,0.14)',
                                        background: '#070E08',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Full-bleed Portrait Photo with Zoom */}
                                    <motion.img
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        src={member.img}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center 20%'
                                        }}
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
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    8. VERIFIED EXPLORER CHRONICLES & REVIEWS (Staggered Review Cards)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '110px 24px',
                        background: '#0B150E',
                        position: 'relative',
                        color: '#FFFFFF'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> VERIFIED CAMPER TESTIMONIALS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                High-Altitude <span style={{ color: '#E5A93B' }}>Camper Chronicles</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                Direct stories from solo adventurers, couples, and families who slept on our Suryanelli ridge.
                            </p>
                        </div>

                        {/* Review Cards Grid */}
                        <motion.div 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '28px'
                            }}
                        >
                            {CAMPER_REVIEWS.map((rev, rIdx) => (
                                <motion.div
                                    key={rIdx}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -10, 
                                        borderColor: 'rgba(229, 169, 59, 0.4)',
                                        boxShadow: '0 25px 55px rgba(0,0,0,0.6)' 
                                    }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                    style={{
                                        background: '#0E1B11',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '28px',
                                        padding: '32px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                                        cursor: 'default'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                        <div style={{ color: '#E5A93B', fontSize: '15px' }}>
                                            {'★'.repeat(rev.rating)}
                                        </div>
                                        <span style={{ fontSize: '11.5px', color: '#8E9B92' }}>
                                            {rev.date}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '14.5px', color: '#DCE8DF', lineHeight: 1.7, margin: '0 0 24px', flex: 1, fontStyle: 'italic' }}>
                                        “{rev.quote}”
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                        <img
                                            src={rev.avatar}
                                            alt={rev.name}
                                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #E5A93B' }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#FFFFFF' }}>{rev.name}</div>
                                            <div style={{ fontSize: '12px', color: '#D5ED55' }}>✓ {rev.type}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    9. ABOUT & BASECAMP FAQS (Interactive Animated Accordions)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '110px 24px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION INTELLIGENCE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#0B150E',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                Frequently Asked Questions
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', maxWidth: '620px', margin: '0 auto' }}>
                                Everything you need to know before joining us on the Suryanelli ridge.
                            </p>
                        </div>

                        {/* Collapsible Accordion */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {ABOUT_FAQS.map((faq, fIdx) => {
                                const isOpen = activeFaq === fIdx;
                                return (
                                    <motion.div
                                        key={fIdx}
                                        whileHover={{ y: -2 }}
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(11, 21, 14, 0.08)',
                                            borderRadius: '24px',
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                    >
                                        <button
                                            onClick={() => setActiveFaq(isOpen ? -1 : fIdx)}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '24px 28px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                gap: '16px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '900', color: '#E5A93B' }}>{faq.num}</span>
                                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#0B150E' }}>{faq.q}</span>
                                            </div>
                                            <motion.div 
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '50%',
                                                    background: isOpen ? '#E5A93B' : '#F1F3EC',
                                                    color: isOpen ? '#070E08' : '#0B150E',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} style={{ fontSize: '12px' }}></i>
                                            </motion.div>
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ padding: '0 28px 24px 58px', overflow: 'hidden' }}
                                                >
                                                    <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, margin: 0 }}>
                                                        {faq.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    10. ORGANIC CURVED NATURE CTA BANNER (With Dynamic Scroll-Zoom Mountain Backdrop)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    ref={ctaRef}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '80px 24px 120px',
                        background: '#F8F9F5'
                    }}
                >
                    <div style={{
                        maxWidth: '1240px',
                        margin: '0 auto',
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
                        {/* Dynamic Mountain Sunrise Backdrop with Parallax Scroll Zoom */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: '-15%',
                                backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=95")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 38%',
                                scale: ctaBgScale,
                                y: ctaBgY,
                                zIndex: 0
                            }}
                        />

                        {/* Layered Obsidian and Sunrise Gradient Backdrop */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(7, 14, 8, 0.84) 0%, rgba(11, 21, 14, 0.88) 55%, rgba(7, 14, 8, 0.96) 100%), radial-gradient(circle at 80% 50%, rgba(229, 169, 59, 0.4) 0%, transparent 65%)',
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
                </motion.section>
            </main>

            {/* ── UNIFIED REUSABLE FOOTER ── */}
            <Footer />
        </div>
    );
}
