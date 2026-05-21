---
title: "從零搭建個人博客：Hugo + GitHub Pages 完整指南"
description: "手把手教你用 Hugo 和 GitHub Pages 免費搭建個人博客，從安裝到發佈只需 30 分鐘"
keywords: "hugo,github pages,博客搭建,靜態網站,教程"

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


## 爲什麼選 Hugo + GitHub Pages

| 方案 | 成本 | 速度 | 自由度 |
|------|------|------|--------|
| 知乎/CSDN | 免費 | 快 | 低（廣告、限制） |
| WordPress 託管 | ~50/月 | 中 | 中 |
| Hexo + GitHub Pages | 免費 | 快 | 高 |
| **Hugo + GitHub Pages** | 免費 | 極快 | 高 |

Hugo 是目前最快的靜態站點生成器，2 秒編譯 5000 篇文章。GitHub Pages 提供免費無限流量託管。

<!--more-->

## 第一步：安裝 Hugo

```bash
# Windows (推薦用 winget 或 scoop)
winget install Hugo.Hugo.Extended
# 或 scoop install hugo-extended

# macOS
brew install hugo

# Linux
sudo apt install hugo

# 驗證安裝
hugo version
```

注意裝 **extended** 版（含 SCSS 編譯），否則有些主題會報錯。

## 第二步：創建站點

```bash
# 創建博客
hugo new site myblog
cd myblog

# 初始化 git
git init
```

目錄結構：

```
myblog/
├── archetypes/  # 文章模板
├── content/     # 文章內容（核心目錄）
├── data/        # 數據文件
├── layouts/     # 頁面模板（覆蓋主題用）
├── static/      # 靜態資源（圖片/CSS）
├── themes/      # 主題
└── hugo.toml    # 站點配置
```

## 第三步：安裝主題

以本站使用的 `hugo-theme-reimu` 爲例：

```bash
git submodule add https://github.com/D-Sketon/hugo-theme-reimu.git themes/hugo-theme-reimu

# 在 hugo.toml 中設置主題
echo 'theme = "hugo-theme-reimu"' >> hugo.toml
```

其他優秀主題推薦：
- **PaperMod** — 極簡、快速、功能全
- **Stack** — 卡片式佈局，適合圖文博客
- **LoveIt** — 功能豐富，中文友好

在 [themes.gohugo.io](https://themes.gohugo.io/) 上可以瀏覽 300+ 主題。

## 第四步：寫第一篇文章

```bash
hugo new post/my-first-post.md
```

編輯 `content/post/my-first-post.md`：

```yaml
---
title: "我的第一篇文章"
date: 2026-05-19
tags: ["隨筆"]
---
Hello, 這是我的博客！
```

```bash
# 本地預覽
hugo server -D

# 打開 http://localhost:1313
```

每保存一次文件，瀏覽器自動刷新。

## 第五步：部署到 GitHub Pages

### 5.1 創建倉庫

在 GitHub 創建名爲 `你的用戶名.github.io` 的公開倉庫。

### 5.2 配置 GitHub Actions

創建 `.github/workflows/deploy.yml`：

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

### 5.3 推送並啓用 Pages

```bash
git add .
git commit -m "init: 博客初始化"
git remote add origin https://github.com/用戶名/用戶名.github.io.git
git push -u origin main
```

然後在 GitHub 倉庫 **Settings → Pages** 中，Source 選 `GitHub Actions`。

等待 Action 運行完成，訪問 `https://用戶名.github.io` 即可看到博客。

## 第六步：配置與美化

編輯 `hugo.toml`：

```toml
baseURL = "https://用戶名.github.io/"
languageCode = "zh-CN"
title = "我的博客"
theme = "hugo-theme-reimu"

[params]
  author = "你的名字"
  description = "記錄學習和思考"
  avatar = "avatar.webp"           # 放在 static/ 下
```

頭像放在 `static/avatar.webp`，favicon 放在 `static/favicon.ico`。

## 進階配置

```bash
# 自定義域名
# 1. 在 static/ 下創建 CNAME 文件，寫入你的域名
# 2. 在 DNS 添加 CNAME 記錄指向 用戶名.github.io

# 添加評論（以 Giscus 爲例）
# 1. 開啓倉庫的 Discussions 功能
# 2. 去 giscus.app 生成配置
# 3. 按主題文檔配置

# 自定義 CSS
# 在 assets/css/extended/ 下創建 custom.css
```

## 日常寫作流程

```bash
# 1. 新建文章
hugo new post/new-post.md

# 2. 編輯 content/post/new-post.md

# 3. 本地預覽
hugo server -D

# 4. 滿意後提交
git add content/post/new-post.md
git commit -m "docs: 新文章"
git push

# 5. GitHub Actions 自動部署，2 分鐘內上線
```

## 遷移現有內容

| 來源 | 工具 |
|------|------|
| Hexo | `hexo-migrator` → Markdown 直接複製 |
| WordPress | 導出 XML → `wordpress-to-hugo-exporter` |
| 知乎/CSDN | 手動複製 Markdown（不推薦依賴平臺） |
| Jekyll | `.md` 文件直接遷移 |

## 總結

| 步驟 | 耗時 | 關鍵操作 |
|------|------|----------|
| 安裝 Hugo | 2 min | `brew install hugo` |
| 創建站點 | 1 min | `hugo new site` |
| 裝主題 | 2 min | `git submodule add` |
| 寫第一篇文章 | 5 min | `hugo new` + 編輯 |
| 部署 | 5 min | GitHub Actions 配置 |
| **總計** | **~15 min** | 博客上線 |

之後每次寫作只需 3 步：`hugo new` → 寫 → `git push`。
