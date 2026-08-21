"use client";
import React from 'react';
import { Users, Plus, ShieldCheck, Phone, KeyRound, Smartphone, Check, X, RefreshCw, Trash2, Mountain } from 'lucide-react';
import { waLink } from '../../../lib/whatsapp';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14, CARD_CLICKABLE 
} from '../AdminSharedStyles';

export default function AdminMarshalsTab({
    marshals,
    properties,
    openMarshalModal,
    handleDeleteMarshal,
    setScannerOverlayOpen,
    handleQuickAddStaffPreset
}) {
    return (
        <div>
                    <div style={{ width: '100%' }}>
                        <div style={ROW_SPACE_WRAP}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
<span className="star-icon">★</span> FIELD OPERATIONS & SANCTUARY CREW
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Camp Hosts & Certified Guides
                                </h2>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '4px' }}>
                                    Manage basecamp hosts, summit trek guides, 4x4 convoy pilots, and gate check-in PIN access across all sanctuaries.
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
<button
                                    onClick={() => setScannerOverlayOpen(true)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18,22,19,0.12)',
                                        color: '#121613',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <span><Smartphone size={14} /> Open Scanner Simulator</span>
                                </button>
                                <button
                                    onClick={() => handleOpenMarshalModal()}
                                    className="btn-lime"
                                    style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800', cursor: 'pointer', border: 'none', borderRadius: '12px' }}
                                >
                                    + Add Camp Host / Guide
                                </button>
                            </div>
                        </div>

                        {/* Hosts & Guides Card Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                            {marshals.map(m => (
                                <div
                                    key={m.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: m.status === 'On Duty' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(18, 22, 19, 0.08)',
                                        borderRadius: '20px',
                                        padding: '22px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                                        position: 'relative'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                                                <img
                                                    src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                                    alt={m.name}
                                                    style={{
                                                        width: '54px',
                                                        height: '54px',
                                                        borderRadius: '16px',
                                                        objectFit: 'cover',
                                                        flexShrink: 0,
                                                        border: m.status === 'On Duty' ? '2.5px solid #22C55E' : m.status === 'Off Duty' ? '2.5px solid #F59E0B' : '2.5px solid #EF4444'
                                                    }}
                                                 loading="lazy" decoding="async"/>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {m.name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', background: 'rgba(22,101,52,0.06)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
{m.role || ' Camp Host & Guide'}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#59655D', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                                                        <span><Phone size={16} /></span>
                                                        <a href={`tel:${m.phone}`} style={{ color: '#59655D', textDecoration: 'none', fontWeight: '600' }}>{m.phone}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleMarshalStatus(m.id)}
                                                title="Click to cycle duty status (On Duty / Off Duty / Closed)"
                                                style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '999px',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    flexShrink: 0,
                                                    background: m.status === 'On Duty' ? '#DCFCE7' : m.status === 'Off Duty' ? '#FEF3C7' : '#FEE2E2',
                                                    color: m.status === 'On Duty' ? '#166534' : m.status === 'Off Duty' ? '#92400E' : '#991B1B',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }}
                                            >
{m.status === 'On Duty' ? ' On Duty' : m.status === 'Off Duty' ? ' Off Duty' : ' Closed'}
                                            </button>
                                        </div>

                                        {/* Station Assignment Box */}
                                        <div style={{ background: '#F8F9F5', padding: '12px 14px', borderRadius: '14px', marginBottom: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                            <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                Assigned Sanctuary Station & Gate PIN
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#121613', marginBottom: '6px' }}>
{m.station}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                                <div style={{ fontSize: '12px', color: '#166534', fontWeight: '800', background: 'rgba(22,101,52,0.08)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(22,101,52,0.15)' }}>
Passcode: {m.passcode}
                                                </div>
                                                <span style={{ fontSize: '11px', color: '#7D8880', fontWeight: '600' }}>ID: {m.id}</span>
                                            </div>
                                        </div>

                                        {m.notes && (
                                            <div style={{ fontSize: '12px', color: '#59655D', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4, background: 'rgba(18,22,19,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                                                "{m.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(18,22,19,0.08)', paddingTop: '14px' }}>
                                        <a
                                            href={waLink(`Hi ${m.name}! Aanandham Basecamp HQ dispatching update for ${m.station}.`, m.phone)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: '9px 12px',
                                                borderRadius: '10px',
                                                background: '#25D366',
                                                color: '#FFFFFF',
                                                textDecoration: 'none',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <span><MessageCircle size={14} /> WhatsApp Dispatch</span>
                                        </a>
                                        <button
                                            onClick={() => handleOpenMarshalModal(m)}
                                            style={{
                                                padding: '9px 14px',
                                                borderRadius: '10px',
                                                background: '#F8F9F5',
                                                border: '1px solid rgba(18,22,19,0.1)',
                                                color: '#121613',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
Edit 
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMarshal(m.id)}
                                            title="Revoke Credentials"
                                            style={{
                                                padding: '9px 12px',
                                                borderRadius: '10px',
                                                background: 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.15)',
                                                color: '#DC2626',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                        <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
        </div>
    );
}
