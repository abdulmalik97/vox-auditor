import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/activity-log',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
