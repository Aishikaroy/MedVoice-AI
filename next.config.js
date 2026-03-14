/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── NOTE on output ────────────────────────────────────────────────────────
  // Do NOT set output:'standalone' when deploying to Vercel.
  // Vercel's build pipeline manages its own output packaging internally;
  // standalone mode causes the .next/standalone directory to be used instead
  // of .next, which prevents Vercel from detecting the build correctly.
  // output: 'standalone' ← intentionally omitted for Vercel

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    // Server Actions: required by @ai-sdk/react useChat and the /api/chat
    // route that calls the Groq/FastAPI backend.
    serverActions: {
      bodySizeLimit: '4mb',       // Handles large prescription image uploads
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        // Add your Vercel production URL once known, e.g.:
        // 'medvoice-ai.vercel.app',
      ],
    },
    // Note: turbo:{} (empty) was removed — it causes a deprecation warning
    // in Next.js 16 and has no effect. Turbopack is enabled via --turbopack
    // flag in the dev script if needed.
  },

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
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
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
  // Proxies /backend/* → FastAPI server so the real backend URL is never
  // exposed in the browser bundle, and solves CORS in production automatically.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  // ── Webpack ───────────────────────────────────────────────────────────────
  webpack: (config, { isServer }) => {
    // html2pdf.js uses browser-only APIs (canvas, window, document).
    // Exclude it from the server-side bundle to prevent SSR crashes on Vercel.
    if (isServer) {
      config.externals = [...(config.externals || []), 'html2pdf.js', 'canvas'];
    }
    return config;
  },
};

module.exports = nextConfig;
