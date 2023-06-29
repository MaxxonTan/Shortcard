/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // Added because 50mb serverless function limit is exceeded on vercel.
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
