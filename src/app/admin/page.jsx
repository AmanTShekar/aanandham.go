"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── REGIONAL PROPERTIES WITH ROOMS, AMENITIES & ADD-ONS ──
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
            { id: 'r1', name: 'Geodesic Luxury Dome Pod', capacity: '2 Adults', price: 2499, totalUnits: 8, bookedUnits: 6, isAvailable: true, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: ['Valley Facing Deck', 'King Size Bed', 'En-suite Restroom', 'Thermal Blankets'] },
            { id: 'r2', name: 'Weatherproof Alpine 4-Person Tent', capacity: '4 Campers', price: 1799, totalUnits: 14, bookedUnits: 10, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Waterproof Flysheet', 'Foam Mattress & Sleeping Bag', 'Camping Lantern', 'Shared Modern Washrooms'] },
            { id: 'r3', name: 'Private Cliffside Wooden Cottage', capacity: '3 Campers', price: 3499, totalUnits: 3, bookedUnits: 3, isAvailable: false, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', features: ['Panoramic Glass Window', 'Hot Shower Geyser', 'Private Fire Pit', 'Attendant on Call'] }
        ],
        amenities: [
            { id: 'am-1', name: 'Campfire Circle & Acoustic Jams', icon: '🔥', enabled: true },
            { id: 'am-2', name: '4x4 Offroad Trail Access', icon: '🚙', enabled: true },
            { id: 'am-3', name: 'Western Washrooms & Running Water', icon: '🚿', enabled: true },
            { id: 'am-4', name: 'Power Backup & Charging Stations', icon: '⚡', enabled: true },
            { id: 'am-5', name: 'Stargazing Telescope Deck', icon: '🔭', enabled: true },
            { id: 'am-6', name: 'Hot Water Geysers', icon: '♨️', enabled: true },
            { id: 'am-7', name: 'Camp Kitchen & Buffet Dining Mess', icon: '🍲', enabled: true }
        ],
        addons: [
            { id: 'ad-1', name: 'Live Campfire BBQ Platter (Chicken / Paneer)', price: 450, enabled: true },
            { id: 'ad-2', name: 'Private 4x4 Jeep Safari Upgrade', price: 1200, enabled: true },
            { id: 'ad-3', name: '4K Drone Mountain Video Reel Shoot', price: 1500, enabled: true },
            { id: 'ad-4', name: 'Sunrise Mountain Yoga & Pranayama Session', price: 250, enabled: true }
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
            { id: 'r4', name: 'Summit Expedition Weatherproof Tent', capacity: '2 Campers', price: 3199, totalUnits: 12, bookedUnits: 9, isAvailable: true, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', features: ['Double Layer Windproof Fly', 'Thermal Sleeping Bags', 'Ridge Edge Pitch'] },
            { id: 'r5', name: 'High-Altitude Alpine Dome', capacity: '4 Campers', price: 2799, totalUnits: 6, bookedUnits: 5, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Spacious 4-Pax Dome', 'Insulated Ground Mat', 'Camp Light'] }
        ],
        amenities: [
            { id: 'am-10', name: 'Forest Permit & Entry Passes', icon: '🎫', enabled: true },
            { id: 'am-11', name: 'Certified Wilderness First Aiders', icon: '🩺', enabled: true },
            { id: 'am-12', name: 'Campfire Circle', icon: '🔥', enabled: true },
            { id: 'am-13', name: 'Hot Mountain Soup & Meals', icon: '🍲', enabled: true }
        ],
        addons: [
            { id: 'ad-5', name: 'Trekking Pole & Thermal Sleeping Bag Kit', price: 350, enabled: true },
            { id: 'ad-6', name: 'Campfire Live Barbecue', price: 450, enabled: true }
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
        description: 'Private geodesic dome pods facing cascading green tea slopes and misty sunset valleys. Live acoustic sessions and farm-to-table dining.',
        highlights: ['Geodesic Dome Glamping', 'Private Valley Deck', 'Campfire Acoustic Jams', 'Sunset Ridge Walk'],
        rooms: [
            { id: 'r6', name: 'Valley View Geodesic Dome', capacity: '2 Adults', price: 2199, totalUnits: 10, bookedUnits: 7, isAvailable: true, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', features: ['Private Valley Deck', 'Plush Bedding', 'Glass Sky Window'] },
            { id: 'r7', name: 'Family Safari Canvas Glamp', capacity: '4 Guests', price: 1899, totalUnits: 6, bookedUnits: 4, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Canvas Safari Roof', 'Family Seating', 'Balcony Chairs'] }
        ],
        amenities: [
            { id: 'am-20', name: 'Private Valley Deck', icon: '🌄', enabled: true },
            { id: 'am-21', name: 'Campfire Acoustic Pit', icon: '🔥', enabled: true },
            { id: 'am-22', name: 'Clean Western En-Suite', icon: '🚿', enabled: true },
            { id: 'am-23', name: 'Farm-to-Table Breakfast', icon: '☕', enabled: true }
        ],
        addons: [
            { id: 'ad-7', name: 'Acoustic Guitarist for Evening', price: 2000, enabled: true },
            { id: 'ad-8', name: 'Tea Estate Guided Factory Walk', price: 300, enabled: true }
        ]
    },
    {
        id: 'pkg-phantom',
        title: 'Phantom Head Peak & Golden Hour Sunset Trek',
        region: 'Munnar',
        category: 'Summit Trek',
        tag: 'Sunset Vista',
        location: 'Munnar Ridge, Kerala',
        altitude: '6,800 FT',
        price: 1799,
        originalPrice: 2400,
        rating: 4.91,
        reviewsCount: 195,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Trek',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        description: '360-degree panoramic golden hour peak overlooking Western Ghats layers. Guided cliff walk and night stargazing.',
        highlights: ['360° Mountain Panorama', 'Golden Hour Sunset Peak', 'High-Altitude Tent Stay', 'Guided Marshals'],
        rooms: [
            { id: 'r8', name: 'Cliff-Edge Stargazer Tent', capacity: '2 Campers', price: 1799, totalUnits: 15, bookedUnits: 12, isAvailable: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', features: ['Sunset Facing Pitch', 'High Altitude Sleeping Mats'] }
        ],
        amenities: [
            { id: 'am-30', name: 'Cliff Sunset Viewpoint', icon: '🌅', enabled: true },
            { id: 'am-31', name: 'Campfire Circle', icon: '🔥', enabled: true }
        ],
        addons: [{ id: 'ad-9', name: 'Live Barbecue', price: 450, enabled: true }]
    },
    {
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        region: 'Vagamon',
        category: 'Camp & Relax',
        tag: 'Pine Forest',
        location: 'Pine Forest, Vagamon',
        altitude: '4,800 FT',
        price: 2199,
        originalPrice: 2900,
        rating: 4.92,
        reviewsCount: 184,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy / Friends',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
        description: 'Unwind in misty pine groves of Vagamon. Perfect for acoustic campfire jams, off-road trails, and starlit barbecues.',
        highlights: ['Pine Forest Glamping', 'Off-Road Jeep Trail', 'Vagamon Meadows Sunset', 'Open-Mic Campfire'],
        rooms: [
            { id: 'r9', name: 'Pine Grove Wooden Pod', capacity: '2 Adults', price: 2399, totalUnits: 6, bookedUnits: 4, isAvailable: true, image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80', features: ['Wood Scented Interior', 'Pine Valley Deck', 'Heated Shower'] },
            { id: 'r10', name: 'Meadows Alpine Tent', capacity: '3 Campers', price: 1899, totalUnits: 10, bookedUnits: 8, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Soft Grass Meadow Pitch', 'Sleeping Bags Included'] }
        ],
        amenities: [
            { id: 'am-40', name: 'Pine Forest Canopy', icon: '🌲', enabled: true },
            { id: 'am-41', name: 'Campfire Acoustic Circle', icon: '🎸', enabled: true }
        ],
        addons: [{ id: 'ad-10', name: 'Kurisumala Off-Road Jeep Tour', price: 1000, enabled: true }]
    },
    {
        id: 'pkg-wayanad',
        title: 'Wayanad 900 Kandi Rainforest Glass Bridge Glamp',
        region: 'Wayanad',
        category: 'Water & Wild',
        tag: 'Canopy Glamp',
        location: 'Meppadi, Wayanad',
        altitude: '3,200 FT',
        price: 2699,
        originalPrice: 3500,
        rating: 4.96,
        reviewsCount: 220,
        duration: '2 Days / 1 Night',
        difficulty: 'Jungle Trail',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        description: 'Glass bridge canopy walks, off-road 4x4 jeep safaris into deep evergreen jungle, and treehouse canopy stays.',
        highlights: ['Glass Bridge Access', '4x4 Deep Forest Safari', 'Natural Stream Swims', 'Treehouse Glamp Villa'],
        rooms: [
            { id: 'r11', name: 'Rainforest Canopy Treehouse', capacity: '2 Adults', price: 3499, totalUnits: 4, bookedUnits: 3, isAvailable: true, image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', features: ['30 FT Tree Canopy View', 'Private Wooden Balcony', 'Forest Soundscape'] },
            { id: 'r12', name: 'Jungle Stream Canvas Tent', capacity: '4 Campers', price: 2299, totalUnits: 8, bookedUnits: 6, isAvailable: true, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', features: ['Beside Natural Stream', 'Waterproof Heavy Duty Canvas'] }
        ],
        amenities: [
            { id: 'am-50', name: 'Glass Bridge Entry Passes', icon: '🌉', enabled: true },
            { id: 'am-51', name: 'Private Forest Stream Access', icon: '💧', enabled: true }
        ],
        addons: [{ id: 'ad-11', name: 'Chembra Peak Guided Permit', price: 750, enabled: true }]
    },
    {
        id: 'pkg-athirappilly',
        title: 'Athirappilly Jungle Rapids & Riverbank Glamping',
        region: 'Athirappilly',
        category: 'Water & Wild',
        tag: 'Riverside Camp',
        location: 'Chalakudy River, Athirappilly',
        altitude: '1,200 FT',
        price: 2499,
        originalPrice: 3400,
        rating: 4.89,
        reviewsCount: 156,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy River Trails',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80',
        description: 'Experience Kerala’s grandest rainforest river cascades. Natural rock-pool swims, river kayaking, and riverside canvas tents.',
        highlights: ['Private River Stream Access', 'Canoeing & Kayak Equipment', 'Night Forest Walk', 'Bamboo Raft Stream Ride'],
        rooms: [
            { id: 'r13', name: 'Riverside Luxury Canvas Tent', capacity: '2 Adults', price: 2499, totalUnits: 8, bookedUnits: 5, isAvailable: true, image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80', features: ['Chalakudy River Facing', 'Waterproof River Platform', 'Hammock Attached'] }
        ],
        amenities: [
            { id: 'am-60', name: 'River Stream Swimming', icon: '🏊', enabled: true },
            { id: 'am-61', name: 'Kayaks & Safety Vests', icon: '🛶', enabled: true }
        ],
        addons: [{ id: 'ad-12', name: 'Bamboo Rafting Safari', price: 600, enabled: true }]
    }
];

// ── SCHEDULED EXPEDITIONS & ACTIVE EVENT BATCHES ──
const INITIAL_EVENTS = [
    {
        id: 'ev-1',
        title: 'Perseid Meteor Shower High-Altitude Stargaze Camp',
        region: 'Munnar',
        campsite: 'Kolukkumalai Sunrise Ridge (7,900 FT)',
        dates: 'Aug 24 – 25, 2026',
        price: 2899,
        capacity: 30,
        booked: 22,
        spotsLeft: 8,
        badge: 'Bestseller ⚡',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        description: 'High-powered telescope celestial observation, zero light pollution astrophotography workshops, and starlit barbecue campfire.'
    },
    {
        id: 'ev-2',
        title: 'Monsoon Cloud Bed Trek Batch #42',
        region: 'Suryanelli',
        campsite: 'Suryanelli Valley Ridge Glamp',
        dates: 'Aug 31 – Sep 1, 2026',
        price: 2199,
        capacity: 40,
        booked: 36,
        spotsLeft: 4,
        badge: 'Filling Fast 🔥',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        description: 'Witness rolling ocean-like cloud beds covering tea valleys, 4x4 offroad jeep climb, and live acoustic music sessions.'
    },
    {
        id: 'ev-3',
        title: 'Independence Day Sunrise Summit Expedition',
        region: 'Munnar',
        campsite: 'Meesapulimala Summit (8,661 FT)',
        dates: 'Aug 15 – 16, 2026',
        price: 3499,
        capacity: 25,
        booked: 25,
        spotsLeft: 0,
        badge: 'SOLD OUT 🔴',
        status: 'Sold Out',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: 'South India’s 2nd highest peak sunrise trek with certified wilderness marshals, ridge crossing, and rhododendron trail.'
    },
    {
        id: 'ev-4',
        title: 'Wayanad Rainforest Glass Bridge & Stream Trek',
        region: 'Wayanad',
        campsite: '900 Kandi Rainforest Canopy',
        dates: 'Sep 7 – 8, 2026',
        price: 2699,
        capacity: 35,
        booked: 18,
        spotsLeft: 17,
        badge: 'New Batch 🌿',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        description: 'Glass bridge canopy walks, off-road 4x4 jeep deep jungle safaris, natural stream swims, and tribal dinner feast.'
    }
];

const INITIAL_BOOKINGS = [
    {
        id: 'BK-9482',
        name: 'Rahul Nair',
        phone: '+91 98470 12345',
        package: 'Kolukkumalai Sunrise 4x4 Expedition',
        region: 'Munnar',
        dates: '2026-08-22 (Upcoming Sat)',
        guests: 4,
        roomType: 'Geodesic Luxury Dome Pod (2 Units)',
        addons: ['Live BBQ Platter', '4x4 Jeep Safari Upgrade'],
        total: 10796,
        status: 'Confirmed',
        createdAt: '14 Aug, 02:15 PM'
    },
    {
        id: 'BK-9483',
        name: 'Ananya Sharma',
        phone: '+91 98112 34567',
        package: 'Suryanelli Valley Ridge Geodesic Glamping',
        region: 'Suryanelli',
        dates: '2026-08-23 (Upcoming Sun)',
        guests: 2,
        roomType: 'Valley View Geodesic Dome',
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
        region: 'Vagamon',
        dates: '2026-08-29',
        guests: 6,
        roomType: 'Meadows Alpine Tent (2 Units)',
        addons: ['4K Drone Mountain Video Reel', 'Acoustic Guitarist'],
        total: 15394,
        status: 'Pending',
        createdAt: '14 Aug, 04:10 PM'
    },
    {
        id: 'BK-9485',
        name: 'Dr. Priya Varma',
        phone: '+91 97450 67890',
        package: 'Kolukkumalai Sunrise 4x4 Expedition',
        region: 'Munnar',
        dates: '2026-08-15 (Tomorrow)',
        guests: 2,
        roomType: 'Geodesic Luxury Dome Pod',
        addons: ['Sunrise Mountain Yoga'],
        total: 5498,
        status: 'Checked In',
        createdAt: '13 Aug, 08:30 PM'
    }
];

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(false);

    // Active Navigation Tab
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'properties' | 'events' | 'bookings' | 'settings'

    // Dedicated Full-Page Property Details View State
    const [activePropertyDetailId, setActivePropertyDetailId] = useState(null);

    // Data States (Persisted in LocalStorage)
    const [properties, setProperties] = useState(INITIAL_PROPERTIES);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

    // Filter by Region in Properties list
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

    // Create Room Modal State for the Dedicated Property Page
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

    // Booking Search & Filter
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('All');

    // Admin Notification Settings
    const [adminPhone, setAdminPhone] = useState('+91 9400 987 654');
    const [adminTelegram, setAdminTelegram] = useState('@aanandham_concierge_bot');

    // Load from LocalStorage
    useEffect(() => {
        const savedAuth = localStorage.getItem('aanandham_admin_auth');
        if (savedAuth === 'true') setIsAuthenticated(true);

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
                        const newTotal = Math.max(1, r.totalUnits + delta);
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
    };

    // Toggle Amenity
    const handleToggleAmenity = (propId, amenityId) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.amenities) {
                const updatedAmenities = p.amenities.map(am => am.id === amenityId ? { ...am, enabled: !am.enabled } : am);
                return { ...p, amenities: updatedAmenities };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Toggle Add-on
    const handleToggleAddon = (propId, addonId) => {
        const updated = properties.map(p => {
            if (p.id === propId && p.addons) {
                const updatedAddons = p.addons.map(ad => ad.id === addonId ? { ...ad, enabled: !ad.enabled } : ad);
                return { ...p, addons: updatedAddons };
            }
            return p;
        });
        saveProperties(updated);
    };

    // Add New Room to Active Property
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
                    { id: `am-${Date.now()}-3`, name: 'Wilderness Guide Marshals', icon: '🧭', enabled: true },
                    { id: `am-${Date.now()}-4`, name: 'Hot Mountain Buffet Meals', icon: '🍲', enabled: true }
                ],
                addons: [
                    { id: `ad-${Date.now()}-1`, name: 'Live Campfire BBQ Platter', price: 450, enabled: true },
                    { id: `ad-${Date.now()}-2`, name: '4K Drone Reel Video', price: 1500, enabled: true }
                ]
            };
            saveProperties([...properties, newProp]);
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
                dates: 'Sep 12 – 13, 2026',
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
        const cap = Number(eventForm.capacity);
        const bkd = Number(eventForm.booked);
        const spots = Math.max(0, cap - bkd);
        const st = spots === 0 ? 'Sold Out' : eventForm.status;

        if (editingEvent) {
            const updated = events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventForm, capacity: cap, booked: bkd, spotsLeft: spots, status: st } : ev);
            saveEvents(updated);
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
        }
        setIsEventModalOpen(false);
    };

    // Delete Event
    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to remove this event batch?')) {
            const updated = events.filter(e => e.id !== id);
            saveEvents(updated);
        }
    };

    // Update Booking Status
    const handleUpdateBookingStatus = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        saveBookings(updated);
    };

    // Export CSV
    const handleExportCSV = () => {
        const headers = ['Booking ID,Customer Name,Phone,Region,Package,Dates,Guests,Room Type,Addons,Est Total (INR),Status,Created At\n'];
        const rows = bookings.map(b => 
            `"${b.id}","${b.name}","${b.phone}","${b.region || 'Kerala'}","${b.package}","${b.dates}",${b.guests},"${b.roomType || 'Standard'}","${b.addons ? b.addons.join(' + ') : ''}",${b.total},"${b.status}","${b.createdAt}"`
        );
        const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Aanandham_Reservations_${new Date().toISOString().slice(0,10)}.csv`);
        link.click();
    };

    // Filter properties by region
    const filteredProperties = propertyFilterRegion === 'All' ? properties : properties.filter(p => (p.region || 'Munnar') === propertyFilterRegion);

    // Filter bookings
    const filteredBookings = bookings.filter(b => {
        const matchSearch = b.name.toLowerCase().includes(bookingSearch.toLowerCase()) || b.phone.includes(bookingSearch) || b.package.toLowerCase().includes(bookingSearch.toLowerCase());
        const matchStatus = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
        return matchSearch && matchStatus;
    });

    // KPI Metrics
    const totalRevenue = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').reduce((acc, b) => acc + b.total, 0);
    const activeCampers = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').reduce((acc, b) => acc + b.guests, 0);
    const avgOrderValue = bookings.length > 0 ? Math.round(totalRevenue / Math.max(1, bookings.filter(b => b.status === 'Confirmed').length)) : 0;
    const activeEventsCount = events.filter(e => e.status === 'Active').length;

    // Active Inspected Property Object for Full Page View
    const currentDetailProperty = properties.find(p => p.id === activePropertyDetailId);

    // ── PIN AUTHENTICATION GATE ──
    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', background: '#08120A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} style={{ background: '#101E13', border: '1px solid rgba(213, 237, 85, 0.25)', borderRadius: '32px', padding: '44px 36px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(213, 237, 85, 0.1)', color: '#E5A93B', fontSize: '24px', marginBottom: '20px' }}>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="live-beacon"></span>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#E5A93B', textTransform: 'uppercase' }}>
                            AANANDHAM COMMAND CENTER
                        </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: '0 0 8px', color: '#FFFFFF' }}>
                        Admin Portal Access
                    </h2>
                    <p style={{ fontSize: '14px', color: '#A2B6A6', lineHeight: 1.5, marginBottom: '28px' }}>
                        Enter master coordinator PIN to manage properties, rooms, event batches, and live bookings.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                            type="password"
                            placeholder="Enter 4-digit PIN (e.g. 2026)"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            autoFocus
                            style={{ width: '100%', padding: '15px 20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.06)', border: passcodeError ? '2px solid #FF5A5F' : '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '16px', textAlign: 'center', letterSpacing: '4px', outline: 'none' }}
                        />
                        {passcodeError && <div style={{ fontSize: '12.5px', color: '#FF5A5F', fontWeight: '600' }}>Invalid PIN code. (Default: 2026)</div>}
                        <button type="submit" className="btn-lime" style={{ padding: '15px', fontSize: '15px', fontWeight: '800', width: '100%', cursor: 'pointer' }}>
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

    // ─────────────────────────────────────────────────────────────
    // DEDICATED FULL-PAGE PROPERTY INSPECTOR VIEW (Maximum Screen Space)
    // ─────────────────────────────────────────────────────────────
    if (activePropertyDetailId && currentDetailProperty) {
        return (
            <div style={{ minHeight: '100vh', background: '#08120A', color: '#FFFFFF', paddingBottom: '90px' }}>
                {/* Header with Back Navigation */}
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(14, 24, 17, 0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '16px 28px' }}>
                    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => setActivePropertyDetailId(null)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
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
                                ← Back to All Properties
                            </button>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                    PROPERTY INVENTORY COMMAND
                                </span>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {currentDetailProperty.title}
                                </h2>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => handleToggleAvailability(currentDetailProperty.id)}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '999px',
                                    background: currentDetailProperty.isAvailable ? 'rgba(213, 237, 85, 0.15)' : 'rgba(255, 90, 95, 0.15)',
                                    border: currentDetailProperty.isAvailable ? '1px solid #E5A93B' : '1px solid #FF5A5F',
                                    color: currentDetailProperty.isAvailable ? '#E5A93B' : '#FF5A5F',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                {currentDetailProperty.isAvailable ? '● Active & Bookable' : '○ Property Sold Out'}
                            </button>
                            <button
                                onClick={() => handleOpenPropertyModal(currentDetailProperty)}
                                className="btn-lime"
                                style={{ padding: '8px 18px', fontSize: '13px' }}
                            >
                                Edit Metadata ✏️
                            </button>
                        </div>
                    </div>
                </header>

                <main style={{ maxWidth: '1440px', margin: '32px auto 0', padding: '0 28px' }}>
                    
                    {/* Top Property Overview Hero Banner */}
                    <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', minHeight: '260px', display: 'flex', alignItems: 'flex-end', padding: '36px', backgroundImage: `url(${currentDetailProperty.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 18, 10, 0.95) 0%, rgba(8, 18, 10, 0.45) 100%)' }} />
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                    <span style={{ background: '#E5A93B', color: '#121613', fontSize: '11.5px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px' }}>
                                        {currentDetailProperty.region} Region
                                    </span>
                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                                        Altitude: {currentDetailProperty.altitude}
                                    </span>
                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                                        Terrain: {currentDetailProperty.difficulty}
                                    </span>
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: '800', margin: '0 0 8px', color: '#FFFFFF' }}>
                                    {currentDetailProperty.title}
                                </h1>
                                <p style={{ fontSize: '14.5px', color: '#E1E9E3', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
                                    {currentDetailProperty.description}
                                </p>
                            </div>

                            <div style={{ background: 'rgba(16, 30, 19, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(213, 237, 85, 0.3)', borderRadius: '20px', padding: '18px 24px', textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Base Price Per Camper</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#E5A93B' }}>
                                    ₹{currentDetailProperty.price.toLocaleString('en-IN')}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, -100)} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>-₹100</button>
                                    <button onClick={() => handleAdjustPrice(currentDetailProperty.id, 100)} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>+₹100</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─────────────────────────────────────────────────────────
                        SECTION 1: ROOMS, PODS & ACCOMMODATION CARDS
                    ───────────────────────────────────────────────────────── */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🛏️ Rooms, Dome Pods & Tent Inventory</span>
                                    <span style={{ fontSize: '13px', background: 'rgba(213, 237, 85, 0.15)', color: '#E5A93B', padding: '3px 10px', borderRadius: '999px' }}>
                                        {currentDetailProperty.rooms ? currentDetailProperty.rooms.length : 0} Types
                                    </span>
                                </h3>
                                <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                    Adjust individual pod capacities, night rates, total unit inventory, and active booking availability.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAddRoomModalOpen(true)}
                                className="btn-lime"
                                style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800' }}
                            >
                                + Add Room / Pod Type
                            </button>
                        </div>

                        {/* Room Cards Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {currentDetailProperty.rooms && currentDetailProperty.rooms.map(room => (
                                <div
                                    key={room.id}
                                    style={{
                                        background: '#101E13',
                                        border: room.isAvailable ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 90, 95, 0.4)',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '170px' }}>
                                        <img src={room.image || currentDetailProperty.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: room.isAvailable ? '#E5A93B' : '#FF5A5F', color: room.isAvailable ? '#121613' : '#FFFFFF', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {room.isAvailable ? 'Available' : 'Fully Booked'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            Capacity: {room.capacity}
                                        </span>
                                    </div>

                                    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                                {room.name}
                                            </h4>
                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#E5A93B' }}>
                                                ₹{room.price}
                                            </span>
                                        </div>

                                        {/* Features Pills */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                                            {room.features && room.features.map((feat, idx) => (
                                                <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', color: '#A2B6A6', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px' }}>
                                                    ✓ {feat}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Unit Inventory Tracker & Adjuster */}
                                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#8E9B92' }}>Unit Inventory</div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                                                    {room.bookedUnits} / {room.totalUnits} Units Occupied
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}>-</button>
                                                <button onClick={() => handleAdjustRoomUnits(currentDetailProperty.id, room.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </div>

                                        {/* Availability Toggle */}
                                        <button
                                            onClick={() => handleToggleRoomAvailability(currentDetailProperty.id, room.id)}
                                            style={{
                                                marginTop: 'auto',
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '12px',
                                                background: room.isAvailable ? 'rgba(255, 90, 95, 0.15)' : 'rgba(213, 237, 85, 0.15)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: room.isAvailable ? '#FF5A5F' : '#E5A93B',
                                                fontSize: '12.5px',
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

                    {/* ─────────────────────────────────────────────────────────
                        SECTION 2: ON-SITE AMENITIES & FACILITIES CARDS
                    ───────────────────────────────────────────────────────── */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                ⚡ On-Site Amenities & Facilities Checklist
                            </h3>
                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                Enable or disable facilities available at this specific campsite base.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                            {currentDetailProperty.amenities && currentDetailProperty.amenities.map(amenity => (
                                <div
                                    key={amenity.id}
                                    onClick={() => handleToggleAmenity(currentDetailProperty.id, amenity.id)}
                                    style={{
                                        background: amenity.enabled ? 'rgba(213, 237, 85, 0.08)' : '#101E13',
                                        border: amenity.enabled ? '1px solid rgba(213, 237, 85, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '18px',
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '22px' }}>{amenity.icon}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: amenity.enabled ? '#FFFFFF' : '#8E9B92' }}>
                                            {amenity.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '16px', color: amenity.enabled ? '#E5A93B' : '#8E9B92' }}>
                                        {amenity.enabled ? '✓' : '○'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─────────────────────────────────────────────────────────
                        SECTION 3: ADD-ON PACKAGES & TREK UPGRADES
                    ───────────────────────────────────────────────────────── */}
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                🎁 Available Add-On Packages & Experiences
                            </h3>
                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                Custom trek upgrades, live barbecue platters, and drone media shoots offered at this property.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                            {currentDetailProperty.addons && currentDetailProperty.addons.map(addon => (
                                <div
                                    key={addon.id}
                                    onClick={() => handleToggleAddon(currentDetailProperty.id, addon.id)}
                                    style={{
                                        background: addon.enabled ? 'rgba(213, 237, 85, 0.08)' : '#101E13',
                                        border: addon.enabled ? '1px solid rgba(213, 237, 85, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '20px',
                                        padding: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '14.5px', fontWeight: '800', color: addon.enabled ? '#FFFFFF' : '#8E9B92' }}>
                                            {addon.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: addon.enabled ? '#E5A93B' : '#8E9B92', marginTop: '4px' }}>
                                            {addon.enabled ? '● Active in Booking Form' : '○ Disabled'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#E5A93B' }}>
                                            +₹{addon.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>

                {/* ── CREATE ROOM MODAL FOR DEDICATED PAGE ── */}
                <AnimatePresence>
                    {isAddRoomModalOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} style={{ background: '#101E13', border: '1px solid rgba(213, 237, 85, 0.3)', borderRadius: '32px', padding: '36px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#FFFFFF', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                        Add Room / Pod Type
                                    </h3>
                                    <button onClick={() => setIsAddRoomModalOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Accommodation Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Geodesic Luxury Dome Pod"
                                            value={roomForm.name}
                                            onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Guest Capacity
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2 Adults / 4 Campers"
                                                value={roomForm.capacity}
                                                onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Price Per Unit (INR) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={roomForm.price}
                                                onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Total Units Inventory
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={roomForm.totalUnits}
                                                onChange={e => setRoomForm({ ...roomForm, totalUnits: e.target.value })}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Cover Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={roomForm.image}
                                                onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Features & Amenities (Comma Separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={roomForm.features}
                                            onChange={e => setRoomForm({ ...roomForm, features: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-lime" style={{ padding: '15px', fontSize: '15px', fontWeight: '800', marginTop: '10px' }}>
                                        + Save Room Type ↗
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
    // MAIN ADMIN DASHBOARD WITH ALL TABS
    // ─────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#08120A', color: '#FFFFFF', paddingBottom: '90px' }}>
            
            {/* Top Navigation Bar */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(14, 24, 17, 0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '16px 28px' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Aanandham Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }} />
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </span>
                        </Link>
                        <span style={{ background: 'rgba(213, 237, 85, 0.15)', color: '#E5A93B', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.8px' }}>
                            PROPERTIES, EVENTS & REVENUE PMS
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/" target="_blank" style={{ color: '#A2B6A6', textDecoration: 'none', fontSize: '13px', fontWeight: '700', padding: '8px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                            View Live Site ↗
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'rgba(255, 90, 95, 0.15)', color: '#FF5A5F', border: '1px solid rgba(255, 90, 95, 0.3)', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                            Lock & Exit
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1440px', margin: '32px auto 0', padding: '0 28px' }}>
                
                {/* ── NAVIGATION TABS ── */}
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                    {[
                        { id: 'overview', name: '📊 Mission Control & Analytics' },
                        { id: 'properties', name: '⛺ Regional Properties & Rooms', count: properties.length },
                        { id: 'events', name: '🎉 Events & Scheduled Batches', count: activeEventsCount },
                        { id: 'bookings', name: '📋 Bookings & Leads', count: bookings.length },
                        { id: 'settings', name: '🔔 Notification Channels' }
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '999px',
                                    border: isActive ? '1px solid #E5A93B' : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: isActive ? '#E5A93B' : 'rgba(255, 255, 255, 0.04)',
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
                                    <span style={{ background: isActive ? '#121613' : 'rgba(255,255,255,0.15)', color: isActive ? '#E5A93B' : '#FFFFFF', fontSize: '11px', padding: '2px 8px', borderRadius: '999px' }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: MISSION CONTROL & EXECUTIVE ANALYTICS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div>
                        {/* KPI Highlights */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Confirmed Revenue (Pipeline)
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#E5A93B' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '12px', color: '#8E9B92', marginTop: '6px' }}>
                                    Average Order Value: ₹{avgOrderValue.toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Active Campers on Peak
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                                    {activeCampers} <span style={{ fontSize: '18px', color: '#A2B6A6', fontWeight: '600' }}>Explorers</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#E5A93B', marginTop: '6px' }}>
                                    Across 4 Kerala Regions
                                </div>
                            </div>

                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Active Scheduled Event Batches
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                                    {activeEventsCount} <span style={{ fontSize: '18px', color: '#A2B6A6' }}>Batches</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#A2B6A6', marginTop: '6px' }}>
                                    {events.reduce((acc, ev) => acc + ev.spotsLeft, 0)} Total Spots Remaining
                                </div>
                            </div>

                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A2B6A6', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                                    Pending Inquiries (Action Required)
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFB800' }}>
                                    {bookings.filter(b => b.status === 'Pending').length} <span style={{ fontSize: '16px', color: '#A2B6A6' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#FFB800', marginTop: '6px' }}>
                                    ⚡ 1-Tap WhatsApp dispatch ready
                                </div>
                            </div>
                        </div>

                        {/* Split Row: Active Properties by Region + Upcoming Events Feed */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '28px', marginBottom: '36px' }}>
                            
                            {/* Regional Properties Snapshot */}
                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                            ⛺ Properties by Region
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                            {properties.length} Campsites listed across Kerala
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('properties')} className="btn-lime" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        Manage All →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Munnar', 'Suryanelli', 'Vagamon', 'Wayanad', 'Athirappilly'].map(reg => {
                                        const regProps = properties.filter(p => (p.region || 'Munnar') === reg);
                                        const availableCount = regProps.filter(p => p.isAvailable).length;
                                        return (
                                            <div key={reg} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <div>
                                                    <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#FFFFFF' }}>
                                                        {reg === 'Munnar' ? '🏔️ Munnar High Peaks' : reg === 'Suryanelli' ? '☕ Suryanelli Ridge' : reg === 'Vagamon' ? '🌲 Vagamon Pine Valleys' : reg === 'Wayanad' ? '🌴 Wayanad Rainforest' : '🌊 Athirappilly Rapids'}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#A2B6A6' }}>
                                                        {regProps.length} Campsites ({availableCount} Available)
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px', background: availableCount > 0 ? 'rgba(213,237,85,0.15)' : 'rgba(255,90,95,0.15)', color: availableCount > 0 ? '#E5A93B' : '#FF5A5F' }}>
                                                    {availableCount > 0 ? 'Active & Open' : 'Sold Out'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Scheduled Events Feed */}
                            <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                            🎉 Active Weekend Events
                                        </h3>
                                        <div style={{ fontSize: '12.5px', color: '#A2B6A6', marginTop: '2px' }}>
                                            Upcoming scheduled batch treks & camps
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('events')} className="btn-lime" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        Manage Events →
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {events.map(ev => (
                                        <div key={ev.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <img src={ev.image} alt={ev.title} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B' }}>{ev.badge}</span>
                                                    <span style={{ fontSize: '11px', color: '#A2B6A6' }}>{ev.dates}</span>
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.3 }}>{ev.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '12px' }}>
                                                    <span style={{ color: '#A2B6A6' }}>{ev.booked} / {ev.capacity} Campers</span>
                                                    <span style={{ fontWeight: '800', color: ev.spotsLeft === 0 ? '#FF5A5F' : '#E5A93B' }}>
                                                        {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Remaining`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Recent Leads & Inquiries Stream */}
                        <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', margin: 0 }}>
                                    ⚡ Recent Booking Inquiries
                                </h3>
                                <button onClick={() => setActiveTab('bookings')} className="btn-lime" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                    View All Leads →
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {bookings.slice(0, 3).map(b => (
                                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', borderRadius: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>{b.name} ({b.guests} Guests)</div>
                                            <div style={{ fontSize: '12.5px', color: '#A2B6A6' }}>{b.package} · {b.dates}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#E5A93B' }}>₹{b.total.toLocaleString('en-IN')}</div>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: b.status === 'Confirmed' ? '#E5A93B' : '#FFB800' }}>{b.status}</span>
                                        </div>
                                        <div>
                                            <a href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.name}! Aanandham desk regarding your reservation (${b.id}).`)}`} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '8px 14px', fontSize: '12px' }}>
                                                <i className="fa-brands fa-whatsapp"></i> Chat
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: REGIONAL PROPERTIES & ROOM/POD MANAGEMENT
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'properties' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: 0 }}>
                                    Regional Properties & Campsites
                                </h3>
                                <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                    Organized by location. Tap on any property card to open its full dedicated room inventory & amenities manager.
                                </p>
                            </div>
                            <button onClick={() => handleOpenPropertyModal()} className="btn-lime" style={{ padding: '12px 26px', fontSize: '14px', fontWeight: '800' }}>
                                + Add New Campsite Listing
                            </button>
                        </div>

                        {/* Region Filter Selector */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
                            {['All', 'Munnar', 'Suryanelli', 'Vagamon', 'Wayanad', 'Athirappilly'].map(reg => (
                                <button
                                    key={reg}
                                    onClick={() => setPropertyFilterRegion(reg)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '999px',
                                        border: propertyFilterRegion === reg ? '1px solid #E5A93B' : '1px solid rgba(255,255,255,0.08)',
                                        background: propertyFilterRegion === reg ? 'rgba(213, 237, 85, 0.15)' : 'transparent',
                                        color: propertyFilterRegion === reg ? '#E5A93B' : '#A2B6A6',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {reg === 'All' ? 'All Kerala Regions' : reg}
                                </button>
                            ))}
                        </div>

                        {/* Properties Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {filteredProperties.map(prop => (
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
                                    <div 
                                        onClick={() => setActivePropertyDetailId(prop.id)}
                                        style={{ position: 'relative', height: '190px', cursor: 'pointer' }}
                                    >
                                        <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: prop.isAvailable ? '#E5A93B' : '#FF5A5F', color: prop.isAvailable ? '#121613' : '#FFFFFF', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {prop.isAvailable ? 'Available' : 'SOLD OUT'}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            {prop.altitude}
                                        </span>
                                    </div>

                                    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                                            📍 {prop.region || 'Munnar'} · {prop.location}
                                        </div>
                                        <h4 
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.3, cursor: 'pointer' }}
                                        >
                                            {prop.title}
                                        </h4>

                                        {/* Rate & Quick Adjust */}
                                        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#A2B6A6' }}>Base Rate (Per Camper)</div>
                                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#E5A93B' }}>
                                                    ₹{prop.price.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleAdjustPrice(prop.id, -100)} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>-₹100</button>
                                                <button onClick={() => handleAdjustPrice(prop.id, 100)} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>+₹100</button>
                                            </div>
                                        </div>

                                        {/* Dedicated Page Button */}
                                        <button
                                            onClick={() => setActivePropertyDetailId(prop.id)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '14px',
                                                background: 'rgba(213, 237, 85, 0.12)',
                                                border: '1px solid rgba(213, 237, 85, 0.35)',
                                                color: '#E5A93B',
                                                fontSize: '13.5px',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                marginBottom: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>Manage Rooms, Pods & Amenities ({prop.rooms ? prop.rooms.length : 1})</span>
                                            <span>→</span>
                                        </button>

                                        {/* Action buttons */}
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleToggleAvailability(prop.id)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '12px', background: prop.isAvailable ? 'rgba(255, 90, 95, 0.15)' : 'rgba(213, 237, 85, 0.15)', border: '1px solid rgba(255, 255, 255, 0.1)', color: prop.isAvailable ? '#FF5A5F' : '#E5A93B', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                {prop.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <button onClick={() => handleOpenPropertyModal(prop)} style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
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
                    TAB 3: EVENTS & SCHEDULED EXPEDITIONS CMS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'events' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: 0 }}>
                                    Scheduled Trek Batches & Events
                                </h3>
                                <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '4px 0 0' }}>
                                    Publish weekend batches, meteor shower camps, and manage spots remaining.
                                </p>
                            </div>
                            <button onClick={() => handleOpenEventModal()} className="btn-lime" style={{ padding: '12px 26px', fontSize: '14px', fontWeight: '800' }}>
                                + Create New Event Batch
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            {events.map(ev => (
                                <div key={ev.id} style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ position: 'relative', height: '180px' }}>
                                        <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#E5A93B', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.badge}
                                        </span>
                                        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                            {ev.dates}
                                        </span>
                                    </div>

                                    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            📍 {ev.campsite}
                                        </div>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.3 }}>
                                            {ev.title}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.5, marginBottom: '16px' }}>{ev.description}</p>

                                        {/* Capacity & Spots remaining meter */}
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '16px', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                                                <span style={{ color: '#FFFFFF' }}>Ticket: ₹{ev.price}</span>
                                                <span style={{ color: ev.spotsLeft === 0 ? '#FF5A5F' : '#E5A93B' }}>
                                                    {ev.spotsLeft === 0 ? 'SOLD OUT' : `${ev.spotsLeft} Spots Left (${ev.booked}/${ev.capacity})`}
                                                </span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min(100, (ev.booked / ev.capacity) * 100)}%`, background: ev.spotsLeft === 0 ? '#FF5A5F' : '#E5A93B' }} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleOpenEventModal(ev)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                                                Edit Batch ✏️
                                            </button>
                                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,90,95,0.1)', border: 'none', color: '#FF5A5F', fontSize: '13px', cursor: 'pointer' }}>
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
                    TAB 4: BOOKINGS & LEADS LIFECYCLE
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
                            <button onClick={handleExportCSV} style={{ padding: '10px 20px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
                                style={{ flex: 1, minWidth: '240px', padding: '12px 18px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '13.5px', outline: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['All', 'Pending', 'Confirmed', 'Checked In', 'Cancelled'].map(st => (
                                    <button
                                        key={st}
                                        onClick={() => setBookingFilterStatus(st)}
                                        style={{ padding: '8px 16px', borderRadius: '999px', border: bookingFilterStatus === st ? '1px solid #E5A93B' : '1px solid rgba(255,255,255,0.08)', background: bookingFilterStatus === st ? 'rgba(213, 237, 85, 0.15)' : 'transparent', color: bookingFilterStatus === st ? '#E5A93B' : '#A2B6A6', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bookings List Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {filteredBookings.map(b => (
                                <div key={b.id} style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B' }}>{b.id}</span>
                                            <span style={{ fontSize: '11px', color: '#8E9B92' }}>{b.createdAt}</span>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>{b.name}</div>
                                        <div style={{ fontSize: '13px', color: '#A2B6A6' }}>{b.phone}</div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FFFFFF' }}>{b.package}</div>
                                        <div style={{ fontSize: '12px', color: '#A2B6A6' }}>{b.dates} · {b.guests} Guests</div>
                                        {b.roomType && <div style={{ fontSize: '11.5px', color: '#E5A93B' }}>Room: {b.roomType}</div>}
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '11px', color: '#8E9B92' }}>Est. Total</div>
                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#E5A93B' }}>
                                            ₹{b.total.toLocaleString('en-IN')}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '10.5px', color: '#8E9B92', display: 'block', marginBottom: '4px' }}>Status</label>
                                        <select
                                            value={b.status}
                                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                            style={{ padding: '8px 12px', borderRadius: '12px', background: b.status === 'Confirmed' ? '#E5A93B' : b.status === 'Checked In' ? '#0070F3' : b.status === 'Cancelled' ? '#FF5A5F' : '#FFB800', color: b.status === 'Confirmed' ? '#121613' : '#FFFFFF', fontWeight: '800', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                                        >
                                            <option value="Pending" style={{ background: '#101E13', color: '#FFFFFF' }}>Pending 🟡</option>
                                            <option value="Confirmed" style={{ background: '#101E13', color: '#FFFFFF' }}>Confirmed 🟢</option>
                                            <option value="Checked In" style={{ background: '#101E13', color: '#FFFFFF' }}>Checked In 🔵</option>
                                            <option value="Cancelled" style={{ background: '#101E13', color: '#FFFFFF' }}>Cancelled 🔴</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <a href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.name}! Aanandham desk confirming your booking (${b.id}) for ${b.package} on ${b.dates}.`)}`} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ padding: '8px 14px', fontSize: '12px', gap: '6px' }}>
                                            <i className="fa-brands fa-whatsapp"></i> Chat
                                        </a>
                                        <a href={`tel:${b.phone}`} style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                            <i className="fa-solid fa-phone"></i>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 5: NOTIFICATIONS & SUPABASE SETTINGS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '720px' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', margin: '0 0 6px' }}>
                                Notification & Cloud Sync Channels
                            </h3>
                            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: 0 }}>
                                Set up instant alerts on your phone when new camper reservations arrive.
                            </p>
                        </div>

                        <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px', marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#E5A93B', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                OFFICIAL ADMIN WHATSAPP DISPATCH NUMBER
                            </label>
                            <input
                                type="text"
                                value={adminPhone}
                                onChange={(e) => setAdminPhone(e.target.value)}
                                style={{ width: '100%', padding: '13px 18px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }}
                            />
                            <div style={{ fontSize: '12px', color: '#8E9B92' }}>
                                Customer booking receipts and inquiry tickets format directly into this WhatsApp desk number.
                            </div>
                        </div>

                        <div style={{ background: '#101E13', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#E5A93B', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                                TELEGRAM BOT / CLOUD WEBHOOK (OPTIONAL ₹0 PUSH ALERTS)
                            </label>
                            <input
                                type="text"
                                value={adminTelegram}
                                onChange={(e) => setAdminTelegram(e.target.value)}
                                style={{ width: '100%', padding: '13px 18px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px', outline: 'none', marginBottom: '10px' }}
                            />
                            <div style={{ fontSize: '12px', color: '#8E9B92' }}>
                                Zero-delay Telegram Bot alerts can be pushed directly to your smartphone with 0s latency.
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ── CREATE / EDIT PROPERTY MODAL ── */}
            <AnimatePresence>
                {isPropertyModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="modal-rounded-card dark-modal-scroll" style={{ background: '#101E13', border: '1px solid rgba(213, 237, 85, 0.3)', maxWidth: '680px', width: '100%', maxHeight: '90vh', color: '#FFFFFF', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 36px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {editingProperty ? 'Edit Campsite Listing' : 'Add New Campsite Listing'}
                                </h3>
                                <button onClick={() => setIsPropertyModalOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                                    ✕
                                </button>
                            </div>

                            <div className="modal-rounded-body dark-modal-scroll" style={{ flex: 1, padding: '24px 36px 36px' }}>
                                <form onSubmit={handleSavePropertyForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
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
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Region / Location Header
                                            </label>
                                            <select
                                                value={propertyForm.region}
                                                onChange={e => setPropertyForm({ ...propertyForm, region: e.target.value })}
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: '#08120A', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13.5px' }}
                                            >
                                                <option value="Munnar">Munnar High Peaks</option>
                                                <option value="Suryanelli">Suryanelli Ridge</option>
                                                <option value="Vagamon">Vagamon Pine Hills</option>
                                                <option value="Wayanad">Wayanad Rainforest</option>
                                                <option value="Athirappilly">Athirappilly Rapids</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
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
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Base Price (INR) *
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
                                            <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                                Original Strikethrough Price (INR)
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
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
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
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Highlights & Perks (Comma Separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={propertyForm.highlights}
                                            onChange={e => setPropertyForm({ ...propertyForm, highlights: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-lime" style={{ padding: '15px', fontSize: '15px', fontWeight: '800', marginTop: '10px' }}>
                                        {editingProperty ? 'Save Changes ↗' : 'Publish Campsite Listing ↗'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── CREATE / EDIT EVENT BATCH MODAL ── */}
            <AnimatePresence>
                {isEventModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} style={{ background: '#101E13', border: '1px solid rgba(213, 237, 85, 0.3)', borderRadius: '32px', padding: '36px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: '#FFFFFF', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {editingEvent ? 'Edit Scheduled Event Batch' : 'Create New Event Batch'}
                                </h3>
                                <button onClick={() => setIsEventModalOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveEventForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Perseid Meteor Shower High-Altitude Stargaze Camp"
                                        value={eventForm.title}
                                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Campsite Location
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Kolukkumalai Sunrise Ridge (7,900 FT)"
                                            value={eventForm.campsite}
                                            onChange={e => setEventForm({ ...eventForm, campsite: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Dates & Duration
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Aug 24 – 25, 2026"
                                            value={eventForm.dates}
                                            onChange={e => setEventForm({ ...eventForm, dates: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Ticket Price (INR)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.price}
                                            onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Total Capacity
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={eventForm.capacity}
                                            onChange={e => setEventForm({ ...eventForm, capacity: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                            Current Bookings
                                        </label>
                                        <input
                                            type="number"
                                            value={eventForm.booked}
                                            onChange={e => setEventForm({ ...eventForm, booked: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                        Event Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={eventForm.image}
                                        onChange={e => setEventForm({ ...eventForm, image: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#E5A93B', display: 'block', marginBottom: '6px' }}>
                                        Event Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={eventForm.description}
                                        onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontSize: '13px' }}
                                    />
                                </div>

                                <button type="submit" className="btn-lime" style={{ padding: '15px', fontSize: '15px', fontWeight: '800', marginTop: '10px' }}>
                                    {editingEvent ? 'Save Event Changes ↗' : 'Publish Event Batch ↗'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
