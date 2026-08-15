"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';
import CustomDateBatchPicker from './CustomDateBatchPicker';
import { getAllCamps, INITIAL_ALL_CAMPS } from '../lib/campsData';
import { inr } from '../lib/utils';
import { waLink } from '../lib/whatsapp';

const ADDONS_LIST = [
    { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true, icon: '🔥' },
    { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false, icon: '🚙' },
    { id: 'drone', name: '4K Drone Mountain Video Reel Shoot', price: 1500, perPerson: false, icon: '📸' },
    { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true, icon: '🧘' },
    { id: 'guitar', name: 'Acoustic Guitarist for Campfire Circle', price: 2000, perPerson: false, icon: '🎸' }
];

export default function BookingEngineModal({ isOpen, onClose, initialPackage }) {
    const [campsList, setCampsList] = useState(INITIAL_ALL_CAMPS);
    const [selectedPkgId, setSelectedPkgId] = useState('pkg-kolukkumalai');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [selectedAddons, setSelectedAddons] = useState(['bbq']);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [step, setStep] = useState(1); // 1: Campsite, Room & Details, 2: Addons & Review
    const [validationError, setValidationError] = useState('');

    // Load active camps list from localStorage / default data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loaded = getAllCamps();
            if (loaded && loaded.length > 0) {
                setCampsList(loaded);
            }
        }
    }, [isOpen]);

    // Synchronize selected package and reset step whenever modal opens or initialPackage updates
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setValidationError('');
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

            // Default room selection
            const campObj = matched || campsList[0];
            if (campObj && campObj.rooms && campObj.rooms.length > 0) {
                setSelectedRoomId(campObj.rooms[0].id);
            } else {
                setSelectedRoomId('default-room');
            }
        }
    }, [isOpen, initialPackage, campsList]);

    // When user changes campsite, ensure a valid room for that campsite is selected
    const currentPkg = useMemo(() => {
        return campsList.find(p => p.id === selectedPkgId) || campsList[0] || INITIAL_ALL_CAMPS[0];
    }, [campsList, selectedPkgId]);

    const availableRooms = useMemo(() => {
        if (currentPkg?.rooms && currentPkg.rooms.length > 0) {
            return currentPkg.rooms;
        }
        // Fallback default rooms if campsite doesn't have custom rooms configured
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
            }
        }
    }, [availableRooms, selectedRoomId]);

    const currentRoom = useMemo(() => {
        return availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0];
    }, [availableRooms, selectedRoomId]);

    // Handle ESC key to dismiss modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Disable background page scrolling when modal is open
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

    const totalGuests = adults + children;
    const roomPricePerPerson = currentRoom?.price || currentPkg?.price || 2499;

    // Price Calculations
    const baseTotal = (roomPricePerPerson * adults) + (Math.round(roomPricePerPerson * 0.5) * children);
    
    // Group discount
    const discountPercent = totalGuests >= 8 ? 15 : totalGuests >= 4 ? 10 : 0;
    const discountAmount = Math.round((baseTotal * discountPercent) / 100);

    // Addons Calculation
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
        const addon = ADDONS_LIST.find(a => a.id === addonId);
        if (!addon) return acc;
        return acc + (addon.perPerson ? addon.price * totalGuests : addon.price);
    }, 0);

    const grandTotal = baseTotal - discountAmount + addonsTotal;

    const toggleAddon = (id) => {
        setSelectedAddons(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleProceedToStep2 = () => {
        if (!travelDate) {
            setValidationError('Please choose your tentative expedition date.');
            return;
        }
        setValidationError('');
        setStep(2);
    };

    const handleConfirmBookingWhatsApp = (e) => {
        e?.preventDefault();
        if (!customerName.trim()) {
            setValidationError('Please enter your full name to generate permit request.');
            return;
        }
        if (!customerPhone.trim()) {
            setValidationError('Please enter your WhatsApp / mobile number.');
            return;
        }

        const selectedAddonNames = selectedAddons.map(id => ADDONS_LIST.find(a => a.id === id)?.name).filter(Boolean);
        const summaryText = `🏕️ *NEW AANANDHAM.GO RESERVATION REQUEST*\n\n` +
            `📍 *Expedition:* ${currentPkg.title}\n` +
            `🛏️ *Room Type:* ${currentRoom ? currentRoom.name : 'Standard Glamp'} (₹${roomPricePerPerson.toLocaleString('en-IN')}/camper)\n` +
            `📅 *Date:* ${travelDate || 'Flexible / Upcoming Weekend'}\n` +
            `👥 *Guests:* ${adults} Adults${children > 0 ? `, ${children} Children` : ''} (Total: ${totalGuests})\n` +
            `✨ *Add-ons:* ${selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'None'}\n` +
            `💰 *Est. Total:* ${inr(grandTotal)}${discountPercent > 0 ? ` (Includes ${discountPercent}% Squad Discount!)` : ''}\n\n` +
            `👤 *Name:* ${customerName.trim()}\n` +
            `📞 *Phone:* ${customerPhone.trim()}\n` +
            `📝 *Notes:* ${specialNotes.trim() || 'None'}\n\n` +
            `Please confirm campsite availability & payment link! 🏔️`;

        // Automatically persist booking into real admin database (localStorage)
        try {
            const newBookingRecord = {
                id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
                name: customerName.trim(),
                phone: customerPhone.trim(),
                package: currentPkg.title,
                region: currentPkg.region || (currentPkg.location ? currentPkg.location.split(',')[0].trim() : 'Munnar'),
                dates: travelDate || 'Flexible / Upcoming Weekend',
                guests: totalGuests,
                roomType: currentRoom ? currentRoom.name : 'Standard Mountain Glamp',
                addons: selectedAddonNames,
                total: grandTotal,
                status: 'Pending',
                source: 'Website Booking Engine',
                createdAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            };
            const currentBookings = JSON.parse(localStorage.getItem('aanandham_admin_bookings_v2') || '[]');
            const updatedBookings = [newBookingRecord, ...currentBookings];
            localStorage.setItem('aanandham_admin_bookings_v2', JSON.stringify(updatedBookings));
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            console.error('Error persisting booking:', err);
        }

        window.open(waLink(summaryText), '_blank');
        onClose();
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
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="booking-modal-card"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                style={{ maxWidth: '840px', width: '95%' }}
            >
                {/* Header */}
                <div className="booking-modal-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                                background: '#D5ED55',
                                color: '#121613',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Instant Reservation
                            </span>
                            <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                Verified High-Altitude Basecamps
                            </span>
                        </div>
                        <h2 id="booking-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(17px, 3vw, 24px)', fontWeight: '800', margin: 0 }}>
                            {step === 1 ? '1. Select Campsite, Room & Dates' : '2. Add-Ons & Explorer Details'}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close booking modal"
                        className="modal-close-btn"
                        style={{
                            width: '42px',
                            height: '42px',
                            minWidth: '42px',
                            minHeight: '42px',
                            borderRadius: '50%',
                            background: '#ECEEE6',
                            border: 'none',
                            color: '#121613',
                            fontSize: '17px',
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

                {/* Body Content */}
                <div 
                    className="booking-modal-body"
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {validationError && (
                        <div style={{
                            background: 'rgba(255, 90, 95, 0.12)',
                            border: '1px solid rgba(255, 90, 95, 0.35)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            color: '#D9383D',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            marginBottom: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>⚠️</span>
                            <span>{validationError}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <div>
                            {/* Section 1: Campsite Selector (Horizontal Cards) */}
                            <div style={{ marginBottom: '22px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        1. Select Destination Campsite
                                    </label>
                                    <span style={{ fontSize: '11.5px', color: '#166534', fontWeight: '700' }}>
                                        {campsList.length} Verified Kerala Sanctuaries
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
                                                    if (pkg.rooms && pkg.rooms.length > 0) {
                                                        setSelectedRoomId(pkg.rooms[0].id);
                                                    }
                                                }}
                                                style={{
                                                    borderRadius: '16px',
                                                    border: isSelected ? '2px solid #121613' : '1px solid rgba(0, 0, 0, 0.08)',
                                                    background: isSelected ? '#F4F7EB' : '#FFFFFF',
                                                    padding: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    position: 'relative',
                                                    boxShadow: isSelected ? '0 4px 18px rgba(0, 0, 0, 0.08)' : 'none'
                                                }}
                                            >
                                                <div style={{
                                                    height: '75px',
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
                                                        background: isSelected ? '#121613' : 'rgba(0,0,0,0.6)',
                                                        color: isSelected ? '#D5ED55' : '#FFFFFF',
                                                        fontSize: '9.5px',
                                                        fontWeight: '800',
                                                        padding: '2px 7px',
                                                        borderRadius: '999px'
                                                    }}>
                                                        {pkg.badge || pkg.tag || 'Verified'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', lineHeight: 1.3, marginBottom: '4px' }}>
                                                    {pkg.shortTitle || pkg.title}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#59655D', marginBottom: '6px' }}>
                                                    {pkg.location}
                                                </div>
                                                <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#121613' }}>
                                                    Starts ₹{pkg.price.toLocaleString('en-IN')} <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#59655D' }}>/ camper</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 2: Room Types & Accommodation Selector (NEW USER REQUIREMENT) */}
                            <div style={{ marginBottom: '24px', padding: '18px 20px', background: '#F8F9F5', borderRadius: '20px', border: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                            2. Choose Accommodation / Room Type
                                        </label>
                                        <span style={{ fontSize: '12px', color: '#59655D' }}>
                                            Available at {currentPkg.shortTitle || currentPkg.title}
                                        </span>
                                    </div>
                                    <span style={{ background: '#121613', color: '#D5ED55', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                        {availableRooms.length} Stay Options
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                                    {availableRooms.map((room) => {
                                        const isRoomSelected = room.id === selectedRoomId;
                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => setSelectedRoomId(room.id)}
                                                style={{
                                                    borderRadius: '16px',
                                                    border: isRoomSelected ? '2px solid #166534' : '1px solid rgba(18, 22, 19, 0.1)',
                                                    background: isRoomSelected ? '#FFFFFF' : '#FFFFFF',
                                                    padding: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    boxShadow: isRoomSelected ? '0 8px 24px rgba(22, 101, 52, 0.12)' : '0 2px 6px rgba(0,0,0,0.02)',
                                                    position: 'relative'
                                                }}
                                            >
                                                {/* Selected Pill Indicator */}
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

                                                {/* Image Thumbnail & Details */}
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                                                    {room.image && (
                                                        <img
                                                            src={room.image}
                                                            alt={room.name}
                                                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                                                        />
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '600', marginBottom: '2px' }}>
                                                            👥 {room.capacity || '2-4 Guests'}
                                                        </div>
                                                        <div style={{ fontSize: '14.5px', fontWeight: '900', color: '#166534' }}>
                                                            ₹{room.price?.toLocaleString('en-IN')} <span style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>/ camper</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Feature highlights */}
                                                {room.features && room.features.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                        {room.features.slice(0, 2).map((ft, fIdx) => (
                                                            <span key={fIdx} style={{ fontSize: '10.5px', background: '#F1F3EC', color: '#121613', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
                                                                ✓ {ft}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 3: Date & Guests Layout */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        3. Check-In Date or Batch
                                    </label>
                                    <CustomDateBatchPicker
                                        label="Check-In Weekend Batch or Date"
                                        selectedDate={travelDate || 'Aug 22 – 23, 2026'}
                                        onDateChange={(date) => {
                                            setTravelDate(date);
                                            setValidationError('');
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            4. Number of Campers
                                        </label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ flex: 1, padding: '12px', background: '#F8F9F5', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Adults (12+ yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '16px', fontWeight: '800' }}>{adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAdults(adults + 1)}
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, padding: '12px', background: '#F8F9F5', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Kids (5–11 yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '16px', fontWeight: '800' }}>{children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setChildren(children + 1)}
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Preview Card */}
                                    <div style={{ marginTop: 'auto', padding: '16px', background: '#121613', borderRadius: '20px', color: '#FFFFFF' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#A2B6A6' }}>
                                            <span>{currentRoom?.name || 'Selected Room'}:</span>
                                            <span>₹{roomPricePerPerson.toLocaleString('en-IN')}/pax</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: '#A2B6A6' }}>
                                            <span>Base Rate ({totalGuests} Campers):</span>
                                            <span>₹{baseTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        {discountPercent > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: '#D5ED55' }}>
                                                <span>Squad Discount ({discountPercent}%):</span>
                                                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700' }}>Estimated Total:</span>
                                            <span style={{ fontSize: '20px', fontWeight: '900', color: '#D5ED55' }}>
                                                ₹{(baseTotal - discountAmount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1 Actions */}
                            <div className="booking-step-actions">
                                <button
                                    type="button"
                                    onClick={handleProceedToStep2}
                                    className="btn-lime"
                                    style={{
                                        padding: '14px 34px',
                                        fontSize: '15px',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>Continue to Add-Ons & Explorer Details</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Step 2: Addons & Explorer Details */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    Enhance Your Mountain Experience (Optional Add-ons)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
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
                                                    padding: '12px 14px',
                                                    borderRadius: '14px',
                                                    border: isChecked ? '2px solid #121613' : '1px solid rgba(0,0,0,0.08)',
                                                    background: isChecked ? '#F4F7EB' : '#FFFFFF',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleAddon(addon.id)}
                                                        style={{ width: '17px', height: '17px', accentColor: '#121613', cursor: 'pointer' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#121613' }}>
                                                            {addon.icon} {addon.name}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#59655D' }}>
                                                            +₹{addon.price} {addon.perPerson ? '/ person' : 'flat fee'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Explorer Details Form */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    Lead Explorer Contact Information
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px', marginBottom: '12px' }}>
                                    <div>
                                        <input
                                            type="text"
                                            className="booking-modal-input"
                                            placeholder="Your Full Name *"
                                            value={customerName}
                                            onChange={(e) => {
                                                setCustomerName(e.target.value);
                                                if (validationError) setValidationError('');
                                            }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            className="booking-modal-input"
                                            placeholder="WhatsApp Number (e.g. +91 9400...) *"
                                            value={customerPhone}
                                            onChange={(e) => {
                                                setCustomerPhone(e.target.value);
                                                if (validationError) setValidationError('');
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className="booking-modal-input"
                                    placeholder="Special requests (e.g. Dietary preferences, campfire acoustic guitar, sunrise wake-up call)"
                                    value={specialNotes}
                                    onChange={(e) => setSpecialNotes(e.target.value)}
                                    rows={2}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Summary Box with Room Type Details */}
                            <div style={{
                                padding: '18px 20px',
                                background: '#121613',
                                borderRadius: '20px',
                                color: '#FFFFFF',
                                marginBottom: '22px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                    <span style={{ color: '#A2B6A6' }}>{currentPkg.title}:</span>
                                    <span>₹{(baseTotal - discountAmount).toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12.5px', color: '#D5ED55' }}>
                                    <span>🛏️ {currentRoom?.name || 'Selected Room'} ({totalGuests} Campers):</span>
                                    <span>₹{roomPricePerPerson.toLocaleString('en-IN')}/pax</span>
                                </div>
                                {addonsTotal > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#D5ED55' }}>
                                        <span>Selected Add-ons ({selectedAddons.length}):</span>
                                        <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '800' }}>Grand Total Payable:</div>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Pay 20% advance on WhatsApp to confirm permits</div>
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#D5ED55' }}>
                                        ₹{grandTotal.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="booking-step-actions">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#59655D',
                                        cursor: 'pointer',
                                        padding: '10px 16px'
                                    }}
                                >
                                    ← Back to Selection
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmBookingWhatsApp}
                                    className="btn-lime"
                                    style={{
                                        padding: '15px 36px',
                                        fontSize: '15px',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                    <span>Instant Reserve on WhatsApp ↗</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
