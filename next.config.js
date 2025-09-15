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
    domains: [
      'images.unsplash.com', 
      'images.pexels.com',
      'akazuba-backend-api.onrender.com',
      'localhost:5000'
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: true, // Allow static images to be served directly
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@headlessui/react', '@heroicons/react', 'lucide-react'],
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
  // Memory optimization
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Environment variables configuration
  env: {
    // Override API URL for development - matches your backend configuration
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1' 
      : 'https://akazuba-backend-api.onrender.com/api/v1',
    // JWT Secret for development and production (matches your backend)
    JWT_SECRET: process.env.JWT_SECRET || '27f74d4094e2f4d8676cdabb12a17548181fa19903624a53f640ce08d5f50665'
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
    
    // Optimize for memory usage - simplified configuration
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: -10,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    }
    
    // Reduce memory usage during development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    
    return config
  },
}

module.exports = nextConfig 