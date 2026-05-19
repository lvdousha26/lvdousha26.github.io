---
title: "LaTeX 从入门到熟练：学术排版实用指南"
description: "面向初学者的 LaTeX 实用教程，覆盖基础语法、数学公式、图片表格和模板使用"
keywords: "latex,排版,论文,数学公式,教程"

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

## 为什么要学 LaTeX

写论文、课程报告、简历时，Word 排版令人头疼——图片乱跑、公式难看、格式不一致。LaTeX 让你**专注内容，排版交给引擎**，输出的 PDF 是专业出版级别。

<!--more-->

## 安装

推荐 **TeX Live**（跨平台完整发行版），不要装基本版（缺包时会很痛苦）。

```bash
# Windows: 下载 TeX Live 安装器
# https://tug.org/texlive/

# macOS
brew install --cask mactex

# Linux
sudo apt install texlive-full
```

在线编辑器推荐 [Overleaf](https://www.overleaf.com/)，免安装、协作方便，适合初学者。

## 第一个文档

```latex
\documentclass{article}
\usepackage[UTF8]{ctex}   % 中文支持

\title{我的第一份文档}
\author{绿豆沙}
\date{\today}

\begin{document}
\maketitle

\section{引言}
这是第一段内容。

\section{正文}
Hello \LaTeX！

\end{document}
```

编译：`xelatex main.tex`（中文推荐 xelatex）。

## 基础结构

```latex
% 文档类：article / report / book / beamer(幻灯片)
\documentclass[a4paper,12pt]{article}

% 导言区：加载宏包、设置排版参数
\usepackage[UTF8]{ctex}          % 中文
\usepackage{amsmath,amssymb}     % 数学
\usepackage{graphicx}            % 图片
\usepackage{hyperref}            % 超链接
\usepackage{geometry}            % 页面边距
\geometry{margin=2.5cm}

\begin{document}
% 正文内容在这里
\end{document}
```

## 数学公式

LaTeX 最大优势：数学公式精确美观。

```latex
% 行内公式
$a^2 + b^2 = c^2$

% 独立公式（无编号）
\[
e^{i\pi} + 1 = 0
\]

% 带编号公式
\begin{equation}
\int_0^\infty \frac{\sin x}{x} dx = \frac{\pi}{2}
\end{equation}

% 多行对齐
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}

% 矩阵
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

% 分段函数
f(x) = \begin{cases}
1, & x > 0 \\
0, & x = 0 \\
-1, & x < 0
\end{cases}
```

常用符号速查：

| 代码 | 效果 |
|------|------|
| `\alpha \beta \gamma` | α β γ |
| `\sum_{i=1}^n` | ∑ⁿᵢ₌₁ |
| `\lim_{x\to\infty}` | limₓ→∞ |
| `\frac{a}{b}` | a/b |
| `\sqrt{x}` | √x |
| `\leq \geq \neq` | ≤ ≥ ≠ |
| `\in \subset \forall \exists` | ∈ ⊂ ∀ ∃ |

## 图片

```latex
\usepackage{graphicx}

\begin{figure}[htbp]          % h=here t=top b=bottom p=page
\centering
\includegraphics[width=0.6\textwidth]{image.png}
\caption{图片标题}
\label{fig:myimage}
\end{figure}
```

引用图片：`如图 \ref{fig:myimage} 所示`。

## 表格

```latex
\begin{table}[htbp]
\centering
\begin{tabular}{|c|l|r|}
\hline
序号 & 名称 & 数值 \\
\hline
1 & Alpha & 100 \\
2 & Beta  & 200 \\
\hline
\end{tabular}
\caption{表格示例}
\label{tab:example}
\end{table}
```

`|c|l|r|` 表示 3 列，分别居中、左对齐、右对齐，带竖线。嫌手写表格麻烦可以用 [Tables Generator](https://www.tablesgenerator.com/) 生成。

## 引用与参考文献

```latex
% 使用 BibTeX
\bibliographystyle{plain}
\bibliography{references}   % references.bib 文件

% 引用
正如文献 \cite{key} 所述...
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

Google Scholar / DBLP 提供各论文的 BibTeX 导出，直接复制即可。

## 常用模板

| 场景 | 推荐 |
|------|------|
| 中文论文 | `ctexart` 文档类 |
| 英文论文 | `article` + 期刊模板 |
| 学位论文 | 学校提供的 `.cls` 模板 |
| 幻灯片 | `beamer` 文档类 |
| 简历 | `moderncv` 宏包 |
| 伪代码 | `algorithm2e` + `algpseudocode` |

## Overleaf 工作流

1. 注册 https://www.overleaf.com
2. 新建项目 → 选模板或空项目
3. 在线编辑，实时预览
4. 协作：分享链接，多人同时编辑
5. 导出 PDF

Overleaf 是入门最快的方式，省去本地安装的麻烦。语法熟练后再转向本地 TeX Live 即可。

## 调试技巧

```latex
% 常见错误：
! Undefined control sequence.    → 命令拼错了或没加载对应宏包
! Missing $ inserted.            → 在普通文本中用了数学符号，加 $...$
! File `xxx.sty' not found.      → 缺宏包，tlmgr install xxx
```

- 报错先看第一个错误，后面的往往是连锁反应
- 大段添加后编译，不要堆到最后才点编译
- Overleaf 默认自动编译，能更快发现错误

## 总结

| 阶段 | 建议 |
|------|------|
| 入门 | 用 Overleaf，免安装，实时预览 |
| 进阶 | 本地装 TeX Live，用 VS Code + LaTeX Workshop 插件 |
| 高效 | 收集常用模板，用 snippets 补全公式 |
| 协作 | Overleaf Share + Git 同步 |

LaTeX 学习曲线前陡后缓。前两周会觉得麻烦，之后写公式的速度远超 Word 公式编辑器，且输出质量无可替代。
