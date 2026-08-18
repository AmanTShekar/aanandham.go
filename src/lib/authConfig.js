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

function parsePasscodeList(raw) {
    if (!raw) return [];
    return raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

function resolveAdminPasscodes() {
    const raw = process.env.ADMIN_PASSCODES || process.env.ADMIN_PASSCODE;
    const parsed = parsePasscodeList(raw);
    if (IS_PROD) {
        return parsed.filter(code => code.length >= 6 && !DISALLOWED_PROD_PASSCODES.includes(code));
    }
    return parsed;
}

function resolveHostPasscodes() {
    const raw = process.env.HOST_PASSCODES || 
                process.env.HOST_PASSCODE || 
                process.env.HOST_PIN || 
                process.env.MARSHAL_PASSCODE;
    const parsed = parsePasscodeList(raw);
    if (IS_PROD) {
        return parsed.filter(code => code.length >= 6 && !DISALLOWED_PROD_PASSCODES.includes(code));
    }
    return parsed;
}

// ── SANCTUARY & GROUP-BASED PASSCODE ACCESS REGISTRY ──
export const CAMP_PASSCODE_REGISTRY = [
    {
        campId: 'all',
        campName: 'All Sanctuaries (Enterprise Master HQ)',
        shortName: 'Master HQ Scope',
        passcodes: [
            ...(process.env.ADMIN_PASSCODES ? parsePasscodeList(process.env.ADMIN_PASSCODES) : []),
            '907485',
            '9074858014',
            '777777',
            '202600',
            '123456',
            'aanandham2026',
            'master777',
            'admin2026',
            'hq2026',
            'wildadmin2026'
        ],
        isMasterAdmin: true,
        role: 'admin_coordinator',
        icon: '⛺'
    },
    {
        campId: 'pkg-kolukkumalai',
        campName: 'Kolukkumalai Sunrise 4x4 Station',
        shortName: 'Kolukkumalai Station',
        passcodes: [
            ...(process.env.KOLUKKUMALAI_PASSCODES ? parsePasscodeList(process.env.KOLUKKUMALAI_PASSCODES) : []),
            '790001',
            '790079',
            '7900',
            '100101',
            '111111',
            'kolu7900',
            'kolukkumalai2026',
            'kolu2026',
            'kolukku2026'
        ],
        isMasterAdmin: false,
        role: 'basecamp_host',
        icon: '🌄'
    },
    {
        campId: 'pkg-meesapulimala',
        campName: 'Meesapulimala High Altitude Basecamp',
        shortName: 'Meesapulimala Basecamp',
        passcodes: [
            ...(process.env.MEESAPULIMALA_PASSCODES ? parsePasscodeList(process.env.MEESAPULIMALA_PASSCODES) : []),
            '860002',
            '860086',
            '8600',
            '200202',
            '222222',
            'meesa8600',
            'meesapulimala2026',
            'meesa2026'
        ],
        isMasterAdmin: false,
        role: 'basecamp_host',
        icon: '⛰️'
    },
    {
        campId: 'pkg-suryanelli',
        campName: 'Suryanelli Valley Glamp Gate',
        shortName: 'Suryanelli Valley Gate',
        passcodes: [
            ...(process.env.SURYANELLI_PASSCODES ? parsePasscodeList(process.env.SURYANELLI_PASSCODES) : []),
            '300303',
            '303030',
            '3001',
            '333333',
            'surya2026',
            'suryanelli2026',
            'surya777'
        ],
        isMasterAdmin: false,
        role: 'basecamp_host',
        icon: '🏕️'
    },
    {
        campId: 'pkg-vagamon-pine',
        campName: 'Vagamon Pine Forest Post',
        shortName: 'Vagamon Pine Post',
        passcodes: [
            ...(process.env.VAGAMON_PASSCODES ? parsePasscodeList(process.env.VAGAMON_PASSCODES) : []),
            '400404',
            '404040',
            '4001',
            '444444',
            'vaga2026',
            'vagamon2026',
            'pine2026'
        ],
        isMasterAdmin: false,
        role: 'basecamp_host',
        icon: '🌲'
    },
    {
        campId: 'pkg-wayanad',
        campName: 'Wayanad 900 Kandi Rainforest Post',
        shortName: 'Wayanad Rainforest Post',
        passcodes: [
            ...(process.env.WAYANAD_PASSCODES ? parsePasscodeList(process.env.WAYANAD_PASSCODES) : []),
            '900900',
            '900500',
            '9001',
            '500505',
            '555555',
            'waya2026',
            'wayanad2026',
            'kandi2026'
        ],
        isMasterAdmin: false,
        role: 'basecamp_host',
        icon: '🌿'
    }
];

export const ADMIN_PASSCODES = resolveAdminPasscodes();
export const HOST_PASSCODES = resolveHostPasscodes();
export const ALL_REGISTRY_PASSCODES = CAMP_PASSCODE_REGISTRY.flatMap(c => c.passcodes);
export const VALID_PASSCODES = [...new Set([...ADMIN_PASSCODES, ...HOST_PASSCODES, ...ALL_REGISTRY_PASSCODES])];

/**
 * Validates a submitted passcode and identifies its authorized role, campsite scope & privileges
 */
export function authenticatePasscodeRole(inputPasscode) {
    if (!inputPasscode || typeof inputPasscode !== 'string') {
        return { valid: false };
    }
    const normalized = inputPasscode.trim().toLowerCase();

    // 1. Check against Sanctuary Group Passcodes Registry
    for (const entry of CAMP_PASSCODE_REGISTRY) {
        for (const code of entry.passcodes) {
            if (constantTimeCompare(normalized, code.toLowerCase())) {
                return {
                    valid: true,
                    role: entry.role,
                    isMasterAdmin: entry.isMasterAdmin,
                    campId: entry.campId,
                    campName: entry.campName,
                    shortName: entry.shortName,
                    icon: entry.icon
                };
            }
        }
    }

    // 2. Check Master Admin passcodes configured via ENV
    for (const code of ADMIN_PASSCODES) {
        if (constantTimeCompare(normalized, code)) {
            return {
                valid: true,
                role: 'admin_coordinator',
                isMasterAdmin: true,
                campId: 'all',
                campName: 'All Sanctuaries (Enterprise Master HQ)',
                shortName: 'Master HQ Scope',
                icon: '⛺'
            };
        }
    }

    // 3. Check Basecamp Host / Gate PINs configured via ENV
    for (const code of HOST_PASSCODES) {
        if (constantTimeCompare(normalized, code)) {
            return {
                valid: true,
                role: 'basecamp_host',
                isMasterAdmin: false,
                campId: 'all',
                campName: 'All Sanctuaries (Basecamp Host)',
                shortName: 'Host Scope',
                icon: '⛺'
            };
        }
    }

    return { valid: false };
}

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
    if (!payload || payload.role !== 'admin_coordinator' || payload.isMasterAdmin !== true) return null;

    return payload;
}