import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '**.medium.com' },
      { protocol: 'https', hostname: '**.substack.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
