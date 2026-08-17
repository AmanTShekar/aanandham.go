export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aanandham.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/api/', '/login', '/signup', '/pass/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: ['/', '/camps', '/camps/*', '/about', '/contact', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/api/', '/login', '/signup', '/pass/'],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
