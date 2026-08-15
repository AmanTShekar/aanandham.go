"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import Footer from '../components/Footer';
import SiteHeader from '../components/SiteHeader';
import BookingEngineModal from '../components/BookingEngineModal';
import { useAuth } from '../hooks/useAuth';
import { inr } from '../lib/utils';
import { waLink } from '../lib/whatsapp';

// ── OVERVIEW HIGHLIGHTS DATA (Ref Screenshot 3 Batch 2 - media_1786655246018.png) ──
const OVERVIEW_HIGHLIGHTS = [
    {
        img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
        title: 'Live in a High-Altitude Ridge Tent',
        sub: 'Stay options for solo travelers, couples, and groups'
    },
    {
        img: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1000&q=80',
        title: 'Sunrise Peaks & Cloud Bed Treks',
        sub: 'Guided ridge walks through misty tea valleys'
    },
    {
        img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
        title: 'Acoustic Campfires & Live BBQ',
        sub: 'Starlit night sessions under pristine mountain skies'
    }
];

// ── PROGRAM SCHEDULE DATA (Ref Screenshot 1 Batch 3 - media_1786657185483.png) ──
const PROGRAM_DAYS = [
    {
        day: 'Day 1',
        title: 'Arrival & Meet the Crew',
        desc: 'Arrive at Suryanelli basecamp, welcome herbal drinks, check-in to high-altitude dome pods, sunset orientation, and welcome campfire barbecue dinner.',
        img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80'
    },
    {
        day: 'Day 2',
        title: 'First Waves & Cloud Ridge Vibes',
        desc: 'Dawn breathwork, 4x4 Jeep trail to Kolukkumalai tea estate sunrise, cliff-edge breakfast, and guided trek along the misty Tiger Rock ridge.',
        img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
    },
    {
        day: 'Day 3',
        title: 'Trek Progress & Stargazing Deck',
        desc: 'Intermediate ridge navigation workshop, wilderness trail pacing, tea factory heritage tour, and starlit open-mic acoustic campfire circle.',
        img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
    },
    {
        day: 'Day 4',
        title: 'Spice Valley & Culture Day',
        desc: 'Visit ancient mountain hamlets, spice plantation foraging, authentic forest-to-table lunch, and evening recovery yoga under the pine groves.',
        img: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80'
    },
    {
        day: 'Day 5',
        title: 'Summit & Waterfall Rapids',
        desc: 'Full-day wilderness expedition to hidden rainforest waterfalls, natural rock pool swimming, bamboo raft rapid crossing, and celebration night BBQ.',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    },
    {
        day: 'Day 6',
        title: 'Sunrise Breathwork & Farewell',
        desc: 'Final sunrise meditation over rolling clouds, hearty Kerala breakfast, gear wrap-up, and departure with lifetime memories and your new tribe.',
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
    }
];

// ── WHY AANANDHAM.GO PILLARS DATA (Expedition Tag Field Notes) ──
const WHY_AANANDHAM_PILLARS = [
    {
        id: 'safety',
        badge: '100% Verified Safe',
        serial: 'EXP-TAG · 01',
        seal: 'VERIFIED SAFE',
        tagline: 'Gated Grounds & En-suite Washrooms',
        title: '100% Female & Family-Safe',
        fullTitle: '100% Female & Family-Safe Campgrounds',
        desc: 'We eliminate the roughness from wilderness camping. Every campsite features private gated perimeters, dedicated on-site female & male coordinators, clean western washrooms with running hot water, and 24/7 power backup.',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        stat: '350+ Solo Female Campers',
        statIcon: '🛡️',
        rotation: '-1.2deg',
        paperBg: '#FFFDF6',
        accentColor: '#166534',
        highlights: ['Gated Private Perimeter', '24/7 Marshals On-Site', 'Modern Western Washrooms & Hot Water', 'Zero-Tolerance Safety Protocol']
    },
    {
        id: 'offroad',
        badge: '7,900 FT Summit Access',
        serial: 'EXP-TAG · 02',
        seal: 'SUMMIT ACCESS',
        tagline: 'Exclusive 4x4 Off-Road Fleet',
        title: 'High-Altitude 4x4 Convoys',
        fullTitle: 'High-Altitude 4x4 Off-Road Convoys',
        desc: 'Our fleet of verified 4x4 off-road Mahindra jeeps takes you through rugged private tea estate tracks, crossing rolling cloud valleys to untouched summit vistas where ordinary transport cannot go.',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        stat: '7,900 FT Highest Camp',
        statIcon: '🚙',
        rotation: '1.4deg',
        paperBg: '#FAF8EE',
        accentColor: '#B45309',
        highlights: ['Verified 4x4 Convoy Fleet', 'Professional Mountain Drivers', 'Private Tea Ridge Permits', 'Sunrise Tiger Rock Access']
    },
    {
        id: 'marshals',
        badge: 'Certified Mountain Guides',
        serial: 'EXP-TAG · 03',
        seal: 'WFA MEDICAL',
        tagline: '1:6 Marshal-to-Camper Ratio',
        title: 'WFA-Certified Local Guides',
        fullTitle: 'WFA-Certified Local Mountain Guides',
        desc: 'Led by Western Ghats natives who grew up traversing these mist valleys. They pace each group with small 1:6 ratios, carrying medical kits, pulse oximeters, and deep indigenous flora and mountain wisdom.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
        stat: '1:6 Marshal-to-Camper Ratio',
        statIcon: '🩺',
        rotation: '-1.0deg',
        paperBg: '#F7FAF4',
        accentColor: '#047857',
        highlights: ['Small 1:6 Marshal Ratio', 'WFA & CPR First Aid Certified', 'Oxygen & Medical Kits on Trail', 'Local Cultural Storytelling']
    },
    {
        id: 'gastronomy',
        badge: 'Live BBQ & Stargazing',
        serial: 'EXP-TAG · 04',
        seal: 'STARLIT BBQ',
        tagline: 'Farm-to-Table Kerala Buffets',
        title: 'Starlit Outdoor Gastronomy',
        fullTitle: 'Starlit Outdoor Gastronomy & Telescopes',
        desc: 'Warm up around roaring campfires at 10°C with smoking hot barbecue platters, traditional Kerala feasts, live acoustic open-mic jams, and zero-light-pollution telescope observation of celestial nebulas.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        stat: '4.98★ Food & Stargaze Rating',
        statIcon: '🔥',
        rotation: '1.2deg',
        paperBg: '#FEF6EE',
        accentColor: '#C2410C',
        highlights: ['Farm-to-Table Kerala Buffets', 'Live Campfire Barbecue', 'Telescope Stargazing Deck', 'Open-Mic Acoustic Vibe']
    }
];

// ── HOLISTIC EXPERIENCE DATA (Ref Screenshot 2 Batch 2 - media_1786655245998.png) ──
const EXPERIENCE_ITEMS = [
    {
        category: 'for body',
        title: 'Yoga and Meditation',
        desc: 'Stretch out your trek-tired muscles with sunset mountain yoga and start your mornings centered with guided meadow meditation sessions. Re-align your posture and breathe in fresh high-altitude pine air.',
        icon: '🧘'
    },
    {
        category: 'for soul',
        title: 'Temples and Ceremonies',
        desc: 'Experience Western Ghats spiritual side through ancient mountain folklore, temple walks, and evening campfire circles where we share what really matters under starlit cloud canopies.',
        icon: '🍃'
    },
    {
        category: 'for mind',
        title: 'Culture and Growth',
        desc: 'Learn the stories behind the spice hills at local tea plantations, meet indigenous valley farmers, and connect over authentic forest-to-table dinners designed for real, deep conversation.',
        icon: '🏔️'
    },
    {
        category: 'for fun',
        title: 'Adventures Together',
        desc: 'Discover hidden natural rock pools, wild river bamboo rafting rapids, and extreme off-road Jeep climbs to misty sunrise viewpoints. Make lifetime bonds with fellow mountain travelers.',
        icon: '🏄'
    }
];

// ── STAY ACCOMMODATIONS DATA (Ref Screenshot 4 Batch 2 - media_1786655246091.png) ──
const STAY_ACCOMMODATIONS = [
    {
        id: 'stay-twin',
        badge: 'Solo / Friends',
        capacity: '2 Beds · 2 Guests',
        title: 'Twin Room',
        desc: 'Spacious double-canvas dome with two plush single beds, thick fleece blankets rated for 8°C, individual charging ports, and private mountain valley patio.',
        mainImg: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80',
        amenities: ['2 Single Beds', 'Fleece Blankets (8°C)', 'Valley Patio', 'Charging Hub']
    },
    {
        id: 'stay-double',
        badge: 'Couples & Privacy',
        capacity: '1 King Bed · 2 Guests',
        title: 'Double Room',
        desc: 'King-sized plush bed for couples or solo travelers who love extra comfort. Panoramic transparent cloud-view window, wooden flooring, and private ensuite bath.',
        mainImg: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
        amenities: ['King Size Bed', 'Cloud View Window', 'Ensuite Bath', 'Wooden Floors']
    },
    {
        id: 'stay-group',
        badge: 'Squad Groups',
        capacity: '4-6 Bunk Pods · Friends',
        title: 'Group Suite',
        desc: 'Spacious multi-person cabin tent equipped for 4-6 friends. Includes custom bunk setup, private campfire sit-out, and luggage storage lockers.',
        mainImg: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=400&q=80',
        amenities: ['4-6 Bunk Beds', 'Campfire Sit-out', 'Lockers', 'Luggage Bay']
    },
    {
        id: 'stay-common',
        badge: 'Camp Clubhouse',
        capacity: 'Open to All Campers',
        title: 'Common Areas',
        desc: 'Private pool, rooftop terrace with ridge views, fully equipped camp kitchen, coworking space, outdoor lounge zones, gear storage, and live BBQ area. Everything you need between sessions.',
        mainImg: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
        amenities: ['Ridge Terrace', 'Campfire Circle', 'Camp Kitchen', 'Coworking Hub']
    }
];

