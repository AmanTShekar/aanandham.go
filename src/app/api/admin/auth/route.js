import { NextResponse } from 'next/server';
import crypto from 'crypto';

// ── CRYPTOGRAPHIC CONFIGURATION & SECRETS ──
// In production, ADMIN_AUTH_SECRET and ADMIN_PASSCODES should be defined in environment variables.
const IS_PROD = process.env.NODE_ENV === 'production';

// Dynamic ephemeral secret fallback if none configured (prevents offline token forgery)
const EPHEMERAL_DEV_SECRET = crypto.randomBytes(32).toString('hex');
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || (IS_PROD ? null : EPHEMERAL_DEV_SECRET);

const ENV_PASSCODES = process.env.ADMIN_PASSCODES
    ? process.env.ADMIN_PASSCODES.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    : [];

// Safe dev fallbacks only active in non-production development environments
const DEV_FALLBACK_PASSCODES = ['aanandham2026', 'wildadmin2026'];
const VALID_PASSCODES = ENV_PASSCODES.length > 0 ? ENV_PASSCODES : (IS_PROD ? [] : DEV_FALLBACK_PASSCODES);

// In-memory revocation blacklist for logged-out tokens
const revokedTokens = new Set();

// In-memory audit trail of recent login events (capped at 50 entries)
const authAuditLog = [];
function logAuthEvent(event) {
    authAuditLog.unshift({
        timestamp: new Date().toISOString(),
        ...event
    });
    if (authAuditLog.length > 50) {
        authAuditLog.pop();
    }
}

// ── BOUNDED RATE LIMITING (Memory Leak Prevention & TTL Sweeper) ──
const MAX_RATE_LIMIT_ENTRIES = 5000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;
const loginAttempts = new Map();

// Periodic sweep to evict stale rate-limit records and prevent memory growth
function sweepStaleRateLimits() {
    const now = Date.now();
    for (const [ip, record] of loginAttempts.entries()) {
        if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
            loginAttempts.delete(ip);
        }
    }
}

function getClientIp(request) {
    // Check direct headers
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();

    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        // Take the first client IP in the chain (safely sanitized)
        const ips = xForwardedFor.split(',').map(ip => ip.trim()).filter(Boolean);
        if (ips.length > 0) return ips[0];
    }

    return '127.0.0.1';
}

function isRateLimited(ip) {
    sweepStaleRateLimits();
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record) return false;

    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.delete(ip);
        return false;
    }

    return record.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip) {
    if (loginAttempts.size >= MAX_RATE_LIMIT_ENTRIES) {
        sweepStaleRateLimits();
    }
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    record.count += 1;
    loginAttempts.set(ip, record);
}

function clearAttempts(ip) {
    loginAttempts.delete(ip);
}

// Constant-time string comparison to prevent timing attacks (C3)
function constantTimeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) {
        // Compare with dummy buffer of same length to mitigate timing differences
        crypto.timingSafeEqual(aBuf, aBuf);
        return false;
    }
    return crypto.timingSafeEqual(aBuf, bBuf);
}

// Generate signed cryptographic HMAC token
function createSignedToken(payload) {
    if (!AUTH_SECRET) throw new Error('AUTH_SECRET is not configured.');
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');
    return `${payloadStr}.${hmac}`;
}

// Verify signed cryptographic token, revocation status, and expiry
function verifySignedToken(token) {
    try {
        if (!token || typeof token !== 'string') return null;
        if (revokedTokens.has(token)) return null; // Token was explicitly revoked on logout
        if (!AUTH_SECRET) return null;

        const parts = token.split('.');
        if (parts.length !== 2) return null;

        const [payloadStr, signature] = parts;
        const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSig);

        if (sigBuf.length !== expBuf.length || sigBuf.length === 0) {
            return null;
        }

        if (!crypto.timingSafeEqual(sigBuf, expBuf)) {
            return null;
        }

        const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
        if (payload.exp && Date.now() > payload.exp) {
            return null; // Expired
        }
        return payload;
    } catch {
        return null;
    }
}

