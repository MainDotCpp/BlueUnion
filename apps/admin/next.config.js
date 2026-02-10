/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@blueunion/database', '@blueunion/shared-types'],
  experimental: {
    optimizePackageImports: ['antd'],
  },
  // Ant Design 优化
  modularizeImports: {
    antd: {
      transform: 'antd/lib/{{member}}',
    },
    '@ant-design/icons': {
      transform: '@ant-design/icons/{{member}}',
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  },
};

module.exports = nextConfig;
