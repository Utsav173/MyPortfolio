import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add your image CDN hostnames here if you use external images for projects
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.example.com',
      // },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // For the placeholder images in ProjectCard
      },
    ],
  },
};

export default nextConfig;
