"use client";
import React, { useState, useEffect, useRef } from 'react';

const HERO_LINK = { fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' };

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { waLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './common/BrandIcons';

// ── SHARED LIQUID WAVE DRAWER VARIANTS ──
const drawerWaveVariants = {
    hidden: { 
        opacity: 0,
        y: -6,
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
    },
    visible: { 
        opacity: 1,
        y: 0,
        clipPath: 'circle(260% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(260% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.42, 
            ease: [0.22, 1, 0.36, 1] 
        }
    },
    exit: { 
        opacity: 0,
        y: -6,
        clipPath: 'circle(0% at calc(100% - 42px) 36px)',
        WebkitClipPath: 'circle(0% at calc(100% - 42px) 36px)',
        transition: { 
            duration: 0.3, 
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
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
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

    // High-performance RAF scroll listener to toggle transparent/solid states
    useEffect(() => {
        let rafId = null;

        const onScroll = () => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const currentScrollY = Math.max(0, window.scrollY);
                const isPast = currentScrollY > 30;

                if (isPast !== scrolledRef.current) {
                    scrolledRef.current = isPast;
                    setScrolled(isPast);
                }
                rafId = null;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

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
            {/* ── TOP NAVBAR: PERMANENTLY FIXED & TRANSPARENT ON TOP ── */}
            <motion.header
                className="site-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100000,
                    padding: '14px clamp(20px, 4vw, 48px)',
                    backgroundColor: isHeaderSolid ? 'rgba(11, 21, 14, 0.97)' : 'transparent',
                    borderBottom: isHeaderSolid ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                    boxShadow: isHeaderSolid ? '0 8px 24px rgba(0, 0, 0, 0.35)' : 'none',
                    backdropFilter: isHeaderSolid ? 'blur(16px)' : 'none',
                    WebkitBackdropFilter: isHeaderSolid ? 'blur(16px)' : 'none',
                    transition: 'background-color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease'
                }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '1560px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    boxSizing: 'border-box'
                }}>
                    {/* Brand Logo & Name (Far Left End) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <Link href="/" className="text-hover-marker text-hover-marker-dark" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Wilderness Basecamps"
                                width="56"
                                height="56"
                                className="site-brand-logo"
                                style={{
                                    width: 'clamp(46px, 3.8vw, 54px)',
                                    height: 'clamp(46px, 3.8vw, 54px)',
                                    objectFit: 'contain',
                                    background: 'transparent',
                                    transition: 'transform 0.25s ease'
                                }}
                                loading="eager" 
                                decoding="async"
                            />
                            <span className="marker-text site-brand-text" style={{
                                fontSize: 'clamp(18px, 1.4vw, 21px)',
                                fontWeight: '900',
                                letterSpacing: '-0.02em',
                                color: '#FFFFFF',
                                fontFamily: 'var(--font-heading)'
                            }}>
                                Aanandham<span className="brand-accent-go">.go</span>
                            </span>
                        </Link>
                    </div>

                    {/* Right-Side Group: Desktop Navigation Links & Action Button (Far Right End) */}
                    <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 2.4vw, 32px)', marginLeft: 'auto' }}>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 1.8vw, 26px)' }}>
                            <Link 
                                href="/" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'home' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
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
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">About</span>
                            </Link>
                            <Link 
                                href="/services" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'services' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Services</span>
                            </Link>
                            <Link 
                                href="/camps"
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'camps' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
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
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Events</span>
                            </Link>
                            <Link 
                                href="/blog" 
                                className="text-hover-marker text-hover-marker-dark" 
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Blog</span>
                            </Link>
                            <Link 
                                href="/contact" 
                                className={`text-hover-marker text-hover-marker-dark ${activePage === 'contact' ? 'is-active-link' : ''}`}
                                style={{ 
                                    fontFamily: 'var(--font-heading)',
                                    color: '#FFFFFF', 
                                    textDecoration: 'none', 
                                    fontSize: '15px', 
                                    fontWeight: '700', 
                                    letterSpacing: '-0.01em',
                                    padding: '4px 6px'
                                }}
                            >
                                <span className="marker-text">Contact</span>
                            </Link>
                        </nav>

                        {/* Direct Frictionless Booking CTA Button - Pill Style */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link
                                href="/camps"
                                style={{
                                    padding: '11px 28px',
                                    fontSize: '14px',
                                    fontWeight: '900',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderRadius: '999px',
                                    background: 'linear-gradient(135deg, #121613 0%, #1C241E 100%)',
                                    color: '#FFFFFF',
                                    fontFamily: 'var(--font-heading)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(229, 169, 59, 0.4), 0 2px 6px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(229, 169, 59, 0.45)',
                                    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(229, 169, 59, 0.7), 0 4px 10px rgba(0, 0, 0, 0.15)';
                                    const arrow = e.currentTarget.querySelector('[data-nav-arrow]');
                                    if (arrow) arrow.style.transform = 'rotate(-45deg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(229, 169, 59, 0.4), 0 2px 6px rgba(0, 0, 0, 0.1)';
                                    const arrow = e.currentTarget.querySelector('[data-nav-arrow]');
                                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                                    <span style={{ fontWeight: '900', letterSpacing: '-0.01em' }}>Book Campsite</span>
                                    <span
                                        data-nav-arrow
                                        style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: '#FFFFFF',
                                            border: '1px solid rgba(229, 169, 59, 0.35)',
                                            color: '#121613',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            lineHeight: 1,
                                            flexShrink: 0,
                                            transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.2s ease'
                                        }}
                                    >→</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile 3-Bar Morphing Hamburger Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            id="nav-mobile-toggle-btn"
                            className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-navigation-drawer"
                            aria-haspopup="dialog"
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
                        id="mobile-navigation-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation Menu"
                        key="shared-mobile-drawer"
                        variants={drawerWaveVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mobile-nav-drawer"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            width: '100%',
                            maxWidth: '100%',
                            height: '100vh',
                            height: '100dvh',
                            zIndex: 99999,
                            background: 'radial-gradient(circle at calc(100% - 42px) 36px, #172B1E 0%, #0D1911 50%, #070E08 100%)',
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
                                        style={HERO_LINK}
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
                                        style={HERO_LINK}
                                    >
                                        <span className="marker-text">About</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/services" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'services' ? 'is-active-link' : ''}`}
                                        style={HERO_LINK}
                                    >
                                        <span className="marker-text">Services</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/camps"
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'camps' ? 'is-active-link' : ''}`} 
                                        style={HERO_LINK}
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
                                        style={HERO_LINK}
                                    >
                                        <span className="marker-text">Events & Trails</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/blog" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className="mobile-nav-link-item text-hover-marker text-hover-marker-dark" 
                                        style={HERO_LINK}
                                    >
                                        <span className="marker-text">Blog</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={drawerItemVariants}>
                                    <Link 
                                        href="/contact" 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`mobile-nav-link-item text-hover-marker text-hover-marker-dark ${activePage === 'contact' ? 'is-active-link' : ''}`}
                                        style={HERO_LINK}
                                    >
                                        <span className="marker-text">Contact</span>
                                        <span className="drawer-arrow">→</span>
                                    </Link>
                                </motion.div>
                            </nav>

                            {/* Bottom Direct Frictionless Booking CTA */}
                            <motion.div variants={drawerItemVariants} style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link
                                    href="/camps"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn-lime"
                                    style={{
                                        padding: '14px 34px',
                                        fontSize: '15px',
                                        textDecoration: 'none',
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 10px 30px rgba(213, 237, 85, 0.3)'
                                    }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Book A Campsite Now →</span>
                                </Link>

                                <a
                                    href={waLink('Hi Aanandham Team!')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#E5A93B', background: 'rgba(229, 169, 59, 0.1)', border: '1px solid rgba(229, 169, 59, 0.25)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', padding: '12px', borderRadius: '999px' }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><WhatsAppIcon size={17} /> WhatsApp Concierge (24/7) →</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
