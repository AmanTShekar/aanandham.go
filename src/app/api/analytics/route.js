import { NextResponse } from 'next/server';
import { requestPms, pmsTenantId } from '@/lib/pmsServerBridge';

const allowedEvents = new Set(['pageview', 'unique_visit', 'detail_view', 'booking_start', 'date_picker', 'checkout_init', 'checkout_started']);

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || !allowedEvents.has(body.eventType || 'pageview')) {
    return NextResponse.json({ success: false, message: 'Invalid analytics event' }, { status: 400 });
  }
  try {
    const result = await requestPms('/api/analytics', {
      method: 'POST',
      body: { ...body, tenantId: pmsTenantId() },
      timeoutMs: 5000,
    });
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Analytics unavailable' }, { status: 503 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Analytics are available in the PMS admin API' }, { status: 405 });
}
