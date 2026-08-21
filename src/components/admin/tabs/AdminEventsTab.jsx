"use client";
import React from 'react';
import { Calendar, Plus, Users, Mountain, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { inr } from '../../../lib/utils';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, ROW_SPACE_WRAP, ROW_SPACE_14 
} from '../AdminSharedStyles';

export default function AdminEventsTab({
    events,
    openEventModal,
    handleDeleteEvent
}) {
    return (
        <div>
                    <div style={{ width: '100%' }}>
                        <div style={ROW_SPACE_WRAP}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
<span className="star-icon">★</span> EXPEDITION BATCHES
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Scheduled Trek Batches & Camps
                                </h2>
                            </div>
                            <button onClick={() => handleOpenEventModal()} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800' }}>
                                + Create New Batch
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {events.map(ev => (
                                <div key={ev.id} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
                                    <div style={{ position: 'relative', height: '170px' }}>
                                        <img src={ev.image} alt={ev.title} style={IMG_FILL_STYLE}  loading="lazy" decoding="async"/>
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.badge}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.dates}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
{ev.campsite}
                                        </div>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', color: '#121613', margin: '0 0 8px', lineHeight: 1.3 }}>
                                            {ev.title}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.5, marginBottom: '16px' }}>{ev.description}</p>

                                        {/* Capacity Tracker */}
                                        <div style={{ background: '#F8F9F5', padding: '14px 16px', borderRadius: '14px', marginBottom: '16px', border: '1px solid rgba(18,22,19,0.04)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                                                <span style={{ color: '#121613' }}>Ticket: ₹{ev.price}</span>
                                                <span style={{ color: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }}>
                                                    {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Left (${ev.booked}/${ev.capacity})`}
                                                </span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(18,22,19,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min(100, (ev.booked / ev.capacity) * 100)}%`, background: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleOpenEventModal(ev)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#121613', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
Edit Batch 
                                            </button>
                                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', fontSize: '12.5px', cursor: 'pointer' }}>
                                            <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
        </div>
    );
}
