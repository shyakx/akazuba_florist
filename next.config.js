/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force all pages to be dynamic to avoid SSR issues
  trailingSlash: true,
  generateEtags: false,
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'akazuba-production-assets.s3.us-east-1.amazonaws.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Allow static images to be served directly
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react', 'lucide-react'],
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
  },
  // Disable static optimization to avoid SSR issues
  // Suppress dynamic route warnings during build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 1, // Reduced from 2
  },
  // Ensure static assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Reduce memory usage
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Environment variables configuration
  env: {
    // Override API URL for development
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1' 
      : 'https://akazuba-backend-api.onrender.com/api/v1'
  },
  webpack: (config, { dev, isServer }) => {
    // Fix SSR issues - simplify configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }
    
    // Disable problematic optimizations for now
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
    }
    
    return config
  },
}

module.exports = nextConfig 