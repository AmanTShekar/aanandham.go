import { INITIAL_ALL_CAMPS } from '@/lib/campsData';

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';
  const currentDate = new Date().toISOString();

  // Primary Money Pages & Core Landing Routes
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/camps`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/camps/munnar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/camps/vagamon`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/camps/wayanad`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic Campsite Detail Booking Pages (High Priority)
  const campRoutes = INITIAL_ALL_CAMPS.map((camp) => ({
    url: `${siteUrl}/camps/${camp.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Note: /login, /signup, /admin are omitted from sitemap to prevent crawl budget dilution
  return [...staticRoutes, ...campRoutes];
}
