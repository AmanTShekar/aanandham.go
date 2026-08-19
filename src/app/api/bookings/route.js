import { NextResponse, after } from 'next/server';
import crypto, { randomUUID } from 'crypto';
import { getClientIp, getAdminPayload } from '@/lib/authConfig';
import { checkRateLimit, isIpBlocked, blockIp, addToWaitlist, acquireSlotLock, releaseSlotLock, getIdempotentResponse, setIdempotentResponse } from '@/lib/redis';
import { validateBookingPayload } from '@/lib/validation';
import { createRazorpayOrder } from '@/lib/razorpay';
import { addServerBooking, getStoredBookings } from '@/lib/serverBookingStore';
import { findCampAndRoom, computeBookingTotal, campGuestCapacity, parseRoomCapacity } from '@/lib/pricing';
import { logLockContention } from '@/lib/monitoring';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { sanitizeLogOutput } from '@/lib/dlpSanitizer';

// Unique, collision-free human readable booking ID generator with cryptographic entropy
function generateBookingId() {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const entropyPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `BK-${timestampPart}-${entropyPart}`;
}

// Active bookings = confirmed/active, excluding cancelled/refunded and expired holds/stale inquiries
function isSlotOccupying(booking) {
    if (!booking || typeof booking !== 'object') return false;
    if (['Cancelled', 'Refunded', 'Expired', 'Failed'].includes(booking.status)) return false;
    
    const now = Date.now();
    // 1. Payment Pending holds expire after 10-minute hold window
    if (booking.status === 'Payment Pending') {
        if (booking.holdExpiresAt && now > booking.holdExpiresAt) {
            return false;
        }
    }

    // 2. Unconfirmed Pending inquiries expire after 24 hours if not confirmed by coordinator
    if (booking.status === 'Pending') {
        const createdMs = booking.createdAt ? new Date(booking.createdAt).getTime() : 0;
        if (createdMs && !isNaN(createdMs) && (now - createdMs > 24 * 60 * 60 * 1000)) {
            return false; // Stale inquiry (>24h) does not block capacity
        }
    }

    return true;
}

// ── GET: Booking list (admin only — never expose guest PII publicly) ──
export async function GET(request) {
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(`ratelimit:bookings_get:${ip}`, 30, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const bookings = await getStoredBookings();
        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' }, { status: 500 });
    }
}

