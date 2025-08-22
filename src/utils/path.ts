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
