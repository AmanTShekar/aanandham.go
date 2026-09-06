"use client";
import React, { useEffect } from 'react';
import { ShieldCheck, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

const PMS_ADMIN_URL = process.env.NEXT_PUBLIC_PMS_URL 
    ? `${process.env.NEXT_PUBLIC_PMS_URL.replace(/\/$/, '')}/admin`
    : 'https://aanandham-pms.onrender.com/admin';

export default function AdminRedirectPage() {
    useEffect(() => {
        // Immediate cross-origin redirect to Central PMS Admin Suite
        if (typeof window !== 'undefined') {
            window.location.replace(PMS_ADMIN_URL);
        }
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0E1711',
            color: '#F8F9F5',
            padding: '24px',
            fontFamily: 'var(--font-jakarta), -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            <div style={{
                maxWidth: '460px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '36px 28px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(16px)'
            }}>
                {/* Security Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: 'rgba(213, 237, 85, 0.1)',
                    border: '1px solid rgba(213, 237, 85, 0.3)',
                    color: '#D5ED55',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    marginBottom: '20px'
                }}>
                    <ShieldCheck size={14} /> Aanandham Central PMS
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                    <Loader2 size={36} color="#D5ED55" className="animate-spin" style={{ animation: 'spin 1.2s linear infinite' }} />
                </div>

                <h1 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    margin: '0 0 10px 0',
                    letterSpacing: '-0.02em'
                }}>
                    Redirecting to PMS Suite...
                </h1>

                <p style={{
                    fontSize: '13.5px',
                    color: '#94A3B8',
                    lineHeight: 1.55,
                    margin: '0 0 24px 0'
                }}>
                    Aanandham administrative operations, multi-tenant RBAC, live bookings, CRM leads, and staff management are centralized on the PMS Portal.
                </p>

                {/* Direct Launch Button Fallback */}
                <a
                    href={PMS_ADMIN_URL}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        backgroundColor: '#D5ED55',
                        color: '#0E1711',
                        fontSize: '14px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        transition: 'transform 0.15s ease, background-color 0.15s ease',
                        boxShadow: '0 4px 20px rgba(213, 237, 85, 0.25)'
                    }}
                >
                    <span>Launch Central PMS Admin</span>
                    <ArrowRight size={16} />
                </a>

                <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748B' }}>
                    Website Content Manager is available at <a href="/cms" style={{ color: '#D5ED55', textDecoration: 'underline' }}>/cms</a>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
