// ── TESTIMONIALS (CLIENT-SAFE CORE) ──
// Pure logic + localStorage helpers. No Node-only imports — safe for client
// bundles. Server persistence lives in ./testimonials.js (fs-backed store).
// Admin edits testimonials via /api/admin/testimonials; public pages consume
// via GET /api/testimonials.

export const DEFAULT_TESTIMONIALS = [
    {
        id: 't-1',
        quote: "Coming from Kochi, I needed a complete escape from work stress. Watching the 7,900 FT Kolukkumalai cloud sunrise with a hot cup of black tea and the campfire vibes was pure peace. The marshals managed everything seamlessly — from the bumpy 4x4 trail to tent safety.",
        author: "Arjun Varma",
        campBadge: "camp '25",
        batchDate: "Aanandham, August 2025",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ArjunVarma&backgroundColor=b6e3f4",
        instagram: "arjun.varma.trails",
        active: true
    },
    {
        id: 't-2',
        quote: "I was hesitant about traveling solo as a woman, but the Aanandham camp staff made me feel comfortable immediately. Gated perimeter, clean western washrooms with hot water, and great conversations around the campfire. Will definitely return with my college gang.",
        author: "Anjali Menon",
        campBadge: "camp '25",
        batchDate: "Aanandham, March 2025",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=AnjaliMenon&backgroundColor=ffd5dc",
        instagram: "anjali_menon_roams",
        active: true
    },
    {
        id: 't-3',
        quote: "We booked a 16-person team offsite from Infopark Kochi to Suryanelli ridge. Live campfire BBQ at 12°C, starlit acoustic jamming, and morning mist rolling over the tents. Far better than any generic resort stay.",
        author: "Gokul Krishnan & Squad",
        campBadge: "camp '25",
        batchDate: "Aanandham, November 2025",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=GokulKrishnan&backgroundColor=c0aede",
        instagram: "gokul.krishnan.k",
        active: true
    },
    {
        id: 't-4',
        quote: "Took my parents and sister to Suryanelli basecamp. The hosts were incredibly respectful and attentive. Authentic Kerala meals, warm insulated bedding, and the 4:30 AM jeep convoy to see the sunrise above the clouds was unforgettable.",
        author: "Dr. Sneha Pillai",
        campBadge: "camp '26",
        batchDate: "Aanandham, January 2026",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=SnehaPillai&backgroundColor=d1d4f9",
        instagram: "dr.snehapillai",
        active: true
    },
    {
        id: 't-5',
        quote: "The night sky at Suryanelli was unreal — zero light pollution and millions of stars above the ridge. The private dome tent was cozy and the camp team handled forest permits and trail guides without any hassle. 10/10 experience.",
        author: "Nikhil & Devika",
        campBadge: "camp '26",
        batchDate: "Aanandham, February 2026",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=NikhilDevika&backgroundColor=ffdfbf",
        instagram: "nikhil_devika_travels",
        active: true
    }
];

// Client-side localStorage override (used by the admin UI for instant previews)
const LS_KEY = 'aanandham_admin_testimonials_v2';

export function loadTestimonialsFromStorage() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) { /* ignore */ }
    return null;
}

export function saveTestimonialsToStorage(list) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
}

// Active (published) testimonials only
export function getActiveTestimonials(list) {
    return (Array.isArray(list) ? list : DEFAULT_TESTIMONIALS).filter(t => t.active !== false);
}