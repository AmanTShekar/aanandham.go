"use client";
import React from 'react';
import { ShieldCheck, Lock, QrCode, ArrowLeft, Sparkles, AlertCircle, Tent, Hourglass } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import { inr } from '../../lib/utils';
import { ROW_GAP_10 } from './BookingConstants';

export default function Step4PaymentGateway({
    selectedPkg,
    selectedRoom,
    travelDate,
    adults,
    children,
    totalGuests,
    totalUnits,
    dietaryChoice,
    vegCount,
    nonVegCount,
    selectedAddons,
    discounts,
    baseLodgingAmount,
    addonsAmount,
    totalAmount = 0,
    advanceAmount = 0,
    balanceAmount = 0,
    paymentMode = 'advance',
    setPaymentMode = () => {},
    paymentSettings = {},
    payeeName,
    isSubmitting = false,
    validationError = null,
    handleRazorpayCheckout = () => {},
    handleDirectWhatsAppBooking = () => {},
    setStep = () => {}
}) {
    const grandTotal = Number(totalAmount) || 2499;
    const safeAdvance = Number(advanceAmount) || Math.round(grandTotal * 0.3);
    const payableNow = paymentMode === 'advance' ? safeAdvance : grandTotal;
    return (
        <div>
            {/* Auto-Cutoff Server Outage / Gateway Protection Banner */}
            {validationError && (
                <div style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #F87171',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)'
                }}>
                    <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#991B1B', marginBottom: '3px' }}>
                            Online Payment Gateway Auto-Protection Activated
                        </div>
                        <div style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: 1.5 }}>
                            {validationError}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: '800', marginTop: '6px' }}>
                            👉 Don’t worry! Your tent booking is safe. Please click "Reserve via WhatsApp (Zero Advance)" below to confirm your stay without paying online.
                        </div>
                    </div>
                </div>
            )}
                                    {paymentSettings.mode !== 'coming_soon' && (
                                        /* Payment Mode Selector for Razorpay mode */
                                        <div style={{ marginBottom: '18px' }}>
                                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                                Select Payment Amount Choice
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <div
                                                    onClick={() => setPaymentMode('advance')}
                                                    style={{
                                                        padding: '12px 14px',
                                                        borderRadius: '14px',
                                                        border: paymentMode === 'advance' ? '2px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                        background: paymentMode === 'advance' ? '#F4F7EB' : '#FFFFFF',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#121613' }}>30% Advance</span>
                                                        <span style={{ background: '#D5ED55', color: '#121613', fontSize: '9.5px', fontWeight: '900', padding: '1px 6px', borderRadius: '999px' }}>POPULAR</span>
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#166534' }}>
                                                        ₹{safeAdvance.toLocaleString('en-IN')}
                                                    </div>
                                                    <div style={{ fontSize: '10.5px', color: '#59655D', marginTop: '2px' }}>
                                                        Locks permits now. Balance on arrival.
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => setPaymentMode('full')}
                                                    style={{
                                                        padding: '12px 14px',
                                                        borderRadius: '14px',
                                                        border: paymentMode === 'full' ? '2px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                        background: paymentMode === 'full' ? '#F4F7EB' : '#FFFFFF',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#121613' }}>100% Full</span>
                                                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '9.5px', fontWeight: '800', padding: '1px 6px', borderRadius: '999px' }}>VIP</span>
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#121613' }}>
                                                        ₹{grandTotal.toLocaleString('en-IN')}
                                                    </div>
                                                    <div style={{ fontSize: '10.5px', color: '#59655D', marginTop: '2px' }}>
                                                        Zero balance on arrival. Fast key pickup.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── PAYMENT CARD: DYNAMIC COMING SOON vs LIVE UPI GATEWAY ── */}
                                    {paymentSettings.mode === 'coming_soon' ? (
                                        <div style={{ background: '#121613', borderRadius: '20px', padding: '20px 18px', color: '#FFFFFF', marginBottom: '18px', border: '1px solid rgba(213, 237, 85, 0.25)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '900', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.5px' }}>
                                                    ⏳ COMING SOON
                                                </span>
                                                <span style={{ color: '#D5ED55', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    Online Payment Coming Soon
                                                </span>
                                            </div>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px' }}>
                                                Direct WhatsApp Concierge Enquiry
                                            </h3>
                                            <p style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.55, margin: '0 0 16px' }}>
                                                Instant online payment checkout is launching soon. Connect directly with our basecamp concierge on WhatsApp to check live slot availability, answer questions, and finalize your booking.
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(213, 237, 85, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D5ED55', fontSize: '14px' }}>
                                                        <Tent size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>Estimated Expedition Total</div>
                                                        <div style={{ fontSize: '17px', fontWeight: '900', color: '#D5ED55' }}>₹{grandTotal.toLocaleString('en-IN')}</div>
                                                    </div>
                                                </div>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                                                        <WhatsAppIcon size={16} color="#25D366" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>WhatsApp Desk</div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>+91 90748 58014</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Secure Razorpay Gateway Card */
                                        <div style={{ background: '#121613', borderRadius: '20px', padding: '18px', color: '#FFFFFF', marginBottom: '18px', border: '1px solid rgba(213, 237, 85, 0.25)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ background: '#22C55E', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '900', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.5px' }}>
                                                    ● SECURE CHECKOUT
                                                </span>
                                                <span style={{ color: '#D5ED55', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    Razorpay Gateway
                                                </span>
                                            </div>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px' }}>
                                                Pay Securely with Razorpay
                                            </h3>
                                            <p style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.55, margin: '0 0 14px' }}>
                                                UPI · Cards · NetBanking · Wallets — all accepted inside the encrypted Razorpay checkout. Your slot is held for 10 minutes while you pay.
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontSize: '14px', fontWeight: '900' }}>
                                                        ✓
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Pay Now</div>
                                                        <div style={{ fontSize: '17px', fontWeight: '900', color: '#D5ED55' }}>₹{payableNow.toLocaleString('en-IN')}</div>
                                                    </div>
                                                </div>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(229, 169, 59, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5A93B', fontSize: '14px' }}>
                                                        <Hourglass size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Slot Hold</div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>10 Minutes</div>
                                                    </div>
                                                </div>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(213, 237, 85, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D5ED55', fontSize: '14px' }}>
                                                        <ShieldCheck size={15} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Protected</div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>Bank-grade Secured</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="btn-secondary"
                                            style={{ background: '#F1F3EC', border: 'none', fontSize: '13px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 16px', borderRadius: '10px' }}
                                        >
                                            ← Back
                                        </button>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {paymentSettings.mode === 'coming_soon' ? (
                                                /* Primary WhatsApp Reservation Button when Gateway is in Launching Soon Mode */
                                                <button
                                                    type="button"
                                                    onClick={handleDirectWhatsAppBooking}
                                                    disabled={isSubmitting}
                                                    title="Send this reservation inquiry with all campsite and camper details directly to our 24/7 Mountain Concierge on WhatsApp"
                                                    style={{
                                                        padding: '13px 26px',
                                                        fontSize: '14px',
                                                        fontWeight: '900',
                                                        borderRadius: '12px',
                                                        background: '#E5A93B',
                                                        color: '#121613',
                                                        border: 'none',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        boxShadow: '0 4px 16px rgba(229, 169, 59, 0.4)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <WhatsAppIcon size={18} color="#121613" />
                                                    <span>Reserve via WhatsApp (Zero Advance) →</span>
                                                </button>
                                            ) : (
                                                /* Live Dual Option Mode (WhatsApp Inquiry or Instant Razorpay Gateway) */
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handleDirectWhatsAppBooking}
                                                        disabled={isSubmitting}
                                                        title="Send reservation directly to 24/7 WhatsApp Concierge"
                                                        style={validationError ? {
                                                            padding: '13px 24px',
                                                            fontSize: '13.5px',
                                                            fontWeight: '900',
                                                            borderRadius: '12px',
                                                            background: '#25D366',
                                                            border: 'none',
                                                            color: '#0A2E14',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                            boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
                                                            transition: 'all 0.2s ease'
                                                        } : {
                                                            padding: '12px 18px',
                                                            fontSize: '13px',
                                                            fontWeight: '800',
                                                            borderRadius: '12px',
                                                            background: 'rgba(37, 211, 102, 0.12)',
                                                            border: '1px solid rgba(37, 211, 102, 0.3)',
                                                            color: '#25D366',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <WhatsAppIcon size={18} color={validationError ? '#0A2E14' : '#25D366'} />
                                                        <span>{validationError ? 'Reserve via WhatsApp (Zero Advance) →' : 'WhatsApp Enquire'}</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleRazorpayCheckout}
                                                        disabled={isSubmitting}
                                                        className={validationError ? 'btn-secondary' : 'btn-lime'}
                                                        style={validationError ? {
                                                            padding: '12px 20px',
                                                            fontSize: '13px',
                                                            fontWeight: '800',
                                                            borderRadius: '12px',
                                                            background: '#F1F3EC',
                                                            border: '1px solid rgba(18, 22, 19, 0.15)',
                                                            color: '#59655D',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                            opacity: isSubmitting ? 0.7 : 1
                                                        } : {
                                                            padding: '12px 26px',
                                                            fontSize: '14px',
                                                            fontWeight: '900',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                            opacity: isSubmitting ? 0.7 : 1
                                                        }}
                                                    >
                                                        <span>
                                                            {isSubmitting 
                                                                ? 'Opening Secure Checkout...' 
                                                                : (validationError 
                                                                    ? `Retry Online Payment (₹${payableNow.toLocaleString('en-IN')}) ⟳` 
                                                                    : `Pay ₹${payableNow.toLocaleString('en-IN')} Securely →`)}
                                                        </span>
                                                        <ShieldCheck size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
    );
}
