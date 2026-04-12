/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["baaindustries.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
