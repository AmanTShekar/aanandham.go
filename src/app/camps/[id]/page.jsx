"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import BookingEngineModal from '../../../components/BookingEngineModal';
import CustomDateBatchPicker from '../../../components/CustomDateBatchPicker';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import { INITIAL_ALL_CAMPS, getAllCamps, getCampById } from '../../../lib/campsData';
import { inr } from '../../../lib/utils';
import { waLink } from '../../../lib/whatsapp';

export default function CampPropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const campId = params?.id || 'pkg-kolukkumalai';

    const [camp, setCamp] = useState(null);
    const [allCamps, setAllCamps] = useState(INITIAL_ALL_CAMPS);
    const [activePhotoIdx, setActivePhotoIdx] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    
    // Booking Selector State
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('Aug 22 – 23, 2026');
    const [guestsCount, setGuestsCount] = useState(2);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Share Toast
    const [shareToast, setShareToast] = useState('');

    useEffect(() => {
        const campsList = getAllCamps();
        setAllCamps(campsList);
        const currentCamp = getCampById(campId);
        setCamp(currentCamp);
        if (currentCamp?.rooms && currentCamp.rooms.length > 0) {
            setSelectedRoomId(currentCamp.rooms[0].id);
        }
    }, [campId]);

    if (!camp) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B150E', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌲</div>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>Loading Basecamp Details...</div>
                </div>
            </div>
        );
    }

    const galleryPhotos = (camp.gallery && camp.gallery.length > 0) ? camp.gallery : [camp.image];
    const selectedRoom = camp.rooms ? camp.rooms.find(r => r.id === selectedRoomId) || camp.rooms[0] : null;
    const unitPrice = selectedRoom ? selectedRoom.price : camp.price;
    const computedTotal = unitPrice * guestsCount;

    // Suggestions (Other Camps)
    const suggestedCamps = allCamps.filter(c => c.id !== camp.id).slice(0, 3);

    // Handle Share
    const handleShare = async () => {
        const shareData = {
            title: `${camp.title} | Aanandham.go`,
            text: `Check out this Kerala wilderness glamping camp at ${camp.altitude}: ${camp.title}`,
            url: typeof window !== 'undefined' ? window.location.href : ''
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Ignore cancel
            }
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setShareToast('✓ Link copied to clipboard!');
            setTimeout(() => setShareToast(''), 3000);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8F9F5', color: '#121613', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <SiteHeader transparentOnTop={false} activePage="packages" />

            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px', width: '100%', maxWidth: '1440px', margin: '0 auto', paddingLeft: 'clamp(20px, 4vw, 48px)', paddingRight: 'clamp(20px, 4vw, 48px)', boxSizing: 'border-box' }}>
                
                {/* Breadcrumbs & Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#59655D', fontWeight: '600' }}>
                        <Link href="/" style={{ color: '#59655D', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link href="/#packages" style={{ color: '#59655D', textDecoration: 'none' }}>Campsites</Link>
                        <span>/</span>
                        <span style={{ color: '#121613', fontWeight: '800' }}>{camp.region}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={handleShare}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.12)',
                                padding: '8px 16px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#121613',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                            }}
                        >
                            <span>🔗 Share Camp</span>
                        </button>
                        <a
                            href={waLink(`Hi Aanandham Concierge! I'm looking at ${camp.title} (${camp.location}). Can you check slot availability for my group?`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(37, 211, 102, 0.1)',
                                border: '1px solid rgba(37, 211, 102, 0.3)',
                                padding: '8px 16px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '800',
                                color: '#166534',
                                textDecoration: 'none'
                            }}
                        >
                            <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
                            <span>Ask WhatsApp</span>
                        </a>
                    </div>
                </div>

                {/* Property Main Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <span style={{ background: '#121613', color: '#E5A93B', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px' }}>
                            {camp.tag || 'Signature Camp'}
                        </span>
                        <span style={{ background: 'rgba(18, 22, 19, 0.06)', color: '#121613', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                            📍 {camp.location}
                        </span>
                        <span style={{ background: 'rgba(18, 22, 19, 0.06)', color: '#121613', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                            🏔️ {camp.altitude}
                        </span>
                        <span style={{ background: 'rgba(18, 22, 19, 0.06)', color: '#121613', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                            ⏳ {camp.duration}
                        </span>
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', margin: '0 0 10px', color: '#121613', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        {camp.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: '#B45309' }}>
                            <span>★</span>
                            <span>{camp.rating}</span>
                            <span style={{ color: '#59655D', fontWeight: '600', marginLeft: '4px' }}>({camp.reviewsCount || 342} verified campers)</span>
                        </div>
                        <span style={{ color: '#CBD5E1' }}>•</span>
                        <span style={{ color: '#166534', fontWeight: '700' }}>✓ Instant Booking Available</span>
                        <span style={{ color: '#CBD5E1' }}>•</span>
                        <span style={{ color: '#59655D' }}>{camp.difficulty}</span>
                    </div>
                </div>

                {/* ── PHOTO GALLERY GRID (5 Photos + Lightbox Trigger) ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 210px)',
                    gap: '12px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    marginBottom: '40px',
                    position: 'relative'
                }}>
                    {/* Big Primary Cover Image */}
                    <div 
                        onClick={() => { setActivePhotoIdx(0); setIsLightboxOpen(true); }}
                        style={{
                            gridColumn: 'span 2',
                            gridRow: 'span 2',
                            position: 'relative',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                    >
                        <img 
                            src={galleryPhotos[0]} 
                            alt={camp.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>

                    {/* 4 Secondary Grid Photos */}
                    {[1, 2, 3, 4].map(idx => {
                        const photoUrl = galleryPhotos[idx] || galleryPhotos[0];
                        return (
                            <div 
                                key={idx}
                                onClick={() => { setActivePhotoIdx(idx % galleryPhotos.length); setIsLightboxOpen(true); }}
                                style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <img 
                                    src={photoUrl} 
                                    alt={`${camp.title} photo ${idx}`} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>
                        );
                    })}

                    {/* View All Photos Button */}
                    <button
                        onClick={() => { setActivePhotoIdx(0); setIsLightboxOpen(true); }}
                        style={{
                            position: 'absolute',
                            bottom: '18px',
                            right: '18px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(18, 22, 19, 0.15)',
                            padding: '10px 18px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '800',
                            color: '#121613',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                        }}
                    >
                        <span>📸 View All {galleryPhotos.length} Photos</span>
                    </button>
                </div>

                {/* ── TWO COLUMN MAIN LAYOUT (Left Content & Right Sticky Booking Card) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '48px', alignItems: 'flex-start' }}>
                    
                    {/* LEFT COLUMN: Deep Information */}
                    <div>
                        
                        {/* SECTION 1: OVERVIEW */}
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> EXPEDITION OVERVIEW
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 16px', color: '#121613' }}>
                                About This Wilderness Camp
                            </h2>
                            <p style={{ fontSize: '15.5px', color: '#3A443E', lineHeight: 1.7, margin: '0 0 24px' }}>
                                {camp.description}
                            </p>

                            {/* Highlights Checklist */}
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: '0 0 14px', color: '#121613' }}>
                                Key Experience Highlights
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                                {camp.highlights && camp.highlights.map((hl, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#F8F9F5', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(18,22,19,0.04)' }}>
                                        <span style={{ color: '#166534', fontWeight: '800', fontSize: '15px' }}>✓</span>
                                        <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#121613' }}>{hl}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 2: ACCOMMODATION PODS & ROOM TYPES */}
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> LODGING OPTIONS
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 8px', color: '#121613' }}>
                                Choose Your Room or Pod
                            </h2>
                            <p style={{ fontSize: '14px', color: '#59655D', margin: '0 0 24px' }}>
                                Select your accommodation type below to configure your reservation.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {camp.rooms && camp.rooms.map(room => {
                                    const isSelected = selectedRoomId === room.id;
                                    return (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoomId(room.id)}
                                            style={{
                                                border: isSelected ? '2px solid #121613' : '1px solid rgba(18, 22, 19, 0.1)',
                                                borderRadius: '20px',
                                                padding: '20px',
                                                background: isSelected ? '#F8F9F5' : '#FFFFFF',
                                                cursor: 'pointer',
                                                display: 'grid',
                                                gridTemplateColumns: '140px 1fr auto',
                                                gap: '20px',
                                                alignItems: 'center',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 6px 20px rgba(0,0,0,0.06)' : 'none'
                                            }}
                                        >
                                            <div style={{ height: '100px', borderRadius: '14px', overflow: 'hidden' }}>
                                                <img src={room.image || camp.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>

                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#121613', color: '#E5A93B', padding: '2px 8px', borderRadius: '999px' }}>
                                                        Capacity: {room.capacity}
                                                    </span>
                                                    {room.isAvailable && (
                                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534' }}>
                                                            ✓ Slots Available
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                                    {room.name}
                                                </h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {room.features && room.features.map((feat, fidx) => (
                                                        <span key={fidx} style={{ fontSize: '11.5px', color: '#59655D', background: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(18,22,19,0.06)' }}>
                                                            ✓ {feat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '11px', color: '#7D8880' }}>Price / Camper</div>
                                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#121613' }}>
                                                    ₹{room.price.toLocaleString('en-IN')}
                                                </div>
                                                <button
                                                    style={{
                                                        marginTop: '8px',
                                                        padding: '8px 16px',
                                                        borderRadius: '999px',
                                                        background: isSelected ? '#121613' : '#FFFFFF',
                                                        color: isSelected ? '#FFFFFF' : '#121613',
                                                        border: isSelected ? 'none' : '1px solid rgba(18,22,19,0.2)',
                                                        fontSize: '12px',
                                                        fontWeight: '800',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {isSelected ? '✓ Selected' : 'Select'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SECTION 3: 2-DAY DETAILED ITINERARY */}
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> EXPEDITION TIMELINE
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 20px', color: '#121613' }}>
                                Detailed 2-Day Schedule
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {camp.itinerary && camp.itinerary.map((dayPlan, didx) => (
                                    <div key={didx} style={{ background: '#F8F9F5', borderRadius: '18px', padding: '24px', border: '1px solid rgba(18,22,19,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                            <span style={{ background: '#121613', color: '#D5ED55', fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '8px' }}>
                                                {dayPlan.day}
                                            </span>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                                {dayPlan.title}
                                            </h3>
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {dayPlan.items.map((item, itemIdx) => (
                                                <li key={itemIdx} style={{ fontSize: '14px', color: '#3A443E', lineHeight: 1.55 }}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 4: INCLUSIONS & EXCLUSIONS */}
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 20px', color: '#121613' }}>
                                What’s Included in Your Package
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                                        ✓ What’s Included
                                    </h3>
                                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#3A443E' }}>
                                        {camp.inclusions ? camp.inclusions.map((inc, i) => (
                                            <li key={i}>{inc}</li>
                                        )) : <li>All campsite amenities and guided activities.</li>}
                                    </ul>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                                        ✕ Exclusions
                                    </h3>
                                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#3A443E' }}>
                                        {camp.exclusions ? camp.exclusions.map((exc, i) => (
                                            <li key={i}>{exc}</li>
                                        )) : <li>Personal transport and personal expenses.</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5: VERIFIED CAMPER REVIEWS */}
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> CAMPER TESTIMONIALS
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        Camper Stories & Reviews
                                    </h2>
                                    <div style={{ fontSize: '14px', color: '#59655D', marginTop: '4px' }}>
                                        4.98 out of 5 stars based on {camp.reviewsCount || 342} verified explorers
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {camp.reviews && camp.reviews.map(rv => (
                                    <div key={rv.id} style={{ background: '#F8F9F5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(18,22,19,0.04)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#121613', color: '#E5A93B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                                                    {rv.name[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#121613' }}>{rv.name}</div>
                                                    <div style={{ fontSize: '11.5px', color: '#7D8880' }}>{rv.location} · {rv.date}</div>
                                                </div>
                                            </div>
                                            <div style={{ color: '#E5A93B', fontSize: '13px' }}>
                                                {'★'.repeat(rv.rating || 5)}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#3A443E', lineHeight: 1.6, margin: 0 }}>
                                            "{rv.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sticky Reservation Box */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '30px',
                            border: '1px solid rgba(18, 22, 19, 0.1)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(18,22,19,0.08)' }}>
                                <div>
                                    <span style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                                        Price Starts At
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#121613' }}>
                                            ₹{unitPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#59655D' }}>/ camper</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#94A3B8' }}>₹{camp.originalPrice || unitPrice + 800}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', display: 'block' }}>Save 25%</span>
                                </div>
                            </div>

                            {/* Custom Interactive Dropdowns (Zero Typing!) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                                <CustomSelectDropdown
                                    label="Select Room or Pod Type"
                                    value={selectedRoomId || (camp.rooms?.[0]?.id || '')}
                                    onChange={val => setSelectedRoomId(val)}
                                    options={(camp.rooms || []).map(r => ({
                                        value: r.id,
                                        label: r.name,
                                        sublabel: `Capacity: ${r.capacity}`,
                                        price: r.price,
                                        badge: r.isAvailable ? 'Available' : 'Sold Out'
                                    }))}
                                />

                                <CustomDateBatchPicker
                                    label="Select Expedition Weekend or Date"
                                    selectedDate={selectedDate}
                                    onDateChange={newDate => setSelectedDate(newDate)}
                                />

                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        Number of Campers
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.12)', borderRadius: '14px', padding: '8px 14px' }}>
                                        <button type="button" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                        <span style={{ fontSize: '14.5px', fontWeight: '800', color: '#121613' }}>{guestsCount} Campers (₹{unitPrice}/pax)</span>
                                        <button type="button" onClick={() => setGuestsCount(guestsCount + 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Total Calculation */}
                            <div style={{ background: '#F8F9F5', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '700' }}>Estimated Total</div>
                                    <div style={{ fontSize: '12px', color: '#59655D' }}>{guestsCount} × ₹{unitPrice}</div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#121613' }}>
                                    ₹{computedTotal.toLocaleString('en-IN')}
                                </div>
                            </div>

                            {/* Primary Action Button */}
                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                className="btn-lime"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    marginBottom: '12px',
                                    boxShadow: '0 6px 20px rgba(213, 237, 85, 0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>Reserve Campsite Now</span>
                                <span>↗</span>
                            </button>

                            <a
                                href={waLink(`Hi Aanandham! I'd like to book ${camp.title} for ${guestsCount} campers around ${selectedDate}.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'rgba(18, 22, 19, 0.04)',
                                    border: '1px solid rgba(18, 22, 19, 0.1)',
                                    color: '#121613',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i>
                                <span>Book via WhatsApp Concierge</span>
                            </a>

                            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11.5px', color: '#7D8880' }}>
                                🔒 Zero booking fees · Pay on confirmation
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── SECTION: OTHER WILDERNESS BASECAMPS YOU MAY LIKE ── */}
                <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid rgba(18, 22, 19, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
                        <div>
                            <div className="star-badge" style={{ marginBottom: '6px' }}>
                                <span className="star-icon">★</span> EXPLORE MORE OF KERALA
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Other Wilderness Basecamps You May Like
                            </h2>
                        </div>
                        <Link href="/#packages" className="btn-lime" style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '800', textDecoration: 'none' }}>
                            View All Kerala Camps →
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {suggestedCamps.map(sCamp => (
                            <Link
                                key={sCamp.id}
                                href={`/camps/${sCamp.id}`}
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.08)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    color: '#121613',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.03)'; }}
                            >
                                <div style={{ position: 'relative', height: '180px' }}>
                                    <img src={sCamp.image} alt={sCamp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#121613', color: '#E5A93B', fontSize: '10.5px', fontWeight: '800', padding: '3px 10px', borderRadius: '999px' }}>
                                        {sCamp.region}
                                    </span>
                                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                        {sCamp.altitude}
                                    </span>
                                </div>

                                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: '0 0 8px', color: '#121613', lineHeight: 1.35 }}>
                                        {sCamp.title}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.5, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {sCamp.description}
                                    </p>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(18,22,19,0.06)' }}>
                                        <div>
                                            <div style={{ fontSize: '10.5px', color: '#7D8880' }}>Starts From</div>
                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>₹{sCamp.price}</div>
                                        </div>
                                        <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#121613' }}>
                                            Explore Camp →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            {/* ── INTERACTIVE PHOTO LIGHTBOX MODAL ── */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(11, 21, 14, 0.96)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', padding: '24px', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>{camp.title}</h3>
                                <div style={{ fontSize: '12px', color: '#A2B6A6' }}>Photo {activePhotoIdx + 1} of {galleryPhotos.length}</div>
                            </div>
                            <button onClick={() => setIsLightboxOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', width: '38px', height: '38px', borderRadius: '50%', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}>
                                ✕
                            </button>
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <button onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + galleryPhotos.length) % galleryPhotos.length)} style={{ position: 'absolute', left: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFFFFF', width: '48px', height: '48px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>
                                ‹
                            </button>
                            <img src={galleryPhotos[activePhotoIdx]} alt="Camp Full View" style={{ maxWidth: '90%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '16px' }} />
                            <button onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % galleryPhotos.length)} style={{ position: 'absolute', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFFFFF', width: '48px', height: '48px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>
                                ›
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', justifyContent: 'center', paddingTop: '16px' }}>
                            {galleryPhotos.map((photo, pIdx) => (
                                <div 
                                    key={pIdx} 
                                    onClick={() => setActivePhotoIdx(pIdx)}
                                    style={{ width: '64px', height: '48px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: activePhotoIdx === pIdx ? '2px solid #D5ED55' : '1px solid rgba(255,255,255,0.2)', opacity: activePhotoIdx === pIdx ? 1 : 0.6 }}
                                >
                                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── BOOKING ENGINE MODAL INTEGRATION ── */}
            <BookingEngineModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                preselectedPackageId={camp.id}
            />

            {/* Share Toast */}
            <AnimatePresence>
                {shareToast && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#121613', color: '#FFFFFF', padding: '12px 24px', borderRadius: '999px', fontWeight: '700', fontSize: '13.5px', zIndex: 100000, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                        {shareToast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <Footer />

        </div>
    );
}
