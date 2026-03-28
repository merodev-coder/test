/** @type {import('next').NextConfig} */
const nextConfig = {
    // API rewrites to backend
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:4029/api/:path*',
            },
        ];
    },
    
    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 86400, // 24 hours
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                port: "",
                pathname: "/f/**",
            },
            {
                protocol: "https",
                hostname: "*.ufs.sh",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "img.rocket.new",
            },
        ],
    },
    
    // Compression
    compress: true,
    
    // Experimental features
    experimental: {
        optimizePackageImports: ['framer-motion', '@heroicons/react', 'recharts'],
    },
    
    // Headers for caching
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, stale-while-revalidate=300',
                    },
                ],
            },
            {
                source: '/:all*(svg|jpg|png|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;