import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

const HAS_RAZORPAY = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

/**
 * Create a Razorpay Order
 * @param {object} params
 * @param {number} params.amountInRupees - Amount in INR (will be converted to paise)
 * @param {string} params.receiptId - Booking ID / Receipt identifier
 * @param {object} params.notes - Metadata dictionary
 */
export async function createRazorpayOrder({ amountInRupees, receiptId, notes = {} }) {
    if (!HAS_RAZORPAY) {
        // Fallback for development / demo mode when Razorpay credentials aren't set in env
        return {
            id: `order_dev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            amount: Math.round(amountInRupees * 100),
            currency: 'INR',
            receipt: receiptId,
            status: 'created',
            mock: true
        };
    }

    try {
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(amountInRupees * 100), // Razorpay expects amount in paise
                currency: 'INR',
                receipt: receiptId,
                notes
            })
        });

        if (!res.ok) {
            const errData = await res.text();
            throw new Error(`Razorpay Order creation failed: ${errData}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error creating Razorpay Order:', err);
        throw err;
    }
}

/**
 * Verify Razorpay Webhook Signature (HMAC-SHA256)
 * @param {string} rawBody - Raw unparsed webhook request body string
 * @param {string} signature - Header 'x-razorpay-signature'
 */
export function verifyWebhookSignature(rawBody, signature) {
    if (!RAZORPAY_WEBHOOK_SECRET) {
        console.warn('RAZORPAY_WEBHOOK_SECRET not set, signature verification skipped in dev.');
        return process.env.NODE_ENV !== 'production';
    }

    if (!signature || !rawBody) return false;

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
}

/**
 * Trigger Instant Automated Refund for an expired / race-collision payment
 * @param {string} paymentId - Razorpay Payment ID (e.g. `pay_29QQoUBcxNqk0q`)
 * @param {number} amountInRupees - Amount to refund
 * @param {string} reason - Refund reason notes
 */
export async function triggerAutoRefund(paymentId, amountInRupees, reason = 'Slot expired before payment capture') {
    if (!HAS_RAZORPAY) {
        console.log(`[Dev Mock Refund] Initiated refund for payment ${paymentId} of ₹${amountInRupees}. Reason: ${reason}`);
        return { id: `rfnd_dev_${Date.now()}`, status: 'processed', mock: true };
    }

    try {
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(amountInRupees * 100),
                notes: { reason, autoRefund: true }
            })
        });

        if (!res.ok) {
            const errData = await res.text();
            throw new Error(`Razorpay Refund failed: ${errData}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error issuing Razorpay auto-refund:', err);
        throw err;
    }
}
