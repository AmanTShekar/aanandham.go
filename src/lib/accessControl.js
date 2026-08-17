import crypto from 'crypto';

/**
 * Flexible Check-in, Access Gate PINs & Offline Landmark Guides
 */

const PIN_SALT = process.env.GATE_PIN_SALT || process.env.ADMIN_AUTH_SECRET || 'aanandham_high_entropy_salt_v2_2026';

/**
 * Generate a deterministic, secure 4-digit Access PIN for smart locks / barrier gates
 * @param {string} bookingId - e.g. BK-M98X4K-A1
 * @param {string} dateStr - e.g. 2026-09-12
 * @returns {string} 4-digit PIN e.g. "8492"
 */
export function generateGatePin(bookingId, dateStr = '') {
    if (!bookingId) return '1234';
    const hash = crypto.createHash('sha256').update(`${bookingId}_${dateStr}_${PIN_SALT}`).digest('hex');
    const num = parseInt(hash.substring(0, 6), 16) % 9000 + 1000;
    return String(num);
}

/**
 * Generate a cryptographically signed HMAC token for the digital pass URL
 * @param {string} bookingId
 * @returns {string} Short 16-character hexadecimal HMAC signature
 */
export function generatePassToken(bookingId) {
    if (!bookingId) return '';
    return crypto.createHmac('sha256', PIN_SALT).update(bookingId.toUpperCase()).digest('hex').substring(0, 16);
}

/**
 * Verify a pass token against a booking ID and booking status
 * @param {string} bookingId
 * @param {string} token
 * @param {string} status - Optional booking status e.g. "Cancelled", "Refunded"
 * @returns {boolean}
 */
export function verifyPassToken(bookingId, token, status = 'Confirmed') {
    if (!bookingId || !token) return false;

    // Immediately reject revoked, refunded, or cancelled booking passes
    if (['Cancelled', 'Refunded', 'Expired', 'Failed'].includes(status)) {
        return false;
    }

    const expected = generatePassToken(bookingId);
    try {
        const tokenBuf = Buffer.from(token);
        const expectedBuf = Buffer.from(expected);
        if (tokenBuf.length !== expectedBuf.length) {
            crypto.timingSafeEqual(tokenBuf, tokenBuf);
            return false;
        }
        return crypto.timingSafeEqual(tokenBuf, expectedBuf);
    } catch (e) {
        return false;
    }
}

/**
 * Get offline landmark navigation and self check-in guide for a campsite
 * @param {string} campsiteId
 * @returns {object} Landmark directions & marshal contact
 */
export function getCheckInLandmarkGuide(campsiteId = '') {
    const key = String(campsiteId).toLowerCase();

    if (key.includes('kolukkumalai') || key.includes('suryanelli')) {
        return {
            hubName: 'Suryanelli Town Basecamp Hub',
            gpsCoordinates: '10.0889° N, 77.0595° E',
            parkingArea: 'Designated 4x4 Private Parking Yard (Behind Suryanelli Tea Factory)',
            steps: [
                'Arrive at Suryanelli Town Hub by 1:30 PM (before 4x4 convoy departs).',
                'Park your private vehicle in the reserved fenced parking zone.',
                'Show your Aanandham digital permit pass to Marshal Suresh (+91 94009 87654).',
                'Board your allocated 4x4 Mahindra Thar/Jeep for the 35-minute offroad ascent to the ridge.',
                'Use Gate PIN at the summit barrier gate.'
            ],
            emergencyMarshalPhone: '+91 94009 87654',
            offlineNote: 'Mobile data drops past Suryanelli factory. Please screenshot your pass & PIN before leaving Munnar town.'
        };
    }

    return {
        hubName: 'Aanandham Basecamp Reception',
        gpsCoordinates: '10.0889° N, 77.0595° E',
        parkingArea: 'Complimentary On-Site Secured Parking',
        steps: [
            'Follow the mountain signage to Aanandham Gate 1.',
            'Enter your 4-digit PIN on the digital keypad.',
            'Proceed to reception for key handover and welcome tea.'
        ],
        emergencyMarshalPhone: '+91 94009 87654',
        offlineNote: 'Download offline Google Maps for Idukki district before ascent.'
    };
}
