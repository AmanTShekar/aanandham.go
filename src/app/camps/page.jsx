import React from 'react';
import CampsDirectoryClient from './CampsDirectoryClient';
import { INITIAL_ALL_CAMPS, DEPRECATED_CAMP_IDS } from '@/lib/campsData';

export const metadata = {
  title: "All India Wilderness Campsites & High-Altitude Stays | Aanandham.go",
  description:
    'Explore verified high-altitude campsites and wilderness stays across India — Munnar, Suryanelli, Vagamon, Wayanad, and Himachal Himalayas with 4x4 sunrise treks & campfire BBQ. Book with Aanandham.go.',
  alternates: {
    canonical: 'https://www.aanandham.in/camps',
  },
  openGraph: {
    title: "All India Wilderness Campsites & High-Altitude Stays | Aanandham.go",
    description:
      'Explore verified high-altitude campsites and wilderness stays across India — Munnar, Suryanelli, Vagamon, Wayanad, and Himachal Himalayas with 4x4 sunrise treks & campfire BBQ.',
    url: 'https://www.aanandham.in/camps',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Aanandham.go High-Altitude Campsites Directory',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "All India Wilderness Campsites & High-Altitude Stays | Aanandham.go",
    description: 'Explore verified high-altitude campgrounds across Munnar, Suryanelli, Vagamon, Wayanad, and Himachal Himalayas.',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default function CampsPage() {
  const activeCamps = INITIAL_ALL_CAMPS.filter(camp => !camp.archived && !DEPRECATED_CAMP_IDS.has(camp.id));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Aanandham.go Verified All India Wilderness Campsites',
        description: 'Verified high-altitude camping, tent stays, and ridge dome glamping sites across India.',
        itemListElement: activeCamps.map((camp, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Campground',
            name: camp.title,
            url: `${siteUrl}/camps/${camp.id}`,
            image: camp.image ? (camp.image.startsWith('http') ? camp.image : `${siteUrl}${camp.image}`) : undefined,
            description: camp.description,
            address: {
              '@type': 'PostalAddress',
              addressLocality: camp.region || 'Munnar',
              addressRegion: 'Kerala',
              addressCountry: 'IN',
            },
            priceRange: `₹${camp.price}`,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Wilderness Campsites',
            item: `${siteUrl}/camps`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CampsDirectoryClient initialCamps={activeCamps} />
    </>
  );
}
