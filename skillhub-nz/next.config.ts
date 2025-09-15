import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Remove static export to enable server runtime (API routes, middleware)
  // trailingSlash can be kept or removed as needed; keeping default behavior
  
  // Image settings
  images: {
    // Use Next image optimizer in server runtime; do not force unoptimized
    unoptimized: false,
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

  // Fix packages importing `node:process` by providing browser polyfill
  webpack: (config) => {
    // Lazy import to avoid TypeScript resolution at build-time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ProvidePlugin } = require('webpack')
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'node:process': 'process/browser',
    }
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      process: require.resolve('process/browser'),
    }
    config.plugins = config.plugins || []
    config.plugins.push(new ProvidePlugin({ process: 'process/browser' }))
    return config
  },
}

export default nextConfig
