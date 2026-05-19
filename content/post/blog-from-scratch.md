---
title: "从零搭建个人博客：Hugo + GitHub Pages 完整指南"
description: "手把手教你用 Hugo 和 GitHub Pages 免费搭建个人博客，从安装到发布只需 30 分钟"
keywords: "hugo,github pages,博客搭建,静态网站,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - 博客
  - Hugo
  - 教程
  - 小工具
---

## 为什么选 Hugo + GitHub Pages

| 方案 | 成本 | 速度 | 自由度 |
|------|------|------|--------|
| 知乎/CSDN | 免费 | 快 | 低（广告、限制） |
| WordPress 托管 | ~50/月 | 中 | 中 |
| Hexo + GitHub Pages | 免费 | 快 | 高 |
| **Hugo + GitHub Pages** | 免费 | 极快 | 高 |

Hugo 是目前最快的静态站点生成器，2 秒编译 5000 篇文章。GitHub Pages 提供免费无限流量托管。

<!--more-->

## 第一步：安装 Hugo

```bash
# Windows (推荐用 winget 或 scoop)
winget install Hugo.Hugo.Extended
# 或 scoop install hugo-extended

# macOS
brew install hugo

# Linux
sudo apt install hugo

# 验证安装
hugo version
```

注意装 **extended** 版（含 SCSS 编译），否则有些主题会报错。

## 第二步：创建站点

```bash
# 创建博客
hugo new site myblog
cd myblog

# 初始化 git
git init
```

目录结构：

```
myblog/
├── archetypes/  # 文章模板
├── content/     # 文章内容（核心目录）
├── data/        # 数据文件
├── layouts/     # 页面模板（覆盖主题用）
├── static/      # 静态资源（图片/CSS）
├── themes/      # 主题
└── hugo.toml    # 站点配置
```

## 第三步：安装主题

以本站使用的 `hugo-theme-reimu` 为例：

```bash
git submodule add https://github.com/D-Sketon/hugo-theme-reimu.git themes/hugo-theme-reimu

# 在 hugo.toml 中设置主题
echo 'theme = "hugo-theme-reimu"' >> hugo.toml
```

其他优秀主题推荐：
- **PaperMod** — 极简、快速、功能全
- **Stack** — 卡片式布局，适合图文博客
- **LoveIt** — 功能丰富，中文友好

在 [themes.gohugo.io](https://themes.gohugo.io/) 上可以浏览 300+ 主题。

## 第四步：写第一篇文章

```bash
hugo new post/my-first-post.md
```

编辑 `content/post/my-first-post.md`：

```yaml
---
title: "我的第一篇文章"
date: 2026-05-19
tags: ["随笔"]
---
Hello, 这是我的博客！
```

```bash
# 本地预览
hugo server -D

# 打开 http://localhost:1313
```

每保存一次文件，浏览器自动刷新。

## 第五步：部署到 GitHub Pages

### 5.1 创建仓库

在 GitHub 创建名为 `你的用户名.github.io` 的公开仓库。

### 5.2 配置 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive

      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### 5.3 推送并启用 Pages

```bash
git add .
git commit -m "init: 博客初始化"
git remote add origin https://github.com/用户名/用户名.github.io.git
git push -u origin main
```

然后在 GitHub 仓库 **Settings → Pages** 中，Source 选 `GitHub Actions`。

等待 Action 运行完成，访问 `https://用户名.github.io` 即可看到博客。

## 第六步：配置与美化

编辑 `hugo.toml`：

```toml
baseURL = "https://用户名.github.io/"
languageCode = "zh-CN"
title = "我的博客"
theme = "hugo-theme-reimu"

[params]
  author = "你的名字"
  description = "记录学习和思考"
  avatar = "avatar.webp"           # 放在 static/ 下
```

头像放在 `static/avatar.webp`，favicon 放在 `static/favicon.ico`。

## 进阶配置

```bash
# 自定义域名
# 1. 在 static/ 下创建 CNAME 文件，写入你的域名
# 2. 在 DNS 添加 CNAME 记录指向 用户名.github.io

# 添加评论（以 Giscus 为例）
# 1. 开启仓库的 Discussions 功能
# 2. 去 giscus.app 生成配置
# 3. 按主题文档配置

# 自定义 CSS
# 在 assets/css/extended/ 下创建 custom.css
```

## 日常写作流程

```bash
# 1. 新建文章
hugo new post/new-post.md

# 2. 编辑 content/post/new-post.md

# 3. 本地预览
hugo server -D

# 4. 满意后提交
git add content/post/new-post.md
git commit -m "docs: 新文章"
git push

# 5. GitHub Actions 自动部署，2 分钟内上线
```

## 迁移现有内容

| 来源 | 工具 |
|------|------|
| Hexo | `hexo-migrator` → Markdown 直接复制 |
| WordPress | 导出 XML → `wordpress-to-hugo-exporter` |
| 知乎/CSDN | 手动复制 Markdown（不推荐依赖平台） |
| Jekyll | `.md` 文件直接迁移 |

## 总结

| 步骤 | 耗时 | 关键操作 |
|------|------|----------|
| 安装 Hugo | 2 min | `brew install hugo` |
| 创建站点 | 1 min | `hugo new site` |
| 装主题 | 2 min | `git submodule add` |
| 写第一篇文章 | 5 min | `hugo new` + 编辑 |
| 部署 | 5 min | GitHub Actions 配置 |
| **总计** | **~15 min** | 博客上线 |

之后每次写作只需 3 步：`hugo new` → 写 → `git push`。
