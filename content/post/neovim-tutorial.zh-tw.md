---
title: "Neovim 從入門到不放棄"
description: "Neovim 新手友好指南：安裝配置、基本操作、插件管理、打造現代編輯器"
keywords: "neovim,vim,編輯器,教程,lazyvim"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Neovim
  - Vim
  - 編輯器
  - 教程
  - 小工具
---


很多人第一次進 Vim 不知道怎麼退出。這篇帶你從安裝走到舒服寫字。

<!--more-->

## 爲什麼選 Neovim

Vim 的現代化 fork。內置 LSP 客戶端、Treesitter 語法高亮、Lua 插件體系。速度快，內存佔用小，SSH 遠程編輯神器。

跟 VS Code 比：少了 GUI 包袱，鍵盤操作更極致，配置用 Lua 寫比 JSON 強。

## 安裝

```bash
# macOS
brew install neovim

# Ubuntu/Debian
sudo apt install neovim

# Windows
winget install Neovim.Neovim

# 或直接下 AppImage (Linux)
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
chmod +x nvim.appimage && sudo mv nvim.appimage /usr/local/bin/nvim
```

確認版本 ≥ 0.9：

```bash
nvim --version
```

## 退出 Vim（第一課）

```
Esc          # 回到 Normal 模式
:q           # 退出
:q!          # 不保存強制退出
:wq          # 保存並退出
ZZ           # 保存並退出（快捷鍵）
```

## 模式 — 最重要的概念

| 模式 | 進入方式 | 做什麼 |
|------|---------|--------|
| Normal | `Esc` | 移動光標、刪除、複製、粘貼 |
| Insert | `i` `a` `o` | 寫字 |
| Visual | `v` `V` `Ctrl+v` | 選中文本 |
| Command | `:` | 執行命令 |

剛打開文件在 Normal 模式，按 `i` 進入 Insert 開始打字。打完按 `Esc` 回 Normal。

## 移動光標

方向鍵也能用，但 `hjkl` 手不離開主鍵盤區：

```
         k(上)
h(左)    j(下)    l(右)

w    下個單詞開頭
b    上個單詞開頭
0    行首
$    行尾
gg   文件開頭
G    文件末尾
42gg 跳到第42行
```

## 基本編輯

```
x      刪光標下字符
dd     刪整行
yy     複製整行
p      粘貼到下面
u      撤銷
Ctrl+r 重做
.      重複上一次操作
/關鍵詞 搜索，n/N 跳上一個/下一個
:%s/舊/新/g  全文替換
```

## 配置文件

Neovim 配置在 `~/.config/nvim/`，入口是 `init.lua`：

```lua
-- ~/.config/nvim/init.lua

-- 行號
vim.opt.number = true
vim.opt.relativenumber = true  -- 相對行號，跳轉方便

-- 縮進
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true       -- Tab 轉空格

-- 搜索
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- 剪貼板（能用系統剪貼板）
vim.opt.clipboard = "unnamedplus"

-- 鼠標支持
vim.opt.mouse = "a"

-- 主題和外觀
vim.opt.termguicolors = true
vim.opt.cursorline = true
```

## 插件管理 — Lazy.nvim

現代 Neovim 標配。`lazy.nvim` 是最流行的插件管理器，Lua 寫配置，懶加載。

```bash
git clone https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim
```

在 `init.lua` 里加：

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
  -- 文件樹
  { "nvim-neo-tree/neo-tree.nvim", branch = "v3.x",
    dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons", "MunifTanjim/nui.nvim" } },

  -- 模糊查找
  { "nvim-telescope/telescope.nvim", tag = "0.1.8",
    dependencies = { "nvim-lua/plenary.nvim" } },

  -- 狀態欄
  { "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" } },

  -- 配色
  { "folke/tokyonight.nvim", lazy = false, priority = 1000 },

  -- LSP 自動補全
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp",
    dependencies = { "hrsh7th/cmp-nvim-lsp", "L3MON4D3/LuaSnip" } },
})

-- 加載主題
vim.cmd.colorscheme("tokyonight-night")
```

保存 `init.lua`，打開 nvim，`:Lazy` 查看插件狀態，按 `i` 安裝。

## 好用的鍵位映射

```lua
-- leader 鍵改空格
vim.g.mapleader = " "

-- <leader>e 打開文件樹
vim.keymap.set("n", "<leader>e", ":Neotree toggle<CR>")

-- <leader>f 模糊搜文件
vim.keymap.set("n", "<leader>f", ":Telescope find_files<CR>")

-- <leader>g 全局搜文本
vim.keymap.set("n", "<leader>g", ":Telescope live_grep<CR>")

-- Ctrl+hjkl 在分屏間跳轉
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")

-- 分屏
-- :split 水平，:vsplit 垂直
```

## LSP — 代碼補全和跳轉

Neovim 內置 LSP 客戶端。裝 `nvim-lspconfig` 和 `mason.nvim` 後：

```lua
-- 加到 lazy.setup({}) 裏
{ "williamboman/mason.nvim" },
{ "williamboman/mason-lspconfig.nvim" },

-- 初始化
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "lua_ls", "pyright", "gopls", "rust_analyzer" },
  automatic_installation = true,
})

-- 自動補全配置
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

之後打開對應語言的文件，LSP 自動生效：`gd` 跳定義，`K` 查看文檔，`<leader>rn` 重命名。

## 一套可用的最小 init.lua

把上面的拼起來差不多 80 行，放到 `~/.config/nvim/init.lua`，就有文件樹、模糊搜索、LSP 補全、好看主題。

也可以直接用社區配置：

```bash
# LazyVim — 開箱即用的現代配置
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

打開 nvim 等插件裝完就行。LazyVim 默認配好了 LSP、Telescope、Treesitter、哪個鍵做什麼。

## 日常使用流程

```bash
nvim project/main.py

# 基本操作
<leader>e     # 打開文件樹，選文件
<leader>f     # 模糊搜文件
<leader>g     # 搜索代碼內容
gd            # 跳到函數定義
K             # 看函數文檔
<leader>rn    # 重命名變量
:w            # 保存

# 終端
:term         # 打開內置終端
i             # 終端裏按 i 進入輸入模式
```

## 速查表

| 需求 | 操作 |
|------|------|
| 安裝 | `brew install neovim` / `apt install neovim` |
| 退出 | `:q` / `:q!` / `:wq` |
| 配置文件 | `~/.config/nvim/init.lua` |
| 裝插件 | 寫到 lazy.setup({}) 裏，打開 nvim 自動裝 |
| 查看插件 | `:Lazy` |
| 搜索文件 | `<leader>f` (Telescope) |
| 搜索文本 | `<leader>g` |
| 分屏 | `:split` / `:vsplit` |
| 選字 | `viw` 選詞，`V` 選行 |
| 註釋 | `gc` + 動作（裝了 Comment 插件的話） |

不用一口氣學完。記住 `i` 打字、`Esc` 回 Normal、`:wq` 保存退出、`dd` 刪行、`p` 粘貼。其他邊用邊查。
