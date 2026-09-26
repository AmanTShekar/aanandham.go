import React from 'react';
import CampsDirectoryClient from '../CampsDirectoryClient';

export const metadata = {
  title: 'Vagamon Pine Forest Glamping & Stays · Coming Soon',
  description:
    'Vagamon pine valley dome glamping is launching soon with Aanandham.go. Join the WhatsApp waitlist — meanwhile explore verified live camps in Munnar & Suryanelli.',
  alternates: {
    canonical: 'https://www.aanandham.in/camps/vagamon',
  },
  openGraph: {
    title: 'Vagamon Pine Forest Glamping & Stays',
    description:
      'Book secluded pine valley dome glamping & offroad jeep camping in Vagamon, Kerala with Aanandham.go.',
    url: 'https://www.aanandham.in/camps/vagamon',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Vagamon Pine Forest Glamping & Mountain Dome Stays',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vagamon Pine Forest Glamping & Stays',
    description: 'Book secluded pine valley dome glamping in Vagamon, Kerala.',
    images: ['https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default function VagamonCampsPage() {
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
        name: 'Vagamon',
        item: `${siteUrl}/camps/vagamon`,
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
        initialCamps={[]}
        initialRegion="All"
        comingSoon={true}
        comingSoonRegion="Vagamon"
        comingSoonTitle="Vagamon pine-valley basecamps are launching soon."
        comingSoonSubtitle="We are verifying pine-grove sites, stream trails and washroom standards before opening bookings. Join the waitlist for early-bird dates — meanwhile our Munnar & Suryanelli ridge camps below are live and bookable today."
        comingSoonPoints={['Pine forest domes', 'Stream trails', 'Campfire BBQ', 'Early-bird alerts']}
        heroBadge="★ VAGAMON · COMING SOON"
        heroTitle={<>Vagamon Pine Forest <span style={{ color: '#D5ED55' }}>Glamping — Coming Soon</span></>}
        heroSubtitle="Mist, pines and meadows at 3,800 FT. We are setting up verified Aanandham basecamps — live Kerala camps are open for booking below."
      />
    </>
  );
}
