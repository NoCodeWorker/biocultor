/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', 'radix-ui'],
  },

  async headers() {
    const oneYear = 60 * 60 * 24 * 365;
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2|woff|ttf|otf|eot|mp3)',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${oneYear}, immutable` },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${oneYear}, immutable` },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${oneYear}, immutable` },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
}

export default nextConfig
