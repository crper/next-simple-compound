#!/bin/bash

# GitHub Pages 部署脚本
# 确保在生产环境下正确构建和部署

echo "🚀 开始构建 GitHub Pages..."

# 设置生产环境变量
export NODE_ENV=production

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf out
rm -rf .next

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查构建结果
if [ -d "out" ]; then
    echo "✅ 构建成功！"
    echo "📁 输出目录: out/"

    # 检查关键文件
    if [ -f "out/index.html" ]; then
        echo "✅ 首页文件存在"
    fi

    if [ -f "out/about.html" ]; then
        echo "✅ 关于页面存在"
    fi

    if [ -d "out/images" ]; then
        echo "✅ 图片资源目录存在"
    fi

    # 检查图片路径
    echo "🔍 检查图片路径..."
    if grep -q "/next-simple-compound/images" out/about.html; then
        echo "✅ 图片路径配置正确"
    else
        echo "❌ 图片路径配置可能有问题"
    fi

    echo "🎉 部署准备完成！"
    echo "📝 请将 out/ 目录的内容部署到 GitHub Pages"

else
    echo "❌ 构建失败！"
    exit 1
fi