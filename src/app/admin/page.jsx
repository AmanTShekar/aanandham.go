"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const INITIAL_PROPERTIES = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Camp',
        category: 'Summit Trek',
        tag: 'Bestseller',
        location: 'Suryanelli / Kolukkumalai, Munnar',
        altitude: '7,900 FT',
        price: 2499,
        originalPrice: 3200,
        rating: 4.98,
        reviewsCount: 342,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Offroad',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        description: 'World’s highest organic tea estate sunrise ridge expedition with 4x4 rugged jeep convoys, starlit campfire barbecues, and misty mountain pod stays.',
        highlights: ['4x4 Rugged Jeep Safari', 'Tiger Rock Ridge Walk', 'Campfire Live BBQ', 'Dome Pod Stays', 'Tea Factory Tasting']
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Ridge Glamping & Tea Trail',
        category: 'Ridge Glamp',
        tag: 'Couples Favorite',
        location: 'Suryanelli, Idukki',
        altitude: '6,500 FT',
        price: 1999,
        originalPrice: 2600,
        rating: 4.95,
        reviewsCount: 286,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Ridge Walk',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        description: 'Private geodesic dome pods facing cascading green tea slopes and misty sunset valleys. Live acoustic sessions and farm-to-table Kerala dining.',
        highlights: ['Geodesic Dome Glamping', 'Private Valley Deck', 'Campfire Acoustic Jams', 'Sunset Ridge Walk', 'Hot Breakfast Included']
    },
    {
        id: 'pkg-phantom',
        title: 'Phantom Head Peak & Sunset Cloud Trek',
        category: 'Summit Trek',
        tag: 'Scenic Sunset',
        location: 'Munnar Ridge, Kerala',
        altitude: '6,800 FT',
        price: 1799,
        originalPrice: 2400,
        rating: 4.91,
        reviewsCount: 195,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Trek',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: '360-degree panoramic golden hour peak overlooking the Western Ghats mountain layers. Guided evening cliff walk and night stargazing.',
        highlights: ['360° Mountain Panorama', 'Golden Hour Sunset Peak', 'High-Altitude Tent Stay', 'Guided Marshals', 'Campfire Dinner']
    },
    {
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        category: 'Camp & Relax',
        tag: 'Relax & Chill',
        location: 'Pine Forest, Vagamon',
        altitude: '4,800 FT',
        price: 2199,
        originalPrice: 2900,
        rating: 4.92,
        reviewsCount: 184,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy / Friends',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
        description: 'Unwind in the misty pine groves of Vagamon. Perfect for acoustic campfire jams, off-road trails, starlit barbecues, and morning walks.',
        highlights: ['Pine Forest Glamping', 'Off-Road Jeep Trail', 'Vagamon Meadows Sunset', 'Open-Mic Campfire', 'Live BBQ Station']
    },
    {
        id: 'pkg-wayanad',
        title: 'Wayanad 900 Kandi Rainforest Tree Canopy',
        category: 'Water & Wild',
        tag: 'Rainforest Canopy',
        location: 'Meppadi, Wayanad',
        altitude: '3,200 FT',
        price: 2699,
        originalPrice: 3500,
        rating: 4.96,
        reviewsCount: 220,
        duration: '2 Days / 1 Night',
        difficulty: 'Jungle Trail',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        description: 'Glass bridge canopy walks, off-road 4x4 jeep safaris into deep evergreen jungle, natural rock-pool swimming, and treehouse canopy stays.',
        highlights: ['Glass Bridge Access', '4x4 Deep Forest Safari', 'Natural Stream Swims', 'Treehouse Glamp Villa', 'Tribal Dinner Feast']
    }
];

