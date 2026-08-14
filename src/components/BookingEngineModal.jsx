"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';

const PACKAGES_LIST = [
    {
        id: 'kolukkumalai',
        title: 'Kolukkumalai Sunrise 4x4 Expedition',
        location: 'Munnar · 7,900 FT',
        price: 2499,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        badge: 'Bestseller'
    },
    {
        id: 'suryanelli',
        title: 'Suryanelli Valley Ridge Glamping',
        location: 'Suryanelli · 6,500 FT',
        price: 1999,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        badge: 'Private Pods'
    },
    {
        id: 'phantom',
        title: 'Phantom Head Sunset Peak Trek',
        location: 'Munnar · 6,800 FT',
        price: 1799,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        badge: 'Guided Trek'
    },
    {
        id: 'vagamon',
        title: 'Vagamon Pine Valley & Paragliding Camp',
        location: 'Vagamon · 4,800 FT',
        price: 2299,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
        badge: 'Mist Valley'
    },
    {
        id: 'wayanad',
        title: 'Wayanad 900 Kandi Rain Canopy Camp',
        location: 'Wayanad · 3,200 FT',
        price: 2699,
        duration: '2D / 1N',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        badge: 'Tree Canopy'
    }
];

const ADDONS_LIST = [
    { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true, icon: '🔥' },
    { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false, icon: '🚙' },
    { id: 'drone', name: '4K Drone Mountain Video Reel', price: 1500, perPerson: false, icon: '📸' },
    { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true, icon: '🧘' },
    { id: 'guitar', name: 'Acoustic Guitarist for Campfire', price: 2000, perPerson: false, icon: '🎸' }
];