// ── EXPEDITION PACKAGES (Expanded 8 Signature Campsites) ──
const EXPEDITION_PACKAGES = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise & Cloud Bed Ridge Glamp',
        category: 'Trek & Glamp',
        tag: 'Most Popular',
        location: 'Suryanelli, Munnar',
        altitude: '7,900 FT Altitude',
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Ridge Trail',
        price: 2499,
        originalPrice: 3200,
        rating: 4.98,
        reviewsCount: 342,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        description: 'Perched above the rolling cloud beds of Suryanelli. Includes high-altitude Quechua dome pods, private 4x4 Jeep climb to world’s highest tea estate sunrise, and campfire barbecue.',
        highlights: ['Kolukkumalai Sunrise 4x4 Jeep Safari', 'Tiger Rock High Ridge Walk', 'Acoustic Campfire & Live BBQ Dinner', 'Weatherproof Quechua Dome Tents', 'Forest Entry Permits & Guide Marshals']
    },
    {
        id: 'pkg-meesapulimala',
        title: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        category: 'Summit Trek',
        tag: 'High Peak Challenge',
        location: 'Silent Valley, Munnar',
        altitude: '8,661 FT Summit',
        duration: '2 Days / 1 Night',
        difficulty: 'Strenuous High Peak',
        price: 3199,
        originalPrice: 4200,
        rating: 4.99,
        reviewsCount: 264,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        description: 'South India’s 2nd highest peak expedition. Trek through 8 rolling high-altitude hills, endless rhododendron valleys, and experience sleeping above dense oceans of white clouds.',
        highlights: ['8-Peak Ridge Crossing', 'High Altitude Basecamp Pods', 'Certified Wilderness Marshals', 'Campfire Acoustic Night', 'Rhododendron Valley Trail']
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Ridge Geodesic Glamping',
        category: 'Trek & Glamp',
        tag: 'Couples & Squads',
        location: 'Suryanelli, Idukki',
        altitude: '6,500 FT Altitude',
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Ridge Walk',
        price: 1999,
        originalPrice: 2600,
        rating: 4.95,
        reviewsCount: 286,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        description: 'Private geodesic dome pods facing cascading green tea slopes and misty sunset valleys. Live acoustic sessions, star observation scopes, and authentic farm-to-table Kerala dining.',
        highlights: ['Geodesic Dome Glamping', 'Private Valley Deck', 'Campfire Acoustic Jams', 'Sunset Ridge Walk', 'Hot Breakfast Included']
    },
    {
        id: 'pkg-phantom',
        title: 'Phantom Head Peak & Golden Hour Sunset Trek',
        category: 'Summit Trek',
        tag: 'Sunset Vista',
        location: 'Munnar Ridge, Kerala',
        altitude: '6,800 FT Peak',
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Trek',
        price: 1799,
        originalPrice: 2400,
        rating: 4.91,
        reviewsCount: 195,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        description: '360-degree panoramic golden hour peak overlooking the Western Ghats mountain layers. Guided evening cliff walk, campfire dinner, and high-altitude tent stay.',
        highlights: ['360° Mountain Panorama', 'Golden Hour Sunset Peak', 'High-Altitude Tent Stay', 'Guided Marshals', 'Campfire Dinner']
    },
    {
        id: 'pkg-chembra',
        title: 'Wayanad Chembra Peak & Heart Lake Expedition',
        category: 'Summit Trek',
        tag: 'Summit Challenge',
        location: 'Meppadi, Wayanad',
        altitude: '6,900 FT Peak',
        duration: '3 Days / 2 Nights',
        difficulty: 'High Endurance Peak',
        price: 3799,
        originalPrice: 4800,
        rating: 4.95,
        reviewsCount: 218,
        image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&q=80',
        description: 'Trek through dense Western Ghats rainforest canopies, discover the legendary perennial heart-shaped mountain lake, and sleep under millions of stars in secluded estate pods.',
        highlights: ['Chembra Peak & Heart Lake Trek', 'Banasura Sagar Dam Kayaking', 'Rainforest Canopy Night Safari', 'Zero-Trace Wilderness Campout', 'Natural Rock Pool Swimming']
    },
    {
        id: 'pkg-wayanad',
        title: 'Wayanad 900 Kandi Rainforest Glass Bridge Glamp',
        category: 'Water & Wild',
        tag: 'Canopy Glamp',
        location: 'Meppadi, Wayanad',
        altitude: '3,200 FT Rainforest',
        duration: '2 Days / 1 Night',
        difficulty: 'Jungle Trail',
        price: 2699,
        originalPrice: 3500,
        rating: 4.96,
        reviewsCount: 220,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        description: 'Glass bridge canopy walks, off-road 4x4 jeep safaris into deep evergreen jungle, natural rock-pool swimming, and treehouse canopy stays.',
        highlights: ['Glass Bridge Access', '4x4 Deep Forest Safari', 'Natural Stream Swims', 'Treehouse Glamp Villa', 'Tribal Dinner Feast']
    },
    {
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        category: 'Camp & Relax',
        tag: 'Relax & Chill',
        location: 'Pine Forest, Vagamon',
        altitude: '4,800 FT Valley',
        duration: '2 Days / 1 Night',
        difficulty: 'Easy / Family & Friends',
        price: 2199,
        originalPrice: 2900,
        rating: 4.92,
        reviewsCount: 184,
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
        description: 'Unwind in the misty pine groves of Vagamon. Perfect for acoustic campfire jams, off-road trails, starlit barbecues, and refreshing morning walks through tea valleys.',
        highlights: ['Pine Forest Glamping Site', 'Off-Road Jeep Trail to Kurisumala', 'Sunset at Vagamon Rolling Meadows', 'Open-Mic Acoustic Campfire', 'Live Barbecue Station']
    },
    {
        id: 'pkg-athirappilly',
        title: 'Athirappilly Jungle Rapids & Riverbank Glamping',
        category: 'Water & Wild',
        tag: 'Rainforest River',
        location: 'Chalakudy River, Athirappilly',
        altitude: '1,200 FT River Valley',
        duration: '2 Days / 1 Night',
        difficulty: 'Easy River Trails',
        price: 2499,
        originalPrice: 3400,
        rating: 4.89,
        reviewsCount: 156,
        image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80',
        description: 'Experience Kerala’s grandest rainforest river cascades. Natural rock-pool swims, river kayaking, birding walks in hornbill sanctuaries, and riverside luxury canvas tents.',
        highlights: ['Private River Stream Access', 'Canoeing & Kayak Equipment', 'Night Forest Insect & Hornbill Walk', 'Bamboo Raft Stream Ride', 'Forest-to-Table Kerala Feast']
    }
];

// ── KERALA WILDERNESS & CAMPSITES DATA ──
const KERALA_WILDERNESS_GALLERY = [
    {
        id: 'kolukkumalai',
        name: 'Kolukkumalai Sunrise Ridge',
        location: 'Munnar, Kerala',
        altitude: '7,900 FT',
        category: 'High-Altitude 4x4 Safari',
        img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        badge: 'Highest Organic Tea Camp'
    },
    {
        id: 'suryanelli',
        name: 'Suryanelli Valley Glamp Pods',
        location: 'Suryanelli, Idukki',
        altitude: '6,500 FT',
        category: 'Private Ridge Glamping',
        img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        badge: 'Starlit Pod Stays'
    },
    {
        id: 'phantom-head',
        name: 'Phantom Head Peak & Ridge',
        location: 'Munnar, Kerala',
        altitude: '6,800 FT',
        category: 'Guided Sunset Trek',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        badge: '360° Mountain Vista'
    },
    {
        id: 'anayirangal',
        name: 'Anayirangal Lake Mist Campsite',
        location: 'Munnar Valley, Kerala',
        altitude: '5,500 FT',
        category: 'Lakeside Wilderness',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        badge: 'Elephant Corridor Views'
    },
    {
        id: 'vagamon',
        name: 'Vagamon Pine Valley Meadows',
        location: 'Vagamon, Idukki',
        altitude: '4,800 FT',
        category: 'Pine Forest Glamping',
        img: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
        badge: 'Fog & Mist Trails'
    },
    {
        id: 'wayanad',
        name: 'Wayanad 900 Kandi Rain Canopy',
        location: 'Wayanad, Kerala',
        altitude: '3,200 FT',
        category: 'Canopy & Treehouse Treks',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        badge: 'Deep Rainforest'
    }
];

// ── CUSTOM ARRANGEMENTS & EVENTS DATA (Roughed-Up Scotch-Taped Paper Scraps) ──
const EVENT_ARRANGEMENTS = [
    {
        tagCode: 'SCRAP · 01',
        stamp: '✓ SQUAD EXPEDITION',
        stampColor: '#B45309',
        accentColor: '#D97706',
        btnBg: '#E5A93B',
        iconClass: 'fa-solid fa-graduation-cap',
        title: 'College & Youth Expeditions',
        badge: 'Squad Groups (10-80 pax)',
        desc: 'Curated high-energy student treks with budget-friendly tents, acoustic campfires, guided ridge hikes, and dedicated safety marshals.',
        rotation: '-2.2deg',
        tapeAngle: '-3deg',
        paperBg: '#FFF9E8',
        borderTint: 'rgba(217, 119, 6, 0.3)',
        statPill: '✦ 10-80 Pax Capacity',
        marginalNote: 'Direct 4x4 convoy pickup from Munnar town.',
        features: ['Discounted group rates', '4x4 Convoy coordination', 'Campfire & acoustic mic setup', 'Strict safety & medical support']
    },
    {
        tagCode: 'SCRAP · 02',
        stamp: '✓ OFFSITE PRO',
        stampColor: '#047857',
        accentColor: '#059669',
        btnBg: '#10B981',
        iconClass: 'fa-solid fa-building',
        title: 'Corporate Ridge Offsites',
        badge: 'Team Building & Strategy',
        desc: 'Step out of boardrooms into the clouds. High-altitude glamping, off-road team challenges, outdoor strategy sessions, and curated dining.',
        rotation: '2.5deg',
        tapeAngle: '2.8deg',
        paperBg: '#EDF8EE',
        borderTint: 'rgba(16, 185, 129, 0.3)',
        statPill: '✦ Custom Schedules',
        marginalNote: 'Projector & presentation setups under starlight.',
        features: ['Executive glamp suites', 'Outdoor team-building games', 'Projector & sound gear', 'Custom chef-curated menus']
    },
    {
        tagCode: 'SCRAP · 03',
        stamp: '✓ SOLO TRIBE',
        stampColor: '#C2410C',
        accentColor: '#EA580C',
        btnBg: '#F97316',
        iconClass: 'fa-solid fa-campground',
        title: 'Strangers Camp Meet',
        badge: 'Weekend Community Camp',
        desc: 'Travel alone and leave with a tribe. Safe, vibrant weekend camps where solo travelers bond over stargazing, icebreakers, and ridge sunrises.',
        rotation: '-1.8deg',
        tapeAngle: '-2.2deg',
        paperBg: '#FFF1E8',
        borderTint: 'rgba(234, 88, 12, 0.3)',
        statPill: '✦ 45%+ Solo Attendees',
        marginalNote: 'Dedicated female camp leads & safe grounds.',
        features: ['Icebreaker games & trails', 'Dedicated female marshals', 'Telescope stargazing deck', 'Instant tribe WhatsApp group']
    },
    {
        tagCode: 'SCRAP · 04',
        stamp: '✓ BESPOKE',
        stampColor: '#7E22CE',
        accentColor: '#9333EA',
        btnBg: '#A855F7',
        iconClass: 'fa-solid fa-fire',
        title: 'Private Ridge Celebrations',
        badge: 'Bespoke Arrangements',
        desc: 'Celebrate birthdays, pre-weddings, and milestones amidst mist and mountain ridges with drone cinematography and starlit barbecue dinners.',
        rotation: '2.1deg',
        tapeAngle: '3.5deg',
        paperBg: '#F8EEFC',
        borderTint: 'rgba(147, 51, 234, 0.3)',
        statPill: '✦ 100% Ridge Privacy',
        marginalNote: '4K Drone cinematography options included.',
        features: ['Exclusive campsite buyout', '4K Drone aerial coverage', 'Acoustic guitarist on request', 'Fairy light & candlelit dinner']
    }
];

// ── 4-STEP BOOKING PROCESS (Ref Screenshot 3 - media_1786656749498.png) ──
const FOUR_STEPS = [
    {
        num: '01',
        title: 'Choose your signature campsite',
        desc: 'Select from high-altitude geodesic dome pods, weatherproof alpine tents, or lakeside ridge glamps tailored for couples, solo travelers, and squads.'
    },
    {
        num: '02',
        title: 'Reserve dates & custom add-ons',
        desc: 'Pick your check-in weekend and personalize your journey with live campfire barbecue platters, private 4x4 off-road convoys, or mountain yoga.'
    },
    {
        num: '03',
        title: 'Confirm booking & receive permits',
        desc: 'Secure your pass with instant confirmation. You’ll receive a verified arrival kit, packing checklist, and direct WhatsApp coordinator access.'
    },
    {
        num: '04',
        title: 'Reach basecamp & conquer peaks',
        desc: 'Arrive at our verified basecamp in Munnar or Wayanad. Our 4x4 Jeep convoy and certified Wilderness First Aid marshals take care of all gear, meals, campfire setups, and guided summit trails — just show up ready for adventure!'
    }
];

// ── TESTIMONIALS DATA (Ref Screenshot 5 - media_1786656749593.png) ──
const TESTIMONIALS = [
    {
        id: 1,
        quote: "Best decision I made this year. I was burnt out from work and needed a reset – this camp delivered exactly that. The mountain marshals really know their stuff, the vibe is super chill, and I made friends from all over the country. Experiencing the Kolukkumalai cloud sunrise above 7,900 FT was unforgettable.",
        author: "Daniel Kim",
        campBadge: "camp '25",
        batchDate: "Aanandham, August 2025",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: 2,
        quote: "I was nervous about traveling alone as a female solo camper, but this crew made me feel safe and at home immediately. We trekked every morning, explored the peaks, and had the kind of deep conversations around the campfire you remember for life.",
        author: "Emma Rodriguez",
        campBadge: "camp '25",
        batchDate: "Aanandham, March 2025",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: 3,
        quote: "Unmatched wilderness comfort. We organized a 24-member corporate team offsite at the Suryanelli ridge. Clean private western washrooms, delicious hot barbecue at 12°C, and the 4x4 jeep safari was pure adrenaline. Outstanding organization.",
        author: "Karthik & Tribe",
        campBadge: "camp '25",
        batchDate: "Aanandham, November 2025",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: 4,
        quote: "The heart-shaped lake at Chembra Peak took my breath away. Our trek leader paced the entire group patiently, carried medical kits, and pointed out endemic bird species. The food at basecamp felt just like home-cooked Kerala Sadhya.",
        author: "Dr. Sneha Pillai",
        campBadge: "camp '26",
        batchDate: "Aanandham, January 2026",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    }
];

