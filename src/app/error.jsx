"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

export default function GlobalErrorBoundary({ error, reset }) {
    const { user: currentUser, logout: handleLogout } = useAuth();

    useEffect(() => {
        // Log client-side error to console and observability pipeline
        console.error('Captured by Aanandham React Error Boundary:', error);
    }, [error]);

    return (
        <div style={{ backgroundColor: '#F8F9F5', color: '#121613', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'clip' }}>
            <SiteHeader 
                activePage="error" 
                currentUser={currentUser} 
                onLogout={handleLogout} 
            />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 20px 80px', textAlign: 'center' }}>
                <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
                    
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            margin: '0 auto 24px'
                        }}
                    >
                        ⚠️
                    </motion.div>

                    <div className="star-badge" style={{ margin: '0 auto 12px' }}>
                        <span className="star-icon">★</span> EXPEDITION RECOVERY DESK
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: '800',
                        color: '#121613',
                        letterSpacing: '-0.03em',
                        margin: '0 0 16px',
                        lineHeight: 1.2
                    }}>
                        A Sudden Fog on the Mountain Trail
                    </h1>

                    <p style={{
                        fontSize: '15px',
                        color: '#59655D',
                        lineHeight: 1.65,
                        margin: '0 auto 32px',
                        maxWidth: '480px'
                    }}>
                        An unexpected runtime signal occurred while loading this view. Our basecamp telemetry has caught the event. You can reload this section safely.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => reset()}
                            className="action-arrow-btn"
                            style={{ padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                        >
                            <span>Retry Mountain Trail</span>
                            <div className="btn-arrow-circle">↻</div>
                        </button>

                        <Link
                            href="/"
                            className="action-arrow-btn-dark"
                            style={{ padding: '14px 28px', textDecoration: 'none' }}
                        >
                            <span>Return to Basecamp</span>
                            <div className="btn-arrow-circle">→</div>
                        </Link>
                    </div>

                    {error?.digest && (
                        <p style={{ marginTop: '28px', fontSize: '11px', color: '#8E9B92', fontFamily: 'monospace' }}>
                            Digest Trace: {error.digest}
                        </p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
