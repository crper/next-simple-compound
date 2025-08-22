import type { NextConfig } from 'next';
import { getBasePath } from './src/utils/path';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = getBasePath();

const nextConfig: NextConfig = {
  /* config options here */
  ...(isProduction
    ? {
        output: 'export',
        images: {
          unoptimized: true,
        },
      }
    : {}),
  basePath: basePath,
  // 确保禁用 trailingSlash，避免 GitHub Pages 路由问题
  trailingSlash: false,
  eslint: {
    // 忽略生产构建中的错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 同样忽略生产构建中的错误
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
