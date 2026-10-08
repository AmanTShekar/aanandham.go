export const metadata = {
  title: 'Contact & Reservations',
  description: 'Connect with Aanandham.go coordinators. 24/7 WhatsApp concierge, instant booking reservations, and GPS directions to Suryanelli Ridge, Munnar.',
  alternates: {
    canonical: 'https://www.aanandham.in/contact',
  },
  openGraph: {
    title: 'Contact & Reservations',
    description: 'Instant WhatsApp booking support, trail coordinates, and direct camp reservations for Munnar & Western Ghats glamping.',
    url: 'https://www.aanandham.in/contact',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Contact Aanandham.go Wilderness Basecamp Concierge',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Reservations',
    description: 'Instant WhatsApp booking support, trail coordinates, and campsite reservations.',
    creator: '@aanandham_go',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  }
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${siteUrl}/contact#webpage`,
      url: `${siteUrl}/contact`,
      name: 'Contact & Reservations · Aanandham.go',
      description: 'Connect with Aanandham.go coordinators for campsite bookings, 4x4 sunrise treks, and basecamp directions in Munnar.',
      mainEntity: {
        '@type': 'TravelAgency',
        name: 'Aanandham.go Wilderness Concierge',
        telephone: '+919074858014',
        email: 'bookings@aanandham.in',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kolukkumalai Road, Suryanelli Basecamp',
          addressLocality: 'Suryanelli, Munnar',
          addressRegion: 'Kerala',
          postalCode: '685618',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 10.0261,
          longitude: 77.1420
        },
        hasMap: 'https://www.google.com/maps/search/?api=1&query=10.0261,77.1420'
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/contact#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact & Reservations',
          item: `${siteUrl}/contact`
        }
      ]
    }
  ]
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
