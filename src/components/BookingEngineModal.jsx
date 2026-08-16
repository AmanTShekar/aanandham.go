"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';
import CustomDateBatchPicker from './CustomDateBatchPicker';
import LucideAmenityIcon from './common/LucideAmenityIcon';
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
    AlertCircle 
} from 'lucide-react';
import { getAllCamps, INITIAL_ALL_CAMPS } from '../lib/campsData';
import { inr, generateBookingId, getDefaultUpcomingBatch } from '../lib/utils';
import { waLink, isValidPhoneNumber } from '../lib/whatsapp';
import { useFocusTrap } from '../hooks/useFocusTrap';

export function parseRoomCapacity(capacityStr) {
    if (!capacityStr) return 2;
    const match = String(capacityStr).match(/\d+/);
    return match ? Math.max(1, parseInt(match[0], 10)) : 2;
}

const ADDONS_LIST = [
    { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true, icon: '🔥', desc: 'Marinated paneer/chicken skewers grilled live over wood coals' },
    { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false, icon: '🚙', desc: 'Exclusive Mahindra 4x4 for your squad with summit sunrise stops' },
    { id: 'drone', name: '4K Drone Mountain Video Reel Shoot', price: 1500, perPerson: false, icon: '📸', desc: 'Cinematic aerial 4K video clips edited for your Instagram reels' },
    { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true, icon: '🧘', desc: 'Guided breathwork & stretching above cloud beds with local yogi' },
    { id: 'guitar', name: 'Acoustic Guitarist for Campfire Circle', price: 2000, perPerson: false, icon: '🎸', desc: 'Live unplugged indie mountain tunes around the starlit fire' }
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
    const [selectedPkgId, setSelectedPkgId] = useState('pkg-kolukkumalai');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [travelDate, setTravelDate] = useState(() => initialDate || getDefaultUpcomingBatch());
    const [adults, setAdults] = useState(initialAdults || (typeof initialGuests === 'number' ? Math.max(1, initialGuests) : 2));
    const [children, setChildren] = useState(initialChildren || 0);
    const [customUnits, setCustomUnits] = useState(initialCustomUnits || null);
    const [selectedAddons, setSelectedAddons] = useState(['bbq']);
    
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
    
    // Payment Options (Step 4)
    const [paymentMode, setPaymentMode] = useState('advance'); // 'advance' (30%) | 'full' (100%)
    const [utrNumber, setUtrNumber] = useState('');
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [confirmedPass, setConfirmedPass] = useState(null);

    const UPI_ID = 'aanandhamgo@okhdfcbank';
    const UPI_PAYEE_NAME = 'Aanandham Wilderness Stays';

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
            setUtrNumber('');

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
    
    // Squad Discount
    const discountPercent = totalGuests >= 8 ? 15 : totalGuests >= 4 ? 10 : 0;
    const discountAmount = Math.round((baseTotal * discountPercent) / 100);

    // Add-ons Total
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
        const addon = ADDONS_LIST.find(a => a.id === addonId);
        if (!addon) return acc;
        return acc + (addon.perPerson ? addon.price * totalGuests : addon.price);
    }, 0);

    const grandTotal = baseTotal - discountAmount + addonsTotal;
    const advanceAmount = Math.round(grandTotal * 0.3); // 30% advance deposit
    const payableNow = paymentMode === 'advance' ? advanceAmount : grandTotal;
    const balanceOnArrival = grandTotal - payableNow;

    // Dynamic UPI Link & QR URL
    const activeBookingRef = useMemo(() => generateBookingId(), [isOpen, selectedPkgId]);
    const upiPayLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${payableNow}&tn=${encodeURIComponent(`Aanandham ${activeBookingRef}`)}&cu=INR`;
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayLink)}`;

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

    const handleCopyUpi = () => {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(UPI_ID);
            setCopiedUpi(true);
            setTimeout(() => setCopiedUpi(false), 2500);
        }
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
        setValidationError('');
        setStep(4);
    };

    // Step 4 Complete: Confirm Booking & Generate Official Voucher Pass
    const handleConfirmBookingAndIssuePass = async () => {
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
        const bookingId = activeBookingRef;
        const datesString = travelDate || getDefaultUpcomingBatch();

        const passData = {
            id: bookingId,
            name: customerName.trim(),
            phone: customerPhone.trim(),
            email: customerEmail.trim() || 'explorer@aanandhamgo.com',
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
            paidAmount: payableNow,
            balanceDue: balanceOnArrival,
            paymentMode: paymentMode === 'advance' ? '30% Advance Deposit' : '100% Full Expedition Fare',
            utrNumber: utrNumber.trim() || 'UPI-DIRECT-INTENT',
            dietaryChoice,
            vegCount,
            nonVegCount,
            mealSummary: `${vegCount} Veg + ${nonVegCount} Non-Veg BBQ (${dietaryChoice})`,
            notes: specialNotes.trim(),
            status: 'Confirmed',
            source: 'Website 0-Fee Booking Engine',
            createdAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        // 1. Sync with Server API
        try {
            await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passData)
            });
        } catch (err) {
            console.error('Server sync notice:', err);
        }

        // 2. Persist in local storage for instant offline recall
        try {
            const currentBookings = JSON.parse(localStorage.getItem('aanandham_admin_bookings_v2') || '[]');
            localStorage.setItem('aanandham_admin_bookings_v2', JSON.stringify([passData, ...currentBookings]));
            window.dispatchEvent(new Event('storage'));
        } catch (err) {}

        setConfirmedPass(passData);
        setIsSubmitting(false);
        setStep(5); // Show Official Boarding Pass Voucher
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
            `💳 *Paid via UPI:* ${inr(confirmedPass.paidAmount)} (${confirmedPass.paymentMode})\n` +
            `⏳ *Balance on Check-in:* ${inr(confirmedPass.balanceDue)}\n` +
            `📝 *Notes:* ${confirmedPass.notes || 'None'}\n\n` +
            `Please share the 4x4 Jeep pickup coordinator contact and offline GPS map! 🏔️✨`;
        
        window.open(waLink(msg), '_blank');
    };

    return (
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
                                {step === 5 ? 'Confirmed Permit' : 'Direct Booking Engine'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '700' }}>
                                {step === 5 ? 'Official Wilderness Pass' : '0% Fee · Direct Bank Settlement'}
                            </span>
                        </div>
                        <h2 id="booking-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 3.2vw, 24px)', fontWeight: '800', margin: 0, color: '#121613' }}>
                            {step === 1 && '1. Choose Campsite, Lodging & Dates'}
                            {step === 2 && '2. Custom Experiences & Add-Ons'}
                            {step === 3 && '3. Lead Explorer & Squad Details'}
                            {step === 4 && '4. 0-Fee Dynamic UPI Checkout'}
                            {step === 5 && '🎉 Expedition Boarding Pass Issued'}
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
                            background: '#ECEEE6',
                            border: 'none',
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
                    <div style={{ background: '#F8F9F5', padding: '12px 28px', borderBottom: '1px solid rgba(18, 22, 19, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto' }}>
                        {[
                            { num: 1, label: 'Stay & Dates' },
                            { num: 2, label: 'Add-Ons' },
                            { num: 3, label: 'Explorer Info' },
                            { num: 4, label: '0% UPI Payment' }
                        ].map((s, idx) => {
                            const isActive = step === s.num;
                            const isCompleted = step > s.num;
                            return (
                                <div 
                                    key={s.num}
                                    onClick={() => { if (isCompleted) setStep(s.num); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: isCompleted ? 'pointer' : 'default',
                                        opacity: isActive ? 1 : isCompleted ? 0.9 : 0.45,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: isActive ? '#166534' : isCompleted ? '#D5ED55' : 'rgba(18,22,19,0.15)',
                                        color: isActive ? '#FFFFFF' : isCompleted ? '#121613' : '#59655D',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: '900'
                                    }}>
                                        {isCompleted ? '✓' : s.num}
                                    </div>
                                    <span style={{ fontSize: '12.5px', fontWeight: isActive ? '800' : '600', color: isActive ? '#166534' : '#121613' }}>
                                        {s.label}
                                    </span>
                                    {idx < 3 && <span style={{ color: 'rgba(18,22,19,0.2)', margin: '0 4px' }}>→</span>}
                                </div>
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
                                                        />
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
                                                {totalGuests >= 8 ? '🎉 15% Squad Discount' : totalGuests >= 4 ? '✨ 10% Squad Discount' : 'Standard Fare'}
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
                            <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={handleProceedToStep2}
                                    className="btn-lime"
                                    style={{
                                        padding: '14px 34px',
                                        fontSize: '15px',
                                        fontWeight: '800',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>Proceed to Add-ons & Upgrades</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════════════════ STEP 2: ADD-ONS & EXPERIENCES ════════════════ */}
                    {step === 2 && (
                        <div>
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                        Customize Your Mountain Journey (Optional Upgrades)
                                    </label>
                                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                                        {selectedAddons.length} selected
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                                    padding: '14px 18px',
                                                    borderRadius: '16px',
                                                    border: isChecked ? '2px solid #166534' : '1px solid rgba(0,0,0,0.08)',
                                                    background: isChecked ? '#F4F7EB' : '#FFFFFF',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    gap: '14px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleAddon(addon.id)}
                                                        style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: 'pointer' }}
                                                    />
                                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isChecked ? '#166534' : '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                                                        {addon.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>
                                                            {addon.name}
                                                        </div>
                                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '2px' }}>
                                                            {addon.desc}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#166534' }}>
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
                            <div style={{ padding: '16px 20px', background: '#121613', borderRadius: '18px', color: '#FFFFFF', marginBottom: '22px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                    <span style={{ color: '#A2B6A6' }}>{currentPkg.title} ({totalGuests} Campers):</span>
                                    <span>₹{(baseTotal - discountAmount).toLocaleString('en-IN')}</span>
                                </div>
                                {addonsTotal > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#D5ED55' }}>
                                        <span>Add-ons ({selectedAddons.length} Selected):</span>
                                        <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '800' }}>Updated Grand Total:</span>
                                    <span style={{ fontSize: '22px', fontWeight: '900', color: '#D5ED55' }}>
                                        ₹{grandTotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 16px' }}
                                >
                                    ← Back to Selection
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProceedToStep3}
                                    className="btn-lime"
                                    style={{ padding: '14px 34px', fontSize: '15px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                >
                                    <span>Proceed to Explorer Details</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════════════════ STEP 3: LEAD EXPLORER & SQUAD INFO ════════════════ */}
                    {step === 3 && (
                        <div>
                            <div style={{ marginBottom: '24px' }}>
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

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
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
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
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
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
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

                                {/* EXACT PARTICIPANT MEAL BREAKDOWN (VEG & NON-VEG COUNTERS) */}
                                <div style={{
                                    marginBottom: '18px',
                                    padding: '16px 18px',
                                    background: '#F8F9F5',
                                    borderRadius: '18px',
                                    border: '1px solid rgba(18, 22, 19, 0.08)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                            Campfire Dinner & BBQ Meal Allocation
                                        </label>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            background: (vegCount + nonVegCount === totalGuests) ? '#DCFCE7' : '#FEE2E2',
                                            color: (vegCount + nonVegCount === totalGuests) ? '#166534' : '#DC2626'
                                        }}>
                                            {vegCount + nonVegCount === totalGuests ? `✓ All ${totalGuests} Meals Allocated` : `⚠️ Total: ${vegCount + nonVegCount} / ${totalGuests} Campers`}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#59655D', marginBottom: '12px' }}>
                                        Specify the exact count of Vegetarian vs Non-Vegetarian eaters in your group for fresh campfire skewers & buffet prep.
                                    </div>

                                    {/* Quick Preset Buttons */}
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                        <button
                                            type="button"
                                            onClick={() => { setNonVegCount(totalGuests); setVegCount(0); }}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '8px',
                                                border: (nonVegCount === totalGuests && vegCount === 0) ? '1.5px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                background: (nonVegCount === totalGuests && vegCount === 0) ? '#166534' : '#FFFFFF',
                                                color: (nonVegCount === totalGuests && vegCount === 0) ? '#FFFFFF' : '#121613',
                                                fontSize: '11.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🍗 All Non-Veg ({totalGuests})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setVegCount(totalGuests); setNonVegCount(0); }}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '8px',
                                                border: (vegCount === totalGuests && nonVegCount === 0) ? '1.5px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                background: (vegCount === totalGuests && nonVegCount === 0) ? '#166534' : '#FFFFFF',
                                                color: (vegCount === totalGuests && nonVegCount === 0) ? '#FFFFFF' : '#121613',
                                                fontSize: '11.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🥦 All Veg ({totalGuests})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const half = Math.floor(totalGuests / 2);
                                                setVegCount(half);
                                                setNonVegCount(totalGuests - half);
                                            }}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(18,22,19,0.1)',
                                                background: '#FFFFFF',
                                                color: '#121613',
                                                fontSize: '11.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ⚖️ Split ({Math.floor(totalGuests / 2)} Veg, {totalGuests - Math.floor(totalGuests / 2)} Non-Veg)
                                        </button>
                                    </div>

                                    {/* Counters Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                        {/* Veg Counter */}
                                        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px 14px', border: '1px solid #BBF7D0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
                                                <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#166534' }}>Vegetarian</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const next = Math.max(0, vegCount - 1);
                                                        setVegCount(next);
                                                        setNonVegCount(totalGuests - next);
                                                    }}
                                                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}
                                                >
                                                    -
                                                </button>
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ fontSize: '17px', fontWeight: '900', color: '#121613' }}>{vegCount}</span>
                                                    <span style={{ fontSize: '10.5px', color: '#59655D', display: 'block' }}>Campers</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const next = Math.min(totalGuests, vegCount + 1);
                                                        setVegCount(next);
                                                        setNonVegCount(totalGuests - next);
                                                    }}
                                                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Non-Veg Counter */}
                                        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px 14px', border: '1px solid #FECACA' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                                                <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#B91C1C' }}>Non-Veg BBQ</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const next = Math.max(0, nonVegCount - 1);
                                                        setNonVegCount(next);
                                                        setVegCount(totalGuests - next);
                                                    }}
                                                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}
                                                >
                                                    -
                                                </button>
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ fontSize: '17px', fontWeight: '900', color: '#121613' }}>{nonVegCount}</span>
                                                    <span style={{ fontSize: '10.5px', color: '#59655D', display: 'block' }}>Campers</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const next = Math.min(totalGuests, nonVegCount + 1);
                                                        setNonVegCount(next);
                                                        setVegCount(totalGuests - next);
                                                    }}
                                                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#F8F9F5', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dietary Customization Chips */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {['Standard Kerala Spicing', 'Jain (No Onion/Garlic)', 'Halal Prepared', 'Kids Mild Spice'].map(diet => (
                                            <button
                                                key={diet}
                                                type="button"
                                                onClick={() => setDietaryChoice(diet)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    border: dietaryChoice === diet ? '1.5px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                    background: dietaryChoice === diet ? '#F4F7EB' : '#FFFFFF',
                                                    color: '#121613',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {dietaryChoice === diet ? '✓ ' : ''}{diet}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '6px' }}>
                                        Special Requests / Notes for Basecamp Marshals
                                    </label>
                                    <textarea
                                        className="booking-modal-input"
                                        placeholder="e.g. Sunrise 5:00 AM wake-up alarm, acoustic guitar songs request, private Jeep pickup point in Munnar town"
                                        value={specialNotes}
                                        onChange={(e) => setSpecialNotes(e.target.value)}
                                        rows={2}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 16px' }}
                                >
                                    ← Back to Add-ons
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProceedToStep4}
                                    className="btn-lime"
                                    style={{ padding: '14px 34px', fontSize: '15px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                >
                                    <span>Proceed to 0-Fee Payment Step</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════════════════ STEP 4: 0-FEE DYNAMIC UPI PAYMENT ════════════════ */}
                    {step === 4 && (
                        <div>
                            {/* Payment Mode Selector */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#59655D', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    Select Payment Amount Choice
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div
                                        onClick={() => setPaymentMode('advance')}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: paymentMode === 'advance' ? '2px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                            background: paymentMode === 'advance' ? '#F4F7EB' : '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>30% Advance Deposit</span>
                                            <span style={{ background: '#D5ED55', color: '#121613', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '999px' }}>POPULAR</span>
                                        </div>
                                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#166534' }}>
                                            ₹{advanceAmount.toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#59655D', marginTop: '4px' }}>
                                            Locks permits now. Balance ₹{balanceOnArrival.toLocaleString('en-IN')} on campsite arrival.
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMode('full')}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: paymentMode === 'full' ? '2px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                            background: paymentMode === 'full' ? '#F4F7EB' : '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>100% Full Payment</span>
                                            <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '999px' }}>VIP CHECK-IN</span>
                                        </div>
                                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#121613' }}>
                                            ₹{grandTotal.toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#59655D', marginTop: '4px' }}>
                                            Zero balance on arrival. Instant fast-track key handover.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic UPI Payment Card */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', background: '#121613', borderRadius: '24px', padding: '24px', color: '#FFFFFF', marginBottom: '22px' }}>
                                {/* Left Column: QR Code */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', padding: '16px', borderRadius: '20px' }}>
                                    <img
                                        src={qrCodeImageUrl}
                                        alt="Aanandham Dynamic UPI QR Code"
                                        style={{ width: '180px', height: '180px', display: 'block', borderRadius: '8px' }}
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '10px', color: '#121613' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#166534' }}>
                                            Scan With Any UPI App
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#121613' }}>
                                            ₹{payableNow.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: 1-Tap Buttons & UPI ID */}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D5ED55', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                            <ShieldCheck size={14} color="#D5ED55" />
                                            <span>0% Processing Fees · Direct Settlement</span>
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px', color: '#FFFFFF' }}>
                                            Instant UPI Settlement
                                        </h3>
                                        
                                        {/* Copy UPI ID */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '10px', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#A2B6A6' }}>Official UPI VPA:</div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#D5ED55' }}>{UPI_ID}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleCopyUpi}
                                                style={{ background: '#FFFFFF', border: 'none', color: '#121613', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <Copy size={12} />
                                                <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                                            </button>
                                        </div>

                                        {/* 1-Tap Mobile Intent Buttons */}
                                        <div style={{ fontSize: '11.5px', color: '#A2B6A6', marginBottom: '8px' }}>
                                            On mobile? Tap your preferred UPI app directly:
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                                            <a
                                                href={upiPayLink}
                                                style={{ padding: '8px', background: '#FFFFFF', borderRadius: '8px', color: '#121613', textDecoration: 'none', fontSize: '12px', fontWeight: '800', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                                <span>GPay / UPI ↗</span>
                                            </a>
                                            <a
                                                href={upiPayLink}
                                                style={{ padding: '8px', background: '#5F259F', borderRadius: '8px', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '800', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                                <span>PhonePe ↗</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* UTR Input */}
                                    <div>
                                        <label style={{ fontSize: '11px', color: '#A2B6A6', display: 'block', marginBottom: '4px' }}>
                                            12-Digit UPI Ref / UTR No. (Optional for auto-match):
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 423871928371"
                                            value={utrNumber}
                                            onChange={(e) => setUtrNumber(e.target.value)}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '12px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 16px' }}
                                >
                                    ← Back to Details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmBookingAndIssuePass}
                                    disabled={isSubmitting}
                                    className="btn-lime"
                                    style={{ padding: '15px 36px', fontSize: '15px', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                                >
                                    <span>{isSubmitting ? 'Generating Official Pass...' : `Confirm & Issue Pass (₹${payableNow.toLocaleString('en-IN')}) ↗`}</span>
                                    <Check size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════════════════ STEP 5: OFFICIAL CONFIRMED EXPEDITION PASS ════════════════ */}
                    {step === 5 && confirmedPass && (
                        <div style={{ textAlign: 'center' }}>
                            {/* Success Icon */}
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                                🏕️
                            </div>

                            <span style={{ background: '#166534', color: '#D5ED55', fontSize: '11px', fontWeight: '800', padding: '4px 14px', borderRadius: '999px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                Wilderness Permit Locked
                            </span>

                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: '#121613', margin: '12px 0 6px' }}>
                                You're Headed to {confirmedPass.package}!
                            </h2>
                            <p style={{ fontSize: '13.5px', color: '#59655D', margin: '0 0 24px' }}>
                                Your reservation has been recorded in our high-altitude basecamp roster. Present this pass on arrival.
                            </p>

                            {/* Digital Boarding Pass Ticket Card */}
                            <div style={{
                                background: '#101E13',
                                borderRadius: '24px',
                                padding: '24px',
                                color: '#FFFFFF',
                                textAlign: 'left',
                                border: '1px solid rgba(213,237,85,0.3)',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                                position: 'relative',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                {/* Pass Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '10.5px', color: '#D5ED55', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Official Boarding Pass
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
                                            {confirmedPass.package}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6' }}>
                                            {confirmedPass.location} · {confirmedPass.altitude}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '10px', color: '#A2B6A6' }}>PASS CODE:</div>
                                        <div style={{ fontSize: '15px', fontWeight: '900', color: '#D5ED55', letterSpacing: '0.5px' }}>
                                            {confirmedPass.id}
                                        </div>
                                    </div>
                                </div>

                                {/* Pass Grid Details */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>Lead Camper</div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.name}</div>
                                        <div style={{ fontSize: '11px', color: '#D5ED55' }}>{confirmedPass.phone}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>Expedition Batch</div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.dates}</div>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Check-in: 02:00 PM</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>Stay Units</div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF' }}>{confirmedPass.roomType}</div>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6' }}>{confirmedPass.guests} Campers</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase' }}>Fare & Payment</div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#D5ED55' }}>Paid: {inr(confirmedPass.paidAmount)}</div>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Due: {inr(confirmedPass.balanceDue)}</div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#D5ED55', marginBottom: '10px' }}>
                                    🍽️ <strong>Campfire Meal Prep:</strong> {confirmedPass.vegCount} Vegetarian + {confirmedPass.nonVegCount} Non-Veg BBQ ({confirmedPass.dietaryChoice})
                                </div>

                                {confirmedPass.addons.length > 0 && (
                                    <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#D5ED55', marginBottom: '12px' }}>
                                        ✨ <strong>Included Upgrades:</strong> {confirmedPass.addons.join(', ')}
                                    </div>
                                )}

                                <div style={{ fontSize: '11.5px', color: '#A2B6A6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={13} color="#D5ED55" />
                                    <span>Jeep convoy pickup location will be shared 24h prior to arrival via WhatsApp.</span>
                                </div>
                            </div>

                            {/* Pass Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={handleSharePassToWhatsApp}
                                    className="btn-lime"
                                    style={{
                                        padding: '14px 28px',
                                        fontSize: '14.5px',
                                        fontWeight: '900',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                    <span>Sync Voucher with Host on WhatsApp ↗</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{
                                        padding: '14px 24px',
                                        borderRadius: '999px',
                                        background: '#ECEEE6',
                                        border: 'none',
                                        color: '#121613',
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Done & Return to Site
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
