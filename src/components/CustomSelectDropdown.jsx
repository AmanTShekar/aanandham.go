"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelectDropdown({
    label,
    options = [], // [{ value, label, sublabel, badge, price, icon }]
    value,
    onChange,
    theme = 'light', // 'light' | 'dark'
    placeholder = 'Select Option'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isDark = theme === 'dark';
    const selectedOption = options.find(opt => String(opt.value) === String(value));

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

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

            {/* Main Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: isDark ? 'rgba(255, 255, 255, 0.07)' : '#F8F9F5',
                    border: isOpen
                        ? (isDark ? '1px solid #D5ED55' : '1.5px solid #121613')
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(18, 22, 19, 0.12)'),
                    color: isDark ? '#FFFFFF' : '#121613',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 4px 18px rgba(0,0,0,0.06)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    {selectedOption?.icon && <span>{selectedOption.icon}</span>}
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    {selectedOption?.price !== undefined && (
                        <span style={{ fontSize: '12px', color: isDark ? '#D5ED55' : '#166534', fontWeight: '800' }}>
                            (₹{selectedOption.price})
                        </span>
                    )}
                </div>

                <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9.5px',
                    color: isDark ? '#D5ED55' : '#121613',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s ease'
                }}>
                    ▼
                </div>
            </button>

            {/* Custom Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: isDark ? '#111D15' : '#FFFFFF',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(18, 22, 19, 0.12)',
                            borderRadius: '16px',
                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
                            padding: '8px',
                            maxHeight: '260px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {options.map((opt) => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        style={{
                                            padding: '10px 12px',
                                            borderRadius: '10px',
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                            {opt.icon && <span>{opt.icon}</span>}
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {opt.label}
                                                </div>
                                                {opt.sublabel && (
                                                    <div style={{ fontSize: '11px', color: isDark ? '#A2B6A6' : '#59655D' }}>
                                                        {opt.sublabel}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                            {opt.badge && (
                                                <span style={{ fontSize: '10px', fontWeight: '800', background: isDark ? '#121613' : '#F1F3EC', color: isDark ? '#E5A93B' : '#121613', padding: '2px 7px', borderRadius: '999px' }}>
                                                    {opt.badge}
                                                </span>
                                            )}
                                            {opt.price !== undefined && (
                                                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#D5ED55' : '#121613' }}>
                                                    ₹{opt.price}
                                                </span>
                                            )}
                                            {isSelected && (
                                                <span style={{ color: isDark ? '#D5ED55' : '#166534', fontWeight: '900', fontSize: '13px' }}>
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
