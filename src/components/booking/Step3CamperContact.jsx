"use client";
import React from 'react';
import { User, Phone, Mail, FileText, ArrowRight, ArrowLeft, Leaf, Drumstick, Utensils, Minus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import { inr } from '../../lib/utils';
import { ROW_GAP_10 } from './BookingConstants';
import { validateEmailClient } from '../../lib/emailValidatorCore';
import BookingValidationPopup from './BookingValidationPopup';

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
    handleDirectWhatsAppBooking,
    setStep,
    setValidationError = () => {}
}) {
    const totalGuests = propTotalGuests || (adults + children) || 2;
    
    // Input references for auto-scroll & focus on error
    const nameInputRef = React.useRef(null);
    const phoneInputRef = React.useRef(null);
    const emailInputRef = React.useRef(null);

    // Validation State
    const [touched, setTouched] = React.useState({ name: false, phone: false, email: false });
    const [hasSubmitted, setHasSubmitted] = React.useState(false);
    const [popupErrors, setPopupErrors] = React.useState([]);
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

    const isValidPhoneNumber = (num) => {
        const cleaned = String(num || '').replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 13;
    };

    // Live field error evaluations
    const isNameEmpty = !customerName || !customerName.trim();
    const isNameInvalid = isNameEmpty || customerName.trim().length < 2;
    const isNameError = (touched.name || hasSubmitted) && isNameInvalid;

    const isPhoneEmpty = !customerPhone || !customerPhone.trim();
    const isPhoneInvalid = isPhoneEmpty || !isValidPhoneNumber(customerPhone);
    const isPhoneError = (touched.phone || hasSubmitted) && isPhoneInvalid;

    const isEmailEmpty = !customerEmail || !customerEmail.trim();
    const isEmailFormatValid = Boolean(clientCheck?.isValid);
    const isEmailDnsInvalid = liveCheckStatus && liveCheckStatus !== 'checking' && !liveCheckStatus.isValid;
    const isEmailError = (touched.email || hasSubmitted || emailTouched) && (isEmailEmpty || !isEmailFormatValid || isEmailDnsInvalid);
    const isEmailVerified = Boolean(customerEmail) && clientCheck?.isValid && liveCheckStatus?.isValid;

    // Focus helper
    const focusField = (field) => {
        if (field === 'name' && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (field === 'phone' && phoneInputRef.current) {
            phoneInputRef.current.focus();
            phoneInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (field === 'email' && emailInputRef.current) {
            emailInputRef.current.focus();
            emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Error Collector
    const collectErrors = () => {
        const errs = [];
        if (isNameEmpty) {
            errs.push({ field: 'name', label: 'Full Name', message: 'Full Name is required (as per ID)' });
        } else if (customerName.trim().length < 2) {
            errs.push({ field: 'name', label: 'Full Name', message: 'Full Name must be at least 2 letters' });
        }

        if (isPhoneEmpty) {
            errs.push({ field: 'phone', label: 'WhatsApp Number', message: 'WhatsApp contact number is required' });
        } else if (!isValidPhoneNumber(customerPhone)) {
            errs.push({ field: 'phone', label: 'WhatsApp Number', message: 'Enter a valid 10-digit mobile number' });
        }

        if (isEmailEmpty) {
            errs.push({ field: 'email', label: 'Email Address', message: 'Email address is mandatory for official pass' });
        } else if (clientCheck && !clientCheck.isValid) {
            errs.push({ field: 'email', label: 'Email Address', message: clientCheck.message || 'Invalid email format' });
        } else if (isEmailDnsInvalid) {
            errs.push({ field: 'email', label: 'Email Address', message: liveCheckStatus.message || 'Mail server not reachable' });
        }
        return errs;
    };

    // Proceed to Step 4 (Payment) with full custom UI validation
    const onProceedToPayment = () => {
        const errs = collectErrors();
        if (errs.length > 0) {
            setHasSubmitted(true);
            setTouched({ name: true, phone: true, email: true });
            setPopupErrors(errs);
            setValidationError(errs.map(e => e.message).join(' · '));
            focusField(errs[0].field);
            return;
        }
        setPopupErrors([]);
        setValidationError('');
        handleStep3Next();
    };

    // Direct WhatsApp Concierge submit with custom validation
    const onWhatsAppSubmit = () => {
        const errs = [];
        if (isNameInvalid) {
            errs.push({ field: 'name', label: 'Full Name', message: 'Full Name is required for WhatsApp reservation' });
        }
        if (isPhoneInvalid) {
            errs.push({ field: 'phone', label: 'WhatsApp Number', message: 'Valid 10-digit WhatsApp number is required' });
        }
        if (errs.length > 0) {
            setHasSubmitted(true);
            setTouched(prev => ({ ...prev, name: true, phone: true }));
            setPopupErrors(errs);
            setValidationError(errs.map(e => e.message).join(' · '));
            focusField(errs[0].field);
            return;
        }
        setPopupErrors([]);
        setValidationError('');
        if (handleDirectWhatsAppBooking) {
            handleDirectWhatsAppBooking();
        }
    };

    return (
        <div>
            {/* ── CUSTOM LIVE ERROR POP-UP / ALERT CARD ── */}
            {popupErrors.length > 0 && (
                <BookingValidationPopup
                    errors={popupErrors}
                    title="Required Details Incomplete"
                    onClose={() => setPopupErrors([])}
                    onFocusField={focusField}
                />
            )}

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                        Lead Explorer Contact & Expedition Preferences
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#DC2626' }}>
                        * Required Fields Marked in Red
                    </span>
                </div>
                
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input
                        type="text"
                        tabIndex="-1"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px', marginBottom: '16px' }}>
                    
                    {/* 1. FULL NAME */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label 
                                htmlFor="booking-field-name" 
                                style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '800', 
                                    color: isNameError ? '#DC2626' : '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <User size={13} color={isNameError ? '#DC2626' : '#166534'} />
                                <span>Full Name *</span>
                            </label>
                            {isNameError ? (
                                <span style={{ color: '#DC2626', fontSize: '10.5px', fontWeight: '800' }}>⚠️ Missing</span>
                            ) : (
                                customerName.trim().length >= 2 && <span style={{ color: '#166534', fontSize: '10.5px', fontWeight: '800' }}>✓ Valid</span>
                            )}
                        </div>
                        <input
                            id="booking-field-name"
                            ref={nameInputRef}
                            type="text"
                            className={`booking-modal-input ${isNameError ? 'is-invalid' : (customerName.trim().length >= 2 ? 'is-valid' : '')}`}
                            placeholder="e.g. Anand Kumar"
                            value={customerName}
                            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                            onChange={(e) => { 
                                setCustomerName(e.target.value); 
                                if (e.target.value.trim().length >= 2) {
                                    setPopupErrors(prev => prev.filter(item => item.field !== 'name'));
                                    setValidationError('');
                                }
                            }}
                            aria-invalid={isNameError ? "true" : "false"}
                            required
                        />
                        {isNameError && (
                            <div className="custom-field-error-pill">
                                <AlertCircle size={13} />
                                <span>{isNameEmpty ? 'Full Name is required as per government ID' : 'Name must be at least 2 letters'}</span>
                            </div>
                        )}
                    </div>

                    {/* 2. WHATSAPP PHONE */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label 
                                htmlFor="booking-field-phone"
                                style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '800', 
                                    color: isPhoneError ? '#DC2626' : '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Phone size={13} color={isPhoneError ? '#DC2626' : '#166534'} />
                                <span>WhatsApp Phone *</span>
                            </label>
                            {isPhoneError ? (
                                <span style={{ color: '#DC2626', fontSize: '10.5px', fontWeight: '800' }}>⚠️ Invalid</span>
                            ) : (
                                customerPhone.trim() && isValidPhoneNumber(customerPhone) && (
                                    <span style={{ color: '#166534', fontSize: '10.5px', fontWeight: '800' }}>✓ Valid</span>
                                )
                            )}
                        </div>
                        <input
                            id="booking-field-phone"
                            ref={phoneInputRef}
                            type="tel"
                            className={`booking-modal-input ${isPhoneError ? 'is-invalid' : (customerPhone.trim() && isValidPhoneNumber(customerPhone) ? 'is-valid' : '')}`}
                            placeholder="e.g. 94001 23456"
                            value={customerPhone}
                            onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                            onChange={(e) => { 
                                setCustomerPhone(e.target.value); 
                                if (isValidPhoneNumber(e.target.value)) {
                                    setPopupErrors(prev => prev.filter(item => item.field !== 'phone'));
                                    setValidationError('');
                                }
                            }}
                            aria-invalid={isPhoneError ? "true" : "false"}
                            required
                        />
                        {isPhoneError && (
                            <div className="custom-field-error-pill">
                                <AlertCircle size={13} />
                                <span>{isPhoneEmpty ? 'WhatsApp number is required for booking voucher' : 'Please enter a valid 10-digit mobile number'}</span>
                            </div>
                        )}
                    </div>

                    {/* 3. EMAIL ADDRESS */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label 
                                htmlFor="booking-field-email"
                                style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '800', 
                                    color: isEmailError ? '#DC2626' : '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Mail size={13} color={isEmailError ? '#DC2626' : '#166534'} />
                                <span>Email Address *</span>
                            </label>
                            {isEmailError ? (
                                <span style={{ color: '#DC2626', fontSize: '10.5px', fontWeight: '800' }}>⚠️ Missing / Invalid</span>
                            ) : (
                                isEmailVerified && <span style={{ color: '#166534', fontSize: '10.5px', fontWeight: '800' }}>✓ Verified</span>
                            )}
                        </div>
                        <input
                            id="booking-field-email"
                            ref={emailInputRef}
                            type="email"
                            className={`booking-modal-input ${isEmailError ? 'is-invalid' : (isEmailVerified ? 'is-valid' : '')}`}
                            placeholder="e.g. anand@gmail.com"
                            value={customerEmail}
                            onChange={(e) => { 
                                setCustomerEmail(e.target.value); 
                                setValidationError('');
                                if (e.target.value.includes('@') && e.target.value.includes('.')) {
                                    setPopupErrors(prev => prev.filter(item => item.field !== 'email'));
                                }
                            }}
                            onBlur={() => {
                                setEmailTouched(true);
                                setTouched(prev => ({ ...prev, email: true }));
                            }}
                            aria-invalid={isEmailError ? "true" : "false"}
                            required
                        />

                        {isEmailError && (
                            <div className="custom-field-error-pill">
                                <AlertCircle size={13} />
                                <span>
                                    {isEmailEmpty
                                        ? 'Email is mandatory for official pass & QR entry pass'
                                        : (clientCheck?.message || (liveCheckStatus && !liveCheckStatus.isValid ? liveCheckStatus.message : 'Please enter a valid email address'))}
                                </span>
                            </div>
                        )}

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
                                            setPopupErrors(prev => prev.filter(item => item.field !== 'email'));
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

                        {isEmailVerified && !isEmailError && (
                            <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '800', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={12} />
                                <span>Live Verified Email · Official Pass will be delivered here</span>
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
                                    aria-label="Decrease vegetarian campers count"
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
                                    aria-label="Increase vegetarian campers count"
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
                                    aria-label="Decrease non-veg campers count"
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
                                    aria-label="Increase non-veg campers count"
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
                        Special Requests / Notes (Optional):
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
            <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                    style={{ background: '#F1F3EC', border: 'none', fontSize: '13px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 18px', borderRadius: '12px' }}
                >
                    ← Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={onWhatsAppSubmit}
                        title="Send reservation inquiry with your selected campsite, lodging, dates & details directly to WhatsApp Concierge"
                        style={{
                            padding: '12px 20px',
                            fontSize: '13.5px',
                            fontWeight: '800',
                            borderRadius: '12px',
                            background: '#25D366',
                            border: 'none',
                            color: '#0A2E14',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <WhatsAppIcon size={18} color="#0A2E14" />
                        <span>Enquire via WhatsApp</span>
                    </button>
                    <button
                        type="button"
                        onClick={onProceedToPayment}
                        className="btn-lime"
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '800',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <span>Proceed to Payment</span>
                        <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
