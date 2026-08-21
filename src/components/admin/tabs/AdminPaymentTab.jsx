"use client";
import React from 'react';
import { QrCode, Smartphone, Save, ShieldCheck, Check, KeyRound, AlertCircle } from 'lucide-react';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14, FORM_INPUT_STYLE, FIELD_LABEL_STYLE 
} from '../AdminSharedStyles';

export default function AdminPaymentTab({
    paymentSettings,
    setPaymentSettings,
    handleSavePaymentSettings,
    settingsSavedToast
}) {
    return (
        <div>
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> PAYMENT CONTROL CENTER
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#121613' }}>
                                    Payment Gateway, QR Code & Checkout Mode
                                </h2>
                                    <p style={{ fontSize: '12.5px', color: '#59655D', margin: 0 }}>
                                        Toggle between "Coming Soon" concierge reservation mode and the "Live Razorpay Gateway" checkout in 1 click.
                                    </p>
                            </div>
                            <button
                                onClick={handleSavePaymentSettings}
                                className="btn-lime"
                                style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <span><Save size={14} /> Save & Apply</span>
                            </button>
                        </div>

                        {/* SECTION 1: MODE SELECTOR CARDS */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#627266', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                                1. ACTIVE CHECKOUT PAYMENT MODE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                                {/* Mode 1: Coming Soon (Default) */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'coming_soon' }))}
                                    style={{
                                        border: paymentSettings.mode === 'coming_soon' ? '2px solid #E5A93B' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'coming_soon' ? '#FFFDF5' : '#FFFFFF',
                                        borderRadius: '18px',
                                        padding: '18px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'coming_soon' ? '0 8px 30px rgba(229,169,59,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={ROW_SPACE_10}>
<span style={{ fontSize: '24px' }}><Clock size={24} /></span>
                                        <span style={{
                                            background: paymentSettings.mode === 'coming_soon' ? '#E5A93B' : 'rgba(18,22,19,0.06)',
                                            color: paymentSettings.mode === 'coming_soon' ? '#121613' : '#59655D',
                                            fontSize: '10.5px',
                                            fontWeight: '900',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}>
{paymentSettings.mode === 'coming_soon' ? '● CURRENTLY ACTIVE' : 'CLICK TO ACTIVATE'}
                                        </span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                        "Coming Soon" Concierge Mode
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.55, margin: '0 0 14px' }}>
                                        Displays a clean "Gateway Coming Soon" notice. Guests complete bookings with <strong>₹0 advance</strong> and their reservation pass dispatches directly to your WhatsApp desk for personal confirmation.
                                    </p>
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', background: 'rgba(245,158,11,0.1)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
0 Payment Friction · High Conversion
                                    </div>
                                </div>

                                {/* Mode 2: Live Razorpay Gateway */}
                                <div
                                    onClick={() => setPaymentSettings(prev => ({ ...prev, mode: 'razorpay' }))}
                                    style={{
                                        border: paymentSettings.mode === 'razorpay' ? '2px solid #22C55E' : '1px solid rgba(18,22,19,0.1)',
                                        background: paymentSettings.mode === 'razorpay' ? '#F0FDF4' : '#FFFFFF',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        boxShadow: paymentSettings.mode === 'razorpay' ? '0 8px 30px rgba(34,197,94,0.14)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={ROW_SPACE_10}>
                                        <span style={{ fontSize: '24px' }}><Zap size={24} /></span>
                                        <span style={{
                                            background: paymentSettings.mode === 'razorpay' ? '#22C55E' : 'rgba(18,22,19,0.06)',
                                            color: paymentSettings.mode === 'razorpay' ? '#FFFFFF' : '#59655D',
                                            fontSize: '10.5px',
                                            fontWeight: '900',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}>
{paymentSettings.mode === 'razorpay' ? '● CURRENTLY ACTIVE' : 'CLICK TO ACTIVATE'}
                                        </span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                        Live Razorpay Gateway Checkout
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.55, margin: '0 0 14px' }}>
                                        Guests pay through the encrypted Razorpay checkout (UPI · Cards · NetBanking · Wallets). Each booking creates a server-validated order with a 10-minute slot hold; payments are confirmed automatically via webhook.
                                    </p>
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#15803D', background: 'rgba(34,197,94,0.12)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                                        Auto-Confirmed · Webhook Verified
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: COMING SOON MESSAGE CUSTOMIZER */}
                        <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                3. COMING SOON BANNER & CONCIERGE TEXT CUSTOMIZATION
                            </label>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                    Heading / Title:
                                </label>
                                <input
                                    type="text"
                                    value={paymentSettings.comingSoonTitle || ''}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, comingSoonTitle: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                    Notice Description & Guest Guidance:
                                </label>
                                <textarea
                                    rows={3}
                                    value={paymentSettings.comingSoonMessage || ''}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, comingSoonMessage: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
                                />
                            </div>
                        </div>

                        {/* SECTION 4: LIVE PREVIEW & SAVE */}
                        <div style={{ background: '#121613', borderRadius: '20px', padding: '24px 28px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
ACTIVE STATUS: {paymentSettings.mode === 'coming_soon' ? ' COMING SOON MODE' : ' LIVE RAZORPAY GATEWAY'}
                                </div>
                                <div style={{ fontSize: '13.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                    Changes take effect immediately across all booking modals on the website.
                                </div>
                            </div>
                            <button
                                onClick={handleSavePaymentSettings}
                                className="btn-lime"
                                style={{ padding: '13px 32px', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                            >
Save & Apply Settings
                            </button>
                        </div>
                    </div>
        </div>
    );
}
