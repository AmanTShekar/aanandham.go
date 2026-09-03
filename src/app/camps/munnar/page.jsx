import React from 'react';
import CampsDirectoryClient from '../CampsDirectoryClient';
import { INITIAL_ALL_CAMPS } from '@/lib/campsData';

export const metadata = {
  title: 'Munnar Camping & Suryanelli Stays',
  description:
    'Explore verified high-altitude campsites in Munnar & Suryanelli. 4x4 Kolukkumalai sunrise treks, campfire BBQ & geodesic dome pods with Aanandham.go.',
  keywords: [
    'Munnar Camping',
    'Suryanelli Tent Stays',
    'Kolukkumalai Sunrise 4x4 Trek',
    'Tiger Rock Camping Munnar',
    'Meesapulimala Basecamp',
    'Phantom Head Ridge Glamping',
    'Munnar Geodesic Dome Pods',
    'Safe Couples Camping Munnar'
  ],
  alternates: {
    canonical: 'https://www.aanandham.in/camps/munnar',
  },
  openGraph: {
    title: 'Munnar Camping & Suryanelli Stays',
    description:
      'Explore verified high-altitude campsites in Munnar & Suryanelli with 4x4 sunrise treks & campfire BBQ.',
    url: 'https://www.aanandham.in/camps/munnar',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Munnar High-Altitude Camping & Suryanelli Tent Stays',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Munnar Camping & Suryanelli Stays',
    description: 'Explore verified high-altitude campsites in Munnar & Suryanelli.',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default function MunnarCampsPage() {
  const munnarCamps = INITIAL_ALL_CAMPS.filter(c => c.region === 'Munnar' || c.region === 'Suryanelli');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Camps',
        item: `${siteUrl}/camps`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Munnar',
        item: `${siteUrl}/camps/munnar`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CampsDirectoryClient
        initialCamps={munnarCamps}
        initialRegion="Munnar"
        heroBadge="★ 5 SIGNATURE MUNNAR CAMPS"
        heroTitle={<>Munnar High-Altitude <span style={{ color: '#D5ED55' }}>Camps & Ridge Stays</span></>}
        heroSubtitle="Perched high above rolling cloud beds in Suryanelli, Kolukkumalai & Vattavada (6,000–7,900 FT). Enjoy 4x4 sunrise summit convoys, starlit campfire barbecues, and private geodesic dome stays."
      />
    </>
  );
}
