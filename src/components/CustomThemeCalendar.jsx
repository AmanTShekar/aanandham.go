"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Special Wilderness Event Batches & Calendar Annotations
const SPECIAL_BATCHES = {
    '2026-08-15': { label: 'Perseid Meteor Camp 🌠', type: 'meteor', badge: '🌠 Meteor Shower' },
    '2026-08-22': { label: 'Weekend Cloud Bed Batch ☁️', type: 'weekend', badge: '🔥 Filling Fast' },
    '2026-08-29': { label: 'Full Moon Ridge Glamp 🌕', type: 'moon', badge: '🌕 Full Moon' },
    '2026-09-05': { label: 'Meesapulimala Summit Batch 🏔️', type: 'trek', badge: '⚡ Summit Trek' },
    '2026-09-12': { label: 'Rainforest Canopy Camp 🌿', type: 'weekend', badge: '🌿 High Mist' },
    '2026-09-19': { label: 'Acoustic Campfire Special 🎸', type: 'music', badge: '🎸 Live BBQ' },
    '2026-09-26': { label: 'Harvest Moon Glamp 🌕', type: 'moon', badge: '🌕 Stargaze' }
};

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CustomThemeCalendar({
    selectedDate,
    onDateSelect,
    theme = 'light', // 'light' | 'dark' | 'gold'
    inline = false,
    label = 'SELECT EXPEDITION DATE',
    defaultDuration = 2 // 2 Days / 1 Night default, or 3 Days / 2 Nights
}) {
    const today = useMemo(() => new Date(), []);
    const initialDate = selectedDate ? new Date(selectedDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [isOpen, setIsOpen] = useState(inline);
    const [stagedDate, setStagedDate] = useState(selectedDate || '');
    const [durationDays, setDurationDays] = useState(defaultDuration);

    // Prevent background scroll when calendar modal dialog is open (if not inline)
    useEffect(() => {
        if (isOpen && !inline) {
            window.__lenis?.stop();
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                window.__lenis?.start();
                document.body.style.overflow = originalOverflow || '';
            };
        }
    }, [isOpen, inline]);

    // Update staged date when selectedDate prop changes
    useEffect(() => {
        if (selectedDate) {
            setStagedDate(selectedDate);
            const [y, m] = selectedDate.split('-').map(Number);
            if (y && m) {
                setCurrentYear(y);
                setCurrentMonth(m - 1);
            }
        }
    }, [selectedDate]);

    // Days in current month
    const daysInMonth = useMemo(() => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    }, [currentYear, currentMonth]);

    // First day of week for current month (0: Sunday, 1: Monday, ...)
    const firstDayIndex = useMemo(() => {
        return new Date(currentYear, currentMonth, 1).getDay();
    }, [currentYear, currentMonth]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const formatDateString = (year, month, day) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    // Calculate dates in the trip range (Day 1, Day 2, Day 3)
    const tripRangeDates = useMemo(() => {
        if (!stagedDate) return [];
        const [y, m, d] = stagedDate.split('-').map(Number);
        const result = [];
        for (let i = 0; i < durationDays; i++) {
            const temp = new Date(y, m - 1, d + i);
            result.push(formatDateString(temp.getFullYear(), temp.getMonth(), temp.getDate()));
        }
        return result;
    }, [stagedDate, durationDays]);

    const checkoutDateString = useMemo(() => {
        if (tripRangeDates.length === 0) return '';
        return tripRangeDates[tripRangeDates.length - 1];
    }, [tripRangeDates]);

    const handleDayClick = (day) => {
        const dateStr = formatDateString(currentYear, currentMonth, day);
        setStagedDate(dateStr);
    };

    // Quick Presets
    const handleSelectPreset = (daysFromToday) => {
        const target = new Date();
        target.setDate(target.getDate() + daysFromToday);
        const y = target.getFullYear();
        const m = target.getMonth();
        const d = target.getDate();
        setCurrentYear(y);
        setCurrentMonth(m);
        const dateStr = formatDateString(y, m, d);
        setStagedDate(dateStr);
    };

    const handleConfirmWindow = () => {
        if (stagedDate) {
            onDateSelect(stagedDate);
            if (!inline) {
                setIsOpen(false);
            }
        }
    };

    // Format display string
    const formattedDisplayDate = useMemo(() => {
        if (!selectedDate) return 'Choose your travel date';
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = MONTH_NAMES[dateObj.getMonth()];
        const special = SPECIAL_BATCHES[selectedDate];
        return `${dayName}, ${monthName} ${d}, ${y} (${durationDays}D/${durationDays - 1}N) ${special ? `· ${special.badge}` : ''}`;
    }, [selectedDate, durationDays]);

    // Staged date details for trip summary card
    const stagedDetails = useMemo(() => {
        if (!stagedDate) return null;
        const [y, m, d] = stagedDate.split('-').map(Number);
        const startObj = new Date(y, m - 1, d);
        const endObj = new Date(y, m - 1, d + (durationDays - 1));

        return {
            startFormatted: `${startObj.toLocaleDateString('en-US', { weekday: 'short' })}, ${MONTH_NAMES[startObj.getMonth()]} ${startObj.getDate()}`,
            endFormatted: `${endObj.toLocaleDateString('en-US', { weekday: 'short' })}, ${MONTH_NAMES[endObj.getMonth()]} ${endObj.getDate()}`,
            special: SPECIAL_BATCHES[stagedDate]
        };
    }, [stagedDate, durationDays]);

    const isDark = theme === 'dark';
    const isGold = theme === 'gold';
    const accentColor = '#E5A93B'; // Figma Secondary Base: Sunrise Amber Gold

    // Inner Calendar UI Content (reused for both inline and modal view)
    const calendarContent = (
        <div style={{
            background: isDark ? '#0B150E' : '#FFFFFF',
            borderRadius: '28px',
            padding: '24px',
            color: isDark ? '#FFFFFF' : '#0B150E',
            width: '100%',
            maxWidth: '460px',
            border: isDark ? '1px solid rgba(229, 169, 59, 0.35)' : '1px solid rgba(11, 21, 14, 0.12)',
            boxShadow: isDark ? '0 25px 80px rgba(0, 0, 0, 0.7)' : '0 20px 60px rgba(0, 0, 0, 0.14)'
        }}>
            {/* Modal / Card Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                paddingBottom: '12px',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 22, 19, 0.08)'
            }}>
                <div>
                    <div style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: accentColor }}>
                        EXPEDITION BATCH SELECTOR
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '2px 0 0', color: isDark ? '#FFFFFF' : '#121613' }}>
                        {MONTH_NAMES[currentMonth]} {currentYear}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Prev / Next Month Buttons */}
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        aria-label="Previous Month"
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                            border: 'none',
                            color: isDark ? '#FFFFFF' : '#121613',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ◀
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        aria-label="Next Month"
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                            border: 'none',
                            color: isDark ? '#FFFFFF' : '#121613',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ▶
                    </button>

                    {/* Dedicated Close Button (✕) with Theme Hover Rotation */}
                    {!inline && (
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close calendar"
                            className={isDark ? 'modal-close-btn' : 'modal-close-btn-light'}
                            style={{
                                width: '34px',
                                height: '34px',
                                fontSize: '14px',
                                marginLeft: '4px'
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Trip Duration Selector (2 Days vs 3 Days) */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F5F7EF',
                padding: '6px 10px',
                borderRadius: '14px',
                marginBottom: '14px'
            }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#A2B6A6' : '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Trip Duration:
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        type="button"
                        onClick={() => setDurationDays(2)}
                        style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: durationDays === 2 ? `1.5px solid ${accentColor}` : '1px solid transparent',
                            background: durationDays === 2 ? (isDark ? 'rgba(213, 237, 85, 0.2)' : '#FFFFFF') : 'transparent',
                            color: durationDays === 2 ? (isDark ? accentColor : '#121613') : (isDark ? '#A2B6A6' : '#8E9B92'),
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        2 Days / 1 Night ⛺
                    </button>
                    <button
                        type="button"
                        onClick={() => setDurationDays(3)}
                        style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: durationDays === 3 ? `1.5px solid ${accentColor}` : '1px solid transparent',
                            background: durationDays === 3 ? (isDark ? 'rgba(229, 169, 59, 0.2)' : '#FFFFFF') : 'transparent',
                            color: durationDays === 3 ? (isDark ? accentColor : '#121613') : (isDark ? '#A2B6A6' : '#8E9B92'),
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        3 Days / 2 Nights 🏔️
                    </button>
                </div>
            </div>

            {/* Days of Week Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
                {DAYS_OF_WEEK.map((d, idx) => (
                    <div key={idx} style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', padding: '3px 0' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Day Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {/* Empty offset slots for first day */}
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <div key={`empty-${idx}`} style={{ height: '36px' }} />
                ))}

                {/* Month Days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dateStr = formatDateString(currentYear, currentMonth, day);
                    const isStart = stagedDate === dateStr;
                    const isInRange = tripRangeDates.includes(dateStr);
                    const isEnd = checkoutDateString === dateStr && durationDays > 1;
                    const special = SPECIAL_BATCHES[dateStr];
                    const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6;

                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => handleDayClick(day)}
                            style={{
                                height: '36px',
                                borderRadius: isStart ? '10px 4px 4px 10px' : isEnd ? '4px 10px 10px 4px' : isInRange ? '4px' : '10px',
                                border: isStart
                                    ? `1.5px solid ${accentColor}`
                                    : 'none',
                                background: isStart
                                    ? accentColor
                                    : isInRange
                                        ? (isDark ? 'rgba(229, 169, 59, 0.25)' : 'rgba(229, 169, 59, 0.45)')
                                        : special
                                            ? (isDark ? 'rgba(229, 169, 59, 0.12)' : 'rgba(229, 169, 59, 0.25)')
                                            : isWeekend
                                                ? (isDark ? 'rgba(255, 255, 255, 0.04)' : '#F5F7EF')
                                                : 'transparent',
                                color: isStart
                                    ? '#121613'
                                    : isInRange
                                        ? (isDark ? accentColor : '#121613')
                                        : isPast
                                            ? (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(18, 22, 19, 0.25)')
                                            : special
                                                ? (isDark ? accentColor : '#2A4B1A')
                                                : (isDark ? '#FFFFFF' : '#121613'),
                                fontSize: '13px',
                                fontWeight: isStart || isInRange || special ? '800' : '600',
                                cursor: isPast ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <span>{day}</span>
                            {special && !isInRange && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: accentColor
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Quick Presets */}
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                    type="button"
                    onClick={() => handleSelectPreset(1)}
                    style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                        border: 'none',
                        color: isDark ? '#FFFFFF' : '#121613',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    Tomorrow ⚡
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectPreset((6 - today.getDay() + 7) % 7 || 7)}
                    style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(229, 169, 59, 0.15)' : 'rgba(229, 169, 59, 0.35)',
                        border: 'none',
                        color: isDark ? accentColor : '#121613',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                    }}
                >
                    This Saturday 🔥
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectPreset(14)}
                    style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                        border: 'none',
                        color: isDark ? '#FFFFFF' : '#121613',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    In 2 Weeks 🏔️
                </button>
            </div>

            {/* ── EXPEDITION TRIP WINDOW NOTIFICATION & CONFIRMATION CARD ── */}
            {stagedDetails && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '16px',
                        padding: '14px 16px',
                        borderRadius: '18px',
                        background: isDark ? 'rgba(213, 237, 85, 0.08)' : '#F0F4E8',
                        border: isDark ? '1px solid rgba(213, 237, 85, 0.25)' : '1px solid rgba(18, 22, 19, 0.1)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? accentColor : '#2A4B1A', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            🏕️ SELECTED TRIP WINDOW ({durationDays}D / {durationDays - 1}N)
                        </span>
                        {stagedDetails.special && (
                            <span style={{ fontSize: '10.5px', fontWeight: '800', color: accentColor }}>
                                {stagedDetails.special.badge}
                            </span>
                        )}
                    </div>

                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#121613', marginBottom: '4px' }}>
                        {stagedDetails.startFormatted} ➔ {stagedDetails.endFormatted}
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#A2B6A6' : '#59655D', marginBottom: '12px', lineHeight: 1.4 }}>
                        Check-in 11:00 AM Basecamp · Guided 4x4 Trail · Return Day {durationDays} at 03:00 PM
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirmWindow}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: '999px',
                            background: accentColor,
                            color: '#121613',
                            border: 'none',
                            fontSize: '13.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span>Confirm This Expedition Window ({durationDays} Days) ↗</span>
                    </button>
                </motion.div>
            )}
        </div>
    );

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {label && (
                <div style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: isDark ? accentColor : '#59655D',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{label}</span>
                    {selectedDate && SPECIAL_BATCHES[selectedDate] && (
                        <span style={{
                            background: isDark ? 'rgba(213, 237, 85, 0.2)' : 'rgba(213, 237, 85, 0.5)',
                            color: isDark ? accentColor : '#121613',
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '999px'
                        }}>
                            {SPECIAL_BATCHES[selectedDate].badge}
                        </span>
                    )}
                </div>
            )}

            {/* Popover Trigger Button (When not inline) */}
            {!inline && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '100%',
                        padding: '13px 18px',
                        borderRadius: '16px',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(18, 22, 19, 0.15)',
                        background: isDark ? '#08120A' : '#F8F9F5',
                        color: isDark ? '#FFFFFF' : '#121613',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>📅</span>
                        <span>{formattedDisplayDate}</span>
                    </div>
                    <span style={{ fontSize: '11px', opacity: 0.6 }}>
                        ▼
                    </span>
                </button>
            )}

            {/* Inline Render Mode */}
            {inline && calendarContent}

            {/* Fixed Backdrop Modal Dialog Mode (When not inline, opens cleanly outside modal clipping) */}
            {!inline && (
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 100000,
                                background: 'rgba(0, 0, 0, 0.75)',
                                backdropFilter: 'blur(12px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {calendarContent}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
