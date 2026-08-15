import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { AUTH_SECRET, VALID_PASSCODES, IS_PROD, createSignedToken, verifySignedToken, constantTimeCompare, getClientIp, revokeToken } from '@/lib/authConfig';

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
            revokeToken(token);
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