// ── MARKETING CMS CONTENT DEFAULT STORE & HELPERS ──
import { BLOG_POSTS } from './blogPosts';

export const DEFAULT_DESTINATION_CONTENT = {
    munnar: {
        badge: '★ 5 SIGNATURE MUNNAR CAMPS',
        title: 'Munnar High-Altitude Camps & Ridge Stays',
        subtitle: 'Perched high above rolling cloud beds in Suryanelli, Kolukkumalai & Vattavada (6,000–7,900 FT). Enjoy 4x4 sunrise summit convoys, starlit campfire barbecues, and private geodesic dome stays.',
        metaTitle: 'Munnar Camping & Suryanelli Stays | Aanandham.go',
        metaDescription: 'Explore verified high-altitude campsites in Munnar & Suryanelli. 4x4 Kolukkumalai sunrise treks, campfire BBQ & geodesic dome pods.'
    },
    vagamon: {
        badge: '★ SECLUDED PINE VALLEY',
        title: 'Vagamon Pine Forest Glamping & Stays',
        subtitle: 'Tucked away in the whispering pine groves of Vagamon (3,800 FT). Enjoy misty valley walks, private stream trails, and cozy alpine campfire nights.',
        metaTitle: 'Vagamon Pine Forest Glamping & Stays | Aanandham.go',
        metaDescription: 'Book secluded pine valley dome glamping & offroad jeep camping in Vagamon, Kerala with Aanandham.go.'
    },
    wayanad: {
        badge: '★ 900 KANDI & CHEMBRA PEAK',
        title: 'Wayanad Rainforest Camping & Pod Stays',
        subtitle: 'Immerse yourself in deep mist-covered rainforest canopies, glass bridge trails, and private mountain stream pools with 24/7 Aanandham concierge.',
        metaTitle: 'Wayanad Forest Camping & Pod Stays | Aanandham.go',
        metaDescription: 'Discover rainforest treehouses & Chembra cloud-level wooden pods in Wayanad with Aanandham.go.'
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
