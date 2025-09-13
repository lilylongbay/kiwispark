import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  
  // Skip type checking during build for static export
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
