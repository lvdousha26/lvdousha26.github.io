---
title: "LaTeX 從入門到熟練：學術排版實用指南"
description: "面向初學者的 LaTeX 實用教程，覆蓋基礎語法、數學公式、圖片表格和模板使用"
keywords: "latex,排版,論文,數學公式,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - LaTeX
  - 教程
  - 小工具
---


## 爲什麼要學 LaTeX

寫論文、課程報告、簡歷時，Word 排版令人頭疼——圖片亂跑、公式難看、格式不一致。LaTeX 讓你**專注內容，排版交給引擎**，輸出的 PDF 是專業出版級別。

<!--more-->

## 安裝

推薦 **TeX Live**（跨平臺完整發行版），不要裝基本版（缺包時會很痛苦）。

```bash
# Windows: 下載 TeX Live 安裝器
# https://tug.org/texlive/

# macOS
brew install --cask mactex

# Linux
sudo apt install texlive-full
```

在線編輯器推薦 [Overleaf](https://www.overleaf.com/)，免安裝、協作方便，適合初學者。

## 第一個文檔

```latex
\documentclass{article}
\usepackage[UTF8]{ctex}   % 中文支持

\title{我的第一份文檔}
\author{綠豆沙}
\date{\today}

\begin{document}
\maketitle

\section{引言}
這是第一段內容。

\section{正文}
Hello \LaTeX！

\end{document}
```

編譯：`xelatex main.tex`（中文推薦 xelatex）。

## 基礎結構

```latex
% 文檔類：article / report / book / beamer(幻燈片)
\documentclass[a4paper,12pt]{article}

% 導言區：加載宏包、設置排版參數
\usepackage[UTF8]{ctex}          % 中文
\usepackage{amsmath,amssymb}     % 數學
\usepackage{graphicx}            % 圖片
\usepackage{hyperref}            % 超鏈接
\usepackage{geometry}            % 頁面邊距
\geometry{margin=2.5cm}

\begin{document}
% 正文內容在這裏
\end{document}
```

## 數學公式

LaTeX 最大優勢：數學公式精確美觀。

```latex
% 行內公式
$a^2 + b^2 = c^2$

% 獨立公式（無編號）
\[
e^{i\pi} + 1 = 0
\]

% 帶編號公式
\begin{equation}
\int_0^\infty \frac{\sin x}{x} dx = \frac{\pi}{2}
\end{equation}

% 多行對齊
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}

% 矩陣
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

% 分段函數
f(x) = \begin{cases}
1, & x > 0 \\
0, & x = 0 \\
-1, & x < 0
\end{cases}
```

常用符號速查：

| 代碼 | 效果 |
|------|------|
| `\alpha \beta \gamma` | α β γ |
| `\sum_{i=1}^n` | ∑ⁿᵢ₌₁ |
| `\lim_{x\to\infty}` | limₓ→∞ |
| `\frac{a}{b}` | a/b |
| `\sqrt{x}` | √x |
| `\leq \geq \neq` | ≤ ≥ ≠ |
| `\in \subset \forall \exists` | ∈ ⊂ ∀ ∃ |

## 圖片

```latex
\usepackage{graphicx}

\begin{figure}[htbp]          % h=here t=top b=bottom p=page
\centering
\includegraphics[width=0.6\textwidth]{image.png}
\caption{圖片標題}
\label{fig:myimage}
\end{figure}
```

引用圖片：`如圖 \ref{fig:myimage} 所示`。

## 表格

```latex
\begin{table}[htbp]
\centering
\begin{tabular}{|c|l|r|}
\hline
序號 & 名稱 & 數值 \\
\hline
1 & Alpha & 100 \\
2 & Beta  & 200 \\
\hline
\end{tabular}
\caption{表格示例}
\label{tab:example}
\end{table}
```

`|c|l|r|` 表示 3 列，分別居中、左對齊、右對齊，帶豎線。嫌手寫表格麻煩可以用 [Tables Generator](https://www.tablesgenerator.com/) 生成。

## 引用與參考文獻

```latex
% 使用 BibTeX
\bibliographystyle{plain}
\bibliography{references}   % references.bib 文件

% 引用
正如文獻 \cite{key} 所述...
```

`references.bib` 格式：

```bibtex
@article{key,
  author  = {Author Name},
  title   = {Paper Title},
  journal = {Journal Name},
  year    = {2024},
}
```

Google Scholar / DBLP 提供各論文的 BibTeX 導出，直接複製即可。

## 常用模板

| 場景 | 推薦 |
|------|------|
| 中文論文 | `ctexart` 文檔類 |
| 英文論文 | `article` + 期刊模板 |
| 學位論文 | 學校提供的 `.cls` 模板 |
| 幻燈片 | `beamer` 文檔類 |
| 簡歷 | `moderncv` 宏包 |
| 僞代碼 | `algorithm2e` + `algpseudocode` |

## Overleaf 工作流

1. 註冊 https://www.overleaf.com
2. 新建項目 → 選模板或空項目
3. 在線編輯，實時預覽
4. 協作：分享鏈接，多人同時編輯
5. 導出 PDF

Overleaf 是入門最快的方式，省去本地安裝的麻煩。語法熟練後再轉向本地 TeX Live 即可。

## 調試技巧

```latex
% 常見錯誤：
! Undefined control sequence.    → 命令拼錯了或沒加載對應宏包
! Missing $ inserted.            → 在普通文本中用了數學符號，加 $...$
! File `xxx.sty' not found.      → 缺宏包，tlmgr install xxx
```

- 報錯先看第一個錯誤，後面的往往是連鎖反應
- 大段添加後編譯，不要堆到最後才點編譯
- Overleaf 默認自動編譯，能更快發現錯誤

## 總結

| 階段 | 建議 |
|------|------|
| 入門 | 用 Overleaf，免安裝，實時預覽 |
| 進階 | 本地裝 TeX Live，用 VS Code + LaTeX Workshop 插件 |
| 高效 | 收集常用模板，用 snippets 補全公式 |
| 協作 | Overleaf Share + Git 同步 |

LaTeX 學習曲線前陡後緩。前兩週會覺得麻煩，之後寫公式的速度遠超 Word 公式編輯器，且輸出質量無可替代。
