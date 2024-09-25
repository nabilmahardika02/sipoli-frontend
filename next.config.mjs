/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mui/x-charts"],
  images: {
    domains: [],
    unoptimized: true,
  },
};

export default nextConfig;
