import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vox/activity-log',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
