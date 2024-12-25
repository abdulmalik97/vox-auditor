import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vox/prescription-requests',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
