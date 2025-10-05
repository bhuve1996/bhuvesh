import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],

  // Handle forwarded headers from Railway/Vercel
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: 'bhuvesh.com,www.bhuvesh.com,bhuvesh.vercel.app',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