// ── FAQ DATA (Ref Screenshot 2 - media_1786656749472.png) ──
const FAQ_DATA = [
    {
        id: 'faq-01',
        num: '01',
        question: 'Do I need prior high-altitude trekking or camping experience?',
        answer: 'Not at all! We offer beginner-friendly ridge glamping and scenic walks as well as moderate to challenging summit climbs. Every expedition is guided by certified Wilderness First Aid trek marshals who pace the hike according to the group’s comfort.'
    },
    {
        id: 'faq-02',
        num: '02',
        question: "I'm traveling alone – will I feel out of place?",
        answer: 'Over 45% of our campers and trekkers join solo! Our community-driven Strangers Camp format, shared campfire BBQ, and group icebreaker games make it effortless to meet like-minded nature enthusiasts and build lasting friendships.'
    },
    {
        id: 'faq-03',
        num: '03',
        question: "What's not included in the price?",
        answer: 'The package covers your campsite accommodation, all meals (BBQ dinner + morning breakfast), 4x4 Jeep transfers, guide fees, and forest department entry permits. Personal travel to the basecamp meeting point and personal porterage are not included.'
    },
    {
        id: 'faq-04',
        num: '04',
        question: 'What if the dates don’t work for me?',
        answer: 'We organize custom private batches for groups of 4 or more on any weekday or weekend of the year! Simply reach out to our expedition desk via the Custom Arrangements form or WhatsApp, and we will tailor dates and itineraries for you.'
    },
    {
        id: 'faq-05',
        num: '05',
        question: 'Is the camp safe for travelers?',
        answer: '100% yes. We enforce strict zero-tolerance safety policies, maintain 24/7 on-site female and male camp coordinators, provide private enclosed western washrooms, and station staff at all perimeter points throughout the night.'
    },
    {
        id: 'faq-06',
        num: '06',
        question: 'Can I extend my stay at the villa / glamp?',
        answer: 'Absolutely! You can easily extend your stay at our tea estate glamping pods or combine a high-altitude Kolukkumalai sunrise trek with Vagamon paragliding or Wayanad bamboo rafting. Let us know during booking!'
    }
];

// ── REUSABLE FRAMER MOTION ULTRA-CLEAN VARIANTS ──
const sectionReveal = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const cardReveal = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -28 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 28 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
};

