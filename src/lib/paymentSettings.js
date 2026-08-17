// ─────────────────────────────────────────────────────────────
// PAYMENT & GATEWAY SETTINGS MANAGEMENT
// Controls "Coming Soon" vs "Live UPI / QR" payment mode and custom QR config
// ─────────────────────────────────────────────────────────────

export const DEFAULT_PAYMENT_SETTINGS = {
    mode: 'coming_soon', // 'coming_soon' | 'active'
    upiId: '9074858014@upi',
    payeeName: 'Aanandham Wilderness Stays',
    customQrUrl: '',
    allowPayOnArrival: true,
    comingSoonTitle: 'Online UPI & Gateway Payment · Coming Soon',
    comingSoonMessage: 'Our automated instant payment gateway is launching soon! You can submit your reservation request now for instant priority confirmation via our 24/7 Mountain Concierge Desk with zero upfront advance.'
};

export function getPaymentSettings() {
    if (typeof window === 'undefined') return DEFAULT_PAYMENT_SETTINGS;
    try {
        const saved = localStorage.getItem('aanandham_payment_settings');
        if (saved) {
            return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Failed to load payment settings', e);
    }
    return DEFAULT_PAYMENT_SETTINGS;
}

export function savePaymentSettings(settings) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('aanandham_payment_settings', JSON.stringify(settings));
        if (typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new Event('aanandham_payment_settings_updated'));
        }
    } catch (e) {
        console.error('Failed to save payment settings', e);
    }
}
