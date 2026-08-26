"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { waLink } from '../lib/whatsapp';
import { Mail, Phone } from 'lucide-react';
import { WhatsAppIcon, InstagramIcon, YouTubeIcon, FacebookIcon, LinkedInIcon } from './common/BrandIcons';

export default function Footer() {
    const [emailCopied, setEmailCopied] = useState(false);
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '919074858014';
    const formattedPhone = adminPhone.length === 12 && adminPhone.startsWith('91')
        ? `+91 ${adminPhone.slice(2, 7)} ${adminPhone.slice(7)}`
        : `+${adminPhone}`;

    return (
        <footer className="site-main-footer" style={{
            background: 'linear-gradient(180deg, #101E13 0%, #08120A 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            width: '100%'
        }}>
            {/* Ambient Basecamp Radial Glow */}
            <div style={{
                position: 'absolute',
                top: '-150px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(213, 237, 85, 0.08) 0%, rgba(14, 24, 17, 0) 70%)',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            <div style={{
                maxWidth: '1560px',
                margin: '0 auto',
                padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px) clamp(32px, 4vw, 48px)',
                position: 'relative',
                zIndex: 2,
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 22vw, 300px), 1fr))',
                    gap: 'clamp(32px, 4vw, 56px)',
                    marginBottom: 'clamp(40px, 5vw, 64px)'
                }}>
                    {/* Brand Column */}
                    <div>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Wilderness Basecamps"
                                width="40"
                                height="40"
                               
                                style={{ objectFit: 'contain' }}
                             loading="lazy" decoding="async"/>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '20px',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                margin: 0,
                                letterSpacing: '-0.8px'
                            }}>
                                Aanandham<span className="brand-accent-go">.go</span>
                            </h3>
                        </Link>
                        <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.65, marginBottom: '24px' }}>
                            High-altitude ridge camps, sunrise jeep safaris, and verified glamping sanctuaries across Kerala's Western Ghats.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <a 
                                href="mailto:bookings@aanandham.in" 
                                onClick={(e) => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText('bookings@aanandham.in');
                                        setEmailCopied(true);
                                        setTimeout(() => setEmailCopied(false), 3000);
                                    }
                                    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=bookings@aanandham.in&su=Aanandham%20Wilderness%20Stay%20Inquiry', '_blank');
                                }}
                                className="footer-contact-link"
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={13} />
                                </div>
                                <span>{emailCopied ? 'Email Copied! ✓' : 'bookings@aanandham.in'}</span>
                            </a>
                            <a href={`tel:+${adminPhone}`} className="footer-contact-link">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={13} />
                                </div>
                                <span>{formattedPhone}</span>
                            </a>
                            <a
                                href={waLink('Hi Aanandham Team! I would like to know more about camping dates.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-contact-link"
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <WhatsAppIcon size={15} />
                                </div>
                                <span>WhatsApp Concierge 24/7</span>
                            </a>
                        </div>

                        {/* Social Media Follow Channels */}
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: '#8E9B92', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                                CONNECT WITH US
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {[
                                    { name: 'Instagram', Icon: InstagramIcon, href: 'https://instagram.com/aanandham.go', color: '#E4405F' },
                                    { name: 'WhatsApp', Icon: WhatsAppIcon, href: waLink('Hi Aanandham.go!'), color: '#25D366' },
                                    { name: 'YouTube', Icon: YouTubeIcon, href: 'https://youtube.com/@aanandhamgo', color: '#FF0000' },
                                    { name: 'Facebook', Icon: FacebookIcon, href: 'https://facebook.com/aanandham.go', color: '#1877F2' },
                                    { name: 'LinkedIn', Icon: LinkedInIcon, href: 'https://linkedin.com/company/aanandhamgo', color: '#0A66C2' }
                                ].map((soc, idx) => (
                                    <a
                                        key={idx}
                                        href={soc.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Follow Aanandham.go on ${soc.name}`}
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '15px',
                                            textDecoration: 'none',
                                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = soc.color;
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                                            e.currentTarget.style.boxShadow = `0 6px 20px ${soc.color}66`;
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <soc.Icon size={15} color="#FFFFFF" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: THE CAMP & REGIONAL DESTINATIONS */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            DESTINATIONS & CAMPS
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'Munnar & Suryanelli Camps', href: '/camps/munnar' },
                                { name: 'Vagamon Pine Glamping', href: '/camps/vagamon' },
                                { name: 'Wayanad Forest Pods', href: '/camps/wayanad' },
                                { name: 'All 11+ Kerala Campsites', href: '/camps' },
                                { name: 'About Our Ethos & Team', href: '/about' },
                                { name: 'Tech & Brand Services', href: '/services' },
                                { name: 'Visit Expedition Concierge Desk', href: '/contact' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '14.5px', fontWeight: '600', textDecoration: 'none' }}>
                                    <span>{item.name}</span>
                                    <span className="arrow-icon">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: AANANDHAM.GO SUB-PAGES */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            AANANDHAM.GO
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'About Our Mission', href: '/about' },
                                { name: 'Campsite Host & Admin', href: '/admin' },
                                { name: 'Expedition Concierge Desk', href: '/contact' },
                                { name: 'Privacy, Safety & Permits', href: '/about' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '14.5px', fontWeight: '600', textDecoration: 'none' }}>
                                    <span>{item.name}</span>
                                    <span className="arrow-icon">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Smooth Watermark Light-Up with Single Interactive Letters */}
                <div className="watermark-brand" aria-label="aanandham.go">
                    {"aanandham.go".split('').map((char, i) => (
                        <span 
                            key={i} 
                            className={`watermark-char ${char === '.' ? 'dot-char' : ''}`}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Bottom Sub-Links & Copyright */}
                <div className="footer-bottom-bar">
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/about" style={{ color: '#A2B6A6', textDecoration: 'none' }}>About Us</Link>
                        <Link href="/contact" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Contact & Booking</Link>
                        <a href="https://instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" style={{ color: '#E5A93B', textDecoration: 'none', fontWeight: '700' }}>@aanandham.go →</a>
                    </div>
                    <div>
                        Copyright © 2026 Aanandham.go Wilderness Platform – Crafted for Mountain Explorers.
                    </div>
                </div>

            </div>
        </footer>
    );
}
