"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSecurityHeaders } from '@/lib/securityClient';
import { getAllCamps, INITIAL_ALL_CAMPS } from '../lib/campsData';
import { inr, generateBookingId, getDefaultUpcomingBatch } from '../lib/utils';
import { waLink, isValidPhoneNumber } from '../lib/whatsapp';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { getPaymentSettings } from '../lib/paymentSettings';
import { loadDiscountsFromStorage, applyDiscounts } from '../lib/discountsCore';
import ErrorBoundary from './ErrorBoundary';

// Submodules
import { ROW_GAP_10, parseRoomCapacity, ADDONS_LIST } from './booking/BookingConstants';
import BookingWizardHeader from './booking/BookingWizardHeader';
import Step1CampsiteLodging from './booking/Step1CampsiteLodging';
import Step2AddonsActivities from './booking/Step2AddonsActivities';
import Step3CamperContact from './booking/Step3CamperContact';
import Step4PaymentGateway from './booking/Step4PaymentGateway';
import Step5ConfirmationPass from './booking/Step5ConfirmationPass';

export { parseRoomCapacity };

function BookingEngineModalInner({ 
    isOpen, 
    onClose, 
    initialPackage, 
    initialRoom, 
    initialRoomId, 
    initialDate, 
    initialGuests = 2,
    initialAdults,
    initialChildren = 0,
    initialCustomUnits = null 
}) {
    const modalRef = useRef(null);
    useFocusTrap(isOpen, modalRef);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [campsList, setCampsList] = useState(INITIAL_ALL_CAMPS);
    const [discounts, setDiscounts] = useState(null);
    const [selectedPkgId, setSelectedPkgId] = useState('pkg-kolukkumalai');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [travelDate, setTravelDate] = useState(() => initialDate || getDefaultUpcomingBatch());
    const [adults, setAdults] = useState(initialAdults || (typeof initialGuests === 'number' ? Math.max(1, initialGuests) : 2));
    const [children, setChildren] = useState(initialChildren || 0);
    const [customUnits, setCustomUnits] = useState(initialCustomUnits || null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    
    // Explorer Details
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [dietaryChoice, setDietaryChoice] = useState('Standard Spicing');
    const [vegCount, setVegCount] = useState(1);
    const [nonVegCount, setNonVegCount] = useState(1);
    const [honeypot, setHoneypot] = useState('');
    
    // Step state: 1: Stay & Dates, 2: Add-Ons, 3: Explorer Details, 4: Payment, 5: Confirmed Voucher
    const [step, setStep] = useState(1);
    const [validationError, setValidationError] = useState('');
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Payment Options (Step 4) & Admin Dynamic Controls
    const [paymentSettings, setPaymentSettings] = useState(() => getPaymentSettings());
    const [paymentMode, setPaymentMode] = useState('advance'); // 'advance' (30%) | 'full' (100%)
    const [confirmedPass, setConfirmedPass] = useState(null);
    const payeeName = paymentSettings.payeeName || 'Aanandham Wilderness Stays';

    // Synchronize payment settings on custom event & modal open
    useEffect(() => {
        const syncSettings = () => setPaymentSettings(getPaymentSettings());
        syncSettings();
        window.addEventListener('aanandham_payment_settings_updated', syncSettings);
        return () => window.removeEventListener('aanandham_payment_settings_updated', syncSettings);
    }, [isOpen]);

    // Freeze background body scrolling while modal is open
    useEffect(() => {
        if (isOpen && typeof document !== 'undefined') {
            document.body.classList.add('booking-modal-open');
            document.documentElement.classList.add('booking-modal-open');
        } else if (typeof document !== 'undefined') {
            document.body.classList.remove('booking-modal-open');
            document.documentElement.classList.remove('booking-modal-open');
        }
        return () => {
            if (typeof document !== 'undefined') {
                document.body.classList.remove('booking-modal-open');
                document.documentElement.classList.remove('booking-modal-open');
            }
        };
    }, [isOpen]);

    // Load active camps list from localStorage / default data and live OpenPMS feed
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loaded = getAllCamps();
            if (loaded && loaded.length > 0) {
                setCampsList(loaded);
            }
            fetch('/api/admin/camps')
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setCampsList(data);
                    }
                })
                .catch(() => {});
        }
    }, [isOpen]);

    // Synchronize props whenever modal opens or initialPackage updates
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setValidationError('');
            setConfirmedPass(null);

            if (initialDate) {
                setTravelDate(initialDate);
            } else {
                setTravelDate(getDefaultUpcomingBatch());
            }

            if (initialAdults !== undefined) {
                setAdults(Math.max(1, initialAdults));
            } else if (initialGuests) {
                setAdults(Math.max(1, initialGuests));
            }
            if (initialChildren !== undefined) {
                setChildren(initialChildren);
            }

            if (initialCustomUnits !== undefined) {
                setCustomUnits(initialCustomUnits);
            } else {
                setCustomUnits(null);
            }

            const targetId = String(initialPackage?.id || (typeof initialPackage === 'string' ? initialPackage : '') || '');
            const targetTitle = String(initialPackage?.title || (typeof initialPackage === 'string' ? initialPackage : '') || '').toLowerCase();
            
            const matched = campsList.find(p => 
                p.id === targetId || 
                p.id === `pkg-${targetId}` ||
                p.id.replace('pkg-', '') === targetId.replace('pkg-', '') ||
                p.title.toLowerCase() === targetTitle ||
                (targetTitle && p.title.toLowerCase().includes(targetTitle.slice(0, 12))) ||
                (targetTitle && targetTitle.includes(p.title.toLowerCase().slice(0, 12)))
            );

            const activeId = matched ? matched.id : (initialPackage?.id || campsList[0]?.id || 'pkg-kolukkumalai');
            setSelectedPkgId(activeId);

            const activePkg = matched || initialPackage || campsList.find(p => p.id === activeId) || campsList[0];
            const targetRoomName = String(typeof initialRoom === 'string' ? initialRoom : initialRoom?.name || '').toLowerCase();
            const targetRoomId = String(typeof initialRoomId === 'string' ? initialRoomId : initialRoom?.id || '').toLowerCase();

            const roomsAvailable = activePkg?.rooms || initialPackage?.rooms || [];
            if (roomsAvailable.length > 0) {
                const roomMatch = roomsAvailable.find(r => 
                    (targetRoomId && r.id?.toLowerCase() === targetRoomId) ||
                    (targetRoomName && r.name?.toLowerCase() === targetRoomName) ||
                    (targetRoomName && r.name?.toLowerCase().includes(targetRoomName)) ||
                    (targetRoomName && targetRoomName.includes(r.name?.toLowerCase()))
                );
                setSelectedRoomId(roomMatch ? roomMatch.id : roomsAvailable[0].id);
            }
        }
    }, [isOpen, initialPackage, initialRoom, initialRoomId, initialDate, initialGuests, initialAdults, initialChildren, initialCustomUnits, campsList]);

    // Re-synchronize selected room if package changes
    const selectedPkg = useMemo(() => {
        if (initialPackage && typeof initialPackage === 'object' && (initialPackage.id === selectedPkgId || !selectedPkgId)) {
            return initialPackage;
        }
        return campsList.find(p => p.id === selectedPkgId) || initialPackage || campsList[0] || INITIAL_ALL_CAMPS[0];
    }, [campsList, selectedPkgId, initialPackage]);

    const selectedRoom = useMemo(() => {
        const availableRooms = selectedPkg?.rooms || initialPackage?.rooms || [];
        if (!availableRooms.length) {
            return initialRoom || {
                id: 'standard-tent',
                name: 'Standard Geodesic Tent',
                price: Number(selectedPkg?.price || initialPackage?.price || 2499),
                capacity: '2 Adults'
            };
        }
        return availableRooms.find(r => r.id === selectedRoomId) || initialRoom || availableRooms[0];
    }, [selectedPkg, initialPackage, selectedRoomId, initialRoom]);

    // Load active discounts on open
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            const rawDiscounts = loadDiscountsFromStorage();
            setDiscounts(rawDiscounts);
        }
    }, [isOpen]);

    // Headcount math
    const totalGuests = Math.max(1, (Number(adults) || 1) + (Number(children) || 0));
    const roomCapacity = selectedRoom ? parseRoomCapacity(selectedRoom.capacity) : 2;
    const autoRequiredUnits = Math.max(1, Math.ceil(adults / roomCapacity));
    const totalUnits = customUnits !== null ? customUnits : autoRequiredUnits;
    const totalRoomCapacity = totalUnits * roomCapacity;

    // Pricing calculation — guaranteed non-zero, server-matched per-person calculation
    const baseLodgingAmount = useMemo(() => {
        const ratePerPerson = Number(
            selectedRoom?.price || 
            selectedRoom?.basePrice || 
            selectedRoom?.pricePerPerson || 
            selectedPkg?.price || 
            selectedPkg?.basePrice || 
            initialRoom?.price ||
            initialPackage?.price ||
            2499
        );
        const adultCount = Math.max(1, Number(adults) || 1);
        const childCount = Math.max(0, Number(children) || 0);
        return (ratePerPerson * adultCount) + Math.round(ratePerPerson * 0.5 * childCount);
    }, [selectedRoom, selectedPkg, initialRoom, initialPackage, adults, children]);

    const addonsAmount = useMemo(() => {
        return selectedAddons.reduce((sum, addonId) => {
            const addon = ADDONS_LIST.find(a => a.id === addonId);
            if (!addon) return sum;
            return sum + (addon.perPerson ? addon.price * adults : addon.price);
        }, 0);
    }, [selectedAddons, adults]);

    const rawTotal = Math.max(0, baseLodgingAmount + addonsAmount);

    const discountSummary = useMemo(() => {
        try {
            return applyDiscounts({
                baseTotal: rawTotal,
                guests: totalGuests,
                campsiteId: selectedPkgId,
                discounts
            });
        } catch (e) {
            return { discountedTotal: rawTotal, discountAmount: 0 };
        }
    }, [rawTotal, discounts, totalGuests, selectedPkgId]);

    const totalAmount = Math.max(100, Number(discountSummary?.discountedTotal ?? rawTotal) || Number(rawTotal) || 2499);
    const advanceAmount = Math.round(totalAmount * 0.3);
    const balanceAmount = Math.max(0, totalAmount - advanceAmount);

    const currentStepPrice = useMemo(() => {
        if (step === 1) return baseLodgingAmount;
        return totalAmount;
    }, [step, baseLodgingAmount, totalAmount]);

    const toggleAddon = (addonId) => {
        setSelectedAddons(prev => 
            prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
        );
    };

    const handleStep1Next = () => {
        setValidationError('');
        if (!travelDate) {
            setValidationError('Please select your preferred stay dates / batch.');
            return;
        }
        setStep(2);
    };

    const isValidEmailAddress = (email) => {
        if (!email || typeof email !== 'string') return false;
        const trimmed = email.trim().toLowerCase();
        if (trimmed.length < 6 || trimmed.length > 254) return false;
        if (/\s/.test(trimmed)) return false;
        if (trimmed.includes('..')) return false;
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
        return regex.test(trimmed);
    };

    const handleStep3Next = () => {
        setValidationError('');
        if (!customerName.trim()) {
            setValidationError('Please enter your full name as on government ID.');
            return;
        }
        if (!customerPhone.trim() || !isValidPhoneNumber(customerPhone)) {
            setValidationError('Please enter a valid 10-digit mobile / WhatsApp number.');
            return;
        }
        if (!customerEmail.trim()) {
            setValidationError('Email address is mandatory. Please enter your email to receive your official digital pass.');
            return;
        }
        if (!isValidEmailAddress(customerEmail)) {
            setValidationError('Invalid email format. Please enter a valid email address with domain (e.g. yourname@gmail.com).');
            return;
        }
        setStep(4);
    };

    // Razorpay Checkout
    const handleRazorpayCheckout = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setValidationError('');

        try {
            const amountToCharge = paymentMode === 'advance' ? advanceAmount : totalAmount;
            
            const orderRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getSecurityHeaders()
                },
                body: JSON.stringify({
                    name: customerName.trim(),
                    phone: customerPhone.trim(),
                    email: customerEmail.trim(),
                    package: selectedPkg.title,
                    campsiteId: selectedPkg.id,
                    dates: travelDate,
                    guests: totalGuests,
                    adults,
                    children,
                    roomType: selectedRoom?.name || 'Standard Tent',
                    addons: selectedAddons,
                    total: totalAmount,
                    paidAmount: amountToCharge,
                    balanceDue: totalAmount - amountToCharge,
                    paymentMode: paymentMode === 'advance' ? 'Advance 30% via Razorpay' : 'Full 100% via Razorpay',
                    dietaryChoice,
                    vegCount,
                    nonVegCount,
                    notes: specialNotes,
                    honeypot,
                    paymentGateway: 'razorpay'
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok || !orderData.success) {
                throw new Error(orderData.message || 'Failed to initialize payment gateway.');
            }

            const rzpOrder = orderData.order || orderData.razorpayOrder || {};
            const orderKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId || orderData.razorpayKeyId || 'rzp_test_placeholder';
            const bookingRefId = orderData.bookingId || orderData.booking?.id;

            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    if (window.Razorpay) return resolve();
                    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
                    if (existing) {
                        existing.addEventListener('load', () => resolve());
                        existing.addEventListener('error', () => reject(new Error('Razorpay SDK failed to load. Please check your network or try WhatsApp Enquire.')));
                        setTimeout(() => {
                            if (window.Razorpay) resolve();
                            else reject(new Error('Razorpay SDK connection timed out. Please check if an ad-blocker is blocking checkout.razorpay.com, or use WhatsApp Enquire.'));
                        }, 3500);
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Razorpay payment SDK. Please ensure ad-blockers are disabled for checkout, or use WhatsApp Enquire.'));
                    document.body.appendChild(script);
                });
            }

            const cleanPhone = String(customerPhone || '').replace(/\D/g, '').slice(-10) || '9847011223';
            const options = {
                key: orderKey,
                amount: rzpOrder.amount || Math.round(amountToCharge * 100),
                currency: rzpOrder.currency || 'INR',
                name: paymentSettings.payeeName || 'Aanandham Wilderness Stays',
                description: `${selectedPkg.title} - ${selectedRoom?.name || 'Camp Booking'}`,
                image: typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://www.aanandham.in/logo.png' : undefined,
                order_id: rzpOrder.id,
                prefill: {
                    name: customerName?.trim() || 'Wilderness Explorer',
                    email: customerEmail?.trim() || 'camper@aanandham.in',
                    contact: cleanPhone
                },
                theme: {
                    color: '#166534'
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                ...getSecurityHeaders()
                            },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id || rzpOrder.id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                razorpay_order_id: response.razorpay_order_id || rzpOrder.id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: bookingRefId
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            setConfirmedPass({
                                ...(orderData.booking || {}),
                                id: bookingRefId,
                                name: customerName,
                                phone: customerPhone,
                                email: customerEmail,
                                package: selectedPkg.title,
                                dates: travelDate,
                                guests: totalGuests,
                                roomType: selectedRoom?.name,
                                status: 'Confirmed',
                                isPaid: true,
                                paymentId: response.razorpay_payment_id,
                                paidAmount: amountToCharge,
                                balanceDue: totalAmount - amountToCharge
                            });
                            setStep(5);
                        } else {
                            setValidationError(verifyData.message || 'Payment signature verification failed. Please contact our support.');
                        }
                    } catch (err) {
                        setValidationError('Verification error. Please contact WhatsApp concierge.');
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    backdropclose: true,
                    escape: true,
                    animation: true,
                    ondismiss: function() {
                        setIsSubmitting(false);
                        setValidationError('Payment window was closed. Your campsite permit & booking details are preserved. Click "Pay Securely" to retry, or use "WhatsApp Enquire" below.');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setValidationError(response?.error?.description || 'Payment transaction was declined or cancelled.');
                setIsSubmitting(false);
            });
            rzp.open();

        } catch (err) {
            setValidationError(err.message || 'An unexpected error occurred.');
            setIsSubmitting(false);
        }
    };

    // Direct WhatsApp Concierge Booking with Comprehensive Inquiry
    const handleDirectWhatsAppBooking = () => {
        const amountToPayNow = paymentMode === 'advance' ? advanceAmount : totalAmount;
        const balDue = paymentMode === 'advance' ? balanceAmount : 0;
        const addonsListText = selectedAddons && selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None';
        const cleanDates = String(travelDate || '').replace(/–/g, '-');

        const msg = `*🏕️ Campsite Booking & Permit Inquiry - Aanandham Wilderness*

*Explorer Details:*
• *Name:* ${customerName.trim() || 'Wilderness Camper'}
• *Phone:* ${customerPhone.trim() || 'Not provided'}
${customerEmail.trim() ? `• *Email:* ${customerEmail.trim()}\n` : ''}
*Sanctuary & Stay:*
• *Campsite:* ${selectedPkg.title || selectedPkg.name}
• *Dates / Batch:* ${cleanDates}
• *Lodging:* ${selectedRoom?.name || 'Standard Tent'} (${totalUnits} unit(s))
• *Total Campers:* ${totalGuests} (${adults} Adults${children > 0 ? `, ${children} Children` : ''})

*Food & Add-ons:*
• *Meal Choice:* ${dietaryChoice} (${vegCount} Veg, ${nonVegCount} Non-Veg)
• *Add-Ons / Upgrades:* ${addonsListText}
${specialNotes?.trim() ? `• *Special Notes:* ${specialNotes.trim()}\n` : ''}
*Pricing & Payment Choice:*
• *Total Expedition Amount:* ₹${(totalAmount || 0).toLocaleString('en-IN')}
• *Selected Payment Choice:* ${paymentMode === 'advance' ? `30% Advance (₹${amountToPayNow.toLocaleString('en-IN')} advance, ₹${balDue.toLocaleString('en-IN')} balance on arrival)` : `100% Full Payment (₹${totalAmount.toLocaleString('en-IN')})`}

_Hi Aanandham Basecamp Concierge! Please check availability and confirm permit details for our expedition._`;

        // Log inquiry into CRM Pipeline in background
        try {
            fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName.trim() || 'Wilderness Camper',
                    phone: customerPhone.trim() || 'Not provided',
                    email: customerEmail.trim() || '',
                    inquiryType: 'WhatsApp Concierge Inquiry',
                    guests: totalGuests,
                    travelDates: cleanDates,
                    campsiteId: selectedPkgId,
                    message: `Lodging: ${selectedRoom?.name || 'Standard Tent'} (${totalUnits} units) | Meals: ${dietaryChoice} (${vegCount}V/${nonVegCount}NV) | Total: ₹${totalAmount} | ${addonsListText !== 'None' ? `Addons: ${addonsListText}` : ''}`,
                    source: 'Booking Engine (WhatsApp Direct)',
                    tenantId: 't-aanandham-hq',
                    status: 'NEW_LEAD'
                })
            }).catch(() => {});
        } catch (e) {}

        window.open(waLink(msg, paymentSettings.phone || '919074858014'), '_blank');
    };

    const handleSharePassToWhatsApp = () => {
        if (!confirmedPass) return;
        const msg = `*✅ Wilderness Permit Voucher*

*Permit ID:* ${confirmedPass.id}
*Guest:* ${confirmedPass.name}
*Campsite:* ${confirmedPass.package}
*Stay Dates:* ${confirmedPass.dates}
*Status:* ${confirmedPass.status}
*Total Amount:* ₹${(confirmedPass.total || 0).toLocaleString('en-IN')}
*Pass Portal:* ${typeof window !== 'undefined' ? window.location.origin : ''}/pass/${confirmedPass.id}`;
        window.open(waLink(msg, paymentSettings.phone || '919074858014'), '_blank');
    };

    if (!isOpen || !mounted || typeof document === 'undefined' || !document.body) return null;

    return createPortal(
        <div
            className="booking-modal-overlay"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: 'rgba(10, 15, 12, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '820px',
                    maxHeight: '92vh',
                    borderRadius: '24px',
                    background: '#FFFFFF',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                {/* Header & Step Tracker */}
                <BookingWizardHeader
                    step={step}
                    setStep={setStep}
                    confirmedPass={confirmedPass}
                    validationError={validationError}
                    onClose={onClose}
                />

                {/* Content Container */}
                <div
                    className="booking-modal-body booking-modal-scroll"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-y',
                        padding: '24px'
                    }}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {step === 1 && (
                        <Step1CampsiteLodging
                            campsList={campsList}
                            selectedPkgId={selectedPkgId}
                            setSelectedPkgId={setSelectedPkgId}
                            customUnits={customUnits}
                            setCustomUnits={setCustomUnits}
                            selectedRoomId={selectedRoomId}
                            setSelectedRoomId={setSelectedRoomId}
                            selectedPkg={selectedPkg}
                            travelDate={travelDate}
                            setTravelDate={setTravelDate}
                            adults={adults}
                            setAdults={setAdults}
                            children={children}
                            setChildren={setChildren}
                            totalGuests={totalGuests}
                            selectedRoom={selectedRoom}
                            autoRequiredUnits={autoRequiredUnits}
                            totalUnits={totalUnits}
                            totalRoomCapacity={totalRoomCapacity}
                            currentStepPrice={currentStepPrice}
                            handleStep1Next={handleStep1Next}
                            discountLabel={discountSummary?.appliedDiscounts?.[0]?.name || discountSummary?.label || ''}
                            setValidationError={setValidationError}
                        />
                    )}

                    {step === 2 && (
                        <Step2AddonsActivities
                            selectedAddons={selectedAddons}
                            toggleAddon={toggleAddon}
                            adults={adults}
                            children={children}
                            totalGuests={totalGuests}
                            currentStepPrice={currentStepPrice}
                            selectedPkg={selectedPkg}
                            selectedRoom={selectedRoom}
                            baseLodgingAmount={baseLodgingAmount}
                            addonsAmount={addonsAmount}
                            totalAmount={totalAmount}
                            discountSummary={discountSummary}
                            discountLabel={discountSummary?.appliedDiscounts?.[0]?.name || discountSummary?.label || ''}
                            setStep={setStep}
                        />
                    )}

                    {step === 3 && (
                        <Step3CamperContact
                            customerName={customerName}
                            setCustomerName={setCustomerName}
                            customerPhone={customerPhone}
                            setCustomerPhone={setCustomerPhone}
                            customerEmail={customerEmail}
                            setCustomerEmail={setCustomerEmail}
                            specialNotes={specialNotes}
                            setSpecialNotes={setSpecialNotes}
                            dietaryChoice={dietaryChoice}
                            setDietaryChoice={setDietaryChoice}
                            vegCount={vegCount}
                            setVegCount={setVegCount}
                            nonVegCount={nonVegCount}
                            setNonVegCount={setNonVegCount}
                            adults={adults}
                            children={children}
                            totalGuests={totalGuests}
                            currentStepPrice={currentStepPrice}
                            honeypot={honeypot}
                            setHoneypot={setHoneypot}
                            handleStep3Next={handleStep3Next}
                            handleDirectWhatsAppBooking={handleDirectWhatsAppBooking}
                            setStep={setStep}
                            setValidationError={setValidationError}
                        />
                    )}

                    {step === 4 && (
                        <Step4PaymentGateway
                            selectedPkg={selectedPkg}
                            selectedRoom={selectedRoom}
                            travelDate={travelDate}
                            adults={adults}
                            children={children}
                            totalGuests={totalGuests}
                            totalUnits={totalUnits}
                            dietaryChoice={dietaryChoice}
                            vegCount={vegCount}
                            nonVegCount={nonVegCount}
                            selectedAddons={selectedAddons}
                            discounts={discounts}
                            baseLodgingAmount={baseLodgingAmount}
                            addonsAmount={addonsAmount}
                            totalAmount={totalAmount}
                            advanceAmount={advanceAmount}
                            balanceAmount={balanceAmount}
                            paymentMode={paymentMode}
                            setPaymentMode={setPaymentMode}
                            paymentSettings={paymentSettings}
                            payeeName={payeeName}
                            isSubmitting={isSubmitting}
                            validationError={validationError}
                            handleRazorpayCheckout={handleRazorpayCheckout}
                            handleDirectWhatsAppBooking={handleDirectWhatsAppBooking}
                            setStep={setStep}
                        />
                    )}

                    {step === 5 && confirmedPass && (
                        <Step5ConfirmationPass
                            confirmedPass={confirmedPass}
                            handleSharePassToWhatsApp={handleSharePassToWhatsApp}
                            onClose={onClose}
                        />
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}

export default function BookingEngineModal(props) {
    if (!props.isOpen) return null;
    return (
        <ErrorBoundary
            title="Reservation Wizard Glitch"
            description="The booking wizard encountered an unexpected display issue. Please retry or contact our reservation concierge."
            onReset={props.onClose}
        >
            <BookingEngineModalInner {...props} />
        </ErrorBoundary>
    );
}
