import { NextResponse } from 'next/server';
import { verifyWebhookSignature, triggerAutoRefund } from '@/lib/razorpay';
import { getStoredBookings, updateServerBooking } from '@/lib/serverBookingStore';

// In-memory deduplication set as fallback for local dev
const processedEventIds = new Set();

export async function POST(request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        // 1. Verify HMAC Signature
        const isSignatureValid = verifyWebhookSignature(rawBody, signature);
        if (!isSignatureValid) {
            console.error('⚠️ Invalid Razorpay webhook signature received');
            return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
        }

        const payload = JSON.parse(rawBody);
        const eventId = payload.event_id || `${payload.event}_${payload.created_at}`;

        // 2. Idempotency Check (Deduplication)
        if (processedEventIds.has(eventId)) {
            console.log(`ℹ️ Skipping duplicate webhook event ${eventId}`);
            return NextResponse.json({ success: true, message: 'Event already processed' });
        }
        processedEventIds.add(eventId);
        if (processedEventIds.size > 2000) {
            const first = processedEventIds.values().next().value;
            processedEventIds.delete(first);
        }

        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;

        if (event === 'payment.captured' || event === 'order.paid') {
            const bookings = getStoredBookings();
            const booking = bookings.find(b => b.razorpayOrderId === orderId || b.id === paymentEntity?.notes?.receipt);

            if (!booking) {
                console.warn(`Webhook received for unknown booking (order: ${orderId}). Auto-refunding.`);
                if (paymentEntity?.id) {
                    await triggerAutoRefund(paymentEntity.id, (paymentEntity.amount || 0) / 100, 'Unmatched booking order');
                }
                return NextResponse.json({ success: true, message: 'Unmatched booking refunded' });
            }

            const now = Date.now();
            const isHoldExpired = booking.holdExpiresAt && now > booking.holdExpiresAt;

            // 3. Amount & currency verification (bank-grade): the captured amount MUST
            //    exactly equal the server-validated booking total, in INR.
            const paidPaise = Number(paymentEntity?.amount);
            const expectedPaise = Math.round(Number(booking.total) * 100);
            const paidCurrency = String(paymentEntity?.currency || '').toUpperCase();
            const amountMismatch = !paidPaise || paidPaise !== expectedPaise || paidCurrency !== 'INR';

            if (amountMismatch) {
                console.warn(`⚠️ Payment amount mismatch for booking ${booking.id}: paid ₹${paidPaise / 100} ${paidCurrency} vs expected ₹${expectedPaise / 100} INR. Auto-refunding.`);
                await triggerAutoRefund(paymentEntity.id, (paidPaise || 0) / 100, 'Payment amount/currency mismatch');
                updateServerBooking(booking.id, {
                    status: 'Refunded',
                    refundReason: 'Payment amount/currency mismatch',
                    paymentId: paymentEntity.id
                });
                return NextResponse.json({ success: true, message: 'Mismatched payment refunded' });
            }

            // 4. First-Paid-Wins Verification: If slot expired before payment arrived
            if (isHoldExpired && booking.status !== 'Confirmed') {
                console.warn(`Booking ${booking.id} TTL expired before payment capture. Triggering instant refund.`);
                await triggerAutoRefund(paymentEntity.id, (paymentEntity.amount || 0) / 100, '10-minute hold expired');
                updateServerBooking(booking.id, {
                    status: 'Refunded',
                    refundReason: 'Payment captured after 10-minute hold expired',
                    paymentId: paymentEntity.id
                });
                return NextResponse.json({ success: true, message: 'Expired booking refunded' });
            }

            // 5. Confirm Booking
            updateServerBooking(booking.id, {
                status: 'Confirmed',
                paymentId: paymentEntity?.id || `pay_${Date.now()}`,
                paidAt: new Date().toISOString()
            });

            console.log(`✅ Booking ${booking.id} successfully confirmed via Razorpay webhook.`);
            return NextResponse.json({ success: true, message: 'Booking confirmed' });
        }

        return NextResponse.json({ success: true, message: 'Event ignored' });
    } catch (err) {
        console.error('Error handling Razorpay webhook:', err);
        return NextResponse.json({ success: false, message: 'Internal webhook handling error' }, { status: 500 });
    }
}
