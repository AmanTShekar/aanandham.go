"use client";
import React from 'react';
import { PartyPopper, AlertCircle } from 'lucide-react';

export default function BookingWizardHeader({
    step,
    setStep,
    confirmedPass,
    validationError,
    paymentSettings = {},
    onClose
}) {
    return (
        <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                            background: '#D5ED55',
                            color: '#121613',
                            fontSize: '10.5px',
                            fontWeight: '900',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px'
                        }}>
                            {step === 5 ? 'Confirmed Permit' : 'Direct Campsite Reservation'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '700' }}>
                            {step === 5 ? 'Official Wilderness Pass' : 'Verified Stays · Best Rate Guaranteed'}
                        </span>
                    </div>
                    <h2 id="booking-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3.2vw, 24px)', fontWeight: '800', margin: 0, color: '#121613' }}>
                        {step === 1 && '1. Select Campsite, Lodging & Dates'}
                        {step === 2 && '2. Choose Experiences & Add-Ons'}
                        {step === 3 && '3. Camper Info & WhatsApp Enquiry'}
                        {step === 4 && '4. Enquire & Payment Details'}
                        {step === 5 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PartyPopper size={18} /> Expedition Boarding Pass Issued</span>}
                    </h2>
                </div>

                <button
                    onClick={onClose}
                    aria-label="Close booking modal"
                    className="modal-close-btn"
                    style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        minHeight: '40px',
                        borderRadius: '50%',
                        background: 'rgba(18, 22, 19, 0.06)',
                        border: '1px solid rgba(18, 22, 19, 0.12)',
                        color: '#121613',
                        fontSize: '16px',
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

            {/* ── BREADCRUMB PROGRESS STEPS ── */}
            {step < 4 && (
                <div className="booking-steps-bar">
                    {[
                        { num: 1, label: 'Stay & Dates', shortLabel: 'Stays' },
                        { num: 2, label: 'Add-Ons', shortLabel: 'Add-Ons' },
                        { num: 3, label: 'WhatsApp Enquiry', shortLabel: 'Enquire' }
                    ].map((s, idx) => {
                        const isActive = step === s.num;
                        const isCompleted = step > s.num;
                        return (
                            <React.Fragment key={s.num}>
                                <div 
                                    className="booking-step-item"
                                    onClick={() => { if (isCompleted) setStep(s.num); }}
                                    style={{
                                        cursor: isCompleted ? 'pointer' : 'default',
                                        opacity: isActive ? 1 : isCompleted ? 0.95 : 0.5,
                                        background: isActive ? 'rgba(22, 101, 52, 0.06)' : 'transparent'
                                    }}
                                >
                                    <div 
                                        className="booking-step-badge"
                                        style={{
                                            background: isActive ? '#166534' : isCompleted ? 'rgba(22, 101, 52, 0.12)' : 'rgba(18, 22, 19, 0.06)',
                                            border: isActive ? '1px solid #166534' : isCompleted ? '1px solid rgba(22, 101, 52, 0.35)' : '1px solid rgba(18, 22, 19, 0.12)',
                                            color: isActive ? '#FFFFFF' : isCompleted ? '#166534' : '#59655D'
                                        }}
                                    >
                                        {isCompleted ? '✓' : s.num}
                                    </div>
                                    <span 
                                        className="booking-step-label-full"
                                        style={{ 
                                            fontWeight: isActive ? '800' : '600', 
                                            color: isActive ? '#166534' : '#59655D' 
                                        }}
                                    >
                                        {s.label}
                                    </span>
                                    <span 
                                        className="booking-step-label-short"
                                        style={{ 
                                            color: isActive ? '#166534' : '#59655D' 
                                        }}
                                    >
                                        {s.shortLabel}
                                    </span>
                                </div>
                                {idx < 2 && <span className="booking-step-arrow">→</span>}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {validationError && step !== 5 && (
                <div style={{
                    background: 'rgba(255, 90, 95, 0.12)',
                    border: '1px solid rgba(255, 90, 95, 0.35)',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    color: '#D9383D',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <AlertCircle size={18} color="#D9383D" />
                    <span>{validationError}</span>
                </div>
            )}
        </div>
    );
}
