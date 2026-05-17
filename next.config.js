/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wordpress.laceandblades.co.uk' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'repository-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' }
    ],
  },
  
  // 🚀 FIX: In modern Next.js versions, the worker override belongs directly 
  // at the root config level, or via strict build worker management
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig