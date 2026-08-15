import fs from 'fs';
import path from 'path';
import { prisma, isPrismaConfigured } from './prisma';

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

// In-memory fallback if disk write is not available
let memoryStore = [...INITIAL_SERVER_BOOKINGS];

// Helper: Ensure directory exists on local disk
function ensureDataDir() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
    } catch (e) {
        // Ignored on read-only serverless filesystems (e.g. Vercel)
    }
}

// Helper: Read local disk fallback
function readLocalBookings() {
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
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(INITIAL_SERVER_BOOKINGS, null, 2), 'utf-8');
        return INITIAL_SERVER_BOOKINGS;
    } catch (err) {
        return memoryStore;
    }
}

// Helper: Write local disk fallback
function writeLocalBookings(bookings) {
    try {
        memoryStore = bookings;
        ensureDataDir();
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
        return true;
    } catch (err) {
        return true;
    }
}

// Helper: Convert Prisma DB record to application JSON format
function mapFromPrisma(record) {
    if (!record) return null;
    return {
        ...record,
        holdExpiresAt: record.holdExpiresAt != null ? Number(record.holdExpiresAt) : null,
        paidAt: record.paidAt ? record.paidAt.toISOString() : null,
        createdAt: typeof record.createdAt === 'string' ? record.createdAt : record.createdAt?.toISOString?.() || String(record.createdAt),
        addons: Array.isArray(record.addons) ? record.addons : (typeof record.addons === 'string' ? JSON.parse(record.addons || '[]') : [])
    };
}

// Helper: Convert application record to Prisma DB insert/update format
function mapToPrisma(data) {
    const payload = { ...data };
    if (payload.holdExpiresAt !== undefined) {
        payload.holdExpiresAt = payload.holdExpiresAt != null ? BigInt(Math.floor(Number(payload.holdExpiresAt))) : null;
    }
    if (payload.paidAt !== undefined) {
        payload.paidAt = payload.paidAt ? new Date(payload.paidAt) : null;
    }
    if (payload.createdAt !== undefined) {
        const d = new Date(payload.createdAt);
        payload.createdAt = isNaN(d.getTime()) ? new Date() : d;
    }
    if (payload.addons !== undefined) {
        payload.addons = Array.isArray(payload.addons) ? payload.addons : [];
    }
    if (payload.total !== undefined) {
        payload.total = Number(payload.total) || 0;
    }
    if (payload.guests !== undefined) {
        payload.guests = Number(payload.guests) || 1;
    }
    return payload;
}

/**
 * Retrieve all bookings (Postgres/Neon if configured, otherwise local JSON/memory fallback)
 */
export async function getStoredBookings() {
    if (isPrismaConfigured && prisma) {
        try {
            const records = await prisma.booking.findMany({
                orderBy: { createdAt: 'desc' }
            });
            if (records && records.length > 0) {
                return records.map(mapFromPrisma);
            }
            // Seed defaults if database is completely empty
            for (const item of INITIAL_SERVER_BOOKINGS) {
                try {
                    await prisma.booking.upsert({
                        where: { id: item.id },
                        create: mapToPrisma(item),
                        update: {}
                    });
                } catch {}
            }
            const seeded = await prisma.booking.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return seeded.map(mapFromPrisma);
        } catch (err) {
            console.error('Prisma query error, falling back to local store:', err);
        }
    }
    return readLocalBookings();
}

/**
 * Persist / Bulk-sync bookings list
 */
export async function saveStoredBookings(bookings) {
    writeLocalBookings(bookings);
    if (isPrismaConfigured && prisma && Array.isArray(bookings)) {
        try {
            for (const b of bookings) {
                const mapped = mapToPrisma(b);
                await prisma.booking.upsert({
                    where: { id: b.id },
                    create: mapped,
                    update: mapped
                });
            }
            return true;
        } catch (err) {
            console.error('Prisma bulk save error:', err);
        }
    }
    return true;
}

/**
 * Add a new booking record
 */
export async function addServerBooking(newBooking) {
    if (isPrismaConfigured && prisma) {
        try {
            const mapped = mapToPrisma(newBooking);
            const created = await prisma.booking.create({
                data: mapped
            });
            // Update local memory sync as well
            memoryStore = [mapFromPrisma(created), ...memoryStore.filter(b => b.id !== newBooking.id)];
            writeLocalBookings(memoryStore);
            return await getStoredBookings();
        } catch (err) {
            console.error('Prisma addServerBooking error, saving locally:', err);
        }
    }

    const list = readLocalBookings();
    const updated = [newBooking, ...list.filter(b => b.id !== newBooking.id)];
    writeLocalBookings(updated);
    return updated;
}

/**
 * Update an existing booking record by ID
 */
export async function updateServerBooking(id, updates) {
    if (isPrismaConfigured && prisma) {
        try {
            const mapped = mapToPrisma(updates);
            const updated = await prisma.booking.update({
                where: { id },
                data: mapped
            });
            memoryStore = memoryStore.map(b => b.id === id ? { ...b, ...mapFromPrisma(updated) } : b);
            writeLocalBookings(memoryStore);
            return await getStoredBookings();
        } catch (err) {
            console.error('Prisma updateServerBooking error, updating locally:', err);
        }
    }

    const list = readLocalBookings();
    const updated = list.map(b => b.id === id ? { ...b, ...updates } : b);
    writeLocalBookings(updated);
    return updated;
}

/**
 * Delete a booking record by ID
 */
export async function deleteServerBooking(id) {
    if (isPrismaConfigured && prisma) {
        try {
            await prisma.booking.delete({
                where: { id }
            });
            memoryStore = memoryStore.filter(b => b.id !== id);
            writeLocalBookings(memoryStore);
            return await getStoredBookings();
        } catch (err) {
            console.error('Prisma deleteServerBooking error, deleting locally:', err);
        }
    }

    const list = readLocalBookings();
    const updated = list.filter(b => b.id !== id);
    writeLocalBookings(updated);
    return updated;
}
