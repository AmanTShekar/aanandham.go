"use client";
import React, { useState } from 'react';
import { Users, Tent, Sparkles, ArrowRight, Minus, Plus, AlertCircle } from 'lucide-react';
import CustomThemeCalendar from '../CustomThemeCalendar';
import CustomDateBatchPicker from '../CustomDateBatchPicker';
import LucideAmenityIcon from '../common/LucideAmenityIcon';
import VerifiedStayBadge from '../common/VerifiedStayBadge';
import { inr } from '../../lib/utils';
import { parseRoomCapacity } from './BookingConstants';
import BookingValidationPopup from './BookingValidationPopup';

export default function Step1CampsiteLodging({
    campsList = [],
    selectedPkgId,
    setSelectedPkgId,
    customUnits = null,
    setCustomUnits = () => {},
    selectedRoomId,
    setSelectedRoomId,
    selectedPkg,
    travelDate,
    setTravelDate,
    adults = 2,
    setAdults = () => {},
    children = 0,
    setChildren = () => {},
    totalGuests = 2,
    selectedRoom,
    autoRequiredUnits = 1,
    totalUnits = 1,
    totalRoomCapacity = 2,
    currentStepPrice = 0,
    handleStep1Next = () => {},
    discountLabel = '',
    setValidationError = () => {}
}) {
    const [step1Errors, setStep1Errors] = useState([]);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [isSwitchingCamp, setIsSwitchingCamp] = useState(false);

    const currentPkg = selectedPkg || campsList.find(p => p.id === selectedPkgId) || campsList[0] || {};
    const availableRooms = currentPkg.rooms || [];
    const currentRoom = selectedRoom || availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0] || {};
    const roomCapacity = currentRoom?.capacity ? parseRoomCapacity(currentRoom.capacity) : 2;
    const autoUnits = autoRequiredUnits || Math.max(1, Math.ceil((adults + children) / roomCapacity));
    const allocatedUnits = totalUnits !== undefined && totalUnits !== null ? totalUnits : autoUnits;
    const totalMaxCapacity = totalRoomCapacity || (allocatedUnits * roomCapacity);
    const activeDiscountLabel = typeof discountLabel === 'string' ? discountLabel : '';

    const isCampsiteMissing = hasAttemptedSubmit && !selectedPkgId;
    const isRoomMissing = hasAttemptedSubmit && (!selectedRoomId && !currentRoom?.id);
    const isDateMissing = hasAttemptedSubmit && !travelDate;

    const onProceedStep1 = () => {
        const errs = [];
        const activePkgId = selectedPkgId || currentPkg?.id;
        const activeRoomId = selectedRoomId || currentRoom?.id;

        if (!activePkgId) {
            errs.push({ field: 'campsite', label: 'Campsite Destination', message: 'Please select a destination campsite' });
        } else if (!selectedPkgId) {
            setSelectedPkgId(activePkgId);
        }

        if (!activeRoomId) {
            errs.push({ field: 'room', label: 'Lodging Style', message: 'Please select your lodging style (Tent / Dome)' });
        } else if (!selectedRoomId) {
            setSelectedRoomId(activeRoomId);
        }
        if (!travelDate) {
            errs.push({ field: 'date', label: 'Stay Date', message: 'Please select your check-in date' });
        }
        if (adults < 1) {
            errs.push({ field: 'guests', label: 'Campers', message: 'At least 1 adult camper is required' });
        }

        if (errs.length > 0) {
            setHasAttemptedSubmit(true);
            setStep1Errors(errs);
            setValidationError(errs.map(e => e.message).join(' · '));
            return;
        }

        setStep1Errors([]);
        setValidationError('');
        handleStep1Next();
    };

    return (
        <div>
            {/* Live Error Notification Popup */}
            {step1Errors.length > 0 && (
                <BookingValidationPopup
                    errors={step1Errors}
                    title="Please Complete Your Stay Selection"
                    onClose={() => setStep1Errors([])}
                />
            )}

            {/* Section 1: Sleek Confirmed Sanctuary & Lodging Card (Pure text & typography, zero images for fast frictionless booking) */}
            <div style={{
                marginBottom: '20px',
                background: '#F8FAF5',
                border: isCampsiteMissing ? '2px solid #DC2626' : '1.5px solid #166534',
                borderRadius: '18px',
                padding: '14px 18px',
                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.06)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <VerifiedStayBadge size="sm" />
                            {currentPkg.altitude && (
                                <span style={{ fontSize: '10px', fontWeight: '800', background: '#121613', color: '#D5ED55', padding: '2px 8px', borderRadius: '999px' }}>
                                    {currentPkg.altitude}
                                </span>
                            )}
                            <span style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '600' }}>
                                {currentPkg.location || 'Munnar, Kerala'}
                            </span>
                        </div>

                        <div style={{ fontSize: '16.5px', fontWeight: '900', color: '#121613', lineHeight: 1.3, marginBottom: '4px' }}>
                            {currentPkg.title || currentPkg.name}
                        </div>

                        <div style={{ fontSize: '12.5px', color: '#166534', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Tent size={14} color="#166534" />
                                <span>{currentRoom?.name || 'Alpine Tent'}</span>
                            </span>
                            <span style={{ color: '#7D8880', fontWeight: '600' }}>· {currentRoom?.capacity || '2 Campers'}</span>
                            <span style={{ color: '#121613', fontWeight: '900' }}>· ₹{(currentRoom?.price || currentPkg?.price || 2499).toLocaleString('en-IN')} / camper</span>
                        </div>
                    </div>

                    {/* Compact controls: Lodging Style selector & Switch Camp button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {availableRooms.length > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <label htmlFor="booking-lodging-select" style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase' }}>
                                    Style:
                                </label>
                                <select
                                    id="booking-lodging-select"
                                    value={selectedRoomId || currentRoom?.id}
                                    onChange={(e) => {
                                        setSelectedRoomId(e.target.value);
                                        setCustomUnits(null);
                                    }}
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1.5px solid rgba(22, 101, 52, 0.3)',
                                        borderRadius: '10px',
                                        padding: '6px 10px',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        color: '#121613',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    {availableRooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} — ₹{(r.price || r.pricePerPerson || currentPkg.price || 2499).toLocaleString('en-IN')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsSwitchingCamp(prev => !prev)}
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.15)',
                                borderRadius: '10px',
                                padding: '6px 12px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                color: '#121613',
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {isSwitchingCamp ? 'Close ▴' : 'Change Sanctuary ▾'}
                        </button>
                    </div>
                </div>

                {/* Collapsible Destination Sanctuary Switcher (clean dropdown, zero images) */}
                {isSwitchingCamp && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(22, 101, 52, 0.25)' }}>
                        <label htmlFor="booking-campsite-select" style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                            Choose Basecamp Destination:
                        </label>
                        <select
                            id="booking-campsite-select"
                            value={selectedPkgId || currentPkg?.id}
                            onChange={(e) => {
                                const newId = e.target.value;
                                setSelectedPkgId(newId);
                                const newCamp = campsList.find(c => c.id === newId);
                                if (newCamp?.rooms?.[0]) {
                                    setSelectedRoomId(newCamp.rooms[0].id);
                                }
                                setCustomUnits(null);
                                setIsSwitchingCamp(false);
                            }}
                            style={{
                                width: '100%',
                                background: '#FFFFFF',
                                border: '1.5px solid #166534',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#121613',
                                cursor: 'pointer'
                            }}
                        >
                            {campsList.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.title || c.name} — Starts ₹{c.price?.toLocaleString('en-IN')} ({c.location})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Section 2: Date & Guests Setup */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <div style={{
                                    border: isDateMissing ? '2px solid #DC2626' : '1px solid transparent',
                                    borderRadius: '16px',
                                    padding: isDateMissing ? '12px' : 0,
                                    background: isDateMissing ? '#FEF2F2' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDateMissing ? '#DC2626' : '#59655D', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        Stay Date *
                                    </label>
                                    <CustomDateBatchPicker
                                        label="Check-In Date"
                                        selectedDate={travelDate || getDefaultUpcomingBatch()}
                                        onDateChange={(date) => {
                                            setTravelDate(date);
                                            setValidationError('');
                                            setStep1Errors(prev => prev.filter(e => e.field !== 'date'));
                                        }}
                                    />
                                    {isDateMissing && (
                                        <div className="custom-field-error-pill" style={{ marginTop: '8px' }}>
                                            <AlertCircle size={13} />
                                            <span>Please select your stay check-in date</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                Campers
                                            </label>
                                            <span style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>
                                                {activeDiscountLabel ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sparkles size={11} /> {activeDiscountLabel}</span> : 'Standard Fare'}
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
                                                        aria-label="Decrease adult count"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setAdults(adults + 1); setCustomUnits(null); }}
                                                        aria-label="Increase adult count"
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
                                                        aria-label="Decrease children count"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setChildren(children + 1); setCustomUnits(null); }}
                                                        aria-label="Increase children count"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Auto Stay Allocation Info */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#F4F7EB',
                                        borderRadius: '12px',
                                        padding: '8px 12px',
                                        border: '1px solid rgba(22, 101, 52, 0.15)',
                                        fontSize: '11.5px',
                                        color: '#166534',
                                        fontWeight: '700'
                                    }}>
                                        <Tent size={14} color="#166534" strokeWidth={2.5} />
                                        <span>{allocatedUnits} × {currentRoom?.name || 'Tent'} auto-allocated ({totalMaxCapacity} camper capacity)</span>
                                    </div>
                                </div>
                            </div>

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <button
                                            type="button"
                                            onClick={onProceedStep1}
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
