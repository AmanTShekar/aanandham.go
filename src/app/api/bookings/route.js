import { NextResponse } from 'next/server';
import { getClientIp, getAdminPayload } from '@/lib/authConfig';
import { checkRateLimit, isIpBlocked, blockIp, addToWaitlist } from '@/lib/redis';
import { validateBookingPayload } from '@/lib/validation';
import { createRazorpayOrder } from '@/lib/razorpay';
import { addServerBooking, getStoredBookings } from '@/lib/serverBookingStore';
import { findCampAndRoom, computeBookingTotal, campGuestCapacity, parseRoomCapacity } from '@/lib/pricing';

// Unique, collision-free human readable booking ID generator
function generateBookingId() {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const entropyPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestampPart}-${entropyPart}`;
}

// Active bookings = everything not cancelled/refunded/expired
function isActiveStatus(status) {
    return !['Cancelled', 'Refunded', 'Expired'].includes(status);
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
        const bookings = getStoredBookings();
        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return NextResponse.json({ success: false, message: 'Failed to retrieve bookings' }, { status: 500 });
    }
}

// ── POST: Booking intent (inquiry/WhatsApp mode or paid mode) ──
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
        const isInquiryMode = body.mode === 'whatsapp' || body.mode === 'inquiry';

        // 4. Slot capacity check (atomic allocation on the slot key)
        const slotKey = `${data.campsiteId || 'camp'}_${data.roomType}_${data.dates}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const { camp, room } = findCampAndRoom(data.campsiteId, body.roomId);

        let capacity = campGuestCapacity(camp);
        const existing = getStoredBookings().filter(b => isActiveStatus(b.status) && b.slotKey === slotKey);
        const bookedGuests = existing.reduce((sum, b) => sum + (Number(b.guests) || 0), 0);
        const incomingGuests = Number(data.guests) || 1;

        if (camp && bookedGuests + incomingGuests > capacity) {
            await addToWaitlist(ip, data.phone || 'unknown', slotKey);
            return NextResponse.json(
                { success: false, message: 'This campsite is fully booked for the selected dates. You have been added to the waitlist — we will notify you if a slot opens up.' },
                { status: 409 }
            );
        }

        // 5. Server-side price authority (client-supplied `total` is never trusted)
        let serverTotal = Number(data.total) || 0;
        let discountPercent = 0;
        if (!isInquiryMode) {
            const adults = Math.max(1, Number(body.adults) || Number(data.guests) || 1);
            const children = Math.max(0, Number(body.children) || 0);
            if (adults + children !== Number(data.guests)) {
                return NextResponse.json({ success: false, message: 'Guest count mismatch.' }, { status: 400 });
            }
            const pricing = computeBookingTotal({
                camp,
                room,
                adults,
                children,
                addonIds: Array.isArray(body.addonIds) ? body.addonIds : []
            });
            serverTotal = pricing.total;
            discountPercent = pricing.discountPercent;

            // Price sanity bound: paid mode must always go through Razorpay
            if (serverTotal < 100) {
                return NextResponse.json({ success: false, message: 'Invalid booking amount.' }, { status: 400 });
            }
        }

        const bookingId = generateBookingId();

        // 6. Create Razorpay Order (paid mode only)
        let rzpOrder = null;
        if (!isInquiryMode) {
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

        // 7. Persist booking record (10-minute hold on paid mode)
        const holdExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL

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
            status: isInquiryMode ? 'Pending' : 'Payment Pending', // PAYMENT_PENDING state
            holdExpiresAt: isInquiryMode ? null : holdExpiresAt,
            razorpayOrderId: rzpOrder ? rzpOrder.id : null,
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

        if (isInquiryMode) {
            return NextResponse.json({
                success: true,
                bookingId,
                status: 'PENDING',
                message: 'Reservation request received. Our team will confirm availability shortly.'
            });
        }

        return NextResponse.json({
            success: true,
            bookingId,
            status: 'PAYMENT_PENDING',
            holdExpiresAt,
            ttlSeconds: 600,
            discountPercent,
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