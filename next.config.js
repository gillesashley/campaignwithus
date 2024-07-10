'use strict'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: true,

  images: {
    domains: [
      'localhost:5000',
      'localhost:3000',
      'campaignwithus.com',
      'campaignwithus.vercel.app',
      'res.cloudinary.com'
    ],
    unoptimized: true
  },

  // Add environment variables
  env: {
    API_URL: process.env.NEXT_PUBLIC_BASE_API_URL
  }
}

module.exports = nextConfig
