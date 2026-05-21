---
title: "Neovim 入門：挫折しないためのガイド"
description: "Neovim 初心者向けガイド：インストール設定、基本操作、プラグイン管理、モダンなエディタ構築"
keywords: "neovim,vim,エディタ,チュートリアル,lazyvim"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Neovim
  - Vim
  - エディタ
  - チュートリアル
  - 便利ツール
---

Vimを初めて使う人の多くは、終了方法すらわからない。この記事では、インストールから快適に文章を書けるようになるまでを解説します。

<!--more-->

## なぜNeovimを選ぶのか

Vimのモダンなフォーク。LSPクライアント、Treesitterシンタックスハイライト、Luaプラグイン機構を内蔵。高速でメモリ消費が少なく、SSH越しのリモート編集に最適。

VS Codeとの比較：GUIのオーバーヘッドがなく、キーボード操作がより極限的。設定はLuaで記述でき、JSONより強力。

## インストール

```bash
# macOS
brew install neovim

# Ubuntu/Debian
sudo apt install neovim

# Windows
winget install Neovim.Neovim

# またはAppImageを直接ダウンロード (Linux)
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
chmod +x nvim.appimage && sudo mv nvim.appimage /usr/local/bin/nvim
```

バージョンが 0.9 以上であることを確認：

```bash
nvim --version
```

## Vimの終了方法（第一課）

```
Esc          # Normalモードに戻る
:q           # 終了
:q!          # 保存せず強制終了
:wq          # 保存して終了
ZZ           # 保存して終了（ショートカット）
```

## モード — 最も重要な概念

| モード | 移行方法 | 何をするか |
|--------|----------|------------|
| Normal | `Esc` | カーソル移動、削除、コピー、ペースト |
| Insert | `i` `a` `o` | 文字を入力 |
| Visual | `v` `V` `Ctrl+v` | テキストを選択 |
| Command | `:` | コマンドを実行 |

ファイルを開くとNormalモード。`i` を押してInsertモードに入り、タイピングを開始。終わったら `Esc` でNormalモードに戻る。

## カーソル移動

方向キーも使えますが、`hjkl` ならホームポジションから手を離さずに操作：

```
         k(上)
h(左)    j(下)    l(右)

w    次の単語の先頭
b    前の単語の先頭
0    行頭
$    行末
gg   ファイル先頭
G    ファイル末尾
42gg 42行目にジャンプ
```

## 基本編集

```
x       カーソル下の文字を削除
dd      行全体を削除
yy      行全体をコピー
p       下にペースト
u       アンドゥ
Ctrl+r  リドゥ
.       直前の操作を繰り返す
/キーワード  検索、n/N で次/前へ
:%s/旧/新/g  ファイル全体を置換
```

## 設定ファイル

Neovimの設定は `~/.config/nvim/` にあり、エントリポイントは `init.lua`：

```lua
-- ~/.config/nvim/init.lua

-- 行番号
vim.opt.number = true
vim.opt.relativenumber = true  -- 相対行番号、ジャンプに便利

-- インデント
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true       -- Tabをスペースに変換

-- 検索
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- クリップボード（システムクリップボードを使用）
vim.opt.clipboard = "unnamedplus"

-- マウスサポート
vim.opt.mouse = "a"

-- テーマと外観
vim.opt.termguicolors = true
vim.opt.cursorline = true
```

## プラグイン管理 — Lazy.nvim

モダンなNeovimの標準装備。`lazy.nvim` は最も人気のあるプラグインマネージャで、Luaで設定を書き、遅延ロードをサポート。

```bash
git clone https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim
```

`init.lua` に追加：

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  -- ファイルツリー
  { "nvim-neo-tree/neo-tree.nvim", branch = "v3.x",
    dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons", "MunifTanjim/nui.nvim" } },

  -- ファジーファインダー
  { "nvim-telescope/telescope.nvim", tag = "0.1.8",
    dependencies = { "nvim-lua/plenary.nvim" } },

  -- ステータスバー
  { "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" } },

  -- カラースキーム
  { "folke/tokyonight.nvim", lazy = false, priority = 1000 },

  -- LSP 補完
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp",
    dependencies = { "hrsh7th/cmp-nvim-lsp", "L3MON4D3/LuaSnip" } },
})

