import React from 'react';
import { redirect } from 'next/navigation';
import { INITIAL_ALL_CAMPS, getCampById, getAllCamps } from '../../../lib/campsData';
import { prisma, isPrismaConfigured } from '@/lib/prisma';
import { requestPms, pmsTenantId } from '@/lib/pmsServerBridge';
import { fetchLivePropertyDetails, fetchLivePropertyRooms } from '@/lib/pmsLiveAvailability';
import CampPropertyDetailClient from './CampPropertyDetailClient';

function ensureArray(val, fallback = []) {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string' && val.trim()) {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {}
        return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return fallback;
}

async function resolveCamp(id) {
    if (!id) return null;

    // 1. Live PMS query via postgres connection pool (authoritative live database)
    try {
        const liveDetails = await fetchLivePropertyDetails(id);
        if (liveDetails) {
            const liveRooms = await fetchLivePropertyRooms(id);
            const basePrice = Number(liveDetails.basePrice || 0);
            return {
                id: liveDetails.id,
                slug: liveDetails.slug || id,
                title: liveDetails.title || 'Sanctuary',
                shortTitle: liveDetails.shortTitle || liveDetails.title,
                name: liveDetails.title,
                category: liveDetails.category || 'Campsite',
                price: basePrice,
                basePrice: basePrice,
                originalPrice: basePrice > 0 ? Math.round(basePrice * 1.3) : 0,
                region: liveDetails.region || (liveDetails.location ? liveDetails.location.split(',')[0].trim() : '') || '',
                location: liveDetails.location || '',
                altitude: liveDetails.altitude || '',
                rating: Number(liveDetails.rating || 5.0),
                description: liveDetails.description || '',
                highlights: ensureArray(liveDetails.amenities || liveDetails.highlights, []),
                inclusions: ensureArray(liveDetails.inclusions, []),
                exclusions: ensureArray(liveDetails.exclusions, []),
                amenities: liveDetails.amenities || '',
                checkInTime: liveDetails.checkInTime || '',
                checkOutTime: liveDetails.checkOutTime || '',
                cancellationPolicy: liveDetails.cancellationPolicy || null,
                latitude: (liveDetails.latitude !== null && !isNaN(Number(liveDetails.latitude))) ? Number(liveDetails.latitude) : null,
                longitude: (liveDetails.longitude !== null && !isNaN(Number(liveDetails.longitude))) ? Number(liveDetails.longitude) : null,
                phone: (liveDetails.phone && liveDetails.phone !== 'null') ? liveDetails.phone : null,
                image: (liveDetails.image && liveDetails.image.trim()) ? liveDetails.image.trim() : '',
                gallery: ensureArray(liveDetails.gallery, []),
                isAvailable: liveDetails.isActive !== false,
                rooms: (Array.isArray(liveRooms) ? liveRooms : []).map(rt => ({
                    id: rt.id,
                    name: rt.name,
                    price: Number(rt.price ?? rt.basePrice ?? basePrice),
                    basePrice: Number(rt.price ?? rt.basePrice ?? basePrice),
                    weekendPrice: rt.weekendPrice ? Number(rt.weekendPrice) : null,
                    capacity: rt.capacity || '2 Guests',
                    guestCapacity: rt.guestCapacity || 2,
                    totalUnits: Number(rt.totalUnits) || 1,
                    features: Array.isArray(rt.features) ? rt.features : [],
                    description: rt.description || '',
                    inventoryType: rt.inventoryType || 'PRIVATE_UNIT',
                    bedConfig: rt.bedConfig || '',
                    roomSizeSqFt: rt.roomSizeSqFt || null,
                    bathroomType: rt.bathroomType || '',
                    pricingModel: rt.pricingModel || (rt.inventoryType === 'DORM_BED' ? 'PER_BED' : 'PER_ROOM'),
                    image: (Array.isArray(rt.images) && rt.images[0]) ? rt.images[0] : (typeof rt.images === 'string' ? rt.images : '')
                }))
            };
        }
    } catch (e) {
        console.error('Error fetching live property from PMS DB:', e);
    }

    // 2. PMS HTTP API bridge
    try {
        const pmsRes = await requestPms(`/api/properties?tenantId=${pmsTenantId()}`);
        if (pmsRes && pmsRes.payload && Array.isArray(pmsRes.payload.properties)) {
            const cleanTarget = String(id).toLowerCase().replace('pkg-', '').trim();
            const liveMatch = pmsRes.payload.properties.find(p => {
                const cleanPId = String(p.id).toLowerCase().replace('pkg-', '').trim();
                const cleanPSlug = String(p.slug || '').toLowerCase().replace('pkg-', '').trim();
                return p.id === id || p.slug === id || cleanPId === cleanTarget || cleanPSlug === cleanTarget;
            });
            if (liveMatch) return liveMatch;
        }
    } catch (e) {
        // Fall back gracefully if PMS is unreachable
    }

    // 3. Local Prisma database fallback
    if (isPrismaConfigured && prisma) {
        try {
            const rows = await prisma.$queryRawUnsafe(`
                SELECT p.id, p.title, p."shortTitle", p.slug, p.category, p.region, p.location, 
                       p.altitude, p."basePrice", p.rating, p.image, p.gallery, p.description, 
                       p.inclusions, p.exclusions, p.amenities, p."checkInTime", p."checkOutTime",
                       p."cancellationPolicy", p.latitude, p.longitude, p.phone, p."isActive",
                       COALESCE(
                           json_agg(
                                json_build_object(
                                    'id', rt.id, 
                                    'name', rt.name, 
                                    'price', rt."basePrice", 
                                    'basePrice', rt."basePrice", 
                                    'capacity', rt.capacity, 
                                    'totalUnits', rt."totalUnits", 
                                    'description', rt.description,
                                    'features', rt.features,
                                    'inventoryType', rt."inventoryType",
                                    'bedConfig', rt."bedConfig",
                                    'roomSizeSqFt', rt."roomSizeSqFt",
                                    'bathroomType', rt."bathroomType",
                                    'pricingModel', rt."pricingModel",
                                    'images', rt.images
                                )
                           ) FILTER (WHERE rt.id IS NOT NULL), '[]'::json
                       ) as rooms
                FROM "Property" p
                LEFT JOIN "RoomType" rt ON rt."propertyId" = p.id
                WHERE (p.id = $1 OR p.slug = $1) AND p."isActive" = true
                GROUP BY p.id
            `, id);

            if (Array.isArray(rows) && rows.length > 0) {
                const dbProp = rows[0];
                const basePrice = Number(dbProp.basePrice || 0);

                return {
                    id: dbProp.id,
                    slug: dbProp.slug || id,
                    title: dbProp.title || 'Wilderness Sanctuary',
                    shortTitle: dbProp.shortTitle || dbProp.title,
                    name: dbProp.title,
                    category: dbProp.category || 'Campsite',
                    price: basePrice,
                    basePrice: basePrice,
                    originalPrice: basePrice > 0 ? Math.round(basePrice * 1.3) : 0,
                    region: dbProp.region || (dbProp.location ? dbProp.location.split(',')[0].trim() : '') || '',
                    location: dbProp.location || '',
                    altitude: dbProp.altitude || '',
                    rating: Number(dbProp.rating || 5.0),
                    description: dbProp.description || '',
                    highlights: ensureArray(dbProp.highlights || dbProp.amenities, []),
                    inclusions: ensureArray(dbProp.inclusions, []),
                    exclusions: ensureArray(dbProp.exclusions, []),
                    amenities: dbProp.amenities || '',
                    checkInTime: dbProp.checkInTime || '',
                    checkOutTime: dbProp.checkOutTime || '',
                    cancellationPolicy: dbProp.cancellationPolicy || null,
                    latitude: (dbProp.latitude !== null && !isNaN(Number(dbProp.latitude))) ? Number(dbProp.latitude) : null,
                    longitude: (dbProp.longitude !== null && !isNaN(Number(dbProp.longitude))) ? Number(dbProp.longitude) : null,
                    phone: (dbProp.phone && dbProp.phone !== 'null') ? dbProp.phone : null,
                    image: dbProp.image || '',
                    gallery: ensureArray(dbProp.gallery, []),
                    isAvailable: dbProp.isActive !== false,
                    rooms: (Array.isArray(dbProp.rooms) ? dbProp.rooms : []).map(rt => ({
                        id: rt.id,
                        name: rt.name,
                        price: Number(rt.price ?? rt.basePrice ?? basePrice),
                        basePrice: Number(rt.price ?? rt.basePrice ?? basePrice),
                        capacity: typeof rt.capacity === 'number' ? `${rt.capacity} Persons` : (rt.capacity || '2 Adults'),
                        totalUnits: Number(rt.totalUnits) || 1,
                        features: Array.isArray(rt.features) ? rt.features : [],
                        description: rt.description || '',
                        inventoryType: rt.inventoryType || 'PRIVATE_UNIT',
                        bedConfig: rt.bedConfig || '',
                        roomSizeSqFt: rt.roomSizeSqFt || null,
                        bathroomType: rt.bathroomType || '',
                        pricingModel: rt.pricingModel || (rt.inventoryType === 'DORM_BED' ? 'PER_BED' : 'PER_ROOM'),
                        image: (Array.isArray(rt.images) && rt.images[0]) ? rt.images[0] : (typeof rt.images === 'string' ? rt.images : '')
                    }))
                };
            }
        } catch (e) {
            console.error('Error in resolveCamp DB lookup:', e);
        }
    }

    // 4. Static catalog fallback
    const cleanTarget = String(id).toLowerCase().replace('pkg-', '').trim();
    const fallbackMatch = INITIAL_ALL_CAMPS.find(c => {
        const cleanId = String(c.id).toLowerCase().replace('pkg-', '').trim();
        const cleanSlug = String(c.slug || '').toLowerCase().replace('pkg-', '').trim();
        return cleanId === cleanTarget ||
               cleanSlug === cleanTarget ||
               c.id === id ||
               c.slug === id ||
               c.pmsPropertyId === id ||
               (Array.isArray(c.aliases) && c.aliases.includes(id));
    });
    return fallbackMatch || null;
}

