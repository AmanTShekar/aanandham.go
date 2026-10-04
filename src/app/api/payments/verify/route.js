import { NextResponse } from 'next/server';
import { getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';
import { requestPms } from '@/lib/pmsServerBridge';

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(`ratelimit:website_payment_verify:${ip}`, 30, 60);
  if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many verification attempts' }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body?.bookingId || !body?.razorpay_order_id || !body?.razorpay_payment_id || !body?.razorpay_signature) {
    return NextResponse.json({ success: false, message: 'Missing payment details' }, { status: 400 });
  }
  try {
    const result = await requestPms('/api/payments/verify', {
      method: 'POST',
      body: {
        bookingId: body.bookingId,
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
      },
      idempotencyKey: request.headers.get('idempotency-key') || undefined,
      timeoutMs: 15000,
    });
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Payment verification is temporarily unavailable. Do not pay again; contact support with your payment reference.' }, { status: 503 });
  }
}
