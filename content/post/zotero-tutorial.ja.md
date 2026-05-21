---
title: "Zotero文献管理入門：プラグインこそが本体"
description: "Zoteroのインストール設定、文献のインポート、坚果雲（Jianguoyun）同期、およびBetter BibTeX、Translate、Styleなどの必須プラグイン"
keywords: "zotero,文献管理,論文,プラグイン,チュートリアル"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Zotero
  - 文献管理
  - 論文
  - チュートリアル
  - ツール
---

Zotero自体はあくまで文献データベースにすぎません。本当に便利に使うにはプラグインが鍵です。この記事では基本操作を説明しつつ、プラグインのインストール方法、おすすめのプラグイン、設定方法を重点的に解説します。

<!--more-->

## インストール

```bash
# macOS
brew install --cask zotero

# Windows
winget install Zotero.Zotero

# 或直接官网下载: https://www.zotero.org/
```

ブラウザ拡張機能の**Zotero Connector**（Chrome / Firefox対応）も一緒にインストールしましょう。ワンクリックで論文のメタデータとPDFを取得できます。

## 基本操作

### 文献のインポート

ブラウザで論文ページ（arXiv、IEEE、ACM、Google Scholarなど）を開き、Zotero Connectorのアイコンをクリックします。文献情報とPDFが現在選択中のコレクションに一緒に保存されます。

ローカルのPDFをZoteroウィンドウにドラッグ＆ドロップし、右クリック → メタデータを取得を選択します。ほとんどの英論文は自動認識されます。

### 整理

左側でフォルダ（コレクション）を作成して分類します。同じ文献を複数のコレクションに所属させることができます（Zoteroの「コレクション」は本質的にはタグであり、ディレクトリではありません）。

### 引用

Zoteroをインストールすると、WordにZoteroタブが自動表示されます。論文執筆時：

```
光标放引用位置 → Add/Edit Citation → 搜论文标题 → 选格式 → 插入
```

書き終えたら`Add/Edit Bibliography`でワンクリック参考文献リストを生成。形式はいつでも切り替え可能です（IEEE → APA → GB/T 7714）。

LaTeXユーザーはBetter BibTeXプラグインをインストールして`.bib`ファイルをエクスポート：

```
右键文献 → Export Items → Better BibTeX → 生成 .bib
```

## 同期とストレージ

Zoteroには300MBの無料ストレージが付属しています。文献情報の保存には十分ですが、PDFを保存するには明らかに足りません。

坚果雲（Jianguoyun）のWebDAVを使ってPDFを同期：

1. 坚果雲 → アカウント情報 → サードパーティアプリ管理 → アプリ追加（WebDAVアドレスとパスワードを取得）
2. Zotero → 編集 → 設定 → 同期 → ファイル同期
3. WebDAVを選択し、`https://dav.jianguoyun.com/dav/`、アカウント、パスワードを入力

300MBのZoteroストレージ + 坚果雲ストレージ = 全プラットフォームで同期され、スマートフォンでも文献を読めます。

## プラグイン — 本題はこちら

プラグインのインストール：Zotero → ツール → アドオン → 右上の歯車アイコン → Install Plugin From File（`.xpi`ファイルをダウンロードしてドラッグ＆ドロップ）。

### Better BibTeX

LaTeXユーザー必須。各文献に安定した引用キーを生成し（項目の変更に影響されない）、`.bib`を自動エクスポートします。

インストール後、Zoteroの環境設定でBetter BibTeXを見つけます：

```
Citation Key 格式：auth.lower + year
例如：vaswani2017attention

导出：Preferences → Better BibTeX → Automatic Export
设置自动导出路径，每次改文献自动更新 .bib
```

### Zotero Translate

テキスト選択翻訳機能。Google / DeepL / 彩雲 / DeepLなど十数種類のエンジンをサポート。英論文を読む際にテキストを選択すると自動で翻訳がポップアップ表示されます。

インストール後、右クリックでTranslateアイコンをクリック。設定でDeepLを選択（無料枠で十分）。

### Jasminum（ジャスミン）

中国語文献を強化。知網（CNKI）/万方（Wanfang）から中国語メタデータを自動取得、著者名の分割、学位論文の認識を行います。

### Zotero Style

表示スタイルをカスタマイズ。アイテムリストの列数を増やしたり、フォントをコンパクトにしたり、論文誌タグに色を付けたりできます。インストール後、環境設定で調整します。

### ZotFile

PDFファイルのリネームと移動を行い、PDF内の注釈抽出をサポート。ルールを設定して全PDFを`作者_年份_标题.pdf`の形式に自動リネームできます。

### Zotero Tag

文献に自動でタグを付け、テーマ別のフィルタリングを容易にします。Jasminumと一緒に使われることが多いです。

### GreenFrog / Zotero Night

ダークモード。夜に文献を読む際に目に優しいです。

### プラグイン導入優先度

```
必装：Better BibTeX, Zotero Translate, Jasminum
推荐：Zotero Style, ZotFile
选装：Zotero Tag, Zotero Night
```

## Obsidianとの連携

Obsidian → Community Plugins → Zotero Integrationを検索。

インストール後、ノート内で：

```
Ctrl+P → Zotero Integration: Insert Literature Note
搜论文标题 → 自动生成带元数据和链接的笔记
```

## クイックリファレンス

| 操作 | 方法 |
|------|------|
| 論文の取得 | ブラウザでZotero Connectorのアイコンをクリック |
| 中国語文献の認識 | Jasminumプラグインをインストール |
| LaTeX bib出力 | Better BibTeX → Export |
| PDF同期 | 坚果雲 WebDAV |
| テキスト翻訳 | Zotero Translate |
| Word引用 | Zoteroタブ → Add/Edit Citation |
| ダークモード | GreenFrogプラグイン |
