# 路径工具使用指南

本文档说明如何在项目中正确使用路径工具函数来处理 GitHub Pages 部署时的资源路径问题。

## 问题背景

GitHub Pages 部署时，项目会部署在 `https://username.github.io/repository-name/` 路径下，而不是根路径。这意味着所有静态资源（图片、图标等）都需要添加 `/repository-name` 前缀才能正确访问。

## 解决方案

我们在 `src/utils/path.ts` 中提供了两个工具函数来统一处理这个问题：

### 1. `getBasePath()`

**用途**: 获取基础路径，主要用于构建时配置

**使用场景**:

- `next.config.ts` 中的 basePath 配置
- 构建时的静态配置

```typescript
import { getBasePath } from '@/utils/path';

const basePath = getBasePath();
// 开发环境: ''
// 生产环境: '/next-simple-compound'
```

**在 next.config.ts 中的使用**:

```typescript
import type { NextConfig } from 'next';
import { getBasePath } from './src/utils/path';

const basePath = getBasePath();

const nextConfig: NextConfig = {
  basePath: basePath,
  // ... 其他配置
};

export default nextConfig;
```

### 2. `getAssetPath(path)`

**用途**: 获取完整的资源路径，主要用于构建时的静态资源

**使用场景**:

- `layout.tsx` 中的 favicon 配置
- `manifest.ts` 中的图标路径
- 其他构建时确定的静态资源路径

```typescript
import { getAssetPath } from '@/utils/path';

// 在 layout.tsx 中
export const metadata: Metadata = {
  icons: {
    icon: getAssetPath('/images/favicon/favicon.ico'),
  },
};

// 在 manifest.ts 中
export default function manifest() {
  return {
    icons: [
      {
        src: getAssetPath('/images/favicon/web-app-manifest-192x192.png'),
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
```

### 3. 客户端组件中的资源路径（也使用 `getAssetPath()`）

```typescript
'use client';

import { getAssetPath } from '@/utils/path';

export default function MyComponent() {
  return (
    <img src={getAssetPath('/images/photo.jpg')} alt="照片" />
  );
}
```

## 使用规则

### ✅ 正确使用

1. **Next.js 配置** → 使用 `getBasePath()`

   ```typescript
   // next.config.ts
   import { getBasePath } from './src/utils/path';
   const basePath = getBasePath();
   ```

2. **构建时静态资源** → 使用 `getAssetPath()`

   ```typescript
   // layout.tsx, manifest.ts 等
   icon: getAssetPath('/images/favicon.ico');
   ```

3. **客户端组件中的资源** → 使用 `getAssetPath()`
   ```typescript
   // 'use client' 组件中
   const imageSrc = getAssetPath('/images/photo.jpg');
   ```

### ❌ 错误使用

1. **不要硬编码路径**

   ```typescript
   // ❌ 错误
   const imageSrc = '/next-simple-compound/images/photo.jpg';

   // ✅ 正确
   const imageSrc = getAssetPath('/images/photo.jpg');
   ```

2. **不要手写 basePath 前缀拼接**

   ```typescript
   // ❌ 错误
   const basePath = '/next-simple-compound';
   const imageSrc = `${basePath}/images/photo.jpg`;

   // ✅ 正确
   const imageSrc = getAssetPath('/images/photo.jpg');
   ```

3. **不要在 next.config.ts 中重复定义 basePath 逻辑**

   ```typescript
   // ❌ 错误 - 重复逻辑
   const isProduction = process.env.NODE_ENV === 'production';
   const basePath = isProduction ? '/next-simple-compound' : '';

   // ✅ 正确 - 使用统一函数
   import { getBasePath } from './src/utils/path';
   const basePath = getBasePath();
   ```

## 开发测试

开发环境下 `getBasePath()` 返回 `''`，`getAssetPath('/x')` 直接返回 `/x`。
生产环境会自动返回 `'/next-simple-compound'` 并正确拼接，无需设置环境变量或修改代码。

## 部署验证

使用提供的部署脚本验证构建结果：

```bash
./scripts/deploy.sh
```

脚本会自动检查：

- 构建是否成功
- 关键文件是否存在
- 图片路径是否配置正确

## 文件使用总览

| 文件                     | 使用的函数       | 说明                      |
| ------------------------ | ---------------- | ------------------------- |
| `next.config.ts`         | `getBasePath()`  | Next.js 配置中的 basePath |
| `src/app/layout.tsx`     | `getAssetPath()` | favicon 等静态资源        |
| `src/app/manifest.ts`    | `getAssetPath()` | PWA 图标等静态资源        |
| `src/app/about/page.tsx` | `getAssetPath()` | 客户端组件中的图片与资源  |

## 常见问题

### Q: 为什么需要两个不同的函数？

A:

- `getBasePath()`: 用于配置文件，提供基础路径
- `getAssetPath()`: 用于客户端/服务端构建与运行阶段的资源路径拼接，统一处理 basePath 前缀

### Q: 如何添加新的静态资源？

A: 将资源放在 `public/` 目录下，然后统一使用：

- 使用 `getAssetPath('/path/to/resource')`

### Q: 如何修改仓库名？

A: 在 `src/utils/path.ts` 的 `getBasePath()` 函数中修改返回值即可。建议从 `package.json` 中读取仓库名以保持一致性。

### Q: 为什么 next.config.ts 不能使用路径别名 @/utils/path？

A: `next.config.ts` 是 Next.js 的配置文件，在构建系统初始化之前就会被加载，此时路径别名还没有生效，所以需要使用相对路径 `./src/utils/path`。
