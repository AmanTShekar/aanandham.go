export const metadata = {
  title: 'Contact & Reservations — Aanandham.go Suryanelli Basecamp',
  description: 'Connect with Aanandham.go camp coordinators. 24/7 WhatsApp concierge, instant booking reservations, and GPS directions to Suryanelli Peak Ridge, Munnar.',
  alternates: {
    canonical: 'https://aanandham.in/contact',
  },
  openGraph: {
    title: 'Contact Aanandham.go Wilderness Basecamp',
    description: 'Instant WhatsApp booking support, trail coordinates, and direct camp reservations for Munnar & Western Ghats glamping.',
    url: 'https://aanandham.in/contact',
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
    title: 'Contact Aanandham.go Wilderness Basecamp',
    description: 'Instant WhatsApp booking support, trail coordinates, and campsite reservations.',
    creator: '@aanandham_go',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  }
};

export default function ContactLayout({ children }) {
  return children;
}
