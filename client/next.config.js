/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [{ hostname: "lh3.googleusercontent.com" }],
  },
};

module.exports = nextConfig;
