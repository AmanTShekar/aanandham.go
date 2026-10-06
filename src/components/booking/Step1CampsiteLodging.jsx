"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Tent, Sparkles, ArrowRight, Minus, Plus, AlertCircle, Building2, Home, Compass, Bed, Trees, Mountain, Landmark, BedDouble, Bath, ImageOff, Check } from 'lucide-react';
import CustomThemeCalendar from '../CustomThemeCalendar';
import CustomDateBatchPicker from '../CustomDateBatchPicker';
import LucideAmenityIcon from '../common/LucideAmenityIcon';
import VerifiedStayBadge from '../common/VerifiedStayBadge';
import { inr, getDefaultUpcomingBatch } from '../../lib/utils';
import { parseRoomCapacity } from './BookingConstants';
import BookingValidationPopup from './BookingValidationPopup';
import { resolvePropertyType, getPricingUnitLabel, getInventoryTypeMeta } from '../../lib/propertyStayTypes';

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
    const [liveInventory, setLiveInventory] = useState({});
    const [isCheckingInventory, setIsCheckingInventory] = useState(false);
    const [liveCapAlert, setLiveCapAlert] = useState(false);

    const currentPkg = selectedPkg || campsList.find(p => p.id === selectedPkgId) || campsList[0] || {};

    // Fetch live PMS availability whenever the selected camp or travel date changes
    useEffect(() => {
        const campId = currentPkg?.id;
        if (!campId || !travelDate) return;
        let isMounted = true;
        setIsCheckingInventory(true);
        fetch(`/api/camps/${encodeURIComponent(campId)}/availability?date=${encodeURIComponent(travelDate)}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (isMounted && data.success && data.rooms) {
                    setLiveInventory(data.rooms);
                }
            })
            .catch(err => console.warn('[Step1] Failed to load live availability:', err))
            .finally(() => { if (isMounted) setIsCheckingInventory(false); });
        return () => { isMounted = false; };
    }, [currentPkg?.id, travelDate]);

    const typeMeta = resolvePropertyType(currentPkg.propertyTypeSlug || currentPkg.propertyType?.slug || currentPkg.category, currentPkg.title);
    const availableRooms = (currentPkg.rooms && currentPkg.rooms.length > 0) ? currentPkg.rooms : [
        {
            id: `${currentPkg.id || 'stay'}-primary`,
            name: `${currentPkg.title || 'Selected Stay'} · ${typeMeta.unitTerm}`,
            capacity: '2 Guests',
            price: currentPkg.price,
            features: typeMeta.defaultAmenities.slice(0, 2),
            inventoryType: typeMeta.id === 'campsite' ? 'GLAMP_DOME' : 'PRIVATE_UNIT',
            bedConfig: typeMeta.id === 'hostel' ? '1 Single Bed' : '1 King Bed',
            pricingModel: typeMeta.id === 'hostel' ? 'PER_BED' : (typeMeta.id === 'campsite' ? 'per_guest_night' : 'PER_ROOM')
        }
    ];
    const currentRoom = selectedRoom || availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0] || {};
    const roomCapacity = currentRoom?.capacity ? parseRoomCapacity(currentRoom.capacity) : 2;

    const isCurrentRoomDorm = String(currentRoom?.name || '').toLowerCase().includes('dorm') ||
        String(currentRoom?.name || '').toLowerCase().includes('bunk') ||
        String(currentRoom?.inventoryType || '').toUpperCase() === 'DORM_BED' ||
        String(currentRoom?.pricingModel || '').toUpperCase() === 'PER_BED';

    const maxAllowedCapacity = useMemo(() => {
        if (!currentRoom) return 10;
        const liveRoom = liveInventory?.[currentRoom.id];
        if (isCurrentRoomDorm) {
            // Dorm: each unit = 1 bed, use live remaining count if available
            if (liveRoom && typeof liveRoom.availableUnits === 'number') {
                return Math.max(0, liveRoom.availableUnits);
            }
            const units = Number(currentRoom.totalUnits) || 0;
            const capDigits = parseInt(String(currentRoom.capacity || '').match(/\d+/)?.[0] || '0', 10);
            const nameDigits = parseInt(String(currentRoom.name || '').match(/(\d+)\s*[- ]*(bed|bunk|person|sharing)/i)?.[1] || String(currentRoom.name || '').match(/\d+/)?.[0] || '0', 10);
            if (units > 1) return units;
            if (capDigits > 0) return capDigits;
            if (nameDigits > 0) return nameDigits;
            return 10;
        } else {
            const unitCap = parseRoomCapacity(currentRoom.capacity || currentRoom.guestCapacity || 2);
            const availableUnits = liveRoom && typeof liveRoom.availableUnits === 'number'
                ? liveRoom.availableUnits
                : Math.max(1, Number(currentRoom.totalUnits) || 3);
            return unitCap * availableUnits;
        }
    }, [currentRoom, isCurrentRoomDorm, liveInventory]);

    // Enforce dynamic capacity ceiling in booking modal
    useEffect(() => {
        if ((adults + children) > maxAllowedCapacity) {
            const newAdults = Math.max(1, maxAllowedCapacity - children);
            setAdults(newAdults);
        }
    }, [selectedRoomId, maxAllowedCapacity, adults, children, setAdults]);

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
            errs.push({ field: 'campsite', label: 'Property / Sanctuary', message: 'Please select a destination property' });
        } else if (!selectedPkgId) {
            setSelectedPkgId(activePkgId);
        }

        if (!activeRoomId) {
            errs.push({ field: 'room', label: typeMeta.unitTerm, message: `Please select your ${typeMeta.unitTerm.toLowerCase()}` });
        } else if (!selectedRoomId) {
            setSelectedRoomId(activeRoomId);
        }
        if (!travelDate) {
            errs.push({ field: 'date', label: 'Stay Date', message: 'Please select your check-in date' });
        }
        if (adults < 1) {
            errs.push({ field: 'guests', label: typeMeta.id === 'campsite' ? 'Campers' : 'Guests', message: `At least 1 adult ${typeMeta.id === 'campsite' ? 'camper' : 'guest'} is required` });
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

            {/* Section 1: Confirmed Sanctuary & Custom Lodging Options Selection */}
            <div style={{
                marginBottom: '20px',
                background: '#F8FAF5',
                border: isCampsiteMissing ? '2px solid #DC2626' : '1.5px solid #166534',
                borderRadius: '18px',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.06)'
            }}>
                {/* Stay Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                        {currentPkg.image && (
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundImage: `url(${currentPkg.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                flexShrink: 0,
                                border: '1px solid rgba(0,0,0,0.08)'
                            }} />
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                                {((currentPkg.region === 'Himachal') ||
                                    String(currentPkg.location || '').toLowerCase().includes('himachal') ||
                                    String(currentPkg.location || '').toLowerCase().includes('kasol') ||
                                    String(currentPkg.location || '').toLowerCase().includes('kalga') ||
                                    String(currentPkg.title || currentPkg.name || '').toLowerCase().includes('nest') ||
                                    String(currentPkg.title || currentPkg.name || '').toLowerCase().includes('teddy') ||
                                    currentPkg.id === 'cmu7f7c7q0001jf2bn12igi66' ||
                                    currentPkg.id === 'the-nest-kalga' ||
                                    currentPkg.id === 'teddys') ? (
                                    <span style={{
                                        fontSize: '9.5px',
                                        fontWeight: '900',
                                        background: 'linear-gradient(135deg, #0B1A0E, #121E15)',
                                        color: '#D5ED55',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(213,237,85,0.3)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3.5px'
                                    }}>
                                        <span style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: '#D5ED55',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={7} color="#121613" strokeWidth={3.5} />
                                        </span>
                                        by Aanandham.Stays
                                    </span>
                                ) : (
                                    <span style={{
                                        fontSize: '9.5px',
                                        fontWeight: '900',
                                        background: '#121613',
                                        color: '#D5ED55',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(213,237,85,0.25)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3.5px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.18)'
                                    }}>
                                        <span style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: '#D5ED55',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={7} color="#121613" strokeWidth={3.5} />
                                        </span>
                                        Verified
                                    </span>
                                )}
                                <span style={{ fontSize: '9.5px', fontWeight: '800', background: '#121613', color: '#D5ED55', padding: '1px 7px', borderRadius: '999px' }}>
                                    {currentPkg.propertyType?.label || typeMeta.badge || typeMeta.label}
                                </span>
                                {currentPkg.altitude && (
                                    <span style={{ fontSize: '9.5px', fontWeight: '800', background: '#E5A93B', color: '#121613', padding: '1px 7px', borderRadius: '999px' }}>
                                        {currentPkg.altitude}
                                    </span>
                                )}
                                <span style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>
                                    {currentPkg.location || 'Munnar, Kerala'}
                                </span>
                            </div>

                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613', lineHeight: 1.25 }}>
                                {currentPkg.title || currentPkg.name}
                            </div>
                        </div>
                    </div>

                    {/* Change Sanctuary Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setIsSwitchingCamp(prev => !prev)}
                            style={{
                                background: isSwitchingCamp ? '#121613' : '#FFFFFF',
                                border: isSwitchingCamp ? '1px solid #121613' : '1px solid rgba(18, 22, 19, 0.15)',
                                borderRadius: '10px',
                                padding: '5px 12px',
                                fontSize: '11px',
                                fontWeight: '800',
                                color: isSwitchingCamp ? '#FFFFFF' : '#121613',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {isSwitchingCamp ? 'Close ✕' : 'Change Sanctuary ▾'}
                        </button>
                    </div>
                </div>

                {/* Collapsible Destination Sanctuary Switcher Grid */}
                {isSwitchingCamp && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed rgba(22, 101, 52, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Switch Destination Basecamp:
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSwitchingCamp(false)}
                                aria-label="Close basecamp switcher"
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(18,22,19,0.12)',
                                    background: '#FFFFFF',
                                    color: '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                            {campsList.map((c) => {
                                const isCampSelected = (selectedPkgId || currentPkg?.id) === c.id;
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => {
                                            setSelectedPkgId(c.id);
                                            if (c.rooms?.[0]) {
                                                setSelectedRoomId(c.rooms[0].id);
                                            }
                                            setCustomUnits(null);
                                            setIsSwitchingCamp(false);
                                        }}
                                        style={{
                                            padding: '8px 10px',
                                            borderRadius: '10px',
                                            border: isCampSelected ? '1.5px solid #166534' : '1px solid rgba(18, 22, 19, 0.1)',
                                            background: isCampSelected ? '#F4F7EB' : '#FFFFFF',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            border: isCampSelected ? '4.5px solid #166534' : '1.5px solid rgba(18,22,19,0.25)',
                                            background: '#FFFFFF',
                                            flexShrink: 0
                                        }} />
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {c.title || c.name}
                                            </div>
                                            <div style={{ fontSize: '10.5px', color: '#59655D' }}>
                                                Starts ₹{(c.price || 1899).toLocaleString('en-IN')} · {c.location}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── CUSTOM UI LODGING STYLE OPTIONS (RADIO CARDS) ── */}
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Choose {typeMeta.unitTerm} ({availableRooms.length} Available)
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '8px' }}>
                        {availableRooms.map((room) => {
                            const isRoomSelected = (selectedRoomId || currentRoom?.id) === room.id;
                            const roomCap = room.capacity ? parseRoomCapacity(room.capacity) : 2;
                            const isDorm = String(room?.name || '').toLowerCase().includes('dorm') ||
                                           String(room?.name || '').toLowerCase().includes('bunk') ||
                                           room.pricingModel === 'PER_BED' ||
                                           room.inventoryType === 'DORM_BED';
                            const isRoomLevel = !isDorm && (
                                room.pricingModel === 'PER_ROOM' ||
                                room.pricingModel === 'per_room_night' ||
                                (typeMeta.id !== 'campsite' && typeMeta.id !== 'hostel' && room.pricingModel !== 'PER_BED')
                            );
                            const priceSuffix = isDorm ? '/ bed' : (isRoomLevel ? '/ room' : (typeMeta.id === 'campsite' ? '/ camper' : '/ night'));

                            const liveRoom = liveInventory?.[room.id];
                            const isRoomSoldOut = liveRoom && typeof liveRoom.availableUnits === 'number' && liveRoom.availableUnits === 0;
                            const effectivePrice = (liveRoom && typeof liveRoom.price === 'number') ? liveRoom.price : (room.price || room.pricePerPerson || currentPkg.price || 2499);

                            return (
                                <div
                                    key={room.id}
                                    onClick={() => {
                                        if (!isRoomSoldOut) {
                                            setSelectedRoomId(room.id);
                                            setCustomUnits(null);
                                        }
                                    }}
                                    style={{
                                        borderRadius: '12px',
                                        border: isRoomSelected ? '2px solid #166534' : '1px solid rgba(18, 22, 19, 0.12)',
                                        background: isRoomSoldOut ? '#FAFAFA' : '#FFFFFF',
                                        padding: '10px 12px',
                                        cursor: isRoomSoldOut ? 'not-allowed' : 'pointer',
                                        opacity: isRoomSoldOut ? 0.55 : 1,
                                        transition: 'all 0.18s ease',
                                        boxShadow: isRoomSelected ? '0 4px 14px rgba(22, 101, 52, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {/* Radio Circle */}
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            border: isRoomSelected ? '5px solid #166534' : '2px solid rgba(18, 22, 19, 0.25)',
                                            background: '#FFFFFF',
                                            flexShrink: 0,
                                            boxSizing: 'border-box',
                                            transition: 'all 0.15s ease'
                                        }} />

                                        {room.image ? (
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    if (e.currentTarget.nextElementSibling) {
                                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '8px',
                                                    background: '#F1F3EC',
                                                    border: '1px dashed rgba(18,22,19,0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#9CA3AF',
                                                    flexShrink: 0
                                                }}
                                                title="No preview available"
                                            >
                                                <ImageOff size={16} />
                                            </div>
                                        )}

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                                <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#121613', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {room.name}
                                                </div>
                                                {liveRoom && (
                                                    <span style={{
                                                        fontSize: '9px',
                                                        fontWeight: '800',
                                                        padding: '1px 6px',
                                                        borderRadius: '6px',
                                                        background: isRoomSoldOut ? '#FEE2E2' : '#DCFCE7',
                                                        color: isRoomSoldOut ? '#DC2626' : '#166534',
                                                        flexShrink: 0
                                                    }}>
                                                        {isRoomSoldOut ? 'Sold Out' : `${liveRoom.availableUnits} Left`}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '10.5px', color: '#59655D', fontWeight: '600', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                                <Users size={11} color="#59655D" />
                                                <span>{room.guestCapacity ? `${room.guestCapacity} Guests` : (room.capacity || `${roomCap} Guests`)}</span>
                                                {room.bedConfig && (
                                                    <span style={{ fontSize: '9.5px', color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>
                                                        {room.bedConfig}
                                                    </span>
                                                )}
                                                {room.bathroomType && (
                                                    <span style={{ fontSize: '9.5px', color: '#0369A1', background: '#E0F2FE', padding: '1px 5px', borderRadius: '4px' }}>
                                                        {room.bathroomType === 'ATTACHED' ? 'Attached Bath' : room.bathroomType === 'COMMON' ? 'Shared Bath' : room.bathroomType}
                                                    </span>
                                                )}
                                                {room.roomSizeSqFt && (
                                                    <span style={{ fontSize: '9.5px', color: '#59655D', background: '#F1F3EC', padding: '1px 5px', borderRadius: '4px' }}>
                                                        {room.roomSizeSqFt} sq ft
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: '900', color: isRoomSoldOut ? '#9CA3AF' : '#166534' }}>
                                                ₹{effectivePrice.toLocaleString('en-IN')} <span style={{ fontSize: '10px', color: '#59655D', fontWeight: '600' }}>{priceSuffix}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isRoomSelected && (
                                        <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                                            <span style={{ fontSize: '9.5px', background: '#166534', color: '#FFFFFF', padding: '1px 6px', borderRadius: '999px', fontWeight: '800' }}>
                                                Selected
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
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
                                        propertyId={currentPkg?.id}
                                        campsiteId={currentPkg?.id}
                                        checkInTime={currentPkg?.checkInTime}
                                        checkOutTime={currentPkg?.checkOutTime}
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                    {isCurrentRoomDorm ? 'Dorm Beds' : 'Campers'}
                                                </label>
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '800',
                                                    padding: '2px 7px',
                                                    borderRadius: '6px',
                                                    background: isCheckingInventory ? '#F9FAFB' : ((adults + children) >= maxAllowedCapacity || maxAllowedCapacity === 0 ? '#FEF2F2' : '#F0FDF4'),
                                                    color: isCheckingInventory ? '#9CA3AF' : ((adults + children) >= maxAllowedCapacity || maxAllowedCapacity === 0 ? '#DC2626' : '#166534'),
                                                    border: `1px solid ${isCheckingInventory ? '#E5E7EB' : ((adults + children) >= maxAllowedCapacity || maxAllowedCapacity === 0 ? '#FECACA' : '#BBF7D0')}`
                                                }}>
                                                    {isCheckingInventory
                                                        ? 'Checking…'
                                                        : (isCurrentRoomDorm
                                                            ? `${maxAllowedCapacity} Bed${maxAllowedCapacity === 1 ? '' : 's'} Remaining`
                                                            : `${maxAllowedCapacity} Unit${maxAllowedCapacity === 1 ? '' : 's'} Remaining`)}
                                                </span>
                                            </div>
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
                                            ].map(preset => {
                                                const isPresetExceeding = preset.count > maxAllowedCapacity;
                                                return (
                                                    <button
                                                        key={preset.count}
                                                        type="button"
                                                        disabled={isPresetExceeding}
                                                        onClick={() => {
                                                            if (!isPresetExceeding) {
                                                                setAdults(preset.count);
                                                                setChildren(0);
                                                                setCustomUnits(null);
                                                            }
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: '5px 0',
                                                            borderRadius: '8px',
                                                            border: (adults === preset.count && children === 0) ? '1px solid #166534' : '1px solid rgba(18,22,19,0.1)',
                                                            background: (adults === preset.count && children === 0) ? '#166534' : (isPresetExceeding ? '#F3F4F6' : '#FFFFFF'),
                                                            color: (adults === preset.count && children === 0) ? '#FFFFFF' : (isPresetExceeding ? '#9CA3AF' : '#121613'),
                                                            fontSize: '11px',
                                                            fontWeight: '800',
                                                            cursor: isPresetExceeding ? 'not-allowed' : 'pointer',
                                                            opacity: isPresetExceeding ? 0.45 : 1,
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        title={isPresetExceeding ? `Exceeds room capacity (${maxAllowedCapacity} max)` : ''}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ flex: 1, padding: '10px 12px', background: '#F8F9F5', borderRadius: '16px', border: (adults + children) >= maxAllowedCapacity ? '1px solid #FCA5A5' : '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Adults (12+ yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setAdults(Math.max(1, adults - 1)); setCustomUnits(null); }}
                                                        aria-label="Decrease adult count"
                                                        disabled={adults <= 1}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: adults <= 1 ? 'not-allowed' : 'pointer', fontWeight: '800', opacity: adults <= 1 ? 0.4 : 1 }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if ((adults + children) < maxAllowedCapacity) {
                                                                setAdults(adults + 1);
                                                                setCustomUnits(null);
                                                            }
                                                        }}
                                                        disabled={(adults + children) >= maxAllowedCapacity}
                                                        aria-label="Increase adult count"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: (adults + children) >= maxAllowedCapacity ? '#F3F4F6' : '#FFFFFF', color: (adults + children) >= maxAllowedCapacity ? '#9CA3AF' : '#121613', cursor: (adults + children) >= maxAllowedCapacity ? 'not-allowed' : 'pointer', fontWeight: '800', opacity: (adults + children) >= maxAllowedCapacity ? 0.45 : 1 }}
                                                        title={(adults + children) >= maxAllowedCapacity ? `Capacity reached (${maxAllowedCapacity} max)` : ''}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, padding: '10px 12px', background: '#F8F9F5', borderRadius: '16px', border: (adults + children) >= maxAllowedCapacity ? '1px solid #FCA5A5' : '1px solid rgba(0,0,0,0.06)' }}>
                                                <div style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700', marginBottom: '4px' }}>Kids (5–11 yrs)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setChildren(Math.max(0, children - 1)); setCustomUnits(null); }}
                                                        aria-label="Decrease children count"
                                                        disabled={children <= 0}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: '#FFFFFF', cursor: children <= 0 ? 'not-allowed' : 'pointer', fontWeight: '800', opacity: children <= 0 ? 0.4 : 1 }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: '15px', fontWeight: '800' }}>{children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if ((adults + children) < maxAllowedCapacity) {
                                                                setChildren(children + 1);
                                                                setCustomUnits(null);
                                                            }
                                                        }}
                                                        disabled={(adults + children) >= maxAllowedCapacity}
                                                        aria-label="Increase children count"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', background: (adults + children) >= maxAllowedCapacity ? '#F3F4F6' : '#FFFFFF', color: (adults + children) >= maxAllowedCapacity ? '#9CA3AF' : '#121613', cursor: (adults + children) >= maxAllowedCapacity ? 'not-allowed' : 'pointer', fontWeight: '800', opacity: (adults + children) >= maxAllowedCapacity ? 0.45 : 1 }}
                                                        title={(adults + children) >= maxAllowedCapacity ? `Capacity reached (${maxAllowedCapacity} max)` : ''}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Capacity Ceiling Alert */}
                                        {((adults + children) >= maxAllowedCapacity || maxAllowedCapacity === 0) && !isCheckingInventory && (
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                background: '#FEF2F2',
                                                border: '1px solid #FCA5A5',
                                                color: '#991B1B',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                lineHeight: 1.3
                                            }}>
                                                <AlertCircle size={13} color="#DC2626" style={{ flexShrink: 0 }} />
                                                <span>
                                                    <strong>{isCurrentRoomDorm ? 'Remaining Beds Reached:' : 'Remaining Units Reached:'}</strong> All <strong>{maxAllowedCapacity} {isCurrentRoomDorm ? (maxAllowedCapacity === 1 ? 'bed' : 'beds') : 'units'}</strong> for {currentRoom?.name || 'this room'} have been selected. Further selections are capped.
                                                </span>
                                            </div>
                                        )}
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