export default function BookingEngineModal({ isOpen, onClose, initialPackage }) {
    const [selectedPkgId, setSelectedPkgId] = useState(initialPackage ? (PACKAGES_LIST.find(p => p.title === initialPackage.title)?.id || 'kolukkumalai') : 'kolukkumalai');
    const [travelDate, setTravelDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [selectedAddons, setSelectedAddons] = useState(['bbq']);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [step, setStep] = useState(1); // 1: Package & Details, 2: Addons & Review

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

    const handleConfirmBookingWhatsApp = (e) => {
        e.preventDefault();
        const selectedAddonNames = selectedAddons.map(id => ADDONS_LIST.find(a => a.id === id)?.name).filter(Boolean);
        
        const summaryText = `🏕️ *NEW AANANDHAM.GO RESERVATION REQUEST*\n\n` +
            `📍 *Expedition:* ${currentPkg.title}\n` +
            `📅 *Date:* ${travelDate || 'Flexible / Upcoming Weekend'}\n` +
            `👥 *Guests:* ${adults} Adults${children > 0 ? `, ${children} Children` : ''} (Total: ${totalGuests})\n` +
            `✨ *Add-ons:* ${selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'None'}\n` +
            `💰 *Est. Total:* ₹${grandTotal.toLocaleString('en-IN')}${discountPercent > 0 ? ` (Includes ${discountPercent}% Squad Discount!)` : ''}\n\n` +
            `👤 *Name:* ${customerName || 'Explorer'}\n` +
            `📞 *Phone:* ${customerPhone || 'Not provided'}\n` +
            `📝 *Notes:* ${specialNotes || 'None'}\n\n` +
            `Please confirm campsite availability & payment link! 🏔️`;

        const encoded = encodeURIComponent(summaryText);
        window.open(`https://wa.me/919400987654?text=${encoded}`, '_blank');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="modal-rounded-card"
                style={{
                    background: '#FFFFFF',
                    width: '100%',
                    maxWidth: '860px',
                    maxHeight: 'min(90vh, 840px)',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
                    position: 'relative',
                    color: '#121613'
                }}
            >
                {/* Modal Header */}
                <div style={{
                    padding: '22px 32px',
                    borderBottom: '1px solid rgba(18, 22, 19, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#F8F9F5',
                    flexShrink: 0
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="live-beacon"></span>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#59655D', textTransform: 'uppercase' }}>
                                AANANDHAM.GO INSTANT BOOKING ENGINE
                            </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '4px 0 0', color: '#121613' }}>
                            {step === 1 ? 'Select Campsite & Travel Dates' : 'Customize Experience & Confirm'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#FFFFFF',
                            border: '1px solid rgba(18, 22, 19, 0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            color: '#121613',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#F1F3EC'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-rounded-body" style={{ flex: 1, padding: '32px' }}>
                    {step === 1 ? (
                        <div>
                            {/* Step 1: Package Grid */}
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#59655D', display: 'block', marginBottom: '14px' }}>
                                1. CHOOSE EXPEDITION / CAMP
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '14px',
                                marginBottom: '28px'
                            }}>
                                {PACKAGES_LIST.map((pkg) => {
                                    const isSelected = pkg.id === selectedPkgId;
                                    return (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPkgId(pkg.id)}
                                            style={{
                                                border: isSelected ? '2px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                background: isSelected ? '#F8F9F5' : '#FFFFFF',
                                                borderRadius: '20px',
                                                padding: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                                boxShadow: isSelected ? '0 8px 25px rgba(0,0,0,0.06)' : 'none'
                                            }}
                                        >
                                            <div style={{ height: '100px', borderRadius: '14px', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                                                <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    background: isSelected ? '#D5ED55' : 'rgba(0,0,0,0.6)',
                                                    color: isSelected ? '#121613' : '#FFFFFF',
                                                    fontSize: '10px',
                                                    fontWeight: '800',
                                                    padding: '3px 8px',
                                                    borderRadius: '999px'
                                                }}>
                                                    {pkg.badge}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#121613', lineHeight: 1.3, marginBottom: '4px' }}>
                                                {pkg.title}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                                <span style={{ fontSize: '11.5px', color: '#8E9B92' }}>{pkg.location}</span>
                                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>₹{pkg.price}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Step 1: Dates & Guests */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                                <div>
                                    <CustomThemeCalendar
                                        selectedDate={travelDate}
                                        onDateSelect={(date) => setTravelDate(date)}
                                        theme="light"
                                        label="2. TRAVEL DATE"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#59655D', display: 'block', marginBottom: '8px' }}>
                                        3. ADULTS (12+ YRS)
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                            style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(18,22,19,0.15)', background: '#F8F9F5', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
                                        >-</button>
                                        <span style={{ fontSize: '16px', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{adults}</span>
                                        <button
                                            type="button"
                                            onClick={() => setAdults(adults + 1)}
                                            style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(18,22,19,0.15)', background: '#F8F9F5', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
                                        >+</button>
                                        {discountPercent > 0 && (
                                            <span style={{ background: '#D5ED55', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                                {discountPercent}% SQUAD DISCOUNT!
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#59655D', display: 'block', marginBottom: '8px' }}>
                                        4. CHILDREN (5-11 YRS)
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                            style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(18,22,19,0.15)', background: '#F8F9F5', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
                                        >-</button>
                                        <span style={{ fontSize: '16px', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{children}</span>
                                        <button
                                            type="button"
                                            onClick={() => setChildren(children + 1)}
                                            style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(18,22,19,0.15)', background: '#F8F9F5', fontSize: '18px', fontWeight: '700', cursor: 'pointer' }}
                                        >+</button>
                                        <span style={{ fontSize: '12px', color: '#8E9B92' }}>50% off</span>
                                    </div>
                                </div>
                            </div>

                            {/* Proceed to Step 2 Button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(18,22,19,0.08)', paddingTop: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#8E9B92' }}>Estimated Base Rate</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#121613' }}>
                                        ₹{(baseTotal - discountAmount).toLocaleString('en-IN')}
                                        <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '500' }}> for {totalGuests} guests</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn-lime"
                                    style={{ padding: '14px 36px', fontSize: '15px', fontWeight: '800' }}
                                >
                                    Customize Add-ons & Review ↗
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Step 2: Experience Add-ons */}
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#59655D', display: 'block', marginBottom: '14px' }}>
                                SELECT LUXURY & ADVENTURE ADD-ONS
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                                {ADDONS_LIST.map((addon) => {
                                    const isChecked = selectedAddons.includes(addon.id);
                                    return (
                                        <div
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            style={{
                                                padding: '14px 18px',
                                                borderRadius: '18px',
                                                border: isChecked ? '2px solid #121613' : '1px solid rgba(18,22,19,0.1)',
                                                background: isChecked ? '#F8F9F5' : '#FFFFFF',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '20px' }}>{addon.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#121613' }}>{addon.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#8E9B92' }}>
                                                        +₹{addon.price} {addon.perPerson ? '/ person' : '/ group'}
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {}}
                                                style={{ width: '18px', height: '18px', accentColor: '#121613', cursor: 'pointer' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Contact Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', display: 'block', marginBottom: '6px' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Nair"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.15)', fontSize: '13.5px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#59655D', display: 'block', marginBottom: '6px' }}>
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="e.g. +91 98765 43210"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.15)', fontSize: '13.5px', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Summary Receipt Card */}
                            <div style={{
                                background: '#101E13',
                                color: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '24px',
                                marginBottom: '24px',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>{currentPkg.title}</div>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6' }}>{travelDate || 'Selected Dates'} · {totalGuests} Guests</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#D5ED55' }}>
                                            ₹{grandTotal.toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6' }}>All-Inclusive Est.</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#A2B6A6', marginBottom: '6px' }}>
                                    <span>Base Stay & Summit Expedition:</span>
                                    <span style={{ color: '#FFFFFF' }}>₹{baseTotal.toLocaleString('en-IN')}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#D5ED55', marginBottom: '6px' }}>
                                        <span>Squad Discount ({discountPercent}%):</span>
                                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {addonsTotal > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#A2B6A6', marginBottom: '6px' }}>
                                        <span>Custom Add-ons Total:</span>
                                        <span style={{ color: '#FFFFFF' }}>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '10px 16px' }}
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
