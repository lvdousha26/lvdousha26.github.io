---
title: "LaTeX 入門から習熟まで：学術組版実用ガイド"
description: "初心者向けLaTeX実用チュートリアル。基本文法、数式、画像・表、テンプレートの使用法をカバー"
keywords: "latex,組版,論文,数式,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - LaTeX
  - チュートリアル
  - 便利ツール
---

## なぜLaTeXを学ぶべきか

論文、授業レポート、履歴書を作成するとき、Wordの組版に悩まされることがよくあります — 画像が勝手に動く、数式が見苦しい、書式が揃わない。LaTeXは**内容に集中でき、組版はエンジンに任せられます**。出力されるPDFはプロの出版品質です。

<!--more-->

## インストール

**TeX Live**（クロスプラットフォーム完全版）を推奨します。基本版は避けてください（パッケージ不足で後悔します）。

```bash
# Windows: TeX Live インストーラをダウンロード
# https://tug.org/texlive/

# macOS
brew install --cask mactex

# Linux
sudo apt install texlive-full
```

オンラインエディタとしては [Overleaf](https://www.overleaf.com/) がおすすめです。インストール不要、共同編集が便利で、初心者に最適です。

## 最初のドキュメント

```latex
\documentclass{article}
\usepackage[UTF8]{ctex}   % 中国語対応

\title{私の最初のドキュメント}
\author{绿豆沙}
\date{\today}

\begin{document}
\maketitle

\section{はじめに}
これが最初の段落です。

\section{本文}
Hello \LaTeX！

\end{document}
```

コンパイル：`xelatex main.tex`（中国語はxelatex推奨）。

## 基本構造

```latex
% ドキュメントクラス：article / report / book / beamer(スライド)
\documentclass[a4paper,12pt]{article}

% プリアンブル：パッケージの読み込み、組版パラメータの設定
\usepackage[UTF8]{ctex}          % 中国語
\usepackage{amsmath,amssymb}     % 数学
\usepackage{graphicx}            % 画像
\usepackage{hyperref}            % ハイパーリンク
\usepackage{geometry}            % ページ余白
\geometry{margin=2.5cm}

\begin{document}
% 本文はここに記述
\end{document}
```

## 数式

LaTeXの最大の強み：数式が正確で美しい。

```latex
% インライン数式
$a^2 + b^2 = c^2$

% 独立した数式（番号なし）
\[
e^{i\pi} + 1 = 0
\]

% 番号付き数式
\begin{equation}
\int_0^\infty \frac{\sin x}{x} dx = \frac{\pi}{2}
\end{equation}

% 複数行の整列
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}

% 行列
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

% 場合分け関数
f(x) = \begin{cases}
1, & x > 0 \\
0, & x = 0 \\
-1, & x < 0
\end{cases}
```

よく使う記号一覧：

| コード | 結果 |
|------|------|
| `\alpha \beta \gamma` | α β γ |
| `\sum_{i=1}^n` | ∑ⁿᵢ₌₁ |
| `\lim_{x\to\infty}` | limₓ→∞ |
| `\frac{a}{b}` | a/b |
| `\sqrt{x}` | √x |
| `\leq \geq \neq` | ≤ ≥ ≠ |
| `\in \subset \forall \exists` | ∈ ⊂ ∀ ∃ |

## 画像

```latex
\usepackage{graphicx}

\begin{figure}[htbp]          % h=here t=top b=bottom p=page
\centering
\includegraphics[width=0.6\textwidth]{image.png}
\caption{画像のタイトル}
\label{fig:myimage}
\end{figure}
```

画像の参照：`図 \ref{fig:myimage} に示すように`。

## 表

```latex
\begin{table}[htbp]
\centering
\begin{tabular}{|c|l|r|}
\hline
番号 & 名称 & 数値 \\
\hline
1 & Alpha & 100 \\
2 & Beta  & 200 \\
\hline
\end{tabular}
\caption{表の例}
\label{tab:example}
\end{table}
```

`|c|l|r|` は3列を意味し、それぞれ中央揃え、左揃え、右揃えで、縦線あり。手書きが面倒な場合は [Tables Generator](https://www.tablesgenerator.com/) で生成できます。

## 引用と参考文献

```latex
% BibTeXを使用
\bibliographystyle{plain}
\bibliography{references}   % references.bib ファイル

% 引用
文献 \cite{key} にあるように...
```

`references.bib` の形式：

```bibtex
@article{key,
  author  = {Author Name},
  title   = {Paper Title},
  journal = {Journal Name},
  year    = {2024},
}
```

Google Scholar / DBLP で各論文のBibTeXエクスポートが可能です。そのままコピーして使えます。

## よく使うテンプレート

| シチュエーション | 推奨 |
|------|------|
| 中国語論文 | `ctexart` ドキュメントクラス |
| 英語論文 | `article` ＋ ジャーナルテンプレート |
| 学位論文 | 大学提供の `.cls` テンプレート |
| スライド | `beamer` ドキュメントクラス |
| 履歴書 | `moderncv` パッケージ |
| 擬似コード | `algorithm2e` ＋ `algpseudocode` |

## Overleaf のワークフロー

1. https://www.overleaf.com に登録
2. 新規プロジェクト → テンプレートか空のプロジェクトを選択
3. オンラインで編集、リアルタイムプレビュー
4. 共同編集：リンクを共有して複数人で同時編集
5. PDFをエクスポート

Overleafは最も手軽な入門方法で、ローカルインストールの手間が省けます。文法に慣れてからローカルのTeX Liveに移行すればよいでしょう。

## デバッグのコツ

```latex
% よくあるエラー：
! Undefined control sequence.    → コマンドの綴り間違い、または対応パッケージ未読み込み
! Missing $ inserted.            → 通常テキスト中で数式記号を使用。$...$ で囲む
! File `xxx.sty' not found.      → パッケージ不足。tlmgr install xxx
```

- エラーが発生したら最初のエラーを確認してください。後続のエラーは連鎖反応であることが多いです
- 大量に追記したらこまめにコンパイルしましょう。最後にまとめてコンパイルしないこと
- Overleafはデフォルトで自動コンパイルされるので、エラーを早期に発見できます

## まとめ

| 段階 | アドバイス |
|------|------|
| 入門 | Overleafを使用。インストール不要、リアルタイムプレビュー |
| 中級 | ローカルにTeX Liveをインストール。VS Code ＋ LaTeX Workshopプラグイン |
| 効率化 | よく使うテンプレートを収集。スニペットで数式を補完 |
| 共同作業 | Overleaf Share ＋ Git同期 |

LaTeXの学習曲線は最初は急ですが、後半は緩やかになります。最初の2週間は面倒に感じるでしょうが、その後は数式を書く速度がWordの数式エディタをはるかに凌駕し、出力品質も比べ物になりません。
