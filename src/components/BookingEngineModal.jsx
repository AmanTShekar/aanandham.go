"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

const ROW_GAP_10 = { display: 'flex', alignItems: 'center', gap: '10px' };

import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';
import CustomDateBatchPicker from './CustomDateBatchPicker';
import LucideAmenityIcon from './common/LucideAmenityIcon';
import { getSecurityHeaders } from '@/lib/securityClient';
import { 
    Check, 
    Users, 
    Tent, 
    Sparkles, 
    Plus, 
    Minus, 
    ShieldCheck, 
    QrCode, 
    ArrowRight, 
    ArrowLeft, 
    Download, 
    Share2, 
    Copy, 
    ExternalLink, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    Clock, 
    AlertCircle,
    Flame,
    Truck,
    Camera,
    PersonStanding,
    Music2,
    Utensils,
    Leaf,
    Drumstick,
    PartyPopper,
    Hourglass,
    Lock
} from 'lucide-react';
import { WhatsAppIcon } from './common/BrandIcons';
import { getAllCamps, INITIAL_ALL_CAMPS } from '../lib/campsData';
import { inr, generateBookingId, getDefaultUpcomingBatch } from '../lib/utils';
import { waLink, isValidPhoneNumber } from '../lib/whatsapp';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { getPaymentSettings } from '../lib/paymentSettings';
import { loadDiscountsFromStorage, applyDiscounts } from '../lib/discountsCore';

export function parseRoomCapacity(capacityStr) {
    if (!capacityStr) return 2;
    const match = String(capacityStr).match(/\d+/);
    return match ? Math.max(1, parseInt(match[0], 10)) : 2;
}

const ADDONS_LIST = [
    { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true, icon: Flame, desc: 'Marinated paneer/chicken skewers grilled live over wood coals' },
    { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false, icon: Truck, desc: 'Exclusive Mahindra 4x4 for your squad with summit sunrise stops' },
    { id: 'drone', name: '4K Drone Mountain Video Reel Shoot', price: 1500, perPerson: false, icon: Camera, desc: 'Cinematic aerial 4K video clips edited for your Instagram reels' },
    { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true, icon: PersonStanding, desc: 'Guided breathwork & stretching above cloud beds with local yogi' },
    { id: 'guitar', name: 'Acoustic Guitarist for Campfire Circle', price: 2000, perPerson: false, icon: Music2, desc: 'Live unplugged indie mountain tunes around the starlit fire' }
];

