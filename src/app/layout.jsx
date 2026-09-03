import './globals.css';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import SmoothScroll from '@/components/SmoothScroll';
import GlobalActionHub from '@/components/common/GlobalActionHub';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SEO_KEYWORDS, SITE_RATING } from '@/lib/seoKeywords';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#F8F9F5',
  colorScheme: 'light dark',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aanandham.go — Luxury Camping & Tent Stays in Munnar',
    template: '%s | Aanandham.go'
  },
  description: 'Book verified high-altitude camping, Suryanelli tent stays & 4x4 Kolukkumalai sunrise treks in Munnar, Kerala with Aanandham.go.',
  keywords: SEO_KEYWORDS,
  authors: [{ name: 'Aanandham Wilderness Platform' }],
  creator: 'Aanandham.go',
  publisher: 'Aanandham.go',
  alternates: {
    canonical: 'https://www.aanandham.in',
  },
  openGraph: {
    title: 'Aanandham.go — Luxury Camping & Tent Stays in Munnar',
    description: 'Book verified high-altitude camping, Suryanelli tent stays & 4x4 Kolukkumalai sunrise treks in Munnar with Aanandham.go.',
    url: siteUrl,
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Aanandham.go Luxury Wilderness Camping in Munnar',
      },
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: 'Aanandham.go Wilderness Camps Logo',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aanandham.go — Luxury Camping & Tent Stays in Munnar',
    description: 'Book verified high-altitude camping, Suryanelli tent stays & 4x4 Kolukkumalai sunrise treks with Aanandham.go.',
    creator: '@aanandham_go',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
      `${siteUrl}/logo.png`
    ],
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
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png?v=2' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png?v=2' },
    ],
  },
  manifest: '/site.webmanifest?v=2',
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  } : {}),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Campground',
  name: 'Aanandham.go Wilderness Camps',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
  logo: `${siteUrl}/logo.png`,
  '@id': siteUrl,
  url: siteUrl,
  telephone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ? `+${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}` : '+919074858014',
  email: 'bookings@aanandham.in',
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
      opens: '06:00',
      closes: '22:00'
    }
  ],
  sameAs: [
    'https://www.instagram.com/aanandham.go',
    'https://www.facebook.com/aanandham.go',
    'https://twitter.com/aanandham_go',
    'https://www.linkedin.com/company/aanandhamgo'
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '4x4 Offroad Mountain Jeep Transfers', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private Campfire & Live BBQ Platter', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Weatherproof Alpine Dome Tents', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kolukkumalai Sunrise Guided Ridge Hike', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Forest Guide & First-Aid Support', value: true }
  ],
  aggregateRating: SITE_RATING,
  additionalType: 'https://schema.org/TouristAttraction'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://*.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://*.supabase.co" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif', backgroundColor: '#F8F9F5', color: '#121613' }}>
        <SmoothScroll />
        {children}
        <GlobalActionHub />
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics 4 (GA4) with Non-Blocking Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-D7B74EEL0Z'}`}
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-D7B74EEL0Z'}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Razorpay Standard Checkout SDK */}
        <Script
          id="razorpay-checkout-sdk"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
