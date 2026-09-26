import React from 'react';
import Link from 'next/link';
import CampsDirectoryClient from '../CampsDirectoryClient';
import { INITIAL_ALL_CAMPS } from '@/lib/campsData';

export const metadata = {
  title: 'Himachal Stays: Affordable Dorms, Scenic Homestays & Camps in Kalga–Kasol | Aanandham.go',
  description:
    'Book affordable stays in Himachal from ₹249 — dorm beds, private rooms & scenic mountain stays in Kalga, Kasol & Parvati Valley. Campfire dinners, sunrise views & verified hosts with Aanandham.go.',
  alternates: {
    canonical: 'https://www.aanandham.in/camps/himachal',
  },
  openGraph: {
    title: 'Himachal Stays: Affordable Dorms, Scenic Homestays & Camps',
    description:
      'Dorm beds from ₹249, private balcony rooms & scenic sunrise stays in Kalga–Kasol, Parvati Valley. Verified hosts, campfire dinners & guided treks.',
    url: 'https://www.aanandham.in/camps/himachal',
    siteName: 'Aanandham.go',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Scenic Himalayan mountain stay in Himachal — sunrise over pine valleys',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himachal Stays: Dorms from ₹249 · Scenic Mountain Stays',
    description: 'Affordable dorms, private rooms & scenic stays in Kalga–Kasol, Parvati Valley with Aanandham.go.',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

function HimachalStayGuide() {
  return (
    <section style={{ background: '#FFFFFF', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px)' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div className="star-badge" style={{ marginBottom: '12px' }}>
          <span className="star-icon">★</span> Himachal Stay Guide
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.4vw, 36px)', fontWeight: '800', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Affordable stays, dorm beds & scenic mountain rooms in Kalga–Kasol
        </h2>
        <p style={{ fontSize: '15.5px', lineHeight: 1.75, color: '#2A312C', margin: '0 0 28px' }}>
          Kalga is the quieter sibling of Kasol — a pine-covered village above Barshaini where the road ends and
          the views begin. Our Himalayan story starts here with The Nest Kalga: solar-powered stays, a panoramic
          sunrise deck, campfire evenings and a crew that actually walks the ridges with you. Whether you are a
          solo backpacker hunting an affordable dorm stay, a couple looking for the best scenic stay in Parvati
          Valley, or a workation traveller who needs Wi-Fi with a mountain view — start here, then watch this
          page as Manali and Spiti come online.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '18px', marginBottom: '36px' }}>
          <div style={{ background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.1)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '900', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Affordable · Dorm stay</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: '0 0 8px' }}>10-Bed Mountain Dorm — ₹249</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#59655D', margin: '0 0 12px' }}>
              Bunk reading lights with USB, shared hot showers, Wi-Fi, smart TV and geysers. Ideal for solo
              backpackers, college groups and anyone comparing budget stays in Kasol — hostel prices with a
              sunrise view included.
            </p>
            <Link href="/camps/cmu7f7c7q0001jf2bn12igi66" style={{ fontSize: '13.5px', fontWeight: '800', color: '#166534' }}>Check dorm availability →</Link>
          </div>
          <div style={{ background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.1)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '900', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Scenic · Best for couples</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: '0 0 8px' }}>Deluxe Balcony Room — ₹1,499</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#59655D', margin: '0 0 12px' }}>
              Twin beds, mountain-view window, scenic balcony, hot shower geyser and work desk. The classic
              scenic stay in Parvati Valley — wake up above the clouds, fall asleep to the sound of the forest.
            </p>
            <Link href="/camps/cmu7f7c7q0001jf2bn12igi66" style={{ fontSize: '13.5px', fontWeight: '800', color: '#166534' }}>Check balcony room dates →</Link>
          </div>
          <div style={{ background: '#F8F9F5', border: '1px solid rgba(18,22,19,0.1)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '900', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Comfort · Private suite</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: '800', margin: '0 0 8px' }}>Deluxe Suite — ₹1,199</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#59655D', margin: '0 0 12px' }}>
              King bed, ensuite bathroom, high-speed Wi-Fi and daily housekeeping for 3 guests. The easy,
              comfortable basecamp for families and workation stays in Himachal.
            </p>
            <Link href="/camps/cmu7f7c7q0001jf2bn12igi66" style={{ fontSize: '13.5px', fontWeight: '800', color: '#166534' }}>Check suite availability →</Link>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(21px, 2.6vw, 28px)', fontWeight: '800', margin: '0 0 12px' }}>
          Food, campfire & the mountain routine
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#2A312C', margin: '0 0 16px' }}>
          Every Himachal stay starts with a welcome drink and includes dinner and breakfast, a guided ridge trek
          and on-ground staff support. Evenings gather around the campfire with music under some of the darkest,
          most star-filled skies in North India — simple mountain food done well, hot and hearty, timed around
          your treks. It is the same philosophy behind the campfire BBQ and Kerala buffet dinners our Munnar
          basecamps are known for.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#2A312C', margin: '0 0 28px' }}>
          Planning a bigger Himalayan loop? Read our field guides on{' '}
          <Link href="/blog/affordable-dorm-stays-kasol-kalga-himachal-guide" style={{ color: '#166534', fontWeight: '800' }}>affordable dorm stays in Kasol–Kalga</Link>{' '}
          and{' '}
          <Link href="/blog/best-scenic-stays-parvati-valley-himachal" style={{ color: '#166534', fontWeight: '800' }}>the most scenic stays in Parvati Valley</Link>{' '}
          — or browse our{' '}
          <Link href="/camps/munnar" style={{ color: '#166534', fontWeight: '800' }}>best camps in Munnar</Link>{' '}
          if the Western Ghats are calling instead.
        </p>

        <div style={{ background: '#121613', borderRadius: '20px', padding: '28px 30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 4px' }}>
              Manali & Spiti waitlist is open
            </div>
            <p style={{ fontSize: '13.5px', color: '#A2B6A6', margin: '0' }}>Early-bird dates go to the waitlist first. Kalga is bookable today.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/camps/cmu7f7c7q0001jf2bn12igi66" className="btn-lime" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '900', textDecoration: 'none', borderRadius: '999px' }}>
              Book Kalga Stay →
            </Link>
            <Link href="/blog" style={{ padding: '13px 26px', fontSize: '14px', fontWeight: '800', textDecoration: 'none', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
              Himachal Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HimachalCampsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';
  const liveHimachal = INITIAL_ALL_CAMPS.filter((c) => c.region === 'Himachal' && !c.archived);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Camps', item: `${siteUrl}/camps` },
      { '@type': 'ListItem', position: 3, name: 'Himachal', item: `${siteUrl}/camps/himachal` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verified Himachal Stays — Dorms, Rooms & Scenic Mountain Stays',
    description: 'Live bookable Himachal stays with verified hosts, meals and trek support.',
    itemListElement: liveHimachal.map((camp, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'LodgingBusiness',
        name: camp.title,
        description: camp.description,
        url: `${siteUrl}/camps/${camp.id}`,
        image: camp.image?.startsWith('http') ? camp.image : `${siteUrl}${camp.image}`,
        priceRange: `₹${camp.price} - ₹${camp.originalPrice || 1500}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (camp.rating || 4.9).toString(),
          reviewCount: '120',
          bestRating: '5',
          worstRating: '1',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kalga, Kasol',
          addressRegion: 'Himachal Pradesh',
          addressCountry: 'IN',
        },
      },
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are there affordable dorm stays in Kasol and Kalga?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The Nest Kalga offers a 10-bed mountain dorm from ₹249 per bed with shared hot showers, Wi-Fi, bunk reading lights and a panoramic sunrise view — one of the most affordable stays in the Parvati Valley.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best scenic stay in Parvati Valley for couples?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Couples usually pick the Deluxe Balcony Room (₹1,499) with mountain-view windows and a scenic balcony, or the Deluxe Suite (₹1,199) — both with hot-water geysers, Wi-Fi and ensuite bathrooms, plus campfire evenings and guided ridge treks.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is food included in Himachal stays with Aanandham?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Stays include a welcome drink plus dinner and breakfast, along with a guided ridge trek and staff support. Campfire evenings with music are part of the mountain routine.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I reach Kalga and Kasol?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most travellers arrive via Bhuntar airport or overnight buses to Kasol from Delhi and Chandigarh, then take a local cab to Barshaini and walk the short pine-trail up to Kalga village at 7,900 FT.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the Manali–Spiti circuit open for booking yet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not yet — Manali ridge tents and Spiti cold-desert camps are being verified for heating, altitude safety and local crews. Join the WhatsApp waitlist on this page and you will be notified the day bookings open.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CampsDirectoryClient
        initialCamps={[]}
        initialRegion="Himachal"
        comingSoon={true}
        comingSoonRegion="Himachal"
        comingSoonTitle="The Nest Kalga is live — Manali & Spiti circuits launching soon."
        comingSoonSubtitle="Dorm beds from ₹249 and private rooms are bookable in Kalga–Kasol today. Manali ridge tents and Spiti cold-desert camps are being verified for heating, altitude safety and local crews — join the waitlist below."
        comingSoonPoints={['Dorms from ₹249 live', 'Balcony rooms live', 'Manali ridge tents soon', 'Spiti camps soon']}
        heroBadge="★ HIMACHAL HIMALAYAS · 1 LIVE BASECAMP"
        heroTitle={<>Himachal Stays: <span style={{ color: '#D5ED55' }}>Affordable Dorms & Scenic Mountain Stays</span></>}
        heroSubtitle="Parvati Valley pines at 7,900 FT — backpacker dorms, private balcony rooms and sunrise-view stays in Kalga–Kasol, with campfire dinners and guided treks. Manali & Spiti open soon."
        extraContent={<HimachalStayGuide />}
      />
    </>
  );
}
