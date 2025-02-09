import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'geo-static.traxsource.com',
                pathname: '/**', // Allows all paths
            },
            {
                protocol: 'https',
                hostname: 'daily.jstor.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'encrypted-tbn0.gstatic.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
