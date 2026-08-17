// ── CENTRALIZED CRYPTOGRAPHIC CONFIGURATION & AUTH VERIFICATION ──
// Single source of truth for admin token signing/verification, IP resolution
// and admin request gating. Used by every protected API route.
import crypto from 'crypto';

export const IS_PROD = process.env.NODE_ENV === 'production';

// Dynamic ephemeral secret fallback in development if none configured (prevents offline token forgery)
const EPHEMERAL_DEV_SECRET = crypto.randomBytes(32).toString('hex');

const DISALLOWED_PROD_SECRETS = [
    'aanandham_high_entropy_secure_auth_secret_2026_munnar_kerala_wild',
    'your_custom_random_32_char_hex_secret_key_here',
    'aanandham2026',
    'secret',
    'changeme'
];

const DISALLOWED_PROD_PASSCODES = [
    'aanandham2026',
    'wildadmin2026',
    'admin',
    'password',
    '12345678',
    'your_secure_random_admin_passcode_min_16_chars'
];

function resolveAuthSecret() {
    const configured = process.env.ADMIN_AUTH_SECRET;
    if (IS_PROD) {
        if (!configured || configured.length < 32 || DISALLOWED_PROD_SECRETS.includes(configured.toLowerCase())) {
            console.error('🚨 [SECURITY WARNING] ADMIN_AUTH_SECRET in production is missing, too short (<32 chars), or matches a known public default. Admin login is disabled until a secure secret is configured in environment.');
            return null;
        }
        return configured;
    }
    return configured || EPHEMERAL_DEV_SECRET;
}

export const AUTH_SECRET = resolveAuthSecret();

function resolvePasscodes() {
    const raw = process.env.ADMIN_PASSCODES || process.env.ADMIN_PASSCODE;
    const parsed = raw ? raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];

    if (IS_PROD) {
        const safeCodes = parsed.filter(code => code.length >= 12 && !DISALLOWED_PROD_PASSCODES.includes(code));
        if (safeCodes.length === 0) {
            console.error('🚨 [SECURITY WARNING] ADMIN_PASSCODE in production is missing or uses a disallowed default. Admin login is disabled.');
        }
        return safeCodes;
    }

    if (parsed.length === 0) {
        console.warn('⚠️ [DEV WARNING] No ADMIN_PASSCODE is set in .env.local. Configure ADMIN_PASSCODE to log into /admin.');
    }
    return parsed;
}

export const VALID_PASSCODES = resolvePasscodes();

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

// Verify an incoming request carries a valid admin session (Strictly via HttpOnly cookie)
export function getAdminPayload(request) {
    const cookieToken = request.cookies.get('aanandham_admin_token');
    const token = cookieToken ? cookieToken.value : null;

    if (!token) return null;

    const payload = verifySignedToken(token);
    if (!payload || payload.role !== 'admin_coordinator') return null;

    return payload;
}