export async function generateStaticParams() {
    const params = new Set();
    INITIAL_ALL_CAMPS.forEach(camp => {
        if (camp.id) params.add(camp.id);
        if (camp.slug) params.add(camp.slug);
        if (Array.isArray(camp.aliases)) {
            camp.aliases.forEach(a => params.add(a));
        }
    });
    return Array.from(params).map(id => ({ id }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const camp = await resolveCamp(id);

    if (!camp) {
        return {
            title: 'Wilderness Sanctuary Not Found | Aanandham.go',
            description: 'The requested Kerala mountain campsite or offroad sanctuary was not found.',
            robots: { index: false, follow: false }
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';
    const ogImage = camp.image ? (camp.image.startsWith('http') ? camp.image : `${siteUrl}${camp.image}`) : `${siteUrl}/logo.png`;
    const cleanTitle = `${camp.shortTitle || camp.title} (${camp.altitude || 'Kerala'})`;
    const cleanDesc = camp.description || `Book ${camp.shortTitle || camp.title}${camp.altitude ? ` at ${camp.altitude}` : ''}${camp.location ? ` in ${camp.location}` : ''} with Aanandham.go.`;

    return {
        title: cleanTitle,
        description: cleanDesc,
        alternates: {
            canonical: `${siteUrl}/camps/${camp.slug || camp.id}`
        },
        openGraph: {
            title: cleanTitle,
            description: cleanDesc,
            url: `${siteUrl}/camps/${camp.slug || camp.id}`,
            siteName: 'Aanandham.go',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: camp.title
                }
            ],
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: cleanTitle,
            description: cleanDesc,
            images: [ogImage]
        }
    };
}

export default async function CampPropertyDetailPage({ params }) {
    const { id } = await params;
    const camp = await resolveCamp(id);

    // If accessed via raw DB CUID or legacy alias, permanently redirect to clean slug URL
    if (camp && camp.slug && id !== camp.slug) {
        if (id === 'cmu7f7c7q0001jf2bn12igi66' || (Array.isArray(camp.aliases) && camp.aliases.includes(id)) || camp.pmsPropertyId === id) {
            redirect(`/camps/${camp.slug}`);
        }
    }
    const allCamps = getAllCamps();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

    const campJsonLd = camp ? {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LodgingBusiness",
                "@id": `${siteUrl}/camps/${camp.id}#lodging`,
                "name": camp.title,
                "description": camp.description,
                "image": camp.image ? (camp.image.startsWith('http') ? camp.image : `${siteUrl}${camp.image}`) : undefined,
                "url": `${siteUrl}/camps/${camp.slug || camp.id}`,
                "telephone": "+919074858014",
                "priceRange": `₹${camp.price || 1800}`,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": camp.region || "Munnar",
                    "addressRegion": "Kerala",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 10.0889,
                    "longitude": 77.0595
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": (camp.rating || 4.95).toString(),
                    "reviewCount": (camp.reviewsCount || 120).toString(),
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "offers": {
                    "@type": "Offer",
                    "price": camp.price || 1800,
                    "priceCurrency": "INR",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "url": `${siteUrl}/camps/${camp.slug || camp.id}`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/camps/${camp.id}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Camps",
                        "item": `${siteUrl}/camps`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": camp.shortTitle || camp.title,
                        "item": `${siteUrl}/camps/${camp.slug || camp.id}`
                    }
                ]
            }
        ]
    } : null;

    return (
        <>
            {campJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(campJsonLd) }}
                />
            )}
            <CampPropertyDetailClient campId={id} initialCamp={camp} initialAllCamps={allCamps} />
        </>
    );
}
