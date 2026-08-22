"use client";
import React from 'react';
import { Check, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { inr } from '../../lib/utils';
import { ADDONS_LIST } from './BookingConstants';

export default function Step2AddonsActivities({
    selectedAddons = [],
    toggleAddon = () => {},
    adults = 2,
    children = 0,
    totalGuests: propTotalGuests,
    currentStepPrice = 0,
    selectedPkg = {},
    selectedRoom = {},
    baseLodgingAmount = 0,
    addonsAmount = 0,
    totalAmount = 0,
    discountSummary = {},
    discountLabel = '',
    setStep = () => {}
}) {
    const currentPkg = selectedPkg || {};
    const totalGuests = propTotalGuests || (adults + children);
    const baseTotal = baseLodgingAmount || currentStepPrice || 0;
    const discountAmount = discountSummary?.totalSavings || discountSummary?.discountAmount || 0;
    const activeDiscountLabel = discountLabel || discountSummary?.appliedDiscounts?.[0]?.name || discountSummary?.label || 'Discount Applied';
    const addonsTotal = addonsAmount || selectedAddons.reduce((sum, addonId) => {
        const addon = ADDONS_LIST.find(a => a.id === addonId);
        if (!addon) return sum;
        return sum + (addon.perPerson ? addon.price * adults : addon.price);
    }, 0);
    const grandTotal = totalAmount || Math.max(0, baseTotal - discountAmount + addonsTotal);

    return (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
                                                Customize Your Mountain Journey (Optional Upgrades)
                                            </label>
                                            <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                                                {selectedAddons.length} selected
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {ADDONS_LIST.map((addon) => {
                                                const isChecked = selectedAddons.includes(addon.id);
                                                return (
                                                    <div
                                                        key={addon.id}
                                                        onClick={() => toggleAddon(addon.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            border: isChecked ? '2px solid #166534' : '1px solid rgba(0,0,0,0.08)',
                                                            background: isChecked ? '#F4F7EB' : '#FFFFFF',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            gap: '12px'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleAddon(addon.id)}
                                                                style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: 'pointer' }}
                                                            />
                                                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: isChecked ? '#166534' : '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, color: isChecked ? '#D5ED55' : '#121613' }}>
                                                                <addon.icon size={17} strokeWidth={2.2} />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>
                                                                    {addon.name}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>
                                                                    {addon.desc}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                            <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#166534' }}>
                                                                +₹{addon.price}
                                                            </div>
                                                            <div style={{ fontSize: '10.5px', color: '#59655D' }}>
                                                                {addon.perPerson ? `₹${addon.price * totalGuests} total` : 'Flat group fee'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Summary Preview Box */}
                                    <div style={{ padding: '14px 18px', background: '#121613', borderRadius: '16px', color: '#FFFFFF', marginBottom: '18px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px' }}>
                                            <span style={{ color: '#A2B6A6' }}>{currentPkg.title} ({totalGuests} Campers):</span>
                                            <span>
                                                {discountAmount > 0 && (
                                                    <span style={{ textDecoration: 'line-through', color: '#8A938B', marginRight: '8px', fontSize: '11.5px' }}>
                                                        ₹{baseTotal.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span>₹{(baseTotal - discountAmount).toLocaleString('en-IN')}</span>
                                            </span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#D5ED55' }}>
                                                <span>{activeDiscountLabel}:</span>
                                                <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {addonsTotal > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12.5px', color: '#D5ED55' }}>
                                                <span>Add-ons ({selectedAddons.length} Selected):</span>
                                                <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800' }}>Updated Grand Total:</span>
                                            <span style={{ fontSize: '20px', fontWeight: '900', color: '#D5ED55' }}>
                                                ₹{grandTotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="booking-step-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="btn-secondary"
                                            style={{ background: '#F1F3EC', border: 'none', fontSize: '13px', fontWeight: '700', color: '#59655D', cursor: 'pointer', padding: '8px 14px', borderRadius: '10px' }}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="btn-lime"
                                            style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                        >
                                            <span>Continue to Details</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
    );
}
