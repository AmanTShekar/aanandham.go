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

// ── BOUNDED RATE LIMITING (Per-IP and Global Distributed Brute-Force Shield) ──
const MAX_RATE_LIMIT_ENTRIES = 5000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS_PER_IP = 5;
const MAX_GLOBAL_FAILED_ATTEMPTS = 15;
const loginAttempts = new Map();

let globalFailedAttempts = 0;
let globalLockoutUntil = 0;
let globalWindowStart = Date.now();

// Periodic sweep to evict stale rate-limit records and prevent memory growth
function sweepStaleRateLimits() {
    const now = Date.now();
    for (const [ip, record] of loginAttempts.entries()) {
        if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
            loginAttempts.delete(ip);
        }
    }
    if (now - globalWindowStart > RATE_LIMIT_WINDOW_MS) {
        globalFailedAttempts = 0;
        globalWindowStart = now;
    }
}

function isRateLimited(ip) {
    sweepStaleRateLimits();
    const now = Date.now();

    // Check global lockout (stops botnets using rotating IPs)
    if (now < globalLockoutUntil) {
        return true;
    }

    const record = loginAttempts.get(ip);
    if (!record) return false;

    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.delete(ip);
        return false;
    }

    return record.count >= MAX_FAILED_ATTEMPTS_PER_IP;
}

function recordFailedAttempt(ip) {
    if (loginAttempts.size >= MAX_RATE_LIMIT_ENTRIES) {
        sweepStaleRateLimits();
    }
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    record.count += 1;
    loginAttempts.set(ip, record);

    globalFailedAttempts += 1;
    if (globalFailedAttempts >= MAX_GLOBAL_FAILED_ATTEMPTS) {
        globalLockoutUntil = now + (5 * 60 * 1000); // 5-minute global cooldown
        console.warn(`🚨 [AUTH ALERT] Global admin brute-force threshold reached (${globalFailedAttempts} failures). Global lockout active for 5 mins.`);
    }
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
            { success: false, message: 'Too many failed login attempts. Rate limit active. Please wait.' },
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

        if (!isValid) {
            recordFailedAttempt(ip);
            logAuthEvent({ ip, action: 'LOGIN_FAILED_INVALID_PASSCODE', success: false });
            // Artificial delay to mitigate high-speed automated brute-forcing
            await new Promise(r => setTimeout(r, 450 + Math.random() * 150));
            return NextResponse.json({ success: false, message: 'Invalid administrative passcode.' }, { status: 401 });
        }

        // Authentication successful: clear attempt counter for this IP
        clearAttempts(ip);

        // Generate signed, tamper-proof session token (expires in 24 hours)
        const token = createSignedToken({
            role: 'admin_coordinator',
            issuedAt: Date.now()
        }, 24 * 60 * 60);

        logAuthEvent({ ip, action: 'LOGIN_SUCCESS', success: true });

        // Set HttpOnly, Secure, SameSite=Strict cookie (NEVER exposed to client JavaScript)
        const response = NextResponse.json({
            success: true,
            message: 'Administrative session authenticated successfully.'
        });

        response.cookies.set({
            name: 'aanandham_admin_token',
            value: token,
            httpOnly: true,
            secure: IS_PROD,
            sameSite: 'strict',
            path: '/',
            maxAge: 24 * 60 * 60
        });

        return response;

    } catch (err) {
        console.error('Admin authentication error:', err);
        return NextResponse.json({ success: false, message: 'Internal authentication error.' }, { status: 500 });
    }
}

// ── GET: Validate session token strictly from HttpOnly Cookie ──
export async function GET(request) {
    try {
        const cookieToken = request.cookies.get('aanandham_admin_token');
        const token = cookieToken ? cookieToken.value : null;

        if (!token) {
            return NextResponse.json({ authenticated: false, message: 'No authorization cookie provided.' }, { status: 401 });
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
        const cookieToken = request.cookies.get('aanandham_admin_token');
        const token = cookieToken ? cookieToken.value : null;

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