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
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '50px', marginBottom: '80px' }}>
                    
                    {/* Left Brand & Contact Column */}
                    <div>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '14px' }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go"
                                style={{
                                    height: '42px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '32px',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                margin: 0,
                                letterSpacing: '-0.8px'
                            }}>
                                Aanandham<span style={{ color: '#D5ED55' }}>.go</span>
                            </h3>
                        </Link>
                        <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.6, marginBottom: '28px' }}>
                            Aanandham Wilderness Camp<br />
                            Suryanelli Peak Ridge & Tea Valley,<br />
                            Munnar, Idukki District, Kerala 685618
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <a href="mailto:bookings@aanandhamgo.in" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '14px', textDecoration: 'none' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-regular fa-envelope" style={{ fontSize: '13px' }}></i>
                                </div>
                                <span>bookings@aanandhamgo.in</span>
                            </a>
                            <a href="tel:+919400987654" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '14px', textDecoration: 'none' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-phone" style={{ fontSize: '13px' }}></i>
                                </div>
                                <span>+91 9400 987 654</span>
                            </a>
                            <a href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '14px', textDecoration: 'none' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '14px' }}></i>
                                </div>
                                <span>+91 9400 123 456</span>
                            </a>
                        </div>
                    </div>

                    {/* Middle Column: THE CAMP */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            THE CAMP
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'About Aanandham', href: '/about' },
                                { name: 'Accommodation', href: '/#stay' },
                                { name: 'Camp Program', href: '/#program' },
                                { name: 'Pricing Packages', href: '/#packages' },
                                { name: 'Contact & Inquiries', href: '/contact' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>
                                    <span>{item.name}</span>
                                    <span className="arrow-icon">↗</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: THE TEAM */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#A2B6A6', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            THE TEAM
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { name: 'Our Pathfinders', href: '/about' },
                                { name: 'Trek Instructors', href: '/#instructors' },
                                { name: 'Testimonials', href: '/#stories' },
                                { name: 'Nearby Attractions', href: '/about' }
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="interactive-arrow-link" style={{ color: '#A2B6A6', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>
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

                {/* Bottom Sub-Links */}
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
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link href="/about" style={{ color: '#A2B6A6', textDecoration: 'none' }}>About Us</Link>
                        <Link href="/contact" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Contact</Link>
                        <Link href="/login" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Member Login</Link>
                        <Link href="/signup" style={{ color: '#A2B6A6', textDecoration: 'none' }}>Join Tribe</Link>
                    </div>
                    <div>
                        Copyright © 2026 Aanandham.go Wilderness Platform – Designed for Explorers.
                    </div>
                </div>

            </div>
        </footer>
    );
}