const INITIAL_BOOKINGS = [
    {
        id: 'BK-9482',
        name: 'Rahul Nair',
        phone: '+91 98470 12345',
        package: 'Kolukkumalai Sunrise 4x4 Expedition',
        dates: '2026-08-22 (Upcoming Sat)',
        guests: 4,
        addons: ['Live BBQ Platter', '4x4 Jeep Upgrade'],
        total: 10796,
        status: 'Confirmed', // 'Pending' | 'Confirmed' | 'Checked In' | 'Cancelled'
        createdAt: '14 Aug, 02:15 PM'
    },
    {
        id: 'BK-9483',
        name: 'Ananya Sharma',
        phone: '+91 98112 34567',
        package: 'Suryanelli Valley Ridge Glamping',
        dates: '2026-08-23 (Upcoming Sun)',
        guests: 2,
        addons: ['Live BBQ Platter'],
        total: 4898,
        status: 'Pending',
        createdAt: '14 Aug, 03:40 PM'
    },
    {
        id: 'BK-9484',
        name: 'Gautam Menon',
        phone: '+91 94471 98765',
        package: 'Vagamon Pine Valley & Acoustic Camp',
        dates: '2026-08-29',
        guests: 6,
        addons: ['4K Drone Mountain Reel', 'Acoustic Guitarist'],
        total: 15394,
        status: 'Pending',
        createdAt: '14 Aug, 04:10 PM'
    },
    {
        id: 'BK-9485',
        name: 'Dr. Priya Varma',
        phone: '+91 97450 67890',
        package: 'Kolukkumalai Sunrise 4x4 Expedition',
        dates: '2026-08-15 (Tomorrow)',
        guests: 2,
        addons: ['Sunrise Mountain Yoga'],
        total: 5498,
        status: 'Checked In',
        createdAt: '13 Aug, 08:30 PM'
    }
];

