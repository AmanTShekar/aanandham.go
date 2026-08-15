"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SiteHeader from '../../components/SiteHeader';
import CustomThemeCalendar from '../../components/CustomThemeCalendar';

const CONTACT_CHANNELS = [
    {
        id: 'phone',
        badge: '24/7 HOTLINE',
        title: 'Voice Concierge',
        val: '+91 9400 987 654',
        sub: 'Live basecamp coordinators',
        icon: 'fa-solid fa-phone',
        href: 'tel:+919400987654',
        accent: '#E5A93B'
    },
    {
        id: 'whatsapp',
        badge: 'PRIORITY DESK',
        title: 'WhatsApp Dispatch',
        val: '+91 9400 987 654',
        sub: 'Instant booking & guidance',
        icon: 'fa-brands fa-whatsapp',
        href: 'https://wa.me/919400987654?text=Hi%20Aanandham%20Concierge!%20I%20have%20an%20inquiry%20regarding%20campsites%20and%20treks.',
        accent: '#25D366'
    },
    {
        id: 'email',
        badge: 'EXPEDITION DESK',
        title: 'Reservations & Media',
        val: 'bookings@aanandhamgo.in',
        sub: 'Replies in 2 to 4 hours',
        icon: 'fa-regular fa-envelope',
        href: 'mailto:bookings@aanandhamgo.in',
        accent: '#D5ED55'
    },
    {
        id: 'location',
        badge: 'BASE STATION',
        title: 'Suryanelli Base',
        val: 'Suryanelli, Munnar, Kerala',
        sub: '6,500 FT · Western Ghats',
        icon: 'fa-solid fa-mountain-sun',
        href: 'https://maps.google.com/?q=Suryanelli+Munnar+Kerala',
        accent: '#F28B66'
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
            `Notes: ${formData.message || 'None'}`;

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
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {/* ── UNIFIED SITE HEADER ── */}
            <SiteHeader 
                activePage="contact" 
                currentUser={currentUser} 
                onLogout={handleLogout}
            />

            {/* ── COMPACT SINGLE-SCREEN CONTACT HUB ── */}
            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: 'clamp(85px, 11vh, 105px) clamp(16px, 4vw, 48px) clamp(24px, 3vh, 36px)',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
                    
                    <div className="contact-hub-grid">
                        
                        {/* ── LEFT: DIRECT BASECAMP DISPATCH & HOTLINES ── */}
                        <div>
                            <div className="star-badge" style={{ marginBottom: '12px' }}>
                                <span className="star-icon">★</span> DIRECT BASECAMP DISPATCH
                            </div>
                            
                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(30px, 4vw, 46px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.12,
                                margin: '0 0 12px'
                            }}>
                                Let’s Plan Your <br />
                                <span style={{ color: '#E5A93B' }}>Mountain Expedition</span>
                            </h1>

                            <p style={{ fontSize: '14.5px', color: '#59655D', lineHeight: 1.6, margin: '0 0 22px', maxWidth: '500px' }}>
                                Have questions about geodesic dome stays, 4x4 sunrise safaris, or private group offsites? Our Suryanelli ridge team is available 24/7.
                            </p>

                            {/* 4 Compact Dispatch Channels Grid */}
                            <div className="contact-dispatch-grid">
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
                                            borderRadius: '16px',
                                            padding: '14px 14px',
                                            textDecoration: 'none',
                                            color: '#121613',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                background: '#121613',
                                                color: ch.accent,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px'
                                            }}>
                                                <i className={ch.icon}></i>
                                            </div>

                                            <span style={{
                                                fontSize: '9.5px',
                                                fontWeight: '800',
                                                background: 'rgba(229, 169, 59, 0.12)',
                                                color: '#C86D14',
                                                padding: '2px 7px',
                                                borderRadius: '999px',
                                                letterSpacing: '0.4px'
                                            }}>
                                                {ch.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13.5px', fontWeight: '800', color: '#121613', margin: '0 0 1px' }}>
                                                {ch.title}
                                            </div>
                                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#121613', margin: '0 0 1px', wordBreak: 'break-word' }}>
                                                {ch.val}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#7E8B82' }}>
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
                                borderRadius: '14px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1px solid rgba(229, 169, 59, 0.3)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    boxShadow: '0 0 8px #10B981',
                                    flexShrink: 0
                                }} />
                                <div style={{ fontSize: '12px', fontWeight: '700' }}>
                                    <span style={{ color: '#D5ED55' }}>Live Basecamp Status:</span> Marshals active on Suryanelli ridge · 14°C mist
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT: SINGLE-SCREEN EXPEDITION INQUIRY FORM ── */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '24px',
                            padding: 'clamp(20px, 3.5vw, 32px)',
                            border: '1px solid rgba(18, 22, 19, 0.08)',
                            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)'
                        }}>
                            <div className="star-badge" style={{ marginBottom: '6px' }}>
                                <span className="star-icon">★</span> INSTANT RESERVATION
                            </div>
                            
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '22px',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.02em',
                                margin: '0 0 16px'
                            }}>
                                Send Expedition Request
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        textAlign: 'center',
                                        padding: '32px 16px',
                                        background: '#F8F9F5',
                                        borderRadius: '18px',
                                        border: '1px solid rgba(18, 22, 19, 0.08)'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#E5A93B',
                                        color: '#121613',
                                        fontSize: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 12px',
                                        boxShadow: '0 6px 20px rgba(229, 169, 59, 0.35)'
                                    }}>
                                        ✓
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', marginBottom: '6px' }}>
                                        Inquiry Received!
                                    </h3>
                                    <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.5, maxWidth: '340px', margin: '0 auto 16px' }}>
                                        Thank you, <strong style={{ color: '#121613' }}>{formData.name}</strong>. Your request has been routed directly to our mountain marshals.
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                        {waUrl && (
                                            <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-lime"
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '13px',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '15px' }}></i>
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
                                                padding: '10px 16px',
                                                borderRadius: '999px',
                                                fontSize: '12.5px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            New Request
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    {/* Expedition Type Selection */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#121613', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Expedition Type
                                        </label>
                                        <div className="contact-form-types">
                                            {[
                                                { id: 'booking', label: '⛺ Dome Glamp' },
                                                { id: 'kolukkumalai', label: '🌅 4x4 Safari' },
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
                                                            padding: '8px 6px',
                                                            borderRadius: '10px',
                                                            border: isSel ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                            background: isSel ? '#121613' : '#F8F9F5',
                                                            color: isSel ? '#D5ED55' : '#121613',
                                                            fontSize: '11.5px',
                                                            fontWeight: isSel ? '800' : '600',
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        {t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Name & Phone */}
                                    <div className="contact-form-row">
                                        <div>
                                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#121613', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '4px' }}>
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
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '13.5px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#121613', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '4px' }}>
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
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '13.5px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Guests */}
                                    <div className="contact-form-row">
                                        <div>
                                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#121613', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '4px' }}>
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
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '13.5px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '800', color: '#121613', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                Campers
                                            </label>
                                            <select
                                                value={formData.guests}
                                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '9px 12px',
                                                    borderRadius: '10px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '13.5px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                <option value="1">1 Camper (Solo)</option>
                                                <option value="2">2 Campers (Couple)</option>
                                                <option value="3-5">3 to 5 (Squad)</option>
                                                <option value="6-10">6 to 10 (Group)</option>
                                                <option value="10+">10+ (Offsite)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Travel Date */}
                                    <div>
                                        <CustomThemeCalendar 
                                            onDateSelect={(date) => setFormData({ ...formData, travelDates: date })}
                                            theme="light"
                                            label="Expedition Date"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-lime hover-lift"
                                        style={{
                                            padding: '13px',
                                            fontSize: '14px',
                                            fontWeight: '800',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 6px 20px rgba(213, 237, 85, 0.35)',
                                            marginTop: '4px'
                                        }}
                                    >
                                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                                        <span>{loading ? 'Sending...' : 'Send Request via WhatsApp & Email →'}</span>
                                    </button>
                                </form>
                            )}

                        </div>

                    </div>

                </div>
            </main>

            {/* ── SLIM FOOTER BAR ── */}
            <footer style={{
                borderTop: '1px solid rgba(18, 22, 19, 0.08)',
                background: '#FFFFFF',
                padding: '16px clamp(20px, 4vw, 48px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '12.5px',
                color: '#7E8B82'
            }}>
                <div>
                    © {new Date().getFullYear()} Aanandham.go · Suryanelli, Munnar, Kerala. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '16px', fontWeight: '700', color: '#121613' }}>
                    <a href="tel:+919400987654" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9400 987 654</a>
                    <span>·</span>
                    <a href="mailto:bookings@aanandhamgo.in" style={{ color: 'inherit', textDecoration: 'none' }}>bookings@aanandhamgo.in</a>
                </div>
            </footer>
        </div>
    );
}
