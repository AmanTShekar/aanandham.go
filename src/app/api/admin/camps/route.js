import { NextResponse } from 'next/server';
import { getAdminPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';
import { requestPms, pmsTenantId } from '@/lib/pmsServerBridge';

export async function GET(request) {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(`ratelimit:camps_read:${ip}`, 120, 60);
  if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  try {
    const tenantId = pmsTenantId();
    const result = await requestPms(`/api/properties?tenantId=${encodeURIComponent(tenantId)}`);
    if (result.status !== 200 || !result.payload.success || !Array.isArray(result.payload.properties) || (process.env.NODE_ENV === 'production' && result.payload.source !== 'database')) {
      return NextResponse.json({ success: false, message: 'PMS catalog unavailable' }, { status: 503 });
    }
    // The public website uses PMS property/room IDs without synthesizing inventory or prices.
    return NextResponse.json(result.payload.properties, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, message: 'PMS catalog unavailable' }, { status: 503 });
  }
}

export async function POST(request) {
  const admin = getAdminPayload(request);
  if (!admin) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ success: false, message: 'Catalog editing must be done in PMS; website bulk sync is not supported.' }, { status: 501 });
}
