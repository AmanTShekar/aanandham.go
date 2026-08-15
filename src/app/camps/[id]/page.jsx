import React from 'react';
import { INITIAL_ALL_CAMPS, getCampById, getAllCamps } from '../../../lib/campsData';
import CampPropertyDetailClient from './CampPropertyDetailClient';

export async function generateStaticParams() {
    return INITIAL_ALL_CAMPS.map(camp => ({
        id: camp.id
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const camp = getCampById(id) || INITIAL_ALL_CAMPS.find(c => c.id === id);

    if (!camp) {
        return {
            title: 'Wilderness Sanctuary Not Found | Aanandham.go',
            description: 'The requested Kerala mountain campsite or offroad sanctuary was not found.',
            robots: { index: false, follow: false }
        };
    }

    const ogImage = camp.image ? (camp.image.startsWith('http') ? camp.image : `https://aanandhamgo.com${camp.image}`) : 'https://aanandhamgo.com/images/hero-1.webp';

    return {
        title: `${camp.title} (${camp.altitude || 'Western Ghats'}) | Aanandham.go`,
        description: camp.description || `Experience ${camp.title} at ${camp.altitude} in ${camp.location}. Instant reservation with guided off-road transit, alpine tents, and Kerala dining.`,
        alternates: {
            canonical: `/camps/${camp.id}`
        },
        openGraph: {
            title: `${camp.title} — High-Altitude Wilderness Basecamp`,
            description: camp.description || `Book your stay at ${camp.title} in ${camp.location}. Curated mountain glamping and campfire expeditions.`,
            url: `https://aanandhamgo.com/camps/${camp.id}`,
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
            title: `${camp.title} | Aanandham.go Campsites`,
            description: camp.description,
            images: [ogImage]
        }
    };
}

export default async function CampPropertyDetailPage({ params }) {
    const { id } = await params;
    const camp = getCampById(id) || INITIAL_ALL_CAMPS.find(c => c.id === id);
    const allCamps = getAllCamps();

    const campJsonLd = camp ? {
        "@context": "https://schema.org",
        "@type": ["Campground", "Product", "LodgingBusiness"],
        "name": camp.title,
        "description": camp.description,
        "image": camp.image ? (camp.image.startsWith('http') ? camp.image : `https://aanandhamgo.com${camp.image}`) : undefined,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": camp.location || "Munnar",
            "addressRegion": "Kerala",
            "addressCountry": "IN"
        },
        "priceRange": `₹${camp.price || 1800}`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": camp.rating || "4.95",
            "reviewCount": camp.reviewsCount || 120,
            "bestRating": "5",
            "worstRating": "1"
        },
        "offers": {
            "@type": "Offer",
            "price": camp.price || 1800,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": `https://aanandhamgo.com/camps/${camp.id}`,
            "validFrom": new Date().toISOString().split('T')[0]
        },
        "amenityFeature": (camp.amenities || []).map(a => ({
            "@type": "LocationFeatureSpecification",
            "name": a.name || a,
            "value": true
        }))
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
