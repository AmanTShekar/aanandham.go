import crypto from 'crypto';

// Upstash Redis REST Config
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const HAS_UPSTASH = Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);

/**
 * Execute raw command against Upstash Redis via native REST API
 */
async function upstashCommand(command, ...args) {
    if (!HAS_UPSTASH) return null;
    try {
        const url = `${UPSTASH_REDIS_REST_URL.replace(/\/$/, '')}/${command}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
            },
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error(`Upstash command failed [${command}]:`, await res.text());
            return null;
        }
        const data = await res.json();
        return data.result;
    } catch (err) {
        console.error('Error executing Upstash command:', err);
        return null;
    }
}

// ── LOCAL IN-MEMORY FALLBACK (Dev / Single-Instance fallback) ──
const memoryRateLimits = new Map();
const memoryRevokedTokens = new Map();
const memoryBlockedIps = new Map();
const memoryAuditLogs = [];
const memoryWaitlists = new Map();

// ── 1. DISTRIBUTED SLIDING-WINDOW RATE LIMITER ──
/**
 * Sliding window rate limiter
 * @param {string} key - Rate limit key (e.g. `ratelimit:auth:192.168.1.1` or `ratelimit:bookings:192.168.1.1`)
 * @param {number} maxRequests - Maximum requests allowed in the window
 * @param {number} windowSeconds - Sliding window duration in seconds
 * @returns {Promise<{ allowed: boolean, remaining: number, resetSeconds: number }>}
 */
export async function checkRateLimit(key, maxRequests = 10, windowSeconds = 60) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    if (HAS_UPSTASH) {
        try {
            const member = `${now}:${crypto.randomBytes(4).toString('hex')}`;
            const clearBefore = now - windowMs;

            // Pipeline via Upstash: ZREMRANGEBYSCORE, ZADD, ZCARD, EXPIRE
            await upstashCommand('zremrangebyscore', key, 0, clearBefore);
            await upstashCommand('zadd', key, now, member);
            const count = await upstashCommand('zcard', key);
            await upstashCommand('expire', key, windowSeconds);

            const requestCount = Number(count) || 1;
            const allowed = requestCount <= maxRequests;
            return {
                allowed,
                remaining: Math.max(0, maxRequests - requestCount),
                resetSeconds: windowSeconds
            };
        } catch (err) {
            console.error('Upstash rate limiter error, falling back to local:', err);
        }
    }

    // Local In-Memory Sliding Window Fallback
    const timestamps = memoryRateLimits.get(key) || [];
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    validTimestamps.push(now);
    memoryRateLimits.set(key, validTimestamps);

    const allowed = validTimestamps.length <= maxRequests;
    return {
        allowed,
        remaining: Math.max(0, maxRequests - validTimestamps.length),
        resetSeconds: windowSeconds
    };
}

// ── 2. DISTRIBUTED IP BLOCKLIST ──
export async function isIpBlocked(ip) {
    if (!ip) return false;
    const key = `blocked_ip:${ip}`;

    if (HAS_UPSTASH) {
        const val = await upstashCommand('get', key);
        return val !== null;
    }

    const exp = memoryBlockedIps.get(ip);
    if (!exp) return false;
    if (Date.now() > exp) {
        memoryBlockedIps.delete(ip);
        return false;
    }
    return true;
}

export async function blockIp(ip, reason = 'Automated DoS / Brute-force trigger', durationSeconds = 86400) {
    if (!ip) return;
    const key = `blocked_ip:${ip}`;

    if (HAS_UPSTASH) {
        await upstashCommand('setex', key, durationSeconds, JSON.stringify({ reason, timestamp: Date.now() }));
        return;
    }

    memoryBlockedIps.set(ip, Date.now() + durationSeconds * 1000);
}

// ── 3. TOKEN REVOCATION & BLACKLIST ──
export async function revokeToken(token, ttlSeconds = 86400) {
    if (!token) return;
    const key = `revoked_token:${crypto.createHash('sha256').update(token).digest('hex')}`;

    if (HAS_UPSTASH) {
        await upstashCommand('setex', key, ttlSeconds, '1');
        return;
    }

    memoryRevokedTokens.set(key, Date.now() + ttlSeconds * 1000);
}

export async function isTokenRevoked(token) {
    if (!token) return false;
    const key = `revoked_token:${crypto.createHash('sha256').update(token).digest('hex')}`;

    if (HAS_UPSTASH) {
        const res = await upstashCommand('get', key);
        return res !== null;
    }

    const exp = memoryRevokedTokens.get(key);
    if (!exp) return false;
    if (Date.now() > exp) {
        memoryRevokedTokens.delete(key);
        return false;
    }
    return true;
}

// ── 4. CENTRALIZED AUDIT LOGS ──
export async function pushAuditLog(event) {
    const entry = {
        timestamp: new Date().toISOString(),
        ...event
    };

    if (HAS_UPSTASH) {
        try {
            await upstashCommand('lpush', 'admin:audit_logs', JSON.stringify(entry));
            await upstashCommand('ltrim', 'admin:audit_logs', 0, 99); // Keep latest 100 entries
            return;
        } catch (err) {
            console.error('Error logging to Upstash audit stream:', err);
        }
    }

    memoryAuditLogs.unshift(entry);
    if (memoryAuditLogs.length > 100) memoryAuditLogs.pop();
}

export async function getRecentAuditLogs() {
    if (HAS_UPSTASH) {
        try {
            const rawLogs = await upstashCommand('lrange', 'admin:audit_logs', 0, 50);
            if (Array.isArray(rawLogs)) {
                return rawLogs.map(r => {
                    try { return JSON.parse(r); } catch { return r; }
                });
            }
        } catch (err) {
            console.error('Error fetching Upstash audit logs:', err);
        }
    }
    return [...memoryAuditLogs];
}

// ── 5. FIFO WAITLIST QUEUE (Redis Sorted Sets) ──
export async function addToWaitlist(slotKey, bookingId, guestInfo) {
    const key = `waitlist:${slotKey}`;
    const score = Date.now();
    const payload = JSON.stringify({ bookingId, guestInfo, queuedAt: score });

    if (HAS_UPSTASH) {
        await upstashCommand('zadd', key, score, payload);
        const rank = await upstashCommand('zrank', key, payload);
        return (Number(rank) || 0) + 1;
    }

    const list = memoryWaitlists.get(key) || [];
    list.push({ bookingId, guestInfo, queuedAt: score });
    memoryWaitlists.set(key, list);
    return list.length;
}

export async function getWaitlistPosition(slotKey, bookingId) {
    const key = `waitlist:${slotKey}`;
    if (HAS_UPSTASH) {
        const items = await upstashCommand('zrange', key, 0, -1);
        if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                try {
                    const parsed = JSON.parse(items[i]);
                    if (parsed.bookingId === bookingId) return i + 1;
                } catch {}
            }
        }
        return null;
    }

    const list = memoryWaitlists.get(key) || [];
    const idx = list.findIndex(item => item.bookingId === bookingId);
    return idx === -1 ? null : idx + 1;
}

// ── 6. DISTRIBUTED WEBHOOK IDEMPOTENCY (7-Day TTL) ──
const memoryProcessedWebhooks = new Map();

export async function isWebhookProcessed(eventId) {
    if (!eventId) return false;
    const key = `webhook:processed:${eventId}`;

    if (HAS_UPSTASH) {
        try {
            const res = await upstashCommand('get', key);
            if (res !== null && res !== undefined) return true;
        } catch (e) {
            console.error('Error checking webhook dedupe in Redis:', e);
        }
    }

    const now = Date.now();
    const expiry = memoryProcessedWebhooks.get(key);
    if (expiry && now < expiry) {
        return true;
    }
    if (expiry) {
        memoryProcessedWebhooks.delete(key);
    }
    return false;
}

export async function markWebhookProcessed(eventId, ttlSeconds = 604800) {
    if (!eventId) return false;
    const key = `webhook:processed:${eventId}`;
    const value = String(Date.now());

    if (HAS_UPSTASH) {
        try {
            await upstashCommand('setex', key, ttlSeconds, value);
            return true;
        } catch (e) {
            console.error('Error marking webhook processed in Redis:', e);
        }
    }

    if (memoryProcessedWebhooks.size > 5000) {
        const firstKey = memoryProcessedWebhooks.keys().next().value;
        memoryProcessedWebhooks.delete(firstKey);
    }
    memoryProcessedWebhooks.set(key, Date.now() + ttlSeconds * 1000);
    return true;
}