-- テーマの読み込み
vim.cmd.colorscheme("tokyonight-night")
```

`init.lua` を保存し、nvimを開いて `:Lazy` でプラグインの状態を確認、`i` でインストール。

## 便利なキーマッピング

```lua
-- leaderキーをスペースに変更
vim.g.mapleader = " "

-- <leader>e でファイルツリーを開く
vim.keymap.set("n", "<leader>e", ":Neotree toggle<CR>")

-- <leader>f でファイルをファジー検索
vim.keymap.set("n", "<leader>f", ":Telescope find_files<CR>")

-- <leader>g でテキストを全体検索
vim.keymap.set("n", "<leader>g", ":Telescope live_grep<CR>")

-- Ctrl+hjkl でスプリット間を移動
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")

-- スプリット
-- :split 水平、:vsplit 垂直
```

## LSP — コード補完とジャンプ

NeovimはLSPクライアントを内蔵。`nvim-lspconfig` と `mason.nvim` を導入後：

```lua
-- lazy.setup({}) の中に追加
{ "williamboman/mason.nvim" },
{ "williamboman/mason-lspconfig.nvim" },

-- 初期化
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "lua_ls", "pyright", "gopls", "rust_analyzer" },
  automatic_installation = true,
})

-- 補完設定
local cmp = require("cmp")
cmp.setup({
  mapping = cmp.mapping.preset.insert({
    ["<Tab>"] = cmp.mapping.select_next_item(),
    ["<S-Tab>"] = cmp.mapping.select_prev_item(),
    ["<CR>"] = cmp.mapping.confirm({ select = true }),
  }),
  sources = cmp.config.sources({
    { name = "nvim_lsp" },
  }),
})
```

その後、対応する言語のファイルを開くとLSPが自動で有効に：`gd` で定義へジャンプ、`K` でドキュメント表示、`<leader>rn` でリネーム。

## 使える最小限の init.lua

上記をまとめると約80行。`~/.config/nvim/init.lua` に置けば、ファイルツリー、ファジー検索、LSP補完、綺麗なテーマが使える。

コミュニティ設定を直接使うことも可能：

```bash
# LazyVim — すぐに使えるモダンな設定
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

nvimを開いてプラグインのインストールを待つだけ。LazyVimは標準でLSP、Telescope、Treesitter、各キーの割り当てが設定済み。

## 日常の使用フロー

```bash
nvim project/main.py

# 基本操作
<leader>e     # ファイルツリーを開き、ファイルを選択
<leader>f     # ファイルをファジー検索
<leader>g     # コード内容を検索
gd            # 関数定義へジャンプ
K             # 関数のドキュメントを表示
<leader>rn    # 変数をリネーム
:w            # 保存

# ターミナル
:term         # 内蔵ターミナルを開く
i             # ターミナル内でiを押して入力モードへ
```

## クイックリファレンス

| 目的 | 操作 |
|------|------|
| インストール | `brew install neovim` / `apt install neovim` |
| 終了 | `:q` / `:q!` / `:wq` |
| 設定ファイル | `~/.config/nvim/init.lua` |
| プラグイン追加 | lazy.setup({}) に記述、nvimを開くと自動インストール |
| プラグイン確認 | `:Lazy` |
| ファイル検索 | `<leader>f` (Telescope) |
| テキスト検索 | `<leader>g` |
| スプリット | `:split` / `:vsplit` |
| 文字選択 | `viw` で単語選択、`V` で行選択 |
| コメント | `gc` + 操作（Commentプラグイン導入時） |

一度に全部覚える必要はありません。`i` で入力、`Esc` でNormalモードに戻る、`:wq` で保存終了、`dd` で行削除、`p` でペースト。あとは使うたびに調べていきましょう。
