/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      'wordpress.laceandblades.co.uk',
      'avatars.githubusercontent.com',
      'repository-images.githubusercontent.com',
      'opengraph.githubassets.com'
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  
  // 🚀 FIX: Prevent Vercel's multi-threaded chmod race condition on static pages
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}