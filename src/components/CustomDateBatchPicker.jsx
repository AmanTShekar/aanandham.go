"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar as CalendarIcon, 
    ChevronDown, 
    Sparkles, 
    Clock, 
    Check, 
    Compass, 
    Flame, 
    Moon, 
    Tent, 
    ChevronRight, 
    MapPin, 
    ShieldCheck, 
    ThermometerSun,
    CalendarDays
} from 'lucide-react';
import { generateUpcomingWeekendBatches } from '../lib/utils';
import CustomThemeCalendar from './CustomThemeCalendar';

const BATCH_DETAILS_META = {
    0: {
        themeTag: '🌕 Full Moon Ridge Glamp',
        icon: Moon,
        inclusions: ['4x4 Kolukkumalai Sunrise Jeep', 'Acoustic Campfire & BBQ Dinner', 'Starlit Ridge Tent Pod'],
        weather: '14°C Alpine Night · Clear Skies',
        totalSlots: 15,
        bookedSlots: 9,
    },
    1: {
        themeTag: '🌠 Meteor Campfire Night',
        icon: Sparkles,
        inclusions: ['Stargazing Telescope Guide', 'Live Acoustic BBQ Night', 'Phantom Head Morning Trek'],
        weather: '13°C Misty Breeze · 7,130 FT',
        totalSlots: 15,
        bookedSlots: 11,
    },
    2: {
        themeTag: '🎸 Live Wilderness Acoustic',
        icon: Flame,
        inclusions: ['Campfire Jam & Dinner', 'Cloud Bed Sunrise Safari', 'Hot Kerala Breakfast'],
        weather: '15°C Foggy Valley Night',
        totalSlots: 15,
        bookedSlots: 7,
    },
    3: {
        themeTag: '☁️ Summit Cloud Bed Batch',
        icon: Tent,
        inclusions: ['Sunrise Valley View Trek', 'Tea Plantation Nature Walk', 'All Meals & Camp Stay'],
        weather: '14°C Crisp Sunrise Ridge',
        totalSlots: 15,
        bookedSlots: 12,
    },
    4: {
        themeTag: '🌿 High-Altitude Forest Trail',
        icon: Compass,
        inclusions: ['Guided Off-Road 4x4 Safari', 'Bonfire & Marshmallows', 'Alpine Dome Pod'],
        weather: '16°C Fresh Mountain Air',
        totalSlots: 15,
        bookedSlots: 6,
    },
    5: {
        themeTag: '🔥 Weekend Expedition Special',
        icon: Flame,
        inclusions: ['4x4 Kolukkumalai Peak Safari', 'Campfire & Dinner Feast', 'Panoramic Sunrise Pod'],
        weather: '14°C Starlit Ridge Night',
        totalSlots: 15,
        bookedSlots: 10,
    }
};

