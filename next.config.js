/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [{ hostname: "lh3.googleusercontent.com" }],
  },
  webpack: (config) => {
    config.externals.push({
      canvas: "commonjs canvas",
    });
    return config;
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/canvas"],
  },
};

module.exports = nextConfig;
