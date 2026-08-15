"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';
import { inr } from '../lib/utils';
import { waLink } from '../lib/whatsapp';

const PACKAGES_LIST = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise & Cloud Bed Ridge Glamp',
        location: 'Suryanelli / Kolukkumalai · 7,900 FT',
        price: 2499,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        badge: 'Bestseller'
    },
    {
        id: 'pkg-meesapulimala',
        title: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        location: 'Silent Valley, Munnar · 8,661 FT',
        price: 3199,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        badge: 'Summit Challenge'
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Ridge Geodesic Glamping',
        location: 'Suryanelli, Idukki · 6,500 FT',
        price: 1999,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        badge: 'Geodesic Pods'
    },
    {
        id: 'pkg-phantom',
        title: 'Phantom Head Peak & Golden Hour Sunset Trek',
        location: 'Munnar Ridge · 6,800 FT',
        price: 1799,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        badge: 'Golden Sunset'
    },
    {
        id: 'pkg-chembra',
        title: 'Wayanad Chembra Peak & Heart Lake Expedition',
        location: 'Meppadi, Wayanad · 6,900 FT',
        price: 3799,
        duration: '3D / 2N',
        image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80',
        badge: 'Heart Lake Trek'
    },
    {
        id: 'pkg-wayanad',
        title: 'Wayanad 900 Kandi Rainforest Glass Bridge Glamp',
        location: 'Meppadi, Wayanad · 3,200 FT',
        price: 2699,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        badge: 'Glass Bridge'
    },
    {
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        location: 'Pine Forest, Vagamon · 4,800 FT',
        price: 2199,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
        badge: 'Pine Forest'
    },
    {
        id: 'pkg-athirappilly',
        title: 'Athirappilly Jungle Rapids & Riverbank Glamping',
        location: 'Chalakudy River, Athirappilly · 1,200 FT',
        price: 2499,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80',
        badge: 'River Rapids'
    }
];

const ADDONS_LIST = [
    { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true, icon: '🔥' },
    { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false, icon: '🚙' },
    { id: 'drone', name: '4K Drone Mountain Video Reel Shoot', price: 1500, perPerson: false, icon: '📸' },
    { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true, icon: '🧘' },
    { id: 'guitar', name: 'Acoustic Guitarist for Campfire Circle', price: 2000, perPerson: false, icon: '🎸' }
];

export default function BookingEngineModal({ isOpen, onClose, initialPackage }) {
    const [selectedPkgId, setSelectedPkgId] = useState('pkg-kolukkumalai');
    const [travelDate, setTravelDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [selectedAddons, setSelectedAddons] = useState(['bbq']);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [step, setStep] = useState(1); // 1: Package & Details, 2: Addons & Review
    const [validationError, setValidationError] = useState('');

    // Synchronize selected package and reset step whenever modal opens or initialPackage updates
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setValidationError('');
            if (initialPackage) {
                const targetId = initialPackage.id || '';
                const targetTitle = (initialPackage.title || '').toLowerCase();
                const matched = PACKAGES_LIST.find(p => 
                    p.id === targetId || 
                    p.id === `pkg-${targetId}` ||
                    p.id.replace('pkg-', '') === targetId.replace('pkg-', '') ||
                    p.title.toLowerCase() === targetTitle ||
                    p.title.toLowerCase().includes(targetTitle.slice(0, 12)) ||
                    targetTitle.includes(p.title.toLowerCase().slice(0, 12))
                );
                if (matched) {
                    setSelectedPkgId(matched.id);
                }
            }
        }
    }, [isOpen, initialPackage]);

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

    const currentPkg = PACKAGES_LIST.find(p => p.id === selectedPkgId) || PACKAGES_LIST[0];
    const totalGuests = adults + children;

    // Price Calculations
    const baseTotal = (currentPkg.price * adults) + (Math.round(currentPkg.price * 0.5) * children);
    
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
                package: targetPackage.title,
                region: targetPackage.region || (targetPackage.location ? targetPackage.location.split(',')[0].trim() : 'Munnar'),
                dates: travelDate || 'Flexible / Upcoming Weekend',
                guests: totalGuests,
                roomType: selectedRoom ? selectedRoom.name : 'Standard Mountain Glamp',
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
        } catch (e) {
            console.error('Error persisting booking:', e);
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
                            {step === 1 ? '1. Select Campsite & Dates' : '2. Add-Ons & Explorer Details'}
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
                            {/* Package Selector (Horizontal Cards) */}
                            <div style={{ marginBottom: '22px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    Select Signature Campsite (8 Destinations)
                                </label>
                                <div className="booking-pkgs-grid">
                                    {PACKAGES_LIST.map((pkg) => {
                                        const isSelected = pkg.id === selectedPkgId;
                                        return (
                                            <div
                                                key={pkg.id}
                                                onClick={() => setSelectedPkgId(pkg.id)}
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
                                                        {pkg.badge}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', lineHeight: 1.3, marginBottom: '4px' }}>
                                                    {pkg.title}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#59655D', marginBottom: '6px' }}>
                                                    {pkg.location}
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#121613' }}>
                                                    ₹{pkg.price.toLocaleString('en-IN')} <span style={{ fontSize: '11px', fontWeight: '600', color: '#59655D' }}>/ camper</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Date & Guests Layout */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        Check-In Date
                                    </label>
                                    <CustomThemeCalendar 
                                        selectedDate={travelDate} 
                                        onDateSelect={(date) => {
                                            setTravelDate(date);
                                            setValidationError('');
                                        }}
                                        onSelectDate={(date) => {
                                            setTravelDate(date);
                                            setValidationError('');
                                        }} 
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            Number of Campers
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

                            {/* Summary Box */}
                            <div style={{
                                padding: '16px 20px',
                                background: '#121613',
                                borderRadius: '20px',
                                color: '#FFFFFF',
                                marginBottom: '22px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                    <span style={{ color: '#A2B6A6' }}>{currentPkg.title} ({totalGuests} Campers):</span>
                                    <span>₹{(baseTotal - discountAmount).toLocaleString('en-IN')}</span>
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
