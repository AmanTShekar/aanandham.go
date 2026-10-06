"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CustomSelectDropdown from '../../components/CustomSelectDropdown';
import dynamic from 'next/dynamic';
const BookingEngineModal = dynamic(() => import('../../components/BookingEngineModal'), { ssr: false });
import LucideAmenityIcon from '../../components/common/LucideAmenityIcon';
import VerifiedStayBadge from '../../components/common/VerifiedStayBadge';
import { SkeletonCampGrid, AssetImage } from '../../components/common/SkeletonLoader';
import { MapPin, Clock, Heart, Camera, Star, Search, X, Share2, Tent, Sunrise, Flame, Footprints, Telescope, Leaf, Zap, Building2, Home, Compass, Bed, Trees, Mountain, Landmark, Check } from 'lucide-react';
import { INITIAL_ALL_CAMPS, getAllCamps, saveAllCamps, DEPRECATED_CAMP_IDS } from '../../lib/campsData';
import { waLink } from '../../lib/whatsapp';
import { resolvePropertyType, getPricingUnitLabel, PROPERTY_STAY_CATEGORIES } from '../../lib/propertyStayTypes';

function PropertyTypeIcon({ typeMeta, size = 13, color = "#166534" }) {
    const iconName = typeMeta?.icon;
    if (iconName === 'Building2') return <Building2 size={size} color={color} />;
    if (iconName === 'Home') return <Home size={size} color={color} />;
    if (iconName === 'Compass') return <Compass size={size} color={color} />;
    if (iconName === 'Bed') return <Bed size={size} color={color} />;
    if (iconName === 'Mountain') return <Mountain size={size} color={color} />;
    if (iconName === 'Trees') return <Trees size={size} color={color} />;
    if (iconName === 'Landmark') return <Landmark size={size} color={color} />;
    return <Tent size={size} color={color} />;
}

const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended', icon: 'Sparkles' },
    { value: 'price-asc', label: 'Price: Low to High', icon: 'TrendingDown' },
    { value: 'price-desc', label: 'Price: High to Low', icon: 'TrendingUp' },
    { value: 'altitude', label: 'Highest Altitude (FT)', icon: 'Mountain' },
    { value: 'rating', label: 'Top Rated (4.9+)', icon: 'Star' }
];

