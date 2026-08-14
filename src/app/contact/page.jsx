"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CustomThemeCalendar from '../../components/CustomThemeCalendar';

// ── REUSABLE FRAMER MOTION REVEAL VARIANTS ──
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
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    }
};

// ── CONTACT DISPATCH CHANNELS ──
const CONTACT_CHANNELS = [
    {
        id: 'phone',
        badge: '24/7 EXPEDITION HOTLINE',
        title: 'Direct Voice Concierge',
        val: '+91 9400 987 654',
        sub: 'Live basecamp coordinators on ridge',
        icon: 'fa-solid fa-phone',
        href: 'tel:+919400987654',
        actionLabel: 'Call Concierge ↗',
        accent: '#E5A93B'
    },
    {
        id: 'whatsapp',
        badge: 'PRIORITY DISPATCH',
        title: 'WhatsApp Travel Desk',
        val: '+91 9400 987 654',
        sub: 'Instant booking & route guidance',
        icon: 'fa-brands fa-whatsapp',
        href: 'https://wa.me/919400987654?text=Hi%20Aanandham%20Concierge!%20I%20have%20an%20inquiry%20regarding%20campsites%20and%20treks.',
        actionLabel: 'Message on WhatsApp ↗',
        accent: '#25D366'
    },
    {
        id: 'email',
        badge: 'EXPEDITION DESK',
        title: 'Reservations & Media',
        val: 'bookings@aanandhamgo.in',
        sub: 'Replies within 2 to 4 hours',
        icon: 'fa-regular fa-envelope',
        href: 'mailto:bookings@aanandhamgo.in',
        actionLabel: 'Send Email ↗',
        accent: '#D5ED55'
    },
    {
        id: 'location',
        badge: 'SANCTUARY LOCATION',
        title: 'Suryanelli Base Station',
        val: 'Suryanelli, Munnar, Kerala 685618',
        sub: '6,500 FT Elevation · Western Ghats',
        icon: 'fa-solid fa-mountain-sun',
        href: 'https://maps.google.com/?q=Suryanelli+Munnar+Kerala',
        actionLabel: 'Open Google Maps ↗',
        accent: '#F28B66'
    }
];

// ── 4-STEP TRAVEL GUIDE TO SURYANELLI BASECAMP (Pinned Field Notebook Sheets) ──
const TRAVEL_STEPS = [
    {
        num: 'STAGE 01',
        title: 'Arrive in Munnar / Kochi',
        desc: 'Fly into Cochin Int\'l Airport (COK) or take the train to Aluva / Ernakulam. Luxury cabs & express KSRTC mountain buses run directly to Munnar town.',
        time: 'Approx 3.5 hrs from Kochi (COK)',
        tag: 'STAGE · 01',
        stamp: 'PAVED HIGHWAY',
        stampColor: '#166534',
        paperBg: '#FCFCF8',
        inkColor: '#142016',
        rotation: '-1.4deg',
        icon: 'fa-solid fa-plane-departure',
        memo: 'Early morning drives through Neriamangalam forest offer misty river valley views.'
    },
    {
        num: 'STAGE 02',
        title: 'Drive Lockhart Gap Route',
        desc: 'From Munnar town, ascend the breathtaking Lockhart Gap scenic mountain corridor towards Suryanelli. Completely paved and accessible to all cars.',
        time: '24 km · 45 mins from Munnar',
        tag: 'STAGE · 02',
        stamp: 'SCENIC CORRIDOR',
        stampColor: '#047857',
        paperBg: '#FCFCF8',
        inkColor: '#0C2417',
        rotation: '1.5deg',
        icon: 'fa-solid fa-car-side',
        memo: 'Roll windows down to catch fresh eucalyptus and high-grown tea leaf aromas.'
    },
    {
        num: 'STAGE 03',
        title: 'Safe Parking at Base Camp',
        desc: 'Pull into our Aanandham Suryanelli meeting station. Safe monitored parking for personal cars with restrooms and welcoming hot cardamom tea.',
        time: 'Complimentary Camper Parking',
        tag: 'STAGE · 03',
        stamp: 'MONITORED PARKING',
        stampColor: '#C2410C',
        paperBg: '#FCFCF8',
        inkColor: '#2A1708',
        rotation: '-1.2deg',
        icon: 'fa-solid fa-square-parking',
        memo: 'Our marshals meet you at basecamp to assist with luggage and boarding badges.'
    },
    {
        num: 'STAGE 04',
        title: 'Hop on 4x4 Jeep Safari',
        desc: 'Board our rugged 4x4 Mahindra Jeeps for an off-road ridge climb navigating private rocky tea estate trails to our secluded 7,900 FT ridge sanctuary.',
        time: 'Included with all Camp Packages',
        tag: 'STAGE · 04',
        stamp: '4X4 OFF-ROAD SAFARI',
        stampColor: '#15803D',
        paperBg: '#FCFCF8',
        inkColor: '#112513',
        rotation: '1.6deg',
        icon: 'fa-solid fa-truck-monster',
        memo: 'The 4x4 climb through mountain mists is an unforgettable highlight in itself!'
    }
];

