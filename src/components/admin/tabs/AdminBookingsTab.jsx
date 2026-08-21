"use client";
import React from 'react';
import { 
    ClipboardList, Search, RefreshCw, Plus, Download, ChevronLeft, ChevronRight, 
    Check, X, Phone, MessageCircle, AlertCircle, Calendar, Users, Mountain, ShieldCheck,
    Tent, Sunrise, Trees, Sprout, Home
} from 'lucide-react';
import { inr } from '../../../lib/utils';
import { waLink } from '../../../lib/whatsapp';
import CustomSelectDropdown from '../../CustomSelectDropdown';
import { 
    META_LABEL_STYLE, ELLIPSIS_STYLE, MUTED_TEXT_11, ROW_SPACE_8, 
    ROW_SPACE_10, H2_STYLE, FIELD_LABEL_5, CARD_CLICKABLE, MICRO_LABEL, 
    ROW_SPACE_WRAP, ROW_SPACE_14, FORM_INPUT_STYLE, FORM_INPUT_SMALL_STYLE 
} from '../AdminSharedStyles';

export default function AdminBookingsTab({
    bookings = [],
    filteredBookings = [],
    bookingSearch,
    setBookingSearch,
    bookingFilterStatus,
    setBookingFilterStatus,
    bookingFilterCamp,
    setBookingFilterCamp,
    bookingSortBy,
    setBookingSortBy,
    properties,
    isLoadingBookings,
    fetchBookings,
    setIsAddBookingModalOpen,
    handleStatusUpdate,
    handleDeleteBooking,
    handleExportBookingsCSV,
    isOnlineMode
}) {
    const koluBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('kolukkumalai')).length;
    const meesaBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('meesapulimala')).length;
    const suryaBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('suryanelli')).length;
    const mexicoBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('mexico')).length;
    const wildlinkBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('wildlink') || (b.campsiteId || b.package || '').toLowerCase().includes('pazhathottam')).length;
    const vagaBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('vagamon')).length;
    const wayaBookingsCount = bookings.filter(b => (b.campsiteId || b.package || '').toLowerCase().includes('wayanad')).length;

    return (
        <div>
                    <div style={{ width: '100%' }}>
                        
                        {/* 1. CAMPSITE DIVIDER BAR */}
                        <div style={{ marginBottom: '22px' }}>
                            <div style={ROW_SPACE_10}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
Filter By Sanctuary Location
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>
● {filteredBookings.length} of {bookings.length} Bookings Shown
                                </span>
                            </div>
                            
                            <div className="admin-region-chip-row" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '6px' }}>
                                {[
                                    { id: 'All', label: 'All Sanctuaries', icon: Tent, count: bookings.length },
                                    { id: 'pkg-kolukkumalai', label: 'Kolukkumalai (7,900 FT)', icon: Sunrise, count: koluBookingsCount },
                                    { id: 'pkg-meesapulimala', label: 'Meesapulimala Ridge', icon: Mountain, count: meesaBookingsCount },
                                    { id: 'pkg-suryanelli', label: 'Suryanelli Valley', icon: Tent, count: suryaBookingsCount },
                                    { id: 'pkg-mini-mexico', label: 'Mini Mexico (6,200 FT)', icon: Home, count: mexicoBookingsCount },
                                    { id: 'pkg-wildlink', label: 'Camp Wildlink (7,000 FT)', icon: Trees, count: wildlinkBookingsCount },
                                    { id: 'pkg-vagamon-pine', label: 'Vagamon Pine Forest', icon: Trees, count: vagaBookingsCount },
                                    { id: 'pkg-wayanad', label: 'Wayanad 900 Kandi', icon: Sprout, count: wayaBookingsCount }
                                ].map(c => {
                                    const isSelected = bookingFilterCamp === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setBookingFilterCamp(c.id)}
                                            style={{
                                                padding: '9px 16px',
                                                borderRadius: '14px',
                                                border: isSelected ? '1.5px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                background: isSelected ? '#121613' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#3A443E',
                                                fontSize: '12.5px',
                                                fontWeight: isSelected ? '800' : '700',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                whiteSpace: 'nowrap',
                                                boxShadow: isSelected ? '0 4px 12px rgba(18, 22, 19, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <c.icon size={14} />
                                            <span>{c.label}</span>
                                            <span style={{
                                                background: isSelected ? '#D5ED55' : 'rgba(18, 22, 19, 0.08)',
                                                color: isSelected ? '#0B150E' : '#59655D',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                padding: '1px 7px',
                                                borderRadius: '999px'
                                            }}>
                                                {c.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. SEARCH, STATUS FILTER & SORT CONTROLS */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '22px' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#7D8880' }}><Search size={14} /></span>
                                <input
                                    type="text"
                                    placeholder="Search by camper name, phone, payment ref or booking ID..."
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 16px 11px 38px',
                                        borderRadius: '14px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                        color: '#121613',
                                        fontSize: '13.5px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

{/* Status Filter Dropdown */}
                            <select
                                value={bookingFilterStatus}
                                onChange={(e) => setBookingFilterStatus(e.target.value)}
                                style={{
                                    padding: '9px 12px',
                                    borderRadius: '12px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '12.5px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="All">All Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked In">Checked In</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Sort Selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11.5px', color: '#59655D', fontWeight: '700' }}>Sort:</span>
                                <select
                                    value={bookingSortBy}
                                    onChange={(e) => setBookingSortBy(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                        color: '#121613',
                                        fontSize: '12.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
<option value="newest">Newest First</option>
<option value="highest_amount">Highest Total (₹)</option>
<option value="guests_desc">Most Campers</option>
<option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <button
                                onClick={handleExportCSV}
                                title="Export current roster to CSV"
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '12px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    color: '#121613',
                                    fontSize: '12.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <span><Download size={14} /> CSV</span>
                            </button>

                            <button
                                onClick={() => setIsAddBookingModalOpen(true)}
                                className="btn-lime"
                                style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800', borderRadius: '12px' }}
                            >
                                + New Booking
                            </button>
</div>

                        {/* 4. BOOKINGS CARDS LIST */}
                        {filteredBookings.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18,22,19,0.08)' }}>
<div style={{ fontSize: '40px', marginBottom: '10px' }}><ClipboardList size={40} /></div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>No Reservations Found</div>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '4px', maxWidth: '440px', margin: '4px auto 18px' }}>
                                    No records match your selected campsite or search filter. You can add a manual booking or restore sample demonstration bookings.
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                        + Add Manual Booking
                                    </button>
                                    <button onClick={handleSeedSampleBookings} style={{ padding: '9px 18px', borderRadius: '12px', background: '#121613', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
Restore Sample Bookings Roster
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {filteredBookings.map(b => {
                                    const formattedCreated = b.createdAt 
                                        ? (isNaN(new Date(b.createdAt).getTime()) ? b.createdAt : new Date(b.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }))
                                        : 'Recent';

                                    return (
                                    <div
                                        key={b.id}
                                        style={{
                                            background: '#FFFFFF',
                                            border: b.status === 'Pending' ? '1.5px solid #F59E0B' : '1px solid rgba(18, 22, 19, 0.08)',
                                            borderRadius: '20px',
                                            padding: '20px 24px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {/* TOP ROW: ID, Squad Category, Date/Time, and Status Pill */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(18,22,19,0.06)', paddingBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#121613', background: '#F8F9F5', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(18,22,19,0.1)' }}>
                                                    {b.id}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '3px 10px',
                                                    borderRadius: '6px',
                                                    background: b.groupType === 'Family' ? '#FEF3C7' : b.groupType === 'Couple' ? '#FCE7F3' : b.groupType === 'Corporate' ? '#EDE9FE' : b.groupType === 'Solo' ? '#E0F2FE' : '#DCFCE7',
                                                    color: b.groupType === 'Family' ? '#92400E' : b.groupType === 'Couple' ? '#9D174D' : b.groupType === 'Corporate' ? '#5B21B6' : b.groupType === 'Solo' ? '#0369A1' : '#166534'
                                                }}>
{b.groupType === 'Family' ? ' Family' : b.groupType === 'Couple' ? ' Couple' : b.groupType === 'Corporate' ? ' Corporate' : b.groupType === 'Solo' ? ' Solo' : ' Friends Squad'}
                                                </span>
                                                <span style={{ fontSize: '11.5px', color: '#7D8880', fontWeight: '600' }}>
{formattedCreated}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    background: b.status === 'Confirmed' ? '#DCFCE7' : b.status === 'Checked In' ? '#DBEAFE' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                                                    color: b.status === 'Confirmed' ? '#166534' : b.status === 'Checked In' ? '#1E40AF' : b.status === 'Cancelled' ? '#991B1B' : '#92400E',
                                                    border: '1px solid rgba(0,0,0,0.06)'
                                                }}>
{b.status === 'Confirmed' ? ' Confirmed' : b.status === 'Checked In' ? ' Checked In' : b.status === 'Cancelled' ? ' Cancelled' : ' Pending Verification'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* MIDDLE SECTION: 3 Balanced Information Columns */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', alignItems: 'flex-start' }}>
                                            {/* Col 1: Camper Contact */}
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: '#121613', marginBottom: '2px' }}>
                                                    {b.name}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#59655D', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                                    <span><Phone size={14} /> {b.phone}</span>
{b.email && b.email !== 'N/A' && <span style={{ color: '#7D8880' }}>·  {b.email}</span>}
                                                </div>
{b.utrNumber && (
                                                    <div style={{ marginTop: '8px', fontSize: '11.5px', fontWeight: '800', color: '#166534', background: 'rgba(22, 101, 52, 0.08)', border: '1px solid rgba(22,101,52,0.15)', padding: '4px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                        <span><KeyRound size={14} /> Payment Ref:</span>
                                                        <span>{b.utrNumber}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Col 2: Trip & Allocation */}
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>
{b.package}
                                                </div>
                                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
{b.dates} · <strong style={{ color: '#121613' }}>{b.guests} Guests</strong>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                                    <span style={{ fontSize: '11.5px', fontWeight: '800', background: '#F1F5F9', color: '#0F172A', border: '1px solid rgba(15, 23, 42, 0.12)', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <span><Tent size={14} /> Unit:</span>
                                                        <span style={{ color: '#166534' }}>{b.allocatedUnit || 'Tent #01'}</span>
                                                    </span>
                                                    {b.roomType && <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>· {b.roomType}</span>}
                                                </div>
                                                {b.mealSummary && (
                                                    <div style={{ fontSize: '11.5px', color: '#59655D', marginTop: '4px', fontWeight: '600' }}>
 Meals: {b.mealSummary}
                                                    </div>
                                                )}
                                                {b.notes && (
                                                    <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#59655D', fontStyle: 'italic', background: '#F8F9F5', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(18,22,19,0.04)' }}>
"{b.notes}"
                                                    </div>
                                                )}
                                            </div>

                                            {/* Col 3: Pricing & Financials */}
                                            <div style={{ background: '#F8F9F5', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                                <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    Total Fare
                                                </div>
                                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#121613', marginTop: '2px' }}>
                                                    ₹{(b.total || 0).toLocaleString('en-IN')}
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: b.balanceDue === 0 ? '#166534' : '#B45309', fontWeight: '700', marginTop: '2px' }}>
                                                    {b.paidAmount != null ? `Paid: ₹${b.paidAmount.toLocaleString('en-IN')} · Due: ₹${(b.balanceDue || 0).toLocaleString('en-IN')}` : `Source: ${b.source || 'Direct'}`}
                                                </div>
                                            </div>
                                        </div>

                                        {/* BOTTOM ACTION TRAY: Cleanly aligned toolbar utilizing space */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: '#F8F9F5', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                            {/* Left: Quick Status Dropdown */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase' }}>Update:</span>
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        color: '#121613',
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
<option value="Pending"> Mark Pending</option>
<option value="Confirmed"> Mark Confirmed</option>
<option value="Checked In"> Mark Checked In</option>
<option value="Cancelled"> Mark Cancelled</option>
                                                </select>
                                                {b.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                                        className="btn-lime"
                                                        style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: '900', borderRadius: '8px', cursor: 'pointer' }}
                                                    >
Confirm Now
                                                    </button>
                                                )}
                                            </div>

                                            {/* Right: Action Buttons Group */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <a
                                                    href={`/pass/${b.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: '7px 12px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18,22,19,0.12)',
                                                        color: '#121613',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                                    }}
                                                >
                                                    <span><Ticket size={14} /> Pass</span>
                                                </a>

                                                <a
                                                    href={waLink(`Hi ${b.name}! Aanandham coordinator desk confirming your booking (${b.id}) for ${b.package} on ${b.dates}.`, b.phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: '7px 14px',
                                                        borderRadius: '8px',
                                                        background: '#25D366',
                                                        color: '#FFFFFF',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)'
                                                    }}
                                                >
                                                    <span><MessageCircle size={14} /> WhatsApp</span>
                                                </a>

                                                <a
                                                    href={`tel:${(b.phone || '').replace(/\s+/g, '')}`}
                                                    style={{
                                                        padding: '7px 10px',
                                                        borderRadius: '8px',
                                                        background: '#FFFFFF',
                                                        border: '1px solid rgba(18,22,19,0.12)',
                                                        color: '#121613',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Call camper directly"
                                                >
                                                    <span><Phone size={14} /> Call</span>
                                                </a>

                                                <button
                                                    onClick={() => handleDeleteBooking(b.id)}
                                                    title="Delete reservation"
                                                    style={{
                                                        padding: '7px 10px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(239,68,68,0.08)',
                                                        border: '1px solid rgba(239,68,68,0.18)',
                                                        color: '#DC2626',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
<span><Trash2 size={14} /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
        </div>
    );
}
