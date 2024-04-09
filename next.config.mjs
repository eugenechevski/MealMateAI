/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
<<<<<<< HEAD
  },
=======
    outputFileTracingExcludes: {
      '/test': ['./src/app/test/**'],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  }
>>>>>>> upstream/main
};

export default nextConfig;
