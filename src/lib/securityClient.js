// Client-side device fingerprint helper (security ops layer).
// Produces an irreversible hash of browser signals for abuse tracking.
// No raw personal data is ever sent — only the hash.

let cachedFingerprint = null;
let fingerprintPromise = null;

function stableStringify(value) {
    try { return JSON.stringify(value); } catch (e) { return String(value); }
}

async function hashString(input) {
    try {
        if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
            const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
            return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 48);
        }
    } catch (e) { /* fall through */ }
    // Non-crypto fallback: FNV-1a 64-bit style hash (collision-prone but never leaves the device as a raw string)
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193;
    for (let i = 0; i < input.length; i++) {
        h1 ^= input.charCodeAt(i);
        h1 = Math.imul(h1, 0x01000193) >>> 0;
        h2 ^= h1;
        h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
    }
    return (h1.toString(16) + h2.toString(16)).slice(0, 48);
}

function collectFingerprintSignals() {
    const signals = {};

    try {
        const nav = window.navigator || {};
        signals.ua = nav.userAgent || '';
        signals.platform = nav.platform || '';
        signals.language = nav.language || '';
        signals.languages = Array.isArray(nav.languages) ? nav.languages.join(',') : '';
        signals.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        signals.tzOffset = new Date().getTimezoneOffset();
        signals.screen = `${screen.width}x${screen.height}x${screen.colorDepth || 24}`;
        signals.deviceMemory = nav.deviceMemory || 0;
        signals.cores = nav.hardwareConcurrency || 0;
        signals.touch = Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        signals.pdf = Boolean(nav.pdfViewerEnabled);
    } catch (e) { /* ignore */ }

    // Canvas fingerprint (stable render hash)
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(20, 20, 60, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('aanandham.go', 4, 24);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('wilderness', 90, 36);
            signals.canvas = canvas.toDataURL().slice(-160);
        }
    } catch (e) { /* ignore */ }

    // WebGL renderer fingerprint
    try {
        const gl = document.createElement('canvas').getContext('webgl');
        if (gl) {
            const ext = gl.getExtension('WEBGL_debug_renderer_info');
            signals.webgl = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '') : String(gl.getParameter(gl.RENDERER) || '');
        }
    } catch (e) { /* ignore */ }

    // Font fingerprint
    try {
        const base = document.createElement('span');
        base.style.font = '72px Arial';
        base.textContent = 'mmmmmmmmmmlli';
        document.body.appendChild(base);
        const probe = document.createElement('span');
        probe.style.font = '72px Georgia';
        probe.textContent = 'mmmmmmmmmmlli';
        document.body.appendChild(probe);
        signals.fontWidth = base.offsetWidth === probe.offsetWidth ? 'same' : 'diff';
        document.body.removeChild(base);
        document.body.removeChild(probe);
    } catch (e) { /* ignore */ }

    return signals;
}

/**
 * Get (and cache) the device fingerprint hash.
 * Safe to call anywhere on the client; never blocks on failure.
 */
export async function getDeviceFingerprint() {
    if (cachedFingerprint) return cachedFingerprint;
    if (fingerprintPromise) return fingerprintPromise;

    fingerprintPromise = (async () => {
        try {
            if (typeof window === 'undefined') return '';
            const stored = localStorage.getItem('aanandham_device_fp');
            if (stored && stored.length >= 32) {
                cachedFingerprint = stored;
                return stored;
            }
            const raw = stableStringify(collectFingerprintSignals());
            const hash = await hashString(raw);
            if (hash && hash.length >= 32) {
                try { localStorage.setItem('aanandham_device_fp', hash); } catch (e) { /* ignore */ }
                cachedFingerprint = hash;
                return hash;
            }
            return '';
        } catch (e) {
            return '';
        }
    })();

    return fingerprintPromise;
}

/**
 * Build headers object to attach to sensitive POST requests.
 */
export async function getSecurityHeaders(extra = {}) {
    const fp = await getDeviceFingerprint();
    const headers = { ...extra };
    if (fp) headers['x-device-fingerprint'] = fp;
    return headers;
}