export default function BookingEngineModal({ 
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

            // 1. Sync Date
            if (initialDate) {
                setTravelDate(initialDate);
            } else {
                setTravelDate(getDefaultUpcomingBatch());
            }

            // 2. Sync Guests
            if (initialAdults !== undefined) {
                setAdults(Math.max(1, initialAdults));
            } else if (initialGuests) {
                setAdults(Math.max(1, initialGuests));
            }
            if (initialChildren !== undefined) {
                setChildren(initialChildren);
            }

            // 3. Sync Units
            if (initialCustomUnits !== undefined) {
                setCustomUnits(initialCustomUnits);
            } else {
                setCustomUnits(null);
            }

            // 4. Sync Package
            const targetId = initialPackage?.id || '';
            const targetTitle = (initialPackage?.title || '').toLowerCase();
            
            const matched = campsList.find(p => 
                p.id === targetId || 
                p.id === `pkg-${targetId}` ||
                p.id.replace('pkg-', '') === targetId.replace('pkg-', '') ||
                p.title.toLowerCase() === targetTitle ||
                p.title.toLowerCase().includes(targetTitle.slice(0, 12)) ||
                targetTitle.includes(p.title.toLowerCase().slice(0, 12))
            );

            const activeId = matched ? matched.id : (campsList[0]?.id || 'pkg-kolukkumalai');
            setSelectedPkgId(activeId);

            // 5. Sync Room
            const campObj = matched || campsList[0];
            const desiredRoomId = initialRoomId || initialRoom?.id;
            if (campObj && campObj.rooms && campObj.rooms.length > 0) {
                const roomMatch = desiredRoomId ? campObj.rooms.find(r => r.id === desiredRoomId) : null;
                setSelectedRoomId(roomMatch ? roomMatch.id : campObj.rooms[0].id);
            } else {
                setSelectedRoomId('default-room');
            }
        }
    }, [isOpen, initialPackage, initialRoom, initialRoomId, initialDate, initialGuests, initialAdults, initialChildren, initialCustomUnits, campsList]);

    // Load active discount campaigns (server authoritative, localStorage fallback)
    useEffect(() => {
        setDiscounts(loadDiscountsFromStorage());
        fetch('/api/discounts', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data && Array.isArray(data.discounts)) setDiscounts(data.discounts);
            })
            .catch(() => { /* keep localStorage fallback */ });
    }, []);

    // Current Package
    const currentPkg = useMemo(() => {
        return campsList.find(p => p.id === selectedPkgId) || campsList[0] || INITIAL_ALL_CAMPS[0];
    }, [campsList, selectedPkgId]);

    // Available Rooms
    const availableRooms = useMemo(() => {
        if (currentPkg?.rooms && currentPkg.rooms.length > 0) {
            return currentPkg.rooms;
        }
        return [
            {
                id: 'default-dome',
                name: 'Geodesic Panoramic Sky Dome',
                capacity: '2 Adults',
                price: currentPkg?.price || 2499,
                totalUnits: 6,
                isAvailable: true,
                image: currentPkg?.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
                features: ['360° Cloud Bed Vista', 'King Size Bed', 'En-suite Restroom', 'Thermal Blankets']
            },
            {
                id: 'default-tent',
                name: 'Weatherproof Alpine Ridge Tent',
                capacity: '2-4 Campers',
                price: Math.max(1299, Math.round((currentPkg?.price || 2499) * 0.75)),
                totalUnits: 12,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
                features: ['Waterproof Flysheet', 'Foam Bedding & Sleeping Bags', 'Modern Hot Washrooms']
            }
        ];
    }, [currentPkg]);

    // Ensure selectedRoomId is valid whenever availableRooms change
    useEffect(() => {
        if (availableRooms.length > 0) {
            const exists = availableRooms.some(r => r.id === selectedRoomId);
            if (!exists) {
                setSelectedRoomId(availableRooms[0].id);
                setCustomUnits(null);
            }
        }
    }, [availableRooms, selectedRoomId]);

    const currentRoom = useMemo(() => {
        return availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0];
    }, [availableRooms, selectedRoomId]);

    // Smart Allocation Calculations
    const totalGuests = adults + children;
    const roomCapacity = parseRoomCapacity(currentRoom?.capacity);
    const autoUnits = Math.max(1, Math.ceil(totalGuests / roomCapacity));
    const allocatedUnits = customUnits !== null ? customUnits : autoUnits;
    const totalMaxCapacity = allocatedUnits * roomCapacity;
    const isUnderCapacity = totalGuests > totalMaxCapacity;

    const roomPricePerPerson = currentRoom?.price || currentPkg?.price || 2499;
    const baseTotal = (roomPricePerPerson * adults) + (Math.round(roomPricePerPerson * 0.5) * children);
    
    // Discounts (admin-managed campaigns)
    const discount = applyDiscounts({ baseTotal, guests: totalGuests, campsiteId: currentPkg?.id, discounts });
    const discountPercent = discount.discountPercent;
    const discountAmount = discount.discountAmount;
    const discountLabel = discount.discountLabel;

    // Add-ons Total
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
        const addon = ADDONS_LIST.find(a => a.id === addonId);
        if (!addon) return acc;
        return acc + (addon.perPerson ? addon.price * totalGuests : addon.price);
    }, 0);

    const grandTotal = discount.discountedTotal + addonsTotal;
    const advanceAmount = Math.round(grandTotal * 0.3); // 30% advance deposit
    const payableNow = paymentMode === 'advance' ? advanceAmount : grandTotal;
    const balanceOnArrival = grandTotal - payableNow;

    // Auto-sync Veg / Non-Veg meal participant split with totalGuests
    useEffect(() => {
        if (vegCount + nonVegCount !== totalGuests) {
            const half = Math.floor(totalGuests / 2);
            setVegCount(half);
            setNonVegCount(totalGuests - half);
        }
    }, [totalGuests]);

    // ESC key handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            window.__lenis?.stop();
            const origOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                window.__lenis?.start();
                document.body.style.overflow = origOverflow || '';
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleAddon = (id) => {
        setSelectedAddons(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Step 1 Validation -> Step 2
    const handleProceedToStep2 = () => {
        if (!travelDate) {
            setValidationError('Please choose your tentative expedition date or weekend batch.');
            return;
        }
        setValidationError('');
        setStep(2);
    };

    // Step 2 Validation -> Step 3
    const handleProceedToStep3 = () => {
        setValidationError('');
        setStep(3);
    };

    // Step 3 Validation -> Step 4 (Payment)
    const handleProceedToStep4 = () => {
        if (!customerName.trim() || customerName.trim().length < 2) {
            setValidationError('Please enter your full name (at least 2 characters).');
            return;
        }
        if (!isValidPhoneNumber(customerPhone)) {
            setValidationError('Please enter a valid 10-digit mobile or WhatsApp number.');
            return;
        }
        if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
            setValidationError('Please enter a valid email address or leave blank.');
            return;
        }
        setValidationError('');
        setStep(4);
    };

    // Step 4 Live Gateway: Create Booking + Open Razorpay Checkout
    const loadRazorpayCheckoutScript = () => new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.Razorpay) return resolve();
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load payment checkout. Please retry.'));
        document.body.appendChild(s);
    });

    const handleRazorpayCheckout = async () => {
        if (honeypot && honeypot.trim().length > 0) {
            onClose();
            return;
        }

        if (isSubmitting) return;
        const now = Date.now();
        if (now - lastSubmitTime < 3000) return;
        setLastSubmitTime(now);

        setIsSubmitting(true);
        setValidationError('');

        const selectedAddonNames = selectedAddons.map(id => ADDONS_LIST.find(a => a.id === id)?.name).filter(Boolean);
        const datesString = travelDate || getDefaultUpcomingBatch();

        const passData = {
            id: generateBookingId(),
            name: customerName.trim(),
            phone: customerPhone.trim(),
            email: customerEmail.trim() || undefined,
            package: currentPkg.title,
            region: currentPkg.region || (currentPkg.location ? currentPkg.location.split(',')[0].trim() : 'Munnar'),
            location: currentPkg.location || 'Suryanelli, Munnar, Kerala',
            altitude: currentPkg.altitude || '7,900 FT',
            dates: datesString,
            guests: totalGuests,
            adults,
            children,
            roomType: `${allocatedUnits} × ${currentRoom ? currentRoom.name : 'Mountain Glamp'}`,
            addons: selectedAddonNames,
            total: grandTotal,
            paymentMode: paymentMode === 'advance' ? '30% Advance Deposit' : '100% Full Expedition Fare',
            paymentGateway: 'razorpay',
            dietaryChoice,
            vegCount,
            nonVegCount,
            mealSummary: `${vegCount} Veg + ${nonVegCount} Non-Veg BBQ (${dietaryChoice})`,
            notes: specialNotes.trim(),
            source: 'Direct Website Reservation',
            createdAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: await getSecurityHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(passData)
            });
            const resData = await res.json();
            if (!res.ok || !resData.success) {
                setValidationError(resData.message || 'Could not reserve your slot. Please retry.');
                setIsSubmitting(false);
                return;
            }

            const orderId = resData.razorpayOrder?.id;
            const keyId = resData.razorpayKeyId;
            const finalPass = { ...passData, id: resData.bookingId, total: grandTotal, paidAmount: payableNow, balanceDue: balanceOnArrival, status: 'Confirmed' };

            // Demo/dev mode (no Razorpay credentials configured): simulate payment
            if (!keyId || String(orderId).startsWith('order_dev_')) {
                await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId: resData.bookingId, orderId: orderId || `order_dev_${Date.now()}`, paymentId: `pay_demo_${Date.now()}`, signature: 'demo' })
                });
                setConfirmedPass(finalPass);
                setIsSubmitting(false);
                setStep(5);
                return;
            }

            // Live mode: open the Razorpay checkout
            await loadRazorpayCheckoutScript();
            const options = {
                key: keyId,
                amount: resData.razorpayOrder.amount,
                currency: resData.razorpayOrder.currency || 'INR',
                name: 'Aanandham.go Wilderness Stays',
                description: `${currentPkg.title} · ${allocatedUnits} × ${currentRoom ? currentRoom.name : 'Glamp'} · ${totalGuests} Campers`,
                order_id: orderId,
                prefill: {
                    name: customerName.trim(),
                    contact: customerPhone.trim(),
                    email: customerEmail.trim() || undefined
                },
                handler: async (response) => {
                    try {
                        const vRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                bookingId: resData.bookingId,
                                orderId: response.razorpay_order_id || orderId,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature || ''
                            })
                        });
                        const vData = await vRes.json();
                        if (vData.success) {
                            setConfirmedPass({ ...finalPass, status: 'Confirmed' });
                            setIsSubmitting(false);
                            setStep(5);
                        } else {
                            setValidationError('Payment received — our team will confirm your booking shortly.');
                            setIsSubmitting(false);
                        }
                    } catch (err) {
                        setValidationError('Payment received — our team will confirm your booking shortly.');
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsSubmitting(false);
                        setValidationError('Payment window closed. Your slot is held for 10 minutes — you can retry the payment.');
                    }
                }
            };
            new window.Razorpay(options).open();
        } catch (err) {
            console.error('Razorpay checkout error:', err);
            setValidationError('Payment gateway unavailable. Please retry or contact our concierge.');
            setIsSubmitting(false);
        }
    };

    // WhatsApp Instant Sync
    const handleSharePassToWhatsApp = () => {
        if (!confirmedPass) return;
        const msg = `🏕️ *AANANDHAM.GO CONFIRMED EXPEDITION PASS*\n\n` +
            `🔖 *Booking Reference:* ${confirmedPass.id}\n` +
            `👤 *Lead Explorer:* ${confirmedPass.name}\n` +
            `📞 *Phone:* ${confirmedPass.phone}\n` +
            `📍 *Destination:* ${confirmedPass.package} (${confirmedPass.altitude})\n` +
            `🛏️ *Stay Units:* ${confirmedPass.roomType}\n` +
            `📅 *Expedition Dates:* ${confirmedPass.dates}\n` +
            `👥 *Squad Count:* ${confirmedPass.guests} Campers (${confirmedPass.adults} Adults${confirmedPass.children > 0 ? `, ${confirmedPass.children} Kids` : ''})\n` +
            `🍽️ *Meal Prep Allocation:* ${confirmedPass.vegCount} Veg + ${confirmedPass.nonVegCount} Non-Veg BBQ (${confirmedPass.dietaryChoice})\n` +
            `✨ *Add-ons:* ${confirmedPass.addons.length > 0 ? confirmedPass.addons.join(', ') : 'None'}\n` +
            `💰 *Grand Total:* ${inr(confirmedPass.total)}\n` +
            `💳 *Paid:* ${inr(confirmedPass.paidAmount)} (${confirmedPass.paymentMode})\n` +
            `⏳ *Balance on Check-in:* ${inr(confirmedPass.balanceDue)}\n` +
            `📝 *Notes:* ${confirmedPass.notes || 'None'}\n\n` +
            `Please share the 4x4 Jeep pickup coordinator contact and offline GPS map! 🏔️✨`;
        
        window.open(waLink(msg), '_blank');
    };

    return createPortal(
        <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="booking-modal-overlay" 
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
        >
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="booking-modal-card"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                style={{ maxWidth: '920px', width: '95%' }}
            >
                {/* ── HEADER & STEP PROGRESS BAR ── */}
                <div className="booking-modal-header" style={{ padding: '22px 28px 16px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
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
                            {step === 3 && '3. Camper & Contact Information'}
                            {step === 4 && '4. Payment & Reservation Details'}
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
                {step < 5 && (
                    <div className="booking-steps-bar">
                        {[
                            { num: 1, label: 'Stay & Dates', shortLabel: 'Stays' },
                            { num: 2, label: 'Add-Ons', shortLabel: 'Add-Ons' },
                            { num: 3, label: 'Explorer Info', shortLabel: 'Details' },
                            { num: 4, label: paymentSettings.mode === 'coming_soon' ? 'Voucher Pass' : 'Payment', shortLabel: 'Payment' }
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
                                    {idx < 3 && <span className="booking-step-arrow">→</span>}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* ── BODY CONTENT ── */}
                <div 
                    className="booking-modal-body"
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    onWheel={(e) => e.stopPropagation()}
                    style={{ padding: '24px 28px' }}
                >
                    {validationError && (
                        <div style={{
                            background: 'rgba(255, 90, 95, 0.12)',
                            border: '1px solid rgba(255, 90, 95, 0.35)',
                            borderRadius: '14px',
                            padding: '12px 18px',
                            color: '#D9383D',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <AlertCircle size={18} color="#D9383D" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* ════════════════ STEP 1: CAMPSITE, ROOM & DATES ════════════════ */}
                    {step === 1 && (
                        <div>
                            {/* Section 1: Campsite Selector */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        1. Select Destination Campsite
                                    </label>
                                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: '800' }}>
                                        {campsList.length} Verified Sanctuaries
                                    </span>
                                </div>
                                <div className="booking-pkgs-grid">
                                    {campsList.map((pkg) => {
                                        const isSelected = pkg.id === selectedPkgId;
                                        return (
                                            <div
                                                key={pkg.id}
                                                onClick={() => {
                                                    setSelectedPkgId(pkg.id);
                                                    setCustomUnits(null);
                                                    if (pkg.rooms && pkg.rooms.length > 0) {
                                                        setSelectedRoomId(pkg.rooms[0].id);
                                                    }
                                                }}
                                                style={{
                                                    borderRadius: '16px',
                                                    border: isSelected ? '2px solid #166534' : '1px solid rgba(0, 0, 0, 0.08)',
                                                    background: isSelected ? '#F4F7EB' : '#FFFFFF',
                                                    padding: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    position: 'relative',
                                                    boxShadow: isSelected ? '0 6px 20px rgba(22, 101, 52, 0.12)' : 'none'
                                                }}
                                            >
                                                <div style={{
                                                    height: '78px',
                                                    borderRadius: '10px',
                                                    backgroundImage: `url(${pkg.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    marginBottom: '10px',
                                                    position: 'relative'
                                                }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '6px',
                                                        left: '6px',
                                                        background: isSelected ? '#121613' : 'rgba(0,0,0,0.65)',
                                                        color: isSelected ? '#D5ED55' : '#FFFFFF',
                                                        fontSize: '9.5px',
                                                        fontWeight: '800',
                                                        padding: '2px 8px',
                                                        borderRadius: '999px'
                                                    }}>
                                                        {pkg.altitude || pkg.badge || 'Verified'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613', lineHeight: 1.3, marginBottom: '3px' }}>
                                                    {pkg.shortTitle || pkg.title}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#59655D', marginBottom: '6px' }}>
                                                    {pkg.location}
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#166534' }}>
                                                    Starts ₹{pkg.price?.toLocaleString('en-IN')} <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#59655D' }}>/ camper</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 2: Room Types / Lodging Selector */}
                            <div style={{ marginBottom: '24px', padding: '18px 20px', background: '#F8F9F5', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                            2. Choose Lodging Style & Accommodations
                                        </label>
                                        <span style={{ fontSize: '12px', color: '#59655D' }}>
                                            Available options at {currentPkg.shortTitle || currentPkg.title}
                                        </span>
                                    </div>
                                    <span style={{ background: '#121613', color: '#D5ED55', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                        {availableRooms.length} Types
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                                    {availableRooms.map((room) => {
                                        const isRoomSelected = room.id === selectedRoomId;
                                        const neededUnits = Math.max(1, Math.ceil(totalGuests / parseRoomCapacity(room.capacity)));
                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => {
                                                    setSelectedRoomId(room.id);
                                                    setCustomUnits(null);
                                                }}
                                                style={{
                                                    borderRadius: '16px',
                                                    border: isRoomSelected ? '2px solid #166534' : '1px solid rgba(18, 22, 19, 0.1)',
                                                    background: '#FFFFFF',
                                                    padding: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: isRoomSelected ? '0 8px 24px rgba(22, 101, 52, 0.12)' : '0 2px 6px rgba(0,0,0,0.02)',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{
                                                            width: '18px',
                                                            height: '18px',
                                                            borderRadius: '50%',
                                                            border: isRoomSelected ? '5px solid #166534' : '2px solid rgba(18, 22, 19, 0.25)',
                                                            background: '#FFFFFF',
                                                            boxSizing: 'border-box',
                                                            flexShrink: 0
                                                        }} />
                                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>
                                                            {room.name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                                                    {room.image && (
                                                        <img
                                                            src={room.image}
                                                            alt={room.name}
                                                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                                                         loading="lazy" decoding="async"/>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '600', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Users size={13} color="#59655D" />
                                                            <span>{room.capacity || '2-4 Guests'}</span>
                                                        </div>
                                                        <div style={{ fontSize: '14.5px', fontWeight: '900', color: '#166534' }}>
                                                            ₹{room.price?.toLocaleString('en-IN')} <span style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>/ camper</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                    <span style={{ fontSize: '10.5px', background: isRoomSelected ? '#D5ED55' : '#ECEEE6', color: '#121613', padding: '3px 8px', borderRadius: '999px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <Tent size={12} strokeWidth={2.5} />
                                                        <span>{neededUnits} Unit(s) needed</span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 3: Date & Guests Setup */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        3. Check-In Weekend Batch or Date
                                    </label>
                                    <CustomDateBatchPicker
                                        label="Check-In Batch"
                                        selectedDate={travelDate || getDefaultUpcomingBatch()}
                                        onDateChange={(date) => {
                                            setTravelDate(date);
                                            setValidationError('');
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                4. Number of Campers
                                            </label>
                                            <span style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>
                                                {discountLabel ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sparkles size={11} /> {discountLabel}</span> : 'Standard Fare'}
                                            </span>
                                        </div>

                                        {/* Quick Presets */}
                                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                            {[
                                                { count: 2, label: '2 Duo' },
                                                { count: 4, label: '4 Squad' },
                                                { count: 6, label: '6 Friends' },
                                                { count: 8, label: '8 Tribe' }
                                            ].map(preset => (
                                                <button
                                                    key={preset.count}
                                                    type="button"
                                                    onClick={() => {
                                                        setAdults(preset.count);
                                                        setChildren(0);
                                                        setCustomUnits(null);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '5px 0',
                                                        borderRadius: '8px',
                                                        border: (adults === preset.count && children === 0) ? '1px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                        background: (adults === preset.count && children === 0) ? '#166534' : '#FFFFFF',
                                                        color: (adults === preset.count && children === 0) ? '#FFFFFF' : '#121613',
                                                        fontSize: '11px',
                                                        fontWeight: '800',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ flex: 1, padding: '10px 12px', background: '#F8F9F5', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Adults (12+ yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setAdults(Math.max(1, adults - 1)); setCustomUnits(null); }}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setAdults(adults + 1); setCustomUnits(null); }}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, padding: '10px 12px', background: '#F8F9F5', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Kids (5–11 yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setChildren(Math.max(0, children - 1)); setCustomUnits(null); }}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setChildren(children + 1); setCustomUnits(null); }}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Smart Stay Unit Allocation Card */}
                                    <div style={{ background: '#F4F7EB', borderRadius: '16px', padding: '12px 14px', border: '1px solid rgba(22, 101, 52, 0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Tent size={13} color="#166534" strokeWidth={2.5} />
                                                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Smart Stay Allocation
                                                </span>
                                            </div>
                                            {customUnits !== null && (
                                                <button
                                                    type="button"
                                                    onClick={() => setCustomUnits(null)}
                                                    style={{ background: 'none', border: 'none', fontSize: '10.5px', color: '#59655D', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                                >
                                                    Reset Auto
                                                </button>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>
                                                    {allocatedUnits} × {currentRoom?.name || 'Dome / Tent'}
                                                </div>
                                                <div style={{ fontSize: '10.5px', color: '#59655D' }}>
                                                    Holds {totalMaxCapacity} Campers ({roomCapacity} pax / unit)
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFFFFF', padding: '2px 5px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setCustomUnits(Math.max(autoUnits, allocatedUnits - 1))}
                                                    disabled={allocatedUnits <= autoUnits}
                                                    style={{ width: '20px', height: '20px', border: 'none', background: 'transparent', cursor: allocatedUnits <= autoUnits ? 'not-allowed' : 'pointer', opacity: allocatedUnits <= autoUnits ? 0.3 : 1, fontWeight: '800', fontSize: '11px' }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontSize: '11.5px', fontWeight: '800', minWidth: '14px', textAlign: 'center' }}>
                                                    {allocatedUnits}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setCustomUnits(allocatedUnits + 1)}
                                                    style={{ width: '20px', height: '20px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '800', fontSize: '11px' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <button
                                            type="button"
                                            onClick={handleProceedToStep2}
                                            className="btn-lime"
                                            style={{
                                                padding: '12px 28px',
                                                fontSize: '14px',
                                                fontWeight: '800',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>Proceed to Add-ons</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════ STEP 2: ADD-ONS & EXPERIENCES ════════════════ */}
                            {step === 2 && (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                Customize Your Mountain Journey (Optional Upgrades)
                                            </label>
                                            <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                                                {selectedAddons.length} selected
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {ADDONS_LIST.map((addon) => {
                                                const isChecked = selectedAddons.includes(addon.id);
                                                return (
                                                    <div
                                                        key={addon.id}
                                                        onClick={() => toggleAddon(addon.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            border: isChecked ? '2px solid #166534' : '1px solid rgba(0,0,0,0.08)',
                                                            background: isChecked ? '#F4F7EB' : '#FFFFFF',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            gap: '12px'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleAddon(addon.id)}
                                                                style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: 'pointer' }}
                                                            />
                                                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: isChecked ? '#166534' : '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, color: isChecked ? '#D5ED55' : '#121613' }}>
                                                                <addon.icon size={17} strokeWidth={2.2} />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>
                                                                    {addon.name}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>
                                                                    {addon.desc}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                            <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#166534' }}>
                                                                +₹{addon.price}
                                                            </div>
                                                            <div style={{ fontSize: '10.5px', color: '#59655D' }}>
                                                                {addon.perPerson ? `₹${addon.price * totalGuests} total` : 'Flat group fee'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Summary Preview Box */}
                                    <div style={{ padding: '14px 18px', background: '#121613', borderRadius: '16px', color: '#FFFFFF', marginBottom: '18px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px' }}>
                                            <span style={{ color: '#A2B6A6' }}>{currentPkg.title} ({totalGuests} Campers):</span>
                                            <span>
                                                {discountAmount > 0 && (
                                                    <span style={{ textDecoration: 'line-through', color: '#8A938B', marginRight: '8px', fontSize: '11.5px' }}>
                                                        ₹{baseTotal.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span>₹{(baseTotal - discountAmount).toLocaleString('en-IN')}</span>
                                            </span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#D5ED55' }}>
                                                <span>{discountLabel || 'Discount Applied'}:</span>
                                                <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {addonsTotal > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px', color: '#D5ED55' }}>
                                                <span>Add-ons ({selectedAddons.length} Selected):</span>
                                                <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800' }}>Updated Grand Total:</span>
                                            <span style={{ fontSize: '20px', fontWeight: '900', color: '#D5ED55' }}>
                                                ₹{grandTotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="btn-secondary"
                                            style={{ background: '#F1F3EC', border: 'none', fontSize: '13px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '8px 14px', borderRadius: '10px' }}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleProceedToStep3}
                                            className="btn-lime"
                                            style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                        >
                                            <span>Continue to Details</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════ STEP 3: LEAD EXPLORER & SQUAD INFO ════════════════ */}
                            {step === 3 && (
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
                                                    Email Address (For Pass Sync)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="booking-modal-input"
                                                    placeholder="e.g. anand@gmail.com"
                                                    value={customerEmail}
                                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                                />
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
                                            onClick={handleProceedToStep4}
                                            className="btn-lime"
                                            style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                        >
                                            <span>Continue to Payment</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════ STEP 4: 0-FEE DYNAMIC UPI PAYMENT ════════════════ */}
                            {step === 4 && (
                                <div>
                                    {/* Payment Mode Selector */}
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
                                                    ₹{advanceAmount.toLocaleString('en-IN')}
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

                                    {/* ── PAYMENT CARD: DYNAMIC COMING SOON vs LIVE UPI GATEWAY ── */}
                                    {paymentSettings.mode === 'coming_soon' ? (
                                        <div style={{ background: '#121613', borderRadius: '20px', padding: '20px 18px', color: '#FFFFFF', marginBottom: '18px', border: '1px solid rgba(213, 237, 85, 0.25)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '900', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.5px' }}>
                                                    ⏳ COMING SOON
                                                </span>
                                                <span style={{ color: '#D5ED55', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    Concierge Desk Active
                                                </span>
                                            </div>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px' }}>
                                                {paymentSettings.comingSoonTitle || 'Online UPI & Gateway Payment · Coming Soon'}
                                            </h3>
                                            <p style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.55, margin: '0 0 16px' }}>
                                                {paymentSettings.comingSoonMessage || 'Our automated instant payment gateway is launching soon! You can lock your dates and room reservation right now with zero upfront advance. Our 24/7 mountain concierge will confirm your booking instantly via WhatsApp.'}
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontSize: '14px', fontWeight: '900' }}>
                                                        ✓
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Advance Deposit</div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#D5ED55' }}>₹0 (Zero Advance)</div>
                                                    </div>
                                                </div>
                                                <div style={ROW_GAP_10}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(229, 169, 59, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5A93B', fontSize: '14px' }}>
                                                        <Tent size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Trip Fare (Pay on Arrival)</div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>₹{grandTotal.toLocaleString('en-IN')}</div>
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

                                        {paymentSettings.mode === 'coming_soon' ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                {/* Disabled Online Booking Button */}
                                                <button
                                                    type="button"
                                                    disabled={true}
                                                    style={{
                                                        padding: '12px 22px',
                                                        fontSize: '13px',
                                                        fontWeight: '800',
                                                        borderRadius: '12px',
                                                        background: '#F3F4F6',
                                                        color: '#6B7280',
                                                        border: '1.5px dashed #9CA3AF',
                                                        cursor: 'not-allowed',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        opacity: 0.85
                                                    }}
                                                    title="Online instant checkout is upcoming. Direct concierge inquiries are open."
                                                >
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Lock size={14} /> Online Booking Upcoming · Disabled</span>
                                                </button>

                                                {/* WhatsApp Concierge Desk Inquiry */}
                                                <a
                                                    href={waLink(`Hi Aanandham team! I'm planning an expedition to *${currentPkg.title}* on *${travelDate || 'upcoming weekend'}* for *${totalGuests} campers*. Room: *${currentRoom?.name || 'Alpine Tent'}*. Total: *₹${grandTotal.toLocaleString('en-IN')}*. Could you help me reserve?`)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-lime"
                                                    style={{
                                                        padding: '12px 20px',
                                                        fontSize: '13px',
                                                        fontWeight: '900',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        textDecoration: 'none',
                                                        borderRadius: '12px'
                                                    }}
                                                >
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><WhatsAppIcon size={15} /> Inquire on WhatsApp →</span>
                                                </a>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleRazorpayCheckout}
                                                disabled={isSubmitting}
                                                className="btn-lime"
                                                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                                            >
                                                <span>
                                                    {isSubmitting 
                                                        ? 'Opening Secure Checkout...' 
                                                        : `Pay ₹${payableNow.toLocaleString('en-IN')} Securely →`}
                                                </span>
                                                <ShieldCheck size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ════════════════ STEP 5: OFFICIAL CONFIRMED EXPEDITION PASS ════════════════ */}
                            {step === 5 && confirmedPass && (
                                <div style={{ textAlign: 'center' }}>
                                    {/* Success Icon */}
                                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px' }}>
                                        <Tent size={26} />
                                    </div>

                                    <span style={{ background: '#166534', color: '#D5ED55', fontSize: '10.5px', fontWeight: '800', padding: '3px 12px', borderRadius: '999px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                        Wilderness Permit Locked
                                    </span>

                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', margin: '10px 0 4px' }}>
                                        You're Headed to {confirmedPass.package}!
                                    </h2>
                                    <p style={{ fontSize: '12.5px', color: '#59655D', margin: '0 0 18px' }}>
                                        Your reservation has been recorded in our high-altitude basecamp roster. Present this pass on arrival.
                                    </p>

                                    {/* Digital Boarding Pass Ticket Card */}
                                    <div style={{
                                        background: '#101E13',
                                        borderRadius: '20px',
                                        padding: '18px',
                                        color: '#FFFFFF',
                                        textAlign: 'left',
                                        border: '1px solid rgba(213,237,85,0.3)',
                                        boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        marginBottom: '18px'
                                    }}>
                                        {/* Pass Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#D5ED55', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Official Boarding Pass
                                                </div>
                                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
                                                    {confirmedPass.package}
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: '#A2B6A6' }}>
                                                    {confirmedPass.location} · {confirmedPass.altitude}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '9.5px', color: '#A2B6A6' }}>PASS CODE:</div>
                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#D5ED55', letterSpacing: '0.5px' }}>
                                                    {confirmedPass.id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pass Grid Details */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Lead Camper</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.name}</div>
                                                <div style={{ fontSize: '10.5px', color: '#D5ED55' }}>{confirmedPass.phone}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Expedition Batch</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.dates}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Check-in: 02:00 PM</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Stay Units</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.roomType}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>{confirmedPass.guests} Campers</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6', textTransform: 'uppercase' }}>Fare & Payment</div>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#D5ED55' }}>Paid: {inr(confirmedPass.paidAmount)}</div>
                                                <div style={{ fontSize: '10.5px', color: '#A2B6A6' }}>Due: {inr(confirmedPass.balanceDue)}</div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#D5ED55', marginBottom: '8px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Utensils size={13} /> <strong>Campfire Meal Prep:</strong> {confirmedPass.vegCount} Vegetarian + {confirmedPass.nonVegCount} Non-Veg BBQ ({confirmedPass.dietaryChoice})</span>
                                        </div>

                                        {confirmedPass.addons.length > 0 && (
                                            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#D5ED55', marginBottom: '10px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Sparkles size={13} /> <strong>Included Upgrades:</strong> {confirmedPass.addons.join(', ')}</span>
                                            </div>
                                        )}

                                        <div style={{ fontSize: '11px', color: '#A2B6A6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={12} color="#D5ED55" />
                                            <span>Jeep convoy pickup coordinates shared via WhatsApp.</span>
                                        </div>
                                    </div>

                                    {/* Pass Action Buttons */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={handleSharePassToWhatsApp}
                                            className="btn-lime"
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '13px',
                                                fontWeight: '900',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>Sync with Host on WhatsApp →</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            style={{
                                                padding: '10px 18px',
                                                borderRadius: '999px',
                                                background: '#ECEEE6',
                                                border: 'none',
                                                color: '#121613',
                                                fontSize: '12.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Done & Close
                                        </button>
                                    </div>
                                </div>
                            )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
