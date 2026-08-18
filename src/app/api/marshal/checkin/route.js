import { NextResponse } from 'next/server';
import { getStoredBookings, saveStoredBookings, updateServerBooking } from '@/lib/serverBookingStore';
import { getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';

export async function POST(request) {
    const ip = getClientIp(request);

    // Rate limit checkin actions
    const rateLimit = await checkRateLimit(`ratelimit:marshal_checkin:${ip}`, 60, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many check-in attempts' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { 
            bookingId, 
            checkedInCount, 
            shortCount, 
            roster, 
            isBalancePaid, 
            paymentMode = '',
            settlementMethod = '',
            balanceCollected = 0,
            assignedTent = '',
            wristbandRange = '',
            marshalNotes,
            marshalName = 'Basecamp Host' 
        } = body;

        if (!bookingId) {
            return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
        }

        const bookings = await getStoredBookings();
        const bookingIndex = bookings.findIndex(b => b.id.toUpperCase() === bookingId.toUpperCase());

        const numPresent = Number(checkedInCount) || 0;
        const numShort = Number(shortCount) || 0;
        const updatedRoster = Array.isArray(roster) ? roster : [];
        const existing = bookingIndex !== -1 ? bookings[bookingIndex] : {
            id: bookingId,
            name: body.name || 'Explorer Lead',
            phone: body.phone || '+91 98471 23456',
            email: body.email || 'camper@aanandham.in',
            package: body.campsite || 'Kolukkumalai Sunrise Ridge Glamp',
            dates: 'Upcoming Weekend (2D / 1N)',
            roomType: assignedTent || 'Geodesic Luxury Dome Pod',
            guests: Math.max(numPresent + numShort, updatedRoster.length, 1),
            total: Math.max(numPresent + numShort, updatedRoster.length, 1) * 2499,
            advancePaid: Math.round(Math.max(numPresent + numShort, updatedRoster.length, 1) * 2499 * 0.3),
            balanceDue: Math.max(numPresent + numShort, updatedRoster.length, 1) * 2499 * 0.7,
            createdAt: new Date().toISOString()
        };

        const updatedTotalGuests = Math.max(numPresent + numShort, updatedRoster.length, Number(existing.guests) || 1);
        const newStatus = numShort > 0 ? 'Partial Check-In' : 'Checked In';

        const updatedRecord = {
            ...existing,
            status: newStatus,
            guests: updatedTotalGuests,
            checkedInCount: numPresent,
            shortCount: numShort,
            attendanceRoster: updatedRoster,
            isBalancePaid: Boolean(isBalancePaid),
            balanceDue: isBalancePaid ? 0 : (existing.balanceDue || 0),
            paymentMode: isBalancePaid ? (paymentMode || existing.paymentMode || 'Cash / UPI at Gate') : existing.paymentMode,
            settlementMethod: isBalancePaid ? settlementMethod : (existing.settlementMethod || null),
            balanceCollected: isBalancePaid ? (Number(balanceCollected) || existing.balanceDue || 0) : 0,
            assignedTent: String(assignedTent || existing.assignedTent || existing.roomType || existing.package || '').slice(0, 100),
            wristbandRange: String(wristbandRange || existing.wristbandRange || '').slice(0, 100),
            checkInAt: existing.checkInAt || new Date().toISOString(),
            marshalName: String(marshalName).slice(0, 80),
            marshalNotes: String(marshalNotes || '').slice(0, 500),
            lastUpdated: new Date().toISOString()
        };

        if (bookingIndex !== -1) {
            bookings[bookingIndex] = updatedRecord;
        } else {
            bookings.unshift(updatedRecord);
        }

        await saveStoredBookings(bookings);

        // Also update Prisma / local store via unified updateServerBooking
        try {
            await updateServerBooking(bookingId, {
                ...updatedRecord,
                status: newStatus,
                guests: updatedTotalGuests,
                paymentMode: updatedRecord.paymentMode,
                notes: `[Checked-In by ${marshalName} on ${new Date().toLocaleTimeString('en-IN')}: ${numPresent} Present, ${numShort} Short. Balance Paid: ${isBalancePaid ? `YES (${paymentMode || 'Settled'})` : 'NO'}] ${marshalNotes || ''}`
            });
        } catch (e) {
            console.warn('DB update sync notice:', e.message);
        }

        return NextResponse.json({
            success: true,
            message: numShort > 0 
                ? `Partial check-in recorded for #${bookingId} (${numPresent} Present, ${numShort} Short)`
                : `Full check-in completed for #${bookingId} (${numPresent}/${numPresent} Present)`,
            booking: updatedRecord
        });

    } catch (err) {
        console.error('Error in marshal check-in API:', err);
        return NextResponse.json({ success: false, message: 'Server error processing check-in' }, { status: 500 });
    }
}
