/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: ['img.clerk.com'],
    }
};

export default nextConfig;
