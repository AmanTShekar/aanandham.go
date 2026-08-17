/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;",
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://*.supabase.co https://aanandham.in https://*.aanandham.in;",
      "font-src 'self' data: https://cdnjs.cloudflare.com;",
      "connect-src 'self' https://*.supabase.co;",
      "frame-ancestors 'none';",
      "form-action 'self' https://wa.me https://api.whatsapp.com;",
      "base-uri 'self';",
      "object-src 'none';",
    ].join(' ').replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async redirects() {
    return [
      {
        source: '/experiences',
        destination: '/camps',
        permanent: true,
      },
      {
        source: '/hotels',
        destination: '/camps',
        permanent: true,
      },
      {
        source: '/places',
        destination: '/camps',
        permanent: true,
      },
      {
        source: '/stories/munnar-tent-stay',
        destination: '/camps/pkg-suryanelli',
        permanent: true,
      },
      {
        source: '/stories/vagamon-glamping',
        destination: '/camps/pkg-vagamon-glamp',
        permanent: true,
      },
      {
        source: '/stories/wayanad-camping-guide',
        destination: '/camps/pkg-wayanad-forest',
        permanent: true,
      },
      {
        source: '/stories/strangers-camp',
        destination: '/camps/pkg-meesapulimala',
        permanent: true,
      },
      {
        source: '/stories/solo-trekking-safety',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/stories',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/stories/:slug*',
        destination: '/camps',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers across all application routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
