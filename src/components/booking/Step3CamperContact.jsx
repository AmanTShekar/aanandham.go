"use client";
import React from 'react';
import { User, Phone, Mail, FileText, ArrowRight, ArrowLeft, Leaf, Drumstick, Utensils, Minus, Plus } from 'lucide-react';
import { inr } from '../../lib/utils';
import { ROW_GAP_10 } from './BookingConstants';
import { validateEmailClient } from '../../lib/emailValidatorCore';

export default function Step3CamperContact({
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    specialNotes,
    setSpecialNotes,
    dietaryChoice,
    setDietaryChoice,
    vegCount,
    setVegCount,
    nonVegCount,
    setNonVegCount,
    adults = 2,
    children = 0,
    totalGuests: propTotalGuests,
    currentStepPrice,
    honeypot,
    setHoneypot,
    handleStep3Next,
    setStep,
    setValidationError = () => {}
}) {
    const totalGuests = propTotalGuests || (adults + children) || 2;
    const [emailTouched, setEmailTouched] = React.useState(false);
    const [liveCheckStatus, setLiveCheckStatus] = React.useState(null);

    // Synchronous client-side check
    const clientCheck = React.useMemo(() => {
        if (!customerEmail || !customerEmail.trim()) return null;
        return validateEmailClient(customerEmail);
    }, [customerEmail]);

    // Live DNS MX check with 450ms debounce
    React.useEffect(() => {
        const trimmed = String(customerEmail || '').trim();
        if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
            setLiveCheckStatus(null);
            return;
        }

        const timer = setTimeout(async () => {
            setLiveCheckStatus('checking');
            try {
                const res = await fetch(`/api/validate-email?email=${encodeURIComponent(trimmed)}`);
                if (res.ok) {
                    const data = await res.json();
                    setLiveCheckStatus(data);
                } else {
                    setLiveCheckStatus(null);
                }
            } catch {
                setLiveCheckStatus(null);
            }
        }, 450);

        return () => clearTimeout(timer);
    }, [customerEmail]);

    const isEmailError = emailTouched && Boolean(customerEmail) && ((clientCheck && !clientCheck.isValid) || (liveCheckStatus && liveCheckStatus !== 'checking' && !liveCheckStatus.isValid));
    const isEmailVerified = Boolean(customerEmail) && clientCheck?.isValid && liveCheckStatus?.isValid;

    return (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            Lead Explorer Contact & Expedition Preferences
                                        </label>
                                        
                                        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                                            <input
                                                type="text"
                                                tabIndex="-1"
                                                value={honeypot}
                                                onChange={(e) => setHoneypot(e.target.value)}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px', marginBottom: '14px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="booking-modal-input"
                                                    placeholder="e.g. Anand Kumar"
                                                    value={customerName}
                                                    onChange={(e) => { setCustomerName(e.target.value); setValidationError(''); }}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                                    WhatsApp Contact Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="booking-modal-input"
                                                    placeholder="e.g. +91 94001 23456"
                                                    value={customerPhone}
                                                    onChange={(e) => { setCustomerPhone(e.target.value); setValidationError(''); }}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                                    Email Address * <span style={{ color: '#166534', fontSize: '11px', fontWeight: '600' }}>(Mandatory for Official Pass)</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="booking-modal-input"
                                                    placeholder="e.g. anand@gmail.com"
                                                    value={customerEmail}
                                                    onChange={(e) => { 
                                                        setCustomerEmail(e.target.value); 
                                                        setValidationError(''); 
                                                    }}
                                                    onBlur={() => setEmailTouched(true)}
                                                    style={{
                                                        borderColor: isEmailError ? '#DC2626' : (isEmailVerified ? '#166534' : undefined),
                                                        background: isEmailError ? '#FEF2F2' : undefined
                                                    }}
                                                    required
                                                />

                                                {/* Live Status and Typo Suggestion */}
                                                {clientCheck && !clientCheck.isValid && (
                                                    <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: '700', marginTop: '4px' }}>
                                                        ⚠️ {clientCheck.message}
                                                        {clientCheck.suggestion && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const parts = customerEmail.split('@');
                                                                    const corrected = parts[0] + '@' + clientCheck.suggestion;
                                                                    setCustomerEmail(corrected);
                                                                    setValidationError('');
                                                                }}
                                                                style={{
                                                                    marginLeft: '6px',
                                                                    background: '#166534',
                                                                    color: '#FFFFFF',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    padding: '2px 6px',
                                                                    fontSize: '10px',
                                                                    fontWeight: '800',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Use @{clientCheck.suggestion}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {clientCheck?.isValid && liveCheckStatus === 'checking' && (
                                                    <div style={{ fontSize: '10.5px', color: '#59655D', fontWeight: '600', marginTop: '4px' }}>
                                                        🔍 Verifying live mail domain...
                                                    </div>
                                                )}

                                                {clientCheck?.isValid && liveCheckStatus && liveCheckStatus !== 'checking' && !liveCheckStatus.isValid && (
                                                    <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: '700', marginTop: '4px' }}>
                                                        ⚠️ {liveCheckStatus.message}
                                                    </div>
                                                )}

                                                {isEmailVerified && (
                                                    <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '800', marginTop: '4px' }}>
                                                        ✓ Live Verified Email · Ready to receive pass
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Campfire Meal Preference */}
                                        <div style={{ background: '#F8F9F5', padding: '16px 18px', borderRadius: '18px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                                                <div>
                                                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                        <Utensils size={14} /> Live Campfire Dinner & Breakfast Prep
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#59655D' }}>
                                                        Distribute {totalGuests} camper meal portions (Vegetarian vs Non-Veg BBQ):
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                                                    {vegCount} Veg + {nonVegCount} Non-Veg
                                                </span>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                                                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Leaf size={12} /> Vegetarian Campers</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newVeg = Math.max(0, vegCount - 1);
                                                                setVegCount(newVeg);
                                                                setNonVegCount(totalGuests - newVeg);
                                                            }}
                                                            style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '800' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ fontSize: '14px', fontWeight: '800' }}>{vegCount}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newVeg = Math.min(totalGuests, vegCount + 1);
                                                                setVegCount(newVeg);
                                                                setNonVegCount(totalGuests - newVeg);
                                                            }}
                                                            style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '800' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '800', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Drumstick size={12} /> Non-Veg BBQ Campers</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newNonVeg = Math.max(0, nonVegCount - 1);
                                                                setNonVegCount(newNonVeg);
                                                                setVegCount(totalGuests - newNonVeg);
                                                            }}
                                                            style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '800' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ fontSize: '14px', fontWeight: '800' }}>{nonVegCount}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newNonVeg = Math.min(totalGuests, nonVegCount + 1);
                                                                setNonVegCount(newNonVeg);
                                                                setVegCount(totalGuests - newNonVeg);
                                                            }}
                                                            style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '800' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dietary Special Notes */}
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                {['Standard Spicing', 'Mild Kids Spicing', 'Jain Pure Veg', 'Gluten Sensitive'].map(diet => (
                                                    <button
                                                        key={diet}
                                                        type="button"
                                                        onClick={() => setDietaryChoice(diet)}
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '8px',
                                                            border: dietaryChoice === diet ? '1px solid #166534' : '1px solid rgba(18,22,19,0.12)',
                                                            background: dietaryChoice === diet ? '#166534' : '#FFFFFF',
                                                            color: dietaryChoice === diet ? '#FFFFFF' : '#121613',
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {diet}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Special Notes */}
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '4px' }}>
                                                Special Requests / Pickup Logistics / Notes (Optional):
                                            </label>
                                            <textarea
                                                rows={2}
                                                className="booking-modal-input"
                                                placeholder="e.g. Arriving via Munnar bus stop at 1 PM; celebrating anniversary."
                                                value={specialNotes}
                                                onChange={(e) => setSpecialNotes(e.target.value)}
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="btn-secondary"
                                            style={{ background: '#F1F3EC', border: 'none', fontSize: '13px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '8px 14px', borderRadius: '10px' }}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleStep3Next}
                                            className="btn-lime"
                                            style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                        >
                                            <span>Continue to Payment</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
    );
}