const INITIAL_MARQUEE = [
    '🔥 HIGH-ALTITUDE RIDGE PODS & EXPEDITIONS',
    '⚡ KOLUKKUMALAI 4X4 SUNRISE SUMMITS (7,900 FT)',
    '🏕️ VERIFIED WOMEN & SQUAD SAFE CAMPSITES',
    '✨ LIVE CAMPFIRE ACOUSTICS & MOUNTAIN BBQ',
    '☕ 100% ORGANIC SURYANELLI ESTATE WALKS',
    '🎉 MONSOON CLOUD BED TREK BATCH #42 OPEN'
];

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(false);

    // Active Tab
    const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'bookings' | 'content' | 'settings'

    // Data states (Persisted in LocalStorage)
    const [properties, setProperties] = useState(INITIAL_PROPERTIES);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [marqueeItems, setMarqueeItems] = useState(INITIAL_MARQUEE);
    const [newMarqueeText, setNewMarqueeText] = useState('');

    // Property Editing / Modal states
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [propertyForm, setPropertyForm] = useState({
        title: '',
        category: 'Summit Trek',
        tag: 'New Camp',
        location: 'Munnar, Kerala',
        altitude: '6,500 FT',
        price: 1999,
        originalPrice: 2800,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        description: '',
        highlights: '4x4 Safari, Campfire BBQ, Dome Pods, Mountain View'
    });

    // Surge pricing state
    const [surgeMultiplier, setSurgeMultiplier] = useState(0); // 0%, 10%, 15%, 20%
    const [adminPhone, setAdminPhone] = useState('+91 9400 987 654');
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('All');

    // Load from LocalStorage
    useEffect(() => {
        const savedAuth = localStorage.getItem('aanandham_admin_auth');
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
        }
        const savedProps = localStorage.getItem('aanandham_admin_properties');
        if (savedProps) {
            try { setProperties(JSON.parse(savedProps)); } catch(e){}
        }
        const savedBookings = localStorage.getItem('aanandham_admin_bookings');
        if (savedBookings) {
            try { setBookings(JSON.parse(savedBookings)); } catch(e){}
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === '2026' || passcode.toLowerCase() === 'aanandham' || passcode.toLowerCase() === 'admin') {
            setIsAuthenticated(true);
            setPasscodeError(false);
            localStorage.setItem('aanandham_admin_auth', 'true');
        } else {
            setPasscodeError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('aanandham_admin_auth');
    };

    // Save helpers
    const saveProperties = (updated) => {
        setProperties(updated);
        localStorage.setItem('aanandham_admin_properties', JSON.stringify(updated));
    };

    const saveBookings = (updated) => {
        setBookings(updated);
        localStorage.setItem('aanandham_admin_bookings', JSON.stringify(updated));
    };

    // Quick price adjustment (+/- ₹100)
    const handleAdjustPrice = (id, delta) => {
        const updated = properties.map(p => {
            if (p.id === id) {
                const newPrice = Math.max(500, p.price + delta);
                return { ...p, price: newPrice };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Toggle property availability
    const handleToggleAvailability = (id) => {
        const updated = properties.map(p => {
            if (p.id === id) {
                return { ...p, isAvailable: !p.isAvailable };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Delete property
    const handleDeleteProperty = (id) => {
        if (window.confirm('Are you sure you want to delete this property listing?')) {
            const updated = properties.filter(p => p.id !== id);
            saveProperties(updated);
        }
    };

    // Open Property Modal for Create / Edit
    const handleOpenPropertyModal = (prop = null) => {
        if (prop) {
            setEditingProperty(prop);
            setPropertyForm({
                title: prop.title,
                category: prop.category,
                tag: prop.tag,
                location: prop.location,
                altitude: prop.altitude,
                price: prop.price,
                originalPrice: prop.originalPrice,
                duration: prop.duration,
                difficulty: prop.difficulty,
                image: prop.image,
                description: prop.description,
                highlights: prop.highlights ? prop.highlights.join(', ') : ''
            });
        } else {
            setEditingProperty(null);
            setPropertyForm({
                title: '',
                category: 'Summit Trek',
                tag: 'New Camp',
                location: 'Munnar, Kerala',
                altitude: '6,500 FT',
                price: 1999,
                originalPrice: 2800,
                duration: '2 Days / 1 Night',
                difficulty: 'Moderate',
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
                description: '',
                highlights: '4x4 Safari, Campfire BBQ, Dome Pods, Mountain View'
            });
        }
        setIsPropertyModalOpen(true);
    };

    // Save Property Form
    const handleSavePropertyForm = (e) => {
        e.preventDefault();
        const highlightsArr = propertyForm.highlights.split(',').map(s => s.trim()).filter(Boolean);
        
        if (editingProperty) {
            const updated = properties.map(p => {
                if (p.id === editingProperty.id) {
                    return {
                        ...p,
                        ...propertyForm,
                        price: Number(propertyForm.price),
                        originalPrice: Number(propertyForm.originalPrice),
                        highlights: highlightsArr
                    };
                }
                return p;
            });
            saveProperties(updated);
        } else {
            const newProp = {
                id: `pkg-${Date.now()}`,
                ...propertyForm,
                price: Number(propertyForm.price),
                originalPrice: Number(propertyForm.originalPrice),
                rating: 5.0,
                reviewsCount: 1,
                isAvailable: true,
                highlights: highlightsArr
            };
            saveProperties([...properties, newProp]);
        }
        setIsPropertyModalOpen(false);
    };

    // Update Booking Status
    const handleUpdateBookingStatus = (id, newStatus) => {
        const updated = bookings.map(b => {
            if (b.id === id) {
                return { ...b, status: newStatus };
            }
            return b;
        });
        saveBookings(updated);
    };

    // Delete Booking
    const handleDeleteBooking = (id) => {
        if (window.confirm('Delete this reservation inquiry record?')) {
            const updated = bookings.filter(b => b.id !== id);
            saveBookings(updated);
        }
    };

    // Add Marquee Item
    const handleAddMarquee = (e) => {
        e.preventDefault();
        if (!newMarqueeText.trim()) return;
        setMarqueeItems([...marqueeItems, newMarqueeText.trim()]);
        setNewMarqueeText('');
    };

    // Remove Marquee Item
    const handleRemoveMarquee = (idx) => {
        setMarqueeItems(marqueeItems.filter((_, i) => i !== idx));
    };

    // Export Bookings to CSV
    const handleExportCSV = () => {
        const headers = ['Booking ID,Customer Name,Phone,Package,Dates,Guests,Addons,Est Total (INR),Status,Created At\n'];
        const rows = bookings.map(b => 
            `"${b.id}","${b.name}","${b.phone}","${b.package}","${b.dates}",${b.guests},"${b.addons ? b.addons.join(' + ') : ''}",${b.total},"${b.status}","${b.createdAt}"`
        );
        const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Aanandham_Bookings_${new Date().toISOString().slice(0,10)}.csv`);
        link.click();
    };

    // Filter Bookings
    const filteredBookings = bookings.filter(b => {
        const matchSearch = b.name.toLowerCase().includes(bookingSearch.toLowerCase()) || b.phone.includes(bookingSearch) || b.package.toLowerCase().includes(bookingSearch.toLowerCase());
        const matchStatus = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
        return matchSearch && matchStatus;
    });

    // KPI Metrics
    const totalRevenue = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').reduce((acc, b) => acc + b.total, 0);
    const activeCampers = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').reduce((acc, b) => acc + b.guests, 0);

    // ── PIN AUTHENTICATION GATE ──
    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#08120A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{
                        background: '#101E13',
                        border: '1px solid rgba(213, 237, 85, 0.25)',
                        borderRadius: '32px',
                        padding: '44px 36px',
                        maxWidth: '440px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(213, 237, 85, 0.1)', color: '#D5ED55', fontSize: '24px', marginBottom: '20px' }}>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="live-beacon"></span>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#D5ED55', textTransform: 'uppercase' }}>
                            AANANDHAM.GO PROPERTY ENGINE
                        </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: '0 0 8px', color: '#FFFFFF' }}>
                        Admin Portal Access
                    </h2>
                    <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.5, marginBottom: '28px' }}>
                        Enter your master coordinator PIN to manage campsite inventory, pricing, and live bookings.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                            type="password"
                            placeholder="Enter 4-digit PIN (e.g. 2026)"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '15px 20px',
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: passcodeError ? '2px solid #FF5A5F' : '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#FFFFFF',
                                fontSize: '16px',
                                textAlign: 'center',
                                letterSpacing: '4px',
                                outline: 'none'
                            }}
                        />

                        {passcodeError && (
                            <div style={{ fontSize: '12.5px', color: '#FF5A5F', fontWeight: '600' }}>
                                Invalid PIN code. (Default: 2026)
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-lime"
                            style={{ padding: '15px', fontSize: '15px', fontWeight: '800', width: '100%', cursor: 'pointer' }}
                        >
                            Unlock Dashboard ↗
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <Link href="/" style={{ color: '#A2B6A6', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            ← Return to Public Website
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── MAIN ADMIN DASHBOARD ──
    return (
        <div style={{ minHeight: '100vh', background: '#08120A', color: '#FFFFFF', paddingBottom: '80px' }}>
            
            {/* Top Navigation Bar */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(14, 24, 17, 0.96)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px 28px'
            }}>
                <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Aanandham.go Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }} />
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>
                                Aanandham<span style={{ color: '#D5ED55' }}>.go</span>
                            </span>
                        </Link>
                        <span style={{ background: 'rgba(213, 237, 85, 0.15)', color: '#D5ED55', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.8px' }}>
                            PROPERTY & BOOKINGS ENGINE
                        </span>
                    </div>

                    {/* Right Quick Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/" target="_blank" style={{ color: '#A2B6A6', textDecoration: 'none', fontSize: '13px', fontWeight: '700', padding: '8px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                            View Live Site ↗
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'rgba(255, 90, 95, 0.15)', color: '#FF5A5F', border: '1px solid rgba(255, 90, 95, 0.3)', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Lock & Exit
                        </button>
                    </div>

                </div>
            </header>

            <main style={{ maxWidth: '1360px', margin: '32px auto 0', padding: '0 24px' }}>
                
                {/* ── KPI METRICS CARDS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '32px' }}>
                    <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                            Confirmed Pipeline (Aug)
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#D5ED55' }}>
                            ₹{totalRevenue.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8E9B92', marginTop: '6px' }}>
                            Across {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length} active expeditions
                        </div>
                    </div>

                    <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                            Campers on Peak (This Weekend)
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                            {activeCampers} <span style={{ fontSize: '18px', color: '#A2B6A6', fontWeight: '600' }}>Explorers</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#D5ED55', marginTop: '6px' }}>
                            ⛺ Suryanelli + Kolukkumalai Pods
                        </div>
                    </div>

                    <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                            Active Campsite Listings
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                            {properties.filter(p => p.isAvailable).length} / {properties.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#A2B6A6', marginTop: '6px' }}>
                            {properties.filter(p => !p.isAvailable).length} Marked Sold Out
                        </div>
                    </div>

                    <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                            Pending Inquiries
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFB800' }}>
                            {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '16px', color: '#A2B6A6' }}>Leads</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#FFB800', marginTop: '6px' }}>
                            ⚡ 1-Tap WhatsApp reply ready
                        </div>
                    </div>
                </div>

                {/* ── NAVIGATION TABS ── */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingBottom: '16px',
                    marginBottom: '32px',
                    overflowX: 'auto'
                }}>
                    {[
                        { id: 'properties', name: '⛺ Campsites & Listings', count: properties.length },
                        { id: 'bookings', name: '📋 Bookings & Inquiries', count: bookings.length },
                        { id: 'content', name: '✍️ CMS & Announcements' },
                        { id: 'settings', name: '⚡ Pricing & Surge Engine' }
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '999px',
                                    border: isActive ? '1px solid #D5ED55' : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: isActive ? '#D5ED55' : 'rgba(255, 255, 255, 0.04)',
                                    color: isActive ? '#121613' : '#FFFFFF',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{tab.name}</span>
                                {tab.count !== undefined && (
                                    <span style={{
                                        background: isActive ? '#121613' : 'rgba(255,255,255,0.15)',
                                        color: isActive ? '#D5ED55' : '#FFFFFF',
                                        fontSize: '11px',
                                        padding: '2px 8px',
                                        borderRadius: '999px'
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: PROPERTY & LISTINGS MANAGEMENT
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'properties' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: 0 }}>
                                    Campsite & Stays Inventory
                                </h3>
                                <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                    Add new camps, adjust base rates (₹), toggle sold out status, and edit itinerary perks.
                                </p>
                            </div>
                            <button
                                onClick={() => handleOpenPropertyModal()}
                                className="btn-lime"
                                style={{ padding: '12px 26px', fontSize: '14px', fontWeight: '800', gap: '8px' }}
                            >
                                <span>+ Add New Campsite Listing</span>
                            </button>
                        </div>

                        {/* Properties Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {properties.map(prop => (
                                <div
                                    key={prop.id}
                                    style={{
                                        background: '#101E13',
                                        border: prop.isAvailable ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 90, 95, 0.4)',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '180px' }}>
                                        <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            background: prop.isAvailable ? '#D5ED55' : '#FF5A5F',
                                            color: prop.isAvailable ? '#121613' : '#FFFFFF',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            padding: '4px 10px',
                                            borderRadius: '999px'
                                        }}>
                                            {prop.isAvailable ? 'Available' : 'SOLD OUT'}
                                        </span>
                                        <span style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'rgba(0,0,0,0.65)',
                                            color: '#FFFFFF',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            padding: '4px 10px',
                                            borderRadius: '999px'
                                        }}>
                                            {prop.altitude}
                                        </span>
                                    </div>

                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#A2B6A6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                                            {prop.location}
                                        </div>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.3 }}>
                                            {prop.title}
                                        </h4>

                                        {/* Price & Adjuster Controls */}
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.04)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            padding: '12px 16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '16px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Base Rate (Per Camper)</div>
                                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#D5ED55' }}>
                                                    ₹{prop.price.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    onClick={() => handleAdjustPrice(prop.id, -100)}
                                                    title="Decrease price by ₹100"
                                                    style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                                                >-₹100</button>
                                                <button
                                                    onClick={() => handleAdjustPrice(prop.id, 100)}
                                                    title="Increase price by ₹100"
                                                    style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                                                >+₹100</button>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleToggleAvailability(prop.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '12px',
                                                    background: prop.isAvailable ? 'rgba(255, 90, 95, 0.15)' : 'rgba(213, 237, 85, 0.15)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    color: prop.isAvailable ? '#FF5A5F' : '#D5ED55',
                                                    fontSize: '12px',
                                                    fontWeight: '800',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {prop.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button
                                                onClick={() => handleOpenPropertyModal(prop)}
                                                style={{
                                                    padding: '10px 14px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255, 255, 255, 0.08)',
                                                    border: 'none',
                                                    color: '#FFFFFF',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProperty(prop.id)}
                                                style={{
                                                    padding: '10px 14px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255, 90, 95, 0.1)',
                                                    border: 'none',
                                                    color: '#FF5A5F',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: BOOKINGS & INQUIRIES LEADS MANAGER
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'bookings' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: 0 }}>
                                    Reservation Inquiries & Leads
                                </h3>
                                <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                    Direct WhatsApp connection and status management for arriving campers.
                                </p>
                            </div>
                            <button
                                onClick={handleExportCSV}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <i className="fa-solid fa-download"></i>
                                <span>Export to Excel (CSV)</span>
                            </button>
                        </div>

                        {/* Search & Filter Bar */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Search by customer name, phone, or package..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: '240px',
                                    padding: '12px 18px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#FFFFFF',
                                    fontSize: '13.5px',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['All', 'Pending', 'Confirmed', 'Checked In', 'Cancelled'].map(st => (
                                    <button
                                        key={st}
                                        onClick={() => setBookingFilterStatus(st)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '999px',
                                            border: bookingFilterStatus === st ? '1px solid #D5ED55' : '1px solid rgba(255,255,255,0.08)',
                                            background: bookingFilterStatus === st ? 'rgba(213, 237, 85, 0.15)' : 'transparent',
                                            color: bookingFilterStatus === st ? '#D5ED55' : '#A2B6A6',
                                            fontSize: '12.5px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bookings List Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {filteredBookings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#101E13', borderRadius: '24px', color: '#A2B6A6' }}>
                                    No reservation inquiries matching your search.
                                </div>
                            ) : (
                                filteredBookings.map(b => (
                                    <div
                                        key={b.id}
                                        style={{
                                            background: '#101E13',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '20px',
                                            padding: '20px 24px',
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '16px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#D5ED55' }}>{b.id}</span>
                                                <span style={{ fontSize: '11px', color: '#8E9B92' }}>{b.createdAt}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>{b.name}</div>
                                            <div style={{ fontSize: '13px', color: '#A2B6A6' }}>{b.phone}</div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FFFFFF' }}>{b.package}</div>
                                            <div style={{ fontSize: '12px', color: '#A2B6A6' }}>{b.dates} · {b.guests} Guests</div>
                                            {b.addons && b.addons.length > 0 && (
                                                <div style={{ fontSize: '11.5px', color: '#D5ED55', marginTop: '2px' }}>
                                                    + {b.addons.join(', ')}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '11px', color: '#8E9B92' }}>Est. Total</div>
                                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#D5ED55' }}>
                                                ₹{b.total.toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        {/* Status selector */}
                                        <div>
                                            <label style={{ fontSize: '10.5px', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>Status</label>
                                            <select
                                                value={b.status}
                                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '12px',
                                                    background: b.status === 'Confirmed' ? '#D5ED55' : b.status === 'Checked In' ? '#0070F3' : b.status === 'Cancelled' ? '#FF5A5F' : '#FFB800',
                                                    color: b.status === 'Confirmed' ? '#121613' : '#FFFFFF',
                                                    fontWeight: '800',
                                                    fontSize: '12px',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Pending" style={{ background: '#101E13', color: '#FFFFFF' }}>Pending 🟡</option>
                                                <option value="Confirmed" style={{ background: '#101E13', color: '#FFFFFF' }}>Confirmed 🟢</option>
                                                <option value="Checked In" style={{ background: '#101E13', color: '#FFFFFF' }}>Checked In 🔵</option>
                                                <option value="Cancelled" style={{ background: '#101E13', color: '#FFFFFF' }}>Cancelled 🔴</option>
                                            </select>
                                        </div>

                                        {/* 1-Tap Mobile Actions */}
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <a
                                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.name}! Aanandham.go Pathfinder Desk here regarding your booking (${b.id}) for ${b.package} on ${b.dates}.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-lime"
                                                style={{ padding: '8px 14px', fontSize: '12px', gap: '6px' }}
                                            >
                                                <i className="fa-brands fa-whatsapp"></i> Chat
                                            </a>
                                            <a
                                                href={`tel:${b.phone}`}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '999px',
                                                    background: 'rgba(255,255,255,0.08)',
                                                    color: '#FFFFFF',
                                                    textDecoration: 'none',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                            <button
                                                onClick={() => handleDeleteBooking(b.id)}
                                                style={{ background: 'none', border: 'none', color: '#FF5A5F', cursor: 'pointer', padding: '8px' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 3: CONTENT & ANNOUNCEMENTS CMS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'content' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 6px' }}>
                                Live Announcement Marquee Ticker
                            </h3>
                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: 0 }}>
                                Edit ticker announcements displayed below the homepage hero section in real-time.
                            </p>
                        </div>

                        {/* Add Announcement input */}
                        <form onSubmit={handleAddMarquee} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                            <input
                                type="text"
                                placeholder="e.g. 🎉 NEW METEOR SHOWER CAMP ON AUG 24-25 OPEN!"
                                value={newMarqueeText}
                                onChange={(e) => setNewMarqueeText(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '12px 18px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#FFFFFF',
                                    fontSize: '13.5px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn-lime"
                                style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' }}
                            >
                                + Add Ticker Item
                            </button>
                        </form>

                        {/* Active Marquee list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {marqueeItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: '#101E13',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '14px',
                                        padding: '14px 18px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span style={{ fontSize: '13.5px', color: '#FFFFFF', fontWeight: '600' }}>{item}</span>
                                    <button
                                        onClick={() => handleRemoveMarquee(idx)}
                                        style={{ background: 'none', border: 'none', color: '#FF5A5F', fontSize: '16px', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: SETTINGS & SURGE ENGINE
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '720px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 6px' }}>
                                Dynamic Pricing & Weekend Surge
                            </h3>
                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: 0 }}>
                                Automatically apply surge multiplier for peak monsoon weekends and festival batches.
                            </p>
                        </div>

                        <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px', marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#D5ED55', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                WEEKEND SURGE MULTIPLIER
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                {[
                                    { val: 0, label: '0% Normal' },
                                    { val: 10, label: '+10% Surge' },
                                    { val: 15, label: '+15% Peak' },
                                    { val: 20, label: '+20% Holiday' }
                                ].map(s => (
                                    <button
                                        key={s.val}
                                        onClick={() => setSurgeMultiplier(s.val)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '14px',
                                            border: surgeMultiplier === s.val ? '2px solid #D5ED55' : '1px solid rgba(255,255,255,0.1)',
                                            background: surgeMultiplier === s.val ? 'rgba(213, 237, 85, 0.15)' : 'rgba(255,255,255,0.04)',
                                            color: surgeMultiplier === s.val ? '#D5ED55' : '#FFFFFF',
                                            fontWeight: '800',
                                            fontSize: '13px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#A2B6A6' }}>
                                Currently: {surgeMultiplier === 0 ? 'Standard base rates active' : `All weekend camp dates calculate with +${surgeMultiplier}% dynamic surge`}
                            </div>
                        </div>

                        <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#D5ED55', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                OFFICIAL ADMIN WHATSAPP & TELEGRAM ALERT CHANNEL
                            </label>
                            <input
                                type="text"
                                value={adminPhone}
                                onChange={(e) => setAdminPhone(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '13px 18px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#FFFFFF',
                                    fontSize: '14px',
                                    outline: 'none',
                                    marginBottom: '10px'
                                }}
                            />
                            <div style={{ fontSize: '12px', color: '#8E9B92' }}>
                                Instant reservation alerts are dispatched directly to this WhatsApp number upon customer confirmation.
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ── PROPERTY CREATION / EDIT MODAL ── */}
            <AnimatePresence>
                {isPropertyModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95 }}
                            style={{
                                background: '#101E13',
                                border: '1px solid rgba(213, 237, 85, 0.3)',
                                borderRadius: '32px',
                                padding: '36px',
                                maxWidth: '680px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                color: '#FFFFFF',
                                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {editingProperty ? 'Edit Campsite Listing' : 'Add New Campsite Listing'}
                                </h3>
                                <button
                                    onClick={() => setIsPropertyModalOpen(false)}
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSavePropertyForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                        Campsite Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Kolukkumalai Sunrise 4x4 Expedition"
                                        value={propertyForm.title}
                                        onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                            Category
                                        </label>
                                        <select
                                            value={propertyForm.category}
                                            onChange={e => setPropertyForm({ ...propertyForm, category: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: '#08120A', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13.5px' }}
                                        >
                                            <option value="Summit Trek">Summit Trek</option>
                                            <option value="Ridge Glamp">Ridge Glamp</option>
                                            <option value="Camp & Relax">Camp & Relax</option>
                                            <option value="Water & Wild">Water & Wild</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                            Altitude Tag
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 7,900 FT"
                                            value={propertyForm.altitude}
                                            onChange={e => setPropertyForm({ ...propertyForm, altitude: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                            Price (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={propertyForm.price}
                                            onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                            Original / Strikethrough Price (INR)
                                        </label>
                                        <input
                                            type="number"
                                            value={propertyForm.originalPrice}
                                            onChange={e => setPropertyForm({ ...propertyForm, originalPrice: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                        Cover Photo Image URL
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={propertyForm.image}
                                        onChange={e => setPropertyForm({ ...propertyForm, image: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                        Highlights & Perks (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyForm.highlights}
                                        onChange={e => setPropertyForm({ ...propertyForm, highlights: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#D5ED55', display: 'block', marginBottom: '6px' }}>
                                        Description & Itinerary Highlights
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={propertyForm.description}
                                        onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px', resize: 'vertical' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-lime"
                                    style={{ padding: '15px', fontSize: '15px', fontWeight: '800', marginTop: '10px' }}
                                >
                                    {editingProperty ? 'Save Changes ↗' : 'Publish Campsite Listing ↗'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
