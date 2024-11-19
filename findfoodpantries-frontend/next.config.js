/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hackercrunch-demo.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/*',
      },
    ],
    domains: ['upload.wikimedia.org', 'cdn.dribbble.com', 'www.insightintodiversity.com'],
  },
}

module.exports = nextConfig
