"use client";
import React from 'react';
import { PartyPopper, AlertCircle } from 'lucide-react';
import VerifiedStayBadge from '../common/VerifiedStayBadge';

export default function BookingWizardHeader({
    step,
    setStep,
    confirmedPass,
    validationError,
    setValidationError = () => {},
    paymentSettings = {},
    onClose
}) {
    const stepTitles = {
        1: 'Stay & Dates',
        2: 'Add-Ons & Activities',
        3: 'Camper Details',
        4: 'Review & Enquire',
        5: 'Boarding Pass Issued'
    };

    const steps = [
        { num: 1, label: 'Stay & Dates' },
        { num: 2, label: 'Add-Ons' },
        { num: 3, label: 'Campers' },
        { num: 4, label: 'Enquire' }
    ];

    return (
        <div 
            className="booking-modal-header" 
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
                padding: 'clamp(14px, 2.5vw, 18px) clamp(14px, 3vw, 24px) 12px', 
                borderBottom: '1px solid rgba(0,0,0,0.06)', 
                background: '#FFFFFF' 
            }}
        >
            {/* ── ROW 1: Title (Left) & Close Button (Top-Right) ── */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%',
                gap: '12px', 
                marginBottom: step < 5 ? '12px' : '0' 
            }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h2 id="booking-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2.5vw, 21px)', fontWeight: '900', margin: 0, color: '#121613', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step === 5 ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PartyPopper size={18} /> Boarding Pass Issued</span>
                        ) : (
                            stepTitles[step]
                        )}
                    </h2>
                </div>

                {/* Close Button on Top Right */}
                <button
                    onClick={onClose}
                    aria-label="Close booking modal"
                    className="modal-close-btn-light"
                    style={{
                        width: '34px',
                        height: '34px',
                        minWidth: '34px',
                        minHeight: '34px',
                        borderRadius: '50%',
                        background: 'rgba(18, 22, 19, 0.06)',
                        border: '1px solid rgba(18, 22, 19, 0.12)',
                        color: '#121613',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        marginLeft: 'auto'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* ── ROW 2 (SEPARATE NEW LINE BELOW): 1-2-3-4 Progress Track ── */}
            {step < 5 && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '6px', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    marginTop: '2px' 
                }}>
                    {steps.map((s) => {
                        const isActive = step === s.num;
                        const isCompleted = step > s.num;
                        return (
                            <div 
                                key={s.num}
                                onClick={() => { if (isCompleted) setStep(s.num); }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
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
                                        color: isActive ? '#121613' : isCompleted ? '#166534' : '#7D8880',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
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
