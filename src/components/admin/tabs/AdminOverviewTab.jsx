"use client";
import React from 'react';
import { 
    LayoutDashboard, TrendingUp, IndianRupee, Users, ShieldCheck, Ticket, 
    ArrowUpRight, RefreshCw, Smartphone, Trees, Mountain, AlertCircle, ChevronRight, 
    Download, Banknote, Zap, Tent, Calendar, Compass, ScrollText, ClipboardList 
} from 'lucide-react';
import { inr } from '../../../lib/utils';
import { waLink } from '../../../lib/whatsapp';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, FIELD_LABEL_5, CARD_CLICKABLE, MICRO_LABEL, 
    ROW_SPACE_WRAP, ROW_SPACE_14, SECTION_LABEL_STYLE 
} from '../AdminSharedStyles';

export default function AdminOverviewTab({
    stats = {},
    properties = [],
    bookings = [],
    events = [],
    marshals = [],
    paymentSettings = {},
    setActiveTab = () => {},
    openPropertyModal,
    setIsAddBookingModalOpen = () => {},
    setIsMarshalModalOpen = () => {},
    setScannerOverlayOpen = () => {},
    fetchBookings = () => {},
    fetchAuditLogs = () => {},
    fetchSecurityOverview = () => {},
    fetchInquiries = () => {},
    handleSeedSampleBookings = () => {},
    handleExportCSV,
    handleExportBookingsCSV
}) {
    const onExport = handleExportCSV || handleExportBookingsCSV;
    const paidBookings = Array.isArray(bookings) ? bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In') : [];
    const totalRevenue = stats?.totalRevenue ?? paidBookings.reduce((acc, b) => acc + (Number(b.total) || 0), 0);
    const estimatedNetProfit = stats?.estimatedNetProfit ?? Math.round(totalRevenue * 0.55);
    const profitMarginPercent = stats?.profitMarginPercent ?? (totalRevenue > 0 ? 55 : 0);
    const activeCampers = stats?.activeCampers ?? paidBookings.reduce((acc, b) => acc + (Number(b.guests) || 0), 0);
    const activeEventsCount = stats?.activeEventsCount ?? (Array.isArray(events) ? events.filter(e => e.status === 'Active').length : 0);
    return (
        <div>
                    <div style={{ width: '100%' }}>
                        
                        {/* Header Intro */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '3px' }}>
<span className="star-icon">★</span> EXECUTIVE DASHBOARD
                                </div>
                                <h2 style={H2_STYLE}>
                                    Real-Time Operations & KPIs
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={onExport} style={{ padding: '7px 14px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <span><Download size={14} /> Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '7px 16px', fontSize: '12px', fontWeight: '800' }}>
                                    + Manual Booking
                                </button>
                            </div>
                        </div>

{/* 4 Hero KPI Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            
                            {/* Card 1: Gross Revenue */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={ROW_SPACE_8}>
                                    <span style={META_LABEL_STYLE}>
                                        Gross Revenue
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Banknote size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                    From {paidBookings.length} confirmed bookings
                                </div>
                            </div>

                            {/* Card 2: Operating Profit */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={ROW_SPACE_8}>
                                    <span style={META_LABEL_STYLE}>
                                        Est. Net Profit
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(22, 101, 52, 0.08)', border: '1px solid rgba(22, 101, 52, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <TrendingUp size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#166534', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    ₹{estimatedNetProfit.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
✓ {profitMarginPercent}% Net Margin
                                </div>
                            </div>

                            {/* Card 3: Total Campers */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={ROW_SPACE_8}>
                                    <span style={META_LABEL_STYLE}>
                                        Total Confirmed Campers
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Users size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    {activeCampers} <span style={{ fontSize: '16px', color: '#59655D', fontWeight: '600' }}>Pax</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                    Across Kerala Campsites
                                </div>
                            </div>

                            {/* Card 4: Pending Inquiries */}
                            <div style={{
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                borderRadius: '18px',
                                padding: '20px 22px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div style={ROW_SPACE_8}>
                                    <span style={META_LABEL_STYLE}>
                                        Pending Inquiries
                                    </span>
                                    <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                                    <Zap size={15} />
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: '#B45309', letterSpacing: '-0.02em', margin: '2px 0 6px' }}>
                                    {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '16px', color: '#59655D', fontWeight: '600' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#B45309', fontWeight: '700' }}>
Instant WhatsApp Dispatch
                                </div>
                            </div>

                        </div>

{/* Operational Quick Jump Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '22px' }}>
                            <button
                                onClick={() => setActiveTab('properties')}
                                style={CARD_CLICKABLE}
                            >
                                <span style={{ fontSize: '22px' }}><Tent size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={ELLIPSIS_STYLE}>Campsites & Pods</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{properties.length} Sanctuaries</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('events')}
                                style={CARD_CLICKABLE}
                            >
                                <span style={{ fontSize: '22px' }}><Calendar size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={ELLIPSIS_STYLE}>Weekend Batches</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{activeEventsCount} Active Treks</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('marshals')}
                                style={CARD_CLICKABLE}
                            >
                                <span style={{ fontSize: '22px' }}><Compass size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={ELLIPSIS_STYLE}>Hosts & Guides</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>{marshals.length} Field Crew</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('payment')}
                                style={CARD_CLICKABLE}
                            >
                                <span style={{ fontSize: '22px' }}><Zap size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={ELLIPSIS_STYLE}>Payment Gateway</div>
<div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>{paymentSettings.mode === 'coming_soon' ? ' Concierge Mode' : ' Live Razorpay'}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { setActiveTab('logs'); fetchAuditLogs(); fetchSecurityOverview(); fetchInquiries(); }}
                                style={CARD_CLICKABLE}
                            >
                                <span style={{ fontSize: '22px' }}><ScrollText size={22} /></span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={ELLIPSIS_STYLE}>Audit Trail</div>
                                    <div style={{ fontSize: '11px', color: '#59655D', marginTop: '2px' }}>Live DB Security</div>
                                </div>
                            </button>
                        </div>

                        {/* Split Row: Recent Bookings Stream + Upcoming Scheduled Batches */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                            
                            {/* Recent Live Reservations */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
Recent Reservations
                                        </h3>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '2px' }}>
                                            Latest camper submissions
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bookings')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800', borderRadius: '8px' }}>
View All ({bookings.length}) →
                                    </button>
                                </div>

                                {bookings.length === 0 ? (
                                    <div style={{ padding: '28px 16px', textAlign: 'center', color: '#7D8880', background: '#F8F9F5', borderRadius: '14px', border: '1px dashed rgba(18,22,19,0.12)' }}>
<div style={{ fontSize: '24px', marginBottom: '6px' }}><ClipboardList size={24} /></div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>No Bookings Yet</div>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '4px', marginBottom: '10px' }}>Click below to create a booking or restore sample data.</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800' }}>
                                                + Manual Booking
                                            </button>
                                            <button onClick={handleSeedSampleBookings} style={{ padding: '6px 14px', borderRadius: '10px', background: '#121613', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
Restore Sample Roster
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {bookings.slice(0, 5).map(b => (
                                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.04)', padding: '12px 14px', borderRadius: '14px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(18,22,19,0.08)', padding: '1px 6px', borderRadius: '4px' }}>{b.id}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#121613' }}>{b.name} ({b.guests} Pax)</span>
                                                    </div>
                                                    <div style={{ fontSize: '11.5px', color: '#59655D' }}>{b.package ? b.package.slice(0, 28) : 'Campsite'}... · {b.dates}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>₹{(b.total || 0).toLocaleString('en-IN')}</div>
                                                    <span style={{ fontSize: '10px', fontWeight: '800', color: b.status === 'Confirmed' ? '#166534' : '#B45309' }}>{b.status}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <a href={`/pass/${b.id}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
Pass
                                                    </a>
                                                    <a href={waLink(`Hi ${b.name}! Aanandham desk regarding your reservation (${b.id}).`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', textDecoration: 'none' }}>
WhatsApp →
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Scheduled Batches */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
Weekend Batches
                                        </h3>
                                        <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '2px' }}>
                                            Live capacity tracking
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('events')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '11.5px', fontWeight: '800', borderRadius: '8px' }}>
Manage Batches →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {events.map(ev => (
                                        <div key={ev.id} style={{ background: '#F8F9F5', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.04)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <img src={ev.image} alt={ev.title} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}  loading="lazy" decoding="async"/>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#B45309' }}>{ev.badge}</span>
                                                    <span style={{ fontSize: '10.5px', color: '#59655D' }}>{ev.dates}</span>
                                                </div>
                                                <div style={ELLIPSIS_STYLE}>{ev.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px', fontSize: '11px' }}>
                                                    <span style={{ color: '#59655D' }}>{ev.booked} / {ev.capacity} Pax</span>
                                                    <span style={{ fontWeight: '800', color: ev.spotsLeft === 0 ? '#DC2626' : '#166534' }}>
                                                        {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Remaining`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
        </div>
    );
}
