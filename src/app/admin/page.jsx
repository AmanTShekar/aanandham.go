"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { inr } from '../../lib/utils';
import { waLink } from '../../lib/whatsapp';

// ── REGIONAL PROPERTIES INVENTORY ──
const INITIAL_PROPERTIES = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        region: 'Munnar',
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
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        description: 'World’s highest organic tea estate sunrise ridge expedition with 4x4 rugged jeep convoys, starlit campfire barbecues, and misty mountain pod stays.',
        highlights: ['4x4 Rugged Jeep Safari', 'Tiger Rock Ridge Walk', 'Campfire Live BBQ', 'Dome Pod Stays', 'Tea Factory Tasting'],
        rooms: [
            { id: 'r1', name: 'Geodesic Luxury Dome Pod', capacity: '2 Adults', price: 2499, totalUnits: 8, bookedUnits: 4, isAvailable: true, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: ['Valley Facing Deck', 'King Size Bed', 'En-suite Restroom', 'Thermal Blankets'] },
            { id: 'r2', name: 'Weatherproof Alpine 4-Person Tent', capacity: '4 Campers', price: 1799, totalUnits: 14, bookedUnits: 6, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Waterproof Flysheet', 'Foam Mattress & Sleeping Bag', 'Camping Lantern', 'Shared Modern Washrooms'] },
            { id: 'r3', name: 'Private Cliffside Wooden Cottage', capacity: '3 Campers', price: 3499, totalUnits: 3, bookedUnits: 1, isAvailable: true, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', features: ['Panoramic Glass Window', 'Hot Shower Geyser', 'Private Fire Pit', 'Attendant on Call'] }
        ],
        amenities: [
            { id: 'am-1', name: 'Campfire Circle & Acoustic Jams', icon: '🔥', enabled: true },
            { id: 'am-2', name: '4x4 Offroad Trail Access', icon: '🚙', enabled: true },
            { id: 'am-3', name: 'Western Washrooms & Running Water', icon: '🚿', enabled: true },
            { id: 'am-4', name: 'Power Backup & Charging Stations', icon: '⚡', enabled: true }
        ],
        addons: [
            { id: 'ad-1', name: 'Live Campfire BBQ Platter (Chicken / Paneer)', price: 450, enabled: true },
            { id: 'ad-2', name: 'Private 4x4 Jeep Safari Upgrade', price: 1200, enabled: true }
        ]
    },
    {
        id: 'pkg-meesapulimala',
        title: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        region: 'Munnar',
        category: 'Summit Trek',
        tag: 'High Peak',
        location: 'Silent Valley, Munnar',
        altitude: '8,661 FT',
        price: 3199,
        originalPrice: 4200,
        rating: 4.99,
        reviewsCount: 264,
        duration: '2 Days / 1 Night',
        difficulty: 'Strenuous High Peak',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        description: 'South India’s 2nd highest peak expedition. Trek through 8 rolling high-altitude hills and endless rhododendron valleys.',
        highlights: ['8-Peak Ridge Crossing', 'High Altitude Basecamp Pods', 'Certified Wilderness Marshals', 'Campfire Acoustic Night'],
        rooms: [
            { id: 'r4', name: 'Summit Expedition Weatherproof Tent', capacity: '2 Campers', price: 3199, totalUnits: 12, bookedUnits: 5, isAvailable: true, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', features: ['Double Layer Windproof Fly', 'Thermal Sleeping Bags', 'Ridge Edge Pitch'] }
        ],
        amenities: [
            { id: 'am-10', name: 'Forest Permit & Entry Passes', icon: '🎫', enabled: true },
            { id: 'am-11', name: 'Wilderness Guide Marshals', icon: '🧭', enabled: true }
        ],
        addons: [
            { id: 'ad-5', name: 'Trekking Pole & Thermal Kit', price: 350, enabled: true }
        ]
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Ridge Geodesic Glamping',
        region: 'Suryanelli',
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
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        description: 'Private geodesic dome pods facing cascading green tea slopes and misty sunset valleys.',
        highlights: ['Geodesic Dome Glamping', 'Private Valley Deck', 'Campfire Acoustic Jams'],
        rooms: [
            { id: 'r6', name: 'Valley View Geodesic Dome', capacity: '2 Adults', price: 2199, totalUnits: 10, bookedUnits: 4, isAvailable: true, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: ['Private Valley Deck', 'Plush Bedding'] }
        ],
        amenities: [
            { id: 'am-20', name: 'Private Valley Deck', icon: '🌄', enabled: true }
        ],
        addons: [
            { id: 'ad-7', name: 'Acoustic Guitarist for Evening', price: 2000, enabled: true }
        ]
    },
    {
        id: 'pkg-wayanad',
        title: 'Chembra Peak & Heart Lake Cloud Trail',
        region: 'Wayanad',
        category: 'Summit Trek',
        tag: 'Iconic Lake',
        location: 'Meppadi, Wayanad',
        altitude: '6,890 FT',
        price: 2199,
        originalPrice: 2800,
        rating: 4.97,
        reviewsCount: 312,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Summit',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        description: 'Trek past the legendary natural heart-shaped mountain lake nestled at 5,000 FT with lush tea garden glamping.',
        highlights: ['Heart-Shaped Lake Trek', 'Bamboo Forest Walk', 'Plantation Glamping'],
        rooms: [
            { id: 'r9', name: 'Tea Plantation Alpine Cottage', capacity: '2 Adults', price: 2499, totalUnits: 6, bookedUnits: 2, isAvailable: true, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', features: ['Balcony Tea View'] }
        ],
        amenities: [
            { id: 'am-40', name: 'Forest Trek Permits', icon: '🎫', enabled: true }
        ],
        addons: [
            { id: 'ad-10', name: 'Zip-line & Bamboo Rafting Pass', price: 650, enabled: true }
        ]
    }
];

// ── SCHEDULED EXPEDITION BATCHES ──
const INITIAL_EVENTS = [
    {
        id: 'ev-1',
        title: 'Kolukkumalai Sunrise 4x4 & Stargazing Batch',
        dates: 'Aug 22 – 23, 2026',
        campsite: 'Kolukkumalai Sunrise Ridge, Munnar',
        price: 2499,
        capacity: 30,
        booked: 18,
        spotsLeft: 12,
        badge: 'Bestseller ⭐',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        description: 'Guided 4x4 convoy, high-altitude tiger rock hike, campfire live BBQ, and midnight stargazing.'
    },
    {
        id: 'ev-2',
        title: 'Meesapulimala 8-Peak Summit Expedition',
        dates: 'Aug 29 – 30, 2026',
        campsite: 'Silent Valley Basecamp, Munnar',
        price: 3199,
        capacity: 20,
        booked: 14,
        spotsLeft: 6,
        badge: 'High Altitude 🏔️',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: 'South India’s 2nd highest peak summit trek with forest permits, certified mountain guides, and tent glamping.'
    }
];

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(false);

    // Active Navigation Tab ('overview' | 'bookings' | 'properties' | 'events' | 'financials' | 'settings')
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Dedicated Full-Page Property Details View State
    const [activePropertyDetailId, setActivePropertyDetailId] = useState(null);

    // Dynamic Data States (Persisted in LocalStorage)
    const [properties, setProperties] = useState(INITIAL_PROPERTIES);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [bookings, setBookings] = useState([]);

    // Filter by Region
    const [propertyFilterRegion, setPropertyFilterRegion] = useState('All');

    // Create / Edit Property Modal State
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [propertyForm, setPropertyForm] = useState({
        title: '',
        region: 'Munnar',
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

    // Create Room Modal State
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [roomForm, setRoomForm] = useState({
        name: '',
        capacity: '2 Adults',
        price: 2499,
        totalUnits: 8,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        features: 'Private Deck, King Bed, Mountain View'
    });

    // Create Event Modal State
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: '',
        region: 'Munnar',
        campsite: 'Kolukkumalai Sunrise Ridge',
        dates: 'Sep 12 – 13, 2026',
        price: 2499,
        capacity: 30,
        booked: 0,
        badge: 'New Batch 🌿',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        description: 'Guided wilderness expedition with campfire barbecue and sunrise ridge trek.'
    });

    // Manual Booking Creator Modal State
    const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
    const [newBookingForm, setNewBookingForm] = useState({
        name: '',
        phone: '',
        email: '',
        package: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        region: 'Munnar',
        dates: '',
        guests: 2,
        roomType: 'Geodesic Luxury Dome Pod',
        pricePerGuest: 2499,
        status: 'Confirmed'
    });

    // Booking Search & Filter
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('All');

    // Admin Notification Settings
    const [adminPhone, setAdminPhone] = useState('+91 9400 987 654');
    const [adminTelegram, setAdminTelegram] = useState('@aanandham_concierge_bot');
    const [settingsSavedToast, setSettingsSavedToast] = useState(false);

    // Toast message state
    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Load from LocalStorage
    const reloadDataFromStorage = () => {
        const savedPhone = localStorage.getItem('aanandham_admin_phone');
        if (savedPhone) setAdminPhone(savedPhone);
        const savedTelegram = localStorage.getItem('aanandham_admin_telegram');
        if (savedTelegram) setAdminTelegram(savedTelegram);

        const savedProps = localStorage.getItem('aanandham_admin_properties_v2');
        if (savedProps) {
            try { setProperties(JSON.parse(savedProps)); } catch(e){}
        }
        const savedEvents = localStorage.getItem('aanandham_admin_events');
        if (savedEvents) {
            try { setEvents(JSON.parse(savedEvents)); } catch(e){}
        }
        const savedBookings = localStorage.getItem('aanandham_admin_bookings_v2');
        if (savedBookings) {
            try { setBookings(JSON.parse(savedBookings)); } catch(e){}
        } else {
            setBookings([]);
        }
    };

    useEffect(() => {
        const restoreSession = async () => {
            const savedAuth = localStorage.getItem('aanandham_admin_auth');
            if (savedAuth) {
                try {
                    const res = await fetch('/api/admin/auth', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${savedAuth}` }
                    });
                    const data = await res.json();
                    if (data.authenticated) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('aanandham_admin_auth');
                        setIsAuthenticated(false);
                    }
                } catch {
                    setIsAuthenticated(false);
                }
            }
        };

        restoreSession();
        reloadDataFromStorage();

        // Listen for live public booking events
        const handleStorageUpdate = () => {
            reloadDataFromStorage();
        };

        window.addEventListener('storage', handleStorageUpdate);
        return () => window.removeEventListener('storage', handleStorageUpdate);
    }, []);

    const handleSaveNotifications = (e) => {
        e.preventDefault();
        localStorage.setItem('aanandham_admin_phone', adminPhone);
        localStorage.setItem('aanandham_admin_telegram', adminTelegram);
        setSettingsSavedToast(true);
        setTimeout(() => setSettingsSavedToast(false), 3000);
        showToast('✓ Notification coordinates saved');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode: passcode.trim() })
            });
            const data = await res.json();
            if (data.success && data.token) {
                setIsAuthenticated(true);
                setPasscodeError(false);
                localStorage.setItem('aanandham_admin_auth', data.token);
            } else {
                setPasscodeError(true);
            }
        } catch (err) {
            setPasscodeError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('aanandham_admin_auth');
    };

    // Save Helpers
    const saveProperties = (updated) => {
        setProperties(updated);
        localStorage.setItem('aanandham_admin_properties_v2', JSON.stringify(updated));
    };

    const saveEvents = (updated) => {
        setEvents(updated);
        localStorage.setItem('aanandham_admin_events', JSON.stringify(updated));
    };

    const saveBookings = (updated) => {
        setBookings(updated);
        localStorage.setItem('aanandham_admin_bookings_v2', JSON.stringify(updated));
    };

    // Toggle Property Availability
    const handleToggleAvailability = (id) => {
        const updated = properties.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
        saveProperties(updated);
        showToast('✓ Property availability updated');
    };

    // Adjust Price
    const handleAdjustPrice = (id, delta) => {
        const updated = properties.map(p => p.id === id ? { ...p, price: Math.max(500, p.price + delta) } : p);
        saveProperties(updated);
    };

    // Adjust Room Units
    const handleAdjustRoomUnits = (propId, roomId, delta) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.rooms) {
                const updatedRooms = p.rooms.map(r => {
                    if (r.id === roomId) {
                        const minAllowed = Math.max(1, r.bookedUnits || 0);
                        const newTotal = Math.max(minAllowed, r.totalUnits + delta);
                        return { ...r, totalUnits: newTotal };
                    }
                    return r;
                });
                return { ...p, rooms: updatedRooms };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Toggle Room Availability
    const handleToggleRoomAvailability = (propId, roomId) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.rooms) {
                const updatedRooms = p.rooms.map(r => r.id === roomId ? { ...r, isAvailable: !r.isAvailable } : r);
                return { ...p, rooms: updatedRooms };
            }
            return p;
        });
        saveProperties(updated);
        showToast('✓ Room availability updated');
    };

    // Add Room to Active Property
    const handleSaveRoom = (e) => {
        e.preventDefault();
        const featuresArr = roomForm.features.split(',').map(s => s.trim()).filter(Boolean);
        const newRoom = {
            id: `r-${Date.now()}`,
            name: roomForm.name,
            capacity: roomForm.capacity,
            price: Number(roomForm.price),
            totalUnits: Number(roomForm.totalUnits),
            bookedUnits: 0,
            isAvailable: true,
            image: roomForm.image,
            features: featuresArr
        };
        const updated = properties.map(p => {
            if (p.id === activePropertyDetailId) {
                const existingRooms = p.rooms || [];
                return { ...p, rooms: [...existingRooms, newRoom] };
            }
            return p;
        });
        saveProperties(updated);
        setIsAddRoomModalOpen(false);
        setRoomForm({ name: '', capacity: '2 Adults', price: 2499, totalUnits: 8, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: 'Private Deck, King Bed, Mountain View' });
        showToast('✓ New room type added');
    };

    // Open Property Modal
    const handleOpenPropertyModal = (prop = null) => {
        if (prop) {
            setEditingProperty(prop);
            setPropertyForm({
                title: prop.title,
                region: prop.region || 'Munnar',
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
                region: 'Munnar',
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
            showToast('✓ Campsite details updated');
        } else {
            const newProp = {
                id: `pkg-${Date.now()}`,
                ...propertyForm,
                price: Number(propertyForm.price),
                originalPrice: Number(propertyForm.originalPrice),
                rating: 5.0,
                reviewsCount: 1,
                isAvailable: true,
                highlights: highlightsArr,
                rooms: [
                    { id: `r-${Date.now()}-1`, name: 'Standard Mountain Dome Pod', capacity: '2 Adults', price: Number(propertyForm.price), totalUnits: 8, bookedUnits: 0, isAvailable: true, image: propertyForm.image, features: ['Mountain View', 'Thermal Blankets', 'Charging Point'] }
                ],
                amenities: [
                    { id: `am-${Date.now()}-1`, name: 'Campfire Circle & BBQ', icon: '🔥', enabled: true },
                    { id: `am-${Date.now()}-2`, name: 'Western Washrooms', icon: '🚿', enabled: true },
                    { id: `am-${Date.now()}-3`, name: 'Wilderness Guide Marshals', icon: '🧭', enabled: true }
                ],
                addons: [
                    { id: `ad-${Date.now()}-1`, name: 'Live Campfire BBQ Platter', price: 450, enabled: true },
                    { id: `ad-${Date.now()}-2`, name: '4K Drone Reel Video', price: 1500, enabled: true }
                ]
            };
            saveProperties([...properties, newProp]);
            showToast('✓ New campsite listing created');
        }
        setIsPropertyModalOpen(false);
    };

    // Open Event Modal
    const handleOpenEventModal = (ev = null) => {
        if (ev) {
            setEditingEvent(ev);
            setEventForm({ ...ev });
        } else {
            setEditingEvent(null);
            setEventForm({
                title: '',
                region: 'Munnar',
                campsite: 'Kolukkumalai Sunrise Ridge',
                dates: '',
                price: 2499,
                capacity: 30,
                booked: 0,
                badge: 'New Batch 🌿',
                status: 'Active',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                description: 'Guided wilderness expedition with campfire barbecue and sunrise ridge trek.'
            });
        }
        setIsEventModalOpen(true);
    };

    // Save Event Form
    const handleSaveEventForm = (e) => {
        e.preventDefault();
        const cap = Math.max(1, Number(eventForm.capacity) || 1);
        const bkd = Math.max(0, Math.min(cap, Number(eventForm.booked) || 0));
        const spots = Math.max(0, cap - bkd);
        const st = spots === 0 ? 'Sold Out' : (eventForm.status === 'Sold Out' ? 'Active' : (eventForm.status || 'Active'));

        if (editingEvent) {
            const updated = events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventForm, capacity: cap, booked: bkd, spotsLeft: spots, status: st } : ev);
            saveEvents(updated);
            showToast('✓ Batch updated');
        } else {
            const newEvent = {
                id: `ev-${Date.now()}`,
                ...eventForm,
                capacity: cap,
                booked: bkd,
                spotsLeft: spots,
                status: st
            };
            saveEvents([...events, newEvent]);
            showToast('✓ New event batch scheduled');
        }
        setIsEventModalOpen(false);
    };

    // Delete Event
    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to remove this event batch?')) {
            const updated = events.filter(e => e.id !== id);
            saveEvents(updated);
            showToast('✓ Event batch removed');
        }
    };

    // Save Manual Booking from Coordinator
    const handleSaveManualBooking = (e) => {
        e.preventDefault();
        const guestsNum = Number(newBookingForm.guests) || 2;
        const pricePerGuest = Number(newBookingForm.pricePerGuest) || 2499;
        const totalCalc = guestsNum * pricePerGuest;

        const newBooking = {
            id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
            name: newBookingForm.name.trim(),
            phone: newBookingForm.phone.trim(),
            email: newBookingForm.email.trim() || 'N/A',
            package: newBookingForm.package,
            region: newBookingForm.region,
            dates: newBookingForm.dates || 'Upcoming Weekend',
            guests: guestsNum,
            roomType: newBookingForm.roomType,
            addons: [],
            total: totalCalc,
            status: newBookingForm.status || 'Confirmed',
            source: 'Coordinator Entry',
            createdAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        };

        const updated = [newBooking, ...bookings];
        saveBookings(updated);
        setIsAddBookingModalOpen(false);
        setNewBookingForm({
            name: '',
            phone: '',
            email: '',
            package: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
            region: 'Munnar',
            dates: '',
            guests: 2,
            roomType: 'Geodesic Luxury Dome Pod',
            pricePerGuest: 2499,
            status: 'Confirmed'
        });
        showToast(`✓ Booking ${newBooking.id} created successfully`);
    };

    // Delete Booking
    const handleDeleteBooking = (id) => {
        if (window.confirm(`Are you sure you want to delete reservation ${id}?`)) {
            const updated = bookings.filter(b => b.id !== id);
            saveBookings(updated);
            showToast(`✓ Booking ${id} deleted`);
        }
    };

    // Update Booking Status
    const handleUpdateBookingStatus = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        saveBookings(updated);
        showToast(`✓ Booking ${id} marked as ${newStatus}`);
    };

    // Export CSV with UTF-8 BOM & RFC 4180 escaping
    const handleExportCSV = () => {
        const headers = 'Booking ID,Customer Name,Phone,Email,Region,Package,Dates,Guests,Room Type,Total (INR),Status,Source,Created At';
        const escapeCsv = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
        const rows = bookings.map(b => [
            escapeCsv(b.id),
            escapeCsv(b.name),
            escapeCsv(b.phone),
            escapeCsv(b.email || 'N/A'),
            escapeCsv(b.region || 'Kerala'),
            escapeCsv(b.package),
            escapeCsv(b.dates),
            b.guests,
            escapeCsv(b.roomType || 'Standard'),
            b.total,
            escapeCsv(b.status),
            escapeCsv(b.source || 'Direct'),
            escapeCsv(b.createdAt)
        ].join(','));

        const csvContent = '\uFEFF' + headers + '\r\n' + rows.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Aanandham_Reservations_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('✓ Bookings exported to CSV');
    };

    // Filter properties by region
    const filteredProperties = propertyFilterRegion === 'All' ? properties : properties.filter(p => (p.region || 'Munnar') === propertyFilterRegion);

    // Filter bookings with search
    const filteredBookings = bookings.filter(b => {
        const cleanSearch = bookingSearch.replace(/\D/g, '');
        const cleanPhone = (b.phone || '').replace(/\D/g, '');
        const matchSearch = 
            (b.name || '').toLowerCase().includes(bookingSearch.toLowerCase()) || 
            (cleanSearch && cleanPhone.includes(cleanSearch)) || 
            (b.phone || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
            (b.package || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
            (b.id || '').toLowerCase().includes(bookingSearch.toLowerCase());
        const matchStatus = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
        return matchSearch && matchStatus;
    });

    // Dynamic KPI & Financial Calculations strictly derived from real data
    const paidBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In');
    const totalRevenue = paidBookings.reduce((acc, b) => acc + (b.total || 0), 0);
    const estimatedDirectCosts = Math.round(totalRevenue * 0.45); // Direct campsite operations ~45%
    const estimatedNetProfit = totalRevenue - estimatedDirectCosts;
    const profitMarginPercent = totalRevenue > 0 ? Math.round((estimatedNetProfit / totalRevenue) * 100) : 55;
    const activeCampers = paidBookings.reduce((acc, b) => acc + (b.guests || 0), 0);
    const avgOrderValue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0;
    const activeEventsCount = events.filter(e => e.status === 'Active').length;

    // Active Inspected Property Object
    const currentDetailProperty = properties.find(p => p.id === activePropertyDetailId);

    // ─────────────────────────────────────────────────────────────
    // PIN AUTHENTICATION GATE (Minimalist Squared Card)
    // ─────────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100dvh', background: '#F8F9F5', color: '#121613', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 14 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ 
                        background: '#FFFFFF', 
                        border: '1px solid rgba(18, 22, 19, 0.1)', 
                        borderRadius: '24px', 
                        padding: '44px 36px', 
                        maxWidth: '440px', 
                        width: '100%', 
                        textAlign: 'center', 
                        boxShadow: '0 12px 40px rgba(0,0,0,0.06)' 
                    }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: '#121613', color: '#E5A93B', fontSize: '20px', marginBottom: '20px', boxShadow: '0 4px 14px rgba(18,22,19,0.15)' }}>
                        🔒
                    </div>

                    <div className="star-badge" style={{ margin: '0 auto 10px' }}>
                        <span className="star-icon">★</span> BASECAMP COMMAND
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: '0 0 8px', color: '#121613', letterSpacing: '-0.02em' }}>
                        Coordinator Portal
                    </h2>
                    <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.55, marginBottom: '28px' }}>
                        Enter coordinator passcode to manage inventory, rooms, event batches, and live bookings.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                            type="password"
                            placeholder="Enter Passcode (e.g. 2026)"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                            aria-label="Coordinator Passcode"
                            style={{ 
                                width: '100%', 
                                padding: '14px 18px', 
                                borderRadius: '14px', 
                                background: '#F8F9F5', 
                                border: passcodeError ? '2px solid #DC2626' : '1px solid rgba(18, 22, 19, 0.14)', 
                                color: '#121613', 
                                fontSize: '16px', 
                                textAlign: 'center', 
                                letterSpacing: '4px', 
                                fontWeight: '700',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        {passcodeError && (
                            <div style={{ fontSize: '12.5px', color: '#DC2626', fontWeight: '700' }}>
                                Invalid Passcode. Try <code>2026</code> or <code>aanandham</code>.
                            </div>
                        )}
                        <button 
                            type="submit" 
                            className="btn-lime" 
                            style={{ 
                                padding: '15px', 
                                fontSize: '14.5px', 
                                fontWeight: '800', 
                                width: '100%', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>Unlock Dashboard</span>
                            <span>→</span>
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(18,22,19,0.08)' }}>
                        <Link href="/" style={{ color: '#59655D', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            ← Return to Website
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // DEDICATED PROPERTY INSPECTOR VIEW
    // ─────────────────────────────────────────────────────────────
    if (activePropertyDetailId && currentDetailProperty) {
        return (
            <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613', paddingBottom: '90px' }}>
                
                {/* Clean Sticky Header */}
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#0B150E', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px clamp(24px, 4vw, 56px)' }}>
                    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <button
                                onClick={() => setActivePropertyDetailId(null)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Back to Campsites
                            </button>
                            <div>
                                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                                    PROPERTY ROOMS & INVENTORY
                                </span>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {currentDetailProperty.title}
                                </h2>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={() => handleToggleAvailability(currentDetailProperty.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: currentDetailProperty.isAvailable ? 'rgba(229, 169, 59, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                                    border: currentDetailProperty.isAvailable ? '1px solid #E5A93B' : '1px solid #EF4444',
                                    color: currentDetailProperty.isAvailable ? '#E5A93B' : '#EF4444',
                                    fontSize: '12.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                {currentDetailProperty.isAvailable ? '● Active & Bookable' : '○ Property Sold Out'}
                            </button>
                            <button
                                onClick={() => handleOpenPropertyModal(currentDetailProperty)}
                                className="btn-lime"
                                style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800' }}
                            >
                                Edit Details ✏️
                            </button>
                        </div>
                    </div>
                </header>

                <main style={{ maxWidth: '1440px', margin: '36px auto 0', padding: '0 clamp(24px, 4vw, 56px)', boxSizing: 'border-box' }}>
                    
                    {/* Top Property Overview Hero Box */}
                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '240px', display: 'flex', alignItems: 'flex-end', padding: '36px', backgroundImage: `url(${currentDetailProperty.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '40px', border: '1px solid rgba(18, 22, 19, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.95) 0%, rgba(14, 24, 17, 0.4) 100%)' }} />
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    <span style={{ background: '#E5A93B', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px' }}>
                                        {currentDetailProperty.region} Region
                                    </span>
                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                        {currentDetailProperty.altitude}
                                    </span>
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: '800', margin: '0 0 8px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                                    {currentDetailProperty.title}
                                </h1>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '680px', lineHeight: 1.55 }}>
                                    {currentDetailProperty.description}
                                </p>
                            </div>

                            <div style={{ background: 'rgba(18, 22, 19, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(229, 169, 59, 0.3)', borderRadius: '18px', padding: '18px 24px', textAlign: 'right' }}>
                                <div style={{ fontSize: '10.5px', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>Base Price / Camper</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#E5A93B' }}>
                                    ₹{currentDetailProperty.price.toLocaleString('en-IN')}
                                </div>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, -100)} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>-₹100</button>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, 100)} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>+₹100</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 1: ROOMS & PODS INVENTORY */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge">
                                    <span className="star-icon">★</span> ACCOMMODATION UNITS
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: '4px 0 0', color: '#121613' }}>
                                    Rooms, Dome Pods & Tent Inventory ({currentDetailProperty.rooms ? currentDetailProperty.rooms.length : 0})
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsAddRoomModalOpen(true)}
                                className="btn-lime"
                                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800' }}
                            >
                                + Add Room Type
                            </button>
                        </div>

                        {/* Clean Squared Room Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                            {currentDetailProperty.rooms && currentDetailProperty.rooms.map(room => (
                                <div
                                    key={room.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: room.isAvailable ? '1px solid rgba(18, 22, 19, 0.08)' : '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '170px' }}>
                                        <img src={room.image || currentDetailProperty.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: room.isAvailable ? '#121613' : '#EF4444', color: room.isAvailable ? '#E5A93B' : '#FFFFFF', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {room.isAvailable ? 'Available' : 'Sold Out'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            Capacity: {room.capacity}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                                {room.name}
                                            </h4>
                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>
                                                ₹{room.price}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                                            {room.features && room.features.map((feat, idx) => (
                                                <span key={idx} style={{ background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.06)', color: '#59655D', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px' }}>
                                                    ✓ {feat}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Unit Inventory Tracker */}
                                        <div style={{ background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', borderRadius: '14px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '700', textTransform: 'uppercase' }}>Inventory</div>
                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613' }}>
                                                    {room.bookedUnits} / {room.totalUnits} Units Booked
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', color: '#121613', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.12)', color: '#121613', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleRoomAvailability(currentDetailProperty.id, room.id)}
                                            style={{
                                                marginTop: 'auto',
                                                width: '100%',
                                                padding: '11px',
                                                borderRadius: '10px',
                                                background: room.isAvailable ? 'rgba(239, 68, 68, 0.08)' : 'rgba(22, 101, 52, 0.08)',
                                                border: room.isAvailable ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(22, 101, 52, 0.3)',
                                                color: room.isAvailable ? '#DC2626' : '#166534',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {room.isAvailable ? 'Toggle: Mark Sold Out' : 'Toggle: Mark Available'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>

                {/* MODAL: ADD ROOM TYPE */}
                <AnimatePresence>
                    {isAddRoomModalOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '14px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        Add Room / Pod Type
                                    </h3>
                                    <button onClick={() => setIsAddRoomModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Accommodation Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Geodesic Luxury Dome Pod"
                                            value={roomForm.name}
                                            onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Guest Capacity
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2 Adults"
                                                value={roomForm.capacity}
                                                onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Price Per Unit (INR) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={roomForm.price}
                                                onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Total Units Inventory
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={roomForm.totalUnits}
                                                onChange={e => setRoomForm({ ...roomForm, totalUnits: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                                Cover Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={roomForm.image}
                                                onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                                                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Features (Comma Separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={roomForm.features}
                                            onChange={e => setRoomForm({ ...roomForm, features: e.target.value })}
                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-lime" style={{ padding: '13px', fontSize: '14px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                        + Save Room Type
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // MAIN ADMIN DASHBOARD (Clean Flex Layout with Full-Height Sidebar)
    // ─────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#F8F9F5', color: '#121613', display: 'flex' }}>
            
            {/* ── LEFT SIDEBAR (Full Height Sticky) ── */}
            <aside style={{
                width: '270px',
                minWidth: '270px',
                background: '#0B150E',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                boxSizing: 'border-box',
                padding: '28px 20px',
                color: '#FFFFFF',
                zIndex: 100
            }}>
                {/* Brand Header */}
                <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '10px' }}>
                        <img src="/logo.png" alt="Aanandham Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain' }} />
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', color: '#FFFFFF' }}>
                            Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                        </span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#D5ED55', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                            Basecamp Command Active
                        </span>
                    </div>
                </div>

                {/* Primary Action Button */}
                <button
                    onClick={() => setIsAddBookingModalOpen(true)}
                    className="btn-lime"
                    style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '12px',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(213, 237, 85, 0.3)'
                    }}
                >
                    <span>+ Add Manual Booking</span>
                </button>

                {/* Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
                    {[
                        { id: 'overview', name: 'Executive Overview', icon: '📊' },
                        { id: 'bookings', name: 'Live Bookings & Leads', icon: '📋', count: bookings.length },
                        { id: 'properties', name: 'Campsites & Rooms', icon: '⛺', count: properties.length },
                        { id: 'events', name: 'Trek Batches', icon: '🎉', count: activeEventsCount },
                        { id: 'financials', name: 'Profit & Financials', icon: '💰' },
                        { id: 'settings', name: 'Coordinator Settings', icon: '🔔' }
                    ].map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: isActive ? '#E5A93B' : 'transparent',
                                    color: isActive ? '#121613' : '#C8D8CB',
                                    border: 'none',
                                    fontSize: '13.5px',
                                    fontWeight: isActive ? '800' : '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'left',
                                    transition: 'all 0.18s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                                {item.count !== undefined && (
                                    <span style={{
                                        background: isActive ? '#121613' : 'rgba(255,255,255,0.12)',
                                        color: isActive ? '#E5A93B' : '#FFFFFF',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        padding: '2px 8px',
                                        borderRadius: '999px'
                                    }}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Utility Links */}
                <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/" target="_blank" style={{ color: '#A2B6A6', textDecoration: 'none', fontSize: '12.5px', fontWeight: '700', padding: '6px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🌐 View Website</span>
                        <span>↗</span>
                    </Link>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12.5px', fontWeight: '700', padding: '6px 8px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔒 Lock & Exit</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT WORKSPACE (Wide & Spacious) ── */}
            <main style={{ flex: 1, minHeight: '100vh', padding: '36px clamp(28px, 4vw, 64px)', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: EXECUTIVE OVERVIEW
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ maxWidth: '1300px' }}>
                        
                        {/* Header Intro */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '6px' }}>
                                    <span className="star-icon">★</span> EXECUTIVE DASHBOARD
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '30px', fontWeight: '800', margin: 0, color: '#121613', letterSpacing: '-0.02em' }}>
                                    Mission Control & Operations
                                </h1>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleExportCSV} style={{ padding: '9px 18px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                    <span>📥 Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                    + Manual Booking
                                </button>
                            </div>
                        </div>

                        {/* 4 Hero Minimalist Squared Metric Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                            
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Gross Confirmed Revenue
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '8px', fontWeight: '600' }}>
                                    From {paidBookings.length} confirmed reservations
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Est. Net Operating Profit
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#166534', letterSpacing: '-0.02em' }}>
                                    ₹{estimatedNetProfit.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '8px', fontWeight: '700' }}>
                                    ✓ {profitMarginPercent}% Net Operating Margin
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Total Confirmed Campers
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#121613', letterSpacing: '-0.02em' }}>
                                    {activeCampers} <span style={{ fontSize: '18px', color: '#59655D', fontWeight: '600' }}>Pax</span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '8px', fontWeight: '600' }}>
                                    Across Kerala Campsites
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Pending Inquiries
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: '800', color: '#B45309', letterSpacing: '-0.02em' }}>
                                    {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '18px', color: '#59655D', fontWeight: '600' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#B45309', marginTop: '8px', fontWeight: '700' }}>
                                    ⚡ Instant WhatsApp Dispatch
                                </div>
                            </div>

                        </div>

                        {/* Split Row: Recent Bookings Stream + Upcoming Scheduled Batches */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
                            
                            {/* Recent Live Reservations */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '22px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                            ⚡ Recent Reservations
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
                                            Latest camper submissions
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bookings')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800' }}>
                                        View All →
                                    </button>
                                </div>

                                {bookings.length === 0 ? (
                                    <div style={{ padding: '36px 20px', textAlign: 'center', color: '#7D8880', background: '#F8F9F5', borderRadius: '16px', border: '1px dashed rgba(18,22,19,0.12)' }}>
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613' }}>No Bookings Yet</div>
                                        <div style={{ fontSize: '12px', color: '#59655D', marginTop: '4px' }}>Click "+ Add Manual Booking" above or submit via the website.</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {bookings.slice(0, 4).map(b => (
                                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.04)', padding: '14px 18px', borderRadius: '16px' }}>
                                                <div>
                                                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#121613' }}>{b.name} ({b.guests} Pax)</div>
                                                    <div style={{ fontSize: '12px', color: '#59655D' }}>{b.package ? b.package.slice(0, 32) : 'Campsite'}... · {b.dates}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#121613' }}>₹{(b.total || 0).toLocaleString('en-IN')}</div>
                                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: b.status === 'Confirmed' ? '#166534' : '#B45309' }}>{b.status}</span>
                                                </div>
                                                <div>
                                                    <a href={waLink(`Hi ${b.name}! Aanandham desk regarding your reservation (${b.id}).`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '7px 12px', fontSize: '11.5px', fontWeight: '800' }}>
                                                        WhatsApp ↗
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Scheduled Batches */}
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '22px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                            🎉 Upcoming Weekend Batches
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#59655D', marginTop: '2px' }}>
                                            Live capacity tracking
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('events')} className="btn-lime" style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800' }}>
                                        Manage Batches →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {events.map(ev => (
                                        <div key={ev.id} style={{ background: '#F8F9F5', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(18,22,19,0.04)', display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <img src={ev.image} alt={ev.title} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#B45309' }}>{ev.badge}</span>
                                                    <span style={{ fontSize: '11px', color: '#59655D' }}>{ev.dates}</span>
                                                </div>
                                                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#121613', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11.5px' }}>
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
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: LIVE BOOKINGS & LEADS ROSTER
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'bookings' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> RESERVATIONS ROSTER
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Live Bookings & Leads ({filteredBookings.length})
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleExportCSV} style={{ padding: '9px 18px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>📥 Export CSV</span>
                                </button>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800' }}>
                                    + Add Booking
                                </button>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
                            <input
                                type="text"
                                placeholder="Search by name, phone, or package..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                style={{ flex: 1, minWidth: '240px', padding: '12px 18px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['All', 'Pending', 'Confirmed', 'Checked In', 'Cancelled'].map(st => (
                                    <button
                                        key={st}
                                        onClick={() => setBookingFilterStatus(st)}
                                        style={{ padding: '8px 16px', borderRadius: '999px', border: bookingFilterStatus === st ? '1px solid #121613' : '1px solid rgba(18,22,19,0.1)', background: bookingFilterStatus === st ? '#121613' : '#FFFFFF', color: bookingFilterStatus === st ? '#FFFFFF' : '#59655D', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bookings Squared Cards */}
                        {filteredBookings.length === 0 ? (
                            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(18,22,19,0.08)' }}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#121613' }}>No Reservations Found</div>
                                <div style={{ fontSize: '13px', color: '#59655D', marginTop: '6px', maxWidth: '400px', margin: '6px auto 16px' }}>
                                    No records match your search. You can create a new booking using the button below.
                                </div>
                                <button onClick={() => setIsAddBookingModalOpen(true)} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13px', fontWeight: '800' }}>
                                    + Add Manual Booking
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {filteredBookings.map(b => (
                                    <div key={b.id} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '18px', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#121613', background: '#F8F9F5', padding: '2px 7px', borderRadius: '4px', border: '1px solid rgba(18,22,19,0.08)' }}>{b.id}</span>
                                                <span style={{ fontSize: '11px', color: '#7D8880' }}>{b.createdAt}</span>
                                            </div>
                                            <div style={{ fontSize: '15.5px', fontWeight: '800', color: '#121613' }}>{b.name}</div>
                                            <div style={{ fontSize: '12.5px', color: '#59655D' }}>{b.phone}</div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#121613' }}>{b.package}</div>
                                            <div style={{ fontSize: '12px', color: '#59655D' }}>{b.dates} · {b.guests} Guests</div>
                                            {b.roomType && <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '600' }}>Room: {b.roomType}</div>}
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '10.5px', color: '#7D8880' }}>Est. Total</div>
                                            <div style={{ fontSize: '19px', fontWeight: '800', color: '#121613' }}>
                                                ₹{(b.total || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '10px', color: '#7D8880', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Status</label>
                                            <select
                                                value={b.status}
                                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                                style={{ padding: '7px 11px', borderRadius: '10px', background: b.status === 'Confirmed' ? '#DCFCE7' : b.status === 'Checked In' ? '#DBEAFE' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', color: b.status === 'Confirmed' ? '#166534' : b.status === 'Checked In' ? '#1E40AF' : b.status === 'Cancelled' ? '#991B1B' : '#92400E', fontWeight: '800', fontSize: '12px', border: '1px solid rgba(18,22,19,0.1)', cursor: 'pointer' }}
                                            >
                                                <option value="Pending">Pending 🟡</option>
                                                <option value="Confirmed">Confirmed 🟢</option>
                                                <option value="Checked In">Checked In 🔵</option>
                                                <option value="Cancelled">Cancelled 🔴</option>
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <a href={waLink(`Hi ${b.name}! Aanandham coordinator desk confirming your booking (${b.id}) for ${b.package} on ${b.dates}.`, b.phone)} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '8px 14px', fontSize: '12px', gap: '6px' }}>
                                                <span>WhatsApp</span>
                                                <span>↗</span>
                                            </a>
                                            <button onClick={() => handleDeleteBooking(b.id)} style={{ padding: '8px 11px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '12px' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 3: CAMPSITES & ROOM INVENTORY
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'properties' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div className="star-badge" style={{ marginBottom: '4px' }}>
                                    <span className="star-icon">★</span> CAMPSITE INVENTORY
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    Regional Campsites & Glamping Pods
                                </h2>
                            </div>
                            <button onClick={() => handleOpenPropertyModal()} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800' }}>
                                + Add New Campsite
                            </button>
                        </div>

                        {/* Region Filter Selector */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
                            {['All', 'Munnar', 'Suryanelli', 'Wayanad'].map(reg => (
                                <button
                                    key={reg}
                                    onClick={() => setPropertyFilterRegion(reg)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '999px',
                                        border: propertyFilterRegion === reg ? '1px solid #121613' : '1px solid rgba(18,22,19,0.12)',
                                        background: propertyFilterRegion === reg ? '#121613' : '#FFFFFF',
                                        color: propertyFilterRegion === reg ? '#FFFFFF' : '#59655D',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {reg === 'All' ? 'All Kerala Regions' : reg}
                                </button>
                            ))}
                        </div>

                        {/* Properties Squared Card Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {filteredProperties.map(prop => (
                                <div
                                    key={prop.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: prop.isAvailable ? '1px solid rgba(18, 22, 19, 0.08)' : '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div 
                                        onClick={() => setActivePropertyDetailId(prop.id)}
                                        style={{ position: 'relative', height: '190px', cursor: 'pointer' }}
                                    >
                                        <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: prop.isAvailable ? '#121613' : '#EF4444', color: prop.isAvailable ? '#E5A93B' : '#FFFFFF', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {prop.isAvailable ? 'Available' : 'Sold Out'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                            {prop.altitude}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                                            📍 {prop.region || 'Munnar'} · {prop.location}
                                        </div>
                                        <h4 
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{ fontFamily: 'var(--font-heading)', fontSize: '17.5px', fontWeight: '800', color: '#121613', margin: '0 0 14px', lineHeight: 1.35, cursor: 'pointer' }}
                                        >
                                            {prop.title}
                                        </h4>

                                        {/* Rate & Adjust */}
                                        <div style={{ background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.06)', borderRadius: '14px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '10.5px', color: '#7D8880' }}>Base Rate / Camper</div>
                                                <div style={{ fontSize: '19px', fontWeight: '800', color: '#121613' }}>
                                                    ₹{prop.price.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustPrice(prop.id, -100)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                                <button onClick={() => handleAdjustPrice(prop.id, 100)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid rgba(18,22,19,0.1)', color: '#121613', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        {/* Manage Rooms Button */}
                                        <button
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                background: '#121613',
                                                color: '#FFFFFF',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                border: 'none'
                                            }}
                                        >
                                            <span>Manage Rooms ({prop.rooms ? prop.rooms.length : 1})</span>
                                            <span>→</span>
                                        </button>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleToggleAvailability(prop.id)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '10px', background: prop.isAvailable ? 'rgba(239, 68, 68, 0.08)' : 'rgba(22, 101, 52, 0.08)', border: prop.isAvailable ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(22, 101, 52, 0.3)', color: prop.isAvailable ? '#DC2626' : '#166534', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                {prop.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button onClick={() => handleOpenPropertyModal(prop)} style={{ padding: '10px 14px', borderRadius: '10px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#121613', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                Edit ✏️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: TREK BATCHES
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'events' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
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
                                        <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.badge}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.dates}
                                        </span>
                                    </div>

                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '10.5px', color: '#7D8880', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            📍 {ev.campsite}
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
                                                Edit Batch ✏️
                                            </button>
                                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#DC2626', fontSize: '12.5px', cursor: 'pointer' }}>
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
                    TAB 5: PROFIT & FINANCIALS BREAKDOWN
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'financials' && (
                    <div style={{ maxWidth: '1300px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <div className="star-badge" style={{ marginBottom: '4px' }}>
                                <span className="star-icon">★</span> FINANCIAL INTELLIGENCE
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Profit & Revenue Analytics
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Gross Revenue (Booked)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#121613', margin: '8px 0' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>100% of confirmed reservations</div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Direct Operations (45%)</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#B45309', margin: '8px 0' }}>₹{estimatedDirectCosts.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>Permits, Food & 4x4 safaris</div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '26px 28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#7D8880', textTransform: 'uppercase' }}>Net Operating Profit</div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#166534', margin: '8px 0' }}>₹{estimatedNetProfit.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '12.5px', color: '#166534', fontWeight: '700' }}>✓ {profitMarginPercent}% Net Margin</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 6: COORDINATOR SETTINGS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '780px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <div className="star-badge" style={{ marginBottom: '4px' }}>
                                <span className="star-icon">★</span> COORDINATOR COORDINATES
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                Notification & Alert Dispatch Channels
                            </h2>
                        </div>

                        <form onSubmit={handleSaveNotifications}>
                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                                    OFFICIAL ADMIN WHATSAPP DISPATCH NUMBER
                                </label>
                                <input
                                    type="text"
                                    value={adminPhone}
                                    onChange={(e) => setAdminPhone(e.target.value)}
                                    style={{ width: '100%', padding: '13px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
                                />
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>
                                    Customer booking receipts and inquiry tickets format directly into this WhatsApp desk number.
                                </div>
                            </div>

                            <div style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#121613', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                                    TELEGRAM BOT / CLOUD WEBHOOK (OPTIONAL PUSH ALERTS)
                                </label>
                                <input
                                    type="text"
                                    value={adminTelegram}
                                    onChange={(e) => setAdminTelegram(e.target.value)}
                                    style={{ width: '100%', padding: '13px 18px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
                                />
                                <div style={{ fontSize: '12.5px', color: '#59655D' }}>
                                    Instant Telegram Bot notifications can be pushed directly to your smartphone with 0s latency.
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <button type="submit" className="btn-lime" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                                    💾 Save Coordinates
                                </button>
                                {settingsSavedToast && (
                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#166534', fontSize: '13px', fontWeight: '700' }}>
                                        ✓ Saved & Synchronized
                                    </motion.span>
                                )}
                            </div>
                        </form>
                    </div>
                )}

            </main>

            {/* ── MODAL: CREATE MANUAL BOOKING ── */}
            <AnimatePresence>
                {isAddBookingModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                        Create Manual Reservation
                                    </h3>
                                    <div style={{ fontSize: '12.5px', color: '#59655D' }}>Record phone, walk-in or bespoke squad bookings</div>
                                </div>
                                <button onClick={() => setIsAddBookingModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Customer / Squad Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul & Squad (4 Pax)"
                                        value={newBookingForm.name}
                                        onChange={e => setNewBookingForm({ ...newBookingForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Phone / WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="+91 98470 12345"
                                            value={newBookingForm.phone}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Travel Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Aug 22, 2026"
                                            value={newBookingForm.dates}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, dates: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Campsite Package *
                                        </label>
                                        <select
                                            value={newBookingForm.package}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, package: e.target.value })}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        >
                                            {properties.map(p => (
                                                <option key={p.id} value={p.title}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Number of Campers *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={newBookingForm.guests}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, guests: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Price Per Camper (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={newBookingForm.pricePerGuest}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, pricePerGuest: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Initial Status
                                        </label>
                                        <select
                                            value={newBookingForm.status}
                                            onChange={e => setNewBookingForm({ ...newBookingForm, status: e.target.value })}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        >
                                            <option value="Confirmed">Confirmed 🟢</option>
                                            <option value="Pending">Pending 🟡</option>
                                            <option value="Checked In">Checked In 🔵</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ background: '#F8F9F5', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#59655D', fontWeight: '600' }}>Calculated Total:</span>
                                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#121613' }}>
                                        ₹{((Number(newBookingForm.guests) || 1) * (Number(newBookingForm.pricePerGuest) || 2499)).toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    + Add Booking to System
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: CREATE / EDIT PROPERTY */}
            <AnimatePresence>
                {isPropertyModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    {editingProperty ? 'Edit Campsite Details' : 'Add New Campsite Listing'}
                                </h3>
                                <button onClick={() => setIsPropertyModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSavePropertyForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Campsite Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={propertyForm.title}
                                        onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Region *
                                        </label>
                                        <select
                                            value={propertyForm.region}
                                            onChange={e => setPropertyForm({ ...propertyForm, region: e.target.value })}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '13.5px', boxSizing: 'border-box' }}
                                        >
                                            <option value="Munnar">Munnar</option>
                                            <option value="Suryanelli">Suryanelli</option>
                                            <option value="Wayanad">Wayanad</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Altitude *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={propertyForm.altitude}
                                            onChange={e => setPropertyForm({ ...propertyForm, altitude: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Base Price (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={propertyForm.price}
                                            onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Difficulty
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.difficulty}
                                            onChange={e => setPropertyForm({ ...propertyForm, difficulty: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={propertyForm.image}
                                        onChange={e => setPropertyForm({ ...propertyForm, image: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={propertyForm.description}
                                        onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    {editingProperty ? 'Save Changes' : '+ Create Campsite Listing'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: CREATE / EDIT EVENT BATCH */}
            <AnimatePresence>
                {isEventModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', borderRadius: '24px', padding: '36px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#121613', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(18, 22, 19, 0.08)', paddingBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', margin: 0, color: '#121613' }}>
                                    {editingEvent ? 'Edit Trek Batch' : 'Schedule New Event Batch'}
                                </h3>
                                <button onClick={() => setIsEventModalOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#F8F9F5', border: 'none', color: '#121613', cursor: 'pointer', fontWeight: '800' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveEventForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Event / Batch Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={eventForm.title}
                                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Dates *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={eventForm.dates}
                                            onChange={e => setEventForm({ ...eventForm, dates: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Price Per Spot (INR) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.price}
                                            onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Total Capacity (Pax) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.capacity}
                                            onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                            Booked Spots
                                        </label>
                                        <input
                                            type="number"
                                            value={eventForm.booked}
                                            onChange={e => setEventForm({ ...eventForm, booked: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#121613', display: 'block', marginBottom: '5px' }}>
                                        Campsite Location
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.campsite}
                                        onChange={e => setEventForm({ ...eventForm, campsite: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.12)', color: '#121613', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '14px', fontSize: '14.5px', fontWeight: '800', marginTop: '6px', cursor: 'pointer' }}>
                                    {editingEvent ? 'Save Batch Changes' : '+ Schedule Batch'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING TOAST */}
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
                            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
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
