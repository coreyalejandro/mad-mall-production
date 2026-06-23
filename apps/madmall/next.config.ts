import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/safety-layer'],
}

export default nextConfig

// Made with Bob
