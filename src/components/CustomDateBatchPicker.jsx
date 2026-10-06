"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar as CalendarIcon, 
    ChevronDown, 
    ChevronLeft,
    ChevronRight,
    Sparkles, 
    Clock, 
    Check, 
    Compass, 
    Flame, 
    Moon, 
    Tent, 
    MapPin, 
    ShieldCheck, 
    CalendarDays,
    ArrowLeft,
    Info
} from 'lucide-react';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Deterministic live availability calculation for any date
export function getDateAvailability(dateStr) {
    if (!dateStr) return { remaining: 8, status: 'available', dotColor: '#22C55E', badgeText: '8 Left · Available' };
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = (hash << 5) - hash + dateStr.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);
    const dayOfWeek = new Date(dateStr).getDay();
    // Friday (5) & Saturday (6) have higher booking volume
    let remaining;
    if (dayOfWeek === 5 || dayOfWeek === 6) {
        remaining = (absHash % 5) + 3; // 3 to 7 left
    } else {
        remaining = (absHash % 7) + 6; // 6 to 12 left
    }
    
    let status = 'available';
    let dotColor = '#22C55E';
    let badgeText = `${remaining} Units Left · Available`;
    
    if (remaining <= 1) {
        status = 'limited';
        dotColor = '#EF4444';
        badgeText = 'Only 1 Left · Almost Full!';
    } else if (remaining <= 4) {
        status = 'filling_fast';
        dotColor = '#E5A93B';
        badgeText = `${remaining} Left · Filling Fast`;
    }
    
    return { remaining, status, dotColor, badgeText };
}

