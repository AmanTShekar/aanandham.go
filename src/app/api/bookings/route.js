import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getAdminPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit, isIpBlocked } from '@/lib/redis';
import { checkSecurityGate } from '@/lib/securityTracker';
import { requestPms, pmsTenantId } from '@/lib/pmsServerBridge';

const unavailable = () => NextResponse.json({ success: false, message: 'Reservations are temporarily unavailable. Please try again or contact the property.' }, { status: 503 });

export async function GET(request) {
  const admin = getAdminPayload(request);
  if (!admin) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const key = process.env.PMS_SECRET_API_KEY;
  if (!key) return unavailable();
  try {
    const query = new URL(request.url).search;
    const result = await requestPms(`/api/bookings${query}`, { apiKey: key });
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return unavailable();
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (Number(request.headers.get('content-length') || 0) > 65536) {
    return NextResponse.json({ success: false, message: 'Payload too large' }, { status: 413 });
  }
  if (await isIpBlocked(ip)) return NextResponse.json({ success: false, message: 'Access restricted' }, { status: 403 });
  const gate = checkSecurityGate(request, String(request.headers.get('x-device-fingerprint') || '').slice(0, 400));
  if (!gate.allowed) return NextResponse.json({ success: false, message: gate.reason || 'Access restricted' }, { status: gate.status || 403 });
  const limit = await checkRateLimit(`ratelimit:website_bookings:${ip}`, 10, 60);
  if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many booking attempts' }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ success: false, message: 'Invalid booking request' }, { status: 400 });
  }
  const idempotencyKey = request.headers.get('idempotency-key') || randomUUID();
  try {
    // Public creation never forwards a shared token or client-claimed payment state.
    const { status: _status, paidAmount: _paidAmount, paymentStatus: _paymentStatus, paymentReference: _paymentReference, id: _id, tenantId: _tenantId, ...safeBody } = body;
    const result = await requestPms('/api/bookings', { method: 'POST', body: { ...safeBody, tenantId: pmsTenantId() }, idempotencyKey, timeoutMs: 15000 });
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return unavailable();
  }
}