// ── FREQUENTLY ASKED TRAVEL & CONTACT QUESTIONS ──
const CONTACT_FAQS = [
    {
        num: '01',
        q: 'How far in advance should we reserve our dome stay or sunrise safari?',
        a: 'We recommend booking 2 to 3 weeks in advance for weekends and peak season (September through February) as our private geodesic domes and 4x4 safari slots are limited to maintain low crowd density on the ridge.'
    },
    {
        num: '02',
        q: 'Can low-ground-clearance sedans reach the Suryanelli meeting base?',
        a: 'Yes, absolutely! The road from Kochi/Munnar to our Suryanelli meeting station is completely paved and accessible to all hatchbacks, sedans, and SUVs. From our meeting base, our 4x4 Jeeps take care of the off-road ridge climb.'
    },
    {
        num: '03',
        q: 'Do you arrange airport transfers from Kochi or Madurai?',
        a: 'Yes. We have trusted cab partners offering direct airport/station pick-ups and drops from Cochin International Airport (COK), Coimbatore (CJB), and Madurai (IXM) at standardized rates.'
    },
    {
        num: '04',
        q: 'What is the check-in and check-out schedule?',
        a: 'Standard check-in is at 3:00 PM (welcoming you with hot cardamom tea and sunset ridge hikes) and check-out is at 11:00 AM the following morning following the sunrise Kolukkumalai expedition and breakfast.'
    }
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'booking', // 'booking' | 'kolukkumalai' | 'custom' | 'host'
        guests: '2',
        travelDates: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [waUrl, setWaUrl] = useState('');
    const [activeFaq, setActiveFaq] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    const ctaRef = useRef(null);
    const { scrollYProgress: ctaScrollProgress } = useScroll({
        target: ctaRef,
        offset: ["start end", "end start"]
    });
    const ctaBgScale = useTransform(ctaScrollProgress, [0, 0.5, 1], [1.0, 1.16, 1.28]);
    const ctaBgY = useTransform(ctaScrollProgress, [0, 1], ["-6%", "6%"]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const waText = `*New Expedition Inquiry via Aanandham.go*\n` +
            `Type: ${formData.inquiryType.toUpperCase()}\n` +
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone || 'N/A'}\n` +
            `Guests: ${formData.guests}\n` +
            `Dates: ${formData.travelDates || 'Flexible'}\n` +
            `Message: ${formData.message}`;

        const encoded = encodeURIComponent(waText);
        const link = `https://wa.me/919400987654?text=${encoded}`;
        setWaUrl(link);

        try {
            window.open(link, '_blank');
        } catch (err) {}

        setLoading(false);
        setSubmitted(true);
    };

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
                activePage="contact" 
                currentUser={currentUser} 
                onLogout={handleLogout}
            />

            <main id="contact-content">
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=95")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                        color: '#FFFFFF'
                    }}
                >
                    {/* Radial Obsidian Overlay */}
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

                        {/* Main Headline */}
                        <motion.h1 
                            className="hero-headline"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(40px, 6.5vw, 76px)',
                                fontWeight: '800',
                                lineHeight: 1.08,
                                letterSpacing: '-0.04em',
                                color: '#FFFFFF',
                                marginBottom: '20px'
                            }}
                        >
                            <span className="text-hover-marker text-hover-marker-dark" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                <span className="marker-text">
                                    Basecamp Concierge<span style={{ color: '#E5A93B' }}> & Inquiries</span>
                                </span>
                            </span>
                            <br />
                            <span style={{ fontSize: '0.62em', fontWeight: '700', color: '#E1E9E2', letterSpacing: '-0.02em' }}>
                                24/7 Reservations & High-Altitude Trek Dispatch
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
                            Have questions about geodesic dome glamping, 4x4 Kolukkumalai sunrise safaris, corporate offsites, or custom itineraries? Our mountain team is here 24/7.
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
                            <a
                                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!%20I%20have%20an%20inquiry%20regarding%20campsites%20and%20treks."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-lime"
                                style={{
                                    padding: '14px 34px',
                                    fontSize: '15px',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 30px rgba(213, 237, 85, 0.35)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                <span>Instant WhatsApp Concierge ↗</span>
                            </a>

                            <a
                                href="#dispatch-channels"
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
                                📍 Basecamp Channels ↓
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
                            { icon: '★', label: '24/7 ON-RIDGE MOUNTAIN CONCIERGE: +91 94009 87654', highlight: true },
                            { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 EXPEDITIONS AVAILABLE DAILY' },
                            { icon: '⛺', label: 'INSULATED GEODESIC DOMES WITH EN-SUITE SHOWERS', highlight: true },
                            { icon: '📍', label: 'SURYANELLI BASECAMP · 6,500 FT ELEVATION' },
                            { icon: '🌿', label: '100% LEAVE NO TRACE ZERO-PLASTIC ECO SANCTUARY', highlight: true },
                            { icon: '★', label: '24/7 ON-RIDGE MOUNTAIN CONCIERGE: +91 94009 87654', highlight: true },
                            { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 EXPEDITIONS AVAILABLE DAILY' }
                        ].map((item, idx) => (
                            <div key={idx} className="marquee-item" style={{ color: item.highlight ? '#E5A93B' : '#FFFFFF' }}>
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    2. DIRECT BASECAMP DISPATCH CHANNELS (Tactile Field Cards)
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    id="dispatch-channels"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '100px 24px 70px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> EXPEDITION CHANNELS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#0B150E',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                Reach Our <span style={{ color: '#E5A93B' }}>Mountain Crew</span> Directly
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', maxWidth: '640px', margin: '0 auto' }}>
                                Whether you need immediate 4x4 trail coordinates or want to curate a bespoke mountain squad trip.
                            </p>
                        </div>

                        {/* 4 Dispatch Cards Grid */}
                        <motion.div 
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '24px'
                            }}
                        >
                            {CONTACT_CHANNELS.map((ch, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -10, 
                                        borderColor: 'rgba(229, 169, 59, 0.4)',
                                        boxShadow: '0 20px 45px rgba(0,0,0,0.08)' 
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
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '16px',
                                            background: '#0B150E',
                                            color: ch.accent,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px'
                                        }}>
                                            <i className={ch.icon}></i>
                                        </div>

                                        <span style={{
                                            fontSize: '10.5px',
                                            fontWeight: '800',
                                            background: 'rgba(229, 169, 59, 0.12)',
                                            color: '#C86D14',
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.6px'
                                        }}>
                                            {ch.badge}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '19px',
                                        fontWeight: '800',
                                        color: '#0B150E',
                                        margin: '0 0 6px'
                                    }}>
                                        {ch.title}
                                    </h3>

                                    <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#0B150E', marginBottom: '6px', wordBreak: 'break-word' }}>
                                        {ch.val}
                                    </div>

                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.5, margin: '0 0 20px', flex: 1 }}>
                                        {ch.sub}
                                    </p>

                                    <a
                                        href={ch.href}
                                        target={ch.href.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="action-arrow-btn"
                                        style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}
                                    >
                                        <span>{ch.actionLabel}</span>
                                        <div className="btn-arrow-circle">↗</div>
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    3. INTERACTIVE EXPEDITION INQUIRY & RESERVATIONS FORM
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '40px 24px 100px',
                        background: '#F8F9F5',
                        position: 'relative'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '40px',
                            alignItems: 'start'
                        }}>
                            {/* Left: Narrative & Trust Indicators */}
                            <motion.div variants={cardReveal}>
                                <div className="star-badge" style={{ marginBottom: '14px' }}>
                                    <span className="star-icon">★</span> EXPEDITION PLANNING
                                </div>
                                <h2 style={{
                                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                    fontSize: 'clamp(30px, 4.2vw, 48px)',
                                    fontWeight: '800',
                                    color: '#0B150E',
                                    letterSpacing: '-0.03em',
                                    margin: '0 0 18px',
                                    lineHeight: 1.15
                                }}>
                                    Tell Us About Your <span style={{ color: '#E5A93B' }}>Dream Mountain Stay</span>
                                </h2>
                                <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.7, marginBottom: '24px' }}>
                                    Whether you are planning a romantic cliffside dome getaway, a sunrise 4x4 Jeep trek with friends, or a corporate wilderness offsite, our marshals customize every detail for you.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                                    {[
                                        '100% verified private geodesic dome glamping',
                                        'Safe on-site parking at Suryanelli meeting station',
                                        'Dedicated 4x4 Jeep transfer included with all stays',
                                        'Live earthen pot BBQ and acoustic campfire circles'
                                    ].map((pt, pIdx) => (
                                        <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#0B150E', fontWeight: '600' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '50%',
                                                background: 'rgba(213, 237, 85, 0.25)',
                                                color: '#121613',
                                                fontSize: '12px',
                                                fontWeight: '900'
                                            }}>
                                                ✓
                                            </span>
                                            <span>{pt}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Founder direct hotline card */}
                                <div style={{
                                    background: '#0B150E',
                                    color: '#FFFFFF',
                                    borderRadius: '24px',
                                    padding: '24px 28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '18px',
                                    border: '1px solid rgba(229, 169, 59, 0.3)',
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(229, 169, 59, 0.2)', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                        <i className="fa-solid fa-headset"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Need Immediate Help?</div>
                                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>Call our 24/7 Desk: +91 9400 987 654</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: Modern Form Card */}
                            <motion.div 
                                variants={cardReveal}
                                style={{
                                    background: '#FFFFFF',
                                    borderRadius: '32px',
                                    padding: '40px 36px',
                                    border: '1px solid rgba(11, 21, 14, 0.08)',
                                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <div className="star-badge" style={{ marginBottom: '8px' }}>
                                    <span className="star-icon">★</span> DIRECT INQUIRY
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                    fontSize: '26px',
                                    fontWeight: '800',
                                    color: '#0B150E',
                                    letterSpacing: '-0.03em',
                                    marginBottom: '20px'
                                }}>
                                    Send Expedition Request
                                </h3>

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            textAlign: 'center',
                                            padding: '48px 24px',
                                            background: '#F8F9F5',
                                            borderRadius: '24px',
                                            border: '1px solid rgba(11, 21, 14, 0.08)'
                                        }}
                                    >
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: '#E5A93B',
                                            color: '#0B150E',
                                            fontSize: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 20px',
                                            boxShadow: '0 8px 25px rgba(229, 169, 59, 0.4)'
                                        }}>
                                            ✓
                                        </div>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#0B150E', marginBottom: '10px' }}>
                                            Inquiry Received!
                                        </h4>
                                        <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 24px' }}>
                                            Thank you, <strong style={{ color: '#0B150E' }}>{formData.name}</strong>. Your request has been shared with our mountain marshals.
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                            {waUrl && (
                                                <a
                                                    href={waUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-lime"
                                                    style={{
                                                        padding: '12px 26px',
                                                        fontSize: '14px',
                                                        textDecoration: 'none',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                                                    <span>Open WhatsApp Chat ↗</span>
                                                </a>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setSubmitted(false)}
                                                style={{
                                                    background: '#0B150E',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    padding: '12px 24px',
                                                    borderRadius: '999px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Send Another Message
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        
                                        {/* Inquiry Type Pills */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                Expedition Type
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                                {[
                                                    { id: 'booking', label: '⛺ Dome Glamp Stay' },
                                                    { id: 'kolukkumalai', label: '🌅 Sunrise 4x4 Jeep Trek' },
                                                    { id: 'custom', label: '👥 Squad / Offsite Group' },
                                                    { id: 'general', label: '💬 General Inquiry' }
                                                ].map((t) => {
                                                    const isSel = formData.inquiryType === t.id;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={t.id}
                                                            onClick={() => setFormData({ ...formData, inquiryType: t.id })}
                                                            style={{
                                                                padding: '11px 12px',
                                                                borderRadius: '12px',
                                                                border: isSel ? '1.5px solid #0B150E' : '1px solid rgba(11,21,14,0.1)',
                                                                background: isSel ? '#E5A93B' : '#F8F9F5',
                                                                color: '#0B150E',
                                                                fontSize: '12.5px',
                                                                fontWeight: isSel ? '800' : '600',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {t.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Name & Email */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Rahul Nair"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '14px',
                                                        border: '1.5px solid rgba(11, 21, 14, 0.1)',
                                                        background: '#F8F9F5',
                                                        fontSize: '14px',
                                                        color: '#0B150E',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="rahul@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '14px',
                                                        border: '1.5px solid rgba(11, 21, 14, 0.1)',
                                                        background: '#F8F9F5',
                                                        fontSize: '14px',
                                                        color: '#0B150E',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone & Guests */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    Phone / WhatsApp *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="+91 9400..."
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '14px',
                                                        border: '1.5px solid rgba(11, 21, 14, 0.1)',
                                                        background: '#F8F9F5',
                                                        fontSize: '14px',
                                                        color: '#0B150E',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    Number of Guests
                                                </label>
                                                <select
                                                    value={formData.guests}
                                                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '14px',
                                                        border: '1.5px solid rgba(11, 21, 14, 0.1)',
                                                        background: '#F8F9F5',
                                                        fontSize: '14px',
                                                        color: '#0B150E',
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="1">1 Adventurer (Solo)</option>
                                                    <option value="2">2 Guests (Couple / Friends)</option>
                                                    <option value="3-5">3 - 5 Guests (Small Group)</option>
                                                    <option value="6-12">6 - 12 Guests (Squad)</option>
                                                    <option value="15+">15+ Guests (Corporate / College)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Travel Dates */}
                                        <div>
                                            <CustomThemeCalendar
                                                selectedDate={formData.travelDates}
                                                onDateSelect={(date) => setFormData({ ...formData, travelDates: date })}
                                                theme="light"
                                                label="Preferred Expedition Date"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#0B150E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                Special Requests / Notes *
                                            </label>
                                            <textarea
                                                rows="3"
                                                required
                                                placeholder="Tell us what kind of experience you are looking for (e.g. campfire barbecue, sunrise jeep safari, beginner trek)..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    borderRadius: '14px',
                                                    border: '1.5px solid rgba(11, 21, 14, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#0B150E',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    fontFamily: 'inherit',
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-lime"
                                            style={{
                                                padding: '16px',
                                                fontSize: '15px',
                                                fontWeight: '800',
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                boxShadow: '0 8px 30px rgba(213, 237, 85, 0.45)'
                                            }}
                                        >
                                            <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                            {loading ? 'Sending Request...' : 'Send Expedition Request & Connect on WhatsApp →'}
                                        </button>
                                        
                                        <p style={{ fontSize: '12px', color: '#8E9B92', textAlign: 'center', margin: 0 }}>
                                            By submitting, your details are shared directly with our verified camp coordinators on Suryanelli ridge.
                                        </p>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    4. 4-STEP TRAVEL GUIDE TO SURYANELLI BASECAMP
                ───────────────────────────────────────────────────────────── */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionReveal}
                    style={{
                        padding: '100px 24px',
                        background: '#0B150E',
                        position: 'relative',
                        color: '#FFFFFF'
                    }}
                >
                    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="star-badge" style={{ margin: '0 auto 16px' }}>
                                <span className="star-icon">★</span> ROUTE INTELLIGENCE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                How to Reach <span style={{ color: '#E5A93B' }}>Suryanelli Basecamp</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#A2B6A6', maxWidth: '640px', margin: '0 auto' }}>
                                Clear step-by-step navigation from major Kerala & Tamil Nadu transit hubs.
                            </p>
                        </div>

                        {/* 4 Pinned Notebook Pages Grid (4 in a Single Horizontal Row on Desktop) */}
                        <motion.div 
                            variants={staggerContainer}
                            className="route-notebook-grid"
                            style={{
                                paddingTop: '24px'
                            }}
                        >
                            {TRAVEL_STEPS.map((st, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    whileHover={{ 
                                        y: -14, 
                                        rotate: 0,
                                        scale: 1.03,
                                        boxShadow: '0 32px 70px -10px rgba(0, 0, 0, 0.7), 0 12px 24px -4px rgba(0, 0, 0, 0.35)'
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                    style={{
                                        position: 'relative',
                                        background: st.paperBg,
                                        color: st.inkColor,
                                        borderRadius: '6px 6px 36px 6px',
                                        padding: '36px 22px 28px 24px',
                                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0,0,0,0.2)',
                                        transform: `rotate(${st.rotation})`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '440px',
                                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 25px, rgba(59, 130, 246, 0.13) 26px)',
                                        borderLeft: '3.5px solid rgba(239, 68, 68, 0.42)',
                                        cursor: 'grab'
                                    }}
                                >
                                    {/* Realistic 3D Metallic Pushpin Pinned at Top Center (No Washi Tape) */}
                                    <motion.div
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                                        style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 6,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {/* Pin Cast Shadow */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            right: '-4px',
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            filter: 'blur(2px)'
                                        }} />
                                        {/* 3D Brass Metallic Pin Head */}
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            background: 'radial-gradient(circle at 32% 32%, #FEF08A 0%, #E5A93B 55%, #78350F 100%)',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.6)',
                                            border: '1.5px solid #92400E',
                                            position: 'relative'
                                        }}>
                                            {/* Specular Highlight Point */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '3px',
                                                left: '4px',
                                                width: '5px',
                                                height: '5px',
                                                borderRadius: '50%',
                                                background: '#FFFFFF',
                                                opacity: 0.9
                                            }} />
                                        </div>
                                    </motion.div>

                                    {/* 3 Punched Spiral Binder Holes along Top Edge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        left: '24px',
                                        right: '24px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        opacity: 0.25,
                                        pointerEvents: 'none'
                                    }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0B150E' }} />
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0B150E' }} />
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0B150E' }} />
                                    </div>

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

                                    {/* Header Row: Stage Badge + Mini Logo + Vintage Ink Stamp */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <img
                                                src="/logo.png"
                                                alt="Aanandham Logo"
                                                style={{
                                                    height: '22px',
                                                    width: '22px',
                                                    objectFit: 'contain',
                                                    borderRadius: '50%',
                                                    border: '1px solid rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <span style={{
                                                fontSize: '10.5px',
                                                fontWeight: '900',
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                background: 'rgba(0,0,0,0.07)',
                                                padding: '3px 8px',
                                                borderRadius: '5px'
                                            }}>
                                                {st.tag}
                                            </span>
                                        </div>

                                        {/* Vintage Double-Bordered Ink Stamp with Pop on Hover */}
                                        <motion.div
                                            whileHover={{ rotate: 0, scale: 1.08 }}
                                            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                                            style={{
                                                border: `1.5px solid ${st.stampColor}`,
                                                outline: `1px dashed ${st.stampColor}`,
                                                outlineOffset: '2px',
                                                color: st.stampColor,
                                                padding: '3px 7px',
                                                borderRadius: '4px',
                                                fontSize: '8.5px',
                                                fontWeight: '900',
                                                letterSpacing: '0.8px',
                                                textTransform: 'uppercase',
                                                transform: 'rotate(-3deg)',
                                                opacity: 0.95,
                                                userSelect: 'none',
                                                background: 'rgba(255,255,255,0.6)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {st.stamp}
                                        </motion.div>
                                    </div>

                                    {/* Icon & Bold Headline */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            background: 'rgba(0, 0, 0, 0.07)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '17px',
                                            color: st.inkColor,
                                            flexShrink: 0
                                        }}>
                                            <i className={st.icon}></i>
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                            fontSize: '18.5px',
                                            fontWeight: '800',
                                            lineHeight: 1.2,
                                            margin: 0,
                                            color: st.inkColor,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {st.title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: '13px',
                                        lineHeight: 1.7,
                                        margin: '0 0 14px',
                                        opacity: 0.94,
                                        fontWeight: '500'
                                    }}>
                                        {st.desc}
                                    </p>

                                    {/* Transit Time Pill */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '11.5px',
                                        fontWeight: '800',
                                        background: 'rgba(0,0,0,0.06)',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        marginBottom: '14px',
                                        width: 'fit-content',
                                        color: st.stampColor
                                    }}>
                                        <span>✦</span>
                                        <span>{st.time}</span>
                                    </div>

                                    {/* Handwritten Field Memo */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '12px',
                                        borderTop: '1px dashed rgba(0, 0, 0, 0.16)',
                                        fontStyle: 'italic',
                                        fontSize: '12px',
                                        lineHeight: '1.5',
                                        opacity: '0.9',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '6px'
                                    }}>
                                        <span style={{ fontSize: '13px' }}>✍</span>
                                        <span>{st.memo}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Interactive Google Map Embed */}
                        <div style={{
                            marginTop: '56px',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                            background: '#0E1B11',
                            padding: '16px'
                        }}>
                            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '1px' }}>CAMP COORDINATES</span>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0' }}>Suryanelli Peak Ridge, Munnar</h3>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=Suryanelli+Munnar+Kerala"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-lime"
                                    style={{ padding: '10px 22px', fontSize: '13.5px', textDecoration: 'none' }}
                                >
                                    Open in Google Maps ↗
                                </a>
                            </div>
                            <div style={{ height: '380px', borderRadius: '22px', overflow: 'hidden' }}>
                                <iframe
                                    src="https://maps.google.com/maps?q=Suryanelli,Munnar,Idukki,Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Aanandham.go Suryanelli Basecamp Location"
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ─────────────────────────────────────────────────────────────
                    5. CONTACT & TRAVEL FAQS
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
                                <span className="star-icon">★</span> TRAVEL INTELLIGENCE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#0B150E',
                                letterSpacing: '-0.03em',
                                margin: '0 0 14px'
                            }}>
                                Check-In & Travel Questions
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', maxWidth: '620px', margin: '0 auto' }}>
                                Essential information regarding transfers, check-in timelines, and reservations.
                            </p>
                        </div>

                        {/* Collapsible Accordion */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {CONTACT_FAQS.map((faq, fIdx) => {
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
                    6. ORGANIC CURVED NATURE CTA BANNER (With Dynamic Scroll-Zoom)
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
                                Ready to Head Up to the <span style={{ color: '#E5A93B' }}>Suryanelli Ridge</span>?
                            </h2>
                            <p style={{
                                fontSize: '16.5px',
                                color: '#DCE7DE',
                                maxWidth: '660px',
                                margin: '0 0 40px',
                                lineHeight: 1.65,
                                textShadow: '0 4px 16px rgba(0,0,0,0.6)'
                            }}>
                                Book your verified geodesic dome, romantic cliffside tent, or 4x4 sunrise safari in Suryanelli & Kolukkumalai.
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
                                <a
                                    href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!%20I%20want%20to%20reserve%20a%20stay."
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                    <span>💬 WhatsApp Concierge</span>
                                </a>
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
