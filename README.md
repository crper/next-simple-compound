# Compound+ 复利计算器

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/crper/next-simple-compound?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/crper/next-simple-compound?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/crper/next-simple-compound?style=flat-square)
![GitHub license](https://img.shields.io/github/license/crper/next-simple-compound?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15+-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19+-blue?style=flat-square)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5-blue?style=flat-square)

</div>

<p align="center">一款现代化的复利计算工具，帮助您直观了解复利的力量，为长期财务目标制定明智的计划。</p>

## 🌟 功能特色

### 多功能计算模式

- 🔢 **终值计算** - 计算投资最终价值
- 💰 **本金计算** - 计算达到目标金额所需本金
- ⏱️ **期数计算** - 计算达到目标金额所需时间
- 📈 **利率计算** - 计算达到目标金额所需年利率
- 💸 **通货膨胀影响** - 计算考虑通货膨胀因素后投资的实际购买力

### 数据可视化

- 📊 **交互式图表** - 直观展示复利增长趋势
- 📑 **数据表格** - 详细展示每期投资数据

### 用户体验

- 🌓 **深色/浅色主题** - 支持自动和手动切换主题
- 📱 **响应式设计** - 完美适配各种设备尺寸
- ⚡ **实时计算** - 参数变化时自动更新结果

## 效果演示
https://github.com/user-attachments/assets/b2c4b683-df02-463a-9082-3148fd3f49a0




## 🚀 快速开始

### 开发环境要求

- **Node.js**: v18.20.0 或更高版本
- **PNPM**: v10.11.0 或更高版本（项目使用 PNPM 作为包管理器）

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn
```

### 开发模式

```bash
# 使用 Turbopack 加速开发
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 启动生产服务

```bash
pnpm start
```

## 🛠️ 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) - React 框架，支持 SSR/SSG，使用 App Router
- **UI 库**: [Ant Design 5](https://ant.design/) - 企业级 UI 设计语言和组件库
- **图表**: [Recharts](https://recharts.org/) - 基于 React 的可组合图表库
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **状态管理**: React Hooks + Context API
- **开发工具**: [Turbopack](https://turbo.build/pack) - 高性能构建工具，加速开发体验
- **类型安全**: [TypeScript 5](https://www.typescriptlang.org/) - 提供类型检查和更好的开发体验

## 📁 项目结构

```
.
├── src/
│   ├── app/                # 应用路由 (Next.js App Router)
│   │   ├── page.tsx        # 首页
│   │   ├── about/          # 关于页面
│   │   ├── provider/       # 全局提供者
│   │   └── layout.tsx      # 全局布局
│   ├── components/         # 组件目录
│   │   └── calculator/     # 计算器组件
│   │       ├── components/ # 子组件
│   │       ├── hooks/      # 自定义钩子
│   │       ├── types/      # 类型定义
│   │       ├── utils/      # 工具函数
│   │       └── constants/  # 常量定义
│   └── types/              # 全局类型定义
├── public/                 # 静态资源
└── README.md               # 项目文档
```

## 📊 复利计算公式

复利计算器支持以下公式：

### 终值计算 (Future Value)

计算投资在特定时间段后的价值。

```
FV = P × (1 + r)^t + PMT × [(1 + r)^t - 1] / r
```

其中：

- FV = 终值
- P = 本金
- r = 每期利率
- t = 期数
- PMT = 每期追加投资

### 本金计算 (Principal)

计算达到目标金额所需的初始投资金额。

```
P = FV / (1 + r)^t - PMT × [(1 + r)^t - 1] / [r × (1 + r)^t]
```

### 期数计算 (Periods)

计算达到目标金额所需的时间期数。

```
t = log(FV × r / PMT + 1) / log(1 + r)
```

(当无追加投资时: t = log(FV/P) / log(1+r))

### 利率计算 (Rate)

计算达到目标金额所需的利率。对于无额外投资的情况，使用以下公式：

```
r = (FV/P)^(1/n) - 1
```

当有追加投资时，使用二分法求解以下方程：

```
P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r = FV
```

### 通货膨胀影响计算

计算考虑通货膨胀因素后投资的实际购买力。

**名义终值计算**：

```
名义终值 = P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r
```

**实际终值计算**：

```
实际终值 = 名义终值 / (1 + i)^n
```

其中，i为通货膨胀率。

## 💻 计算精度与实现细节

### 精确计算

- 使用 `Decimal.js` 库进行高精度计算，避免JavaScript浮点数精度问题
- 所有计算公式封装在独立的数学模块中，确保计算一致性和可靠性
- 核心计算逻辑基于金融数学原理，配合数值计算方法处理更复杂的情况

### 期数单位转换

复利计算器支持多种期数单位:

- 年（默认）
- 半年
- 季度
- 月
- 周
- 日

系统会根据所选单位自动将年利率转换为对应期数的利率，确保计算结果准确。例如，如果选择"月"作为期数单位，则年利率12%会转换为月利率1%进行计算。

### 计算模式详情

- **终值计算**: 根据初始投资、利率和时间计算最终金额
- **本金计算**: 根据目标金额、利率和时间计算所需初始投资
- **期数计算**: 根据初始投资、目标金额和利率计算所需投资时间
- **利率计算**: 根据初始投资、目标金额和投资时间计算所需年化收益率
- **通货膨胀影响**: 分析通货膨胀对投资实际购买力的影响，包括名义终值与实际终值对比

## 🚀 部署指南

### GitHub Pages 部署

项目已配置为可以轻松部署到 GitHub Pages：

1. 设置 GitHub 仓库
2. 启用 GitHub Actions 工作流
3. 推送代码到 main 分支，自动触发部署流程

### 其他云平台

项目也可以部署到 Vercel、Netlify 等平台，只需连接 Git 仓库并按照平台指引操作即可。

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范

- 代码格式化: 项目使用 ESLint 和 Prettier 进行代码规范检查和格式化
- 提交信息: 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 测试: 添加相应的单元测试和集成测试
- 文档: 为新功能或变更添加适当的文档

## 📦 GitHub Pages 部署

本项目已配置为支持 GitHub Pages 部署。部署时会自动处理资源路径问题。

### 自动部署（推荐）

项目已配置 GitHub Actions，推送到 `main` 分支时会自动部署到 GitHub Pages。

### 手动部署

如果需要手动部署，可以使用提供的部署脚本：

```bash
# 运行部署脚本
./scripts/deploy.sh
```

部署脚本会：

1. 清理之前的构建文件
2. 安装依赖
3. 构建生产版本
4. 验证构建结果
5. 检查资源路径配置

构建完成后，将 `out/` 目录的内容部署到 GitHub Pages 即可。

### 路径配置说明

项目使用了智能路径配置来解决 GitHub Pages 的 basePath 问题：

- **开发环境**: 资源路径为 `/images/...`
- **生产环境**: 资源路径自动添加仓库名前缀 `/next-simple-compound/images/...`

这确保了在 GitHub Pages 上的资源能够正确加载。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 💖 支持项目

如果这个项目对您有帮助，请考虑：

- ⭐ 在 GitHub 上给项目点星
- 🐞 报告发现的问题
- 🔀 提交改进的 PR
- 📢 向他人推荐这个项目

## 📧 联系方式

有问题或建议？请通过 GitHub Issues 或以下方式联系我们：

- 邮箱: crper@outlook.com
- GitHub: [@crper](https://github.com/crper)

---

<p align="center">用 ❤️ 开发，为财务自由助力</p>