export default function CampsDirectoryClient({ 
    initialCamps = null,
    initialRegion = 'All',
    heroBadge = null,
    heroTitle = null,
    heroSubtitle = null,
    comingSoon = false,
    comingSoonRegion = null,
    comingSoonTitle = null,
    comingSoonSubtitle = null,
    comingSoonPoints = null,
    extraContent = null
}) {
    const router = useRouter();
    const [camps, setCamps] = useState(initialCamps && initialCamps.length > 0 ? initialCamps : []);
    const [isLoading, setIsLoading] = useState(!initialCamps || initialCamps.length === 0);
    const [searchQuery, setSearchQuery] = useState('');
    // In coming-soon mode the grid shows live Kerala basecamps, so default filter to All
    // to avoid an empty/confusing listing that mismatches the page metadata.
    const [selectedRegion, setSelectedRegion] = useState(comingSoon ? 'All' : initialRegion);
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
                const res = await fetch('/api/admin/camps', { cache: 'no-store' });
                if (res && res.ok) {
                    const serverCamps = await res.json();
                    if (Array.isArray(serverCamps) && serverCamps.length > 0) {
                        saveAllCamps(serverCamps);
                        setCamps(prev => {
                            if (JSON.stringify(prev) === JSON.stringify(serverCamps)) return prev;
                            return serverCamps;
                        });
                    }
                }
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
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

    // Listen for global booking open trigger from sticky bar / dock
    useEffect(() => {
        const handleGlobalBooking = (e) => {
            e.preventDefault();
            if (e.detail?.camp) {
                setSelectedPackageForBooking(e.detail.camp);
            } else if (camps && camps.length > 0) {
                setSelectedPackageForBooking(camps[0]);
            }
            setIsBookingModalOpen(true);
        };
        window.addEventListener('aanandham_open_booking', handleGlobalBooking);
        return () => window.removeEventListener('aanandham_open_booking', handleGlobalBooking);
    }, [camps]);

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
            if (camp.archived || DEPRECATED_CAMP_IDS.has(camp.id)) return false;

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
                (camp.propertyTypeSlug && camp.propertyTypeSlug.toLowerCase() === selectedCategory.toLowerCase()) ||
                (camp.propertyType?.slug && camp.propertyType.slug.toLowerCase() === selectedCategory.toLowerCase()) ||
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
                                <span className="star-icon">★</span> {heroBadge || (isLoading ? 'VERIFIED CAMPSITES' : `${camps.length} VERIFIED CAMPSITES`)}
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
                                {heroTitle ? heroTitle : (
                                    <>Kerala High-Altitude Camps & <span style={{ color: '#D5ED55' }}>Wilderness Basecamps</span></>
                                )}
                            </h1>

                            <p style={{
                                fontSize: 'clamp(15px, 1.8vw, 17px)',
                                color: '#A2B6A6',
                                lineHeight: 1.7,
                                margin: '0 0 28px'
                            }}>
                                {heroSubtitle ? heroSubtitle : 'Explore verified campgrounds perched above rolling cloud beds. Featuring luxury ridge glamping tents, 4x4 summit convoys, private campfire barbecues, and live availability across Munnar, Suryanelli, Vagamon, Wayanad — plus new Himalayan stays in Himachal.'}
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
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{onlyWishlisted ? <Heart size={15} fill="#121613" /> : <Heart size={15} />} {onlyWishlisted ? 'Showing Wishlist Only' : `Saved Wishlist (${wishlist.length})`}</span>
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
                    <div className="camps-filter-card" style={{
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
                            <div className="camps-filter-search" style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search by location or camp name"
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
                            <div className="camps-filter-sort" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                            <div className="camps-pills-row" data-lenis-prevent="true" data-lenis-prevent-wheel="true" data-lenis-prevent-touch="true">
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
                                            {reg === 'All' ? 'All Kerala' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {reg}</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Category Filter Pills (PMS Taxonomy) */}
                            <div className="camps-pills-row" data-lenis-prevent="true" data-lenis-prevent-wheel="true" data-lenis-prevent-touch="true">
                                {[
                                    { id: 'All', label: 'All Stays' },
                                    { id: 'resorts', label: 'Resorts' },
                                    { id: 'villas', label: 'Villas' },
                                    { id: 'camps', label: 'Glamp & Camps' },
                                    { id: 'cottages-and-cabins', label: 'Cottages' },
                                    { id: 'mountain-stays', label: 'Mountain Stays' },
                                    { id: 'homestays', label: 'Homestays' },
                                    { id: 'houseboats', label: 'Houseboats' },
                                    { id: 'hotels', label: 'Hotels' }
                                ].map(cat => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            style={{
                                                padding: '7px 14px',
                                                borderRadius: '999px',
                                                background: isSelected ? '#121613' : 'transparent',
                                                color: isSelected ? '#D5ED55' : '#59655D',
                                                border: isSelected ? '1px solid #121613' : '1px solid rgba(18, 22, 19, 0.12)',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                whiteSpace: 'nowrap'
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

                {/* ── COMING-SOON NOTICE (honest mismatch fix: no fake inventory) ── */}
                {comingSoon && (
                    <section style={{ maxWidth: '1440px', margin: '0 auto 36px', padding: '0 clamp(20px, 4vw, 48px)' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #FFF7E6 0%, #FFFDF5 100%)',
                            border: '1.5px dashed rgba(229, 169, 59, 0.6)',
                            borderRadius: '24px',
                            padding: 'clamp(24px, 4vw, 36px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                        }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', background: '#121613', color: '#D5ED55', fontSize: '11.5px', fontWeight: '900', letterSpacing: '1px', padding: '6px 14px', borderRadius: '999px', textTransform: 'uppercase' }}>
                                <span>●</span> {comingSoonRegion ? `${comingSoonRegion} · Coming Soon` : 'Coming Soon'}
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', margin: 0, color: '#121613', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                                {comingSoonTitle || 'We are scouting verified basecamps here.'}
                            </h2>
                            <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#59655D', margin: 0, maxWidth: '760px' }}>
                                {comingSoonSubtitle || 'Our crew is on-ground verifying stays, trails and safety. Join the WhatsApp waitlist and we will ping you the day bookings open — meanwhile explore our live Kerala basecamps below.'}
                            </p>
                            {comingSoonPoints && comingSoonPoints.length > 0 && (
                                <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {comingSoonPoints.map((pt, i) => (
                                        <li key={i} style={{ fontSize: '12.5px', fontWeight: '700', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', padding: '7px 14px', borderRadius: '999px', color: '#121613' }}>
                                            ✓ {pt}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                                <a
                                    href={waLink(`Hi Aanandham! Notify me when ${comingSoonRegion || 'new'} camps launch. I want early-bird access.`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', fontWeight: '900', fontSize: '14px', padding: '12px 22px', minHeight: '44px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
                                >
                                    Notify Me on WhatsApp
                                </a>
                                <a
                                    href="/camps"
                                    onClick={(e) => { e.preventDefault(); setSelectedRegion('All'); setSearchQuery(''); document.getElementById('live-basecamps-grid')?.scrollIntoView({ behavior: 'smooth' }); }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#121613', color: '#D5ED55', fontWeight: '800', fontSize: '14px', padding: '12px 22px', minHeight: '44px', borderRadius: '12px', textDecoration: 'none' }}
                                >
                                    Explore Live Kerala Camps ↓
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── AANANDHAM.STAYS LAUNCH BANNER ── */}
                <section style={{ maxWidth: '1440px', margin: '0 auto 0', padding: '0 clamp(20px, 4vw, 48px)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0B1A0E 0%, #121E15 50%, #0D1A10 100%)',
                        borderRadius: '28px 28px 0 0',
                        padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 52px) clamp(24px, 3vw, 36px)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(213, 237, 85, 0.18)',
                        borderBottom: 'none',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
                    }}>
                        {/* Glow blur */}
                        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '380px', height: '280px', background: 'radial-gradient(circle, rgba(213,237,85,0.14) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '200px', background: 'radial-gradient(circle, rgba(37,211,102,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', zIndex: 2 }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
                                <div style={{ flex: 1, minWidth: '260px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(213,237,85,0.12)', border: '1px solid rgba(213,237,85,0.3)', borderRadius: '999px', padding: '5px 14px', marginBottom: '14px' }}>
                                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D5ED55', boxShadow: '0 0 8px #D5ED55', display: 'inline-block', animation: 'pulse-dot 1.8s ease-in-out infinite' }} />
                                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#D5ED55', letterSpacing: '1px', textTransform: 'uppercase' }}>Now Open · Aanandham.Stays</span>
                                    </div>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: '900', color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                                        Stays by Aanandham
                                        <span style={{ color: '#D5ED55' }}>.Stays</span>
                                    </h2>
                                    <p style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: '#A2B6A6', lineHeight: 1.65, margin: 0, maxWidth: '560px' }}>
                                        Owner-operated, personally verified mountain stays. Every detail handpicked by our team — from Himalayan sunrises to campfire dinners.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignSelf: 'center' }}>
                                    <a href="https://wa.me/919074858014?text=Hi! I want to know more about Aanandham.Stays" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.07)', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', padding: '10px 20px', borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                                        Enquire on WhatsApp →
                                    </a>
                                </div>
                            </div>

                            {/* ── TWO FEATURED PROPERTY CARDS ── */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '16px' }}>

                                {/* — Card 1: The Nest Kalga (LIVE FROM PMS) — */}
                                <div
                                    onClick={() => router.push('/camps/cmu7f7c7q0001jf2bn12igi66')}
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(213,237,85,0.22)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease', position: 'relative' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {/* Image — No stock image fallback when real photos not uploaded */}
                                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 50% 40%, #162419 0%, #0A130C 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Mountain size={38} color="#D5ED55" strokeWidth={1.5} style={{ opacity: 0.85 }} />
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#D5ED55', letterSpacing: '0.5px', textTransform: 'uppercase' }}>8,000 FT Alpine Sanctuary</span>
                                        <span style={{ fontSize: '10px', color: '#6B8A72', fontWeight: '600' }}>Live Photos Being Verified</span>
                                        {/* Top badges */}
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                                            <span style={{ background: '#D5ED55', color: '#121613', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '999px' }}>Cottages &amp; Cabins</span>
                                            <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>8,000 FT</span>
                                        </div>
                                        {/* Live dot bottom-right */}
                                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(22,101,52,0.9)', border: '1px solid #166534', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                            <span className="live-available-dot" />
                                            <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#FFFFFF' }}>Live Available</span>
                                        </div>
                                    </div>
                                    {/* Body */}
                                    <div style={{ padding: '18px 20px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4.5px',
                                                background: 'rgba(213,237,85,0.12)',
                                                border: '1px solid rgba(213,237,85,0.3)',
                                                color: '#D5ED55',
                                                fontSize: '10px',
                                                fontWeight: '900',
                                                padding: '3px 9px',
                                                borderRadius: '999px'
                                            }}>
                                                <span style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    background: '#D5ED55',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Check size={8} color="#121613" strokeWidth={3.5} />
                                                </span>
                                                by Aanandham.Stays
                                            </span>
                                            <span style={{ fontSize: '10.5px', color: '#6B8A72', fontWeight: '600' }}>Kasol, Himachal</span>
                                        </div>
                                        <div style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>The Nest Kalga by Aanandham.Go</div>
                                        <div style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.5, marginBottom: '14px' }}>Solar-powered mountain basecamp with panoramic sunrise deck, 10-bed dorm, private balcony rooms &amp; guided ridge treks.</div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                            {['Sunrise Deck', 'Campfire & BBQ', 'Guided Trek', 'Solar Powered'].map((f, i) => (
                                                <span key={i} style={{ fontSize: '10.5px', fontWeight: '700', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#D5ED55', padding: '3px 9px', borderRadius: '6px' }}>✓ {f}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '9.5px', fontWeight: '700', color: '#6B8A72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starts at</div>
                                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '900', color: '#D5ED55', lineHeight: 1 }}>₹249 <span style={{ fontSize: '11px', fontWeight: '600', color: '#A2B6A6' }}>/ bed / night</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={e => { e.stopPropagation(); router.push('/camps/cmu7f7c7q0001jf2bn12igi66'); }} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Details →</button>
                                                <button onClick={e => { e.stopPropagation(); const kalgaCamp = camps.find(c => c.id === 'cmu7f7c7q0001jf2bn12igi66'); if (kalgaCamp) { setSelectedPackageForBooking(kalgaCamp); setIsBookingModalOpen(true); } }} style={{ padding: '9px 16px', borderRadius: '10px', background: '#D5ED55', border: 'none', color: '#121613', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>Book Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* — Card 2: Kolukkumalai Teddy's (LIVE IN MUNNAR) — */}
                                <div
                                    onClick={() => router.push('/camps/pkg-kolukkumalai-teddy-domes')}
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(213,237,85,0.22)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {/* Image */}
                                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#0D1A10' }}>
                                        <img
                                            src="/images/teddy/teddy-dome-1.jpg"
                                            alt="Kolukkumalai Teddy's Campsite"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                                            loading="lazy"
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
                                        {/* Top badges */}
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            <span style={{ background: '#D5ED55', color: '#121613', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '999px' }}>Sky Deck &amp; Domes</span>
                                            <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>7,100 FT</span>
                                        </div>
                                        {/* Live dot bottom-right */}
                                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(22,101,52,0.9)', border: '1px solid #166534', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                            <span className="live-available-dot" />
                                            <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#FFFFFF' }}>Live Available</span>
                                        </div>
                                    </div>
                                    {/* Body */}
                                    <div style={{ padding: '18px 20px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4.5px',
                                                background: 'rgba(213,237,85,0.12)',
                                                border: '1px solid rgba(213,237,85,0.3)',
                                                color: '#D5ED55',
                                                fontSize: '10px',
                                                fontWeight: '900',
                                                padding: '3px 9px',
                                                borderRadius: '999px'
                                            }}>
                                                <span style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    background: '#D5ED55',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Check size={8} color="#121613" strokeWidth={3.5} />
                                                </span>
                                                by Aanandham.Stays
                                            </span>
                                            <span style={{ fontSize: '10.5px', color: '#6B8A72', fontWeight: '600' }}>Suryanelli / Kolukkumalai, Munnar</span>
                                        </div>
                                        <div style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>Kolukkumalai Teddy's Campsite — Sky Deck &amp; Kolukkumalai Sunrise</div>
                                        <div style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.5, marginBottom: '14px' }}>Sky deck &amp; geodesic dome sanctuary overlooking Suryanelli tea valleys with 4x4 sunrise safari to Kolukkumalai summit.</div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                            {['4x4 Sunrise Safari', 'Sky Deck & Domes', 'Campfire & BBQ', 'Sunset Ridge Trek'].map((f, i) => (
                                                <span key={i} style={{ fontSize: '10.5px', fontWeight: '700', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#D5ED55', padding: '3px 9px', borderRadius: '6px' }}>✓ {f}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '9.5px', fontWeight: '700', color: '#6B8A72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starts at</div>
                                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '900', color: '#D5ED55', lineHeight: 1 }}>₹2,299 <span style={{ fontSize: '11px', fontWeight: '600', color: '#A2B6A6' }}>/ camper</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={e => { e.stopPropagation(); router.push('/camps/pkg-kolukkumalai-teddy-domes'); }} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Details →</button>
                                                <button onClick={e => { e.stopPropagation(); const teddyCamp = camps.find(c => c.id === 'pkg-kolukkumalai-teddy-domes' || c.id?.includes('teddy')); if (teddyCamp) { setSelectedPackageForBooking(teddyCamp); setIsBookingModalOpen(true); } else { router.push('/camps/pkg-kolukkumalai-teddy-domes'); } }} style={{ padding: '9px 16px', borderRadius: '10px', background: '#D5ED55', border: 'none', color: '#121613', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>Book Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                {/* ── CAMPSITES LISTING GRID ── */}
                <section id="aanandham-stays-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)', scrollMarginTop: '90px' }}>
                    
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

                    {isLoading && camps.length === 0 ? (
                        <div style={{ padding: '12px 0 40px' }}>
                            <SkeletonCampGrid count={6} />
                        </div>
                    ) : filteredCamps.length === 0 ? (
                        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1px solid rgba(18,22,19,0.08)' }}>
                            <div style={{ fontSize: '42px', marginBottom: '14px', display: 'inline-flex' }}><Tent size={42} strokeWidth={1.6} /></div>
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
                                const typeMeta = resolvePropertyType(camp.propertyTypeSlug || camp.propertyType?.slug || camp.category, camp.title);
                                const pricingUnit = getPricingUnitLabel(camp);
                                // Detect Aanandham.Stays curated properties (The Nest Kalga & Kolukkumalai Teddy's)
                                const isAanandhamStays = (camp.region === 'Himachal') ||
                                    camp.id === 'cmu7f7c7q0001jf2bn12igi66' ||
                                    camp.id === 'pkg-kolukkumalai-teddy-domes' ||
                                    String(camp.location || '').toLowerCase().includes('himachal') ||
                                    String(camp.location || '').toLowerCase().includes('kasol') ||
                                    String(camp.location || '').toLowerCase().includes('kalga') ||
                                    String(camp.title || '').toLowerCase().includes('nest') ||
                                    String(camp.title || '').toLowerCase().includes('teddy');

                                return (
                                    <div
                                        key={camp.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => router.push(`/camps/${camp.id}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                router.push(`/camps/${camp.id}`);
                                            }
                                        }}
                                        className="hover-lift card-img-zoom camps-card"
                                        style={{
                                            background: '#FFFFFF',
                                            borderRadius: '28px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.03)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {/* Top Image & Media Header with Shimmer Skeleton */}
                                        <div className="camps-card-media" style={{ position: 'relative', height: '270px', overflow: 'hidden', background: '#0D1A10' }}>
                                            {camp.image || galleryList[0] ? (
                                                <AssetImage
                                                    src={camp.image || galleryList[0]}
                                                    alt={camp.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #162419 0%, #0A130C 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <Mountain size={44} color="#D5ED55" strokeWidth={1.5} style={{ opacity: 0.85 }} />
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#D5ED55', letterSpacing: '0.5px', textTransform: 'uppercase' }}>8,000 FT Alpine Sanctuary</span>
                                                    <span style={{ fontSize: '10px', color: '#6B8A72', fontWeight: '600' }}>Live Photos Being Verified</span>
                                                </div>
                                            )}
                                            
                                            {/* Gradient Overlay for Readability */}
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)', pointerEvents: 'none', zIndex: 2 }} />

                                            {/* Unified Top Header Row: Badges Left, Actions Right (Zero Overlap) */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '14px',
                                                left: '14px',
                                                right: '14px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: '8px',
                                                zIndex: 3,
                                                pointerEvents: 'none'
                                            }}>
                                                {/* Badges Left */}
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: 'calc(100% - 90px)', pointerEvents: 'auto' }}>
                                                    <span style={{
                                                        background: '#121613',
                                                        color: '#D5ED55',
                                                        fontSize: '11px',
                                                        fontWeight: '800',
                                                        padding: '4px 11px',
                                                        borderRadius: '999px',
                                                        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                                                        whiteSpace: 'nowrap',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <PropertyTypeIcon typeMeta={typeMeta} size={11} color="#D5ED55" />
                                                        <span>{camp.propertyType?.label || typeMeta.badge || typeMeta.label}</span>
                                                    </span>
                                                    {camp.altitude && (
                                                        <span style={{
                                                            background: '#E5A93B',
                                                            color: '#121613',
                                                            fontSize: '10.5px',
                                                            fontWeight: '800',
                                                            padding: '4px 10px',
                                                            borderRadius: '999px',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {camp.altitude}
                                                        </span>
                                                    )}
                                                    {camp.tag && (
                                                        <span style={{
                                                            background: 'rgba(255, 255, 255, 0.92)',
                                                            color: '#121613',
                                                            fontSize: '10px',
                                                            fontWeight: '800',
                                                            padding: '4px 9px',
                                                            borderRadius: '999px',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {camp.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Action Buttons Right: Like ❤️ & Share 🔗 */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, pointerEvents: 'auto' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleWishlist(camp.id, camp.title, e);
                                                        }}
                                                        aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            background: isLiked ? '#EF4444' : 'rgba(0, 0, 0, 0.55)',
                                                            border: '1px solid rgba(255, 255, 255, 0.25)',
                                                            color: '#FFFFFF',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            backdropFilter: 'blur(6px)',
                                                            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                                                            transition: 'transform 0.15s ease'
                                                        }}
                                                    >
                                                        <Heart size={15} fill={isLiked ? '#FFFFFF' : 'none'} color="#FFFFFF" strokeWidth={2.5} />
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShare(camp, e);
                                                        }}
                                                        aria-label="Share campsite link"
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '50%',
                                                            background: 'rgba(0, 0, 0, 0.55)',
                                                            border: '1px solid rgba(255, 255, 255, 0.25)',
                                                            color: '#FFFFFF',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            backdropFilter: 'blur(6px)',
                                                            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                                                            transition: 'transform 0.15s ease'
                                                        }}
                                                    >
                                                        <Share2 size={15} color="#FFFFFF" strokeWidth={2.2} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Unified Bottom Info Row: Photos Button Left, Rating Right */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '14px',
                                                right: '14px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '8px',
                                                zIndex: 3,
                                                pointerEvents: 'none'
                                            }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLightboxPhoto(camp.image);
                                                    }}
                                                    style={{
                                                        background: 'rgba(0, 0, 0, 0.58)',
                                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                                        color: '#FFFFFF',
                                                        padding: '5px 11px',
                                                        borderRadius: '999px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        backdropFilter: 'blur(6px)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        pointerEvents: 'auto'
                                                    }}
                                                >
                                                    <Camera size={13} color="#FFFFFF" />
                                                    <span>{galleryList.length} Photos</span>
                                                </button>

                                                <span style={{
                                                    fontSize: '11.5px',
                                                    fontWeight: '800',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    color: '#121613',
                                                    padding: '4px 10px',
                                                    borderRadius: '999px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    flexShrink: 0
                                                }}>
                                                    <Star size={12} fill="#E5A93B" color="#E5A93B" />
                                                    <span>{camp.rating || 4.98}</span>
                                                    <span style={{ opacity: 0.65, fontWeight: '600', fontSize: '10px' }}>({camp.reviewsCount || 342})</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body — Booking-Focused Details */}
                                        <div className="camps-card-body" style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            
                                            {/* Location & Live Availability Row */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                    <MapPin size={13} color="#166534" strokeWidth={2.5} />
                                                    <span>{camp.location || camp.region}</span>
                                                </span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '800', color: '#166534', background: '#DCFCE7', padding: '3px 9px', borderRadius: '999px' }}>
                                                        <span className="live-available-dot" />
                                                        <span>Live Available</span>
                                                    </span>
                                                    {isAanandhamStays ? (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4.5px',
                                                            background: 'linear-gradient(135deg, #0B1A0E 0%, #121E15 100%)',
                                                            color: '#D5ED55',
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            padding: '3px 9px',
                                                            borderRadius: '999px',
                                                            border: '1px solid rgba(213,237,85,0.35)',
                                                            letterSpacing: '0.2px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                        }}>
                                                            <span style={{
                                                                width: '12px',
                                                                height: '12px',
                                                                borderRadius: '50%',
                                                                background: '#D5ED55',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                <Check size={8} color="#121613" strokeWidth={3.5} />
                                                            </span>
                                                            by Aanandham.Stays
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4.5px',
                                                            background: '#121613',
                                                            color: '#D5ED55',
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            padding: '3px 9px',
                                                            borderRadius: '999px',
                                                            border: '1px solid rgba(213,237,85,0.25)',
                                                            letterSpacing: '0.2px',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                                                        }}>
                                                            <span style={{
                                                                width: '12px',
                                                                height: '12px',
                                                                borderRadius: '50%',
                                                                background: '#D5ED55',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                <Check size={8} color="#121613" strokeWidth={3.5} />
                                                            </span>
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Campsite Title */}
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', color: '#121613', margin: '0 0 6px', lineHeight: 1.35 }}>
                                                {camp.title}
                                            </h3>

                                            {/* Stay Accommodation Spec */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4B5563', fontWeight: '600', marginBottom: '10px' }}>
                                                <PropertyTypeIcon typeMeta={typeMeta} size={13} color="#166534" />
                                                <span>{camp.propertyType?.label || typeMeta.label} · {typeMeta.unitTerm}{camp.altitude ? ` · ${camp.altitude}` : ''} · {camp.duration || '1 Night Stay'}</span>
                                            </div>

                                            {/* Description snippet */}
                                            <p className="camps-card-desc" style={{ 
                                                fontSize: '13px', 
                                                color: '#59655D', 
                                                lineHeight: 1.5, 
                                                margin: '0 0 12px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {camp.description ? camp.description.slice(0, 125) + '...' : 'Verified sanctuary stay with panoramic views, curated culinary dining, and dedicated local host guidance.'}
                                            </p>

                                            {/* Included Highlights & Perks Chips */}
                                            {camp.highlights && (
                                                <div className="camps-card-highlights" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                                    {camp.highlights.slice(0, 3).map((h, hidx) => (
                                                        <span key={hidx} style={{ fontSize: '11px', fontWeight: '700', background: '#F1F3EC', color: '#121613', padding: '4px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                            <LucideAmenityIcon name={h} size={11} color="#166534" />
                                                            <span>{h}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Price & Book Now Action Footer */}
                                            <div style={{ borderTop: '1px solid rgba(18, 22, 19, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '8px' }}>
                                                <div>
                                                    <span style={{ fontSize: '10px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                                                        Starts at
                                                    </span>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                                                        {camp.price != null ? (
                                                            <>
                                                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '900', color: '#121613' }}>
                                                                    ₹{Number(camp.price).toLocaleString('en-IN')}
                                                                </span>
                                                                <span style={{ fontSize: '11px', color: '#59655D', fontWeight: '600' }}>
                                                                    {pricingUnit}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '800', color: '#121613' }}>
                                                                Contact for Rates
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {/* Details Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/camps/${camp.id}`);
                                                        }}
                                                        style={{
                                                            padding: '9px 16px',
                                                            minHeight: '44px',
                                                            borderRadius: '11px',
                                                            background: '#F1F3EC',
                                                            border: '1px solid rgba(18, 22, 19, 0.08)',
                                                            color: '#121613',
                                                            fontSize: '12.5px',
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '3px'
                                                        }}
                                                    >
                                                        <span>Details →</span>
                                                    </button>

                                                    {/* Direct Booking Modal Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPackageForBooking(camp);
                                                            setIsBookingModalOpen(true);
                                                        }}
                                                        className="btn-lime"
                                                        title="Direct Booking · Instant Confirmation"
                                                        style={{
                                                            padding: '9px 16px',
                                                            minHeight: '44px',
                                                            borderRadius: '11px',
                                                            fontSize: '12.5px',
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 4px 14px rgba(213, 237, 85, 0.35)'
                                                        }}
                                                    >
                                                        <span>Book</span>
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

                        <div className="accommodation-types-grid" data-lenis-prevent="true" data-lenis-prevent-wheel="true" data-lenis-prevent-touch="true">
                            {[
                                {
                                    title: 'Ridge Glamping Tents',
                                    badge: 'Couples & Privacy',
                                    img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Insulated high-altitude ridge glamping tents with private viewing deck, plush queen beds, and valley sunset vistas.',
                                    features: ['King / Queen Plush Bed', 'Panoramic Cloud Vista Window', 'Private Sit-Out Balcony', 'En-suite Washroom']
                                },
                                {
                                    title: 'Alpine Ridge Tents',
                                    badge: 'Trek & Adventure',
                                    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Dual-layered weatherproof Quechua tents with thermal sleeping bags and memory foam ground mattresses on elevated timber platforms.',
                                    features: ['2-Layer Weatherproof Shell', 'Thermal Cold-Weather Sleeping Bags', 'Elevated Timber Platform', 'Campfire Circle Access']
                                },
                                {
                                    title: 'Wooden A-Frame Cabins',
                                    badge: 'Family & Groups',
                                    img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
                                    desc: 'Rustic timber cabins nestled against mountain slopes with panoramic valley glass windows and private verandas.',
                                    features: ['Timber Balcony Deck', 'Queen Plush Bed', 'En-suite Restroom', '24/7 Hot Water Facility']
                                }
                            ].map((pod, pidx) => (
                                <div key={pidx} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '200px', position: 'relative' }}>
                                        <img src={pod.img} alt={pod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  loading="lazy" decoding="async"/>
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
                                            {(Array.isArray(pod.features) ? pod.features : (typeof pod.features === 'string' ? pod.features.split(',').map(s => s.trim()).filter(Boolean) : [])).map((feat, fidx) => (
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

            {/* ── OPTIONAL PAGE-SPECIFIC SEO GUIDE (renders before footer) ── */}
            {extraContent}

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
                            <img src={selectedLightboxPhoto} alt="Campsite Preview" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block', margin: '0 auto' }}  loading="lazy" decoding="async"/>
                            <button onClick={() => setSelectedLightboxPhoto(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── TOAST NOTIFICATION ── */}
            <AnimatePresence>
                {toastMessage && (
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
                            <span>{toastMessage}</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
