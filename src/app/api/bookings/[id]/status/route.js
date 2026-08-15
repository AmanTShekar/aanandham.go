import { NextResponse } from 'next/server';
import { getStoredBookings } from '@/lib/serverBookingStore';
import { checkRateLimit } from '@/lib/redis';

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

export async function GET(request, { params }) {
    const ip = getClientIp(request);
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
    }

    // Rate limit polling (Max 30 polls / min per IP)
    const rateLimit = await checkRateLimit(`ratelimit:booking_status:${ip}`, 30, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Polling rate limit exceeded' }, { status: 429 });
    }

    try {
        const bookings = getStoredBookings();
        const booking = bookings.find(b => b.id === id);

        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        const now = Date.now();
        let currentStatus = booking.status || 'Pending';
        let remainingHoldSeconds = 0;

        if (booking.holdExpiresAt) {
            const diffMs = booking.holdExpiresAt - now;
            remainingHoldSeconds = Math.max(0, Math.floor(diffMs / 1000));
            if (remainingHoldSeconds === 0 && currentStatus === 'Payment Pending') {
                currentStatus = 'Expired';
            }
        }

        return NextResponse.json({
            success: true,
            booking: {
                id: booking.id,
                name: booking.name,
                package: booking.package,
                dates: booking.dates,
                guests: booking.guests,
                total: booking.total,
                status: currentStatus,
                remainingHoldSeconds,
                createdAt: booking.createdAt
            }
        });
    } catch (err) {
        console.error('Error fetching booking status:', err);
        return NextResponse.json({ success: false, message: 'Server error retrieving status' }, { status: 500 });
    }
}
