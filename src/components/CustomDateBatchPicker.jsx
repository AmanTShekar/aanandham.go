"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomThemeCalendar from './CustomThemeCalendar';

// ── PRESET EXPEDITION WEEKEND BATCHES (Interactive 1-Tap Pills) ──
const UPCOMING_WEEKEND_BATCHES = [
    {
        id: 'b-1',
        title: 'Aug 22 – 23, 2026',
        subtitle: 'This Weekend (Sat–Sun)',
        status: 'Filling Fast 🔥',
        statusColor: '#B45309',
        spotsLeft: '6 spots left',
        rawDate: '2026-08-22'
    },
    {
        id: 'b-2',
        title: 'Aug 29 – 30, 2026',
        subtitle: 'Next Weekend (Sat–Sun)',
        status: 'Open 🟢',
        statusColor: '#166534',
        spotsLeft: '14 spots left',
        rawDate: '2026-08-29'
    },
    {
        id: 'b-3',
        title: 'Sep 05 – 06, 2026',
        subtitle: 'September Batch 1',
        status: 'Open 🟢',
        statusColor: '#166534',
        spotsLeft: '20 spots left',
        rawDate: '2026-09-05'
    },
    {
        id: 'b-4',
        title: 'Sep 12 – 13, 2026',
        subtitle: 'September Batch 2',
        status: 'Open 🟢',
        statusColor: '#166534',
        spotsLeft: '18 spots left',
        rawDate: '2026-09-12'
    },
    {
        id: 'b-5',
        title: 'Sep 19 – 20, 2026',
        subtitle: 'Acoustic Weekend 🎸',
        status: 'Special Event ⭐',
        statusColor: '#7C3AED',
        spotsLeft: '12 spots left',
        rawDate: '2026-09-19'
    }
];

export default function CustomDateBatchPicker({
    selectedDate,
    onDateChange,
    theme = 'light', // 'light' | 'dark'
    label = 'SELECT EXPEDITION DATES'
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Current display label
    const matchedBatch = UPCOMING_WEEKEND_BATCHES.find(b => b.title === selectedDate || b.rawDate === selectedDate);
    const displayLabel = matchedBatch ? `${matchedBatch.title} · ${matchedBatch.subtitle}` : (selectedDate || 'Select Weekend Batch or Date');

    const handleSelectBatch = (batch) => {
        onDateChange(batch.title);
        setIsDropdownOpen(false);
    };

    const handleCalendarSelect = (isoDate) => {
        const d = new Date(isoDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedStart = d.toLocaleDateString('en-US', options);
        const dNext = new Date(d);
        dNext.setDate(d.getDate() + 1);
        const formattedEnd = dNext.toLocaleDateString('en-US', options);
        const finalRange = `${formattedStart} – ${formattedEnd}`;
        
        onDateChange(finalRange);
        setIsCalendarModalOpen(false);
        setIsDropdownOpen(false);
    };

    const isDark = theme === 'dark';

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {label && (
                <label style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: isDark ? '#D5ED55' : '#121613',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px'
                }}>
                    {label}
                </label>
            )}

            {/* Main Interactive Trigger Button (No Typing!) */}
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '14px',
                    background: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F8F9F5',
                    border: isDropdownOpen 
                        ? (isDark ? '1px solid #D5ED55' : '1.5px solid #121613') 
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 22, 19, 0.12)'),
                    color: isDark ? '#FFFFFF' : '#121613',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    boxShadow: isDropdownOpen ? '0 4px 18px rgba(0,0,0,0.06)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayLabel}
                    </span>
                </div>
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: isDark ? '#D5ED55' : '#121613',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s ease'
                }}>
                    ▼
                </div>
            </button>

            {/* Custom Interactive Dropdown Menu */}
            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: isDark ? '#111D15' : '#FFFFFF',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(18, 22, 19, 0.12)',
                            borderRadius: '18px',
                            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.18)',
                            padding: '10px',
                            maxHeight: '340px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ fontSize: '10.5px', fontWeight: '800', color: isDark ? '#A2B6A6' : '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '6px 10px 8px' }}>
                            ⚡ Upcoming Weekend Scheduled Batches
                        </div>

                        {/* List of Weekend Batches */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {UPCOMING_WEEKEND_BATCHES.map(batch => {
                                const isSelected = selectedDate === batch.title;
                                return (
                                    <div
                                        key={batch.id}
                                        onClick={() => handleSelectBatch(batch)}
                                        style={{
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            background: isSelected 
                                                ? (isDark ? 'rgba(213, 237, 85, 0.15)' : '#F1F3EC') 
                                                : 'transparent',
                                            border: isSelected 
                                                ? (isDark ? '1px solid #D5ED55' : '1px solid #121613') 
                                                : '1px solid transparent',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseOver={e => {
                                            if (!isSelected) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#F8F9F5';
                                        }}
                                        onMouseOut={e => {
                                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#121613' }}>
                                                {batch.title}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: isDark ? '#A2B6A6' : '#59655D' }}>
                                                {batch.subtitle} · <span style={{ color: isDark ? '#D5ED55' : '#166534', fontWeight: '700' }}>{batch.spotsLeft}</span>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '10.5px',
                                            fontWeight: '800',
                                            padding: '3px 8px',
                                            borderRadius: '999px',
                                            background: isDark ? 'rgba(255,255,255,0.1)' : '#F1F3EC',
                                            color: batch.statusColor
                                        }}>
                                            {batch.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Or Pick Any Custom Date from Interactive Calendar */}
                        <div style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(18,22,19,0.08)', marginTop: '8px', paddingTop: '8px' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCalendarModalOpen(true);
                                    setIsDropdownOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    background: isDark ? '#121613' : '#121613',
                                    color: '#D5ED55',
                                    border: 'none',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>🗓️ Open Full Month Calendar Picker</span>
                                <span>→</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Interactive Calendar Modal */}
            <AnimatePresence>
                {isCalendarModalOpen && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                padding: '24px',
                                maxWidth: '420px',
                                width: '100%',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#121613' }}>
                                    Select Expedition Date
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsCalendarModalOpen(false)}
                                    style={{
                                        background: '#F1F3EC',
                                        border: 'none',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        fontWeight: '800',
                                        color: '#121613'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            <CustomThemeCalendar
                                inline={true}
                                theme="light"
                                onDateSelect={handleCalendarSelect}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