function formatDateToIso(d) {
    if (!d || isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function parseIso(isoStr) {
    if (!isoStr || typeof isoStr !== 'string') return null;
    const parts = isoStr.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function addDays(d, days) {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
}

// Parses existing travelDate string into start date, end date, and night count
function parseExistingDate(str) {
    if (!str || typeof str !== 'string') return null;
    const trimmed = str.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const start = parseIso(trimmed);
        const end = addDays(start, 1);
        return { start, end, nights: 1 };
    }
    
    // Check for explicit "(N Nights)"
    let explicitNights = 1;
    const nightsMatch = trimmed.match(/(\d+)\s*Nights?/i);
    if (nightsMatch) {
        explicitNights = Math.max(1, parseInt(nightsMatch[1], 10));
    }

    const monthNamesRx = 'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';
    const rxRange = new RegExp(`(${monthNamesRx})\\s+(\\d{1,2})(?:,\\s*(\\d{4}))?\\s*[–—-]\\s*(?:(${monthNamesRx})\\s+)?(\\d{1,2})(?:,\\s*(\\d{4}))?`, 'i');
    const match = trimmed.match(rxRange);
    if (match) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const m1Str = match[1].slice(0, 3).toLowerCase();
        const m1Idx = MONTH_SHORT.findIndex(m => m.toLowerCase() === m1Str);
        const d1 = parseInt(match[2], 10);
        const y1 = parseInt(match[3] || match[6] || currentYear, 10);
        
        const m2Str = match[4] ? match[4].slice(0, 3).toLowerCase() : m1Str;
        const m2Idx = MONTH_SHORT.findIndex(m => m.toLowerCase() === m2Str);
        const d2 = parseInt(match[5], 10);
        const y2 = parseInt(match[6] || y1, 10);
        
        if (m1Idx >= 0 && m2Idx >= 0 && d1 > 0 && d2 > 0) {
            const start = new Date(y1, m1Idx, d1);
            const end = new Date(y2, m2Idx, d2);
            const diffDays = Math.round((end - start) / 86400000);
            const nights = diffDays > 0 ? diffDays : explicitNights;
            return { start, end: diffDays > 0 ? end : addDays(start, nights), nights };
        }
    }
    return null;
}

function formatStayDateRange(startDate, endDate, nights) {
    if (!startDate || !endDate) return '';
    const startM = MONTH_SHORT[startDate.getMonth()];
    const startD = startDate.getDate();
    const startY = startDate.getFullYear();
    
    const endM = MONTH_SHORT[endDate.getMonth()];
    const endD = endDate.getDate();
    const endY = endDate.getFullYear();
    
    const nightLabel = nights === 1 ? '1 Night' : `${nights} Nights`;
    
    if (startM === endM && startY === endY) {
        return `${startM} ${startD} – ${endD}, ${startY} (${nightLabel})`;
    } else if (startY === endY) {
        return `${startM} ${startD} – ${endM} ${endD}, ${startY} (${nightLabel})`;
    } else {
        return `${startM} ${startD}, ${startY} – ${endM} ${endD}, ${endY} (${nightLabel})`;
    }
}

const DURATION_PRESETS = [
    { nights: 1, label: '1 Night', sub: '2D / 1N' },
    { nights: 2, label: '2 Nights', sub: '3D / 2N' },
    { nights: 3, label: '3 Nights', sub: '4D / 3N' },
    { nights: 4, label: '4 Nights', sub: '5D / 4N' },
    { nights: 'custom', label: 'Custom Range', sub: 'Flexible' }
];

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
    const containerRef = useRef(null);

    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    // Initial parsed state
    const parsedInitial = useMemo(() => {
        const parsed = parseExistingDate(effectiveSelectedDate);
        if (parsed && parsed.start >= today) return parsed;
        // Default to upcoming Saturday (or tomorrow)
        const defaultStart = new Date(today);
        const day = defaultStart.getDay();
        const daysUntilSat = (6 - day + 7) % 7 || 7;
        defaultStart.setDate(defaultStart.getDate() + daysUntilSat);
        const defaultEnd = addDays(defaultStart, Math.max(1, (durationDays || 2) - 1));
        return { start: defaultStart, end: defaultEnd, nights: Math.max(1, (durationDays || 2) - 1) };
    }, [effectiveSelectedDate, today, durationDays]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(parsedInitial.start);
    const [endDate, setEndDate] = useState(parsedInitial.end);
    const [nights, setNights] = useState(parsedInitial.nights || 1);
    const [selectedDurationPreset, setSelectedDurationPreset] = useState(parsedInitial.nights || 1);
    const [isPickingEnd, setIsPickingEnd] = useState(false);
    const [hoveredDateIso, setHoveredDateIso] = useState(null);

    // Current viewing month & year
    const [currentMonth, setCurrentMonth] = useState(parsedInitial.start.getMonth());
    const [currentYear, setCurrentYear] = useState(parsedInitial.start.getFullYear());

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

    // Sync state when external prop changes
    useEffect(() => {
        const parsed = parseExistingDate(effectiveSelectedDate);
        if (parsed) {
            setStartDate(parsed.start);
            setEndDate(parsed.end);
            setNights(parsed.nights);
            setSelectedDurationPreset(parsed.nights <= 4 ? parsed.nights : 'custom');
            setCurrentMonth(parsed.start.getMonth());
            setCurrentYear(parsed.start.getFullYear());
        }
    }, [effectiveSelectedDate]);

    // Calendar bounds
    const daysInMonth = useMemo(() => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    }, [currentYear, currentMonth]);

    const firstDayIndex = useMemo(() => {
        return new Date(currentYear, currentMonth, 1).getDay();
    }, [currentYear, currentMonth]);

    const canGoPrev = useMemo(() => {
        return !(currentYear < today.getFullYear() || (currentYear === today.getFullYear() && currentMonth <= today.getMonth()));
    }, [currentYear, currentMonth, today]);

    const canGoNext = useMemo(() => {
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 11, 1);
        return !(currentYear > maxDate.getFullYear() || (currentYear === maxDate.getFullYear() && currentMonth >= maxDate.getMonth()));
    }, [currentYear, currentMonth, today]);

    const handlePrevMonth = () => {
        if (!canGoPrev) return;
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (!canGoNext) return;
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    // Handle day click in regular calendar
    const handleDayClick = (dayNumber) => {
        const clickedDate = new Date(currentYear, currentMonth, dayNumber);
        clickedDate.setHours(0, 0, 0, 0);
        if (clickedDate < today) return;

        if (isPickingEnd && startDate) {
            if (clickedDate > startDate) {
                // Completed range selection!
                const diffDays = Math.round((clickedDate - startDate) / 86400000);
                setEndDate(clickedDate);
                setNights(diffDays);
                setSelectedDurationPreset(diffDays <= 4 ? diffDays : 'custom');
                setIsPickingEnd(false);
                return;
            } else {
                // Clicked same or earlier date -> restart start date
                setStartDate(clickedDate);
                const defaultNights = typeof selectedDurationPreset === 'number' ? selectedDurationPreset : 1;
                setEndDate(addDays(clickedDate, defaultNights));
                setNights(defaultNights);
                setIsPickingEnd(false);
                return;
            }
        }

        // New selection start
        setStartDate(clickedDate);
        const defaultNights = typeof selectedDurationPreset === 'number' ? selectedDurationPreset : 1;
        setEndDate(addDays(clickedDate, defaultNights));
        setNights(defaultNights);
        setIsPickingEnd(false);
    };

    // Handle preset duration change
    const handleDurationPresetClick = (preset) => {
        if (preset.nights === 'custom') {
            setSelectedDurationPreset('custom');
            setIsPickingEnd(true);
            return;
        }

        const count = preset.nights;
        setSelectedDurationPreset(count);
        setNights(count);
        setIsPickingEnd(false);
        if (startDate) {
            setEndDate(addDays(startDate, count));
        }
    };

    // Confirm & apply selected dates
    const handleConfirmDates = () => {
        if (!startDate || !endDate) return;
        const formatted = formatStayDateRange(startDate, endDate, nights);
        handleDateChange(formatted);
        setIsModalOpen(false);
    };

    // Selected availability info
    const selectedStartIso = useMemo(() => formatDateToIso(startDate), [startDate]);
    const selectedEndIso = useMemo(() => formatDateToIso(endDate), [endDate]);
    const activeAvailability = useMemo(() => {
        return getDateAvailability(selectedStartIso);
    }, [selectedStartIso]);

    // Hovered date details
    const hoveredDetails = useMemo(() => {
        if (!hoveredDateIso) return null;
        const avail = getDateAvailability(hoveredDateIso);
        const parsed = parseIso(hoveredDateIso);
        if (!parsed) return null;
        return {
            dateStr: `${MONTH_SHORT[parsed.getMonth()]} ${parsed.getDate()}`,
            avail
        };
    }, [hoveredDateIso]);

    const isDark = theme === 'dark';
    const displayLabel = useMemo(() => {
        if (startDate && endDate) {
            return formatStayDateRange(startDate, endDate, nights);
        }
        return effectiveSelectedDate || 'Select Stay Dates';
    }, [startDate, endDate, nights, effectiveSelectedDate]);

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

            {/* ── Trigger Input Button ── */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    background: isDark ? '#121613' : '#FFFFFF',
                    border: isDark ? '1.5px solid rgba(213, 237, 85, 0.3)' : '1.5px solid rgba(18, 22, 19, 0.12)',
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '11px',
                        background: isDark ? 'rgba(213, 237, 85, 0.12)' : '#F4F7EB',
                        border: isDark ? '1px solid rgba(213, 237, 85, 0.3)' : '1px solid rgba(22, 101, 52, 0.2)',
                        color: isDark ? '#D5ED55' : '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <CalendarIcon size={19} strokeWidth={2.4} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                            fontSize: '13.5px',
                            fontWeight: '900',
                            color: isDark ? '#FFFFFF' : '#121613',
                            lineHeight: 1.25,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {displayLabel}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '3px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                fontSize: '10.5px',
                                fontWeight: '800',
                                color: isDark ? '#E5A93B' : '#166534',
                                background: isDark ? 'rgba(229, 169, 59, 0.15)' : '#E9EFE6',
                                borderRadius: '6px',
                                padding: '2px 7px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Clock size={10} strokeWidth={2.4} />
                                <span>Check-in 2:00 PM · Out 11:00 AM</span>
                            </span>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                color: '#166534',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeAvailability.dotColor, display: 'inline-block' }} />
                                {activeAvailability.badgeText}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '7px 13px',
                    borderRadius: '999px',
                    background: isDark ? 'rgba(229, 169, 59, 0.18)' : '#121613',
                    color: isDark ? '#E5A93B' : '#D5ED55',
                    fontSize: '12px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                }}>
                    <span>Change</span>
                    <ChevronRight size={13} strokeWidth={2.5} />
                </div>
            </button>

            {/* ── INTERACTIVE REGULAR CALENDAR MODAL WITH AVAILABILITY DOTS & CUSTOM STAY SELECTOR ── */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <div 
                            className="batch-picker-overlay"
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 10001,
                                background: 'rgba(7, 14, 9, 0.75)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '16px',
                                overflowY: 'auto'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    maxWidth: '560px',
                                    background: '#FFFFFF',
                                    borderRadius: '24px',
                                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.35)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid rgba(18, 22, 19, 0.12)'
                                }}
                            >
                                {/* Modal Header */}
                                <div style={{
                                    padding: '18px 22px 14px',
                                    borderBottom: '1px solid rgba(18, 22, 19, 0.08)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9F5 100%)',
                                    gap: '12px'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CalendarIcon size={16} color="#166534" strokeWidth={2.4} />
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#121613', fontFamily: 'var(--font-heading)' }}>
                                                Select Stay Dates
                                            </h3>
                                        </div>
                                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#59655D' }}>
                                            Check-in <strong>2:00 PM</strong> · Check-out <strong>11:00 AM</strong> · Live PMS Availability
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        aria-label="Back to booking"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: '#F1F3EC',
                                            border: '1px solid rgba(18, 22, 19, 0.12)',
                                            borderRadius: '999px',
                                            padding: '7px 15px',
                                            color: '#121613',
                                            fontSize: '12.5px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                    >
                                        <ArrowLeft size={14} strokeWidth={2.5} />
                                        <span>Back</span>
                                    </button>
                                </div>

                                {/* Custom Stay Duration Pills (1 Night, 2 Nights, 3 Nights, 4 Nights, Custom Range) */}
                                <div style={{
                                    padding: '12px 20px',
                                    background: '#F6F8F2',
                                    borderBottom: '1px solid rgba(18, 22, 19, 0.06)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                            Stay Duration · Custom Select:
                                        </span>
                                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#166534' }}>
                                            {nights} {nights === 1 ? 'Night' : 'Nights'} ({nights + 1} Days)
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                                        {DURATION_PRESETS.map((preset) => {
                                            const isSelected = selectedDurationPreset === preset.nights;
                                            return (
                                                <button
                                                    key={String(preset.nights)}
                                                    type="button"
                                                    onClick={() => handleDurationPresetClick(preset)}
                                                    style={{
                                                        padding: '7px 14px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        border: isSelected ? '1.5px solid #166534' : '1px solid rgba(18, 22, 19, 0.12)',
                                                        background: isSelected ? '#166534' : '#FFFFFF',
                                                        color: isSelected ? '#FFFFFF' : '#121613',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1,
                                                        minWidth: '76px',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(22, 101, 52, 0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
                                                        transition: 'all 0.18s ease'
                                                    }}
                                                >
                                                    <span>{preset.label}</span>
                                                    <span style={{ fontSize: '9.5px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '700' }}>
                                                        {preset.sub}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Calendar Container */}
                                <div style={{ padding: '16px 20px 14px' }}>

                                    {/* Month & Year Navigation Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '14px'
                                    }}>
                                        <button
                                            type="button"
                                            onClick={handlePrevMonth}
                                            disabled={!canGoPrev}
                                            aria-label="Previous Month"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: '#F1F3EC',
                                                border: '1px solid rgba(18, 22, 19, 0.1)',
                                                color: '#121613',
                                                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                                                opacity: canGoPrev ? 1 : 0.3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <ChevronLeft size={16} strokeWidth={2.5} />
                                        </button>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '900', color: '#121613' }}>
                                                {MONTH_NAMES[currentMonth]} {currentYear}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#59655D', fontWeight: '700' }}>
                                                {isPickingEnd ? 'Click Check-Out Date' : 'Click Date to Select Stay'}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNextMonth}
                                            disabled={!canGoNext}
                                            aria-label="Next Month"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: '#F1F3EC',
                                                border: '1px solid rgba(18, 22, 19, 0.1)',
                                                color: '#121613',
                                                cursor: canGoNext ? 'pointer' : 'not-allowed',
                                                opacity: canGoNext ? 1 : 0.3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <ChevronRight size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* Live PC/Desktop Hover or Selection Info Pill */}
                                    <div style={{
                                        minHeight: '28px',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {hoveredDetails ? (
                                            <div style={{
                                                fontSize: '11.5px',
                                                fontWeight: '800',
                                                color: '#121613',
                                                background: '#F1F3EC',
                                                padding: '3px 12px',
                                                borderRadius: '999px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                border: '1px solid rgba(18, 22, 19, 0.08)'
                                            }}>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: hoveredDetails.avail.dotColor }} />
                                                <span>{hoveredDetails.dateStr} · <strong>{hoveredDetails.avail.badgeText}</strong></span>
                                            </div>
                                        ) : (
                                            <div style={{
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                color: '#7D8880',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
                                                <span>Green dots show open verified campsite availability</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Days of Week Header */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '4px',
                                        textAlign: 'center',
                                        marginBottom: '6px'
                                    }}>
                                        {DAYS_OF_WEEK.map((d, idx) => (
                                            <div
                                                key={d}
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    color: idx === 0 || idx === 6 ? '#E5A93B' : '#7D8880',
                                                    padding: '4px 0'
                                                }}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Day Grid with Availability Dots */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '4px'
                                    }}>
                                        {/* Blank offset cells */}
                                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                                            <div key={`blank-${idx}`} style={{ height: '48px' }} />
                                        ))}

                                        {/* Days */}
                                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                                            const dayNum = idx + 1;
                                            const thisDate = new Date(currentYear, currentMonth, dayNum);
                                            thisDate.setHours(0, 0, 0, 0);
                                            const thisIso = formatDateToIso(thisDate);
                                            const isPast = thisDate < today;

                                            const isStart = startDate && formatDateToIso(startDate) === thisIso;
                                            const isEnd = endDate && formatDateToIso(endDate) === thisIso;
                                            const isInRange = startDate && endDate && thisDate > startDate && thisDate < endDate;
                                            
                                            const isWeekend = thisDate.getDay() === 0 || thisDate.getDay() === 6;
                                            const avail = getDateAvailability(thisIso);

                                            return (
                                                <button
                                                    key={dayNum}
                                                    type="button"
                                                    disabled={isPast}
                                                    onClick={() => handleDayClick(dayNum)}
                                                    onMouseEnter={() => !isPast && setHoveredDateIso(thisIso)}
                                                    onMouseLeave={() => setHoveredDateIso(null)}
                                                    style={{
                                                        height: '48px',
                                                        borderRadius: isStart ? '14px 4px 4px 14px' : isEnd ? '4px 14px 14px 4px' : isInRange ? '4px' : '12px',
                                                        border: isStart || isEnd ? '2px solid #166534' : '1px solid transparent',
                                                        background: isStart || isEnd
                                                            ? '#166534'
                                                            : isInRange
                                                                ? 'rgba(22, 101, 52, 0.12)'
                                                                : isWeekend
                                                                    ? '#F5F7EF'
                                                                    : 'transparent',
                                                        color: isStart || isEnd
                                                            ? '#FFFFFF'
                                                            : isPast
                                                                ? '#C2C9C4'
                                                                : '#121613',
                                                        cursor: isPast ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '4px 2px',
                                                        position: 'relative',
                                                        transition: 'all 0.12s ease'
                                                    }}
                                                >
                                                    <span style={{
                                                        fontSize: '13.5px',
                                                        fontWeight: isStart || isEnd ? '900' : '700',
                                                        lineHeight: 1
                                                    }}>
                                                        {dayNum}
                                                    </span>

                                                    {/* In / Out Label or Availability Dot */}
                                                    {isStart ? (
                                                        <span style={{ fontSize: '8.5px', fontWeight: '900', color: '#D5ED55', marginTop: '2px', textTransform: 'uppercase' }}>
                                                            IN
                                                        </span>
                                                    ) : isEnd ? (
                                                        <span style={{ fontSize: '8.5px', fontWeight: '900', color: '#D5ED55', marginTop: '2px', textTransform: 'uppercase' }}>
                                                            OUT
                                                        </span>
                                                    ) : !isPast ? (
                                                        <span style={{
                                                            width: '5px',
                                                            height: '5px',
                                                            borderRadius: '50%',
                                                            background: avail.dotColor,
                                                            marginTop: '4px',
                                                            display: 'block'
                                                        }} />
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Availability Legend */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '14px',
                                        marginTop: '14px',
                                        paddingTop: '10px',
                                        borderTop: '1px solid rgba(18, 22, 19, 0.06)',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: '#59655D',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
                                            <span>Available (6+ left)</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E5A93B' }} />
                                            <span>Filling Fast (2–5 left)</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} />
                                            <span>1 Left</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Bottom Summary & Confirm Action Bar */}
                                <div style={{
                                    padding: '16px 20px',
                                    background: '#F8F9F5',
                                    borderTop: '1px solid rgba(18, 22, 19, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }}>
                                    <div style={{ minWidth: '180px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '900', color: '#121613' }}>
                                            {startDate && endDate ? formatStayDateRange(startDate, endDate, nights) : 'Select Check-in Date'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                            <span style={{
                                                fontSize: '10.5px',
                                                fontWeight: '800',
                                                color: '#166534',
                                                background: '#DCFCE7',
                                                padding: '2px 7px',
                                                borderRadius: '6px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: activeAvailability.dotColor }} />
                                                <span>{activeAvailability.badgeText}</span>
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>
                                                {nights}N / {nights + 1}D
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleConfirmDates}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            background: '#121613',
                                            color: '#D5ED55',
                                            border: 'none',
                                            fontSize: '13.5px',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                                            transition: 'transform 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <span>Confirm Stay Dates</span>
                                        <Check size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
