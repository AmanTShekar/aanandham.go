"use client";
import React, { useState, useMemo } from 'react';
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
    theme = 'light', // 'light' | 'dark'
    inline = false,
    label = 'SELECT EXPEDITION DATE'
}) {
    const today = useMemo(() => new Date(), []);
    const initialDate = selectedDate ? new Date(selectedDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [isOpen, setIsOpen] = useState(inline);

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

    const handleDayClick = (day) => {
        const dateStr = formatDateString(currentYear, currentMonth, day);
        onDateSelect(dateStr);
        if (!inline) {
            setIsOpen(false);
        }
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
        onDateSelect(dateStr);
        if (!inline) {
            setIsOpen(false);
        }
    };

    // Format selected date for display
    const formattedDisplayDate = useMemo(() => {
        if (!selectedDate) return 'Choose your travel date';
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = MONTH_NAMES[dateObj.getMonth()];
        const special = SPECIAL_BATCHES[selectedDate];
        return `${dayName}, ${monthName} ${d}, ${y} ${special ? `· ${special.badge}` : ''}`;
    }, [selectedDate]);

    const isDark = theme === 'dark';

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {label && (
                <div style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: isDark ? '#D5ED55' : '#59655D',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{label}</span>
                    {selectedDate && SPECIAL_BATCHES[selectedDate] && (
                        <span style={{
                            background: isDark ? 'rgba(213, 237, 85, 0.2)' : 'rgba(213, 237, 85, 0.5)',
                            color: isDark ? '#D5ED55' : '#121613',
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
                    onClick={() => setIsOpen(!isOpen)}
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
                        transition: 'all 0.2s ease',
                        boxShadow: isOpen ? (isDark ? '0 0 0 2px #D5ED55' : '0 0 0 2px #121613') : 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>📅</span>
                        <span>{formattedDisplayDate}</span>
                    </div>
                    <span style={{ fontSize: '11px', opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                        ▼
                    </span>
                </button>
            )}

            {/* The Custom Calendar Card */}
            <AnimatePresence>
                {(isOpen || inline) && (
                    <motion.div
                        initial={inline ? false : { opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: inline ? 'relative' : 'absolute',
                            top: inline ? 'auto' : 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            zIndex: 100,
                            background: isDark ? '#101E13' : '#FFFFFF',
                            border: isDark ? '1px solid rgba(213, 237, 85, 0.3)' : '1px solid rgba(18, 22, 19, 0.12)',
                            borderRadius: '24px',
                            padding: '20px',
                            boxShadow: isDark ? '0 20px 50px rgba(0, 0, 0, 0.6)' : '0 16px 40px rgba(0, 0, 0, 0.12)',
                            color: isDark ? '#FFFFFF' : '#121613'
                        }}
                    >
                        {/* Month Header with Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                aria-label="Previous Month"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                                    border: 'none',
                                    color: isDark ? '#FFFFFF' : '#121613',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                ◀
                            </button>

                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '800', letterSpacing: '-0.2px' }}>
                                {MONTH_NAMES[currentMonth]} {currentYear}
                            </div>

                            <button
                                type="button"
                                onClick={handleNextMonth}
                                aria-label="Next Month"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                                    border: 'none',
                                    color: isDark ? '#FFFFFF' : '#121613',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                ▶
                            </button>
                        </div>

                        {/* Days of Week Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                            {DAYS_OF_WEEK.map((d, idx) => (
                                <div key={idx} style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#8E9B92' : '#8E9B92', padding: '4px 0' }}>
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
                                const isSelected = selectedDate === dateStr;
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
                                            borderRadius: '10px',
                                            border: isSelected
                                                ? (isDark ? '1px solid #D5ED55' : '1px solid #121613')
                                                : 'none',
                                            background: isSelected
                                                ? (isDark ? '#D5ED55' : '#121613')
                                                : special
                                                    ? (isDark ? 'rgba(213, 237, 85, 0.15)' : 'rgba(213, 237, 85, 0.35)')
                                                    : isWeekend
                                                        ? (isDark ? 'rgba(255, 255, 255, 0.04)' : '#F5F7EF')
                                                        : 'transparent',
                                            color: isSelected
                                                ? (isDark ? '#121613' : '#FFFFFF')
                                                : isPast
                                                    ? (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(18, 22, 19, 0.25)')
                                                    : special
                                                        ? (isDark ? '#D5ED55' : '#2A4B1A')
                                                        : (isDark ? '#FFFFFF' : '#121613'),
                                            fontSize: '13px',
                                            fontWeight: isSelected || special ? '800' : '600',
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
                                        {special && !isSelected && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '2px',
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: isDark ? '#D5ED55' : '#4E6B1F'
                                            }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Presets Footer */}
                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(18, 22, 19, 0.08)' }}>
                            <div style={{ fontSize: '10.5px', fontWeight: '800', color: isDark ? '#8E9B92' : '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                QUICK BATCH PRESETS:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
                                        background: isDark ? 'rgba(213, 237, 85, 0.15)' : 'rgba(213, 237, 85, 0.35)',
                                        border: 'none',
                                        color: isDark ? '#D5ED55' : '#121613',
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
