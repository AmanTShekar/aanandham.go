import React from 'react';
import CampsDirectoryClient from '../CampsDirectoryClient';

export const metadata = {
  title: 'Wayanad Forest Camping & Pod Stays · Coming Soon',
  description:
    'Wayanad rainforest treehouses & Chembra pods are launching soon with Aanandham.go. Join the WhatsApp waitlist — meanwhile explore verified live camps in Munnar & Suryanelli.',
  alternates: {
    canonical: 'https://www.aanandham.in/camps/wayanad',
  },
  openGraph: {
    title: 'Wayanad Forest Camping & Pod Stays',
    description:
      'Discover rainforest treehouses & Chembra cloud-level wooden pods in Wayanad with Aanandham.go.',
    url: 'https://www.aanandham.in/camps/wayanad',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Wayanad Rainforest Treehouses & Chembra Peak Pods',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wayanad Forest Camping & Pod Stays',
    description: 'Discover rainforest treehouses & Chembra wooden pods in Wayanad.',
    images: ['https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default function WayanadCampsPage() {
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
        name: 'Wayanad',
        item: `${siteUrl}/camps/wayanad`,
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
        comingSoonRegion="Wayanad"
        comingSoonTitle="Wayanad rainforest basecamps are launching soon."
        comingSoonSubtitle="We are verifying 900 Kandi stream sites, Chembra-view pods and forest safety before opening bookings. Join the waitlist for early-bird dates — meanwhile our Munnar & Suryanelli ridge camps below are live and bookable today."
        comingSoonPoints={['900 Kandi streams', 'Chembra-view pods', 'Glass-bridge trails', 'Early-bird alerts']}
        heroBadge="★ WAYANAD · COMING SOON"
        heroTitle={<>Wayanad Rainforest <span style={{ color: '#D5ED55' }}>Camping — Coming Soon</span></>}
        heroSubtitle="Rainforest canopies, waterfalls and misty ridgelines. Verified Aanandham basecamps are on the way — live Kerala camps are open below."
      />
    </>
  );
}
