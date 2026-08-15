import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const INITIAL_SERVER_BOOKINGS = [
    {
        id: 'BK-M98X4K-A1',
        name: 'Arjun Menon',
        phone: '+91 98471 23456',
        package: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        region: 'Munnar',
        dates: 'Next Saturday – Sunday',
        guests: 4,
        roomType: '1 × Weatherproof Alpine 4-Person Tent',
        addons: ['Campfire Live Barbecue Platter', 'Private 4x4 Off-Road Jeep Upgrade'],
        total: 8846,
        status: 'Confirmed',
        source: 'Website Booking Engine',
        createdAt: '14 Aug, 10:30 AM'
    },
    {
        id: 'BK-M98X4K-B2',
        name: 'Pooja & Vikram',
        phone: '+91 94470 56789',
        package: 'Suryanelli Valley Ridge Geodesic Glamping',
        region: 'Munnar',
        dates: 'Upcoming Weekend',
        guests: 2,
        roomType: '1 × Geodesic Luxury Dome Pod',
        addons: ['4K Drone Mountain Video Reel Shoot'],
        total: 6498,
        status: 'Pending',
        source: 'Instant Reservation',
        createdAt: '15 Aug, 02:15 PM'
    },
    {
        id: 'BK-M98X4K-C3',
        name: 'Dr. Siddharth & Squad',
        phone: '+91 97455 89012',
        package: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        region: 'Silent Valley',
        dates: 'Sep 05 – 06, 2026',
        guests: 6,
        roomType: '2 × Weatherproof Alpine 4-Person Tent',
        addons: ['Campfire Live Barbecue Platter'],
        total: 21894,
        status: 'Confirmed',
        source: 'Contact Form',
        createdAt: '15 Aug, 04:45 PM'
    }
];

// Ensure directory exists
function ensureDataDir() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
    } catch (e) {
        console.error('Error creating data dir:', e);
    }
}

// In-memory fallback if disk write is not available
let memoryStore = [...INITIAL_SERVER_BOOKINGS];

export function getStoredBookings() {
    try {
        ensureDataDir();
        if (fs.existsSync(BOOKINGS_FILE)) {
            const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
            const data = JSON.parse(raw);
            if (Array.isArray(data) && data.length > 0) {
                memoryStore = data;
                return data;
            }
        }
        // Initialize with default demo bookings if file doesn't exist
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(INITIAL_SERVER_BOOKINGS, null, 2), 'utf-8');
        return INITIAL_SERVER_BOOKINGS;
    } catch (err) {
        console.error('Error reading bookings file, falling back to memory store:', err);
        return memoryStore;
    }
}

export function saveStoredBookings(bookings) {
    try {
        memoryStore = bookings;
        ensureDataDir();
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.error('Error writing bookings file, saved to memory store:', err);
        return true;
    }
}

export function addServerBooking(newBooking) {
    const list = getStoredBookings();
    const updated = [newBooking, ...list];
    saveStoredBookings(updated);
    return updated;
}

export function updateServerBooking(id, updates) {
    const list = getStoredBookings();
    const updated = list.map(b => b.id === id ? { ...b, ...updates } : b);
    saveStoredBookings(updated);
    return updated;
}

export function deleteServerBooking(id) {
    const list = getStoredBookings();
    const updated = list.filter(b => b.id !== id);
    saveStoredBookings(updated);
    return updated;
}
