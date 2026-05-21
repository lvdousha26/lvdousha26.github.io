---
title: "LaTeX from Beginner to Proficient: A Practical Guide for Academic Typesetting"
description: "A beginner-friendly LaTeX tutorial covering basic syntax, math formulas, images, tables, and templates"
keywords: "latex,typesetting,paper,math formulas,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - LaTeX
  - Tutorial
  - Tools
---

## Why Learn LaTeX

When writing papers, course reports, or resumes, Word typesetting can be a headache — images drift around, equations look ugly, formatting is inconsistent. LaTeX lets you **focus on content while the engine handles the layout**, producing publication-quality PDF output.

<!--more-->

## Installation

Go with **TeX Live** (full cross-platform distribution). Don't install the basic version — you'll regret it when packages are missing.

```bash
# Windows: Download the TeX Live installer
# https://tug.org/texlive/

# macOS
brew install --cask mactex

# Linux
sudo apt install texlive-full
```

For an online editor, try [Overleaf](https://www.overleaf.com/). No installation needed, great for collaboration, and beginner-friendly.

## Your First Document

```latex
\documentclass{article}
\usepackage[UTF8]{ctex}   % Chinese support

\title{My First Document}
\author{Mung Bean Paste}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
This is the first paragraph.

\section{Main Content}
Hello \LaTeX！

\end{document}
```

Compile with: `xelatex main.tex` (recommended for Chinese).

## Basic Structure

```latex
% Document classes: article / report / book / beamer (slides)
\documentclass[a4paper,12pt]{article}

% Preamble: load packages, set formatting parameters
\usepackage[UTF8]{ctex}          % Chinese
\usepackage{amsmath,amssymb}     % Math
\usepackage{graphicx}            % Images
\usepackage{hyperref}            % Hyperlinks
\usepackage{geometry}            % Page margins
\geometry{margin=2.5cm}

\begin{document}
% Body content goes here
\end{document}
```

## Math Formulas

LaTeX's greatest strength: precise and beautiful math typesetting.

```latex
% Inline formula
$a^2 + b^2 = c^2$

% Display formula (unnumbered)
\[
e^{i\pi} + 1 = 0
\]

% Numbered formula
\begin{equation}
\int_0^\infty \frac{\sin x}{x} dx = \frac{\pi}{2}
\end{equation}

% Multi-line alignment
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}

% Matrix
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

% Piecewise function
f(x) = \begin{cases}
1, & x > 0 \\
0, & x = 0 \\
-1, & x < 0
\end{cases}
```

Quick reference for common symbols:

| Code | Output |
|------|--------|
| `\alpha \beta \gamma` | α β γ |
| `\sum_{i=1}^n` | ∑ⁿᵢ₌₁ |
| `\lim_{x\to\infty}` | limₓ→∞ |
| `\frac{a}{b}` | a/b |
| `\sqrt{x}` | √x |
| `\leq \geq \neq` | ≤ ≥ ≠ |
| `\in \subset \forall \exists` | ∈ ⊂ ∀ ∃ |

## Images

```latex
\usepackage{graphicx}

\begin{figure}[htbp]          % h=here t=top b=bottom p=page
\centering
\includegraphics[width=0.6\textwidth]{image.png}
\caption{Image caption}
\label{fig:myimage}
\end{figure}
```

Reference the image: `As shown in Figure \ref{fig:myimage}`.

## Tables

```latex
\begin{table}[htbp]
\centering
\begin{tabular}{|c|l|r|}
\hline
No. & Name & Value \\
\hline
1 & Alpha & 100 \\
2 & Beta  & 200 \\
\hline
\end{tabular}
\caption{Example table}
\label{tab:example}
\end{table}
```

`|c|l|r|` means 3 columns: center-aligned, left-aligned, right-aligned, with vertical lines. If manual table creation feels tedious, use [Tables Generator](https://www.tablesgenerator.com/).

## Citations and References

```latex
% Using BibTeX
\bibliographystyle{plain}
\bibliography{references}   % references.bib file

% Citation
As described in \cite{key}...
```

`references.bib` format:

```bibtex
@article{key,
  author  = {Author Name},
  title   = {Paper Title},
  journal = {Journal Name},
  year    = {2024},
}
```

Google Scholar and DBLP provide BibTeX exports for papers — just copy and paste.

## Common Templates

| Use Case | Recommendation |
|----------|----------------|
| Chinese paper | `ctexart` document class |
| English paper | `article` + journal template |
| Thesis/Dissertation | University-provided `.cls` template |
| Slides | `beamer` document class |
| Resume | `moderncv` package |
| Pseudocode | `algorithm2e` + `algpseudocode` |

## Overleaf Workflow

1. Sign up at https://www.overleaf.com
2. Create a new project → choose a template or blank project
3. Edit online with real-time preview
4. Collaborate: share the link, multiple people can edit simultaneously
5. Export PDF

Overleaf is the fastest way to get started, saving you the trouble of local installation. Once you're comfortable with the syntax, switch to a local TeX Live setup.

## Debugging Tips

```latex
% Common errors:
! Undefined control sequence.    → Command is misspelled or the required package isn't loaded
! Missing $ inserted.            → Math symbol used in normal text; wrap it in $...$
! File `xxx.sty' not found.      → Package is missing; run tlmgr install xxx
```

- When an error occurs, look at the first one first — later errors are often chain reactions
- Compile incrementally as you add content, don't wait until the end
- Overleaf auto-compiles by default, helping you catch errors sooner

## Summary

| Stage | Advice |
|-------|--------|
| Beginner | Use Overleaf, no installation, real-time preview |
| Intermediate | Install TeX Live locally, use VS Code + LaTeX Workshop plugin |
| Efficient | Collect common templates, use snippets for formula completion |
| Collaboration | Overleaf Share + Git sync |

LaTeX's learning curve is steep at first but flattens out quickly. The first two weeks feel cumbersome, but after that, writing formulas will be far faster than any Word equation editor, and the output quality is unmatched.
