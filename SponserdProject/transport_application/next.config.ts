import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hankunfluid.oss-us-west-1.aliyuncs.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
