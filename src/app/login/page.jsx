"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AuthPage({ initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
    const [showPassword, setShowPassword] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('beginner');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        remember: true
    });

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        level: 'beginner'
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F8F9F5',
            color: '#121613',
            fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Background Glows */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-5%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(213, 237, 85, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14, 26, 17, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            {/* Top Navigation Bar */}
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '24px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20
            }}>
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#121613',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    background: '#FFFFFF',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: '1px solid rgba(18, 22, 19, 0.1)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                }}>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i> Back to Aanandham.go
                </Link>

                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#121613',
                    textDecoration: 'none',
                    letterSpacing: '-0.03em'
                }}>
                    <img
                        src="/logo.png"
                        alt="Aanandham.go"
                        style={{
                            height: '32px',
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                    <span>Aanandham<span style={{ color: '#88A316' }}>.go</span></span>
                </Link>
            </header>

            {/* Main Interactive Swapping Container */}
            <motion.div 
                layout
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '1080px',
                    minHeight: '660px',
                    background: '#FFFFFF',
                    borderRadius: '36px',
                    border: '1px solid rgba(18, 22, 19, 0.08)',
                    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.06)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 10,
                    margin: '70px 0 20px'
                }}
            >
                {/* ─────────────────────────────────────────────────────────────
                    FORM PANEL (Slides / Swaps based on mode)
                ───────────────────────────────────────────────────────────── */}
                <div style={{
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    order: mode === 'login' ? 1 : 2
                }}>
                    {/* Mode Switcher Tabs */}
                    <div style={{
                        display: 'inline-flex',
                        background: '#F1F3EC',
                        padding: '5px',
                        borderRadius: '999px',
                        marginBottom: '32px',
                        alignSelf: 'flex-start',
                        gap: '4px'
                    }}>
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            style={{
                                border: 'none',
                                background: mode === 'login' ? '#121613' : 'transparent',
                                color: mode === 'login' ? '#FFFFFF' : '#59655D',
                                padding: '8px 24px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: mode === 'login' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none'
                            }}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            style={{
                                border: 'none',
                                background: mode === 'signup' ? '#121613' : 'transparent',
                                color: mode === 'signup' ? '#FFFFFF' : '#59655D',
                                padding: '8px 24px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: mode === 'signup' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none'
                            }}
                        >
                            Create Account
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            /* ── LOGIN FORM ── */
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="star-badge" style={{ marginBottom: '6px' }}>
                                    <span className="star-icon">★</span> WELCOME BACK
                                </div>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                    fontSize: 'clamp(28px, 3.5vw, 38px)',
                                    fontWeight: '800',
                                    color: '#121613',
                                    letterSpacing: '-0.035em',
                                    marginBottom: '8px',
                                    lineHeight: 1.15
                                }}>
                                    Sign In to Basecamp
                                </h1>
                                <p style={{ fontSize: '14px', color: '#59655D', marginBottom: '28px', lineHeight: 1.5 }}>
                                    Access your booked expeditions, camp schedules, and community chat.
                                </p>

                                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Email or Phone
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="you@domain.com or +91 9400..."
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '13px 16px',
                                                borderRadius: '14px',
                                                border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                background: '#F8F9F5',
                                                fontSize: '14px',
                                                color: '#121613',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#121613';
                                                e.target.style.background = '#FFFFFF';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'rgba(18, 22, 19, 0.1)';
                                                e.target.style.background = '#F8F9F5';
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                Password
                                            </label>
                                            <a href="#" style={{ fontSize: '12px', color: '#59655D', fontWeight: '600', textDecoration: 'none' }}>
                                                Forgot?
                                            </a>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                placeholder="••••••••••••"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '13px 44px 13px 16px',
                                                    borderRadius: '14px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '14px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#121613';
                                                    e.target.style.background = '#FFFFFF';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(18, 22, 19, 0.1)';
                                                    e.target.style.background = '#F8F9F5';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '14px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#8E9B92',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-lime"
                                        disabled={loading}
                                        style={{
                                            padding: '14px',
                                            fontSize: '15px',
                                            fontWeight: '800',
                                            marginTop: '6px',
                                            width: '100%',
                                            boxShadow: '0 8px 24px rgba(213, 237, 85, 0.4)'
                                        }}
                                    >
                                        {loading ? 'Entering Basecamp...' : 'Log In →'}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#59655D' }}>
                                        Don’t have an account yet?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setMode('signup')}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#121613',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                padding: 0
                                            }}
                                        >
                                            Join the Tribe ↗
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            /* ── SIGNUP FORM ── */
                            <motion.div
                                key="signup-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="star-badge" style={{ marginBottom: '6px' }}>
                                    <span className="star-icon">★</span> JOIN THE TRIBE
                                </div>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                                    fontSize: 'clamp(28px, 3.5vw, 38px)',
                                    fontWeight: '800',
                                    color: '#121613',
                                    letterSpacing: '-0.035em',
                                    marginBottom: '8px',
                                    lineHeight: 1.15
                                }}>
                                    Create Your Account
                                </h1>
                                <p style={{ fontSize: '14px', color: '#59655D', marginBottom: '20px', lineHeight: 1.5 }}>
                                    Join 350+ adventurers and unlock member-only trail spots.
                                </p>

                                <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Maya Chen"
                                            value={signupData.name}
                                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '11px 14px',
                                                borderRadius: '12px',
                                                border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                background: '#F8F9F5',
                                                fontSize: '13.5px',
                                                color: '#121613',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="maya@domain.com"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
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
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                WhatsApp Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 9400..."
                                                value={signupData.phone}
                                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 14px',
                                                    borderRadius: '12px',
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

                                    {/* Trek Level Selection Chips */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Your Trekking Level
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {[
                                                { id: 'newbie', label: 'Total Newbie' },
                                                { id: 'beginner', label: 'Still Learning' },
                                                { id: 'intermediate', label: 'Pretty Confident' },
                                                { id: 'advanced', label: 'Already a Pro' }
                                            ].map((lvl) => {
                                                const isSel = selectedLevel === lvl.id;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={lvl.id}
                                                        onClick={() => setSelectedLevel(lvl.id)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            borderRadius: '10px',
                                                            border: isSel ? '1.5px solid #121613' : '1px solid rgba(18,22,19,0.1)',
                                                            background: isSel ? '#D5ED55' : '#F8F9F5',
                                                            color: '#121613',
                                                            fontSize: '12px',
                                                            fontWeight: isSel ? '800' : '600',
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        {lvl.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                placeholder="At least 8 characters"
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '11px 40px 11px 14px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#F8F9F5',
                                                    fontSize: '13.5px',
                                                    color: '#121613',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#8E9B92',
                                                    cursor: 'pointer',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-lime"
                                        disabled={loading}
                                        style={{
                                            padding: '13px',
                                            fontSize: '14.5px',
                                            fontWeight: '800',
                                            marginTop: '6px',
                                            width: '100%',
                                            boxShadow: '0 8px 24px rgba(213, 237, 85, 0.4)'
                                        }}
                                    >
                                        {loading ? 'Creating Your Profile...' : 'Join Aanandham Tribe →'}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: '#59655D' }}>
                                        Already registered?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setMode('login')}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#121613',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                padding: 0
                                            }}
                                        >
                                            Log In ↗
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    VISUAL MEDIA PANEL (Swaps Position & Content Smoothly)
                ───────────────────────────────────────────────────────────── */}
                <motion.div 
                    layout
                    style={{
                        position: 'relative',
                        minHeight: '440px',
                        overflow: 'hidden',
                        order: mode === 'login' ? 2 : 1,
                        background: '#0E1A11'
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={mode}
                            src={mode === 'login' 
                                ? 'https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&w=1200&q=80'
                                : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'
                            }
                            alt="Wilderness basecamp"
                            initial={{ opacity: 0, scale: 1.08 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </AnimatePresence>

                    {/* Dark Nature Overlay Gradient */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(14, 26, 17, 0.92) 0%, rgba(14, 26, 17, 0.25) 50%, rgba(14, 26, 17, 0.5) 100%)'
                    }} />

                    {/* Top Floating Badge */}
                    <div style={{
                        position: 'absolute',
                        top: '28px',
                        left: '28px',
                        right: '28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 2
                    }}>
                        <span style={{
                            background: 'rgba(0, 0, 0, 0.65)',
                            color: '#D5ED55',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            padding: '6px 14px',
                            borderRadius: '999px',
                            backdropFilter: 'blur(8px)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span>★</span> {mode === 'login' ? 'MEMBERS BASECAMP' : 'NEW REGISTRATION'}
                        </span>
                        <span style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '6px 12px',
                            borderRadius: '999px',
                            backdropFilter: 'blur(6px)'
                        }}>
                            Munnar & Wayanad
                        </span>
                    </div>

                    {/* Bottom Caption Card */}
                    <div style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '32px',
                        right: '32px',
                        zIndex: 2
                    }}>
                        <div style={{
                            background: 'rgba(14, 24, 17, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '24px',
                            padding: '24px',
                            backdropFilter: 'blur(12px)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                    alt="Camp Lead"
                                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D5ED55' }}
                                />
                                <div>
                                    <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '800' }}>
                                        {mode === 'login' ? 'Daniel Kim' : 'Pooja Menon'}
                                    </div>
                                    <div style={{ color: '#A2B6A6', fontSize: '11.5px' }}>
                                        {mode === 'login' ? 'Camper ‘25 · Kolukkumalai Ridge' : 'High-Altitude Yoga & Camp Lead'}
                                    </div>
                                </div>
                            </div>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '13px',
                                lineHeight: 1.55,
                                margin: 0,
                                fontStyle: 'italic'
                            }}>
                                {mode === 'login'
                                    ? '“Best reset of my year. Went from barely walking trails to riding the sunrise above the clouds.”'
                                    : '“Whether you hike every week or have never pitched a tent, our crew takes care of every single step.”'
                                }
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Subtext */}
            <div style={{
                fontSize: '12px',
                color: '#8E9B92',
                textAlign: 'center',
                marginTop: '12px'
            }}>
                Protected by 256-bit encryption · Aanandham Wilderness Platform © 2026
            </div>
        </div>
    );
}
