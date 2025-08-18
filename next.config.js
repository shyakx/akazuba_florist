/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
}

module.exports = nextConfig 