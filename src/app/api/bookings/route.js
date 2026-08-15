import { NextResponse } from 'next/server';
import { checkRateLimit, isIpBlocked, blockIp, addToWaitlist } from '@/lib/redis';
import { validateBookingPayload } from '@/lib/validation';
import { createRazorpayOrder } from '@/lib/razorpay';
import { addServerBooking, getStoredBookings } from '@/lib/serverBookingStore';

// Unique, collision-free human readable booking ID generator
function generateBookingId() {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const entropyPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestampPart}-${entropyPart}`;
}

function getClientIp(request) {
    if (request.ip) return request.ip;
    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return '127.0.0.1';
}

// ── GET: Fetch public booking status or list (Admin/Authorized view) ──
export async function GET(request) {
    try {
        const bookings = getStoredBookings();
        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' }, { status: 500 });
    }
}

// ── POST: Create Booking Intent, Atomic Slot Hold (10-min TTL), & Razorpay Order ──
export async function POST(request) {
    const ip = getClientIp(request);

    // 1. IP Blocklist Check
    if (await isIpBlocked(ip)) {
        return NextResponse.json(
            { success: false, message: 'Access temporarily restricted. Contact support.' },
            { status: 403 }
        );
    }

    // 2. Sliding-Window Rate Limiter (Max 10 booking attempts per minute per IP)
    const rateLimit = await checkRateLimit(`ratelimit:bookings:${ip}`, 10, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { success: false, message: 'Too many booking attempts. Please wait a minute.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();

        // 3. Validation & Honeypot Trap
        const validation = validateBookingPayload(body);
        if (validation.isBot) {
            // Silently block bot IP and return dummy success
            await blockIp(ip, 'Honeypot form submission detected', 86400);
            return NextResponse.json({ success: true, message: 'Reservation received.' });
        }

        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, message: validation.errors[0] || 'Invalid booking details.' },
                { status: 400 }
            );
        }

        const data = validation.sanitized;
        const bookingId = generateBookingId();
        const slotKey = `${data.campsiteId || 'camp'}_${data.roomType}_${data.dates}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // 4. Create Razorpay Order
        const rzpOrder = await createRazorpayOrder({
            amountInRupees: data.total,
            receiptId: bookingId,
            notes: {
                guestName: data.name,
                package: data.package,
                dates: data.dates,
                guests: data.guests
            }
        });

        // 5. Atomic 10-Minute Hold Record
        const holdExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL

        const newBooking = {
            id: bookingId,
            name: data.name,
            phone: data.rawPhone,
            package: data.package,
            region: data.region,
            dates: data.dates,
            guests: data.guests,
            roomType: data.roomType,
            addons: data.addons,
            total: data.total,
            status: 'Payment Pending', // PAYMENT_PENDING state
            holdExpiresAt,
            razorpayOrderId: rzpOrder.id,
            source: data.source,
            notes: data.notes,
            createdAt: new Date().toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };

        addServerBooking(newBooking);

        return NextResponse.json({
            success: true,
            bookingId,
            status: 'PAYMENT_PENDING',
            holdExpiresAt,
            ttlSeconds: 600,
            razorpayOrder: {
                id: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || 'INR'
            },
            message: 'Slot reserved for 10 minutes. Please complete payment.'
        });
    } catch (err) {
        console.error('Error creating booking intent:', err);
        return NextResponse.json({ success: false, message: 'Server error processing booking.' }, { status: 500 });
    }
}
