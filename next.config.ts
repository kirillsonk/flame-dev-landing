import type { NextConfig } from 'next';

const sitesExport = process.env.FLAME_SITES_EXPORT === '1';
// Сборка для Docker (Timeweb App Platform): самодостаточный сервер в .next/standalone
const standalone = process.env.NEXT_STANDALONE === '1';

const nextConfig: NextConfig = {
  output: sitesExport ? 'export' : standalone ? 'standalone' : undefined,
  images: { unoptimized: sitesExport, localPatterns: [{ pathname: '/videos/**' }, { pathname: '/cases/**' }, { pathname: '/logos/**' }, { pathname: '/brands/**', search: '' }] },
  transpilePackages: ['three'],
  async headers() {
    if (sitesExport) return [];
    return [
      {
        source: '/:path*.(woff2|png|jpg|jpeg|webp|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=31536000' }],
      },
      {
        source: '/:path*.(mp4|webm)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
};

export default nextConfig;
