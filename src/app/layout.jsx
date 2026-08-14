import './globals.css';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0E1A11',
  colorScheme: 'light',
};

export const metadata = {
  metadataBase: new URL('https://aanandham.in'),
  title: {
    default: 'Aanandham.go — Luxury Camping & Tent Stays in Munnar, Vagamon & Wayanad, Kerala',
    template: '%s | Aanandham.go Wilderness Camps'
  },
  description: 'Book verified high-altitude ridge camping, Suryanelli tent stays, and 4x4 Kolukkumalai sunrise treks. Safe, premium wilderness experiences across Kerala Western Ghats with Aanandham.go.',
  keywords: [
    'Aanandham',
    'Aanandham.go',
    'Munnar Camping',
    'Suryanelli Tent Stay',
    'Kolukkumalai Trekking',
    'Kolukkumalai Sunrise Jeep Safari',
    'Vagamon Glamping',
    'Wayanad Forest Stay',
    'Phantom Head Trek',
    'Kerala Camping',
    'Best Tent Stays in Kerala',
    'Safe Campsites for Couples & Families',
    'High-Altitude Ridge Pods'
  ],
  authors: [{ name: 'Aanandham Wilderness Platform' }],
  creator: 'Aanandham.go',
  publisher: 'Aanandham.go',
  alternates: {
    canonical: 'https://aanandham.in/',
  },
  openGraph: {
    title: 'Aanandham.go — Luxury Camping & Peak Stays in Munnar, Kerala',
    description: 'Experience 4x4 sunrise treks, starlit campfire nights, and verified high-altitude tent glamping at Suryanelli ridge.',
    url: 'https://aanandham.in',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Aanandham.go Luxury Wilderness Camping in Munnar',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aanandham.go — Luxury Camping & Tent Stays in Kerala',
    description: 'Book high-altitude ridge stays, 4x4 sunrise treks to Kolukkumalai, and verified campsites.',
    creator: '@aanandham_go',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Campground',
  name: 'Aanandham.go Wilderness Camps',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
  logo: 'https://aanandham.in/logo.png',
  '@id': 'https://aanandham.in',
  url: 'https://aanandham.in',
  telephone: '+919400987654',
  email: 'bookings@aanandhamgo.in',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kolukkumalai Road, Suryanelli',
    addressLocality: 'Munnar',
    addressRegion: 'Kerala',
    postalCode: '685618',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.0889,
    longitude: 77.0595
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    }
  ],
  sameAs: [
    'https://www.instagram.com/aanandham.go',
    'https://www.facebook.com/aanandham.go',
    'https://twitter.com/aanandham_go',
    'https://www.linkedin.com/company/aanandhamgo'
  ],
  amenityFeature: [
    {
      '@type': 'LocationFeatureSpecification',
      name: 'High-Altitude Ridge Pods',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: '4x4 Sunrise Jeep Safari',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Campfire & Barbecue',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: '24/7 Security & Restrooms',
      value: true
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#0E1A11" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        {/* Font Awesome 6 Icons - Loaded immediately for all UI icons and logos */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif' }}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
