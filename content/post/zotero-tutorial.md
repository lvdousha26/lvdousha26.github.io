---
title: "Zotero 文献管理入门：插件才是本体"
description: "Zotero 安装配置、文献导入、坚果云同步，以及 Better BibTeX、Translate、Style 等必备插件"
keywords: "zotero,文献管理,论文,插件,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Zotero
  - 文献管理
  - 论文
  - 教程
  - 小工具
---

Zotero 本体只是个文献数据库。真正让它好用的是插件。这篇先讲基本操作，重点讲插件怎么装、哪些值得装、怎么配。

<!--more-->

## 安装

```bash
# macOS
brew install --cask zotero

# Windows
winget install Zotero.Zotero

# 或直接官网下载: https://www.zotero.org/
```

同时装浏览器扩展 **Zotero Connector**（Chrome / Firefox 都有），一键抓论文元数据和 PDF。

## 基础操作

### 导入文献

浏览器打开论文页面（arXiv、IEEE、ACM、Google Scholar 等），点 Zotero Connector 图标。条目 + PDF 一起保存到当前选中的分类里。

本地 PDF 拖进 Zotero 窗口，右键 → 抓取元数据。大部分英文论文能自动识别。

### 组织

左侧建文件夹分类。同一篇文献可以属于多个分类（Zotero 的"Collection"本质是标签，不是目录）。

### 引用

装好 Zotero 后 Word 里自动出现 Zotero 标签页。写论文时：

```
光标放引用位置 → Add/Edit Citation → 搜论文标题 → 选格式 → 插入
```

写完后 `Add/Edit Bibliography` 一键生成参考文献列表。格式随时切换（IEEE → APA → GB/T 7714）。

LaTeX 用户装 Better BibTeX 插件后导出 `.bib` 文件：

```
右键文献 → Export Items → Better BibTeX → 生成 .bib
```

## 同步与存储

Zotero 自带 300MB 免费空间，存条目够用，存 PDF 肯定不够。

用坚果云 WebDAV 同步 PDF：

1. 坚果云 → 账户信息 → 第三方应用管理 → 添加应用（获取 WebDAV 地址和密码）
2. Zotero → 编辑 → 设置 → 同步 → 文件同步
3. 选 WebDAV，填 `https://dav.jianguoyun.com/dav/`、账号、密码

300MB Zotero 空间 + 坚果云存储 = 全平台同步，手机也能看文献。

## 插件 — 这才是正文

插件安装：Zotero → 工具 → 插件 → 右上角齿轮 → Install Plugin From File（下 `.xpi` 文件拖进去）。

### Better BibTeX

LaTeX 用户必备。给每篇文献生成稳定的引用 key（不随条目修改而变），自动导出 `.bib`。

装好后在 Zotero 首选项里找到 Better BibTeX：

```
Citation Key 格式：auth.lower + year
例如：vaswani2017attention

导出：Preferences → Better BibTeX → Automatic Export
设置自动导出路径，每次改文献自动更新 .bib
```

### Zotero Translate

划词翻译，支持 Google / DeepL / 彩云 / DeepL 等十几个引擎。读英文论文时选中一段自动弹出翻译。

装好右键点 Translate 图标，设置里选 DeepL（免费额度够用）。

### Jasminum（茉莉花）

中文文献增强。自动抓取知网/万方的中文元数据、拆分作者姓名、识别学位论文。

### Zotero Style

自定义显示样式。让条目列表列数更多、字体更紧凑、期刊标签着色。装好去首选项调。

### ZotFile

重命名和移动 PDF 文件，支持提取 PDF 中的注释。可以设规则让所有 PDF 按 `作者_年份_标题.pdf` 自动改名。

### Zotero Tag

自动给文献打标签，方便按主题筛选。常和 Jasminum 一起用。

### GreenFrog / Zotero Night

深色模式。晚上看文献眼睛舒服点。

### Plugin 安装优先级

```
必装：Better BibTeX, Zotero Translate, Jasminum
推荐：Zotero Style, ZotFile
选装：Zotero Tag, Zotero Night
```

## 和 Obsidian 联动

Obsidian → Community Plugins → 搜 Zotero Integration。

装好后在笔记里：

```
Ctrl+P → Zotero Integration: Insert Literature Note
搜论文标题 → 自动生成带元数据和链接的笔记
```

## 速查

| 操作 | 方法 |
|------|------|
| 抓论文 | 浏览器 Zotero Connector 点击图标 |
| 中文文献识别 | 装 Jasminum 插件 |
| LaTeX bib 导出 | Better BibTeX → Export |
| PDF 同步 | 坚果云 WebDAV |
| 划词翻译 | Zotero Translate |
| Word 引用 | Zotero 标签页 → Add/Edit Citation |
| 深色模式 | GreenFrog 插件 |
