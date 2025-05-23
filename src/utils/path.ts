/**
 * 路径工具函数
 * 用于处理 GitHub Pages 部署时的 basePath 问题
 *
 * GitHub Pages 部署时，项目会部署在 https://username.github.io/repository-name/ 路径下，
 * 因此所有静态资源都需要添加 /repository-name 前缀才能正确访问。
 *
 * 使用示例：
 * - 开发环境: getAssetPath('/images/logo.png') -> '/images/logo.png'
 * - 生产环境: getAssetPath('/images/logo.png') -> '/next-simple-compound/images/logo.png'
 */

/**
 * 获取 basePath
 * 在生产环境下返回仓库名作为 basePath，开发环境返回空字符串
 *
 * 这个函数主要用于构建时的静态资源路径处理，如 manifest.ts 和 layout.tsx
 *
 * @returns basePath 字符串
 */
export function getBasePath(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? '/next-simple-compound' : '';
}

/**
 * 获取带有 basePath 的资源路径
 *
 * 主要用于构建时的静态资源路径处理，会根据环境自动添加正确的前缀
 *
 * @param path 相对路径（以 / 开头）
 * @returns 完整的资源路径
 *
 * @example
 * // 开发环境
 * getAssetPath('/images/favicon.ico') // -> '/images/favicon.ico'
 *
 * // 生产环境
 * getAssetPath('/images/favicon.ico') // -> '/next-simple-compound/images/favicon.ico'
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();

  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}

/**
 * 获取运行时 basePath（用于客户端组件）
 *
 * 这个函数专门为客户端组件设计，会优先使用环境变量，
 * 这样可以在开发时通过 .env.local 文件进行测试
 *
 * 优先级：
 * 1. 客户端环境变量 NEXT_PUBLIC_BASE_PATH
 * 2. 构建时配置 getBasePath()
 *
 * @returns basePath 字符串
 *
 * @example
 * // 在客户端组件中使用
 * const basePath = getRuntimeBasePath();
 * const imageSrc = `${basePath}/images/photo.jpg`;
 */
export function getRuntimeBasePath(): string {
  // 在客户端运行时，优先使用环境变量
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_PATH || getBasePath();
  }

  // 在服务端构建时，直接使用构建时配置
  return getBasePath();
}
