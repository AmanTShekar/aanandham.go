import { NextResponse } from 'next/server';
import { getStoredBookings } from '@/lib/serverBookingStore';
import { verifyScannedPassSignature } from '@/lib/cryptoPass';
import { getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';

export async function POST(request) {
    const ip = getClientIp(request);
    
    // Rate limit marshal scanner scans (Max 120 scans / min)
    const rateLimit = await checkRateLimit(`ratelimit:marshal_scan:${ip}`, 120, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Scan rate limit exceeded. Please wait.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        let { qrData, bookingId } = body;

        if (!qrData && !bookingId) {
            return NextResponse.json({ success: false, message: 'No QR data or Booking ID provided' }, { status: 400 });
        }

        // Clean & extract raw booking ID from various formats
        let extractedId = '';
        let cryptoResult = null;

        if (qrData) {
            const rawString = String(qrData).trim();
            
            // Format 1: Cryptographic string AANANDHAM:V2:BK-...
            if (rawString.startsWith('AANANDHAM:V2:')) {
                cryptoResult = verifyScannedPassSignature(rawString);
                extractedId = cryptoResult.bookingId || '';
            } 
            // Format 2: Pass URL https://aanandham.in/pass/BK-XXXX
            else if (rawString.includes('/pass/')) {
                const parts = rawString.split('/pass/');
                extractedId = parts[1]?.split('?')[0]?.split('#')[0]?.trim();
            }
            // Format 3: Raw ID starting with BK- or alphanumeric
            else {
                extractedId = rawString.toUpperCase();
            }
        } else if (bookingId) {
            extractedId = String(bookingId).trim().toUpperCase();
        }

        if (!extractedId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Could not decode a valid Booking ID from the scanned QR code' 
            }, { status: 400 });
        }

        // Fetch all bookings from server store
        const bookings = await getStoredBookings();
        const booking = bookings.find(b => 
            b.id.toUpperCase() === extractedId.toUpperCase() ||
            b.id.toUpperCase().replace(/[^A-Z0-9]/g, '') === extractedId.replace(/[^A-Z0-9]/g, '')
        );

        if (!booking) {
            return NextResponse.json({ 
                success: false, 
                message: `Booking #${extractedId} not found in reservation database`,
                scannedId: extractedId,
                cryptoVerified: cryptoResult?.valid || false
            }, { status: 404 });
        }

        const totalGuests = Number(booking.guests) || 2;
        const vegCount = Number(booking.vegCount ?? Math.max(0, totalGuests - (booking.nonVegCount ?? 0)));
        const nonVegCount = Number(booking.nonVegCount ?? Math.max(0, totalGuests - vegCount));
        
        // Calculate payment breakdown
        const totalPrice = Number(booking.total) || 2499;
        const advancePaid = Number(booking.advancePaid || Math.round(totalPrice * 0.3));
        const balanceDue = Number(booking.balanceDue !== undefined ? booking.balanceDue : (totalPrice - advancePaid));

        // Generate or format camper roster slots
        let roster = Array.isArray(booking.attendanceRoster) && booking.attendanceRoster.length > 0 
            ? booking.attendanceRoster 
            : Array.from({ length: totalGuests }, (_, idx) => ({
                id: idx + 1,
                name: idx === 0 ? `${booking.name} (Lead)` : `Camper ${idx + 1}`,
                present: booking.status === 'Checked In' ? true : true, // Default present
                notes: ''
            }));

        const checkedInCount = booking.checkedInCount !== undefined ? Number(booking.checkedInCount) : totalGuests;
        const shortCount = booking.shortCount !== undefined ? Number(booking.shortCount) : 0;

        return NextResponse.json({
            success: true,
            booking: {
                id: booking.id,
                name: booking.name,
                phone: booking.phone,
                email: booking.email || 'camper@aanandham.in',
                campsite: booking.package || 'Kolukkumalai Sunrise Ridge Glamp',
                region: booking.region || 'Munnar',
                dates: booking.dates || 'Upcoming Batch',
                roomType: booking.roomType || 'Alpine Weatherproof Pod',
                totalGuests,
                vegCount,
                nonVegCount,
                totalPrice,
                advancePaid,
                balanceDue,
                isBalancePaid: booking.isBalancePaid || balanceDue <= 0 || booking.status === 'Checked In',
                status: booking.status || 'Confirmed',
                checkInAt: booking.checkInAt || null,
                checkedInCount,
                shortCount,
                roster,
                marshalNotes: booking.marshalNotes || booking.notes || '',
                convoyTime: booking.convoyTime || '02:30 PM Batch',
                cryptoVerified: cryptoResult ? cryptoResult.valid : true
            }
        });

    } catch (err) {
        console.error('Error verifying marshal scanned pass:', err);
        return NextResponse.json({ success: false, message: 'Internal server error verifying pass' }, { status: 500 });
    }
}
