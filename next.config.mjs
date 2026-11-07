/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', 'gsap'],
  async rewrites() {
    const backendUrl = process.env.SURAKSHA_BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/v1/flood/:path*',
        destination: `${backendUrl}/api/v1/flood/:path*`,
      },
    ];
  },
};

export default nextConfig;

