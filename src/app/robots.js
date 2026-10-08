export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aanandham.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/admin/*', '/cms', '/cms/*', '/api/', '/login', '/signup', '/pass/', '/marshal', '/marshal/*', '/checkin', '/checkin/*'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: ['/', '/camps', '/camps/*', '/about', '/contact', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/admin/*', '/cms', '/cms/*', '/api/', '/login', '/signup', '/pass/', '/marshal', '/marshal/*', '/checkin', '/checkin/*'],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
