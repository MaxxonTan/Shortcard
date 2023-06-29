/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    outputFileTracingExcludes: {
      "*": ["node_modules/canvas"],
    },
    outputFileTracingIgnores: ["**canvas**"],
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
};

module.exports = nextConfig;
