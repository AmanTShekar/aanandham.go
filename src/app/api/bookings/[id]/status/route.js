import { NextResponse } from 'next/server';
import { getAdminPayload } from '@/lib/authConfig';
import { requestPms } from '@/lib/pmsServerBridge';

export async function GET(request, { params }) {
  if (!getAdminPayload(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 64) return NextResponse.json({ success: false, message: 'Invalid booking ID' }, { status: 400 });
  if (!process.env.PMS_SECRET_API_KEY) return NextResponse.json({ success: false, message: 'PMS connection unavailable' }, { status: 503 });
  try {
    const result = await requestPms(`/api/bookings?search=${encodeURIComponent(id)}&limit=20`, { apiKey: process.env.PMS_SECRET_API_KEY });
    if (result.status !== 200 || !result.payload.success) return NextResponse.json(result.payload, { status: result.status });
    const booking = result.payload.bookings.find((item) => item.id === id);
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    return NextResponse.json({ success: true, booking: { id: booking.id, status: booking.status, total: booking.total } });
  } catch {
    return NextResponse.json({ success: false, message: 'PMS connection unavailable' }, { status: 503 });
  }
}
