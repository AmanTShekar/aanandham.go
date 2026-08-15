import { NextResponse } from 'next/server';
import { getStoredBookings, addServerBooking, updateServerBooking, deleteServerBooking } from '@/lib/serverBookingStore';
import { cleanPhone } from '@/lib/whatsapp';

// Unique, collision-free human readable booking ID generator (N6 fix)
export function generateBookingId() {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const entropyPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestampPart}-${entropyPart}`;
}

export async function GET(request) {
    try {
        const bookings = getStoredBookings();
        return NextResponse.json({ success: true, bookings });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return NextResponse.json({ success: false, message: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // 🛡️ BOT & HONEYPOT TRAP (B5 / N7)
        if (body.honeypot && String(body.honeypot).trim().length > 0) {
            return NextResponse.json({ success: true, message: 'Inquiry received' });
        }

        const name = (body.name || '').trim();
        const rawPhone = (body.phone || '').trim();
        const cleanedPhone = cleanPhone(rawPhone);

        // Validation (N7)
        if (!name || name.length < 2) {
            return NextResponse.json({ success: false, message: 'Please provide a valid full name.' }, { status: 400 });
        }
        if (!cleanedPhone || cleanedPhone.length < 10) {
            return NextResponse.json({ success: false, message: 'Please provide a valid 10-digit mobile or WhatsApp number.' }, { status: 400 });
        }

        const newRecord = {
            id: generateBookingId(),
            name: name,
            phone: rawPhone,
            package: body.package || 'Kerala Wilderness Sanctuary',
            region: body.region || 'Munnar',
            dates: body.dates || 'Flexible / Upcoming Weekend',
            guests: Number(body.guests) || 2,
            roomType: body.roomType || 'Standard Glamping',
            addons: Array.isArray(body.addons) ? body.addons : [],
            total: Number(body.total) || 2499,
            status: body.status || 'Pending',
            source: body.source || 'Website Booking Engine',
            notes: body.notes ? String(body.notes).trim() : '',
            createdAt: new Date().toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };

        const updatedList = addServerBooking(newRecord);
        return NextResponse.json({ success: true, booking: newRecord, totalCount: updatedList.length });
    } catch (err) {
        console.error('Error creating booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while recording booking' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
        }

        const updatedList = updateServerBooking(id, updates);
        return NextResponse.json({ success: true, bookings: updatedList });
    } catch (err) {
        console.error('Error updating booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while updating booking' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing booking ID' }, { status: 400 });
        }

        const updatedList = deleteServerBooking(id);
        return NextResponse.json({ success: true, bookings: updatedList });
    } catch (err) {
        console.error('Error deleting booking:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while deleting booking' }, { status: 500 });
    }
}
