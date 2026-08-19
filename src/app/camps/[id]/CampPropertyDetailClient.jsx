"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import dynamic from 'next/dynamic';
const BookingEngineModal = dynamic(() => import('../../../components/BookingEngineModal'), { ssr: false });
import CustomDateBatchPicker from '../../../components/CustomDateBatchPicker';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import LucideAmenityIcon from '../../../components/common/LucideAmenityIcon';
import { Check, X, Sparkles, MapPin, Mountain, Clock, Compass, Share2, Heart, Tent, Users, ShieldCheck } from 'lucide-react';
import { INITIAL_ALL_CAMPS, getAllCamps, getCampById } from '../../../lib/campsData';
import { inr, getDefaultUpcomingBatch } from '../../../lib/utils';
import { waLink } from '../../../lib/whatsapp';
import { CANCELLATION_TIERS } from '../../../lib/cancellation';
import { loadDiscountsFromStorage, applyDiscounts } from '../../../lib/discountsCore';

export function parseRoomCapacity(capacityStr) {
    if (!capacityStr) return 2;
    const match = String(capacityStr).match(/\d+/);
    return match ? Math.max(1, parseInt(match[0], 10)) : 2;
}

export default function CampPropertyDetailClient({ campId, initialCamp, initialAllCamps = INITIAL_ALL_CAMPS }) {
    const [camp, setCamp] = useState(initialCamp || null);
    const [allCamps, setAllCamps] = useState(initialAllCamps);
    const [isLoaded, setIsLoaded] = useState(true);
    const [activePhotoIdx, setActivePhotoIdx] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    
    // Booking Selector State with Dynamic Date
    const [selectedRoomId, setSelectedRoomId] = useState(initialCamp?.rooms?.[0]?.id || null);
    const [selectedDate, setSelectedDate] = useState(() => getDefaultUpcomingBatch());
    const [guestsCount, setGuestsCount] = useState(2);
    const [customUnits, setCustomUnits] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [discounts, setDiscounts] = useState(null);

    // Load active discount campaigns (server authoritative, localStorage fallback)
    useEffect(() => {
        setDiscounts(loadDiscountsFromStorage());
        fetch('/api/discounts', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data && Array.isArray(data.discounts)) setDiscounts(data.discounts);
            })
            .catch(() => { /* keep localStorage fallback */ });
    }, []);

    // Wishlist & Share Toast
    const [wishlist, setWishlist] = useState([]);
    const [shareToast, setShareToast] = useState('');
    const toastTimerRef = React.useRef(null);

    useEffect(() => {
        const refreshCampData = async () => {
            const campsList = getAllCamps();
            setAllCamps(campsList);
            let currentCamp = getCampById(campId) || initialCamp;
            setCamp(currentCamp);
            if (currentCamp?.rooms && currentCamp.rooms.length > 0) {
                setSelectedRoomId(prev => prev || currentCamp.rooms[0].id);
            }

            try {
                const res = await fetch('/api/admin/camps');
                if (res.ok) {
                    const serverCamps = await res.json();
                    if (Array.isArray(serverCamps) && serverCamps.length > 0) {
                        setAllCamps(serverCamps);
                        const matched = serverCamps.find(c => c.id === campId);
                        if (matched) {
                            setCamp(matched);
                            if (matched.rooms && matched.rooms.length > 0) {
                                setSelectedRoomId(prev => prev || matched.rooms[0].id);
                            }
                        }
                    }
                }
            } catch (e) {}
        };

        refreshCampData();

        try {
            const savedWishlist = JSON.parse(localStorage.getItem('aanandham_user_wishlist') || '[]');
            setWishlist(savedWishlist);
        } catch (e) {}
        setIsLoaded(true);

        const handleStorage = () => {
            refreshCampData();
        };
        window.addEventListener('storage', handleStorage);

        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            window.removeEventListener('storage', handleStorage);
        };
    }, [campId, initialCamp]);

    const handleToggleWishlist = () => {
        if (!camp) return;
        let updated;
        const isLiked = wishlist.includes(camp.id);
        if (isLiked) {
            updated = wishlist.filter(id => id !== camp.id);
            setShareToast(`Removed "${camp.title}" from your wishlist`);
        } else {
            updated = [...wishlist, camp.id];
            setShareToast(`❤️ Added "${camp.title}" to your saved wishlist!`);
        }
        setWishlist(updated);
        try {
            localStorage.setItem('aanandham_user_wishlist', JSON.stringify(updated));
        } catch (e) {}
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setShareToast(''), 3000);
    };

    // 404 SANCTUARY NOT FOUND SCREEN
    if (isLoaded && !camp) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B150E', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                <SiteHeader />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '520px', width: '100%', background: '#121E15', padding: '44px 28px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '54px', marginBottom: '16px' }}>🧭</div>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(213,237,85,0.15)', color: '#D5ED55', padding: '5px 14px', borderRadius: '999px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            404 · Basecamp Not Found
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', margin: '18px 0 12px', color: '#FFFFFF' }}>
                            Wilderness Sanctuary Not Found
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.6, marginBottom: '28px' }}>
                            The high-altitude campsite or expedition route you requested does not exist or has been relocated by forest marshals.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/camps" className="btn-lime" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '800', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span>Explore Verified Sanctuaries</span>
                                <span>→</span>
                            </Link>
                            <Link href="/" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '800', color: '#FFFFFF', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', textDecoration: 'none' }}>
                                Return Home
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!camp) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B150E', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌲</div>
                    <p style={{ color: '#D5ED55', fontWeight: '700' }}>Loading Basecamp Sanctuary...</p>
                </div>
            </div>
        );
    }

    const isLiked = wishlist.includes(camp.id);
    const gallery = camp.gallery && camp.gallery.length > 0 ? camp.gallery : [camp.image];
    const availableRooms = camp.rooms && camp.rooms.length > 0 ? camp.rooms : [
        {
            id: 'room-std',
            name: 'Standard Alpine Ridge Tent',
            type: 'tent',
            capacity: '2 Adults',
            pricePerPerson: camp.price,
            features: ['Double Layer Waterproof', 'Sleeping Bag Included', 'Ground Mat'],
            availableUnits: 10
        }
    ];

    const currentRoom = availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0];
    const roomPrice = currentRoom?.price || currentRoom?.pricePerPerson || camp.price || 2499;
    const capacityNum = parseRoomCapacity(currentRoom?.capacity);
    const calculatedUnits = Math.ceil(guestsCount / capacityNum);
    const effectiveUnits = customUnits !== null ? customUnits : calculatedUnits;
    const totalCapacity = effectiveUnits * capacityNum;
    const discount = applyDiscounts({ baseTotal: guestsCount * roomPrice, guests: guestsCount, campsiteId: camp?.id, discounts });
    const estimatedTotal = discount.discountedTotal;
    const discountLabel = discount.discountLabel;
    const discountAmount = discount.discountAmount;

    const nearbyCamps = allCamps.filter(c => c.id !== camp.id).slice(0, 3);

    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareData = {
            title: `${camp.title} | Aanandham.go Wilderness Camps`,
            text: `Check out this verified campsite at ${camp.altitude} in ${camp.location}!`,
            url: shareUrl
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {}
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareToast('✓ Campsite link copied to clipboard!');
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            toastTimerRef.current = setTimeout(() => setShareToast(''), 3000);
        } catch (err) {
            window.open(waLink(`Check out this Kerala campsite: ${camp.title} - ${shareUrl}`), '_blank');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8F9F5', color: '#121613' }}>
            
            {/* ── HEADER ── */}
            <SiteHeader transparentOnTop={false} activePage="camps" />

            <main style={{ paddingBottom: '120px' }}>
                
                {/* ── BREADCRUMB & TITLE BAR ── */}
                <section style={{ background: '#101E13', color: '#FFFFFF', padding: 'clamp(105px, 11vw, 130px) clamp(20px, 4vw, 48px) clamp(34px, 4vw, 46px)' }}>
                    <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                        {/* Breadcrumbs */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#C5D8C8', marginBottom: '16px', flexWrap: 'wrap', fontWeight: '600' }}>
                            <Link href="/" style={{ color: '#C5D8C8', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
                            <span style={{ color: '#6A7D6E' }}>/</span>
                            <Link href="/camps" style={{ color: '#C5D8C8', textDecoration: 'none', transition: 'color 0.2s' }}>Campsites</Link>
                            <span style={{ color: '#6A7D6E' }}>/</span>
                            <span style={{ color: '#D5ED55', fontWeight: '800' }}>{camp.title}</span>
                        </div>

                        {/* Title & Actions Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{ background: '#E5A93B', color: '#0B150E', fontSize: '12px', fontWeight: '900', padding: '5px 14px', borderRadius: '999px', letterSpacing: '0.3px', boxShadow: '0 2px 8px rgba(229,169,59,0.3)' }}>
                                        {camp.altitude || 'Western Ghats'}
                                    </span>
                                    <span style={{ background: 'rgba(213, 237, 85, 0.2)', color: '#D5ED55', fontSize: '12px', fontWeight: '800', padding: '5px 14px', borderRadius: '999px', border: '1px solid rgba(213, 237, 85, 0.4)' }}>
                                        ★ {camp.rating || '4.98'} ({camp.reviewsCount || 342} verified campers)
                                    </span>
                                    {camp.tag && (
                                        <span style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '800', padding: '5px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)' }}>
                                            {camp.tag}
                                        </span>
                                    )}
                                </div>

                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: '800', margin: '0 0 12px', color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                                    {camp.title}
                                </h1>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: '#C5D8C8', flexWrap: 'wrap', fontWeight: '600' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={16} color="#D5ED55" />
                                        <span>{camp.location || 'Suryanelli, Munnar'}</span>
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={16} color="#D5ED55" />
                                        <span>{camp.duration || '2 Days / 1 Night'}</span>
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <Compass size={16} color="#D5ED55" />
                                        <span>{camp.difficulty || 'Easy - Moderate Expedition'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Like & Share Action Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleToggleWishlist}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 18px',
                                        borderRadius: '999px',
                                        background: isLiked ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
                                        border: isLiked ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#FFFFFF',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Heart size={16} fill={isLiked ? '#FFFFFF' : 'none'} color="#FFFFFF" strokeWidth={2.5} />
                                    <span>{isLiked ? 'Saved' : 'Save'}</span>
                                </button>

                                <button
                                    onClick={handleShare}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 18px',
                                        borderRadius: '999px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#FFFFFF',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Share2 size={16} color="#FFFFFF" strokeWidth={2.5} />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── PHOTO GALLERY MOSAIC SECTION (RESPONSIVE) ── */}
                <section style={{ maxWidth: '1440px', margin: '32px auto 0', padding: '0 clamp(20px, 4vw, 48px)' }}>
                    <div className="camp-gallery-mosaic">
                        {/* Main Featured Photo (Left Large) */}
                        <div
                            onClick={() => { setActivePhotoIdx(0); setIsLightboxOpen(true); }}
                            className="gallery-tile-main card-img-zoom"
                        >
                            <img
                                src={gallery[0]}
                                alt={`${camp.title} Main View`}
                                width="800"
                                height="500"
                                decoding="async"
                                fetchPriority="high"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', padding: '6px 14px', borderRadius: '999px', color: '#FFFFFF', fontSize: '12px', fontWeight: '800' }}>
                                📸 View Gallery ({gallery.length} photos)
                            </div>
                        </div>

                        {/* Sub Photo 1 (Top Right) */}
                        <div
                            onClick={() => { setActivePhotoIdx(1 % gallery.length); setIsLightboxOpen(true); }}
                            className="gallery-tile-top card-img-zoom"
                        >
                            <img
                                src={gallery[1] || gallery[0]}
                                alt={`${camp.title} Ridge Tent`}
                                width="400"
                                height="250"
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Sub Photo 2 (Bottom Right 1) */}
                        <div
                            onClick={() => { setActivePhotoIdx(2 % gallery.length); setIsLightboxOpen(true); }}
                            className="gallery-tile-bot-1 card-img-zoom"
                        >
                            <img
                                src={gallery[2] || gallery[0]}
                                alt={`${camp.title} Campfire Area`}
                                width="400"
                                height="250"
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Sub Photo 3 (Bottom Right 2 with View All overlay) */}
                        <div
                            onClick={() => { setActivePhotoIdx(3 % gallery.length); setIsLightboxOpen(true); }}
                            className="gallery-tile-bot-2 card-img-zoom"
                        >
                            <img
                                src={gallery[3] || gallery[0]}
                                alt={`${camp.title} Valley Sunset`}
                                width="400"
                                height="250"
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                            />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D5ED55', fontWeight: '800', fontSize: '13px', textAlign: 'center', padding: '10px' }}>
                                +{Math.max(1, gallery.length - 3)} More
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── TWO-COLUMN EXPEDITION DETAILS & SMART STAY BOOKING ENGINE ── */}
                <section style={{ maxWidth: '1560px', margin: '48px auto 0', padding: '0 clamp(20px, 4vw, 48px)' }}>
                    <div className="camp-detail-layout">
                        
                        {/* ── LEFT COLUMN: CAMPSITE CONTENT & SPECS ── */}
                        <div>
                            
                            {/* SECTION 1: HIGHLIGHTS & DESCRIPTION */}
                            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div className="star-badge" style={{ marginBottom: '8px' }}>
                                    <span className="star-icon">★</span> EXPEDITION OVERVIEW
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 16px', color: '#121613' }}>
                                    About This Wilderness Basecamp
                                </h2>
                                <p style={{ fontSize: '15px', color: '#3A443E', lineHeight: 1.75, margin: '0 0 24px' }}>
                                    {camp.description || 'Perched at high altitude across the pristine Western Ghats, this campsite offers direct sunrise panoramic views, cloud-bed valleys, and secluded timber platforms for a tranquil mountain getaway.'}
                                </p>

                                {/* Highlights Chips (Lucide Icons) */}
                                {camp.highlights && camp.highlights.length > 0 && (
                                    <div>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 12px' }}>
                                            Key Highlights & Experiences
                                        </h3>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {camp.highlights.map((hl, hidx) => (
                                                <div key={hidx} style={{ background: '#F1F3EC', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#121613', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                                                    <LucideAmenityIcon name={hl} size={14} color="#166534" />
                                                    <span>{hl}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 2: LODGING ROOM TYPES & TENT SELECTION */}
                            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div className="star-badge" style={{ marginBottom: '8px' }}>
                                    <span className="star-icon">★</span> LODGING INVENTORY
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 8px', color: '#121613' }}>
                                    Available Lodging & Room Types
                                </h2>
                                <p style={{ fontSize: '14px', color: '#59655D', margin: '0 0 20px' }}>
                                    Select your preferred tent style or cabin pod. Pricing is calculated per camper with dedicated unit allocation.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {availableRooms.map((room) => {
                                        const isSelected = selectedRoomId === room.id;
                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => { setSelectedRoomId(room.id); setCustomUnits(null); }}
                                                style={{
                                                    borderRadius: '18px',
                                                    border: isSelected ? '2px solid #166534' : '1px solid rgba(18, 22, 19, 0.1)',
                                                    background: isSelected ? '#F4F8F4' : '#FFFFFF',
                                                    padding: '20px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                <div style={{ flex: 1, minWidth: '220px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <span style={{ background: '#121613', color: '#D5ED55', fontSize: '10.5px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                                                            {room.type?.toUpperCase() || 'TENT'}
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#59655D', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <Users size={13} color="#166534" />
                                                            <span>Capacity: {room.capacity || '2 Persons'}</span>
                                                        </span>
                                                    </div>
                                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: '0 0 6px', color: '#121613' }}>
                                                        {room.name}
                                                    </h3>
                                                    {room.features && room.features.length > 0 && (
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {room.features.map((feat, fidx) => (
                                                                <span key={fidx} style={{ fontSize: '11px', color: '#59655D', background: '#F8F9F5', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    <LucideAmenityIcon name={feat} size={11} color="#166534" />
                                                                    <span>{feat}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '10px', color: '#7D8880', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Per Person</span>
                                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '900', color: '#121613' }}>
                                                            ₹{(room.price || room.pricePerPerson || camp.price || 2499).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            padding: '6px 14px',
                                                            borderRadius: '8px',
                                                            background: isSelected ? '#166534' : '#F1F3EC',
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

                            {/* SECTION 3: INCLUDED AMENITIES & FACILITIES (CRISP LUCIDE ICONS) */}
                            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div className="star-badge" style={{ marginBottom: '8px' }}>
                                    <span className="star-icon">★</span> BASECAMP PERKS
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 8px', color: '#121613' }}>
                                    Included Amenities & Basecamp Facilities
                                </h2>
                                <p style={{ fontSize: '14px', color: '#59655D', margin: '0 0 22px' }}>
                                    Every Aanandham basecamp is verified for wilderness safety, hygienic washrooms, and curated culinary experiences.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                                    {(camp.amenities && camp.amenities.length > 0 ? camp.amenities : [
                                        { name: 'Campfire Circle & Acoustic Jams', icon: '🔥' },
                                        { name: '4x4 Offroad Trail Access', icon: '🚙' },
                                        { name: 'Western Washrooms & Hot Water', icon: '🚿' },
                                        { name: 'Power Backup & Charging Points', icon: '⚡' },
                                        { name: 'Wilderness Guides & First Aid', icon: '🩺' },
                                        { name: 'Kerala Spiced Buffet Dining', icon: '🍽️' }
                                    ]).map((amenity, aIdx) => (
                                        <div
                                            key={aIdx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                background: '#F8F9F5',
                                                padding: '14px 16px',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(18, 22, 19, 0.06)'
                                            }}
                                        >
                                            <div style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '10px',
                                                background: '#121613',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <LucideAmenityIcon name={amenity.name} icon={amenity.icon || ''} size={18} color="#D5ED55" />
                                            </div>
                                            <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>
                                                {amenity.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 4: 2-DAY DETAILED ITINERARY */}
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

                            {/* SECTION 5: INCLUSIONS & EXCLUSIONS */}
                            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18, 22, 19, 0.08)', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '32px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#166534', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</span>
                                            What's Included
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {(camp.inclusions || [
                                                'Welcome tea & hot snacks at basecamp check-in',
                                                'Buffet dinner with chicken/veg barbecue platter',
                                                'Morning hot breakfast & tea/coffee',
                                                'Stargazing campfire & live music setup',
                                                '4x4 Jeep transfer to Kolukkumalai sunrise point',
                                                'Certified trail marshals & wilderness first-aid kit'
                                            ]).map((inc, iidx) => (
                                                <div key={iidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#3A443E', lineHeight: 1.5 }}>
                                                    <span style={{ color: '#166534', fontWeight: '800', marginTop: '2px' }}>✓</span>
                                                    <span>{inc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#DC2626', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FEE2E2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✕</span>
                                            What's Not Included
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {(camp.exclusions || [
                                                'Personal vehicle fuel & highway toll charges',
                                                'Personal trekking gear (shoes, jackets, torches)',
                                                'Extra barbecue meat portions (order on site)',
                                                'Entry tickets to commercial viewpoints outside itinerary',
                                                'Medical evacuation expenses or insurance coverage'
                                            ]).map((exc, eidx) => (
                                                <div key={eidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#59655D', lineHeight: 1.5 }}>
                                                    <span style={{ color: '#DC2626', fontWeight: '800', marginTop: '2px' }}>✕</span>
                                                    <span>{exc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT COLUMN: SLEEK EXPANDED STICKY AVAILABILITY & BOOKING CARD ── */}
                        <div style={{ position: 'sticky', top: '90px' }}>
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '26px',
                                padding: 'clamp(22px, 2.4vw, 32px)',
                                border: '1px solid rgba(18, 22, 19, 0.1)',
                                boxShadow: '0 14px 40px rgba(0, 0, 0, 0.07)',
                                color: '#121613'
                            }}>
                                
                                {/* Header / Per-Camper Pricing Display */}
                                <div style={{ borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Starts at</div>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '900', color: '#121613' }}>
                                                ₹{roomPrice.toLocaleString('en-IN')}
                                            </span>
                                            <span style={{ fontSize: '13px', color: '#59655D', fontWeight: '600' }}>/ camper</span>
                                        </div>
                                    </div>
                                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '5px 11px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                                        <span>⚡ Live Available</span>
                                    </span>
                                </div>

                                {/* Form Inputs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* 1. Date Batch Selector */}
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', display: 'block', marginBottom: '5px', letterSpacing: '0.5px' }}>
                                            1. Check-In Weekend Batch
                                        </label>
                                        <CustomDateBatchPicker
                                            value={selectedDate}
                                            onChange={setSelectedDate}
                                            label="Select Batch Date"
                                        />
                                    </div>

                                    {/* 2. Room Type Selector */}
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', display: 'block', marginBottom: '5px', letterSpacing: '0.5px' }}>
                                            2. Accommodation Style
                                        </label>
                                        <CustomSelectDropdown
                                            value={selectedRoomId}
                                            onChange={(val) => { setSelectedRoomId(val); setCustomUnits(null); }}
                                            options={availableRooms.map(r => ({
                                                value: r.id,
                                                label: `${r.name} (${r.capacity}) — ₹${(r.price || r.pricePerPerson || camp.price || 2499).toLocaleString('en-IN')}`
                                            }))}
                                        />
                                    </div>

                                    {/* 3. Campers Counter */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                3. Total Campers
                                            </label>
                                            <span style={{ fontSize: '11.5px', color: '#166534', fontWeight: '800' }}>
                                                {discountLabel ? `✨ ${discountLabel}` : `${effectiveUnits} Unit(s)`}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', background: '#F8F9F5', borderRadius: '14px', border: '1px solid rgba(18, 22, 19, 0.1)', padding: '5px 8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = Math.max(1, guestsCount - 1);
                                                    setGuestsCount(next);
                                                    setCustomUnits(null);
                                                }}
                                                style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                −
                                            </button>
                                            <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800' }}>
                                                {guestsCount} {guestsCount === 1 ? 'Camper' : 'Campers'}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = guestsCount + 1;
                                                    setGuestsCount(next);
                                                    setCustomUnits(null);
                                                }}
                                                style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Summary Box */}
                                    <div style={{ background: '#F4F7EB', borderRadius: '16px', padding: '14px 18px', border: '1px solid rgba(22, 101, 52, 0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#59655D' }}>Estimated Total:</span>
                                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '900', color: '#166534' }}>
                                                {discountAmount > 0 && (
                                                    <span style={{ textDecoration: 'line-through', fontSize: '14px', fontWeight: '700', color: '#8A938B', marginRight: '8px' }}>
                                                        ₹{(guestsCount * roomPrice).toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                ₹{estimatedTotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', marginBottom: '3px' }}>
                                                ✨ {discountLabel} · You save ₹{discountAmount.toLocaleString('en-IN')}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>
                                            ✓ Includes {effectiveUnits} × {currentRoom.name}, Dinner BBQ & Guided Trek
                                        </div>
                                    </div>

                                    {/* Primary Booking Button */}
                                    <button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="btn-lime"
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            fontSize: '14.5px',
                                            fontWeight: '900',
                                            borderRadius: '14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 16px rgba(213,237,85,0.35)'
                                        }}
                                    >
                                        <span>Check Availability & Book →</span>
                                    </button>

                                    {/* Secondary WhatsApp Inquire Button */}
                                    <a
                                        href={waLink(`Hi Aanandham Team! I want to check availability for ${camp.title} on ${selectedDate} for ${guestsCount} campers in ${currentRoom.name}.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '100%',
                                            padding: '11.5px',
                                            borderRadius: '14px',
                                            background: '#F1F3EC',
                                            border: '1px solid rgba(18,22,19,0.08)',
                                            color: '#121613',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '7px',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px', color: '#25D366' }}></i>
                                        <span>Quick Inquire on WhatsApp</span>
                                    </a>

                                    <div style={{ textAlign: 'center', fontSize: '11px', color: '#7D8880', marginTop: '2px' }}>
                                        🔒 Secure Razorpay Checkout · 30% Advance Deposit locks permits
                                    </div>

                                </div>

                            </div>

                            {/* ── CARD 2: QUICK EXPEDITION TIMINGS ── */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '20px',
                                padding: '18px 20px',
                                marginTop: '16px',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Clock size={15} color="#166534" />
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Expedition Timings
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                        <span style={{ color: '#59655D' }}>Basecamp Check-in:</span>
                                        <span style={{ fontWeight: '800', color: '#121613' }}>02:00 PM (Snacks & Tea)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                        <span style={{ color: '#59655D' }}>Campfire & Live BBQ:</span>
                                        <span style={{ fontWeight: '800', color: '#121613' }}>08:00 PM</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                        <span style={{ color: '#59655D' }}>4x4 Sunrise Jeep Safari:</span>
                                        <span style={{ fontWeight: '800', color: '#166534' }}>04:30 AM (Peak Sunrise)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                        <span style={{ color: '#59655D' }}>Breakfast & Checkout:</span>
                                        <span style={{ fontWeight: '800', color: '#121613' }}>11:00 AM</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── CARD 3: AANANDHAM WILDERNESS SAFETY PROMISE ── */}
                            <div style={{
                                background: 'linear-gradient(135deg, #101E13 0%, #172B1C 100%)',
                                borderRadius: '20px',
                                padding: '18px 20px',
                                marginTop: '16px',
                                color: '#FFFFFF',
                                border: '1px solid rgba(213, 237, 85, 0.2)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <ShieldCheck size={16} color="#D5ED55" />
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#D5ED55', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Wilderness Guarantee
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#E2E8F0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#D5ED55', fontWeight: '900' }}>✓</span>
                                        <span>24/7 Gated Perimeter & Certified Marshals</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#D5ED55', fontWeight: '900' }}>✓</span>
                                        <span>Western Washrooms with Hot Water</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#D5ED55', fontWeight: '900' }}>✓</span>
                                        <span>Free Date Reschedule in Heavy Rain</span>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '14px', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Have Squad Questions?</div>
                                    <a
                                        href={waLink(`Hi Aanandham! I have questions regarding ${camp.title} facilities and group booking.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '11.5px', color: '#D5ED55', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <span>Chat with Marshal →</span>
                                    </a>
                                </div>
                            </div>

                            {/* ── CARD 4: TRANSPARENT CANCELLATION & REFUND POLICY ── */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '20px',
                                padding: '18px 20px',
                                marginTop: '16px',
                                border: '1px solid rgba(18, 22, 19, 0.08)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <ShieldCheck size={16} color="#166534" />
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#121613', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Cancellation & Refund Policy
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {CANCELLATION_TIERS.map(tier => (
                                        <div key={tier.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', borderBottom: '1px solid rgba(18,22,19,0.05)', paddingBottom: '6px' }}>
                                            <div>
                                                <div style={{ fontWeight: '800', color: '#121613' }}>{tier.title}</div>
                                                <div style={{ color: '#59655D', fontSize: '10.5px' }}>{tier.description}</div>
                                            </div>
                                            <span style={{ fontWeight: '900', color: tier.refundPercentage === 100 ? '#166534' : tier.refundPercentage > 0 ? '#B45309' : '#6B7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                                                {tier.refundPercentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* ── NEARBY OTHER CAMPSITES SECTION ── */}
                {nearbyCamps.length > 0 && (
                    <section style={{ maxWidth: '1440px', margin: '100px auto 0', padding: '0 clamp(20px, 4vw, 48px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '6px' }}>
                                    <span className="star-icon">★</span> SIMILAR SANCTUARIES
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Explore Other Kerala Wilderness Camps
                                </h2>
                            </div>
                            <Link href="/camps" style={{ color: '#166534', fontWeight: '800', fontSize: '13.5px', textDecoration: 'underline' }}>
                                View All Campsites →
                            </Link>
                        </div>

                        <div className="similar-camps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
                            {nearbyCamps.map((nc) => (
                                <Link
                                    key={nc.id}
                                    href={`/camps/${nc.id}`}
                                    className="hover-lift card-img-zoom"
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '22px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(18,22,19,0.08)',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <div style={{ height: '200px', position: 'relative' }}>
                                        <img
                                            src={nc.image}
                                            alt={nc.title}
                                            width="400"
                                            height="200"
                                            loading="lazy"
                                            decoding="async"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#E5A93B', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {nc.altitude}
                                        </span>
                                    </div>
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                                                {nc.region}
                                            </span>
                                            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#121613' }}>
                                                ★ {nc.rating || 4.9}
                                            </span>
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: '0 0 10px', color: '#121613' }}>
                                            {nc.title}
                                        </h3>
                                        <div style={{ borderTop: '1px solid rgba(18,22,19,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '11px', color: '#7D8880' }}>Starts at ₹{nc.price}/person</span>
                                            <span style={{ color: '#166534', fontWeight: '800', fontSize: '12.5px' }}>View Camp →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            {/* ── FOOTER ── */}
            <Footer />

            {/* ── BOOKING MODAL WITH PRE-FILLED CAMPSITE, ROOM, GUESTS & DATE ── */}
            <BookingEngineModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialPackage={camp}
                initialRoom={currentRoom}
                initialRoomId={selectedRoomId}
                initialDate={selectedDate}
                initialGuests={guestsCount}
                initialCustomUnits={customUnits}
            />

            {/* ── FULLSCREEN PHOTO LIGHTBOX ── */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <div
                        onClick={() => setIsLightboxOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 100000,
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(16px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            style={{ position: 'relative', maxWidth: '1000px', width: '100%', maxHeight: '85vh' }}
                        >
                            <img
                                src={gallery[activePhotoIdx]}
                                alt={`${camp.title} Full View`}
                                style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain', display: 'block', margin: '0 auto', borderRadius: '16px' }}
                            />
                            
                            {/* Controls */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', color: '#FFFFFF' }}>
                                <button
                                    onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + gallery.length) % gallery.length)}
                                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', padding: '10px 20px', borderRadius: '999px', cursor: 'pointer', fontWeight: '800' }}
                                >
                                    ← Previous
                                </button>
                                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                                    {activePhotoIdx + 1} / {gallery.length}
                                </span>
                                <button
                                    onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % gallery.length)}
                                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', padding: '10px 20px', borderRadius: '999px', cursor: 'pointer', fontWeight: '800' }}
                                >
                                    Next →
                                </button>
                            </div>

                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '0',
                                    background: 'none',
                                    border: 'none',
                                    color: '#FFFFFF',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    fontWeight: '800'
                                }}
                            >
                                ✕
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── TOAST NOTIFICATION ── */}
            <AnimatePresence>
                {shareToast && (
                    <div style={{
                        position: 'fixed',
                        top: '24px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        zIndex: 100000,
                        padding: '0 16px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.95 }}
                            style={{
                                pointerEvents: 'auto',
                                background: '#121613',
                                color: '#FFFFFF',
                                padding: '12px 24px',
                                borderRadius: '999px',
                                fontSize: '13.5px',
                                fontWeight: '700',
                                border: '1.5px solid #D5ED55',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 24px rgba(213, 237, 85, 0.25)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>{shareToast}</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
