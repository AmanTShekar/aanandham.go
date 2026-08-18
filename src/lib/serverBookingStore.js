import fs from 'fs';
import path from 'path';
import { prisma, isPrismaConfigured } from './prisma.js';

const DATA_DIR = path.join(process.cwd(), '.data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const INITIAL_SERVER_BOOKINGS = [];

// In-memory fallback if disk write is not available
let memoryStore = [];

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
            if (Array.isArray(data)) {
                memoryStore = data;
                return data;
            }
        }
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
        return [];
    } catch (err) {
        return memoryStore;
    }
}

// Helper: Write local disk fallback (only used in pure local / non-Prisma development mode)
function writeLocalBookings(bookings) {
    memoryStore = bookings;
    // On production or when PostgreSQL/Prisma is configured, skip doomed disk writes on read-only serverless filesystems
    if (isPrismaConfigured) {
        return { success: true, inMemoryOnly: true };
    }
    try {
        ensureDataDir();
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
        return { success: true, persistedToDisk: true };
    } catch (err) {
        return { success: false, persistedToDisk: false, inMemoryOnly: true, error: err.message };
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
        addons: Array.isArray(record.addons) ? record.addons : (typeof record.addons === 'string' ? JSON.parse(record.addons || '[]') : []),
        utrNumber: record.utrNumber || null,
        paidAmount: record.paidAmount != null ? Number(record.paidAmount) : null,
        balanceDue: record.balanceDue != null ? Number(record.balanceDue) : null,
        paymentMode: record.paymentMode || null,
        mealSummary: record.mealSummary || null,
        dietaryChoice: record.dietaryChoice || null,
        vegCount: record.vegCount != null ? Number(record.vegCount) : null,
        nonVegCount: record.nonVegCount != null ? Number(record.nonVegCount) : null
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
    if (payload.paidAmount !== undefined) {
        payload.paidAmount = payload.paidAmount != null ? Number(payload.paidAmount) : null;
    }
    if (payload.balanceDue !== undefined) {
        payload.balanceDue = payload.balanceDue != null ? Number(payload.balanceDue) : null;
    }
    if (payload.guests !== undefined) {
        payload.guests = Number(payload.guests) || 1;
    }
    if (payload.vegCount !== undefined) {
        payload.vegCount = payload.vegCount != null ? Number(payload.vegCount) : null;
    }
    if (payload.nonVegCount !== undefined) {
        payload.nonVegCount = payload.nonVegCount != null ? Number(payload.nonVegCount) : null;
    }

    // Strip in-memory extra fields that are not defined in the Prisma PostgreSQL schema
    delete payload.email;
    delete payload.campsiteId;
    delete payload.advancePaid;
    delete payload.isBalancePaid;
    delete payload.attendanceRoster;
    delete payload.checkedInCount;
    delete payload.shortCount;
    delete payload.checkInAt;
    delete payload.marshalName;
    delete payload.marshalNotes;
    delete payload.convoyTime;
    delete payload.lastUpdated;

    return payload;
}

/**
 * Retrieve bookings with optional pagination (Postgres/Neon if configured, otherwise local JSON/memory fallback)
 */
export async function getStoredBookings({ limit, offset } = {}) {
    if (isPrismaConfigured && prisma) {
        try {
            const query = {
                orderBy: { createdAt: 'desc' }
            };
            if (typeof limit === 'number' && limit > 0) {
                query.take = limit;
            }
            if (typeof offset === 'number' && offset >= 0) {
                query.skip = offset;
            }
            const records = await prisma.booking.findMany(query);
            return (records || []).map(mapFromPrisma);
        } catch (err) {
            console.error('Prisma query error, falling back to local store:', err);
        }
    }
    const all = readLocalBookings();
    if (typeof offset === 'number' || typeof limit === 'number') {
        const start = typeof offset === 'number' ? offset : 0;
        const end = typeof limit === 'number' ? start + limit : undefined;
        return all.slice(start, end);
    }
    return all;
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
 * Add a new booking record (returns single created record, avoiding full-table findMany)
 */
export async function addServerBooking(newBooking) {
    const list = readLocalBookings();
    const updated = [newBooking, ...list.filter(b => b.id !== newBooking.id)];
    writeLocalBookings(updated);

    if (isPrismaConfigured && prisma) {
        try {
            const mapped = mapToPrisma(newBooking);
            const created = await prisma.booking.upsert({
                where: { id: newBooking.id },
                create: mapped,
                update: mapped
            });
            const result = mapFromPrisma(created);
            memoryStore = [result, ...memoryStore.filter(b => b.id !== newBooking.id)];
            return result;
        } catch (err) {
            console.error('Prisma addServerBooking error, saved locally:', err);
        }
    }

    return newBooking;
}

/**
 * Update an existing booking record by ID (returns single updated record, avoiding full-table findMany)
 */
export async function updateServerBooking(id, updates) {
    const list = readLocalBookings();
    let updatedRecord = null;
    let found = false;
    const updated = list.map(b => {
        if (b.id.toUpperCase() === id.toUpperCase()) {
            found = true;
            updatedRecord = { ...b, ...updates };
            return updatedRecord;
        }
        return b;
    });

    if (!found) {
        updatedRecord = { id, ...updates };
        updated.unshift(updatedRecord);
    }
    writeLocalBookings(updated);

    if (isPrismaConfigured && prisma) {
        try {
            const mapped = mapToPrisma({ id, ...updates });
            const updatedPrisma = await prisma.booking.upsert({
                where: { id },
                create: {
                    id,
                    name: updates.name || 'Explorer Lead',
                    phone: updates.phone || '+91 98471 23456',
                    package: updates.package || 'Kolukkumalai Sunrise Ridge Glamp',
                    dates: updates.dates || 'Upcoming Weekend',
                    guests: Number(updates.guests) || 2,
                    roomType: updates.roomType || 'Geodesic Luxury Dome Pod',
                    total: Number(updates.total) || 4998,
                    ...mapped
                },
                update: mapped
            });
            const result = mapFromPrisma(updatedPrisma);
            memoryStore = memoryStore.map(b => b.id === id ? { ...b, ...result } : b);
            return result;
        } catch (err) {
            console.error('Prisma updateServerBooking error, saved locally:', err);
        }
    }

    return updatedRecord || { id, ...updates };
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
            return { success: true, id };
        } catch (err) {
            console.error('Prisma deleteServerBooking error, deleting locally:', err);
        }
    }

    const list = readLocalBookings();
    const updated = list.filter(b => b.id !== id);
    writeLocalBookings(updated);
    return { success: true, id };
}
