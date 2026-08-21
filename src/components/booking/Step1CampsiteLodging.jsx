"use client";
import React from 'react';
import { Users, Tent, Sparkles, ArrowRight, Minus, Plus } from 'lucide-react';
import CustomThemeCalendar from '../CustomThemeCalendar';
import CustomDateBatchPicker from '../CustomDateBatchPicker';
import LucideAmenityIcon from '../common/LucideAmenityIcon';
import { inr } from '../../lib/utils';
import { parseRoomCapacity } from './BookingConstants';

export default function Step1CampsiteLodging({
    campsList,
    selectedPkgId,
    setSelectedPkgId,
    setCustomUnits,
    setSelectedRoomId,
    selectedPkg,
    travelDate,
    setTravelDate,
    adults,
    setAdults,
    children,
    setChildren,
    totalGuests,
    selectedRoom,
    autoRequiredUnits,
    totalUnits,
    totalRoomCapacity,
    currentStepPrice,
    handleStep1Next
}) {
    return (
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
    );
}
