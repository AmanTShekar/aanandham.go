import { NextResponse } from 'next/server';
import { getAdminPayload, getMarshalPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeBookingsForRole } from '@/lib/rbac';
import { requestPms } from '@/lib/pmsServerBridge';

export async function GET(request) {
  const actor = getAdminPayload(request) || getMarshalPayload(request);
  if (!actor) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const limit = await checkRateLimit(`ratelimit:admin_bookings_get:${getClientIp(request)}`, 60, 60);
  if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  const key = process.env.PMS_SECRET_API_KEY;
  if (!key) return NextResponse.json({ success: false, message: 'PMS bookings connection is not configured' }, { status: 503 });
  try {
    const result = await requestPms(`/api/bookings${new URL(request.url).search}`, { apiKey: key });
    if (result.status !== 200 || !result.payload.success) return NextResponse.json(result.payload, { status: result.status });
    const scoped = actor.isMasterAdmin || !actor.campId || actor.campId === 'all'
      ? result.payload.bookings
      : result.payload.bookings.filter((booking) => booking.campsiteId === actor.campId);
    return NextResponse.json({ success: true, bookings: sanitizeBookingsForRole(scoped, actor.role || 'owner') });
  } catch {
    return NextResponse.json({ success: false, message: 'PMS bookings unavailable' }, { status: 503 });
  }
}

function unsupported(request) {
  if (!getAdminPayload(request) && !getMarshalPayload(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: false, message: 'Change reservations in PMS; the website no longer maintains a separate booking ledger.' }, { status: 501 });
}

export const POST = unsupported;
export const PATCH = unsupported;
export const DELETE = unsupported;