// ── POST: Booking intent (inquiry/WhatsApp mode or paid mode) ──
export async function POST(request) {
    const ip = getClientIp(request);

    // 0. Payload Size Bound (Max 64KB)
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 65536) {
        return NextResponse.json({ success: false, message: 'Payload size limit exceeded.' }, { status: 413 });
    }

    // 1. Client Idempotency Key Check (Prevents duplicate charges/bookings on network retries)
    const idempotencyKey = request.headers.get('idempotency-key') || request.headers.get('x-idempotency-key');
    if (idempotencyKey) {
        const cachedResponse = await getIdempotentResponse(idempotencyKey);
        if (cachedResponse) {
            return NextResponse.json(cachedResponse);
        }
    }

    // 2. IP Blocklist Check
    if (await isIpBlocked(ip)) {
        return NextResponse.json(
            { success: false, message: 'Access temporarily restricted. Contact support.' },
            { status: 403 }
        );
    }

    // 3. Sliding-Window Rate Limiter (Max 10 booking attempts per minute per IP)
    const rateLimit = await checkRateLimit(`ratelimit:bookings:${ip}`, 10, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { success: false, message: 'Too many booking attempts. Please wait a minute.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();

        // 4. Validation & Honeypot Trap
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
        const campsiteId = data.campsiteId || data.package.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const roomId = data.roomType.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const { camp, room } = findCampAndRoom(campsiteId, roomId);

        // Determine if customer selected Automated Razorpay Gateway or Direct UPI / Concierge
        const isOnlineGateway = body.paymentGateway === 'razorpay' || body.paymentMethod === 'razorpay' || body.mode === 'razorpay';

        // 5. Distributed Mutex Lock across Redis/Server Instances
        const slotKey = `slot:${campsiteId}:${data.dates}`;
        const lockId = randomUUID();

        const lockAcquired = await acquireSlotLock(slotKey, lockId, 30);
        if (!lockAcquired) {
            await logLockContention(slotKey, ip);
            return NextResponse.json(
                { success: false, message: 'Another booking is being processed for this exact slot right now. Please try again in 30 seconds.' },
                { status: 409 }
            );
        }

        try {

        // 6. Slot capacity check (lazy eviction of expired holds)
        let capacity = campGuestCapacity(camp);
        const allBookings = await getStoredBookings();
        const existing = allBookings.filter(b => isSlotOccupying(b) && b.slotKey === slotKey);
        const bookedGuests = existing.reduce((sum, b) => sum + (Number(b.guests) || 0), 0);
        const incomingGuests = Number(data.guests) || 1;

        if (camp && bookedGuests + incomingGuests > capacity) {
            await addToWaitlist(slotKey, `WAIT-${Date.now()}`, { name: data.name, phone: data.phone });
            return NextResponse.json(
                { success: false, message: 'This campsite is fully booked for the selected dates. You have been added to the waitlist — we will notify you if a slot opens up.' },
                { status: 409 }
            );
        }

        // 7. Server-side price authority (recomputes total from verified catalogue)
        let serverTotal = Number(data.total) || 0;
        let discountPercent = 0;
        const adults = Math.max(1, Number(body.adults) || Number(data.guests) || 1);
        const children = Math.max(0, Number(body.children) || 0);

        const pricing = computeBookingTotal({
            camp,
            room,
            adults,
            children,
            addonIds: Array.isArray(body.addonIds) ? body.addonIds : []
        });
        serverTotal = pricing.total > 0 ? pricing.total : serverTotal;
        discountPercent = pricing.discountPercent;

        const bookingId = generateBookingId();

        // Money integrity: advance/balance derived from the server-authoritative total,
        // never from client-supplied figures. UPI bookings stay unverified (0 paid)
        // until the coordinator confirms the UTR.
        const advanceRatio = data.paymentMode?.includes('30%') ? 0.3 : (data.paymentMode?.includes('100%') ? 1 : 0);
        const claimedPaid = isOnlineGateway ? Math.round(serverTotal * advanceRatio) : 0;
        const utrValue = isOnlineGateway ? null : (data.utrNumber && data.utrNumber !== 'UPI-DIRECT-INTENT' ? data.utrNumber : null);

        // 8. Handle Gateway Order only if Online Razorpay Checkout is selected
        let rzpOrder = null;
        if (isOnlineGateway) {
            if (serverTotal < 100) {
                return NextResponse.json({ success: false, message: 'Invalid booking amount.' }, { status: 400 });
            }
            rzpOrder = await createRazorpayOrder({
                amountInRupees: serverTotal,
                receiptId: bookingId,
                notes: {
                    guestName: data.name,
                    package: data.package,
                    dates: data.dates,
                    guests: data.guests
                }
            });
        }

        const holdExpiresAt = isOnlineGateway ? Date.now() + 10 * 60 * 1000 : null; // 10 minutes TTL for gateway checkout

        const newBooking = {
            id: bookingId,
            slotKey,
            name: data.name,
            phone: data.rawPhone,
            package: data.package,
            region: data.region,
            dates: data.dates,
            guests: data.guests,
            roomType: data.roomType,
            addons: data.addons,
            total: serverTotal,
            paidAmount: claimedPaid,
            balanceDue: Math.max(0, serverTotal - claimedPaid),
            paymentMode: data.paymentMode || (isOnlineGateway ? 'Razorpay Gateway' : 'Direct UPI'),
            utrNumber: utrValue,
            dietaryChoice: data.dietaryChoice || 'Standard Campfire BBQ',
            vegCount: data.vegCount || 0,
            nonVegCount: data.nonVegCount || 0,
            mealSummary: data.mealSummary || null,
            status: isOnlineGateway ? 'Payment Pending' : 'Pending',
            holdExpiresAt,
            razorpayOrderId: rzpOrder ? rzpOrder.id : null,
            source: data.source,
            notes: data.notes,
            createdAt: new Date().toISOString()
        };

        await addServerBooking(newBooking);

        // Guarantees post-response completion on serverless lambdas
        after(async () => {
            try {
                await sendBookingConfirmationEmail(newBooking);
            } catch (err) {
                console.error('[EMAIL DISPATCH ERROR]', err);
            }
        });

        if (!isOnlineGateway) {
            const resData = {
                success: true,
                bookingId,
                status: 'Pending',
                message: 'Reservation received. Our concierge desk will confirm your booking shortly.'
            };
            if (idempotencyKey) await setIdempotentResponse(idempotencyKey, resData);
            return NextResponse.json(resData);
        }

        const resData = {
            success: true,
            bookingId,
            status: 'Payment Pending',
            holdExpiresAt,
            ttlSeconds: 600,
            discountPercent,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
            razorpayOrder: {
                id: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || 'INR'
            },
            message: 'Slot reserved for 10 minutes. Please complete payment.'
        };
        if (idempotencyKey) await setIdempotentResponse(idempotencyKey, resData);
        return NextResponse.json(resData);
    } finally {
        // Always release the lock regardless of success or failure
        await releaseSlotLock(slotKey, lockId);
    }
    } catch (err) {
        console.error(sanitizeLogOutput(`[BOOKING INTENT ERROR] ${err.message}`));
        return NextResponse.json({ success: false, message: 'Server error processing booking.' }, { status: 500 });
    }
}