import React from 'react';
import { INITIAL_ALL_CAMPS, getCampById, getAllCamps } from '../../../lib/campsData';
import { prisma, isPrismaConfigured } from '@/lib/prisma';
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
    const directMatch = INITIAL_ALL_CAMPS.find(c => {
        const cleanTarget = String(id).toLowerCase().replace('pkg-', '').trim();
        const cleanId = String(c.id).toLowerCase().replace('pkg-', '').trim();
        return cleanId === cleanTarget || c.id === id;
    });
    if (directMatch) return directMatch;

    if (isPrismaConfigured && prisma) {
        try {
            const rows = await prisma.$queryRawUnsafe(`
                SELECT p.id, p.title, p."shortTitle", p.slug, p.category, p.region, p.location, 
                       p.altitude, p."basePrice", p.rating, p.image, p.gallery, p.description, 
                       p.inclusions, p.exclusions, p.amenities, p."isActive",
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
                const basePrice = Number(dbProp.basePrice || 1499);
                const normInclusions = ensureArray(dbProp.inclusions, [
                    'Welcome tea & hot snacks at basecamp check-in',
                    'Buffet dinner with chicken/veg barbecue platter',
                    'Morning hot breakfast & tea/coffee',
                    'Stargazing campfire & live music setup',
                    '4x4 Jeep transfer to Kolukkumalai sunrise point',
                    'Certified camp staff & wilderness first-aid kit'
                ]);
                const normExclusions = ensureArray(dbProp.exclusions, [
                    'Personal vehicle fuel & highway toll charges',
                    'Personal trekking gear (shoes, jackets, torches)',
                    'Extra barbecue meat portions (order on site)',
                    'Entry tickets to commercial viewpoints outside itinerary',
                    'Medical evacuation expenses or insurance coverage'
                ]);
                const normHighlights = ensureArray(dbProp.highlights || dbProp.amenities, [
                    'Panoramic Sunrise View',
                    'Campfire & BBQ',
                    'Staff Guide Support',
                    'Solar Powered Stay'
                ]);

                return {
                    id: dbProp.id,
                    title: dbProp.title || 'Wilderness Camp',
                    shortTitle: dbProp.shortTitle || dbProp.title,
                    name: dbProp.title,
                    category: dbProp.category || 'Campsite',
                    price: basePrice,
                    basePrice: basePrice,
                    originalPrice: Math.round(basePrice * 1.3),
                    region: dbProp.region || (dbProp.location ? dbProp.location.split(',')[0].trim() : '') || 'Munnar',
                    location: dbProp.location || 'Kerala, India',
                    altitude: dbProp.altitude || '6,500 FT',
                    rating: Number(dbProp.rating || 4.95),
                    description: dbProp.description && dbProp.description.trim() ? dbProp.description : 'Authentic mountain sanctuary glamping experience curated by certified camp staff.',
                    highlights: normHighlights,
                    inclusions: normInclusions,
                    exclusions: normExclusions,
                    image: dbProp.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                    gallery: ensureArray(dbProp.gallery, []),
                    isAvailable: dbProp.isActive !== false,
                    rooms: (Array.isArray(dbProp.rooms) ? dbProp.rooms : []).map(rt => ({
                        id: rt.id,
                        name: rt.name,
                        price: Number(rt.price ?? rt.basePrice ?? basePrice),
                        basePrice: Number(rt.price ?? rt.basePrice ?? basePrice),
                        capacity: typeof rt.capacity === 'number' ? `${rt.capacity} Persons` : (rt.capacity || '2 Adults'),
                        totalUnits: Number(rt.totalUnits) || 8,
                        features: ['Mountain View', 'Bedding', 'Campfire Access'],
                        image: (Array.isArray(rt.images) && rt.images[0]) || dbProp.image
                    }))
                };
            }
        } catch (e) {
            console.error('Error in resolveCamp DB lookup:', e);
        }
    }

    return getCampById(id) || INITIAL_ALL_CAMPS[0];
}

export async function generateStaticParams() {
    return INITIAL_ALL_CAMPS.map(camp => ({
        id: camp.id
    }));
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
    const cleanDesc = `Book ${camp.shortTitle || camp.title} at ${camp.altitude || 'Western Ghats'} in ${camp.location}. 4x4 jeep safari, campfire BBQ & tent stays with Aanandham.go.`;

    return {
        title: cleanTitle,
        description: cleanDesc,
        alternates: {
            canonical: `${siteUrl}/camps/${camp.id}`
        },
        openGraph: {
            title: cleanTitle,
            description: cleanDesc,
            url: `${siteUrl}/camps/${camp.id}`,
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
                "url": `${siteUrl}/camps/${camp.id}`,
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
                    "url": `${siteUrl}/camps/${camp.id}`
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
                        "item": `${siteUrl}/camps/${camp.id}`
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
