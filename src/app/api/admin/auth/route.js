import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Secret key for HMAC token signing (falls back to secure server-generated secret)
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'aanandham_western_ghats_secure_marshal_key_2026';
const VALID_PASSCODES = ['2026', 'aanandham', 'aanandham2026', 'wildadmin'];

// In-memory rate limiting for brute-force protection
const loginAttempts = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record) return false;

    // Reset if window passed (15 mins)
    if (now - record.firstAttempt > 15 * 60 * 1000) {
        loginAttempts.delete(ip);
        return false;
    }

    return record.count >= 5;
}

function recordFailedAttempt(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    record.count += 1;
    loginAttempts.set(ip, record);
}

function clearAttempts(ip) {
    loginAttempts.delete(ip);
}

// Generate signed cryptographic token: payload.signature
function createSignedToken(payload) {
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');
    return `${payloadStr}.${hmac}`;
}

// Verify signed cryptographic token and expiry
function verifySignedToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadStr, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
        if (payload.exp && Date.now() > payload.exp) {
            return null; // Expired
        }
        return payload;
    } catch {
        return null;
    }
}

// POST: Authenticate coordinator passcode & issue signed HMAC token
export async function POST(request) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { success: false, message: 'Too many failed login attempts. Please wait 15 minutes.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const { passcode } = body;

        if (!passcode) {
            return NextResponse.json({ success: false, message: 'Passcode is required.' }, { status: 400 });
        }

        const normalized = passcode.trim().toLowerCase();
        const isValid = VALID_PASSCODES.includes(normalized);

        if (isValid) {
            clearAttempts(ip);
            // 24-hour expiration token
            const token = createSignedToken({
                role: 'admin_coordinator',
                issuedAt: Date.now(),
                exp: Date.now() + 24 * 60 * 60 * 1000
            });
            return NextResponse.json({ success: true, token });
        } else {
            recordFailedAttempt(ip);
            return NextResponse.json({ success: false, message: 'Invalid coordinator access key.' }, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Server error processing authentication.' }, { status: 500 });
    }
}

// GET: Validate existing session token on page reload
export async function GET(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ authenticated: false, message: 'No authorization token provided.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifySignedToken(token);

    if (payload && payload.role === 'admin_coordinator') {
        return NextResponse.json({ authenticated: true, user: { role: 'admin_coordinator', exp: payload.exp } });
    } else {
        return NextResponse.json({ authenticated: false, message: 'Invalid or expired session token.' }, { status: 401 });
    }
}