// ── CTA PARALLAX BANNER WITH SCROLL-DRIVEN ZOOM & DEPTH ACTION ──
function CtaParallaxBanner({ onOpenBooking, defaultPackage }) {
    const bannerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: bannerRef,
        offset: ["start end", "end start"]
    });
    
    // Smooth scroll-driven zoom (from 1.0 to 1.25) & vertical shift (-5% to +5%)
    const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.14, 1.28]);
    const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
    const contentY = useTransform(scrollYProgress, [0, 1], [18, -18]);

    return (
        <motion.section 
            ref={bannerRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionReveal}
            id="cta"
            style={{ position: 'relative', padding: '80px clamp(20px, 4vw, 48px) 110px', background: '#F8F9F5' }}
        >
            <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                <div 
                    style={{
                        position: 'relative',
                        borderRadius: '40px',
                        overflow: 'hidden',
                        padding: 'clamp(80px, 10vw, 130px) 32px',
                        textAlign: 'center',
                        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.12)',
                        cursor: 'default'
                    }}
                >
                    {/* Parallax Zooming & Scrolling Action Background */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: '-15%',
                            width: '130%',
                            height: '130%',
                            scale: bgScale,
                            y: bgY,
                            willChange: 'transform'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80"
                            alt="Canopy Wilderness"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(0.68) contrast(1.15)'
                            }}
                        />
                    </motion.div>

                    {/* Radial & Edge Vignette Gradients */}
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14, 24, 17, 0.3) 0%, rgba(14, 24, 17, 0.75) 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.85) 0%, transparent 60%)' }} />

                    {/* Animated Content Layer */}
                    <motion.div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto', y: contentY }}>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            color: '#E5A93B',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            padding: '6px 18px',
                            borderRadius: '999px',
                            border: '1px solid rgba(213, 237, 85, 0.3)',
                            backdropFilter: 'blur(8px)',
                            marginBottom: '18px'
                        }}>
                            <span>★</span> READY FOR THE EXPEDITION?
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(32px, 5vw, 54px)',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            letterSpacing: '-0.035em',
                            lineHeight: 1.15,
                            marginBottom: '32px'
                        }}>
                            Reserve your spot and <span className="text-marker-dark-2">join the adventure</span> today
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <motion.button
                                whileHover={{ scale: 1.06, boxShadow: '0 12px 35px rgba(213, 237, 85, 0.4)' }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => onOpenBooking(defaultPackage)}
                                style={{
                                    background: '#E5A93B',
                                    color: '#121613',
                                    border: 'none',
                                    padding: '16px 48px',
                                    borderRadius: '999px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span>Instant Reserve Spot ↗</span>
                            </motion.button>
                            <a
                                href={waLink('Hi Aanandham Team! I want to reserve a spot for the upcoming wilderness camp.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp-glass"
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '19px', color: '#25D366' }}></i>
                                <span>WhatsApp Helpdesk</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}

// Isolated high-performance Scroll Progress Indicator (0 parent re-renders)
function ScrollProgressBar() {
    const barRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (barRef.current) {
                        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                        if (totalHeight > 0) {
                            const scale = Math.min(1, Math.max(0, window.scrollY / totalHeight));
                            barRef.current.style.transform = `scaleX(${scale})`;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="scroll-progress-container">
            <div 
                ref={barRef}
                className="scroll-progress-bar" 
                style={{ 
                    transform: 'scaleX(0)', 
                    transformOrigin: '0% 50%',
                    willChange: 'transform' 
                }} 
            />
        </div>
    );
}

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const scrolledRef = useRef(false);
    const [selectedLightboxImg, setSelectedLightboxImg] = useState(null);
    const [expandedPackageId, setExpandedPackageId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [activeDayIdx, setActiveDayIdx] = useState(0);
    const [expandedDayIdx, setExpandedDayIdx] = useState(0);
    const [activeWhyIdx, setActiveWhyIdx] = useState(0);
    const [activeStayAcc, setActiveStayAcc] = useState(0);
    const [activeFaq, setActiveFaq] = useState(0);
    const [highlightIdx, setHighlightIdx] = useState(0);
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(EXPEDITION_PACKAGES[0]);
    const { user: currentUser, logout } = useAuth();

    // Floating Mouse-Follow Preview Card State for Program Section
    const programContainerRef = useRef(null);
    const [hoveredProgramDay, setHoveredProgramDay] = useState(null);
    const programMouseX = useMotionValue(0);
    const programMouseY = useMotionValue(0);
    const smoothProgramX = useSpring(programMouseX, { stiffness: 420, damping: 30 });
    const smoothProgramY = useSpring(programMouseY, { stiffness: 420, damping: 30 });

    const handleProgramMouseMove = (e) => {
        if (!programContainerRef.current) return;
        const rect = programContainerRef.current.getBoundingClientRect();
        programMouseX.set(e.clientX - rect.left);
        programMouseY.set(e.clientY - rect.top);
    };

    // Mobile Horizontal Slider Scroll Tracker for Packages Preview
    const packagesSliderRef = useRef(null);
    const [activePackageSlideIdx, setActivePackageSlideIdx] = useState(0);
    const handlePackageSliderScroll = () => {
        if (!packagesSliderRef.current) return;
        const scrollLeft = packagesSliderRef.current.scrollLeft;
        const width = packagesSliderRef.current.offsetWidth;
        const newIdx = Math.round(scrollLeft / (width * 0.86));
        if (newIdx >= 0 && newIdx < filteredPackages.length && newIdx !== activePackageSlideIdx) {
            setActivePackageSlideIdx(newIdx);
        }
    };

    // Mobile Horizontal Slider Scroll Tracker for Kerala Wilderness Grid
    const wildernessSliderRef = useRef(null);
    const [activeWildernessIdx, setActiveWildernessIdx] = useState(0);
    const handleWildernessSliderScroll = () => {
        if (!wildernessSliderRef.current) return;
        const scrollLeft = wildernessSliderRef.current.scrollLeft;
        const width = wildernessSliderRef.current.offsetWidth;
        const newIdx = Math.round(scrollLeft / (width * 0.82));
        if (newIdx >= 0 && newIdx < KERALA_WILDERNESS_GALLERY.length && newIdx !== activeWildernessIdx) {
            setActiveWildernessIdx(newIdx);
        }
    };

    // High-precision trigger-line scroll-driven auto-activation for Stay, Program & Skill Levels Deck
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let ticking = false;
        const checkScrollInView = () => {
            const windowH = window.innerHeight;
            const triggerY = window.innerWidth <= 900 ? windowH * 0.52 : windowH * 0.48;

            // 1. Program Expedition Days Auto-Activation (Scoped to when Program section is near/in viewport)
            const programSection = document.getElementById('program');
            if (programSection) {
                const pRect = programSection.getBoundingClientRect();
                if (pRect.top <= windowH * 0.90 && pRect.bottom >= 0) {
                    const programElements = programSection.querySelectorAll('[data-program-day-idx]');
                    let activeProgramIndex = -1;
                    let minDistance = Infinity;
                    programElements.forEach((el) => {
                        const idx = parseInt(el.getAttribute('data-program-day-idx'), 10);
                        if (isNaN(idx)) return;
                        const rect = el.getBoundingClientRect();
                        const cardCenter = rect.top + rect.height / 2;
                        const dist = Math.abs(cardCenter - triggerY);
                        if (dist < minDistance && rect.bottom > 80 && rect.top < windowH - 80) {
                            minDistance = dist;
                            activeProgramIndex = idx;
                        }
                    });
                    if (activeProgramIndex >= 0) {
                        setExpandedDayIdx((prev) => (prev !== activeProgramIndex ? activeProgramIndex : prev));
                    }
                }
            }

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(checkScrollInView);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('touchmove', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // Initial triggers
        checkScrollInView();
        const t1 = setTimeout(checkScrollInView, 200);
        const t2 = setTimeout(checkScrollInView, 600);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('touchmove', onScroll);
            window.removeEventListener('resize', onScroll);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    // Read logged-in user profile from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('aanandham_user') || sessionStorage.getItem('aanandham_user');
            if (saved) {
                setCurrentUser(JSON.parse(saved));
            }
        } catch (e) {}
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem('aanandham_user');
            sessionStorage.removeItem('aanandham_user');
        } catch (e) {}
        setCurrentUser(null);
        setIsAccountMenuOpen(false);
    };

    // Threshold-gated scroll listener (Only fires state updates when crossing 40px boundary)
    useEffect(() => {
        const handleScroll = () => {
            const isPast = window.scrollY > 40;
            if (isPast !== scrolledRef.current) {
                scrolledRef.current = isPast;
                setScrolled(isPast);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Disable background page scrolling when modals are open
    useEffect(() => {
        if (isVideoModalOpen || selectedLightboxImg || isBookingModalOpen) {
            window.__lenis?.stop();
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                window.__lenis?.start();
                document.body.style.overflow = originalOverflow || '';
            };
        }
    }, [isVideoModalOpen, selectedLightboxImg, isBookingModalOpen]);

    const filteredPackages = activeTab === 'All' 
        ? EXPEDITION_PACKAGES 
        : EXPEDITION_PACKAGES.filter(pkg => {
            const cat = (pkg.category || '').toLowerCase();
            const tag = (pkg.tag || '').toLowerCase();
            const title = (pkg.title || '').toLowerCase();
            if (activeTab === 'Treks') {
                return cat.includes('trek') || cat.includes('summit') || tag.includes('challenge') || tag.includes('summit');
            }
            if (activeTab === 'Glamping') {
                return cat.includes('glamp') || cat.includes('camp') || tag.includes('glamp') || tag.includes('relax') || tag.includes('popular');
            }
            if (activeTab === 'Water') {
                return cat.includes('water') || cat.includes('wild') || tag.includes('river') || title.includes('lake') || title.includes('rapids') || title.includes('water');
            }
            return true;
        });

    const nextTestimonial = () => setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    const prevTestimonial = () => setTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
    const nextHighlight = () => setHighlightIdx((prev) => (prev + 1) % OVERVIEW_HIGHLIGHTS.length);
    const prevHighlight = () => setHighlightIdx((prev) => (prev === 0 ? OVERVIEW_HIGHLIGHTS.length - 1 : prev - 1));
    
    const nextWhyPillar = () => setActiveWhyIdx((prev) => (prev + 1) % WHY_AANANDHAM_PILLARS.length);
    const prevWhyPillar = () => setActiveWhyIdx((prev) => (prev === 0 ? WHY_AANANDHAM_PILLARS.length - 1 : prev - 1));

    const handleOpenBooking = (pkg) => {
        setSelectedPackage(pkg);
        setIsBookingModalOpen(true);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        const text = `Hi Aanandham Team! I would like to reserve a spot for *${formData.packageName}*.\nName: ${formData.name}\nPhone: ${formData.phone}\nGuests: ${formData.guests}\nDate: ${formData.date}\nNotes: ${formData.notes}`;
        const encoded = encodeURIComponent(text);
        setTimeout(() => {
            window.open(`https://wa.me/919400987654?text=${encoded}`, '_blank');
        }, 300);
    };

    const schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Campground',
                '@id': 'https://aanandham.in/#campground',
                'name': 'Aanandham.go Wilderness Camps',
                'url': 'https://aanandham.in',
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': '4.98',
                    'reviewCount': '342',
                    'bestRating': '5',
                    'worstRating': '1'
                }
            },
            {
                '@type': 'ItemList',
                'name': 'Aanandham.go Wilderness Expeditions & Camp Packages',
                'itemListElement': EXPEDITION_PACKAGES.map((pkg, idx) => ({
                    '@type': 'ListItem',
                    'position': idx + 1,
                    'item': {
                        '@type': 'Product',
                        'name': pkg.title,
                        'description': pkg.description,
                        'image': pkg.image,
                        'offers': {
                            '@type': 'Offer',
                            'price': pkg.price,
                            'priceCurrency': 'INR',
                            'availability': 'https://schema.org/InStock',
                            'url': 'https://aanandham.in/#packages'
                        },
                        'aggregateRating': {
                            '@type': 'AggregateRating',
                            'ratingValue': pkg.rating.toString(),
                            'reviewCount': pkg.reviewsCount.toString()
                        }
                    }
                }))
            },
            {
                '@type': 'FAQPage',
                'mainEntity': FAQ_DATA.map(f => ({
                    '@type': 'Question',
                    'name': f.question,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': f.answer
                    }
                }))
            }
        ]
    };

    return (
        <div style={{ backgroundColor: '#F8F9F5', color: '#121613', minHeight: '100dvh', position: 'relative' }}>
            
            {/* ── GOOGLE RICH RESULTS STRUCTURED DATA ── */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* ── ACCESSIBILITY: SKIP TO CONTENT LINK ── */}
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* ── SCROLL PROGRESS BAR (0 React Re-renders on Scroll) ── */}
            <ScrollProgressBar />

            {/* ── UNIFIED REUSABLE SITE HEADER ── */}
            <SiteHeader 
                activePage="home" 
                currentUser={currentUser} 
                onLogout={handleLogout} 
            />

            <main id="main-content">

            {/* ─────────────────────────────────────────────────────────────
                HERO SECTION (Defensive viewport units & short screen support)
            ───────────────────────────────────────────────────────────── */}
            <section 
                className="hero-defensive-height"
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 'clamp(90px, 12vh, 130px) 24px clamp(40px, 6vh, 70px)',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2000&q=85")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#FFFFFF'
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(14, 24, 17, 0.35) 0%, rgba(14, 24, 17, 0.85) 100%)'
                }} />

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}
                >
                    
                    {/* Main Headline in Bricolage Grotesque (Defensive fluid clamp) */}
                    <motion.h1 
                        className="hero-headline"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(44px, 7.5vw, 92px)',
                            fontWeight: '800',
                            lineHeight: 1.04,
                            letterSpacing: '-0.04em',
                            color: '#FFFFFF',
                            marginBottom: 'clamp(18px, 3vh, 32px)'
                        }}
                    >
                        <span className="text-hover-marker text-hover-marker-dark" style={{ cursor: 'pointer', display: 'inline-block' }}>
                            <span className="marker-text">
                                Aanandham<span style={{ color: '#E5A93B' }}>.go</span>
                            </span>
                        </span>
                        <br />Wilderness Camp
                    </motion.h1>

                    {/* Quick Action Button Cluster */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '14px',
                            marginBottom: 'clamp(24px, 5vh, 50px)'
                        }}
                    >
                        {/* Primary Explore Stays Button */}
                        <a
                            href="#packages"
                            className="btn-lime"
                            style={{
                                padding: '14px 34px',
                                fontSize: '15px',
                                textDecoration: 'none',
                                boxShadow: '0 10px 30px rgba(213, 237, 85, 0.3)'
                            }}
                        >
                            ⛺ Explore Stays & Camps ↗
                        </a>

                        {/* Translucent Learn More Button */}
                        <a
                            href="#overview"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                color: '#FFFFFF',
                                padding: '13px 30px',
                                borderRadius: '999px',
                                fontWeight: '600',
                                fontSize: '15px',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                        >
                            Learn More ↓
                        </a>

                        {/* Live Instagram Handle Pill */}
                        <a
                            href="https://instagram.com/aanandham.go"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-instagram-btn"
                        >
                            <i className="fa-brands fa-instagram" style={{ fontSize: '16px' }}></i>
                            <span>@aanandham.go</span>
                        </a>
                    </motion.div>

                    {/* Bottom Counter */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'baseline',
                            gap: '10px'
                        }}
                    >
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '28px',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            letterSpacing: '-0.5px'
                        }}>
                            15,000+
                        </span>
                        <span style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '500'
                        }}>
                            Happy Campers & Explorers hosted across Western Ghats
                        </span>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── LIVE BASECAMP MARQUEE TICKER ── */}
            <div className="marquee-container" aria-hidden="true">
                <div className="marquee-track">
                    {[
                        { icon: '★', label: '6,500 FT HIGH-ALTITUDE RIDGE', highlight: true },
                        { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 JEEP EXPEDITIONS' },
                        { icon: '🔥', label: 'STARLIT CAMPFIRE & LIVE BARBECUE' },
                        { icon: '⛺', label: '100% PRIVATE & FEMALE-FRIENDLY PODS', highlight: true },
                        { icon: '🥾', label: 'GUIDED PHANTOM HEAD PEAK TRAILS' },
                        { icon: '🧘', label: 'SUNRISE PRANAYAMA & MOUNTAIN YOGA' },
                        { icon: '🔭', label: 'ZERO LIGHT-POLLUTION STARGAZING', highlight: true },
                        { icon: '🚙', label: 'VERIFIED OFF-ROAD SAFARI FLEET' },
                        { icon: '★', label: '6,500 FT HIGH-ALTITUDE RIDGE', highlight: true },
                        { icon: '🌅', label: 'KOLUKKUMALAI SUNRISE 4X4 JEEP EXPEDITIONS' },
                        { icon: '🔥', label: 'STARLIT CAMPFIRE & LIVE BARBECUE' },
                        { icon: '⛺', label: '100% PRIVATE & FEMALE-FRIENDLY PODS', highlight: true },
                        { icon: '🥾', label: 'GUIDED PHANTOM HEAD PEAK TRAILS' },
                        { icon: '🧘', label: 'SUNRISE PRANAYAMA & MOUNTAIN YOGA' },
                        { icon: '🔭', label: 'ZERO LIGHT-POLLUTION STARGAZING', highlight: true },
                        { icon: '🚙', label: 'VERIFIED OFF-ROAD SAFARI FLEET' }
                    ].map((item, idx) => (
                        <div key={idx} className="marquee-item">
                            <span>{item.icon}</span>
                            <span className={item.highlight ? 'highlight' : ''}>{item.label}</span>
                            <span style={{ opacity: 0.3 }}>·</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                1. OVERVIEW SECTION (Ref Screenshot 3 Batch 2 - media_1786655246018.png)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="overview" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="overview-3col-grid">
                        
                        {/* Left Column */}
                        <motion.div variants={fadeInLeft} style={{ width: '100%' }}>
                            <div className="star-badge">
                                <span className="star-icon">★</span> OVERVIEW
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4vw, 46px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.2,
                                marginBottom: '20px'
                            }}>
                                Spend a week living in a <br />
                                <span className="text-marker-2">trekker's paradise</span> — <span style={{ color: '#8E9B92', fontWeight: '700' }}>Kerala</span>
                            </h2>

                            {/* 3 Checkmark Pills */}
                            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#121613', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-check" style={{ color: '#121613' }}></i> Misty Peaks
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#121613', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-check" style={{ color: '#121613' }}></i> Cloud Beds
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#121613', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-check" style={{ color: '#121613' }}></i> Campfire Culture
                                </span>
                            </div>

                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '32px' }}>
                                Western Ghats has drawn nature explorers for decades: a legendary destination with trails for every level. Trek every day, explore the cloud valleys, and connect with people from all around the world. This is the kind of trip that stays with you long after you leave.
                            </p>

                            <button
                                onClick={() => handleOpenBooking(EXPEDITION_PACKAGES[0])}
                                className="action-arrow-btn"
                            >
                                <span>Join The Camp</span>
                                <div className="btn-arrow-circle">
                                    ↗
                                </div>
                            </button>
                        </motion.div>

                        {/* Center Highlight Image */}
                        <motion.div 
                            variants={cardReveal}
                            className="card-img-zoom"
                            style={{ 
                                position: 'relative', 
                                height: 'clamp(360px, 48vh, 500px)', 
                                width: '100%',
                                borderRadius: '32px', 
                                overflow: 'hidden', 
                                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)' 
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={highlightIdx}
                                    src={OVERVIEW_HIGHLIGHTS[highlightIdx].img}
                                    alt={OVERVIEW_HIGHLIGHTS[highlightIdx].title}
                                    initial={{ opacity: 0, scale: 1.06 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.9) 0%, transparent 60%)' }} />
                            
                            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ background: 'rgba(0,0,0,0.5)', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                                    trip highlights
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={prevHighlight} 
                                        aria-label="Previous trip highlight"
                                        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                    >
                                        <i className="fa-solid fa-chevron-left" style={{ fontSize: '13px' }}></i>
                                    </button>
                                    <button 
                                        onClick={nextHighlight} 
                                        aria-label="Next trip highlight"
                                        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                    >
                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
                                    </button>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
                                    {OVERVIEW_HIGHLIGHTS[highlightIdx].title}
                                </h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                                    {OVERVIEW_HIGHLIGHTS[highlightIdx].sub}
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Column: Metadata + Quote Card */}
                        <motion.div variants={fadeInRight} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                            
                            {/* Metadata list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(18,22,19,0.08)', paddingBottom: '12px', fontSize: '14px' }}>
                                    <span style={{ color: '#8E9B92', fontWeight: '600' }}>Where</span>
                                    <span style={{ color: '#121613', fontWeight: '800' }}>Munnar, Suryanelli</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(18,22,19,0.08)', paddingBottom: '12px', fontSize: '14px' }}>
                                    <span style={{ color: '#8E9B92', fontWeight: '600' }}>When</span>
                                    <span style={{ color: '#121613', fontWeight: '800' }}>Open Year-Round</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: '#8E9B92', fontWeight: '600' }}>For whom</span>
                                    <span style={{ color: '#121613', fontWeight: '800' }}>All Skill Levels</span>
                                </div>
                            </div>

                            {/* Quote Card */}
                            <div className="hover-lift" style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '28px', padding: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                    alt="Founder"
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginBottom: '18px' }}
                                />
                                <p style={{ fontSize: '15px', color: '#121613', lineHeight: 1.6, marginBottom: '20px', fontWeight: '500' }}>
                                    It started as a trek.<br />
                                    It became a movement. Now we're building a community of adventurers who choose authentic experiences over everything else.
                                </p>
                                <a href="#stories" className="action-arrow-btn" style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <span>Read Our Story</span>
                                    <div className="btn-arrow-circle">
                                        ↗
                                    </div>
                                </a>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                2. WHY AANANDHAM.GO SECTION (Flagship Value & Trust Pillars)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="why-aanandham" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="why-aanandham-grid">
                        
                        {/* Interactive Cinematic Showcase Card (Desktop: Left, Mobile: Below Header/Tabs) */}
                        <motion.div 
                            variants={fadeInLeft}
                            className="why-showcase-col"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeWhyIdx}
                                    src={WHY_AANANDHAM_PILLARS[activeWhyIdx].image}
                                    alt={WHY_AANANDHAM_PILLARS[activeWhyIdx].title}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>

                            {/* Dark Gradient Overlay */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.95) 0%, rgba(14, 24, 17, 0.35) 50%, rgba(14, 24, 17, 0.65) 100%)' }} />

                            {/* Top Left Pillar Badge */}
                            <div style={{
                                position: 'absolute',
                                top: 'clamp(14px, 3vw, 24px)',
                                left: 'clamp(14px, 3vw, 24px)',
                                background: 'rgba(0, 0, 0, 0.65)',
                                color: '#E5A93B',
                                fontSize: '12px',
                                fontWeight: '800',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(229, 169, 59, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E5A93B' }}></span>
                                <span>{WHY_AANANDHAM_PILLARS[activeWhyIdx].badge}</span>
                            </div>

                            {/* Top Right Live Stat Pill */}
                            <div style={{
                                position: 'absolute',
                                top: 'clamp(14px, 3vw, 24px)',
                                right: 'clamp(14px, 3vw, 24px)',
                                background: 'rgba(0, 0, 0, 0.65)',
                                color: '#FFFFFF',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                padding: '6px 14px',
                                borderRadius: '999px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                                {WHY_AANANDHAM_PILLARS[activeWhyIdx].statIcon} {WHY_AANANDHAM_PILLARS[activeWhyIdx].stat}
                            </div>

                            {/* Bottom Content Card & Highlights */}
                            <div className="why-showcase-content" style={{ position: 'absolute', bottom: '26px', left: '26px', right: '26px' }}>
                                <div style={{ fontSize: '11px', color: '#E5A93B', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {WHY_AANANDHAM_PILLARS[activeWhyIdx].tagline}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: '800', color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.25 }}>
                                    {WHY_AANANDHAM_PILLARS[activeWhyIdx].title}
                                </h3>

                                {/* Highlights Pills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                                    {WHY_AANANDHAM_PILLARS[activeWhyIdx].highlights.map((h, idx) => (
                                        <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.14)', color: '#FFFFFF', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '8px', backdropFilter: 'blur(6px)' }}>
                                            ✓ {h}
                                        </span>
                                    ))}
                                </div>

                                {/* Carousel Controls & Indicator */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.18)' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {WHY_AANANDHAM_PILLARS.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveWhyIdx(idx)}
                                                style={{
                                                    width: activeWhyIdx === idx ? '24px' : '8px',
                                                    height: '8px',
                                                    borderRadius: '999px',
                                                    background: activeWhyIdx === idx ? '#E5A93B' : 'rgba(255,255,255,0.3)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.25s ease'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={prevWhyPillar} 
                                            aria-label="Previous reason"
                                            style={{ width: '38px', height: '38px', minWidth: '38px', minHeight: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                        >
                                            <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }}></i>
                                        </button>
                                        <button 
                                            onClick={nextWhyPillar} 
                                            aria-label="Next reason"
                                            style={{ width: '38px', height: '38px', minWidth: '38px', minHeight: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                        >
                                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content & Interactive Feature Pillars (Desktop: Right, Mobile: Top) */}
                        <motion.div variants={fadeInRight} className="why-content-col">
                            <div className="star-badge">
                                <span className="star-icon">★</span> WHY AANANDHAM<span style={{ color: '#E5A93B' }}>.GO</span>
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4.2vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                marginBottom: '16px'
                            }}>
                                The <span className="text-highlight-gold">gold standard</span> in <span style={{ color: '#59655D' }}>Kerala wilderness glamping</span>
                            </h2>

                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '22px' }}>
                                We believe nature should be experienced with <span className="text-highlight-subtle">absolute safety</span>, deep local knowledge, and zero compromise on comfort. From <span className="text-highlight-subtle">7,900 FT cloud ridges</span> to <span className="text-highlight-subtle">private en-suite washrooms</span>, here is why 15,000+ adventurers trust <span className="text-hover-marker" style={{ cursor: 'pointer' }}><span className="marker-text">Aanandham<span style={{ color: '#E5A93B', fontWeight: '800' }}>.go</span></span></span>.
                            </p>

                            {/* Mobile Horizontal Scrollable Pillar Tabs */}
                            <div className="why-mobile-tabs">
                                {WHY_AANANDHAM_PILLARS.map((pillar, idx) => {
                                    const isSelected = activeWhyIdx === idx;
                                    return (
                                        <button
                                            key={pillar.id}
                                            onClick={() => setActiveWhyIdx(idx)}
                                            style={{
                                                flexShrink: 0,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                borderRadius: '999px',
                                                background: isSelected ? '#121613' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#59655D',
                                                border: isSelected ? '1px solid #121613' : '1px solid rgba(18,22,19,0.12)',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.15)' : 'none'
                                            }}
                                        >
                                            <span>{pillar.statIcon}</span>
                                            <span>{pillar.title.split(' ')[0]} {pillar.title.split(' ')[1]}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Desktop 4 Interactive Expedition Tag Note Cards (2x2 Balanced Grid) */}
                            <div className="why-desktop-pillars" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', 
                                gap: '16px', 
                                marginBottom: '28px',
                                paddingTop: '6px'
                            }}>
                                {WHY_AANANDHAM_PILLARS.map((pillar, idx) => {
                                    const isSelected = activeWhyIdx === idx;
                                    return (
                                        <motion.div
                                            key={pillar.id}
                                            onClick={() => setActiveWhyIdx(idx)}
                                            whileHover={{ 
                                                y: -6, 
                                                rotate: 0,
                                                scale: 1.02,
                                                boxShadow: isSelected 
                                                    ? '0 20px 40px rgba(229, 169, 59, 0.25), 0 4px 12px rgba(0,0,0,0.08)' 
                                                    : '0 16px 36px rgba(0,0,0,0.12)' 
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                                            style={{
                                                position: 'relative',
                                                background: isSelected ? '#FFFFFF' : pillar.paperBg,
                                                border: isSelected 
                                                    ? '2px solid #E5A93B' 
                                                    : '1.5px solid rgba(18, 22, 19, 0.12)',
                                                borderRadius: '16px',
                                                padding: '22px 20px 18px 20px',
                                                cursor: 'pointer',
                                                transform: `rotate(${isSelected ? '0deg' : pillar.rotation})`,
                                                transition: 'border-color 0.25s ease, background 0.25s ease',
                                                boxShadow: isSelected 
                                                    ? '0 14px 34px rgba(229, 169, 59, 0.2), 0 4px 12px rgba(0,0,0,0.06)' 
                                                    : '0 4px 14px rgba(0,0,0,0.04)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: '175px'
                                            }}
                                        >
                                            {/* Brass Metal Eyelet Ring at Top Left */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '14px',
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: 'radial-gradient(circle at 35% 35%, #FDE047 0%, #D97706 70%, #78350F 100%)',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.3)',
                                                border: '1px solid #92400E',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: '4px',
                                                    height: '4px',
                                                    borderRadius: '50%',
                                                    background: '#0B150E'
                                                }} />
                                            </div>

                                            {/* Top Row: Serial Tag + Seal Stamp Badge */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingLeft: '14px' }}>
                                                <span style={{
                                                    fontSize: '9.5px',
                                                    fontWeight: '900',
                                                    letterSpacing: '1px',
                                                    color: isSelected ? '#E5A93B' : '#7D8880',
                                                    textTransform: 'uppercase',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {pillar.serial}
                                                </span>

                                                <span style={{
                                                    fontSize: '8.5px',
                                                    fontWeight: '900',
                                                    letterSpacing: '0.8px',
                                                    textTransform: 'uppercase',
                                                    padding: '2px 7px',
                                                    borderRadius: '4px',
                                                    background: isSelected ? 'rgba(229, 169, 59, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                                                    color: isSelected ? '#B45309' : pillar.accentColor,
                                                    border: `1px solid ${isSelected ? 'rgba(229, 169, 59, 0.4)' : 'rgba(0,0,0,0.08)'}`
                                                }}>
                                                    ✓ {pillar.seal}
                                                </span>
                                            </div>

                                            {/* Main Content: Icon + Title */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <div style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '10px',
                                                    background: isSelected ? '#121613' : 'rgba(0, 0, 0, 0.06)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px',
                                                    flexShrink: 0,
                                                    transition: 'background 0.25s ease'
                                                }}>
                                                    {pillar.statIcon}
                                                </div>
                                                <h4 style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: '15.5px',
                                                    fontWeight: '800',
                                                    color: '#121613',
                                                    margin: 0,
                                                    lineHeight: 1.25,
                                                    letterSpacing: '-0.02em'
                                                }}>
                                                    {pillar.title}
                                                </h4>
                                            </div>

                                            {/* High-Contrast Tagline Pill */}
                                            <div style={{
                                                fontSize: '11.5px',
                                                fontWeight: '700',
                                                color: isSelected ? '#121613' : '#49564E',
                                                background: isSelected ? 'rgba(229, 169, 59, 0.18)' : 'rgba(0,0,0,0.04)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                marginTop: 'auto',
                                                width: 'fit-content',
                                                border: isSelected ? '1px solid rgba(229, 169, 59, 0.4)' : '1px solid transparent'
                                            }}>
                                                ✦ {pillar.tagline}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Certified Trust Badges */}
                            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(18, 22, 19, 0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#121613', fontWeight: '700' }}>
                                    <span style={{ color: '#E5A93B' }}>🛡️</span>
                                    <span>Kerala Forest Eco-Permits</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#121613', fontWeight: '700' }}>
                                    <span style={{ color: '#E5A93B' }}>★</span>
                                    <span>4.98 / 5.0 Rating</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#121613', fontWeight: '700' }}>
                                    <span style={{ color: '#E5A93B' }}>🚙</span>
                                    <span>4x4 Jeep Convoy</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                3. PACKAGES PREVIEW (Liquid-Glide Sliding Tabs)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="packages" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                className="packages-section-container"
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="packages-section-header">
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> PACKAGES PREVIEW
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.035em', margin: 0 }}>
                                <span className="text-marker-2">Handcrafted</span> Wilderness Packages
                            </h2>
                        </div>
                        {/* Smooth Liquid-Glide Animated Filter Pills (Horizontal Touch Scroll on Mobile) */}
                        <LayoutGroup id="packagesFilterTabsGroup">
                            <div className="packages-filter-scroll">
                                {['All', 'Treks', 'Glamping', 'Water'].map(tab => {
                                    const isSelected = activeTab === tab;
                                    const label = tab === 'All' ? 'All Expeditions' : tab === 'Treks' ? 'Summit Treks' : tab === 'Glamping' ? 'Ridge Glamp' : 'Rapids & Lakes';
                                    return (
                                        <button 
                                            key={tab} 
                                            onClick={() => setActiveTab(tab)} 
                                            style={{ 
                                                position: 'relative',
                                                border: 'none', 
                                                background: 'transparent',
                                                color: isSelected ? '#FFFFFF' : '#59655D', 
                                                fontWeight: '800', 
                                                fontSize: '13px', 
                                                padding: '9px 20px', 
                                                borderRadius: '999px', 
                                                cursor: 'pointer',
                                                zIndex: 2,
                                                transition: 'color 0.22s ease',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeFilterPill"
                                                    transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: '#121613',
                                                        borderRadius: '999px',
                                                        zIndex: -1,
                                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)'
                                                    }}
                                                />
                                            )}
                                            <span>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </LayoutGroup>
                    </div>

                    <div 
                        ref={packagesSliderRef}
                        onScroll={handlePackageSliderScroll}
                        className="packages-cards-grid"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPackages.map((pkg, idx) => (
                                <motion.div 
                                    key={pkg.id} 
                                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.26, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                    className="hover-lift card-img-zoom" 
                                    style={{
                                        borderRadius: '26px',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.08)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 6px 24px rgba(0,0,0,0.03)',
                                        transition: 'box-shadow 0.25s ease, transform 0.25s ease'
                                    }}
                                >
                                    {/* Image Container with Badges (Compact Space-Saving on Mobile) */}
                                    <div className="package-card-img">
                                        <img 
                                            src={pkg.image} 
                                            alt={pkg.title} 
                                            loading="lazy"
                                            decoding="async"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,24,17,0.6) 0%, transparent 45%)' }} />
                                        
                                        {/* Top Badges */}
                                        <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.2px' }}>
                                                {pkg.tag}
                                            </span>
                                            <span style={{ background: 'rgba(0,0,0,0.65)', color: '#FFF', fontSize: '10.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                                                {pkg.altitude}
                                            </span>
                                        </div>

                                        {/* Rating Pill */}
                                        <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.92)', color: '#121613', fontSize: '11.5px', fontWeight: '800', padding: '4px 9px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                            ★ {pkg.rating} <span style={{ color: '#59655D', fontWeight: '600', fontSize: '10.5px' }}>({pkg.reviewsCount})</span>
                                        </div>

                                        {/* Bottom Overlay Location & Duration */}
                                        <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700' }}>
                                            <span>📍 {pkg.location}</span>
                                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>⏱ {pkg.duration}</span>
                                        </div>
                                    </div>

                                    {/* Card Content (Compact Padding on Mobile) */}
                                    <div className="package-card-body">
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#121613', marginBottom: '6px', lineHeight: 1.25 }}>
                                            {pkg.title}
                                        </h3>
                                        
                                        <p style={{ 
                                            fontSize: '13px', 
                                            color: '#59655D', 
                                            lineHeight: 1.45, 
                                            marginBottom: '12px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {pkg.description}
                                        </p>
                                        
                                        {/* Key Highlights Chips (Compact 2 items on mobile) */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                                            {pkg.highlights.slice(0, 2).map((h, i) => (
                                                <span key={i} style={{ fontSize: '10.5px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.08)', color: '#48544C', padding: '3px 8px', borderRadius: '999px', fontWeight: '600' }}>
                                                    ✓ {h}
                                                </span>
                                            ))}
                                            {pkg.highlights.length > 2 && (
                                                <span style={{ fontSize: '10.5px', background: '#F1F3EC', color: '#121613', padding: '3px 7px', borderRadius: '999px', fontWeight: '700' }}>
                                                    +{pkg.highlights.length - 2} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Bottom Price & Action Row */}
                                        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(18, 22, 19, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', color: '#121613' }}>
                                                        ₹{pkg.price.toLocaleString()}
                                                    </span>
                                                    {pkg.originalPrice && (
                                                        <span style={{ fontSize: '12px', color: '#8E9B92', textDecoration: 'line-through' }}>
                                                            ₹{pkg.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '10.5px', color: '#59655D', display: 'block', marginTop: '1px' }}>
                                                    per person all-inclusive
                                                </span>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleOpenBooking(pkg)} 
                                                className="btn-lime" 
                                                style={{ padding: '8px 16px', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <span>Book Spot</span>
                                                <span>→</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Swipe Pagination Dots */}
                    {filteredPackages.length > 1 && (
                        <div className="mobile-slider-dots" style={{ marginTop: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                {filteredPackages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (packagesSliderRef.current) {
                                                const cardEl = packagesSliderRef.current.children[idx];
                                                if (cardEl) {
                                                    cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                                }
                                            }
                                            setActivePackageSlideIdx(idx);
                                        }}
                                        aria-label={`Go to package ${idx + 1}`}
                                        style={{
                                            width: activePackageSlideIdx === idx ? '22px' : '7px',
                                            height: '7px',
                                            borderRadius: '999px',
                                            backgroundColor: activePackageSlideIdx === idx ? '#121613' : 'rgba(18, 22, 19, 0.2)',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#8E9B92', display: 'block', textAlign: 'center', marginTop: '6px' }}>
                                {activePackageSlideIdx + 1} of {filteredPackages.length} packages (Swipe left/right)
                            </span>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                4. STAY / GLAMP SECTION (Ref Screenshot 4 Batch 2 - media_1786655246091.png)
                   - Interactive hover-active room selector + photo cross-fade
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="stay" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    
                    <div style={{ marginBottom: '44px' }}>
                        <div className="star-badge">
                            <span className="star-icon">★</span> STAY & GLAMP
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(32px, 4.5vw, 48px)',
                            fontWeight: '800',
                            color: '#121613',
                            letterSpacing: '-0.035em'
                        }}>
                            Live in a <span className="text-marker-1">tropical ridge glamp</span> <span style={{ color: '#8E9B92' }}>with friends or on your own</span>
                        </h2>
                    </div>

                    <div className="stay-glamp-layout">
                        
                        {/* Mobile Paragraph: Appears FIRST on Mobile */}
                        <div className="stay-mobile-intro">
                            Our campsite in Suryanelli has 8 luxury weatherproof dome tents and wooden pods sleeping 20-24 people maximum. Choose from shared twin rooms, private double pods for couples, or group suites for friends traveling together.
                        </div>

                        {/* Mobile Room Selector Tabs */}
                        <div className="stay-mobile-tabs">
                            {STAY_ACCOMMODATIONS.map((acc, idx) => {
                                const isSelected = activeStayAcc === idx;
                                return (
                                    <button
                                        key={`mobile-tab-${acc.id}`}
                                        onClick={() => setActiveStayAcc(idx)}
                                        style={{
                                            flexShrink: 0,
                                            padding: '8px 16px',
                                            borderRadius: '999px',
                                            border: isSelected ? '1px solid #121613' : '1px solid rgba(18, 22, 19, 0.12)',
                                            background: isSelected ? '#121613' : '#FFFFFF',
                                            color: isSelected ? '#D5ED55' : '#121613',
                                            fontSize: '12.5px',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            boxShadow: isSelected ? '0 4px 14px rgba(18, 22, 19, 0.18)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {acc.title}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Big Picture (Pinned Sticky on Left on Desktop, Clean Relative on Mobile) */}
                        <div className="stay-glamp-image-col">
                            <div className="stay-glamp-image-container">
                                {/* Stacked Cross-Fade Images (Silky Smooth Cubic-Bezier Transition) */}
                                {STAY_ACCOMMODATIONS.map((acc, idx) => (
                                    <img
                                        key={acc.id}
                                        src={acc.mainImg}
                                        alt={acc.title}
                                        loading="lazy"
                                        decoding="async"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            opacity: activeStayAcc === idx ? 1 : 0,
                                            transform: activeStayAcc === idx ? 'scale(1)' : 'scale(1.04)',
                                            transition: 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                ))}
                                
                                {/* Overlay Gradient */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.85) 0%, rgba(14, 24, 17, 0.2) 40%, transparent 60%)' }} />

                                {/* Stacked Synchronized Caption & Badges (Smooth Cross-Fade) */}
                                {STAY_ACCOMMODATIONS.map((acc, idx) => {
                                    const isCurrent = activeStayAcc === idx;
                                    return (
                                        <div
                                            key={`caption-${acc.id}`}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                opacity: isCurrent ? 1 : 0,
                                                transform: isCurrent ? 'translateY(0)' : 'translateY(8px)',
                                                transition: 'opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                                                pointerEvents: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                padding: '22px'
                                            }}
                                        >
                                            {/* Top Badges */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ background: '#E5A93B', color: '#121613', fontSize: '11.5px', fontWeight: '800', padding: '6px 14px', borderRadius: '999px', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
                                                    {acc.badge}
                                                </span>
                                                <span style={{ background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '6px 14px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                                    {acc.capacity}
                                                </span>
                                            </div>

                                            {/* Bottom Caption on Image */}
                                            <div>
                                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
                                                    {acc.title}
                                                </h3>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {acc.amenities.map((amenity, i) => (
                                                        <span key={i} style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                                                            ✓ {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column with Hover-Active Interactive Accommodation Cards */}
                        <motion.div variants={fadeInRight} className="stay-glamp-cards-container">
                            <p className="stay-desktop-intro" style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '24px' }}>
                                Our campsite in Suryanelli has 8 luxury weatherproof dome tents and wooden pods sleeping 20-24 people maximum. Choose from shared twin rooms, private double pods for couples, or group suites for friends traveling together.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                                {STAY_ACCOMMODATIONS.map((acc, idx) => {
                                    const isActive = activeStayAcc === idx;
                                    return (
                                        <div
                                            key={acc.id}
                                            data-stay-card-idx={idx}
                                            onMouseEnter={() => setActiveStayAcc(idx)}
                                            onClick={() => setActiveStayAcc(idx)}
                                            className="hover-lift stay-room-card"
                                            style={{
                                                background: '#FFFFFF',
                                                border: isActive ? '2px solid #121613' : '1px solid rgba(18, 22, 19, 0.08)',
                                                borderRadius: '24px',
                                                padding: '22px 26px',
                                                cursor: 'pointer',
                                                boxShadow: isActive ? '0 12px 35px rgba(0, 0, 0, 0.06)' : '0 4px 12px rgba(0,0,0,0.01)',
                                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: isActive ? '#E5A93B' : 'rgba(18, 22, 19, 0.2)',
                                                        boxShadow: isActive ? '0 0 8px #E5A93B' : 'none',
                                                        transition: 'all 0.2s ease'
                                                    }} />
                                                    <div>
                                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613' }}>
                                                            {acc.title}
                                                        </span>
                                                        <span style={{ fontSize: '12px', color: '#8E9B92', fontWeight: '600', marginLeft: '10px' }}>
                                                            {acc.capacity}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span style={{
                                                    background: isActive ? '#E5A93B' : '#F1F3EC',
                                                    color: '#121613',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    {acc.badge}
                                                </span>
                                            </div>

                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ padding: '14px 0 0 24px', overflow: 'hidden' }}
                                                    >
                                                        <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.65, margin: '0 0 12px' }}>
                                                            {acc.desc}
                                                        </p>
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {acc.amenities.map((amenity, i) => (
                                                                <span key={i} style={{ background: '#F1F3EC', color: '#121613', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px' }}>
                                                                    ✓ {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Reserve Your Spot Pill */}
                            <button
                                onClick={() => handleOpenBooking(EXPEDITION_PACKAGES[0])}
                                className="action-arrow-btn"
                                style={{ marginTop: '28px' }}
                            >
                                <span>Reserve Your Spot</span>
                                <div className="btn-arrow-circle">
                                    ↗
                                </div>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                5. PROGRAM SECTION (Exact Match to media_1786657185483.png)
                   "What we've planned for you:" + Interactive Mouse-Follow Hover Preview
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="program" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', position: 'relative' }}>
                    
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> PROGRAM
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(34px, 5vw, 52px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                margin: 0
                            }}>
                                What we’ve <span className="text-marker-4">planned for you</span>:
                            </h2>
                        </div>

                        <a
                            href="#packages"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(18, 22, 19, 0.12)',
                                color: '#121613',
                                padding: '10px 22px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className="fa-solid fa-download" style={{ fontSize: '12px' }}></i> Full Program
                        </a>
                    </div>

                    {/* Interactive Days List with Mouse Tracking Container */}
                    <div 
                        ref={programContainerRef}
                        onMouseMove={handleProgramMouseMove}
                        onMouseLeave={() => setHoveredProgramDay(null)}
                        style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Desktop Floating Mouse-Follow Preview Card */}
                        <AnimatePresence>
                            {hoveredProgramDay !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.88, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.88, y: 10 }}
                                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        left: smoothProgramX,
                                        top: smoothProgramY,
                                        transform: 'translate(28px, -50%)'
                                    }}
                                    className="program-floating-preview"
                                >
                                    <img 
                                        src={PROGRAM_DAYS[hoveredProgramDay].img} 
                                        alt={PROGRAM_DAYS[hoveredProgramDay].title} 
                                        loading="lazy"
                                        decoding="async"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,21,14,0.92) 0%, rgba(11,21,14,0.25) 50%, transparent 100%)' }} />
                                    <div style={{ position: 'absolute', bottom: '16px', left: '18px', right: '18px', color: '#FFFFFF' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#E5A93B', textTransform: 'uppercase', letterSpacing: '1.2px', display: 'block', marginBottom: '3px' }}>
                                            {PROGRAM_DAYS[hoveredProgramDay].day}
                                        </span>
                                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '800', lineHeight: 1.25 }}>
                                            {PROGRAM_DAYS[hoveredProgramDay].title}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {PROGRAM_DAYS.map((item, idx) => {
                            const isOpen = expandedDayIdx === idx;

                            return (
                                <motion.div
                                    key={idx}
                                    data-program-day-idx={idx}
                                    variants={cardReveal}
                                    onMouseEnter={() => {
                                        setHoveredProgramDay(idx);
                                        setExpandedDayIdx(idx);
                                    }}
                                    onClick={() => setExpandedDayIdx(idx)}
                                    style={{
                                        borderTop: '1px solid rgba(18, 22, 19, 0.1)',
                                        padding: '28px 0',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'background-color 0.25s ease'
                                    }}
                                >
                                    {/* Smooth Active Underline Bar (Zero stutter / Zero jumping) */}
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            top: '-1.5px',
                                            left: 0,
                                            width: isOpen ? '180px' : '0px',
                                            height: '3px',
                                            backgroundColor: '#E5A93B',
                                            borderRadius: '999px',
                                            boxShadow: isOpen ? '0 0 12px rgba(229, 169, 59, 0.6)' : 'none',
                                            transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
                                            opacity: isOpen ? 1 : 0
                                        }} 
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: isOpen ? '#E5A93B' : '#8E9B92', display: 'block', marginBottom: '6px', transition: 'color 0.25s ease' }}>
                                                {item.day}
                                            </span>
                                            <h3 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: 'clamp(20px, 2.5vw, 30px)',
                                                fontWeight: '700',
                                                color: '#121613',
                                                margin: 0
                                            }}>
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: isOpen ? '#121613' : '#F1F3EC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            color: isOpen ? '#E5A93B' : '#121613',
                                            transform: isOpen ? 'rotate(180deg)' : 'none',
                                            transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                                        }}>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                style={{ paddingTop: '16px', maxWidth: '720px', overflow: 'hidden' }}
                                            >
                                                <p style={{ fontSize: '14.5px', color: '#59655D', lineHeight: 1.7, margin: '0 0 14px' }}>
                                                    {item.desc}
                                                </p>
                                                {/* In-line Image preview (shown cleanly with badges on active day) */}
                                                <div 
                                                    className="program-day-inline-img"
                                                    style={{ 
                                                        height: 'clamp(190px, 28vh, 250px)', 
                                                        borderRadius: '18px', 
                                                        overflow: 'hidden', 
                                                        marginTop: '16px',
                                                        position: 'relative',
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                                    }}
                                                >
                                                    <img 
                                                        src={item.img} 
                                                        alt={item.title} 
                                                        loading="lazy"
                                                        decoding="async"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,24,17,0.75) 0%, transparent 50%)' }} />
                                                    <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700' }}>
                                                        <span>📍 {item.altitude || 'Western Ghats Ridge'}</span>
                                                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 9px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>{item.terrain || 'Mountain Trail'}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                7. EXPERIENCE (Ref Screenshot 2 Batch 2 - media_1786655245998.png)
                   - Pinned sticky left headline while right cards scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="experience" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="sticky-split-grid" style={{ alignItems: 'flex-start', gap: 'clamp(32px, 4vw, 56px)' }}>
                        
                        {/* Sticky Pinned Left Header */}
                        <div className="sticky-pinned-col" style={{ position: 'sticky', top: '100px' }}>
                            <div className="star-badge" style={{ marginBottom: '14px' }}>
                                <span className="star-icon">★</span> EXPERIENCE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.18,
                                marginBottom: '16px'
                            }}>
                                Body, soul, mind, and connection — <span className="text-marker-3">we've got it all</span>
                            </h2>
                            <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.65, margin: 0, maxWidth: '420px' }}>
                                This camp isn't just about trekking. It's about the whole wilderness reconnect experience.
                            </p>
                        </div>

                        {/* Scrolling Right Cards (Icon Above, Straight in Sight) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {EXPERIENCE_ITEMS.map((exp, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-30px" }}
                                    className="hover-lift"
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.08)',
                                        borderRadius: '22px',
                                        padding: '24px 24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                                        minHeight: '210px'
                                    }}
                                >
                                    {/* Icon & Category Header Row */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                                    {exp.icon}
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                                    {exp.category}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '11px', color: '#B5C0B8', fontWeight: '800' }}>
                                                0{idx + 1}
                                            </span>
                                        </div>

                                        {/* Title in Sight */}
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', color: '#121613', marginBottom: '8px', lineHeight: 1.3 }}>
                                            {exp.title}
                                        </h3>

                                        {/* Compact Paragraph */}
                                        <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.55, margin: 0 }}>
                                            {exp.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                8. CUSTOM ARRANGEMENTS & EVENTS (Interactive Cork Notice Board)
            ───────────────────────────────────────────────────────────── */}
            {/* ─────────────────────────────────────────────────────────────
                8. CUSTOM ARRANGEMENTS & EVENTS (Full-Bleed Space-Saving Roughed Paper Scraps Slider)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="arrangements" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '70px 0', background: '#F8F9F5', width: '100%' }}
            >
                {/* Header Row with Centered Max-Width */}
                <div style={{ maxWidth: '1440px', margin: '0 auto 28px', padding: '0 clamp(20px, 4vw, 48px)', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div className="star-badge" style={{ marginBottom: '8px' }}>
                                <span className="star-icon">★</span> ARRANGEMENTS & EVENTS
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.03em', margin: 0 }}>
                                Tailored Wilderness Arrangements For Every Tribe
                            </h2>
                        </div>

                        {/* Navigation Arrows (Visible on swipe screens) */}
                        <div className="events-nav-arrows" style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('events-slider-track');
                                    if (el) {
                                        const cardW = el.children[0]?.offsetWidth || 340;
                                        el.scrollBy({ left: -(cardW + 16), behavior: 'smooth' });
                                    }
                                }}
                                aria-label="Previous Event"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    color: '#121613',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ←
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('events-slider-track');
                                    if (el) {
                                        const cardW = el.children[0]?.offsetWidth || 340;
                                        el.scrollBy({ left: cardW + 16, behavior: 'smooth' });
                                    }
                                }}
                                aria-label="Next Event"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    color: '#121613',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Full-Bleed Roughed Paper Scraps Horizontal Track */}
                <div 
                    id="events-slider-track" 
                    className="events-horizontal-track" 
                    style={{ 
                        paddingTop: '16px', 
                        paddingBottom: '28px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    {EVENT_ARRANGEMENTS.map((ev, idx) => (
                        <motion.div 
                            key={idx} 
                            className="events-horizontal-card roughed-paper-scrap"
                            whileHover={{
                                y: -10,
                                rotate: 0,
                                scale: 1.02,
                                boxShadow: '0 24px 50px rgba(0, 0, 0, 0.14)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            style={{
                                background: ev.paperBg,
                                borderColor: ev.borderTint,
                                transform: `rotate(${ev.rotation})`,
                                cursor: 'pointer',
                                padding: '24px 22px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '340px'
                            }}
                            onClick={() => openBookingModal(null, { title: ev.title, date: 'Custom Dates' })}
                        >
                            {/* Realistic Crumpled Paper Crease Overlay */}
                            <div className="crumpled-crease-overlay" />

                            {/* Top Translucent Frosted Scotch Tape Strip */}
                            <div 
                                className="scotch-tape-strip" 
                                style={{ transform: `translateX(-50%) rotate(${ev.tapeAngle})` }} 
                            />

                            {/* Bottom Corner Scotch Tape Accent */}
                            <div className="corner-tape-scrap" />

                            <div>
                                {/* Top Row: Tag Code + Vintage Rubber Ink Stamp */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', position: 'relative', zIndex: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <img
                                            src="/logo.png"
                                            alt="Aanandham Logo"
                                            style={{
                                                height: '18px',
                                                width: '18px',
                                                objectFit: 'contain',
                                                borderRadius: '50%',
                                                border: '1px solid rgba(0,0,0,0.12)'
                                            }}
                                        />
                                        <span style={{
                                            fontSize: '9px',
                                            fontWeight: '900',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                            color: '#657268',
                                            background: 'rgba(0,0,0,0.06)',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace'
                                        }}>
                                            {ev.tagCode}
                                        </span>
                                    </div>

                                    {/* Vintage Rubber Ink Stamp */}
                                    <div
                                        style={{
                                            border: `1.5px solid ${ev.stampColor}`,
                                            outline: `1px dashed ${ev.stampColor}`,
                                            outlineOffset: '2px',
                                            color: ev.stampColor,
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '8px',
                                            fontWeight: '900',
                                            letterSpacing: '0.8px',
                                            textTransform: 'uppercase',
                                            transform: 'rotate(-2deg)',
                                            background: 'rgba(255,255,255,0.85)',
                                            userSelect: 'none'
                                        }}
                                    >
                                        {ev.stamp}
                                    </div>
                                </div>

                                {/* Icon & Title */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        background: 'rgba(18, 22, 19, 0.07)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#121613',
                                        fontSize: '16px',
                                        flexShrink: 0
                                    }}>
                                        <i className={ev.iconClass}></i>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10.5px', fontWeight: '800', color: ev.accentColor, letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block' }}>
                                            {ev.badge}
                                        </span>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800', color: '#121613', margin: 0, lineHeight: 1.2 }}>
                                            {ev.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Description */}
                                <p style={{ fontSize: '13px', color: '#4E5A52', lineHeight: 1.55, margin: '0 0 12px', position: 'relative', zIndex: 2 }}>
                                    {ev.desc}
                                </p>

                                {/* Features Checklist */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
                                    {ev.features.slice(0, 3).map((feat, fIdx) => (
                                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2B372E', fontWeight: '600' }}>
                                            <span style={{ color: '#166534', fontWeight: '800', fontSize: '12px' }}>✓</span>
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Capacity Bar & Action */}
                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '10px',
                                borderTop: '1px dashed rgba(18, 22, 19, 0.16)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        color: ev.accentColor,
                                        background: 'rgba(0,0,0,0.04)',
                                        padding: '3px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        {ev.statPill}
                                    </span>
                                    <span style={{
                                        fontSize: '11.5px',
                                        fontWeight: '800',
                                        color: '#121613',
                                        background: ev.btnBg,
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)'
                                    }}>
                                        Inquire ↗
                                    </span>
                                </div>

                                {/* Bottom Marginal Handwritten Note */}
                                <div style={{
                                    fontStyle: 'italic',
                                    fontSize: '11.5px',
                                    lineHeight: '1.4',
                                    color: '#556358',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '5px'
                                }}>
                                    <span style={{ fontSize: '12px' }}>✍</span>
                                    <span>{ev.marginalNote}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {/* End Spacer */}
                    <div style={{ flex: '0 0 24px', minWidth: '24px' }} />
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                9. MAKE IT HAPPEN IN JUST FOUR STEPS (Ref Screenshot 3 - media_1786656749498.png)
                   - Pinned sticky left heading while right steps scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="steps" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="sticky-split-grid" style={{ alignItems: 'flex-start', gap: 'clamp(32px, 4vw, 56px)' }}>
                        
                        {/* Sticky Pinned Left Header */}
                        <div className="sticky-pinned-col" style={{ position: 'sticky', top: '100px' }}>
                            <div className="star-badge" style={{ marginBottom: '14px' }}>
                                <span className="star-icon">★</span> STEPS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(34px, 4.5vw, 52px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.1,
                                marginBottom: '24px'
                            }}>
                                Make it happen in <br />just <span className="text-marker-2">four steps</span>
                            </h2>
                            <p style={{ fontSize: '15.5px', color: '#59655D', lineHeight: 1.7, marginBottom: '32px', maxWidth: '420px' }}>
                                We’ve made the entire process smooth and hassle-free. Our team guides you through every step from booking to arrival — just show up ready for waves & peaks.
                            </p>
                        </div>

                        {/* Scrolling Right Steps List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {FOUR_STEPS.map((step, idx) => (
                                <motion.div 
                                    key={idx} 
                                    variants={cardReveal}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="hover-lift"
                                    style={{ 
                                        display: 'flex', 
                                        gap: '24px', 
                                        alignItems: 'flex-start',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.08)',
                                        borderRadius: '24px',
                                        padding: '28px 28px',
                                        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02)'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: '#121613',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '15px',
                                        fontWeight: '900',
                                        color: '#E5A93B',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 14px rgba(18, 22, 19, 0.15)'
                                    }}>
                                        {step.num}
                                    </div>
                                    <div style={{ flex: 1, paddingTop: '2px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', marginBottom: '8px', lineHeight: 1.3 }}>
                                            {step.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </motion.section>
            {/* ─────────────────────────────────────────────────────────────
                9.5 KERALA WILDERNESS & CAMPSITES GALLERY (Interactive Lightbox)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="kerala-wilderness" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                className="wilderness-section-container"
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#FFFFFF' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    <div className="wilderness-section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
                        <div className="star-badge" style={{ margin: '0 auto 12px' }}>
                            <span className="star-icon">★</span> KERALA WILDERNESS GRID
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.035em', margin: '0 0 14px', lineHeight: 1.2 }}>
                            Verified Peaks, Glamping & Off-Road Hubs
                        </h2>
                        <p style={{ color: '#59655D', fontSize: '15px', margin: '0 auto 20px', maxWidth: '640px', lineHeight: 1.65 }}>
                            Tap any spot to preview full resolution 4K imagery, mountain coordinates, altitude ratings, and safety reports.
                        </p>
                        <a href="https://instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" className="action-arrow-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
                            <span>Follow @aanandham.go</span>
                            <div className="btn-arrow-circle">📸</div>
                        </a>
                    </div>

                    <div 
                        ref={wildernessSliderRef}
                        onScroll={handleWildernessSliderScroll}
                        className="wilderness-cards-grid"
                    >
                        {KERALA_WILDERNESS_GALLERY.map((spot, idx) => (
                            <div
                                key={spot.id}
                                id={`wilderness-card-${idx}`}
                                onClick={() => setSelectedLightboxImg(spot)}
                                className="hover-lift card-img-zoom"
                                style={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(18, 22, 19, 0.08)',
                                    background: '#F8F9F5',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ position: 'relative', height: '260px' }}>
                                    <img src={spot.img} alt={spot.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        background: '#E5A93B',
                                        color: '#121613',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        padding: '4px 12px',
                                        borderRadius: '999px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}>
                                        {spot.altitude}
                                    </span>
                                    <span style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'rgba(0,0,0,0.6)',
                                        color: '#FFFFFF',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        backdropFilter: 'blur(6px)'
                                    }}>
                                        🔍 Click to Expand
                                    </span>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#59655D', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                        {spot.location}
                                    </span>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', marginBottom: '8px' }}>
                                        {spot.name}
                                    </h3>
                                    <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.5, margin: 0 }}>
                                        {spot.category} · {spot.badge}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Slider Pagination Dots for Kerala Wilderness */}
                    <div className="mobile-slider-dots" style={{ marginTop: '20px' }}>
                        {KERALA_WILDERNESS_GALLERY.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActiveWildernessIdx(idx);
                                    const el = document.getElementById(`wilderness-card-${idx}`);
                                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                }}
                                className={`slider-dot ${activeWildernessIdx === idx ? 'active' : ''}`}
                                aria-label={`Go to wilderness spot ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                10. TESTIMONIALS & VIDEO DIARIES (Ref Screenshot 5 - media_1786656749593.png)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="stories" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> TESTIMONIALS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                margin: '0 0 8px'
                            }}>
                                Read the stories from <span style={{ color: '#8E9B92' }}>past campers</span>
                            </h2>
                            <p style={{ color: '#59655D', fontSize: '15px', margin: 0 }}>
                                A glimpse into life at our high-altitude basecamp
                            </p>
                        </div>

                        {/* Carousel Navigation Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={prevTestimonial} 
                                aria-label="Previous testimonial"
                                style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
                            >
                                <i className="fa-solid fa-chevron-left" style={{ fontSize: '13px' }}></i>
                            </button>
                            <button 
                                onClick={nextTestimonial} 
                                aria-label="Next testimonial"
                                style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
                            >
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))', gap: '32px', alignItems: 'stretch' }}>
                        
                        {/* Authentic Real Polaroid Photo Card (Sharp Edges, Deep Bottom Chin, Tape Top) */}
                        <div 
                            onClick={() => setIsVideoModalOpen(true)} 
                            className="vintage-polaroid-frame"
                            role="button"
                            tabIndex={0}
                            aria-label="Play Kolukkumalai Sunrise Camper Video"
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsVideoModalOpen(true); }}
                        >
                            {/* Washi Tape Scrap on Top */}
                            <div className="polaroid-tape" />

                            {/* Sharp Authentic Photo Cutout */}
                            <div className="polaroid-inner-photo">
                                <img 
                                    src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80" 
                                    alt="Aanandham Wilderness Campfire" 
                                    loading="lazy"
                                    decoding="async"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                
                                {/* Subtle Vignette Gradient */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.65) 0%, transparent 55%)' }} />

                                {/* Video Play Button */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '58px',
                                    height: '58px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    color: '#121613',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.12)',
                                    backdropFilter: 'blur(8px)'
                                }}>
                                    <i className="fa-solid fa-play" style={{ fontSize: '16px', marginLeft: '3px' }}></i>
                                </div>

                                {/* Top Live Badge */}
                                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                                    <span style={{ background: '#E5A93B', color: '#121613', fontSize: '10.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                                        ✦ Live Camp Cam
                                    </span>
                                </div>

                                {/* Polaroid Bottom Timestamp Stamp */}
                                <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                                    <span style={{ background: 'rgba(18, 22, 19, 0.85)', color: '#D5ED55', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.5px' }}>
                                        REC ● CAMP CAM #04
                                    </span>
                                </div>
                            </div>

                            {/* Authentic Polaroid Wide Bottom Chin */}
                            <div className="polaroid-chin-text">
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#121613', letterSpacing: '-0.01em' }}>
                                        Kolukkumalai Sunrise & Campfire 🌄
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#7E8B82', marginTop: '3px', fontWeight: '600' }}>
                                        Batch #42 · Suryanelli Ridge (7,900 FT)
                                    </div>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#121613', background: '#EFECE6', padding: '5px 12px', borderRadius: '999px' }}>
                                    Play Video ↗
                                </span>
                            </div>
                        </div>

                        {/* Real Notebook Paper Review Sheets (Sharp Non-Rounded Edges, Ruled Lines, Red Margin) */}
                        {[TESTIMONIALS[testimonialIdx], TESTIMONIALS[(testimonialIdx + 1) % TESTIMONIALS.length]].map((t, idx) => (
                            <motion.div 
                                key={`testimonial-card-${t.id}-${testimonialIdx}-${idx}`} 
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="notebook-review-card"
                                style={{
                                    transform: idx === 0 ? 'rotate(-0.8deg)' : 'rotate(0.8deg)'
                                }}
                            >
                                {/* Top Notebook Binder Punch Holes */}
                                <div className="notebook-binder-holes">
                                    <div className="notebook-binder-hole" />
                                    <div className="notebook-binder-hole" />
                                    <div className="notebook-binder-hole" />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', marginTop: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img 
                                            src={t.avatar} 
                                            alt={t.author} 
                                            loading="lazy"
                                            decoding="async"
                                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                                        />
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#121613', lineHeight: 1.2 }}>
                                                {t.author}
                                            </div>
                                            <div style={{ fontSize: '11.5px', color: '#8E9B92', fontWeight: '600' }}>
                                                {t.batchDate}
                                            </div>
                                        </div>
                                    </div>

                                    <span style={{ 
                                        background: '#EAE6DC', 
                                        border: '1px solid rgba(0, 0, 0, 0.08)', 
                                        color: '#3E4942', 
                                        fontSize: '11px', 
                                        fontWeight: '800', 
                                        padding: '4px 12px', 
                                        borderRadius: '4px',
                                        letterSpacing: '0.3px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {t.campBadge}
                                    </span>
                                </div>

                                <div style={{ fontSize: '28px', color: '#C89228', lineHeight: 1, marginBottom: '8px', fontWeight: '900', opacity: 0.8 }}>
                                    “
                                </div>

                                <p style={{ 
                                    fontSize: '14.5px', 
                                    color: '#1E2520', 
                                    lineHeight: '28px', /* Matches ruled notebook line height */
                                    marginBottom: '20px', 
                                    flex: 1, 
                                    fontWeight: '500',
                                    fontStyle: 'normal'
                                }}>
                                    {t.quote}
                                </p>

                                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', color: '#8E9B92', fontWeight: '700', letterSpacing: '0.5px' }}>
                                        VERIFIED CAMPER LOGBOOK
                                    </span>
                                    <span style={{ color: '#E5A93B', fontSize: '13px' }}>
                                        ★★★★★
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                11. ORGANIC CURVED NATURE CTA BANNER WITH SCROLL-DRIVEN ZOOM
            ───────────────────────────────────────────────────────────── */}
            <CtaParallaxBanner 
                onOpenBooking={handleOpenBooking} 
                defaultPackage={EXPEDITION_PACKAGES[0]} 
            />

            {/* ─────────────────────────────────────────────────────────────
                12. FREQUENTLY ASKED QUESTIONS (Ref Screenshot 2 - media_1786656749472.png)
                   - Pinned sticky left contact card while right FAQ questions scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <section 
                id="faq" 
                style={{ position: 'relative', padding: '110px clamp(20px, 4vw, 48px)', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                    
                    <div style={{ marginBottom: '60px' }}>
                        <div className="star-badge">
                            <span className="star-icon">★</span> FAQ
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(34px, 5vw, 52px)',
                            fontWeight: '800',
                            color: '#121613',
                            letterSpacing: '-0.035em'
                        }}>
                            Frequently <br />Asked Questions
                        </h2>
                    </div>

                    <div className="sticky-split-grid">
                        
                        {/* Sticky Pinned Left Floating Card */}
                        <div 
                            className="hover-lift sticky-pinned-col faq-help-card" 
                            style={{ 
                                background: '#FFFFFF', 
                                border: '1px solid rgba(18, 22, 19, 0.08)', 
                                borderRadius: '24px', 
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '14px', 
                                background: 'rgba(213, 237, 85, 0.25)', 
                                border: '1px solid rgba(18, 22, 19, 0.06)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '22px', 
                                marginBottom: '20px' 
                            }}>
                                💬
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>
                                Still have questions?
                            </h3>
                            <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, marginBottom: '28px' }}>
                                Whether it’s about the program, accommodation, or anything in between – we’re happy to help.
                            </p>
                            <Link
                                href="/contact"
                                className="action-arrow-btn-dark"
                                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                            >
                                <span>Contact Us</span>
                                <div className="btn-arrow-circle">
                                    ↗
                                </div>
                            </Link>
                        </div>

                        {/* Scrolling Right Accordions 01-06 */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {FAQ_DATA.map((faq, index) => {
                                const isOpen = activeFaq === index;
                                return (
                                    <div key={faq.id} style={{ borderBottom: '1px solid rgba(18, 22, 19, 0.1)', padding: '24px 0' }}>
                                        <button onClick={() => setActiveFaq(isOpen ? -1 : index)} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
                                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#8E9B92', marginTop: '2px' }}>{faq.num}</span>
                                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '700', color: '#121613', lineHeight: 1.4 }}>{faq.question}</span>
                                            </div>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F3EC', color: '#121613', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className="fa-solid fa-chevron-down" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', fontSize: '11px' }}></i>
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ padding: '16px 0 0 38px', overflow: 'hidden' }}
                                                >
                                                    <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            </main>

            {/* ─────────────────────────────────────────────────────────────
                13. DEEP FOREST GREEN FOOTER (Ref Screenshot 2 Batch 3 - media_1786657185483.png)
                   - Interactive lighting & directional ↗ arrows
                   - Smooth watermark light-up
            ───────────────────────────────────────────────────────────── */}
            {/* 13. REUSABLE FOOTER */}
            <Footer />

            {/* ─────────────────────────────────────────────────────────────
                FLOATING ACTION BUTTONS (WhatsApp Concierge + Back to Top)
            ───────────────────────────────────────────────────────────── */}
            <a
                href={waLink('Hi Aanandham Concierge! I would like to know about upcoming camp batches')}
                target="_blank"
                rel="noopener noreferrer"
                className="floating-whatsapp-btn"
                aria-label="Chat with Aanandham Concierge on WhatsApp"
            >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="#FFFFFF">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
            </a>

            {/* ─────────────────────────────────────────────────────────────
                MODALS (Real Video, Gallery Lightbox & Booking Engine)
            ───────────────────────────────────────────────────────────── */}
            
            {/* 1. Real 4K Mountain Expedition Video Modal */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Aanandham Wilderness Video Player"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            background: 'rgba(0, 0, 0, 0.92)',
                            backdropFilter: 'blur(16px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95 }}
                            style={{
                                width: '100%',
                                maxWidth: '860px',
                                background: '#0A0D0B',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '28px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
                            }}
                        >
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                aria-label="Close video player"
                                className="modal-close-btn"
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    zIndex: 10
                                }}
                            >
                                ✕
                            </button>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    src="https://www.youtube-nocookie.com/embed/1s-P5_Lq0pI?autoplay=1"
                                    title="Aanandham Wilderness Camp Video Diaries"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 0
                                    }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Fullscreen Kerala Wilderness Lightbox Modal */}
            <AnimatePresence>
                {selectedLightboxImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedLightboxImg.name}
                        onClick={() => setSelectedLightboxImg(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            background: 'rgba(0, 0, 0, 0.94)',
                            backdropFilter: 'blur(16px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '920px',
                                background: '#101E13',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 30px 90px rgba(0, 0, 0, 0.6)',
                                color: '#FFFFFF'
                            }}
                        >
                            <button
                                onClick={() => setSelectedLightboxImg(null)}
                                aria-label="Close image preview"
                                className="modal-close-btn"
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    zIndex: 10
                                }}
                            >
                                ✕
                            </button>

                            <div style={{ height: '480px', position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={selectedLightboxImg.img}
                                    alt={selectedLightboxImg.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(0deg, #101E13 0%, rgba(16, 30, 19, 0) 100%)',
                                    height: '140px'
                                }} />
                            </div>

                            <div style={{ padding: '24px 32px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{ background: '#E5A93B', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '999px' }}>
                                            {selectedLightboxImg.altitude}
                                        </span>
                                        <span style={{ color: '#A2B6A6', fontSize: '13px', fontWeight: '600' }}>
                                            {selectedLightboxImg.location}
                                        </span>
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                        {selectedLightboxImg.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => {
                                        const matchingPkg = EXPEDITION_PACKAGES.find(p => 
                                            p.id === `pkg-${selectedLightboxImg.id}` ||
                                            p.id.includes(selectedLightboxImg.id) || 
                                            selectedLightboxImg.id.includes(p.id.replace('pkg-', '')) ||
                                            p.title.toLowerCase().includes(selectedLightboxImg.name.toLowerCase().split(' ')[0])
                                        ) || EXPEDITION_PACKAGES[0];
                                        setSelectedLightboxImg(null);
                                        handleOpenBooking(matchingPkg);
                                    }}
                                    className="btn-lime"
                                    style={{ padding: '12px 32px', fontSize: '14px', fontWeight: '800' }}
                                >
                                    Book This Campsite ↗
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Interactive Full Booking Engine Modal */}
            <BookingEngineModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialPackage={selectedPackage}
            />

        </div>
    );
}
