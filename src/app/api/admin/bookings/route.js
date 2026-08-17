import { NextResponse } from 'next/server';
import { getAdminPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit, isIpBlocked } from '@/lib/redis';
import { validateBookingPayload, sanitizePhone } from '@/lib/validation';
import { getStoredBookings, saveStoredBookings, addServerBooking, updateServerBooking, deleteServerBooking } from '@/lib/serverBookingStore';
import { sanitizeBookingsForRole } from '@/lib/rbac';
import { sanitizeLogOutput } from '@/lib/dlpSanitizer';

// Unique, collision-free human readable booking ID generator
export function generateBookingId() {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const entropyPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestampPart}-${entropyPart}`;
}

// Status values allowed to be written by the admin panel
const ALLOWED_STATUSES = ['Pending', 'Confirmed', 'Checked In', 'Cancelled', 'Refunded', 'Payment Pending', 'Expired'];

// Fields an admin may update via PATCH (strict whitelist — total/phone/name stay tamper-proof)
const PATCHABLE_FIELDS = ['status', 'notes', 'roomType', 'dates', 'guests'];

// Validate a single booking record (strict, bank-grade)
function normalizeRecord(body) {
    const name = (body.name || '').trim();
    const rawPhone = (body.phone || '').trim();
    const cleanedPhone = sanitizePhone(rawPhone).replace(/\D/g, '');

    if (!name || name.length < 2 || name.length > 80) return null;
    if (!cleanedPhone || cleanedPhone.length < 10) return null;

    const guests = Number(body.guests);
    if (isNaN(guests) || guests < 1 || guests > 50) return null;

    const total = Number(body.total);
    if (isNaN(total) || total < 100 || total > 1000000) return null;

    const status = (body.status || 'Pending').trim();
    if (!ALLOWED_STATUSES.includes(status)) return null;

    return {
        id: body.id || generateBookingId(),
        name,
        phone: rawPhone,
        package: String(body.package || 'Wilderness Glamping').slice(0, 200),
        region: String(body.region || 'Munnar').slice(0, 100),
        dates: String(body.dates || 'Flexible / Upcoming Weekend').slice(0, 100),
        guests,
        roomType: String(body.roomType || 'Standard Glamping').slice(0, 100),
        addons: Array.isArray(body.addons) ? body.addons.filter(a => typeof a === 'string').slice(0, 20) : [],
        total,
        status,
        source: String(body.source || 'Website Booking Engine').slice(0, 50),
        notes: String(body.notes || '').slice(0, 500),
        createdAt: String(body.createdAt || new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })).slice(0, 60)
    };
}

// ── GET: Read all bookings with optional pagination (auth required) ──
export async function GET(request) {
    const ip = getClientIp(request);

    // 1. Rate Limit
    const rateLimit = await checkRateLimit(`ratelimit:admin_bookings_get:${ip}`, 60, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    // 2. Auth Check
    const adminPayload = getAdminPayload(request);
    if (!adminPayload) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const offsetParam = searchParams.get('offset');
        const limit = limitParam ? Math.min(500, Math.max(1, parseInt(limitParam, 10))) : undefined;
        const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : undefined;

        const bookings = await getStoredBookings({ limit, offset });
        const role = adminPayload?.role || 'owner';
        const roleSanitized = sanitizeBookingsForRole(bookings, role);
        return NextResponse.json({ success: true, bookings: roleSanitized });
    } catch (err) {
        console.error(sanitizeLogOutput(`[ADMIN BOOKINGS GET ERROR] ${err.message}`));
        return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' }, { status: 500 });
    }
}

// ── POST: Create one booking or bulk-sync an array (admin only) ──
export async function POST(request) {
    const ip = getClientIp(request);

    if (await isIpBlocked(ip)) {
        return NextResponse.json({ success: false, message: 'Access temporarily restricted.' }, { status: 403 });
    }

    const rateLimit = await checkRateLimit(`ratelimit:admin_bookings_write:${ip}`, 20, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Bulk sync mode (admin dashboard sends the full array)
        if (Array.isArray(body)) {
            if (body.length > 1000) {
                return NextResponse.json({ success: false, message: 'Batch too large.' }, { status: 400 });
            }
            const normalized = body.map(normalizeRecord).filter(Boolean);
            // Bulk replace is dangerous — instead merge: keep existing ids, add/update normalized ones
            const existing = await getStoredBookings();
            const byId = new Map(existing.map(b => [b.id, b]));
            for (const rec of normalized) {
                byId.set(rec.id, { ...(byId.get(rec.id) || {}), ...rec });
            }
            const merged = Array.from(byId.values());
            await saveStoredBookings(merged);
            return NextResponse.json({ success: true, bookings: merged, totalCount: merged.length });
        }

        // Single record mode
        const rec = normalizeRecord(body);
        if (!rec) {
            return NextResponse.json({ success: false, message: 'Invalid booking details.' }, { status: 400 });
        }
        const created = await addServerBooking(rec);
        return NextResponse.json({ success: true, booking: created });
    } catch (err) {
        console.error('Error creating booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while recording booking' }, { status: 500 });
    }
}

// ── PATCH: Update whitelisted fields of a booking (admin only) ──
export async function PATCH(request) {
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(`ratelimit:admin_bookings_write:${ip}`, 20, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
        }

        // Strict whitelist — no arbitrary field injection
        const cleanUpdates = {};
        for (const key of Object.keys(updates)) {
            if (!PATCHABLE_FIELDS.includes(key)) continue;
            if (key === 'status' && !ALLOWED_STATUSES.includes(String(updates[key]))) continue;
            if (key === 'guests') {
                const g = Number(updates[key]);
                if (isNaN(g) || g < 1 || g > 50) continue;
                cleanUpdates[key] = g;
                continue;
            }
            if (key === 'notes') {
                cleanUpdates[key] = String(updates[key]).slice(0, 500);
                continue;
            }
            cleanUpdates[key] = String(updates[key]).slice(0, 100);
        }

        if (Object.keys(cleanUpdates).length === 0) {
            return NextResponse.json({ success: false, message: 'No valid fields to update.' }, { status: 400 });
        }

        const updated = await updateServerBooking(id, cleanUpdates);
        return NextResponse.json({ success: true, booking: updated });
    } catch (err) {
        console.error('Error updating booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while updating booking' }, { status: 500 });
    }
}

// ── DELETE: Remove a booking (admin only) ──
export async function DELETE(request) {
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(`ratelimit:admin_bookings_write:${ip}`, 20, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || id.length > 64) {
            return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
        }

        const result = await deleteServerBooking(id);
        return NextResponse.json({ success: true, ...result });
    } catch (err) {
        console.error('Error deleting booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while deleting booking' }, { status: 500 });
    }
}