"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── SHARED LIQUID WAVE DRAWER VARIANTS ──
const drawerWaveVariants = {
    hidden: { 
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
    },
    visible: { 
        clipPath: 'circle(260% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(260% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.48, 
            ease: [0.22, 1, 0.36, 1] 
        }
    },
    exit: { 
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.38, 
            ease: [0.4, 0, 0.2, 1] 
        }
    }
};

const drawerStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.035,
            delayChildren: 0.06
        }
    },
    exit: {
        opacity: 1,
        transition: {
            duration: 0.38
        }
    }
};

export default function SiteHeader({ 
    transparentOnTop = true,
    activePage = 'home',
    currentUser = null,
    onLogout = null
}) {
    const [scrolled, setScrolled] = useState(!transparentOnTop);
    const scrolledRef = useRef(!transparentOnTop);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    // Scroll listener with threshold debounce
    useEffect(() => {
        if (!transparentOnTop) {
            setScrolled(true);
            return;
        }

        const handleScroll = () => {
            const isPast = window.scrollY > 40;
            if (isPast !== scrolledRef.current) {
                scrolledRef.current = isPast;
                setScrolled(isPast);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparentOnTop]);

    // Scroll Lock when mobile drawer is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            window.__lenis?.stop();
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                window.__lenis?.start();
                document.body.style.overflow = originalOverflow || '';
            };
        }
    }, [isMobileMenuOpen]);

    const isHeaderSolid = !transparentOnTop || scrolled || isMobileMenuOpen;

    return (
        <>
            {/* ── TOP NAVBAR ── */}
            <motion.header
                className="site-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100000,
                    padding: isHeaderSolid ? '12px 24px' : '20px 32px',
                    backgroundColor: isHeaderSolid ? 'rgba(11, 21, 14, 0.98)' : 'transparent',
                    backdropFilter: isHeaderSolid ? 'blur(16px)' : 'none',
                    WebkitBackdropFilter: isHeaderSolid ? 'blur(16px)' : 'none',
                    borderBottom: isHeaderSolid ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                    boxShadow: isHeaderSolid ? '0 12px 36px rgba(0, 0, 0, 0.4)' : 'none',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease'
                }}
            >
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }}>
                    {/* Brand Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Link href="/" className="text-hover-marker text-hover-marker-dark">
                            <img
                                src="/logo.png"
                                alt="Aanandham.go"
                                style={{
                                    height: '38px',
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

                    {/* Desktop Navigation Links */}
                    <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <Link 
                            href="/" 
                            style={{ 
                                color: activePage === 'home' ? '#E5A93B' : '#FFFFFF', 
                                textDecoration: 'none', 
                                fontSize: '14.5px', 
                                fontWeight: '700',
                                opacity: activePage === 'home' ? 1 : 0.88,
                                transition: 'color 0.2s ease'
                            }}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/#overview" 
                            style={{ 
                                color: '#FFFFFF', 
                                textDecoration: 'none', 
                                fontSize: '14.5px', 
                                fontWeight: '700',
                                opacity: 0.88,
                                transition: 'color 0.2s ease'
                            }}
                        >
                            Overview
                        </Link>
                        <Link 
                            href="/#packages" 
                            style={{ 
                                color: '#FFFFFF', 
                                textDecoration: 'none', 
                                fontSize: '14.5px', 
                                fontWeight: '700',
                                opacity: 0.88,
                                transition: 'color 0.2s ease'
                            }}
                        >
                            Packages
                        </Link>
                        <Link 
                            href="/about" 
                            style={{ 
                                color: activePage === 'about' ? '#E5A93B' : '#FFFFFF', 
                                textDecoration: 'none', 
                                fontSize: '14.5px', 
                                fontWeight: '700',
                                opacity: activePage === 'about' ? 1 : 0.88,
                                transition: 'color 0.2s ease'
                            }}
                        >
                            About
                        </Link>
                        <Link 
                            href="/contact" 
                            style={{ 
                                color: activePage === 'contact' ? '#E5A93B' : '#FFFFFF', 
                                textDecoration: 'none', 
                                fontSize: '14.5px', 
                                fontWeight: '700',
                                opacity: activePage === 'contact' ? 1 : 0.88,
                                transition: 'color 0.2s ease'
                            }}
                        >
                            Contact
                        </Link>

                        {/* Camper Account or Login */}
                        {currentUser ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(213, 237, 85, 0.15)',
                                        border: '1px solid #E5A93B',
                                        color: '#FFFFFF',
                                        padding: '8px 16px',
                                        borderRadius: '999px',
                                        fontSize: '13.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>👤 {currentUser.name}</span>
                                    <span style={{ fontSize: '10px' }}>▼</span>
                                </button>

                                {isAccountMenuOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        right: 0,
                                        background: '#0B150E',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '16px',
                                        padding: '12px',
                                        minWidth: '180px',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        zIndex: 1000
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                                            {currentUser.email}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (onLogout) onLogout();
                                                setIsAccountMenuOpen(false);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#FF5A5F',
                                                textAlign: 'left',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                padding: '4px 0'
                                            }}
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className="btn-lime" 
                                style={{ 
                                    padding: '9px 24px', 
                                    fontSize: '13.5px', 
                                    fontWeight: '800', 
                                    textDecoration: 'none' 
                                }}
                            >
                                Log In
                            </Link>
                        )}
                    </nav>

                    {/* Mobile 3-Bar Morphing Hamburger Toggle */}
                    <button
                        className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                        <span className="burger-line line-top" />
                        <span className="burger-line line-mid" />
                        <span className="burger-line line-bot" />
                    </button>
                </div>
            </motion.header>

            {/* ── RESPONSIVE MOBILE DRAWER (Liquid Wave Expansion) ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="shared-mobile-drawer"
                        variants={drawerWaveVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mobile-nav-drawer"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 99999,
                            background: 'radial-gradient(circle at calc(100% - 42px) 36px, rgba(28, 48, 33, 0.96) 0%, rgba(13, 24, 16, 0.98) 45%, #070E08 100%)',
                            backdropFilter: 'blur(36px) saturate(190%)',
                            WebkitBackdropFilter: 'blur(36px) saturate(190%)',
                            border: '1px solid rgba(213, 237, 85, 0.12)',
                            color: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            transform: 'translateZ(0)',
                            willChange: 'clip-path'
                        }}
                    >
                        {/* Concentric Frosted Glass Liquid Ripple Rings */}
                        <motion.div
                            key="ripple-wave-1"
                            initial={{ scale: 0.2, opacity: 0.9 }}
                            animate={{ scale: [0.2, 2.0, 4.2], opacity: [0.9, 0.35, 0] }}
                            transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                            style={{
                                position: 'absolute',
                                top: '14px',
                                right: '20px',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                border: '1.5px solid rgba(213, 237, 85, 0.65)',
                                boxShadow: '0 0 28px rgba(213, 237, 85, 0.4)',
                                pointerEvents: 'none'
                            }}
                        />

                        {/* Unified Exit-Synchronized Drawer Body */}
                        <motion.div
                            variants={drawerStaggerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%', padding: '0 28px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '20px', fontWeight: '800', paddingTop: '16px' }}>
                                <Link 
                                    href="/" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: activePage === 'home' ? '#E5A93B' : '#FFFFFF', textDecoration: 'none' }}
                                >
                                    Home
                                </Link>
                                <Link 
                                    href="/#overview" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                >
                                    Camp Overview
                                </Link>
                                <Link 
                                    href="/#packages" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                >
                                    All Packages & Domes
                                </Link>
                                <Link 
                                    href="/about" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: activePage === 'about' ? '#E5A93B' : '#FFFFFF', textDecoration: 'none' }}
                                >
                                    About Aanandham
                                </Link>
                                <Link 
                                    href="/contact" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: activePage === 'contact' ? '#E5A93B' : '#FFFFFF', textDecoration: 'none' }}
                                >
                                    Contact & Inquiries
                                </Link>
                                <Link 
                                    href="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                >
                                    Member Log In / Sign Up
                                </Link>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '28px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
