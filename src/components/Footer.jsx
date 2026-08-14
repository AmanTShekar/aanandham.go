"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #101E13 0%, #08120A 100%)',
            padding: '100px 24px 40px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
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
                filter: 'blur(50px)'
            }} />

            <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: 'clamp(48px, 6vw, 84px)', 
                    marginBottom: '70px',
                    alignItems: 'start'
                }}>
                    
                    {/* Column 1: Brand & Coordinates */}
                    <div style={{ paddingRight: '12px' }}>
                        <Link href="/" className="text-hover-marker text-hover-marker-dark" style={{ marginBottom: '14px' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go"
                                style={{
                                    height: '44px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <h3 className="marker-text" style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '32px',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                margin: 0,
                                letterSpacing: '-0.8px'
                            }}>
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </h3>
                        </Link>
                        <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.65, marginBottom: '24px' }}>
                            High-altitude ridge camps, sunrise jeep safaris, and verified glamping sanctuaries across Kerala's Western Ghats.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <a href="mailto:bookings@aanandhamgo.in" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '13.5px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#E5A93B'} onMouseOut={(e) => e.currentTarget.style.color = '#FFFFFF'}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-regular fa-envelope" style={{ fontSize: '13px' }}></i>
                                </div>
                                <span>bookings@aanandhamgo.in</span>
                            </a>
                            <a href="tel:+919400987654" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '13.5px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#E5A93B'} onMouseOut={(e) => e.currentTarget.style.color = '#FFFFFF'}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-phone" style={{ fontSize: '13px' }}></i>
                                </div>
                                <span>+91 9400 987 654</span>
                            </a>
                            <a href="https://wa.me/919400987654?text=Hi%20Aanandham%20Team!%20I%20would%20like%20to%20know%20more%20about%20camping%20dates." target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '13.5px', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#E5A93B'} onMouseOut={(e) => e.currentTarget.style.color = '#FFFFFF'}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '15px' }}></i>
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
                                    { name: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://instagram.com/aanandham.go', color: '#E4405F' },
                                    { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', href: 'https://wa.me/919400987654', color: '#25D366' },
                                    { name: 'YouTube', icon: 'fa-brands fa-youtube', href: 'https://youtube.com/@aanandhamgo', color: '#FF0000' },
                                    { name: 'Facebook', icon: 'fa-brands fa-facebook-f', href: 'https://facebook.com/aanandham.go', color: '#1877F2' },
                                    { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: 'https://linkedin.com/company/aanandhamgo', color: '#0A66C2' }
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
                                        <i className={soc.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: THE CAMP & SANCTUARIES */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            THE WILDERNESS
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'About Aanandham', href: '/about' },
                                { name: 'Accommodation & Pods', href: '/#stay' },
                                { name: 'Camp Program & Trails', href: '/#program' },
                                { name: 'Pricing Packages', href: '/#packages' },
                                { name: 'Kerala Stays Gallery', href: '/#kerala-wilderness' },
                                { name: 'Contact & Inquiries', href: '/contact' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '14.5px', fontWeight: '600', textDecoration: 'none' }}>
                                    <span>{item.name}</span>
                                    <span className="arrow-icon">↗</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: AANANDHAM.GO SUB-PAGES */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            AANANDHAM<span style={{ color: '#E5A93B' }}>.GO</span>
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'About Our Mission', href: '/about' },
                                { name: 'Member Portal & Logins', href: '/login' },
                                { name: 'Join Adventure Tribe', href: '/signup' },
                                { name: 'Campsite Host & Admin', href: '/admin' },
                                { name: 'Expedition Concierge Desk', href: '/contact' },
                                { name: 'Privacy, Safety & Permits', href: '/about' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '14.5px', fontWeight: '600', textDecoration: 'none' }}>
                                    <span>{item.name}</span>
                                    <span className="arrow-icon">↗</span>
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
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#A2B6A6'
                }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <Link href="/about" style={{ color: '#A2B6A6', textDecoration: 'none' }}>About Us</Link>
                        <Link href="/contact" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Contact & Booking</Link>
                        <Link href="/login" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Member Login</Link>
                        <Link href="/signup" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Join Tribe</Link>
                        <a href="https://instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" style={{ color: '#E5A93B', textDecoration: 'none', fontWeight: '700' }}>@aanandham.go ↗</a>
                    </div>
                    <div>
                        Copyright © 2026 Aanandham.go Wilderness Platform – Crafted for Mountain Explorers.
                    </div>
                </div>

            </div>
        </footer>
    );
}
