"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CustomThemeCalendar from '../../components/CustomThemeCalendar';

const CONTACT_CHANNELS = [
    {
        id: 'phone',
        badge: '24/7 HOTLINE',
        title: 'Voice Concierge',
        val: '+91 9400 987 654',
        sub: 'Live basecamp coordinators on ridge',
        icon: 'fa-solid fa-phone',
        href: 'tel:+919400987654',
        actionLabel: 'Call Now',
        accent: '#E5A93B'
    },
    {
        id: 'whatsapp',
        badge: 'PRIORITY DESK',
        title: 'WhatsApp Dispatch',
        val: '+91 9400 987 654',
        sub: 'Instant booking & route guidance',
        icon: 'fa-brands fa-whatsapp',
        href: 'https://wa.me/919400987654?text=Hi%20Aanandham%20Concierge!%20I%20have%20an%20inquiry%20regarding%20campsites%20and%20treks.',
        actionLabel: 'Message ↗',
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
        actionLabel: 'Email Us ↗',
        accent: '#D5ED55'
    },
    {
        id: 'location',
        badge: 'BASE STATION',
        title: 'Suryanelli Base',
        val: 'Suryanelli, Munnar, Kerala',
        sub: '6,500 FT Elevation · Western Ghats',
        icon: 'fa-solid fa-mountain-sun',
        href: 'https://maps.google.com/?q=Suryanelli+Munnar+Kerala',
        actionLabel: 'Map ↗',
        accent: '#F28B66'
    }
];

