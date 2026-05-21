---
title: "Building a Personal Blog from Scratch: Hugo + GitHub Pages Complete Guide"
description: "Step-by-step guide to building a free personal blog with Hugo and GitHub Pages — from installation to publishing in just 30 minutes"
keywords: "hugo,github pages,blog setup,static site,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Blog
  - Hugo
  - Tutorial
  - Mini Tools
---

## Why Hugo + GitHub Pages

| Solution | Cost | Speed | Freedom |
|----------|------|-------|---------|
| Zhihu / CSDN | Free | Fast | Low (ads, restrictions) |
| WordPress Hosted | ~$50/mo | Medium | Medium |
| Hexo + GitHub Pages | Free | Fast | High |
| **Hugo + GitHub Pages** | Free | Extremely Fast | High |

Hugo is the fastest static site generator — it compiles 5000 articles in 2 seconds. GitHub Pages provides free hosting with unlimited traffic.

<!--more-->

## Step 1: Install Hugo

```bash
# Windows (winget or scoop recommended)
winget install Hugo.Hugo.Extended
# or scoop install hugo-extended

# macOS
brew install hugo

# Linux
sudo apt install hugo

# Verify installation
hugo version
```

Make sure to install the **extended** version (includes SCSS compilation), otherwise some themes may throw errors.

## Step 2: Create a Site

```bash
# Create the blog
hugo new site myblog
cd myblog

# Initialize git
git init
```

Directory structure:

```
myblog/
├── archetypes/  # article templates
├── content/     # article content (core directory)
├── data/        # data files
├── layouts/     # page templates (to override themes)
├── static/      # static assets (images/CSS)
├── themes/      # themes
└── hugo.toml    # site configuration
```

## Step 3: Install a Theme

Using the `hugo-theme-reimu` theme used by this site as an example:

```bash
git submodule add https://github.com/D-Sketon/hugo-theme-reimu.git themes/hugo-theme-reimu

# Set the theme in hugo.toml
echo 'theme = "hugo-theme-reimu"' >> hugo.toml
```

Other great theme recommendations:
- **PaperMod** — Minimal, fast, feature-rich
- **Stack** — Card-based layout, great for image-rich blogs
- **LoveIt** — Feature-rich, Chinese-friendly

Browse 300+ themes at [themes.gohugo.io](https://themes.gohugo.io/).

## Step 4: Write Your First Post

```bash
hugo new post/my-first-post.md
```

Edit `content/post/my-first-post.md`:

```yaml
---
title: "My First Post"
date: 2026-05-19
tags: ["Essay"]
---
Hello, this is my blog!
```

```bash
# Local preview
hugo server -D

# Open http://localhost:1313
```

The browser auto-refreshes every time you save a file.

## Step 5: Deploy to GitHub Pages

### 5.1 Create a Repository

Create a public repository on GitHub named `your-username.github.io`.

### 5.2 Configure GitHub Actions

Create `.github/workflows/deploy.yml`:

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

### 5.3 Push and Enable Pages

```bash
git add .
git commit -m "init: blog initialization"
git remote add origin https://github.com/username/username.github.io.git
git push -u origin main
```

Then in the GitHub repository, go to **Settings → Pages** and set Source to `GitHub Actions`.

Wait for the Action to finish, then visit `https://username.github.io` to see your blog.

## Step 6: Configuration and Customization

Edit `hugo.toml`:

```toml
baseURL = "https://username.github.io/"
languageCode = "zh-CN"
title = "My Blog"
theme = "hugo-theme-reimu"

[params]
  author = "Your Name"
  description = "Documenting learning and thoughts"
  avatar = "avatar.webp"           # place in static/
```

Place the avatar at `static/avatar.webp` and the favicon at `static/favicon.ico`.

## Advanced Configuration

```bash
# Custom domain
# 1. Create a CNAME file in static/, write your domain
# 2. Add a CNAME record in DNS pointing to username.github.io

# Add comments (Giscus example)
# 1. Enable the Discussions feature in your repository
# 2. Go to giscus.app to generate the config
# 3. Configure according to theme documentation

# Custom CSS
# Create custom.css in assets/css/extended/
```

## Daily Writing Workflow

```bash
# 1. Create a new post
hugo new post/new-post.md

# 2. Edit content/post/new-post.md

# 3. Local preview
hugo server -D

# 4. Commit when satisfied
git add content/post/new-post.md
git commit -m "docs: new post"
git push

# 5. GitHub Actions auto-deploys, live within 2 minutes
```

## Migrating Existing Content

| Source | Tool |
|--------|------|
| Hexo | `hexo-migrator` → copy Markdown directly |
| WordPress | Export XML → `wordpress-to-hugo-exporter` |
| Zhihu / CSDN | Manually copy Markdown (not recommended to rely on platforms) |
| Jekyll | Migrate `.md` files directly |

## Summary

| Step | Time | Key Action |
|------|------|------------|
| Install Hugo | 2 min | `brew install hugo` |
| Create Site | 1 min | `hugo new site` |
| Install Theme | 2 min | `git submodule add` |
| Write First Post | 5 min | `hugo new` + edit |
| Deploy | 5 min | GitHub Actions configuration |
| **Total** | **~15 min** | Blog is live |

After that, each writing session takes just 3 steps: `hugo new` → write → `git push`.
