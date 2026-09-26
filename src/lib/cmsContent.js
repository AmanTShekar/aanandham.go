// ── MARKETING CMS CONTENT DEFAULT STORE & HELPERS ──
import { BLOG_POSTS } from './blogPosts';

export const DEFAULT_DESTINATION_CONTENT = {
    munnar: {
        badge: '★ TOP 5 VERIFIED CAMPS IN MUNNAR',
        title: 'Top Camps in Munnar: Best Camp Stays & Ridge Glamping',
        subtitle: 'Perched high above rolling cloud beds in Suryanelli, Kolukkumalai & Vattavada (6,000–7,900 FT). Enjoy 4x4 sunrise summit convoys, starlit campfire barbecues, and private ridge glamping stays.',
        metaTitle: 'Top Camps in Munnar (2026) · Best Camp Stays & Tent Glamping | Aanandham.go',
        metaDescription: 'Looking for the best camps in Munnar? Discover top camp stays across Suryanelli & Kolukkumalai. 4x4 sunrise safari, campfire BBQ & verified luxury tents from ₹1,899.'
    },
    vagamon: {
        badge: '★ VAGAMON · COMING SOON',
        title: 'Vagamon Pine Forest Glamping — Coming Soon',
        subtitle: 'Pine-valley basecamps are being verified. Join the waitlist — live Kerala camps are open below.',
        metaTitle: 'Vagamon Pine Forest Glamping & Stays · Coming Soon | Aanandham.go',
        metaDescription: 'Vagamon pine glamping launching soon with Aanandham.go. Join the waitlist — explore live Munnar camps meanwhile.'
    },
    wayanad: {
        badge: '★ WAYANAD · COMING SOON',
        title: 'Wayanad Rainforest Camping — Coming Soon',
        subtitle: 'Rainforest basecamps are being verified. Join the waitlist — live Kerala camps are open below.',
        metaTitle: 'Wayanad Forest Camping & Pod Stays · Coming Soon | Aanandham.go',
        metaDescription: 'Wayanad rainforest stays launching soon with Aanandham.go. Join the waitlist — explore live Munnar camps meanwhile.'
    },
    himachal: {
        badge: '★ HIMACHAL HIMALAYAS · COMING SOON',
        title: 'Himachal Himalayan Camping — Coming Soon',
        subtitle: 'Kalga–Kasol live today; Manali & Spiti circuits being verified. Join the waitlist for early-bird dates.',
        metaTitle: 'Himachal Himalayan Camping & Homestays · Coming Soon | Aanandham.go',
        metaDescription: 'Himachal camps launching soon with Aanandham.go — Kalga live, Manali & Spiti on the way. Join the waitlist.'
    }
};

export const DEFAULT_BRAND_STORY = {
    heroBadge: 'STUDENT EXPLORERS & MOUNTAIN CHARTER',
    heroTitle: 'From Kerala Classrooms to Sunrise Cloud Beds',
    heroSubtitle: 'Born from a bunch of students who fell in love with Kerala’s misty mountains, freshwater springs, and 7,900 FT sunrise cloud beds. Built to share real wilderness adventures with everyone at an honest, affordable rate.',
    founderQuote: 'We didn’t start Aanandham in a boardroom. We started it around a crackling campfire with cold hands, hot cardamom tea, and a promise to make Kerala’s misty sunrise cloud beds accessible to everyone.',
    elevationTiers: [
        { altitude: '7,900 FT', location: 'Kolukkumalai Sunrise Ridge', temp: '8°C - 14°C', terrain: 'High Alpine Grassland & Organic Tea Edge' },
        { altitude: '6,600 FT', location: 'Meesapulimala Peak Camp', temp: '10°C - 16°C', terrain: 'Valley of Rhododendrons & Mountain Stream' },
        { altitude: '5,400 FT', location: 'Suryanelli Cloud Bed Glamp', temp: '14°C - 20°C', terrain: 'Overlooking Anaerangal Lake & Cloud Beds' },
        { altitude: '3,800 FT', location: 'Vagamon Pine Valley', temp: '16°C - 22°C', terrain: 'Dense Pine Forest & Natural Water Springs' }
    ]
};

export const DEFAULT_SERVICES_CONTENT = {
    heroBadge: 'EXPEDITION & TECH DIVISION',
    heroTitle: 'Wilderness Adventures & Production Systems',
    heroSubtitle: 'From private cloud-summit convoys and curated campfire dining to enterprise hospitality technology shipped by OpenZen.',
    packages: [
        { category: 'EXPEDITION', title: '4x4 Sunrise Summit Convoy', description: 'Rugged Mahindra 4x4 offroad expedition to Kolukkumalai 7,900 FT with expert tea estate drivers.', priceTag: 'Included in Ridge Passes' },
        { category: 'HOSPITALITY', title: 'Curated Campfire Barbecue & Dining', description: 'Freshly barbecued mountain grill, local Kerala spiced dinner, and hot kettle tea at dawn.', priceTag: 'Included in All Bookings' },
        { category: 'TECHNOLOGY', title: 'OpenPMS Enterprise Operations', description: 'Real-time booking engine, 2-way OTA channel sync, and mobile staff check-in systems.', priceTag: 'Powered by OpenZen' }
    ]
};

export const DEFAULT_HOTLINES_CONTENT = {
    hotlineBadge: '24/7 EXPEDITION HOTLINE',
    whatsappNumber: '+91 90748 58014',
    emergencyNumber: '+91 90748 58014',
    supportEmail: 'concierge@aanandham.in',
    basecampAddress: 'Suryanelli Basecamp, Munnar, Kerala 685618',
    operationalHours: '24/7 All Days Active',
    gpsCoordinates: '10.0270° N, 77.1420° E'
};

export const DEFAULT_SITE_PAGES_CONTENT = {
    about: DEFAULT_BRAND_STORY,
    services: DEFAULT_SERVICES_CONTENT,
    contact: DEFAULT_HOTLINES_CONTENT
};

// In-memory cache for CMS content
let cmsCache = {
    destinations: DEFAULT_DESTINATION_CONTENT,
    sitePages: DEFAULT_SITE_PAGES_CONTENT,
    blogPosts: BLOG_POSTS
};

export function getCmsContent() {
    return cmsCache;
}

export function setCmsContent(newContent) {
    cmsCache = {
        ...cmsCache,
        ...newContent
    };
    return cmsCache;
}
