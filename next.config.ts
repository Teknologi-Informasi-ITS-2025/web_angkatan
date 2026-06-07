import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 220, 256, 320, 384, 440, 514],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.terminaltrove.com',
        pathname: '/m/**'
      }
    ]
  }
}

export default nextConfig
