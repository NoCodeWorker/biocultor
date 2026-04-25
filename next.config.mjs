/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'],
  },
}

export default nextConfig
