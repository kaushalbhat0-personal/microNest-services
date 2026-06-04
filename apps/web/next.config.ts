import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@micronest/config',
    '@micronest/auth',
    '@micronest/db',
    '@micronest/ui',
  ],
}

export default nextConfig
