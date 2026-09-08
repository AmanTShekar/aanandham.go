"use client";
import React from 'react';
import { PartyPopper, AlertCircle } from 'lucide-react';

export default function BookingWizardHeader({
    step,
    setStep,
    confirmedPass,
    validationError,
    setValidationError = () => {},
    paymentSettings = {},
    onClose
}) {
    return (
        <div className="booking-modal-header" style={{ padding: 'clamp(14px, 2.5vw, 20px) clamp(14px, 3vw, 24px) 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                            background: '#DCFCE7',
                            color: '#166534',
                            border: '1px solid rgba(22, 101, 52, 0.25)',
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            ✓ Verified Stay
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '600' }}>
                            {step === 1 && 'Confirm dates, campers & lodging'}
                            {step === 2 && 'Optional campfire, BBQ & treks'}
                            {step === 3 && 'Primary explorer contact details'}
                            {step === 4 && 'Review summary & pay securely'}
                            {step === 5 && 'Official Wilderness Pass'}
                        </span>
                    </div>
                    <h2 id="booking-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(17px, 3vw, 22px)', fontWeight: '900', margin: 0, color: '#121613', letterSpacing: '-0.01em' }}>
                        {step === 1 && '1. Stay & Dates'}
                        {step === 2 && '2. Add-Ons'}
                        {step === 3 && '3. Camper Details'}
                        {step === 4 && '4. Review & Confirm'}
                        {step === 5 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PartyPopper size={18} /> Boarding Pass Issued</span>}
                    </h2>
                </div>

                <button
                    onClick={onClose}
                    aria-label="Close booking modal"
                    className="modal-close-btn"
                    style={{
                        width: '36px',
                        height: '36px',
                        minWidth: '36px',
                        minHeight: '36px',
                        borderRadius: '50%',
                        background: 'rgba(18, 22, 19, 0.06)',
                        border: '1px solid rgba(18, 22, 19, 0.12)',
                        color: '#121613',
                        fontSize: '15px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                    }}
                >
                    ✕
                </button>
            </div>

            {/* ── SLEEK SEGMENTED PROGRESS TRACK ── */}
            {step < 5 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', width: '100%', marginTop: '4px' }}>
                    {[
                        { num: 1, label: 'Dates & Stay' },
                        { num: 2, label: 'Add-Ons' },
                        { num: 3, label: 'Campers' },
                        { num: 4, label: 'Confirm' }
                    ].map((s) => {
                        const isActive = step === s.num;
                        const isCompleted = step > s.num;
                        return (
                            <div 
                                key={s.num}
                                onClick={() => { if (isCompleted) setStep(s.num); }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    cursor: isCompleted ? 'pointer' : 'default'
                                }}
                            >
                                {/* Progress Indicator Line */}
                                <div style={{
                                    height: '4px',
                                    borderRadius: '999px',
                                    background: isCompleted ? '#166534' : isActive ? '#E5A93B' : 'rgba(18, 22, 19, 0.1)',
                                    boxShadow: isActive ? '0 1px 4px rgba(229, 169, 59, 0.4)' : 'none',
                                    transition: 'all 0.3s ease'
                                }} />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 2px'
                                }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: isActive ? '900' : isCompleted ? '700' : '600',
                                        color: isActive ? '#121613' : isCompleted ? '#166534' : '#7D8880'
                                    }}>
                                        {s.num}. {s.label}
                                    </span>
                                    {isCompleted && (
                                        <span style={{ fontSize: '10px', color: '#166534', fontWeight: '900' }}>✓</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── CUSTOM ERROR POP-UP BANNER IN HEADER ── */}
            {validationError && step !== 5 && (
                <div 
                    className="booking-error-popup-card"
                    style={{
                        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
                        border: '2px solid #F43F5E',
                        borderRadius: '16px',
                        padding: '12px 18px',
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: '0 8px 24px -4px rgba(225, 29, 72, 0.22)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: '#FFE4E6',
                            border: '1.5px solid #FDA4AF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#E11D48',
                            flexShrink: 0
                        }}>
                            <AlertCircle size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{
                                    background: '#E11D48',
                                    color: '#FFFFFF',
                                    fontSize: '9.5px',
                                    fontWeight: '900',
                                    padding: '1px 6px',
                                    borderRadius: '999px',
                                    letterSpacing: '0.4px',
                                    textTransform: 'uppercase'
                                }}>
                                    Attention Required
                                </span>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#881337', lineHeight: 1.35 }}>
                                {validationError}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setValidationError('')}
                        aria-label="Dismiss error notice"
                        style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            border: '1px solid #FDA4AF',
                            background: '#FFFFFF',
                            color: '#BE123C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                            fontSize: '12px',
                            fontWeight: '800',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