const TRAVEL_STEPS = [
    {
        num: 'STAGE 01',
        title: 'Arrive in Munnar / Kochi',
        desc: 'Fly into Cochin Int\'l Airport (COK) or take the train to Aluva / Ernakulam. Luxury cabs & express mountain buses run directly to Munnar town.',
        time: 'Approx 3.5 hrs from Kochi (COK)',
        tag: 'STAGE · 01',
        stamp: 'PAVED HIGHWAY',
        stampColor: '#166534',
        paperBg: '#FFFFFF',
        inkColor: '#142016',
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
        paperBg: '#FFFFFF',
        inkColor: '#0C2417',
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
        paperBg: '#FFFFFF',
        inkColor: '#2A1708',
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
        paperBg: '#FFFFFF',
        inkColor: '#112513',
        icon: 'fa-solid fa-truck-monster',
        memo: 'The 4x4 climb through mountain mists is an unforgettable highlight in itself!'
    }
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'booking',
        guests: '2',
        travelDates: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [waUrl, setWaUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('aanandham_user') || sessionStorage.getItem('aanandham_user');
            if (saved) setCurrentUser(JSON.parse(saved));
        } catch (e) {}
    }, []);

    const handleLogout = () => {
        try { 
            localStorage.removeItem('aanandham_user'); 
            sessionStorage.removeItem('aanandham_user');
        } catch (e) {}
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
            minHeight: '100dvh',
            backgroundColor: '#F8F9F5',
            color: '#121613',
            fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* ── UNIFIED SITE HEADER ── */}
            <SiteHeader 
                activePage="contact" 
                currentUser={currentUser} 
                onLogout={handleLogout}
            />

            {/* ── STREAMLINED CONTACT & DISPATCH HUB ── */}
            <main style={{ flex: 1, padding: 'clamp(100px, 12vh, 130px) clamp(20px, 4vw, 48px) clamp(40px, 6vh, 60px)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                        gap: 'clamp(32px, 4vw, 56px)',
                        alignItems: 'start'
                    }}>
                        
                        {/* ── LEFT: DIRECT BASECAMP DISPATCH & HOTLINES ── */}
                        <div>
                            <div className="star-badge" style={{ marginBottom: '14px' }}>
                                <span className="star-icon">★</span> DIRECT DISPATCH & BASECAMP HOTLINE
                            </div>
                            
                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                margin: '0 0 14px'
                            }}>
                                Let’s Plan Your <br />
                                <span style={{ color: '#E5A93B' }}>Mountain Expedition</span>
                            </h1>

                            <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.65, margin: '0 0 28px', maxWidth: '520px' }}>
                                Have questions about geodesic dome glamping, 4x4 Kolukkumalai sunrise safaris, or custom squad offsites? Our mountain marshals on Suryanelli ridge are available 24/7.
                            </p>

                            {/* 4 Compact Dispatch Channels Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                                gap: '14px',
                                marginBottom: '28px'
                            }}>
                                {CONTACT_CHANNELS.map((ch, idx) => (
                                    <a
                                        key={idx}
                                        href={ch.href}
                                        target={ch.href.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="hover-lift"
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                            borderRadius: '20px',
                                            padding: '18px 18px',
                                            textDecoration: 'none',
                                            color: '#121613',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '12px',
                                                background: '#121613',
                                                color: ch.accent,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px'
                                            }}>
                                                <i className={ch.icon}></i>
                                            </div>

                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '800',
                                                background: 'rgba(229, 169, 59, 0.12)',
                                                color: '#C86D14',
                                                padding: '3px 8px',
                                                borderRadius: '999px',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {ch.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '800', color: '#121613', margin: '0 0 2px' }}>
                                                {ch.title}
                                            </div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#121613', margin: '0 0 2px', wordBreak: 'break-word' }}>
                                                {ch.val}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: '#7E8B82' }}>
                                                {ch.sub}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Live Basecamp Status Strip */}
                            <div style={{
                                background: '#121613',
                                color: '#FFFFFF',
                                borderRadius: '18px',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                border: '1px solid rgba(229, 169, 59, 0.3)',
                                boxShadow: '0 10px 28px rgba(0,0,0,0.12)'
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    boxShadow: '0 0 10px #10B981',
                                    flexShrink: 0
                                }} />
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                                    <span style={{ color: '#D5ED55' }}>Live Basecamp Status:</span> Marshals active on Suryanelli ridge · 14°C misty cloud cover
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT: HIGH-CONVERTING EXPEDITION INQUIRY FORM ── */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '28px',
                            padding: 'clamp(28px, 4vw, 38px)',
                            border: '1px solid rgba(18, 22, 19, 0.08)',
                            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.04)'
                        }}>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> INSTANT RESERVATION
                            </div>
                            
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.025em',
                                margin: '0 0 20px'
                            }}>
                                Send Expedition Request
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px 20px',
                                        background: '#F8F9F5',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(18, 22, 19, 0.08)'
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: '#E5A93B',
                                        color: '#121613',
                                        fontSize: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        boxShadow: '0 8px 25px rgba(229, 169, 59, 0.4)'
                                    }}>
                                        ✓
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', marginBottom: '8px' }}>
                                        Inquiry Received!
                                    </h3>
                                    <p style={{ fontSize: '14.5px', color: '#59655D', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 20px' }}>
                                        Thank you, <strong style={{ color: '#121613' }}>{formData.name}</strong>. Your request has been sent directly to our mountain marshals.
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                        {waUrl && (
                                            <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-lime"
                                                style={{
                                                    padding: '12px 24px',
                                                    fontSize: '13.5px',
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
                                                background: '#121613',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                padding: '12px 20px',
                                                borderRadius: '999px',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            New Request
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* Expedition Type Selection */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            Expedition Type
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {[
                                                { id: 'booking', label: '⛺ Dome Glamp' },
                                                { id: 'kolukkumalai', label: '🌅 4x4 Jeep Safari' },
                                                { id: 'custom', label: '👥 Squad Offsite' },
                                                { id: 'general', label: '💬 General Query' }
                                            ].map((t) => {
                                                const isSel = formData.inquiryType === t.id;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={t.id}
                                                        onClick={() => setFormData({ ...formData, inquiryType: t.id })}
                                                        style={{
                                                            padding: '10px 10px',
                                                            borderRadius: '12px',
                                                            border: isSel ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                            background: isSel ? '#121613' : '#F8F9F5',
                                                            color: isSel ? '#D5ED55' : '#121613',
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
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '5px' }}>
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
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '5px' }}>
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="e.g. rahul@gmail.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Group Size */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '5px' }}>
                                                Phone / WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="e.g. +91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '5px' }}>
                                                Number of Campers
                                            </label>
                                            <select
                                                value={formData.guests}
                                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                <option value="1">1 Camper (Solo)</option>
                                                <option value="2">2 Campers (Couple / Friends)</option>
                                                <option value="3-5">3 to 5 Campers (Small Squad)</option>
                                                <option value="6-10">6 to 10 Campers (Group)</option>
                                                <option value="10+">10+ Campers (Corporate / Large)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Travel Date */}
                                    <div>
                                        <CustomThemeCalendar 
                                            onDateSelect={(date) => setFormData({ ...formData, travelDates: date })}
                                            theme="light"
                                            label="Preferred Expedition Date"
                                        />
                                    </div>

                                    {/* Special Notes / Requests */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '5px' }}>
                                            Special Requests / Notes (Optional)
                                        </label>
                                        <textarea
                                            rows="2"
                                            placeholder="e.g. Campfire BBQ, sunrise jeep safari, beginner trek preferences..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '11px 14px',
                                                borderRadius: '12px',
                                                border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                background: '#F8F9F5',
                                                fontSize: '13.5px',
                                                color: '#121613',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                                resize: 'none'
                                            }}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-lime hover-lift"
                                        style={{
                                            padding: '14px',
                                            fontSize: '14.5px',
                                            fontWeight: '800',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 8px 24px rgba(213, 237, 85, 0.4)',
                                            marginTop: '4px'
                                        }}
                                    >
                                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '17px' }}></i>
                                        <span>{loading ? 'Submitting...' : 'Send Request via WhatsApp & Email →'}</span>
                                    </button>
                                </form>
                            )}

                        </div>

                    </div>

                </div>
            </main>

            {/* ── 4-STEP ROUTE INTELLIGENCE HORIZONTAL SWIPABLE CAROUSEL ── */}
            <section style={{
                padding: '70px 0 90px',
                background: '#121613',
                color: '#FFFFFF',
                position: 'relative',
                overflowX: 'clip'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)', marginBottom: '16px' }}>
                    <div className="star-badge" style={{ background: 'rgba(229, 169, 59, 0.2)', border: '1px solid rgba(229, 169, 59, 0.4)' }}>
                        <span className="star-icon">★</span> ROUTE INTELLIGENCE
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                                margin: '0 0 8px'
                            }}>
                                How to Reach <span style={{ color: '#E5A93B' }}>Suryanelli Basecamp</span>
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', margin: 0, maxWidth: '600px' }}>
                                Step-by-step navigation from airport/train arrivals up to the private 4x4 ridge safari.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D5ED55', fontWeight: '700' }}>
                            <span>Swipe Stages</span> <span>→</span>
                        </div>
                    </div>
                </div>

                {/* Full-Bleed Edge-to-Edge Carousel Track */}
                <div className="route-carousel-track">
                    {TRAVEL_STEPS.map((st, idx) => (
                        <div
                            key={idx}
                            className="route-carousel-card hover-lift"
                            style={{
                                position: 'relative',
                                background: st.paperBg,
                                color: st.inkColor,
                                borderRadius: '24px',
                                padding: '28px 24px 24px',
                                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '320px',
                                border: '1px solid rgba(255, 255, 255, 0.12)'
                            }}
                        >
                            <div>
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '12px',
                                        background: '#121613',
                                        color: '#E5A93B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}>
                                        <i className={st.icon}></i>
                                    </div>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        background: 'rgba(18, 22, 19, 0.08)',
                                        color: st.stampColor,
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {st.tag}
                                    </span>
                                </div>

                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '19px',
                                    fontWeight: '800',
                                    color: '#121613',
                                    margin: '0 0 10px'
                                }}>
                                    {st.title}
                                </h3>

                                <p style={{
                                    fontSize: '13.5px',
                                    color: '#59655D',
                                    lineHeight: 1.6,
                                    margin: '0 0 16px'
                                }}>
                                    {st.desc}
                                </p>
                            </div>

                            <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800', color: '#121613' }}>
                                    <span style={{ color: '#E5A93B' }}>⏱</span>
                                    <span>{st.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SITE FOOTER ── */}
            <Footer />
        </div>
    );
}
