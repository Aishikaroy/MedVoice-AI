/** @type {import('next').NextConfig} */
const nextConfig = {



  // No conflicting experimental flags — Turbopack handles optimizations natively.
  // optimizePackageImports is NOT needed with Turbopack and causes cache lock conflicts.


  // Force custom webpack settings only for the client and only if not using Turbopack
/*
  webpack: (config, context) => {
    if (!process.env.TURBOPACK) {
      const { isServer } = context;
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        };
      }
    }
    return config;
  },
*/

  // ── Server Actions (Stable in Next.js 16 — NOT inside experimental) ───────
  // bodySizeLimit covers prescription image uploads; allowedOrigins prevents
  // CSRF on Server Action endpoints from untrusted origins.
  serverExternalPackages: ['html2pdf.js', 'canvas'],

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ── Security Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co " +
                (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'),
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin',      value: '*' },
          { key: 'Access-Control-Allow-Methods',     value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers',     value: 'Content-Type, Authorization, x-conversation-id' },
        ],
      },
    ];
  },

  // ── Backend Proxy Rewrites ─────────────────────────────────────────────────
  // Proxies /backend/* → FastAPI so the real backend URL is never exposed in
  // the browser bundle and CORS is solved automatically in production.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
