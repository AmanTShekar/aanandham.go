// SEO metadata for /services — lives in layout so client page can use 'use client'
export const metadata = {
  title: 'OpenZen × Aanandham Studio — Tech & Brand Services',
  description: 'OpenZen: custom websites, SaaS & software. Aanandham Studio: brand setup, social media, performance marketing. View portfolio & start your project.',
  keywords: [
    'OpenZen', 'Aanandham Studio', 'web development Kerala', 'SaaS development India',
    'brand setup Kerala', 'social media management', 'performance marketing Kerala',
    'custom software Munnar', 'Next.js agency Kerala', 'digital marketing agency Kerala',
    'restaurant website design', 'resort booking platform', 'hospitality marketing India',
    'tourism digital agency', 'wilderness brand marketing', 'Aanandham services'
  ],
  alternates: {
    canonical: 'https://www.aanandham.in/services'
  },
  openGraph: {
    title: 'OpenZen × Aanandham Studio — Tech & Brand Services',
    description: 'Two service wings. One roof. Websites, SaaS, brands, social, and growth — for hospitality & lifestyle brands.',
    url: 'https://www.aanandham.in/services',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'OpenZen × Aanandham Studio — Tech & Brand Services'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenZen × Aanandham Studio',
    description: 'Websites, SaaS, brands & growth. View portfolio & start your project.'
  }
};

export default function ServicesLayout({ children }) {
  return children;
}