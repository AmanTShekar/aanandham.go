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

        if (bookingIndex === -1) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        const existing = bookings[bookingIndex];
        const numPresent = Number(checkedInCount) || 0;
        const numShort = Number(shortCount) || 0;

        const newStatus = numShort > 0 ? 'Partial Check-In' : 'Checked In';

        const updatedRecord = {
            ...existing,
            status: newStatus,
            checkedInCount: numPresent,
            shortCount: numShort,
            attendanceRoster: Array.isArray(roster) ? roster : [],
            isBalancePaid: Boolean(isBalancePaid),
            balanceDue: isBalancePaid ? 0 : (existing.balanceDue || 0),
            paymentMode: isBalancePaid ? (paymentMode || existing.paymentMode || 'Cash / UPI at Gate') : existing.paymentMode,
            settlementMethod: isBalancePaid ? settlementMethod : (existing.settlementMethod || null),
            balanceCollected: isBalancePaid ? (Number(balanceCollected) || existing.balanceDue || 0) : 0,
            assignedTent: String(assignedTent || existing.assignedTent || '').slice(0, 100),
            wristbandRange: String(wristbandRange || existing.wristbandRange || '').slice(0, 100),
            checkInAt: existing.checkInAt || new Date().toISOString(),
            marshalName: String(marshalName).slice(0, 80),
            marshalNotes: String(marshalNotes || '').slice(0, 500),
            lastUpdated: new Date().toISOString()
        };

        bookings[bookingIndex] = updatedRecord;
        await saveStoredBookings(bookings);

        // Try updating Supabase database in background
        try {
            await updateServerBooking(bookingId, {
                status: newStatus,
                paymentMode: updatedRecord.paymentMode,
                notes: `[Checked-In by ${marshalName} on ${new Date().toLocaleTimeString('en-IN')}: ${numPresent} Present, ${numShort} Short. Balance Paid: ${isBalancePaid ? `YES (${paymentMode || 'Settled'})` : 'NO'}] ${marshalNotes || ''}`
            });
        } catch (e) {
            console.warn('Supabase sync skipped, stored locally:', e.message);
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
