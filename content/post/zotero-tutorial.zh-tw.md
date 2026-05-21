---
title: "Zotero 文獻管理入門：插件纔是本體"
description: "Zotero 安裝配置、文獻導入、堅果雲同步，以及 Better BibTeX、Translate、Style 等必備插件"
keywords: "zotero,文獻管理,論文,插件,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Zotero
  - 文獻管理
  - 論文
  - 教程
  - 小工具
---


Zotero 本體只是個文獻數據庫。真正讓它好用的是插件。這篇先講基本操作，重點講插件怎麼裝、哪些值得裝、怎麼配。

<!--more-->

## 安裝

```bash
# macOS
brew install --cask zotero

# Windows
winget install Zotero.Zotero

# 或直接官網下載: https://www.zotero.org/
```

同時裝瀏覽器擴展 **Zotero Connector**（Chrome / Firefox 都有），一鍵抓論文元數據和 PDF。

## 基礎操作

### 導入文獻

瀏覽器打開論文頁面（arXiv、IEEE、ACM、Google Scholar 等），點 Zotero Connector 圖標。條目 + PDF 一起保存到當前選中的分類裏。

本地 PDF 拖進 Zotero 窗口，右鍵 → 抓取元數據。大部分英文論文能自動識別。

### 組織

左側建文件夾分類。同一篇文獻可以屬於多個分類（Zotero 的"Collection"本質是標籤，不是目錄）。

### 引用

裝好 Zotero 後 Word 裏自動出現 Zotero 標籤頁。寫論文時：

```
光標放引用位置 → Add/Edit Citation → 搜論文標題 → 選格式 → 插入
```

寫完後 `Add/Edit Bibliography` 一鍵生成參考文獻列表。格式隨時切換（IEEE → APA → GB/T 7714）。

LaTeX 用戶裝 Better BibTeX 插件後導出 `.bib` 文件：

```
右鍵文獻 → Export Items → Better BibTeX → 生成 .bib
```

## 同步與存儲

Zotero 自帶 300MB 免費空間，存條目夠用，存 PDF 肯定不夠。

用堅果雲 WebDAV 同步 PDF：

1. 堅果雲 → 賬戶信息 → 第三方應用管理 → 添加應用（獲取 WebDAV 地址和密碼）
2. Zotero → 編輯 → 設置 → 同步 → 文件同步
3. 選 WebDAV，填 `https://dav.jianguoyun.com/dav/`、賬號、密碼

300MB Zotero 空間 + 堅果雲存儲 = 全平臺同步，手機也能看文獻。

## 插件 — 這纔是正文

插件安裝：Zotero → 工具 → 插件 → 右上角齒輪 → Install Plugin From File（下 `.xpi` 文件拖進去）。

### Better BibTeX

LaTeX 用戶必備。給每篇文獻生成穩定的引用 key（不隨條目修改而變），自動導出 `.bib`。

裝好後在 Zotero 首選項裏找到 Better BibTeX：

```
Citation Key 格式：auth.lower + year
例如：vaswani2017attention

導出：Preferences → Better BibTeX → Automatic Export
設置自動導出路徑，每次改文獻自動更新 .bib
```

### Zotero Translate

劃詞翻譯，支持 Google / DeepL / 彩雲 / DeepL 等十幾個引擎。讀英文論文時選中一段自動彈出翻譯。

裝好右鍵點 Translate 圖標，設置裏選 DeepL（免費額度夠用）。

### Jasminum（茉莉花）

中文文獻增強。自動抓取知網/萬方的中文元數據、拆分作者姓名、識別學位論文。

### Zotero Style

自定義顯示樣式。讓條目列表列數更多、字體更緊湊、期刊標籤着色。裝好去首選項調。

### ZotFile

重命名和移動 PDF 文件，支持提取 PDF 中的註釋。可以設規則讓所有 PDF 按 `作者_年份_標題.pdf` 自動改名。

### Zotero Tag

自動給文獻打標籤，方便按主題篩選。常和 Jasminum 一起用。

### GreenFrog / Zotero Night

深色模式。晚上看文獻眼睛舒服點。

### Plugin 安裝優先級

```
必裝：Better BibTeX, Zotero Translate, Jasminum
推薦：Zotero Style, ZotFile
選裝：Zotero Tag, Zotero Night
```

## 和 Obsidian 聯動

Obsidian → Community Plugins → 搜 Zotero Integration。

裝好後在筆記裏：

```
Ctrl+P → Zotero Integration: Insert Literature Note
搜論文標題 → 自動生成帶元數據和鏈接的筆記
```

## 速查

| 操作 | 方法 |
|------|------|
| 抓論文 | 瀏覽器 Zotero Connector 點擊圖標 |
| 中文文獻識別 | 裝 Jasminum 插件 |
| LaTeX bib 導出 | Better BibTeX → Export |
| PDF 同步 | 堅果雲 WebDAV |
| 劃詞翻譯 | Zotero Translate |
| Word 引用 | Zotero 標籤頁 → Add/Edit Citation |
| 深色模式 | GreenFrog 插件 |
