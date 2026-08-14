"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '../../components/Footer';
import CustomThemeCalendar from '../../components/CustomThemeCalendar';

export default function ContactPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general', // 'general' | 'booking' | 'custom' | 'host'
        subject: '',
        guests: '2',
        travelDates: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Format message for WhatsApp & Email backup
        const waText = `*New Inquiry via Aanandham.go*\n` +
            `Type: ${formData.inquiryType.toUpperCase()}\n` +
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone || 'N/A'}\n` +
            `Subject: ${formData.subject || 'General Inquiry'}\n` +
            `Guests: ${formData.guests}\n` +
            `Dates: ${formData.travelDates || 'Flexible'}\n` +
            `Message: ${formData.message}`;

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            const encoded = encodeURIComponent(waText);
            window.open(`https://wa.me/919400987654?text=${encoded}`, '_blank');
        }, 600);
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

            {/* ── ACCESSIBILITY: SKIP TO CONTENT LINK ── */}
            <a href="#contact-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* Contact & Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        "name": "Contact Aanandham.go Wilderness Camps",
                        "description": "24/7 Camping and trekking inquiries for Suryanelli, Munnar, Vagamon, and Wayanad.",
                        "url": "https://aanandham.in/contact",
                        "breadcrumb": {
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
                                    "name": "Contact & Booking Inquiries",
                                    "item": "https://aanandham.in/contact"
                                }
                            ]
                        }
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
                    <Link href="/" className="logo-brand-pill">
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
                        <span style={{
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
                    <Link href="/about" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                        About Us
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
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                About Us
                            </Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#E5A93B', textDecoration: 'none' }}>
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

            <main id="contact-content">

            {/* ── HERO BANNER ── */}
            <section style={{
                position: 'relative',
                paddingTop: '160px',
                paddingBottom: '80px',
                background: 'linear-gradient(180deg, #101E13 0%, #08120A 100%)',
                color: '#FFFFFF',
                textAlign: 'center',
                paddingLeft: '24px',
                paddingRight: '24px'
            }}>
                <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                    <div className="star-badge" style={{ color: '#E5A93B', marginBottom: '16px' }}>
                        <span style={{ color: '#E5A93B' }}>★</span> CONTACT & INQUIRIES
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                        fontSize: 'clamp(40px, 6vw, 68px)',
                        fontWeight: '800',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.08,
                        marginBottom: '20px'
                    }}>
                        Let's Start a <span style={{ color: '#E5A93B' }}>Conversation</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(16px, 2vw, 19px)',
                        color: '#A2B6A6',
                        lineHeight: 1.65,
                        margin: '0 auto',
                        maxWidth: '640px'
                    }}>
                        Have questions about camping bookings, high-altitude peak treks, corporate offsites, or custom itineraries? Our crew is here 24/7.
                    </p>
                </div>
            </section>

            {/* ── MAIN CONTENT GRID: CHANNELS + CONTACT FORM ── */}
            <div style={{ maxWidth: '1240px', margin: '-40px auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    
                    {/* LEFT COLUMN: CONTACT CHANNELS & INFO */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '40px 36px',
                        border: '1px solid rgba(18, 22, 19, 0.08)',
                        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px'
                    }}>
                        <div>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> REACH US DIRECTLY
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                fontSize: '28px',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.03em',
                                marginBottom: '12px'
                            }}>
                                Get in Touch
                            </h2>
                            <p style={{ fontSize: '14.5px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                                We're always excited to hear from travelers, families, and solo adventurers. Reach out via any of these channels.
                            </p>
                        </div>

                        {/* Channel Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            {/* Email */}
                            <a href="mailto:bookings@aanandhamgo.in" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '18px',
                                textDecoration: 'none',
                                padding: '16px 20px',
                                borderRadius: '20px',
                                background: '#F8F9F5',
                                border: '1px solid rgba(18, 22, 19, 0.06)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(18, 22, 19, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(18, 22, 19, 0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#121613',
                                    color: '#E5A93B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    flexShrink: 0
                                }}>
                                    <i className="fa-regular fa-envelope"></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email Us</div>
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#121613' }}>bookings@aanandhamgo.in</div>
                                    <div style={{ fontSize: '12px', color: '#59655D' }}>Replies within 2-4 hours</div>
                                </div>
                            </a>

                            {/* Phone / WhatsApp */}
                            <a href="https://wa.me/919400987654?text=Hi%20Aanandham%20Team!%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '18px',
                                textDecoration: 'none',
                                padding: '16px 20px',
                                borderRadius: '20px',
                                background: '#F8F9F5',
                                border: '1px solid rgba(18, 22, 19, 0.06)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(18, 22, 19, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(18, 22, 19, 0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#25D366',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    flexShrink: 0
                                }}>
                                    <i className="fa-brands fa-whatsapp"></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Call / WhatsApp</div>
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#121613' }}>+91 9400 987 654</div>
                                    <div style={{ fontSize: '12px', color: '#59655D' }}>Available 24/7 for camp assistance</div>
                                </div>
                            </a>

                            {/* Location */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '18px',
                                padding: '16px 20px',
                                borderRadius: '20px',
                                background: '#F8F9F5',
                                border: '1px solid rgba(18, 22, 19, 0.06)'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#121613',
                                    color: '#E5A93B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    flexShrink: 0
                                }}>
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Basecamp Address</div>
                                    <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#121613', lineHeight: 1.5 }}>
                                        Aanandham Wilderness Camps<br />
                                        Suryanelli Estate, Munnar,<br />
                                        Kerala 685618, India
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Social Links */}
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                                Follow Our Trails
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {[
                                    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com/aanandham.go' },
                                    { icon: 'fa-brands fa-facebook', href: 'https://facebook.com/aanandham.go' },
                                    { icon: 'fa-brands fa-x-twitter', href: 'https://twitter.com/aanandham_go' },
                                    { icon: 'fa-brands fa-linkedin', href: 'https://linkedin.com/company/aanandhamgo' }
                                ].map((s, idx) => (
                                    <a
                                        key={idx}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: '#F1F3EC',
                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                            color: '#121613',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textDecoration: 'none',
                                            fontSize: '16px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#121613';
                                            e.currentTarget.style.color = '#E5A93B';
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#F1F3EC';
                                            e.currentTarget.style.color = '#121613';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <i className={s.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: INQUIRY FORM */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '32px',
                        padding: '40px 36px',
                        border: '1px solid rgba(18, 22, 19, 0.08)',
                        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div className="star-badge" style={{ marginBottom: '8px' }}>
                            <span className="star-icon">★</span> SEND AN INQUIRY
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                            fontSize: '28px',
                            fontWeight: '800',
                            color: '#121613',
                            letterSpacing: '-0.03em',
                            marginBottom: '20px'
                        }}>
                            How Can We Help You?
                        </h2>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '48px 24px',
                                    background: '#F8F9F5',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(18, 22, 19, 0.08)'
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: '#E5A93B',
                                    color: '#121613',
                                    fontSize: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: '0 8px 25px rgba(213, 237, 85, 0.5)'
                                }}>
                                    ✓
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>
                                    Inquiry Received!
                                </h3>
                                <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 24px' }}>
                                    Thank you, <strong style={{ color: '#121613' }}>{formData.name}</strong>. Your inquiry has been forwarded to our expedition marshals. We've opened WhatsApp to confirm your dates immediately.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    style={{
                                        background: '#121613',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '999px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                
                                {/* Inquiry Type Pills */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Inquiry Type
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                        {[
                                            { id: 'general', label: 'General Questions' },
                                            { id: 'booking', label: 'Camp Stay & Treks' },
                                            { id: 'custom', label: 'Corporate / Squad Offsite' },
                                            { id: 'host', label: 'Partnership / Host' }
                                        ].map((t) => {
                                            const isSel = formData.inquiryType === t.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={t.id}
                                                    onClick={() => setFormData({ ...formData, inquiryType: t.id })}
                                                    style={{
                                                        padding: '10px 12px',
                                                        borderRadius: '12px',
                                                        border: isSel ? '1.5px solid #121613' : '1px solid rgba(18,22,19,0.1)',
                                                        background: isSel ? '#E5A93B' : '#F8F9F5',
                                                        color: '#121613',
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
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
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
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
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

                                {/* Phone & Guests */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
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
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Number of Guests
                                        </label>
                                        <select
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '14px',
                                                border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                background: '#F8F9F5',
                                                fontSize: '14px',
                                                color: '#121613',
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
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        Your Message / Special Requests *
                                    </label>
                                    <textarea
                                        rows="4"
                                        required
                                        placeholder="Tell us what kind of experience you are looking for (e.g. campfire barbecue, sunrise jeep safari, beginner trek)..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '14px',
                                            border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                            background: '#F8F9F5',
                                            fontSize: '14px',
                                            color: '#121613',
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
                                        padding: '15px',
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
                                    {loading ? 'Sending Inquiry...' : 'Submit Inquiry & Connect on WhatsApp →'}
                                </button>
                                
                                <p style={{ fontSize: '12px', color: '#8E9B92', textAlign: 'center', margin: 0 }}>
                                    By submitting, your details are shared directly with our verified camp coordinators at Suryanelli.
                                </p>
                            </form>
                        )}
                    </div>

                </div>

                {/* ── INTERACTIVE SURYANELLI PEAK MAP EMBED ── */}
                <div style={{
                    marginTop: '60px',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    border: '1px solid rgba(18, 22, 19, 0.08)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.04)',
                    background: '#FFFFFF',
                    padding: '16px'
                }}>
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '1px' }}>CAMP COORDINATES</span>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', margin: '4px 0 0' }}>Suryanelli Peak Ridge, Munnar</h3>
                        </div>
                        <a
                            href="https://maps.google.com/?q=Suryanelli+Munnar+Kerala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-arrow-btn"
                        >
                            <span>Open in Google Maps</span>
                            <div className="btn-arrow-circle">↗</div>
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
