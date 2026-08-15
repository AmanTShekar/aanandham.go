"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { waLink } from '../lib/whatsapp';

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

const drawerItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: "easeOut" }
    },
    exit: {
        opacity: 1,
        transition: { duration: 0.38 }
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
    const accountMenuRef = useRef(null);

    // Click outside handler for Account Menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };

        if (isAccountMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isAccountMenuOpen]);

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
                    padding: '14px clamp(20px, 4vw, 48px)',
                    backgroundColor: 'rgba(11, 21, 14, 0.94)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxSizing: 'border-box'
                }}>
                    {/* Brand Logo & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link href="/" className="text-hover-marker text-hover-marker-dark" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go"
                                className="site-brand-logo"
                            />
                            <span className="marker-text site-brand-text">
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2vw, 28px)' }}>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 1.4vw, 22px)' }}>
                            <Link 
                                href="/" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'home' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Home</span>
                            </Link>
                            <Link 
                                href="/about" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'about' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">About</span>
                            </Link>
                            <Link 
                                href="/camps" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'camps' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">The Camps</span>
                            </Link>
                            <Link 
                                href="/#program" 
                                className="text-hover-marker text-hover-marker-dark" 
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Events</span>
                            </Link>
                            <Link 
                                href="/#stories" 
                                className="text-hover-marker text-hover-marker-dark" 
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Tales</span>
                            </Link>
                            <Link 
                                href="/contact" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'contact' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.02em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Contact</span>
                            </Link>
                        </nav>

                        {/* Direct Frictionless Booking CTA Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link
                                href="/#packages"
                                className="btn-lime"
                                style={{
                                    padding: '8px 20px',
                                    fontSize: '13.5px',
                                    fontWeight: '800',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 14px rgba(213, 237, 85, 0.25)'
                                }}
                            >
                                <span>Book Campsite</span>
                                <span>↗</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile 3-Bar Morphing Hamburger Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="burger-line line-top" />
                            <span className="burger-line line-mid" />
                            <span className="burger-line line-bot" />
                        </button>
                    </div>
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
                            width: '100vw',
                            maxWidth: '100vw',
                            height: '100vh',
                            height: '100dvh',
                            zIndex: 99999,
                            background: 'radial-gradient(circle at calc(100% - 42px) 36px, #172B1E 0%, #0D1911 50%, #070E08 100%)',
                            border: '1px solid rgba(213, 237, 85, 0.12)',
                            color: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 'calc(80px + 16px) 24px 36px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            boxSizing: 'border-box',
                            transform: 'translateZ(0)',
                            WebkitTransform: 'translateZ(0)',
                            willChange: 'clip-path'
                        }}
                    >
                        {/* Concentric Frosted Glass Liquid Ripple Rings (Clipped to prevent horizontal spill) */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', overflow: 'hidden', pointerEvents: 'none' }}>
                            <motion.div
                                key="ripple-wave-1"
                                initial={{ scale: 0.2, opacity: 0.9 }}
                                animate={{ scale: [0.2, 2.0, 3.5], opacity: [0.9, 0.35, 0] }}
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
                        </div>

                        {/* Unified Exit-Synchronized Drawer Body */}
                        <motion.div
                            variants={drawerStaggerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}
                        >
                            <nav style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'home' ? 'is-active-link' : ''}`}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <span className="marker-text">Home</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/about" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'about' ? 'is-active-link' : ''}`}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <span className="marker-text">About</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/camps" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'camps' ? 'is-active-link' : ''}`} 
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <span className="marker-text">The Camps</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/#program" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className="mobile-nav-link-item text-hover-marker text-hover-marker-dark" 
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <span className="marker-text">Events & Trails</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/contact" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'contact' ? 'is-active-link' : ''}`}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <span className="marker-text">Contact</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>
                            </nav>

                            {/* Bottom Direct Frictionless Booking CTA */}
                            <motion.div variants={drawerItemVariants} style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link
                                    href="/#packages"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn-lime"
                                    style={{
                                        padding: '14px',
                                        fontSize: '15px',
                                        textDecoration: 'none',
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>Book A Campsite Now</span>
                                    <span>↗</span>
                                </Link>

                                <a
                                    href={waLink('Hi Aanandham Team!')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#E5A93B', background: 'rgba(229, 169, 59, 0.1)', border: '1px solid rgba(229, 169, 59, 0.25)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', padding: '12px', borderRadius: '999px' }}
                                >
                                    <span>🏕️ WhatsApp Concierge (24/7) ↗</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
