export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aanandham.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/login', '/signup'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