// ── POST: Authenticate coordinator passcode, issue token & set HttpOnly cookie ──
export async function POST(request) {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
        logAuthEvent({ ip, action: 'LOGIN_BLOCKED_RATE_LIMIT', success: false });
        return NextResponse.json(
            { success: false, message: 'Too many failed login attempts. Rate limit active. Please wait 15 minutes.' },
            { status: 429 }
        );
    }

    if (IS_PROD && (!AUTH_SECRET || VALID_PASSCODES.length === 0)) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error: ADMIN_PASSCODES / ADMIN_AUTH_SECRET environment variables must be configured in production.' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { passcode } = body;

        if (!passcode) {
            return NextResponse.json({ success: false, message: 'Passcode is required.' }, { status: 400 });
        }

        const normalized = passcode.trim().toLowerCase();
        
        // Use constant-time comparison across all valid passcodes
        let isValid = false;
        for (const validCode of VALID_PASSCODES) {
            if (constantTimeCompare(normalized, validCode)) {
                isValid = true;
                break;
            }
        }

        if (isValid) {
            clearAttempts(ip);
            
            // Issue 24-hour expiration token with unique session ID
            const sessionId = crypto.randomBytes(16).toString('hex');
            const token = createSignedToken({
                role: 'admin_coordinator',
                sessionId,
                issuedAt: Date.now(),
                exp: Date.now() + 24 * 60 * 60 * 1000
            });

            logAuthEvent({ ip, action: 'LOGIN_SUCCESS', success: true });

            // Return response and attach secure HttpOnly cookie
            const response = NextResponse.json({ success: true, token, message: 'Authentication successful.' });
            response.cookies.set({
                name: 'aanandham_admin_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 24 * 60 * 60 // 24 hours
            });

            return response;
        } else {
            recordFailedAttempt(ip);
            logAuthEvent({ ip, action: 'LOGIN_FAILED', success: false });
            return NextResponse.json({ success: false, message: 'Invalid coordinator access key.' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ success: false, message: 'Server error processing authentication.' }, { status: 500 });
    }
}

// ── GET: Validate session token from Cookie or Authorization header ──
export async function GET(request) {
    try {
        // Check for token from Authorization header or HttpOnly Cookie
        const authHeader = request.headers.get('authorization');
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            const cookieToken = request.cookies.get('aanandham_admin_token');
            if (cookieToken) token = cookieToken.value;
        }

        if (!token) {
            return NextResponse.json({ authenticated: false, message: 'No authorization token provided.' }, { status: 401 });
        }

        const payload = verifySignedToken(token);

        if (payload && payload.role === 'admin_coordinator') {
            const url = new URL(request.url);
            // If requested audit logs
            if (url.searchParams.get('audit') === 'true') {
                return NextResponse.json({
                    authenticated: true,
                    user: { role: 'admin_coordinator', exp: payload.exp },
                    auditLogs: authAuditLog
                });
            }

            return NextResponse.json({
                authenticated: true,
                user: { role: 'admin_coordinator', exp: payload.exp }
            });
        } else {
            return NextResponse.json({ authenticated: false, message: 'Invalid or expired session token.' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ authenticated: false, message: 'Error validating session token.' }, { status: 401 });
    }
}

// ── DELETE: Revoke session token and clear HttpOnly cookie ──
export async function DELETE(request) {
    try {
        const authHeader = request.headers.get('authorization');
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            const cookieToken = request.cookies.get('aanandham_admin_token');
            if (cookieToken) token = cookieToken.value;
        }

        if (token) {
            revokedTokens.add(token);
            // Cap revocation set size to avoid memory unbounded growth
            if (revokedTokens.size > 2000) {
                const firstVal = revokedTokens.values().next().value;
                revokedTokens.delete(firstVal);
            }
        }

        const ip = getClientIp(request);
        logAuthEvent({ ip, action: 'LOGOUT', success: true });

        const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
        response.cookies.set({
            name: 'aanandham_admin_token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 0 // Expire immediately
        });

        return response;
    } catch {
        return NextResponse.json({ success: false, message: 'Error processing logout.' }, { status: 500 });
    }
}
