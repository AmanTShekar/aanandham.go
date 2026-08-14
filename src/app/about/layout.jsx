export const metadata = {
  title: 'About Us — Aanandham.go Wilderness Camps & Team Munnar',
  description: 'Learn the story behind Aanandham.go. From tea estate ridge paths to Kerala’s certified wilderness pathfinders, high-altitude glamping, and 4x4 sunrise expeditions.',
  alternates: {
    canonical: 'https://aanandham.in/about',
  },
  openGraph: {
    title: 'About Aanandham.go — High-Altitude Wilderness Camps',
    description: 'Meet the certified pathfinders, explore our origin story, and discover 6 signature Munnar & Suryanelli mountain attractions.',
    url: 'https://aanandham.in/about',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'About Aanandham.go High-Altitude Camps & Team',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Aanandham.go — High-Altitude Wilderness Camps',
    description: 'Meet the certified pathfinders and explore the highest tea estate ridge stays in Kerala.',
    creator: '@aanandham_go',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&h=630&q=80'],
  }
};

export default function AboutLayout({ children }) {
  return children;
}
