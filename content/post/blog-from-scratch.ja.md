---
title: "ゼロから作る個人ブログ：Hugo + GitHub Pages 完全ガイド"
description: "HugoとGitHub Pagesを使って個人ブログを無料で構築する方法をステップバイステップで解説。インストールから公開までわずか30分"
keywords: "hugo,github pages,ブログ構築,静的サイト,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - ブログ
  - Hugo
  - チュートリアル
  - ツール
---

## なぜHugo + GitHub Pagesなのか

| 方式 | コスト | 速度 | 自由度 |
|------|--------|------|--------|
| 知乎/CSDN | 無料 | 速い | 低い（広告、制限あり） |
| WordPress ホスティング | 約50/月 | 中 | 中 |
| Hexo + GitHub Pages | 無料 | 速い | 高い |
| **Hugo + GitHub Pages** | 無料 | 極速 | 高い |

Hugoは現在最速の静的サイトジェネレーターで、5000記事を2秒でコンパイルします。GitHub Pagesは無料で無制限のトラフィックを提供します。

<!--more-->

## 第一步：Hugoのインストール

```bash
# Windows (wingetまたはscoop推奨)
winget install Hugo.Hugo.Extended
# または scoop install hugo-extended

# macOS
brew install hugo

# Linux
sudo apt install hugo

# インストール確認
hugo version
```

**extended**版（SCSSコンパイル対応）をインストールしてください。そうしないと一部のテーマでエラーが発生します。

## 第二步：サイトの作成

```bash
# ブログを作成
hugo new site myblog
cd myblog

# gitを初期化
git init
```

ディレクトリ構成：

```
myblog/
├── archetypes/  # 記事テンプレート
├── content/     # 記事コンテンツ（核となるディレクトリ）
├── data/        # データファイル
├── layouts/     # ページテンプレート（テーマの上書き用）
├── static/      # 静的リソース（画像/CSS）
├── themes/      # テーマ
└── hugo.toml    # サイト設定
```

## 第三步：テーマのインストール

このサイトで使用している `hugo-theme-reimu` の場合：

```bash
git submodule add https://github.com/D-Sketon/hugo-theme-reimu.git themes/hugo-theme-reimu

# hugo.toml にテーマを設定
echo 'theme = "hugo-theme-reimu"' >> hugo.toml
```

その他のおすすめテーマ：
- **PaperMod** — ミニマル、高速、多機能
- **Stack** — カード型レイアウト、画像中心のブログに最適
- **LoveIt** — 多機能、日本語対応も良好

[themes.gohugo.io](https://themes.gohugo.io/) では300以上のテーマを閲覧できます。

## 第四步：最初の記事を書く

```bash
hugo new post/my-first-post.md
```

`content/post/my-first-post.md` を編集：

```yaml
---
title: "初めての記事"
date: 2026-05-19
tags: ["エッセイ"]
---
こんにちは、これは私のブログです！
```

```bash
# ローカルでプレビュー
hugo server -D

# http://localhost:1313 を開く
```

ファイルを保存するたびにブラウザが自動更新されます。

## 第五步：GitHub Pagesにデプロイ

### 5.1 リポジトリの作成

GitHubで `あなたのユーザー名.github.io` という名前の公開リポジトリを作成します。

### 5.2 GitHub Actionsの設定

`.github/workflows/deploy.yml` を作成：

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

### 5.3 プッシュしてPagesを有効化

```bash
git add .
git commit -m "init: ブログ初期化"
git remote add origin https://github.com/ユーザー名/ユーザー名.github.io.git
git push -u origin main
```

その後、GitHubリポジトリの **Settings → Pages** で、Sourceを `GitHub Actions` に選択します。

Actionの実行が完了するのを待ち、`https://ユーザー名.github.io` にアクセスするとブログが表示されます。

## 第六步：設定とカスタマイズ

`hugo.toml` を編集：

```toml
baseURL = "https://ユーザー名.github.io/"
languageCode = "ja-JP"
title = "私のブログ"
theme = "hugo-theme-reimu"

[params]
  author = "あなたの名前"
  description = "学びと思考の記録"
  avatar = "avatar.webp"           # static/ 配下に配置
```

アバターは `static/avatar.webp`、faviconは `static/favicon.ico` に配置します。

## 発展的な設定

```bash
# カスタムドメイン
# 1. static/ 配下に CNAME ファイルを作成し、ドメインを記述
# 2. DNSにCNAMEレコードを追加し、ユーザー名.github.io を指す

# コメント機能の追加（Giscusの場合）
# 1. リポジトリのDiscussions機能を有効化
# 2. giscus.app で設定を生成
# 3. テーマのドキュメントに従って設定

# カスタムCSS
# assets/css/extended/ 配下に custom.css を作成
```

## 日常の執筆フロー

```bash
# 1. 新規記事を作成
hugo new post/new-post.md

# 2. content/post/new-post.md を編集

# 3. ローカルでプレビュー
hugo server -D

# 4. 納得したらコミット
git add content/post/new-post.md
git commit -m "docs: 新規記事"
git push

# 5. GitHub Actionsが自動デプロイ、2分以内に公開
```

## 既存コンテンツの移行

| 移行元 | ツール |
|--------|--------|
| Hexo | `hexo-migrator` → Markdownを直接コピー |
| WordPress | XMLをエクスポート → `wordpress-to-hugo-exporter` |
| 知乎/CSDN | Markdownを手動コピー（プラットフォームへの依存は非推奨） |
| Jekyll | `.md` ファイルをそのまま移行 |

## まとめ

| ステップ | 所要時間 | キー操作 |
|----------|----------|----------|
| Hugoのインストール | 2分 | `brew install hugo` |
| サイト作成 | 1分 | `hugo new site` |
| テーマ設定 | 2分 | `git submodule add` |
| 最初の記事執筆 | 5分 | `hugo new` + 編集 |
| デプロイ | 5分 | GitHub Actionsの設定 |
| **合計** | **約15分** | ブログ公開完了 |

以降、執筆はたった3ステップ：`hugo new` → 書く → `git push`。
