"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Phone, Calendar, X, ChevronRight } from 'lucide-react';
import { waLink, DEFAULT_WA_PHONE } from '@/lib/whatsapp';
import { WhatsAppIcon } from './BrandIcons';

const DOCK_SPRING = {
    type: 'spring',
    stiffness: 280,
    damping: 26,
    mass: 0.85
};

export default function GlobalActionHub() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const dockRef = useRef(null);

    // Hide on marshal scanner or dedicated admin pages
    const isScanner = pathname?.startsWith('/marshal') || pathname?.startsWith('/admin');

    // Close on click outside (Desktop Dock)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dockRef.current && !dockRef.current.contains(e.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isScanner) return null;

    const adminPhone = DEFAULT_WA_PHONE || '919074858014';
    const formattedPhone = `+91 ${adminPhone.slice(-10, -5)} ${adminPhone.slice(-5)}`;
    const whatsAppUrl = waLink('Hi Aanandham.go! I would like to book a wilderness camp / inquire about sunrise jeep trekking.');

    return (
        <>
            {/* ═════════════════════════════════════════════════════════════
                1. DESKTOP FLUID EXPANDING / COLLAPSING ACTION DOCK (> 768px)
            ═════════════════════════════════════════════════════════════ */}
            <LayoutGroup id="global-action-dock">
                <motion.aside
                    ref={dockRef}
                    layout
                    transition={DOCK_SPRING}
                    className={`desktop-global-action-dock ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                    aria-label="Quick Booking & Concierge Actions"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        background: '#121613',
                        border: '1.5px solid rgba(229, 169, 59, 0.45)',
                        borderRadius: '999px',
                        padding: '7px 10px 7px 14px',
                        boxShadow: isExpanded 
                            ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 24px rgba(229, 169, 59, 0.3)' 
                            : '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 16px rgba(229, 169, 59, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        cursor: isExpanded ? 'default' : 'pointer',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        willChange: 'transform'
                    }}
                    onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
                >
                    {/* ── Persistent Base: Live Indicator + Desk Live Label ── */}
                    <motion.div 
                        layout="position" 
                        transition={DOCK_SPRING}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, userSelect: 'none' }}
                    >
                        <span style={{ position: 'relative', display: 'flex', width: '9px', height: '9px' }}>
                            <span style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background: '#25D366',
                                opacity: 0.8,
                                animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
                            }} />
                            <span style={{
                                position: 'relative',
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                background: '#25D366',
                                boxShadow: '0 0 10px #25D366'
                            }} />
                        </span>

                        <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap'
                        }}>
                            {isExpanded ? 'Live Desk' : 'Desk Live'}
                        </span>
                    </motion.div>

                    {/* ── Sliding Action Items (Call & WhatsApp) on Expansion ── */}
                    <AnimatePresence mode="popLayout">
                        {isExpanded && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.88, x: -8 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.88, x: -8 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    marginLeft: '12px',
                                    flexShrink: 0
                                }}
                            >
                                {/* Direct Phone Call Button */}
                                <a
                                    href={`tel:+${adminPhone}`}
                                    className="action-dock-btn"
                                    title={`Call Desk: ${formattedPhone}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 12px',
                                        borderRadius: '999px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#FFFFFF',
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Phone size={13} color="#E5A93B" />
                                    <span>Call</span>
                                </a>

                                {/* Direct WhatsApp Concierge Button */}
                                <a
                                    href={whatsAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-dock-btn"
                                    title="Chat on WhatsApp"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 13px',
                                        borderRadius: '999px',
                                        background: 'rgba(37, 211, 102, 0.15)',
                                        border: '1px solid rgba(37, 211, 102, 0.35)',
                                        color: '#25D366',
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <WhatsAppIcon size={14} color="#25D366" />
                                    <span>WhatsApp</span>
                                </a>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Persistent Primary Action Button (Smoothly glides into position) ── */}
                    <motion.div 
                        layout="position" 
                        transition={DOCK_SPRING}
                        style={{ marginLeft: '10px', flexShrink: 0 }}
                    >
                        <Link
                            href="/camps"
                            className="action-dock-book-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '7px 14px',
                                borderRadius: '999px',
                                background: '#E5A93B',
                                color: '#121613',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: '900',
                                letterSpacing: '-0.01em',
                                boxShadow: '0 4px 14px rgba(229, 169, 59, 0.4)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Calendar size={13} strokeWidth={2.5} color="#121613" />
                            <span>Book Now</span>
                            {!isExpanded && <ChevronRight size={12} strokeWidth={3} color="#121613" />}
                        </Link>
                    </motion.div>

                    {/* ── Close Button on Expanded State ── */}
                    <AnimatePresence mode="popLayout">
                        {isExpanded && (
                            <motion.button
                                layout
                                initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.6, rotate: -45 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(false);
                                }}
                                aria-label="Collapse Menu"
                                title="Collapse Menu"
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#A2B6A6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0,
                                    marginLeft: '8px',
                                    flexShrink: 0,
                                    transition: 'background 0.2s ease, color 0.2s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'; e.currentTarget.style.color = '#FFFFFF'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#A2B6A6'; }}
                            >
                                <X size={13} strokeWidth={2.5} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.aside>
            </LayoutGroup>

            {/* ═════════════════════════════════════════════════════════════
                2. MOBILE CLEAN LUXURY THEME ACTION BAR (Screens <= 768px)
            ═════════════════════════════════════════════════════════════ */}
            <nav 
                className="mobile-sticky-action-bar" 
                aria-label="Mobile Instant Booking Navigation"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: 'rgba(18, 22, 19, 0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(229, 169, 59, 0.3)',
                    padding: '8px 12px calc(8px + env(safe-area-inset-bottom, 0px)) 12px',
                    display: 'none', // Controlled via CSS media query
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.55)'
                }}
            >
                {/* 1. Phone Call Button */}
                <a
                    href={`tel:+${adminPhone}`}
                    aria-label="Call Aanandham Desk"
                    style={{
                        flex: '0 0 52px',
                        height: '44px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'background 0.2s ease'
                    }}
                >
                    <Phone size={15} color="#E5A93B" />
                    <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#E5A93B', letterSpacing: '0.3px' }}>Call</span>
                </a>

                {/* 2. WhatsApp Concierge Button */}
                <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Mountain Concierge on WhatsApp"
                    style={{
                        flex: '0 0 68px',
                        height: '44px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        background: 'rgba(37, 211, 102, 0.12)',
                        borderRadius: '10px',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        color: '#25D366',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                    }}
                >
                    <WhatsAppIcon size={16} color="#25D366" />
                    <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#25D366', letterSpacing: '0.3px' }}>WhatsApp</span>
                </a>

                {/* 3. Primary BOOK NOW Action Button */}
                <Link
                    href="/camps"
                    aria-label="Book Now"
                    style={{
                        flex: 1,
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#E5A93B',
                        borderRadius: '10px',
                        color: '#121613',
                        textDecoration: 'none',
                        fontWeight: '900',
                        fontSize: '13.5px',
                        letterSpacing: '-0.01em',
                        boxShadow: '0 4px 16px rgba(229, 169, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    <Calendar size={14} strokeWidth={2.5} color="#121613" />
                    <span>BOOK NOW</span>
                    <ChevronRight size={14} strokeWidth={3} color="#121613" />
                </Link>
            </nav>
        </>
    );
}
