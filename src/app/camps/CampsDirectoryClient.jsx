"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CustomSelectDropdown from '../../components/CustomSelectDropdown';
import dynamic from 'next/dynamic';
const BookingEngineModal = dynamic(() => import('../../components/BookingEngineModal'), { ssr: false });
import LucideAmenityIcon from '../../components/common/LucideAmenityIcon';
import { MapPin, Clock, Heart, Camera, Star, Search, X } from 'lucide-react';
import { INITIAL_ALL_CAMPS, getAllCamps } from '../../lib/campsData';
import { waLink } from '../../lib/whatsapp';

const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended', icon: 'Sparkles' },
    { value: 'price-asc', label: 'Price: Low to High', icon: 'TrendingDown' },
    { value: 'price-desc', label: 'Price: High to Low', icon: 'TrendingUp' },
    { value: 'altitude', label: 'Highest Altitude (FT)', icon: 'Mountain' },
    { value: 'rating', label: 'Top Rated (4.9+)', icon: 'Star' }
];

export default function CampsDirectoryClient({ initialCamps = INITIAL_ALL_CAMPS }) {
    const [camps, setCamps] = useState(initialCamps);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'altitude' | 'rating'
    const [onlyWishlisted, setOnlyWishlisted] = useState(false);

    // User Wishlist stored in localStorage
    const [wishlist, setWishlist] = useState([]);

    // Modals state
    const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    // Load camps & wishlist from localStorage on mount + listen for admin updates
    useEffect(() => {
        const refreshCamps = async () => {
            try {
                const res = await fetch('/api/admin/camps');
                if (res.ok) {
                    const serverCamps = await res.json();
                    if (Array.isArray(serverCamps) && serverCamps.length > 0) {
                        setCamps(prev => {
                            // Only update state if length or items actually changed to avoid layout re-render
                            if (JSON.stringify(prev) === JSON.stringify(serverCamps)) return prev;
                            return serverCamps;
                        });
                    }
                }
            } catch (e) {}
        };

        refreshCamps();

        try {
            const savedWishlist = JSON.parse(localStorage.getItem('aanandham_user_wishlist') || '[]');
            setWishlist(savedWishlist);
        } catch (e) {
            console.error('Error reading wishlist from localStorage:', e);
        }

        const handleStorage = () => {
            refreshCamps();
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3200);
    };

    // Toggle Wishlist / Like
    const handleToggleWishlist = (campId, campTitle, e) => {
        e?.stopPropagation();
        e?.preventDefault();
        let updated;
        const isLiked = wishlist.includes(campId);
        if (isLiked) {
            updated = wishlist.filter(id => id !== campId);
            showToast(`Removed "${campTitle}" from your wishlist`);
        } else {
            updated = [...wishlist, campId];
            showToast(`❤️ Added "${campTitle}" to your saved wishlist!`);
        }
        setWishlist(updated);
        try {
            localStorage.setItem('aanandham_user_wishlist', JSON.stringify(updated));
        } catch (e) {}
    };

    // Share Camp Action
    const handleShare = async (camp, e) => {
        e?.stopPropagation();
        e?.preventDefault();
        const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/camps/${camp.id}` : '';
        const shareData = {
            title: `${camp.title} | Aanandham.go Wilderness`,
            text: `Check out ${camp.title} at ${camp.altitude} in ${camp.location}!`,
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
            showToast('✓ Link copied to clipboard!');
        } catch (err) {
            window.open(waLink(`Check out this Kerala wilderness camp: ${camp.title} - ${shareUrl}`), '_blank');
        }
    };

    // Filter & Sort Logic
    const filteredCamps = useMemo(() => {
        return camps.filter(camp => {
            // Search query filter
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                camp.title.toLowerCase().includes(q) || 
                (camp.location && camp.location.toLowerCase().includes(q)) || 
                (camp.altitude && camp.altitude.toLowerCase().includes(q)) ||
                (camp.description && camp.description.toLowerCase().includes(q));

            // Region filter
            const matchesRegion = selectedRegion === 'All' || (camp.region || 'Munnar') === selectedRegion;

            // Category filter
            const matchesCategory = selectedCategory === 'All' || 
                (camp.category && camp.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                (camp.tag && camp.tag.toLowerCase().includes(selectedCategory.toLowerCase()));

            // Wishlist only filter
            const matchesWishlist = !onlyWishlisted || wishlist.includes(camp.id);

            return matchesSearch && matchesRegion && matchesCategory && matchesWishlist;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
            if (sortBy === 'altitude') {
                const altA = parseInt(String(a.altitude || '0').replace(/\D/g, '')) || 0;
                const altB = parseInt(String(b.altitude || '0').replace(/\D/g, '')) || 0;
                return altB - altA;
            }
            return 0; // Default recommended
        });
    }, [camps, searchQuery, selectedRegion, selectedCategory, sortBy, onlyWishlisted, wishlist]);

    // Distinct Regions
    const allRegions = useMemo(() => {
        const set = new Set(['All']);
        camps.forEach(c => {
            if (c.region) set.add(c.region);
        });
        return Array.from(set);
    }, [camps]);

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613' }}>
            
            {/* ── HEADER ── */}
            <SiteHeader transparentOnTop={false} activePage="camps" />

            <main style={{ paddingBottom: '120px' }}>

                {/* ── HERO BANNER ── */}
                <section style={{
                    background: 'linear-gradient(180deg, #101E13 0%, #0D170F 100%)',
                    color: '#FFFFFF',
                    padding: 'clamp(115px, 12vw, 150px) clamp(20px, 4vw, 48px) clamp(44px, 6vw, 72px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Ambient Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-120px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '700px',
                        height: '350px',
                        background: 'radial-gradient(circle, rgba(213, 237, 85, 0.12) 0%, rgba(16, 30, 19, 0) 70%)',
                        pointerEvents: 'none',
                        filter: 'blur(60px)'
                    }} />

                    <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <div style={{ maxWidth: '820px' }}>
                            <div className="star-badge" style={{ background: 'rgba(213, 237, 85, 0.15)', color: '#D5ED55', border: '1px solid rgba(213, 237, 85, 0.3)', marginBottom: '16px' }}>
                                <span className="star-icon">★</span> 11 VERIFIED SANCTUARIES
                            </div>
                            
                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 5.5vw, 56px)',
                                fontWeight: '800',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                margin: '0 0 16px',
                                color: '#FFFFFF'
                            }}>
                                Kerala High-Altitude Camps & <span style={{ color: '#D5ED55' }}>Wilderness Basecamps</span>
                            </h1>

                            <p style={{
                                fontSize: 'clamp(15px, 1.8vw, 17px)',
                                color: '#A2B6A6',
                                lineHeight: 1.7,
                                margin: '0 0 28px'
                            }}>
                                Explore verified campgrounds perched above rolling cloud beds. Featuring luxury geodesic dome pods, 4x4 summit convoys, private campfire barbecues, and live availability across Munnar, Suryanelli, Wayanad, Vagamon, and Athirappilly.
                            </p>

                            {/* Wishlist Bar Pill (Only shown if wishlist has items) */}
                            {wishlist.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setOnlyWishlisted(!onlyWishlisted)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 20px',
                                            borderRadius: '999px',
                                            background: onlyWishlisted ? '#D5ED55' : 'rgba(255, 255, 255, 0.1)',
                                            border: onlyWishlisted ? '1px solid #D5ED55' : '1px solid rgba(255, 255, 255, 0.2)',
                                            color: onlyWishlisted ? '#121613' : '#FFFFFF',
                                            fontSize: '13.5px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span>{onlyWishlisted ? '❤️ Showing Wishlist Only' : `❤️ Saved Wishlist (${wishlist.length})`}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── FILTER & SEARCH BAR SECTION ── */}
                <section style={{
                    maxWidth: '1440px',
                    margin: '-30px auto 40px',
                    padding: '0 clamp(20px, 4vw, 48px)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '24px 28px',
                        border: '1px solid rgba(18, 22, 19, 0.08)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px'
                    }}>
                        
                        {/* Row 1: Search Input & Sort Selector */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                            
                            {/* Search Input */}
                            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search by camp name, altitude (e.g. 7,900 FT), or location..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px 14px 44px',
                                        borderRadius: '14px',
                                        background: '#F8F9F5',
                                        border: '1px solid rgba(18, 22, 19, 0.12)',
                                        color: '#121613',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                                    <Search size={16} color="#121613" />
                                </span>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#59655D' }}
                                    >
                                        <X size={14} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>

                            {/* Sort Selector with Reusable CustomSelectDropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.6px', flexShrink: 0 }}>
                                    Sort:
                                </span>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <CustomSelectDropdown
                                        options={SORT_OPTIONS}
                                        value={sortBy}
                                        onChange={val => setSortBy(val)}
                                        theme="light"
                                        placeholder="Sort By..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Region Pills & Categories */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(18, 22, 19, 0.06)', paddingTop: '16px' }}>
                            
                            {/* Region Pills */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', marginRight: '4px' }}>
                                    Region:
                                </span>
                                {allRegions.map(reg => {
                                    const isSelected = selectedRegion === reg;
                                    return (
                                        <button
                                            key={reg}
                                            onClick={() => setSelectedRegion(reg)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '999px',
                                                background: isSelected ? '#121613' : '#F1F3EC',
                                                color: isSelected ? '#D5ED55' : '#121613',
                                                border: 'none',
                                                fontSize: '12.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {reg === 'All' ? 'All Kerala' : `📍 ${reg}`}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Category Filter Pills */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {[
                                    { id: 'All', label: 'All Styles' },
                                    { id: 'Glamp', label: '⛺ Glamping' },
                                    { id: 'Summit', label: '🏔️ Summit Treks' },
                                    { id: 'Forest', label: '🌲 Rainforest & Pine' }
                                ].map(cat => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            style={{
                                                padding: '7px 14px',
                                                borderRadius: '999px',
                                                background: isSelected ? '#E5A93B' : 'transparent',
                                                color: isSelected ? '#121613' : '#59655D',
                                                border: isSelected ? '1px solid #E5A93B' : '1px solid rgba(18, 22, 19, 0.12)',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </section>

                {/* ── CAMPSITES LISTING GRID ── */}
                <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
                    
                    {/* Header showing count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                        <div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                Showing {filteredCamps.length} of {camps.length} Campsites
                            </span>
                        </div>
                        {onlyWishlisted && (
                            <button
                                onClick={() => setOnlyWishlisted(false)}
                                style={{ background: 'none', border: 'none', color: '#166534', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Show All Basecamps →
                            </button>
                        )}
                    </div>

                    {filteredCamps.length === 0 ? (
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1px solid rgba(18,22,19,0.08)' }}>
                            <div style={{ fontSize: '42px', marginBottom: '14px' }}>⛺</div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '0 0 8px' }}>
                                No campsites match your filters
                            </h3>
                            <p style={{ fontSize: '14px', color: '#59655D', marginBottom: '20px' }}>
                                Try clearing search filters or switching to "All Kerala" regions.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedRegion('All');
                                    setSelectedCategory('All');
                                    setOnlyWishlisted(false);
                                }}
                                className="btn-lime"
                                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '28px' }}>
                            {filteredCamps.map((camp) => {
                                const isLiked = wishlist.includes(camp.id);
                                const galleryList = camp.gallery && camp.gallery.length > 0 ? camp.gallery : [camp.image];

                                return (
                                    <div
                                        key={camp.id}
                                        className="hover-lift card-img-zoom"
                                        style={{
                                            background: '#FFFFFF',
                                            borderRadius: '28px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.03)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Top Image & Interactive Photo Carousel / Badges */}
                                        <div style={{ position: 'relative', height: '270px', overflow: 'hidden' }}>
                                            <img
                                                src={camp.image || galleryList[0]}
                                                alt={camp.title}
                                                width="400"
                                                height="270"
                                                loading="lazy"
                                                decoding="async"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            
                                            {/* Gradient Overlay */}
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

                                            {/* Altitude Badge Top Left */}
                                            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    background: '#E5A93B',
                                                    color: '#121613',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '5px 12px',
                                                    borderRadius: '999px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                }}>
                                                    {camp.altitude || 'Western Ghats'}
                                                </span>
                                                {camp.tag && (
                                                    <span style={{
                                                        background: '#121613',
                                                        color: '#D5ED55',
                                                        fontSize: '10.5px',
                                                        fontWeight: '800',
                                                        padding: '5px 10px',
                                                        borderRadius: '999px'
                                                    }}>
                                                        {camp.tag}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons Top Right: Like & Share */}
                                            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => handleToggleWishlist(camp.id, camp.title, e)}
                                                    aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        background: isLiked ? '#EF4444' : 'rgba(0, 0, 0, 0.55)',
                                                        border: 'none',
                                                        color: '#FFFFFF',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        backdropFilter: 'blur(6px)',
                                                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                                                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                >
                                                    <Heart size={16} fill={isLiked ? '#FFFFFF' : 'none'} color="#FFFFFF" strokeWidth={2.5} />
                                                </button>

                                                <button
                                                    onClick={(e) => handleShare(camp, e)}
                                                    aria-label="Share campsite link"
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(0, 0, 0, 0.55)',
                                                        border: 'none',
                                                        color: '#FFFFFF',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        backdropFilter: 'blur(6px)',
                                                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '15px', color: '#FFFFFF' }}>→</span>
                                                </button>
                                            </div>

                                            {/* Bottom Overlay Info (Gallery Count & Rating) */}
                                            <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF' }}>
                                                <button
                                                    onClick={() => setSelectedLightboxPhoto(camp.image)}
                                                    style={{
                                                        background: 'rgba(0, 0, 0, 0.55)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        color: '#FFFFFF',
                                                        padding: '5px 12px',
                                                        borderRadius: '999px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        backdropFilter: 'blur(6px)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <Camera size={13} color="#FFFFFF" />
                                                    <span>{galleryList.length} Photos</span>
                                                </button>

                                                <span style={{ fontSize: '12px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '999px', backdropFilter: 'blur(6px)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Star size={13} fill="#E5A93B" color="#E5A93B" />
                                                    <span>{camp.rating || 4.98}</span>
                                                    <span style={{ opacity: 0.75, fontWeight: '600', fontSize: '11px' }}>({camp.reviewsCount || 342})</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            
                                            {/* Region & Duration */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={13} color="#166534" strokeWidth={2.5} />
                                                    <span>{camp.location || camp.region}</span>
                                                </span>
                                                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#166534', background: 'rgba(22, 101, 52, 0.1)', padding: '3px 9px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} strokeWidth={2.5} />
                                                    <span>{camp.duration || '2D / 1N'}</span>
                                                </span>
                                            </div>

                                            {/* Campsite Title */}
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', margin: '0 0 10px', lineHeight: 1.35 }}>
                                                <Link href={`/camps/${camp.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {camp.title}
                                                </Link>
                                            </h3>

                                            {/* Description snippet */}
                                            <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                                                {camp.description ? camp.description.slice(0, 115) + '...' : 'High-altitude ridge glamping, sunrise jeep convoy safari, campfire barbecue dinner, and certified trail marshals.'}
                                            </p>

                                            {/* Highlights Tags */}
                                            {camp.highlights && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                                    {camp.highlights.slice(0, 3).map((h, hidx) => (
                                                        <span key={hidx} style={{ fontSize: '11px', fontWeight: '700', background: '#F1F3EC', color: '#121613', padding: '4px 9px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                            <LucideAmenityIcon name={h} size={12} color="#166534" />
                                                            <span>{h}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Price & Action Buttons Footer */}
                                            <div style={{ borderTop: '1px solid rgba(18, 22, 19, 0.08)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
                                                {/* Price Header */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '2px' }}>
                                                            Starts at
                                                        </span>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: '900', color: '#121613' }}>
                                                                ₹{camp.price.toLocaleString('en-IN')}
                                                            </span>
                                                            <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>/ camper</span>
                                                        </div>
                                                    </div>

                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', background: 'rgba(22, 101, 52, 0.08)', padding: '4px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        ✓ Instant Booking
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <Link
                                                        href={`/camps/${camp.id}`}
                                                        style={{
                                                            padding: '12px 14px',
                                                            borderRadius: '12px',
                                                            background: '#F1F3EC',
                                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                                            color: '#121613',
                                                            fontSize: '13px',
                                                            fontWeight: '800',
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '4px',
                                                            transition: 'all 0.2s ease',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <span>Explore →</span>
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedPackageForBooking(camp);
                                                            setIsBookingModalOpen(true);
                                                        }}
                                                        className="btn-lime"
                                                        style={{
                                                            padding: '12px 14px',
                                                            borderRadius: '12px',
                                                            fontSize: '13px',
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: 'none',
                                                            width: '100%',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── ACCOMMODATION STYLES PER-TYPE GALLERY BREAKDOWN ── */}
                <section style={{ maxWidth: '1440px', margin: '100px auto 0', padding: '0 clamp(20px, 4vw, 48px)' }}>
                    <div style={{ background: '#101E13', borderRadius: '32px', padding: 'clamp(40px, 6vw, 70px) clamp(24px, 4vw, 60px)', color: '#FFFFFF' }}>
                        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
                            <div className="star-badge" style={{ background: 'rgba(213, 237, 85, 0.15)', color: '#D5ED55', border: '1px solid rgba(213, 237, 85, 0.3)', margin: '0 auto 12px' }}>
                                <span className="star-icon">★</span> ACCOMMODATION TYPES
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#FFFFFF', margin: '0 0 12px' }}>
                                Experience Wilderness With Luxury Rest
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', margin: 0, lineHeight: 1.65 }}>
                                Every campsite includes clean western washrooms, running hot water, 24/7 power backup, and dedicated basecamp coordinators.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
                            {[
                                {
                                    title: 'Geodesic Luxury Dome Pods',
                                    badge: 'Couples & Privacy',
                                    img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Insulated 360-degree panoramic sky domes with private viewing deck, plush queen beds, and valley sunset vistas.',
                                    features: ['King / Queen Plush Bed', 'Panoramic Cloud Vista Window', 'Private Sit-Out Balcony', 'En-suite Washroom']
                                },
                                {
                                    title: 'High-Altitude Alpine Ridge Tents',
                                    badge: 'Trek & Adventure',
                                    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Dual-layered weatherproof Quechua tents with thermal sleeping bags and memory foam ground mattresses on elevated timber platforms.',
                                    features: ['2-Layer Weatherproof Shell', 'Thermal Cold-Weather Sleeping Bags', 'Elevated Timber Platform', 'Campfire Circle Access']
                                },
                                {
                                    title: 'Cliffside Wooden Cottages',
                                    badge: 'Family & Groups',
                                    img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Rustic cedarwood family chalets nestled against mountain slopes with spacious bunk arrangements and private verandas.',
                                    features: ['4-6 Bunk Capacity', 'Cedar Wood Interior', 'Dedicated Dining Bay', '24/7 Hot Water Facility']
                                }
                            ].map((pod, pidx) => (
                                <div key={pidx} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '200px', position: 'relative' }}>
                                        <img src={pod.img} alt={pod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#D5ED55', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {pod.badge}
                                        </span>
                                    </div>
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px' }}>
                                            {pod.title}
                                        </h3>
                                        <p style={{ fontSize: '13.5px', color: '#A2B6A6', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                                            {pod.desc}
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {pod.features.map((feat, fidx) => (
                                                <span key={fidx} style={{ fontSize: '12px', color: '#D5ED55', fontWeight: '600' }}>
                                                    ✓ {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* ── FOOTER ── */}
            <Footer />

            {/* ── BOOKING MODAL ── */}
            <BookingEngineModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialPackage={selectedPackageForBooking}
            />

            {/* ── FULLSCREEN PHOTO LIGHTBOX ── */}
            <AnimatePresence>
                {selectedLightboxPhoto && (
                    <div
                        onClick={() => setSelectedLightboxPhoto(null)}
                        style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
                    >
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '900px', width: '100%', maxHeight: '85vh', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.6)' }}>
                            <img src={selectedLightboxPhoto} alt="Campsite Preview" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                            <button onClick={() => setSelectedLightboxPhoto(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── INTERACTIVE EXPEDITION BOOKING MODAL ── */}
            <BookingEngineModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialPackage={selectedPackageForBooking}
            />

            {/* ── TOAST NOTIFICATION ── */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '28px',
                            right: '28px',
                            zIndex: 100000,
                            background: '#121613',
                            color: '#FFFFFF',
                            padding: '14px 22px',
                            borderRadius: '14px',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.22)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
