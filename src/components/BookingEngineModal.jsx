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

    // Load active camps list from localStorage / default data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loaded = getAllCamps();
            if (loaded && loaded.length > 0) {
                setCampsList(loaded);
            }
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

            const activeId = matched ? matched.id : (campsList[0]?.id || 'pkg-kolukkumalai');
            setSelectedPkgId(activeId);

            const activePkg = campsList.find(p => p.id === activeId) || campsList[0];
            const targetRoomName = String(typeof initialRoom === 'string' ? initialRoom : initialRoom?.name || '').toLowerCase();
            const targetRoomId = String(typeof initialRoomId === 'string' ? initialRoomId : initialRoom?.id || '').toLowerCase();

            if (activePkg?.rooms?.length > 0) {
                const roomMatch = activePkg.rooms.find(r => 
                    (targetRoomId && r.id.toLowerCase() === targetRoomId) ||
                    (targetRoomName && r.name.toLowerCase() === targetRoomName) ||
                    (targetRoomName && r.name.toLowerCase().includes(targetRoomName)) ||
                    (targetRoomName && targetRoomName.includes(r.name.toLowerCase()))
                );
                setSelectedRoomId(roomMatch ? roomMatch.id : activePkg.rooms[0].id);
            }
        }
    }, [isOpen, initialPackage, initialRoom, initialRoomId, initialDate, initialGuests, initialAdults, initialChildren, initialCustomUnits, campsList]);

    // Re-synchronize selected room if package changes
    const selectedPkg = useMemo(() => {
        return campsList.find(p => p.id === selectedPkgId) || campsList[0] || INITIAL_ALL_CAMPS[0];
    }, [campsList, selectedPkgId]);

    const selectedRoom = useMemo(() => {
        if (!selectedPkg?.rooms?.length) return null;
        return selectedPkg.rooms.find(r => r.id === selectedRoomId) || selectedPkg.rooms[0];
    }, [selectedPkg, selectedRoomId]);

    // Load active discounts on open
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            const rawDiscounts = loadDiscountsFromStorage();
            setDiscounts(rawDiscounts);
        }
    }, [isOpen]);

    // Headcount math
    const totalGuests = adults + children;
    const roomCapacity = selectedRoom ? parseRoomCapacity(selectedRoom.capacity) : 2;
    const autoRequiredUnits = Math.max(1, Math.ceil(adults / roomCapacity));
    const totalUnits = customUnits !== null ? customUnits : autoRequiredUnits;
    const totalRoomCapacity = totalUnits * roomCapacity;

    // Pricing calculation
    const baseLodgingAmount = useMemo(() => {
        if (!selectedRoom) return 0;
        const rate = selectedRoom.price || 0;
        return rate * totalUnits;
    }, [selectedRoom, totalUnits]);

    const addonsAmount = useMemo(() => {
        return selectedAddons.reduce((sum, addonId) => {
            const addon = ADDONS_LIST.find(a => a.id === addonId);
            if (!addon) return sum;
            return sum + (addon.perPerson ? addon.price * adults : addon.price);
        }, 0);
    }, [selectedAddons, adults]);

    const rawTotal = baseLodgingAmount + addonsAmount;

    const discountSummary = useMemo(() => {
        return applyDiscounts(rawTotal, discounts, {
            stayDate: travelDate,
            partySize: totalGuests,
            campId: selectedPkgId,
            advancePayment: paymentMode === 'advance'
        });
    }, [rawTotal, discounts, travelDate, totalGuests, selectedPkgId, paymentMode]);

    const totalAmount = discountSummary.finalTotal;
    const advanceAmount = Math.round(totalAmount * 0.3);
    const balanceAmount = totalAmount - advanceAmount;

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
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                document.body.appendChild(script);
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load Razorpay payment SDK.'));
                });
            }

            const options = {
                key: orderKey,
                amount: rzpOrder.amount || Math.round(amountToCharge * 100),
                currency: rzpOrder.currency || 'INR',
                name: paymentSettings.payeeName || 'Aanandham Wilderness Stays',
                description: `${selectedPkg.title} - ${selectedRoom?.name || 'Camp Booking'}`,
                image: '/icon.png',
                order_id: rzpOrder.id,
                prefill: {
                    name: customerName,
                    email: customerEmail || 'guest@aanandham.in',
                    contact: customerPhone
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
                                paymentId: response.razorpay_payment_id,
                                paidAmount: amountToCharge,
                                balanceDue: totalAmount - amountToCharge
                            });
                            setStep(5);
                        } else {
                            setValidationError('Payment signature verification failed. Please contact our support.');
                        }
                    } catch (err) {
                        setValidationError('Verification error. Please contact WhatsApp concierge.');
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: function() {
                        setIsSubmitting(false);
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

    // Direct WhatsApp Concierge Booking
    const handleDirectWhatsAppBooking = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setValidationError('');

        try {
            const bookingRes = await fetch('/api/bookings', {
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
                    paidAmount: 0,
                    balanceDue: totalAmount,
                    paymentMode: 'Direct UPI / Concierge Confirmation',
                    dietaryChoice,
                    vegCount,
                    nonVegCount,
                    notes: specialNotes,
                    honeypot,
                    paymentGateway: 'concierge'
                })
            });

            const bookingData = await bookingRes.json();
            if (bookingRes.ok && bookingData.success) {
                const passData = {
                    id: bookingData.booking?.id || generateBookingId(),
                    name: customerName,
                    phone: customerPhone,
                    package: selectedPkg.title,
                    dates: travelDate,
                    guests: totalGuests,
                    roomType: selectedRoom?.name || 'Standard Tent',
                    total: totalAmount,
                    paidAmount: 0,
                    balanceDue: totalAmount,
                    status: 'Pending Verification'
                };
                setConfirmedPass(passData);
                setStep(5);

                const msg = `*🏕️ New Booking Request - Aanandham Wilderness*

*Booking ID:* ${passData.id}
*Guest:* ${customerName}
*Phone:* ${customerPhone}
*Sanctuary:* ${selectedPkg.title}
*Stay Dates:* ${travelDate}
*Camper Count:* ${totalGuests} (${adults} Adults, ${children} Kids)
*Lodging:* ${selectedRoom?.name || 'Standard Tent'} (${totalUnits} unit(s))
*Dietary:* ${dietaryChoice} (${vegCount} Veg, ${nonVegCount} Non-Veg)
*Total:* ₹${totalAmount.toLocaleString('en-IN')}

_Please confirm my permit slot and send payment details._`;
                window.open(waLink(paymentSettings.phone || '919188685831', msg), '_blank');
            } else {
                setValidationError(bookingData.message || 'Failed to submit reservation.');
            }
        } catch (err) {
            setValidationError('Network error. Please try again or WhatsApp directly.');
        } finally {
            setIsSubmitting(false);
        }
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
        window.open(waLink(paymentSettings.phone || '919188685831', msg), '_blank');
    };

    if (!isOpen || !mounted || typeof document === 'undefined' || !document.body) return null;

    return createPortal(
        <div
            className="booking-modal-overlay"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100025,
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
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {step === 1 && (
                        <Step1CampsiteLodging
                            campsList={campsList}
                            selectedPkgId={selectedPkgId}
                            setSelectedPkgId={setSelectedPkgId}
                            setCustomUnits={setCustomUnits}
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
                        />
                    )}

                    {step === 2 && (
                        <Step2AddonsActivities
                            selectedAddons={selectedAddons}
                            toggleAddon={toggleAddon}
                            adults={adults}
                            currentStepPrice={currentStepPrice}
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
                            currentStepPrice={currentStepPrice}
                            honeypot={honeypot}
                            setHoneypot={setHoneypot}
                            handleStep3Next={handleStep3Next}
                            setStep={setStep}
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
