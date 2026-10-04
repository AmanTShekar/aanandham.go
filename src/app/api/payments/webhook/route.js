import { NextResponse } from 'next/server';
import { pmsServerUrl } from '@/lib/pmsServerBridge';

// Legacy webhook URL: forward the exact signed bytes to the PMS authority.
// New Razorpay configurations should point directly at PMS /api/payments/webhook.
export async function POST(request) {
  const rawBody = await request.text();
  if (rawBody.length > 262144) return NextResponse.json({ success: false, message: 'Webhook too large' }, { status: 413 });
  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) return NextResponse.json({ success: false, message: 'Missing signature' }, { status: 400 });
  try {
    const response = await fetch(`${pmsServerUrl()}/api/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Razorpay-Signature': signature },
      body: rawBody,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => ({ success: false, message: 'Invalid PMS webhook response' }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    // Provider retry is essential: never acknowledge a webhook PMS has not processed.
    return NextResponse.json({ success: false, message: 'PMS webhook unavailable' }, { status: 503 });
  }
}
