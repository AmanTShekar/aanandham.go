import React from 'react';
import CampsDirectoryClient from '../CampsDirectoryClient';
import { INITIAL_ALL_CAMPS } from '@/lib/campsData';

export const metadata = {
  title: 'Wayanad Forest Camping & Pod Stays',
  description:
    'Discover rainforest treehouses & Chembra cloud-level wooden pods in Wayanad. Verified wilderness camps & 900 Kandi stays with Aanandham.go.',
  keywords: [
    'Wayanad Camping',
    'Chembra Peak Pods',
    '900 Kandi Treehouse Glamping',
    'Wayanad Rainforest Stays',
    'Wayanad Glass Bridge Camp',
    'Safe Forest Campsites Wayanad'
  ],
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
  const wayanadCamps = INITIAL_ALL_CAMPS.filter(c => c.region === 'Wayanad');
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
        initialCamps={wayanadCamps}
        initialRegion="Wayanad"
        heroBadge="★ RAINFOREST CANOPY"
        heroTitle={<>Wayanad Forest Camping & <span style={{ color: '#D5ED55' }}>Pod Stays</span></>}
        heroSubtitle="Perched among ancient rainforest canopies and overlooking Chembra Peak (4,200 FT). Featuring 900 Kandi treehouse glamping, cardamom trail hikes, and mist-covered wooden cabins."
      />
    </>
  );
}
