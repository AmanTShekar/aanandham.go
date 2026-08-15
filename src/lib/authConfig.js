// ── CENTRALIZED CRYPTOGRAPHIC CONFIGURATION & AUTH VERIFICATION ──
// Single source of truth for admin token signing/verification, IP resolution
// and admin request gating. Used by every protected API route.
import crypto from 'crypto';

export const IS_PROD = process.env.NODE_ENV === 'production';

// Dynamic ephemeral secret fallback if none configured (prevents offline token forgery)
const EPHEMERAL_DEV_SECRET = crypto.randomBytes(32).toString('hex');
export const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || (IS_PROD ? null : EPHEMERAL_DEV_SECRET);

const ENV_PASSCODES = process.env.ADMIN_PASSCODES
    ? process.env.ADMIN_PASSCODES.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    : [];

// Safe dev fallbacks only active in non-production development environments
const DEV_FALLBACK_PASSCODES = ['aanandham2026', 'wildadmin2026'];
export const VALID_PASSCODES = ENV_PASSCODES.length > 0 ? ENV_PASSCODES : (IS_PROD ? [] : DEV_FALLBACK_PASSCODES);

// In-memory revocation blacklist for logged-out tokens (bounded, 2000 entries)
const revokedTokens = new Set();

export function revokeToken(token) {
    if (!token) return;
    revokedTokens.add(token);
    if (revokedTokens.size > 2000) {
        const firstVal = revokedTokens.values().next().value;
        revokedTokens.delete(firstVal);
    }
}

// Constant-time string comparison to prevent timing attacks
export function constantTimeCompare(a, b) {
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
export function createSignedToken(payload) {
    if (!AUTH_SECRET) throw new Error('AUTH_SECRET is not configured.');
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');
    return `${payloadStr}.${hmac}`;
}

// Verify signed cryptographic token, revocation status, and expiry (crash-safe)
export function verifySignedToken(token) {
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

// Trusted proxy gate: spoofable headers are only honored when explicitly enabled
function isTrustedProxy() {
    return process.env.TRUST_PROXY === 'true';
}

// Resolve the real client IP safely (Vercel request.ip is always authoritative)
export function getClientIp(request) {
    if (request.ip) return request.ip.trim();

    // Only trust forwarding headers when running behind a known proxy (Cloudflare/Vercel edge)
    if (isTrustedProxy()) {
        const cfIp = request.headers.get('cf-connecting-ip');
        if (cfIp) return cfIp.trim();
        const xRealIp = request.headers.get('x-real-ip');
        if (xRealIp) return xRealIp.trim();
        const xff = request.headers.get('x-forwarded-for');
        if (xff) return xff.split(',')[0].trim();
    }

    return 'unknown';
}

// Verify an incoming request carries a valid admin session (Bearer header or HttpOnly cookie)
export function getAdminPayload(request) {
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        const cookieToken = request.cookies.get('aanandham_admin_token');
        if (cookieToken) token = cookieToken.value;
    }

    if (!token) return null;

    const payload = verifySignedToken(token);
    if (!payload || payload.role !== 'admin_coordinator') return null;

    return payload;
}