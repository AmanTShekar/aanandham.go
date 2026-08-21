"use client";
import React from 'react';
import { BadgePercent, Plus, Save, Trash2, Check, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { inr } from '../../../lib/utils';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14, FORM_INPUT_STYLE, FIELD_LABEL_STYLE 
} from '../AdminSharedStyles';

export default function AdminDiscountsTab({
    discounts = [],
    setDiscounts,
    handleSaveDiscounts,
    discountsSaving = false,
    handleResetDefaultDiscounts
}) {
    const handleAddDiscount = () => {
        const newD = {
            id: `disc_${Date.now()}`,
            name: 'New Custom Promo',
            code: 'SUMMER2026',
            type: 'percent', // 'percent' | 'flat'
            value: 10,
            condition: 'all', // 'all' | 'advance' | 'party_size' | 'campsite'
            minPartySize: 4,
            active: true
        };
        setDiscounts(prev => [...(prev || []), newD]);
    };

    const handleUpdateDiscount = (id, updates) => {
        setDiscounts(prev => (prev || []).map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const handleRemoveDiscount = (id) => {
        setDiscounts(prev => (prev || []).filter(d => d.id !== id));
    };

    const handleResetDiscounts = () => {
        if (handleResetDefaultDiscounts) {
            handleResetDefaultDiscounts();
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div className="star-badge" style={{ marginBottom: '3px' }}>
                        <span className="star-icon">★</span> OFFERS & CAMPAIGNS
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#121613' }}>
                        Discounts & Offers Center
                    </h2>
                    <p style={{ fontSize: '12.5px', color: '#59655D', margin: 0 }}>
                        Manage automated discount campaigns. The best applicable offer is applied automatically at booking across all campsites.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleAddDiscount}
                        className="btn-secondary"
                        style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px' }}
                    >
                        <Plus size={14} />
                        <span>New Campaign</span>
                    </button>
                    <button
                        onClick={handleResetDiscounts}
                        className="btn-secondary"
                        style={{ padding: '9px 16px', fontSize: '12.5px', fontWeight: '800', border: '1px solid rgba(18,22,19,0.15)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '10px', color: '#B45309' }}
                    >
                        <RefreshCw size={14} />
                        <span>Reset to Defaults</span>
                    </button>
                    <button
                        onClick={handleSaveDiscounts}
                        disabled={discountsSaving}
                        className="btn-lime"
                        style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: discountsSaving ? 0.6 : 1 }}
                    >
                        <Save size={14} />
                        <span>{discountsSaving ? 'Saving...' : 'Save & Apply'}</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', background: 'rgba(229,169,59,0.08)', border: '1px solid rgba(229,169,59,0.25)', borderRadius: '12px', padding: '10px 14px' }}>
                <Zap size={15} style={{ color: '#B45309', flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: '#7C4A03', fontWeight: '700', lineHeight: 1.45 }}>
                    Smart auto-application: If a customer qualifies for multiple promotions, our booking engine automatically selects the single highest savings for them.
                </span>
            </div>

            {/* Campaign Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {(discounts || []).map((d) => (
                    <div
                        key={d.id}
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            border: d.active ? '1.5px solid rgba(22, 101, 52, 0.25)' : '1px solid rgba(18, 22, 19, 0.08)',
                            padding: '18px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: '800', color: '#121613', fontSize: '14px' }}>
                                    {d.name || 'Unnamed Campaign'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>
                                    Code: <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#166534' }}>{d.code || 'AUTO'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveDiscount(d.id)}
                                title="Remove campaign"
                                style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#59655D', display: 'block', marginBottom: '3px' }}>
                                    Discount Value
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={d.value || 0}
                                    onChange={(e) => handleUpdateDiscount(d.id, { value: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(18,22,19,0.12)', fontSize: '12.5px', fontWeight: '700', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#59655D', display: 'block', marginBottom: '3px' }}>
                                    Type
                                </label>
                                <select
                                    value={d.type || 'percent'}
                                    onChange={(e) => handleUpdateDiscount(d.id, { type: e.target.value })}
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(18,22,19,0.12)', fontSize: '12.5px', fontWeight: '700', background: '#FFFFFF', boxSizing: 'border-box' }}
                                >
                                    <option value="percent">% Percentage</option>
                                    <option value="flat">₹ Flat INR</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(18,22,19,0.06)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: d.active ? '#166534' : '#7D8880', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={!!d.active}
                                    onChange={(e) => handleUpdateDiscount(d.id, { active: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: '#166534', cursor: 'pointer' }}
                                />
                                Active Campaign
                            </label>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#166534' }}>
                                {d.type === 'flat' ? `₹${Number(d.value || 0).toLocaleString('en-IN')} OFF` : `${Number(d.value || 0)}% OFF`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: '#121613', borderRadius: '20px', padding: '24px 28px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
                <div>
                    <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {(discounts || []).filter(d => d.active).length} ACTIVE CAMPAIGN{(discounts || []).filter(d => d.active).length === 1 ? '' : 'S'}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#A2B6A6', marginTop: '2px' }}>
                        Changes take effect immediately across all booking modals on the website.
                    </div>
                </div>
                <button
                    onClick={handleSaveDiscounts}
                    disabled={discountsSaving}
                    className="btn-lime"
                    style={{ padding: '13px 32px', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: discountsSaving ? 0.6 : 1 }}
                >
                    {discountsSaving ? 'Saving...' : 'Save & Apply Campaigns'}
                </button>
            </div>
        </div>
    );
}
