"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '../components/Footer';
import BookingEngineModal from '../components/BookingEngineModal';

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

// ── SKILL LEVELS DATA (Ref Screenshot 1 Batch 2 - media_1786655245980.png) ──
const SKILL_LEVELS = [
    {
        id: 'newbie',
        badge: 'first-time',
        title: 'Total Newbie',
        avatar: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=150&q=80',
        desc: 'Never hiked before? Our gentle ridge walks, forest nature trails, and cozy basecamp glamps ease you right into the mountain lifestyle.'
    },
    {
        id: 'beginner',
        badge: 'beginner',
        title: 'Still Learning',
        avatar: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=150&q=80',
        desc: "You've trekked a few times and can navigate basic trails. We'll help you progress to high-altitude cloud ridges and build stamina in a supportive environment."
    },
    {
        id: 'intermediate',
        badge: 'intermediate',
        title: 'Pretty Confident',
        avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80',
        desc: 'Comfortable with 12km+ day hikes, steep climbs, and rocky terrain. Ready for Chembra Peak summits and Kolukkumalai off-road adventures.'
    },
    {
        id: 'advanced',
        badge: 'advanced',
        title: 'Already a Pro',
        avatar: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80',
        desc: 'Experienced mountaineer. Join our unmapped off-trail rainforest expeditions, river crossings, and sub-zero night ridge bivouacs.'
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

// ── INSTRUCTORS DATA (Ref Screenshot 4 Batch 3 - media_1786657199806.png) ──
const INSTRUCTORS = [
    {
        name: 'Wayan Bayu',
        role: 'Lead Trek Marshal & Mountain Guide',
        languages: 'ENG / MAL / HIN',
        experience: '8+ Years Mountaineering',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        bio: 'Born in the high ranges of Idukki, Wayan has guided over 400 summits across the Western Ghats and Himalayas. Certified in Wilderness First Aid & Alpine Navigation.'
    },
    {
        name: 'Arjun Das',
        role: 'Wilderness Survival & Trail Lead',
        languages: 'ENG / MAL / TAM',
        experience: '6+ Years Trail Coach',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        bio: 'Former expedition athlete and certified search-and-rescue specialist. Passionate about empowering beginners to build confidence on steep rocky ridges.'
    },
    {
        name: 'Pooja Menon',
        role: 'High-Altitude Yoga & Camp Coordinator',
        languages: 'ENG / MAL / HIN',
        experience: '5+ Years Holistic Wellness',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        bio: 'Certified Hatha Yoga instructor and community builder. Leads morning mountain breathwork sessions to enhance lung capacity and trail recovery.'
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

// ── EXPEDITION PACKAGES ──
const EXPEDITION_PACKAGES = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise & Cloud Bed Ridge Glamp',
        category: 'Trek & Glamp',
        tag: 'Most Popular',
        location: 'Suryanelli, Munnar',
        altitude: '2,170m Altitude',
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
        id: 'pkg-chembra',
        title: 'Wayanad Chembra Peak & Heart Lake Expedition',
        category: 'Summit Trek',
        tag: 'Summit Challenge',
        location: 'Meppadi, Wayanad',
        altitude: '2,100m Peak',
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
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        category: 'Camp & Relax',
        tag: 'Relax & Chill',
        location: 'Pine Forest, Vagamon',
        altitude: '1,100m Altitude',
        duration: '2 Days / 1 Night',
        difficulty: 'Easy / Family & Friends',
        price: 2199,
        originalPrice: 2900,
        rating: 4.92,
        reviewsCount: 184,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        description: 'Unwind in the misty pine groves of Vagamon. Perfect for acoustic campfire jams, off-road trails, starlit barbecues, and refreshing morning walks through tea valleys.',
        highlights: ['Pine Forest Glamping Site', 'Off-Road Jeep Trail to Kurisumala', 'Sunset at Vagamon Rolling Meadows', 'Open-Mic Acoustic Campfire', 'Live Barbecue Station']
    },
    {
        id: 'pkg-athirappilly',
        title: 'Athirappilly Jungle Rapids & Riverbank Glamping',
        category: 'Water & Wild',
        tag: 'Rainforest River',
        location: 'Chalakudy River, Athirappilly',
        altitude: '400m Tropical Valley',
        duration: '2 Days / 1 Night',
        difficulty: 'Easy River Trails',
        price: 2699,
        originalPrice: 3400,
        rating: 4.89,
        reviewsCount: 156,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
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
        id: 'anaerangal',
        name: 'Anaerangal Lake Mist Campsite',
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

// ── CUSTOM ARRANGEMENTS & EVENTS DATA ──
const EVENT_ARRANGEMENTS = [
    {
        iconClass: 'fa-solid fa-graduation-cap',
        title: 'College & Youth Trek Expeditions',
        badge: 'Squad Groups (10-80 pax)',
        desc: 'Curated high-energy student treks with budget-friendly tents, acoustic campfires, guided ridge hikes, and dedicated safety marshals.',
        features: ['Discounted group rates', '4x4 Convoy coordination', 'Night campfire & acoustic setup', 'Strict safety & medical support']
    },
    {
        iconClass: 'fa-solid fa-building',
        title: 'Corporate Wilderness Offsites',
        badge: 'Team Building & Strategy',
        desc: 'Step out of boardrooms into the clouds. High-altitude glamping, off-road team challenges, outdoor strategy sessions, and curated dining.',
        features: ['Executive glamp suites', 'Outdoor team-building games', 'Projector & presentation setups', 'Custom chef-curated menus']
    },
    {
        iconClass: 'fa-solid fa-campground',
        title: 'Strangers Camp: Solo Trekkers Meet',
        badge: 'Weekend Community Camp',
        desc: 'Travel alone and leave with a tribe. Safe, vibrant weekend camps where solo travelers bond over stargazing, icebreakers, and ridge sunrises.',
        features: ['45%+ solo attendees', 'Icebreaker games & trail walks', 'Dedicated female camp leads', 'Instant community WhatsApp group']
    },
    {
        iconClass: 'fa-solid fa-fire',
        title: 'Private Celebrations & Cloud Shoots',
        badge: 'Bespoke Arrangements',
        desc: 'Celebrate birthdays, pre-weddings, and milestones amidst mist and mountain ridges with drone cinematography and starlit barbecue dinners.',
        features: ['Exclusive campsite buyout', '4K Drone photography options', 'Acoustic guitarist on request', 'Fairy light & candlelit setups']
    }
];

// ── 4-STEP BOOKING PROCESS (Ref Screenshot 3 - media_1786656749498.png) ──
const FOUR_STEPS = [
    {
        num: '01',
        title: 'Choose your package',
        desc: 'We have three options: Neighbor (twin room with 2 single beds), Double (king bed for couples or solo travelers), and Squad (group suite for friends). Pick what fits your budget and travel style.'
    },
    {
        num: '02',
        title: 'Leave your contact details',
        desc: 'Fill out a quick form with your name, email, trek level, and preferred package. Our team guides you through every step from booking to arrival – just show up ready for waves & peaks.'
    },
    {
        num: '03',
        title: 'Complete payment',
        desc: 'Once everything is confirmed, secure your spot with payment. You’ll receive a welcome pack with all camp details and a packing list, and be added to your camp WhatsApp group to meet everyone before departure.'
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
        quote: "Best decision I made this year. I was burnt out from work and needed a reset – this camp delivered exactly that. The coaches really know their stuff, the vibe is super chill, and I made friends from all over the world. Went from barely standing on a trail to actually riding the Kolukkumalai sunrise. Already booked my spot for next season.",
        author: "Daniel Kim",
        campBadge: "camp '25",
        batchDate: "Aanandham, August 2025",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: 2,
        quote: "I was nervous about traveling alone, but this crew made me feel at home immediately. We trekked every morning, explored the peaks, and had the kind of deep conversations you usually only have with childhood friends. Already planning my trip back.",
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
        author: "Ananya Iyer",
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
        question: 'Do I need to know how to surf / trek already?',
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

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedLightboxImg, setSelectedLightboxImg] = useState(null);
    const [expandedPackageId, setExpandedPackageId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [activeLevelIdx, setActiveLevelIdx] = useState(1);           // Card 2 ("Still Learning") active by default (Ref media_1786655245980.png)
    const [activeDayIdx, setActiveDayIdx] = useState(0);               // Day 1 active by default (Ref media_1786657185483.png)
    const [activeInstructorIdx, setActiveInstructorIdx] = useState(0); // Wayan Bayu active by default (Ref media_1786657199806.png)
    const [activeStayAcc, setActiveStayAcc] = useState(3);             // Common Areas active by default (Ref media_1786655246091.png)
    const [activeFaq, setActiveFaq] = useState(0);
    const [highlightIdx, setHighlightIdx] = useState(0);
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(EXPEDITION_PACKAGES[0]);

    // Floating cursor follower preview for Program section
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHoveringProgram, setIsHoveringProgram] = useState(false);
    const programContainerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        guests: '2',
        packageName: EXPEDITION_PACKAGES[0].title,
        notes: ''
    });

    // Detect Scroll for Dynamic Navbar Transition & Scroll Progress
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                setScrollProgress((window.scrollY / totalHeight) * 100);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProgramMouseMove = (e) => {
        if (!programContainerRef.current) return;
        const rect = programContainerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const filteredPackages = activeTab === 'All' 
        ? EXPEDITION_PACKAGES 
        : EXPEDITION_PACKAGES.filter(pkg => {
            if (activeTab === 'Treks') return pkg.category.includes('Trek') || pkg.category.includes('Summit');
            if (activeTab === 'Glamping') return pkg.category.includes('Glamp') || pkg.category.includes('Camp');
            if (activeTab === 'Water') return pkg.category.includes('Water');
            return true;
        });

    const nextTestimonial = () => setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    const prevTestimonial = () => setTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
    const nextHighlight = () => setHighlightIdx((prev) => (prev + 1) % OVERVIEW_HIGHLIGHTS.length);
    const prevHighlight = () => setHighlightIdx((prev) => (prev === 0 ? OVERVIEW_HIGHLIGHTS.length - 1 : prev - 1));
    
    const nextInstructor = () => setActiveInstructorIdx((prev) => (prev + 1) % INSTRUCTORS.length);
    const prevInstructor = () => setActiveInstructorIdx((prev) => (prev === 0 ? INSTRUCTORS.length - 1 : prev - 1));

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
        <div style={{ backgroundColor: '#F8F9F5', color: '#121613', minHeight: '100vh', position: 'relative' }}>
            
            {/* ── GOOGLE RICH RESULTS STRUCTURED DATA ── */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* ── ACCESSIBILITY: SKIP TO CONTENT LINK ── */}
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* ── SCROLL PROGRESS BAR ── */}
            <div className="scroll-progress-container">
                <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
            </div>

            {/* ─────────────────────────────────────────────────────────────
                DYNAMIC TRANSLUCENT / BACKDROP NAVBAR (Ref Image 5 Batch 2)
            ───────────────────────────────────────────────────────────── */}
            <motion.header 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    padding: scrolled ? '12px 24px' : '18px 32px',
                    backgroundColor: scrolled ? 'rgba(14, 24, 17, 0.96)' : 'rgba(14, 24, 17, 0.4)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }}>
                    
                    {/* Brand Logo & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Link href="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            textDecoration: 'none'
                        }}>
                            <img
                                src="/logo.png"
                                alt="Aanandham.go Logo"
                                style={{
                                    height: '38px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: '6px'
                                }}
                            />
                            <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '26px',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em'
                            }}>
                                Aanandham<span style={{ color: '#D5ED55' }}>.go</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Link href="/about" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                                About Us
                            </Link>
                            <a href="#overview" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.9 }}>
                                The Camp <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', opacity: 0.6 }}></i>
                            </a>
                            <a href="#instructors" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.9 }}>
                                The Team <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', opacity: 0.6 }}></i>
                            </a>
                            <a href="#program" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                                Program
                            </a>
                            <a href="#packages" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                                Pricing
                            </a>
                            <a href="#faq" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                                FAQ
                            </a>
                        </nav>

                        {/* Right Contact & Log In Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link href="/contact" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
                                Contact
                            </Link>
                            <Link
                                href="/login"
                                className="btn-lime"
                                style={{
                                    padding: '10px 24px',
                                    fontSize: '14px',
                                    textDecoration: 'none'
                                }}
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        className="nav-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                        <i className={isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
                    </button>
                </div>
            </motion.header>

            {/* ── RESPONSIVE MOBILE SLIDE-IN DRAWER ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 998,
                            background: '#0E1A11',
                            color: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '100px 32px 40px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '20px', fontWeight: '800' }}>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Home
                            </Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                About Aanandham.go
                            </Link>
                            <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Camp Overview
                            </a>
                            <a href="#stay" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Accommodation & Pods
                            </a>
                            <a href="#program" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                4-Day Program
                            </a>
                            <a href="#packages" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Packages & Pricing
                            </a>
                            <a href="#kerala-wilderness" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                Kerala Wilderness Gallery
                            </a>
                            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                                FAQ
                            </a>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#D5ED55', textDecoration: 'none' }}>
                                Contact & Inquiries ↗
                            </Link>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-lime"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    fontSize: '16px',
                                    marginBottom: '14px',
                                    textDecoration: 'none'
                                }}
                            >
                                Member Log In ↗
                            </Link>
                            <a
                                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Desk!"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    color: '#25D366',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    padding: '12px'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                <span>WhatsApp Concierge (24/7)</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main id="main-content">

            {/* ─────────────────────────────────────────────────────────────
                HERO SECTION (Exact match to media_1786655246250.jpg)
            ───────────────────────────────────────────────────────────── */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '120px 24px 70px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2000&q=85")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFFFFF'
            }}>
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
                    
                    {/* Main Headline in Bricolage Grotesque */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(56px, 9vw, 98px)',
                            fontWeight: '800',
                            lineHeight: 1.02,
                            letterSpacing: '-0.04em',
                            color: '#FFFFFF',
                            marginBottom: '32px'
                        }}
                    >
                        Aanandham<span style={{ color: '#D5ED55' }}>.go</span><br />Wilderness Camp
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
                            marginBottom: '60px'
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
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                background: 'rgba(255, 255, 255, 0.12)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                color: '#FFFFFF',
                                padding: '13px 24px',
                                borderRadius: '999px',
                                fontWeight: '700',
                                fontSize: '14px',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                            }}
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
                            350+
                        </span>
                        <span style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '500'
                        }}>
                            adventurers already conquered trails with us
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

            {/* FAQ Structured Data for Google Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": FAQ_DATA.map(f => ({
                            "@type": "Question",
                            "name": f.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.answer
                            }
                        }))
                    })
                }}
            />

            {/* ─────────────────────────────────────────────────────────────
                1. OVERVIEW SECTION (Ref Screenshot 3 Batch 2 - media_1786655246018.png)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="overview" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                        
                        {/* Left Column */}
                        <motion.div variants={fadeInLeft}>
                            <div className="star-badge">
                                <span className="star-icon">★</span> OVERVIEW
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.12,
                                marginBottom: '20px'
                            }}>
                                Spend a week living in a trekker's paradise — <span style={{ color: '#8E9B92', fontWeight: '700' }}>Kerala</span>
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

                        {/* Center Highlight Image (Ref Screenshot 3 Batch 2) */}
                        <motion.div 
                            variants={cardReveal}
                            className="card-img-zoom"
                            style={{ position: 'relative', height: '480px', borderRadius: '36px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)' }}
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
                                    <button onClick={prevHighlight} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-chevron-left"></i></button>
                                    <button onClick={nextHighlight} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-chevron-right"></i></button>
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
                        <motion.div variants={fadeInRight} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
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
                2. SKILL LEVELS (Ref Screenshot 1 Batch 2 - media_1786655245980.png)
                   - Dynamic onMouseEnter & onClick interactive card activation
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="levels" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> LEVELS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                margin: 0
                            }}>
                                Catch the wave regardless of <br />your <span style={{ color: '#8E9B92' }}>trekking skills</span>
                            </h2>
                        </div>

                        <a href="#packages" className="action-arrow-btn">
                            <span>See Full Program</span>
                            <div className="btn-arrow-circle">
                                ↗
                            </div>
                        </a>
                    </div>

                    <motion.div 
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}
                    >
                        {SKILL_LEVELS.map((level, idx) => {
                            const isActive = activeLevelIdx === idx;
                            return (
                                <motion.div
                                    key={level.id}
                                    variants={cardReveal}
                                    onMouseEnter={() => setActiveLevelIdx(idx)}
                                    onClick={() => setActiveLevelIdx(idx)}
                                    className="hover-lift"
                                    layout
                                    style={{
                                        background: '#FFFFFF',
                                        border: isActive ? '1.5px solid rgba(18, 22, 19, 0.18)' : '1px solid rgba(18, 22, 19, 0.06)',
                                        borderRadius: '32px',
                                        padding: '28px 26px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: '390px',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? '0 14px 40px rgba(0, 0, 0, 0.06)' : '0 4px 16px rgba(0, 0, 0, 0.02)',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                >
                                    {/* Top Row: Avatar + Level Badge */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <img
                                            src={level.avatar}
                                            alt={level.title}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                            }}
                                        />
                                        <span style={{
                                            background: isActive ? '#D5ED55' : '#FFFFFF',
                                            border: isActive ? 'none' : '1px solid rgba(18, 22, 19, 0.12)',
                                            color: '#121613',
                                            fontSize: '11.5px',
                                            fontWeight: '800',
                                            padding: '5px 16px',
                                            borderRadius: '999px',
                                            textTransform: 'lowercase',
                                            transition: 'all 0.25s ease'
                                        }}>
                                            {level.badge}
                                        </span>
                                    </div>

                                    {/* Bottom Row: Content */}
                                    {isActive ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ marginTop: 'auto' }}
                                        >
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '23px', fontWeight: '800', color: '#121613', margin: 0 }}>
                                                {level.title}
                                            </h3>
                                            <div style={{ width: '100%', height: '1px', background: 'rgba(18, 22, 19, 0.08)', margin: '14px 0 14px' }} />
                                            <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                                {level.desc}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <div style={{ marginTop: 'auto' }}>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '700', color: '#121613', margin: 0 }}>
                                                {level.title}
                                            </h3>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                3. PROGRAM SECTION (Exact Match to media_1786657185483.png)
                   "What we've planned for you:" + Interactive Small Mouse-Follow Floating Card
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="program" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div 
                    ref={programContainerRef}
                    onMouseMove={handleProgramMouseMove}
                    onMouseLeave={() => setIsHoveringProgram(false)}
                    style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}
                >
                    
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
                                What we’ve <span style={{ color: '#8E9B92' }}>planned</span> for you:
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

                    {/* Interactive Days List */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        {PROGRAM_DAYS.map((item, idx) => {
                            const isActive = activeDayIdx === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    onMouseEnter={() => {
                                        setActiveDayIdx(idx);
                                        setIsHoveringProgram(true);
                                    }}
                                    onClick={() => setActiveDayIdx(isActive ? -1 : idx)}
                                    style={{
                                        borderTop: '1px solid rgba(18, 22, 19, 0.1)',
                                        padding: '28px 0',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {/* Active Lime Underline Bar (Ref Screenshot 1) */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeDayBar"
                                            style={{
                                                position: 'absolute',
                                                top: '-1px',
                                                left: 0,
                                                width: '180px',
                                                height: '3px',
                                                backgroundColor: '#D5ED55',
                                                borderRadius: '999px',
                                                boxShadow: '0 0 10px rgba(213, 237, 85, 0.6)'
                                            }} 
                                        />
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#8E9B92', display: 'block', marginBottom: '6px' }}>
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
                                            background: '#F1F3EC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            color: '#121613',
                                            transform: isActive ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.3s'
                                        }}>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ paddingTop: '16px', maxWidth: '640px', overflow: 'hidden' }}
                                            >
                                                <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.7, margin: '0 0 14px' }}>
                                                    {item.desc}
                                                </p>
                                                {/* Mobile In-line Image fallback */}
                                                <div className="mobile-only" style={{ height: '200px', borderRadius: '18px', overflow: 'hidden', marginTop: '12px' }}>
                                                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Floating Mouse Cursor Follower Preview Card (Small, follows cursor naturally) */}
                    <AnimatePresence>
                        {isHoveringProgram && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 4 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    rotate: 3,
                                    x: mousePos.x + 22, 
                                    y: mousePos.y - 100 
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '170px',
                                    height: '215px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    pointerEvents: 'none',
                                    zIndex: 30,
                                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
                                    border: '3.5px solid #FFFFFF'
                                }}
                                className="desktop-only"
                            >
                                <img
                                    src={PROGRAM_DAYS[activeDayIdx >= 0 && activeDayIdx < PROGRAM_DAYS.length ? activeDayIdx : 0]?.img || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'}
                                    alt="Activity preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                    right: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        background: 'rgba(14, 24, 17, 0.75)',
                                        color: '#D5ED55',
                                        fontSize: '10.5px',
                                        fontWeight: '800',
                                        padding: '3px 10px',
                                        borderRadius: '999px',
                                        backdropFilter: 'blur(6px)'
                                    }}>
                                        {PROGRAM_DAYS[activeDayIdx >= 0 && activeDayIdx < PROGRAM_DAYS.length ? activeDayIdx : 0]?.day || 'Trail'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                4. INSTRUCTORS SECTION (Exact Match to media_1786657199806.png)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="instructors" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        
                        {/* Left Coach Picture Card (Ref Screenshot 4 Batch 3) */}
                        <motion.div 
                            variants={fadeInLeft}
                            style={{
                                position: 'relative',
                                height: '500px',
                                borderRadius: '36px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeInstructorIdx}
                                    src={INSTRUCTORS[activeInstructorIdx].image}
                                    alt={INSTRUCTORS[activeInstructorIdx].name}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>

                            {/* Top Left Coach Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '24px',
                                left: '24px',
                                background: 'rgba(0, 0, 0, 0.55)',
                                color: '#FFFFFF',
                                fontSize: '13px',
                                fontWeight: '700',
                                padding: '8px 18px',
                                borderRadius: '999px',
                                backdropFilter: 'blur(8px)'
                            }}>
                                Coach: {INSTRUCTORS[activeInstructorIdx].name}
                            </div>

                            {/* Top Right Plus Button */}
                            <div style={{
                                position: 'absolute',
                                top: '24px',
                                right: '24px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(0, 0, 0, 0.55)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                backdropFilter: 'blur(8px)',
                                cursor: 'pointer'
                            }}>
                                +
                            </div>

                            {/* Bottom Left Language Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '24px',
                                left: '24px',
                                background: 'rgba(0, 0, 0, 0.55)',
                                color: '#FFFFFF',
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '6px 14px',
                                borderRadius: '999px',
                                backdropFilter: 'blur(8px)',
                                letterSpacing: '0.5px'
                            }}>
                                {INSTRUCTORS[activeInstructorIdx].languages}
                            </div>

                            {/* Bottom Right Carousel Controls */}
                            <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', gap: '8px' }}>
                                <button onClick={prevInstructor} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }}></i>
                                </button>
                                <button onClick={nextInstructor} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Content */}
                        <motion.div variants={fadeInRight}>
                            <div className="star-badge">
                                <span className="star-icon">★</span> INSTRUCTORS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                marginBottom: '24px'
                            }}>
                                Learn to conquer peaks with Kerala's <span style={{ color: '#8E9B92' }}>best guides</span>
                            </h2>

                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '16px' }}>
                                Our instructors are Western Ghats locals who grew up exploring these cloud ridges as kids. They know which trail suits your endurance and exactly what you need to hear — whether it's your first summit or you're pushing for off-trail treks.
                            </p>

                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '36px' }}>
                                They adapt to you. Total beginner? They’ll walk you through every step. Already confident? They’ll push your technique further. By the end of camp, you won’t just trust them—you’ll genuinely miss trekking with them.
                            </p>

                            {/* 2 Feature Boxes with Thumbs Up (Ref Screenshot 4) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>👍</div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#121613', marginBottom: '6px' }}>
                                        WFA-Certified Pros
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                                        All instructors hold international Wilderness First Aid certification with 5+ years teaching experience.
                                    </p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>👍</div>
                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: '#121613', marginBottom: '6px' }}>
                                        Small Group Focus
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#59655D', lineHeight: 1.6, margin: 0 }}>
                                        Max 6 people per instructor. Personalized feedback, proper supervision, faster progression.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                5. EXPERIENCE (Ref Screenshot 2 Batch 2 - media_1786655245998.png)
                   - Pinned sticky left headline while right cards scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <section 
                id="experience" 
                style={{ position: 'relative', padding: '120px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div className="sticky-split-grid">
                        
                        {/* Sticky Pinned Left Header */}
                        <div className="sticky-pinned-col">
                            <div className="star-badge">
                                <span className="star-icon">★</span> EXPERIENCE
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(34px, 4.5vw, 50px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                marginBottom: '20px'
                            }}>
                                Body, soul, mind, and connection — <span style={{ color: '#8E9B92' }}>we've got it all</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: '#59655D', lineHeight: 1.65 }}>
                                This camp isn't just about trekking. It's about the whole wilderness reconnect experience.
                            </p>
                        </div>

                        {/* Scrolling Right Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {EXPERIENCE_ITEMS.map((exp, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardReveal}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="hover-lift"
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.08)',
                                        borderRadius: '28px',
                                        padding: '36px 36px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '24px',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                                        minHeight: '160px'
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#8E9B92', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                                            {exp.category}
                                        </span>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '23px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>
                                            {exp.title}
                                        </h3>
                                        <p style={{ fontSize: '14.5px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                            {exp.desc}
                                        </p>
                                    </div>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                                        {exp.icon}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                6. STAY / GLAMP SECTION (Ref Screenshot 4 Batch 2 - media_1786655246091.png)
                   - Interactive hover-active room selector + photo cross-fade
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="stay" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
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
                            Live in a <span style={{ color: '#121613' }}>tropical ridge glamp</span> <span style={{ color: '#8E9B92' }}>with friends or on your own</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
                        
                        {/* Left Big Picture (Dynamic to active stay option) */}
                        <motion.div 
                            variants={fadeInLeft}
                            style={{ position: 'relative', height: '520px', borderRadius: '36px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)' }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeStayAcc}
                                    src={STAY_ACCOMMODATIONS[activeStayAcc >= 0 ? activeStayAcc : 0].mainImg}
                                    alt="Luxury Glamp"
                                    initial={{ opacity: 0, scale: 1.06 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>
                            
                            {/* Overlay Gradient */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 24, 17, 0.75) 0%, transparent 55%)' }} />

                            {/* Top Badges */}
                            <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ background: '#D5ED55', color: '#121613', fontSize: '12px', fontWeight: '800', padding: '6px 16px', borderRadius: '999px' }}>
                                    {STAY_ACCOMMODATIONS[activeStayAcc >= 0 ? activeStayAcc : 0].badge}
                                </span>
                                <span style={{ background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '6px 14px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>
                                    {STAY_ACCOMMODATIONS[activeStayAcc >= 0 ? activeStayAcc : 0].capacity}
                                </span>
                            </div>

                            {/* Bottom Caption on Image */}
                            <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
                                    {STAY_ACCOMMODATIONS[activeStayAcc >= 0 ? activeStayAcc : 0].title}
                                </h3>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {STAY_ACCOMMODATIONS[activeStayAcc >= 0 ? activeStayAcc : 0].amenities.map((amenity, i) => (
                                        <span key={i} style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                                            ✓ {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column with Hover-Active Interactive Accommodation Cards */}
                        <motion.div variants={fadeInRight}>
                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '24px' }}>
                                Our campsite in Suryanelli has 8 luxury weatherproof dome tents and wooden pods sleeping 20-24 people maximum. Choose from shared twin rooms, private double pods for couples, or group suites for friends traveling together.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {STAY_ACCOMMODATIONS.map((acc, idx) => {
                                    const isActive = activeStayAcc === idx;
                                    return (
                                        <div
                                            key={acc.id}
                                            onMouseEnter={() => setActiveStayAcc(idx)}
                                            onClick={() => setActiveStayAcc(idx)}
                                            className="hover-lift"
                                            style={{
                                                background: '#FFFFFF',
                                                border: isActive ? '2px solid #121613' : '1px solid rgba(18, 22, 19, 0.08)',
                                                borderRadius: '22px',
                                                padding: '20px 24px',
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
                                                        background: isActive ? '#D5ED55' : 'rgba(18, 22, 19, 0.2)',
                                                        boxShadow: isActive ? '0 0 8px #D5ED55' : 'none',
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
                                                    background: isActive ? '#D5ED55' : '#F1F3EC',
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
                                                        <p style={{ fontSize: '13.5px', color: '#59655D', lineHeight: 1.65, margin: '0 0 10px' }}>
                                                            {acc.desc}
                                                        </p>
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
                6.5. KERALA WILDERNESS & SCENIC STAYS GALLERY
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="kerala-wilderness"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '100px 24px', background: '#F1F3EC' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> KERALA WILDERNESS & STAYS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 4.5vw, 48px)',
                                fontWeight: '800',
                                color: '#121613',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.12
                            }}>
                                Scenic mountain peaks & verified camp sanctuaries
                            </h2>
                        </div>
                        <Link
                            href="/about"
                            className="action-arrow-btn"
                        >
                            <span>Explore Nearby Places</span>
                            <div className="btn-arrow-circle">↗</div>
                        </Link>
                    </div>

                    {/* Gallery Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '28px'
                    }}>
                        {KERALA_WILDERNESS_GALLERY.map((spot, idx) => (
                            <motion.div
                                key={spot.id}
                                variants={fadeInUp}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    background: '#FFFFFF',
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(18, 22, 19, 0.08)',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                                    <motion.img
                                        src={spot.img}
                                        alt={spot.name}
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        background: 'rgba(14, 24, 17, 0.85)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#D5ED55',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        padding: '5px 12px',
                                        borderRadius: '999px',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {spot.badge}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '16px',
                                        right: '16px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#121613',
                                        fontSize: '11.5px',
                                        fontWeight: '800',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}>
                                        📍 {spot.altitude}
                                    </div>
                                </div>

                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#8E9B92', fontWeight: '700' }}>
                                                {spot.location}
                                            </span>
                                            <span style={{ color: '#C4CCC6' }}>•</span>
                                            <span style={{ fontSize: '12px', color: '#59655D', fontWeight: '600' }}>
                                                {spot.category}
                                            </span>
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '20px',
                                            fontWeight: '800',
                                            color: '#121613',
                                            letterSpacing: '-0.02em',
                                            marginBottom: '16px'
                                        }}>
                                            {spot.name}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => handleOpenBooking({ title: spot.name, price: 2999 })}
                                        style={{
                                            width: '100%',
                                            padding: '11px',
                                            borderRadius: '999px',
                                            background: '#F8F9F5',
                                            border: '1px solid rgba(18, 22, 19, 0.1)',
                                            color: '#121613',
                                            fontSize: '13.5px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#121613';
                                            e.currentTarget.style.color = '#D5ED55';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = '#F8F9F5';
                                            e.currentTarget.style.color = '#121613';
                                        }}
                                    >
                                        <span>Check Camp Dates</span>
                                        <span>↗</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                7. PACKAGES PREVIEW
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="packages" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '100px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> PACKAGES PREVIEW
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.035em', margin: 0 }}>
                                Handcrafted Wilderness Packages
                            </h2>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '999px', border: '1px solid rgba(18, 22, 19, 0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            {['All', 'Treks', 'Glamping', 'Water'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{ border: 'none', background: activeTab === tab ? '#121613' : 'transparent', color: activeTab === tab ? '#FFFFFF' : '#59655D', fontWeight: activeTab === tab ? '800' : '600', fontSize: '13px', padding: '8px 18px', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                    {tab === 'All' ? 'All Expeditions' : tab === 'Treks' ? 'Summit Treks' : tab === 'Glamping' ? 'Ridge Glamp' : 'Rapids & Lakes'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div 
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}
                    >
                        {filteredPackages.map(pkg => (
                            <motion.div 
                                key={pkg.id} 
                                variants={cardReveal}
                                className="hover-lift card-img-zoom" 
                                style={{ borderRadius: '28px', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}
                            >
                                <div style={{ position: 'relative', height: '250px' }}>
                                    <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                                        <span style={{ background: '#D5ED55', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '999px' }}>{pkg.tag}</span>
                                        <span style={{ background: 'rgba(0,0,0,0.65)', color: '#FFF', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', backdropFilter: 'blur(6px)' }}>{pkg.altitude}</span>
                                    </div>
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.92)', color: '#121613', fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>★ {pkg.rating} ({pkg.reviewsCount})</div>
                                </div>
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>{pkg.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.55, marginBottom: '14px' }}>{pkg.description}</p>
                                    
                                    {/* Expandable Inclusions Toggle */}
                                    <button 
                                        type="button" 
                                        onClick={() => setExpandedPackageId(expandedPackageId === pkg.id ? null : pkg.id)}
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#121613',
                                            background: '#F1F3EC',
                                            border: 'none',
                                            padding: '6px 14px',
                                            borderRadius: '999px',
                                            cursor: 'pointer',
                                            marginBottom: '14px',
                                            alignSelf: 'flex-start',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <span>{expandedPackageId === pkg.id ? 'Hide Inclusions ▲' : 'View Inclusions & Perks ▼'}</span>
                                    </button>

                                    {expandedPackageId === pkg.id && (
                                        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {pkg.highlights.map((h, i) => (
                                                <span key={i} style={{ fontSize: '11px', background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.1)', color: '#48544C', padding: '4px 10px', borderRadius: '999px' }}>
                                                    ✓ {h}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid rgba(18, 22, 19, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800', color: '#121613' }}>₹{pkg.price.toLocaleString()}</div>
                                            <span style={{ fontSize: '11px', color: '#59655D' }}>per person all-inclusive</span>
                                        </div>
                                        <button onClick={() => handleOpenBooking(pkg)} className="btn-lime" style={{ padding: '10px 22px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                                            Book Spot →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                8. CUSTOM ARRANGEMENTS & EVENTS
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="arrangements" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '100px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 56px' }}>
                        <div className="star-badge">
                            <span className="star-icon">★</span> ARRANGEMENTS & EVENTS
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.035em', marginBottom: '16px' }}>
                            Tailored Wilderness Arrangements For Every Tribe
                        </h2>
                    </div>

                    <motion.div 
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '48px' }}
                    >
                        {EVENT_ARRANGEMENTS.map((ev, idx) => (
                            <motion.div 
                                key={idx} 
                                variants={cardReveal}
                                className="hover-lift" 
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '24px', padding: '32px 28px', display: 'flex', flexDirection: 'column', boxShadow: '0 6px 20px rgba(0,0,0,0.02)' }}
                            >
                                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#121613', fontSize: '20px' }}>
                                    <i className={ev.iconClass}></i>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#8E9B92', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{ev.badge}</span>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>{ev.title}</h3>
                                <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.6, marginBottom: '18px' }}>{ev.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                9. MAKE IT HAPPEN IN JUST FOUR STEPS (Ref Screenshot 3 - media_1786656749498.png)
                   - Pinned sticky left heading while right steps scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <section 
                id="steps" 
                style={{ position: 'relative', padding: '120px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div className="sticky-split-grid">
                        
                        {/* Sticky Pinned Left Header */}
                        <div className="sticky-pinned-col">
                            <div className="star-badge">
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
                                Make it happen in <br />just <span style={{ color: '#8E9B92' }}>four steps</span>
                            </h2>
                            <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.7, marginBottom: '32px', maxWidth: '420px' }}>
                                We’ve made the entire process smooth and hassle-free. Our team guides you through every step from booking to arrival — just show up ready for waves & peaks.
                            </p>
                        </div>

                        {/* Scrolling Right Steps List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                            {FOUR_STEPS.map((step, idx) => (
                                <motion.div 
                                    key={idx} 
                                    variants={cardReveal}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-40px" }}
                                    style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: '#FFFFFF',
                                        border: '1px solid rgba(18, 22, 19, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '15px',
                                        fontWeight: '800',
                                        color: '#121613',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                                    }}>
                                        {step.num}
                                    </div>
                                    <div style={{ flex: 1, paddingTop: '12px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', marginBottom: '10px' }}>
                                            {step.title}
                                        </h3>
                                        <p style={{ fontSize: '15px', color: '#59655D', lineHeight: 1.65, margin: 0 }}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
            {/* ─────────────────────────────────────────────────────────────
                9.5 KERALA WILDERNESS & CAMPSITES GALLERY (Interactive Lightbox)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                id="kerala-wilderness" 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '100px 24px', background: '#FFFFFF' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '44px' }}>
                        <div>
                            <div className="star-badge">
                                <span className="star-icon">★</span> KERALA WILDERNESS GRID
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: '800', color: '#121613', letterSpacing: '-0.035em', margin: '0 0 10px' }}>
                                Verified Peaks, Glamping & Off-Road Hubs
                            </h2>
                            <p style={{ color: '#59655D', fontSize: '15px', margin: 0, maxWidth: '640px' }}>
                                Tap any spot to preview full resolution 4K imagery, mountain coordinates, altitude ratings, and safety reports.
                            </p>
                        </div>
                        <a href="https://instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" className="action-arrow-btn">
                            <span>Follow @aanandham.go</span>
                            <div className="btn-arrow-circle">📸</div>
                        </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {KERALA_WILDERNESS_GALLERY.map((spot) => (
                            <div
                                key={spot.id}
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
                                    <img src={spot.img} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        background: '#D5ED55',
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
                style={{ position: 'relative', padding: '110px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
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
                                A glimpse into life at our camp
                            </p>
                        </div>

                        {/* Carousel Navigation Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={prevTestimonial} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <i className="fa-solid fa-chevron-left" style={{ fontSize: '13px' }}></i>
                            </button>
                            <button onClick={nextTestimonial} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.1)', color: '#121613', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        
                        {/* Video Diaries Card */}
                        <motion.div 
                            variants={cardReveal}
                            onClick={() => setIsVideoModalOpen(true)} 
                            className="hover-lift card-img-zoom" 
                            style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '28px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 6px 25px rgba(0,0,0,0.02)' }}
                        >
                            <div style={{ position: 'relative', height: '280px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
                                <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80" alt="Campfire" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF', color: '#121613', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                    <i className="fa-solid fa-play" style={{ fontSize: '18px', marginLeft: '3px' }}></i>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#121613', fontWeight: '800', fontSize: '15px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#121613', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    <i className="fa-solid fa-play" style={{ marginLeft: '2px' }}></i>
                                </div>
                                <span>Watch our video diaries!</span>
                            </div>
                        </motion.div>

                        {/* Testimonial Cards (Circular modulo wrapping 2 cards to prevent layout jump) */}
                        {[TESTIMONIALS[testimonialIdx], TESTIMONIALS[(testimonialIdx + 1) % TESTIMONIALS.length]].map((t, idx) => (
                            <motion.div 
                                key={`${t.id}-${testimonialIdx}-${idx}`} 
                                variants={cardReveal}
                                className="hover-lift" 
                                style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '28px', padding: '36px', display: 'flex', flexDirection: 'column', boxShadow: '0 6px 25px rgba(0,0,0,0.02)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <img src={t.avatar} alt={t.author} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <span style={{ background: '#F8F9F5', border: '1px solid rgba(18, 22, 19, 0.08)', color: '#8E9B92', fontSize: '12px', fontWeight: '700', padding: '4px 14px', borderRadius: '999px' }}>
                                        {t.campBadge}
                                    </span>
                                </div>
                                <div style={{ fontSize: '36px', color: '#D5ED55', lineHeight: 1, marginBottom: '14px', fontWeight: '900' }}>
                                    ”
                                </div>
                                <p style={{ fontSize: '15px', color: '#121613', lineHeight: 1.7, marginBottom: '24px', flex: 1, fontWeight: '500' }}>
                                    {t.quote}
                                </p>
                                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(18, 22, 19, 0.06)' }}>
                                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', color: '#121613' }}>{t.author}</div>
                                    <div style={{ fontSize: '13px', color: '#8E9B92' }}>{t.batchDate}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                11. ORGANIC CURVED NATURE CTA BANNER (Ref Screenshot 3 & 5 Batch 3)
            ───────────────────────────────────────────────────────────── */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionReveal}
                style={{ position: 'relative', padding: '40px 24px 80px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <div style={{
                        position: 'relative',
                        borderRadius: '40px',
                        overflow: 'hidden',
                        padding: '110px 32px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06)'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80"
                            alt="Canopy"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.1)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14, 24, 17, 0.2) 0%, rgba(14, 24, 17, 0.65) 100%)' }} />
                        
                        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto' }}>
                            <div style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '2px', color: '#D5ED55', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
                                <span>★</span> READY?
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(32px, 5vw, 52px)',
                                fontWeight: '800',
                                color: '#FFFFFF',
                                letterSpacing: '-0.035em',
                                lineHeight: 1.15,
                                marginBottom: '32px'
                            }}>
                                Reserve your spot and join the adventure today
                            </h2>
                            <button
                                onClick={() => handleOpenBooking(EXPEDITION_PACKAGES[0])}
                                style={{
                                    background: 'rgba(213, 237, 85, 0.94)',
                                    color: '#121613',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    padding: '14px 44px',
                                    borderRadius: '999px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ─────────────────────────────────────────────────────────────
                12. FREQUENTLY ASKED QUESTIONS (Ref Screenshot 2 - media_1786656749472.png)
                   - Pinned sticky left contact card while right FAQ questions scroll until section end
            ───────────────────────────────────────────────────────────── */}
            <section 
                id="faq" 
                style={{ position: 'relative', padding: '120px 24px', background: '#F8F9F5' }}
            >
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    
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
                            className="hover-lift sticky-pinned-col" 
                            style={{ background: '#FFFFFF', border: '1px solid rgba(18, 22, 19, 0.08)', borderRadius: '28px', padding: '36px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)' }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px' }}>
                                👋
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', color: '#121613', marginBottom: '12px' }}>
                                Still have questions?
                            </h3>
                            <p style={{ fontSize: '14px', color: '#59655D', lineHeight: 1.65, marginBottom: '32px' }}>
                                Whether it’s about the program, accommodation, or anything in between – we’re happy to help.
                            </p>
                            <Link
                                href="/contact"
                                className="action-arrow-btn"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(18, 22, 19, 0.12)',
                                    padding: '14px 20px',
                                    borderRadius: '16px',
                                    boxSizing: 'border-box',
                                    textDecoration: 'none'
                                }}
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
                href="https://wa.me/919400987654?text=Hi%20Aanandham%20Concierge!%20I%20would%20like%20to%20know%20about%20upcoming%20camp%20batches"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-whatsapp-btn"
                aria-label="Chat with Aanandham Concierge on WhatsApp"
            >
                <i className="fa-brands fa-whatsapp"></i>
            </a>

            {scrolled && (
                <button
                    onClick={scrollToTop}
                    className="back-to-top-btn"
                    aria-label="Scroll back to top"
                >
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
            )}

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
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    zIndex: 10,
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                ✕
                            </button>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
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
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    zIndex: 10,
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '16px'
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
                                        <span style={{ background: '#D5ED55', color: '#121613', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '999px' }}>
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
                                        setSelectedLightboxImg(null);
                                        setIsBookingModalOpen(true);
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