export default function CustomDateBatchPicker({
    selectedDate,
    value,
    onDateChange,
    onChange,
    theme = 'light', // 'light' | 'dark'
    label = 'SELECT EXPEDITION DATES',
    durationDays = 2 // default 2 Days / 1 Night
}) {
    const effectiveSelectedDate = selectedDate || value || '';
    const handleDateChange = onDateChange || onChange || (() => {});
    const upcomingBatches = useMemo(() => generateUpcomingWeekendBatches(6), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'calendar'
    const [hoveredBatch, setHoveredBatch] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(durationDays);
    const containerRef = useRef(null);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            window.__lenis?.stop();
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                window.__lenis?.start();
                document.body.style.overflow = originalOverflow || '';
            };
        }
    }, [isModalOpen]);

    // Current display label
    const matchedBatch = upcomingBatches.find(b => b.title === effectiveSelectedDate || b.rawDate === effectiveSelectedDate);
    const displayTitle = matchedBatch ? matchedBatch.title : (effectiveSelectedDate || 'Select Weekend Batch or Date');
    const displaySubtitle = matchedBatch ? matchedBatch.subtitle : `${selectedDuration} Days / ${selectedDuration - 1} Night Expedition`;

    const handleSelectBatch = (batch) => {
        handleDateChange(batch.title);
        setIsModalOpen(false);
    };

    const handleCalendarSelect = (isoDate) => {
        const d = new Date(isoDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedStart = d.toLocaleDateString('en-US', options);
        const dNext = new Date(d);
        dNext.setDate(d.getDate() + (selectedDuration - 1));
        const formattedEnd = dNext.toLocaleDateString('en-US', options);
        const finalRange = `${formattedStart} – ${formattedEnd}`;
        
        handleDateChange(finalRange);
        setIsModalOpen(false);
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

            {/* Main Interactive Trigger Button */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '16px',
                    background: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F8F9F5',
                    border: isDark ? '1.5px solid rgba(229, 169, 59, 0.35)' : '1.5px solid rgba(18, 22, 19, 0.14)',
                    color: isDark ? '#FFFFFF' : '#121613',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#E5A93B';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 169, 59, 0.2)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(229, 169, 59, 0.35)' : 'rgba(18, 22, 19, 0.14)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isDark ? 'rgba(229, 169, 59, 0.15)' : '#E9EFE6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#E5A93B' : '#166534',
                        flexShrink: 0
                    }}>
                        <CalendarIcon size={18} strokeWidth={2.2} />
                    </div>
                    <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {displayTitle}
                        </div>
                        <div style={{ fontSize: '11px', color: isDark ? '#D5ED55' : '#59655D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{displaySubtitle}</span>
                            <span style={{ color: '#E5A93B' }}>•</span>
                            <span style={{ color: isDark ? '#A2B6A6' : '#166534', fontWeight: '800' }}>2:00 PM In ➔ 11:00 AM Out</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    background: isDark ? 'rgba(229, 169, 59, 0.15)' : '#121613',
                    color: isDark ? '#E5A93B' : '#D5ED55',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                }}>
                    <span>Change</span>
                    <ChevronRight size={12} strokeWidth={2.5} />
                </div>
            </button>

            {/* ── EXPEDITION BATCH SELECTOR POPUP MODAL ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999999,
                        background: 'rgba(5, 12, 8, 0.82)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        boxSizing: 'border-box'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                background: '#0B150E',
                                border: '1.5px solid rgba(229, 169, 59, 0.45)',
                                borderRadius: '28px',
                                width: '100%',
                                maxWidth: '780px',
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(229, 169, 59, 0.18)',
                                color: '#FFFFFF',
                                position: 'relative'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '20px 24px 16px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'linear-gradient(180deg, #112216 0%, #0B150E 100%)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '10.5px', fontWeight: '900', color: '#E5A93B', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Compass size={13} color="#E5A93B" />
                                        <span>EXPEDITION BATCH SELECTOR & ITINERARY</span>
                                    </div>
                                    <h3 style={{ margin: '4px 0 0', fontSize: '19px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                                        Select Check-In Weekend Batch or Date
                                    </h3>
                                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#A2B6A6' }}>
                                        Check-in: <strong>Saturday 2:00 PM</strong> · Check-out: <strong>Sunday 11:00 AM</strong> (2 Days / 1 Night)
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#FFFFFF',
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* View Switcher Tabs (Batches vs Calendar) */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 24px',
                                background: '#08100B',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('batches')}
                                        style={{
                                            padding: '7px 16px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: activeTab === 'batches' ? '#E5A93B' : 'rgba(255, 255, 255, 0.06)',
                                            color: activeTab === 'batches' ? '#070E08' : '#A2B6A6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Sparkles size={13} />
                                        <span>Upcoming Weekend Batches</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('calendar')}
                                        style={{
                                            padding: '7px 16px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: activeTab === 'calendar' ? '#E5A93B' : 'rgba(255, 255, 255, 0.06)',
                                            color: activeTab === 'calendar' ? '#070E08' : '#A2B6A6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <CalendarDays size={13} />
                                        <span>Full Month Calendar</span>
                                    </button>
                                </div>

                                {/* Duration Toggle Tag */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#A2B6A6', fontWeight: '700' }}>Duration:</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDuration(2)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            border: selectedDuration === 2 ? '1px solid #D5ED55' : '1px solid rgba(255,255,255,0.1)',
                                            background: selectedDuration === 2 ? 'rgba(213, 237, 85, 0.15)' : 'transparent',
                                            color: selectedDuration === 2 ? '#D5ED55' : '#7D8880',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        2D / 1N
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDuration(3)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            border: selectedDuration === 3 ? '1px solid #D5ED55' : '1px solid rgba(255,255,255,0.1)',
                                            background: selectedDuration === 3 ? 'rgba(213, 237, 85, 0.15)' : 'transparent',
                                            color: selectedDuration === 3 ? '#D5ED55' : '#7D8880',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        3D / 2N
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body Content */}
                            <div style={{
                                padding: '20px 24px',
                                overflowY: 'auto',
                                maxHeight: 'calc(90vh - 180px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                {activeTab === 'batches' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '14px' }}>
                                        {upcomingBatches.map((batch, idx) => {
                                            const isSelected = selectedDate === batch.title;
                                            const meta = BATCH_DETAILS_META[idx % 6];
                                            const availablePods = meta.totalSlots - meta.bookedSlots;
                                            const IconComp = meta.icon;

                                            return (
                                                <div
                                                    key={batch.id}
                                                    onClick={() => handleSelectBatch(batch)}
                                                    onMouseEnter={() => setHoveredBatch(idx)}
                                                    onMouseLeave={() => setHoveredBatch(null)}
                                                    style={{
                                                        background: isSelected 
                                                            ? 'linear-gradient(145deg, #162E1D 0%, #0F2014 100%)' 
                                                            : 'rgba(255, 255, 255, 0.03)',
                                                        border: isSelected 
                                                            ? '1.5px solid #D5ED55' 
                                                            : '1px solid rgba(255, 255, 255, 0.09)',
                                                        borderRadius: '18px',
                                                        padding: '16px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '10px',
                                                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                        position: 'relative',
                                                        boxShadow: isSelected ? '0 8px 24px rgba(213, 237, 85, 0.15)' : 'none'
                                                    }}
                                                >
                                                    {/* Top Batch Header */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                                <span style={{
                                                                    fontSize: '10.5px',
                                                                    fontWeight: '900',
                                                                    padding: '3px 8px',
                                                                    borderRadius: '999px',
                                                                    background: 'rgba(229, 169, 59, 0.18)',
                                                                    color: '#E5A93B'
                                                                }}>
                                                                    {meta.themeTag}
                                                                </span>
                                                                <span style={{ fontSize: '10.5px', fontWeight: '800', color: batch.statusColor }}>
                                                                    • {batch.status}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                                                                {batch.title}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                                                            background: isSelected ? '#D5ED55' : 'transparent',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#070E08',
                                                            flexShrink: 0
                                                        }}>
                                                            {isSelected && <Check size={14} strokeWidth={3} />}
                                                        </div>
                                                    </div>

                                                    {/* Check-In & Check-Out Marks */}
                                                    <div style={{
                                                        background: 'rgba(0, 0, 0, 0.3)',
                                                        borderRadius: '12px',
                                                        padding: '8px 12px',
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 1fr',
                                                        gap: '8px',
                                                        fontSize: '11px',
                                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                                    }}>
                                                        <div>
                                                            <div style={{ color: '#E5A93B', fontWeight: '800', fontSize: '9.5px', textTransform: 'uppercase' }}>
                                                                📍 Check-In (Sat)
                                                            </div>
                                                            <div style={{ color: '#FFFFFF', fontWeight: '700' }}>
                                                                2:00 PM Basecamp
                                                            </div>
                                                        </div>
                                                        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '8px' }}>
                                                            <div style={{ color: '#D5ED55', fontWeight: '800', fontSize: '9.5px', textTransform: 'uppercase' }}>
                                                                🏁 Check-Out (Sun)
                                                            </div>
                                                            <div style={{ color: '#FFFFFF', fontWeight: '700' }}>
                                                                11:00 AM Departure
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Hover Details Card (Inclusions & Live Weather Snapshot) */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: '#A2B6A6' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <ThermometerSun size={13} color="#E5A93B" />
                                                            <span>{meta.weather}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <ShieldCheck size={13} color="#D5ED55" />
                                                            <span>{availablePods} of {meta.totalSlots} Alpine Ridge Pods Remaining</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Full Month Interactive Calendar View */
                                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <CustomThemeCalendar
                                            inline={true}
                                            theme="dark"
                                            selectedDate={matchedBatch?.rawDate || selectedDate}
                                            defaultDuration={selectedDuration}
                                            onDateSelect={(isoDate) => handleCalendarSelect(isoDate)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Summary */}
                            <div style={{
                                padding: '14px 24px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                background: '#070E08',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontSize: '12.5px', color: '#A2B6A6' }}>
                                    <span>Selected: </span>
                                    <strong style={{ color: '#FFFFFF' }}>{displayTitle}</strong>
                                    <span style={{ color: '#D5ED55', marginLeft: '6px' }}>({selectedDuration}D/{selectedDuration - 1}N)</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-lime"
                                    style={{
                                        padding: '10px 22px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span>Confirm Batch</span>
                                    <span>✓</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
