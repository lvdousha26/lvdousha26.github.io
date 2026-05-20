---
title: "Neovim 从入门到不放弃"
description: "Neovim 新手友好指南：安装配置、基本操作、插件管理、打造现代编辑器"
keywords: "neovim,vim,编辑器,教程,lazyvim"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Neovim
  - Vim
  - 编辑器
  - 教程
  - 小工具
---

很多人第一次进 Vim 不知道怎么退出。这篇带你从安装走到舒服写字。

<!--more-->

## 为什么选 Neovim

Vim 的现代化 fork。内置 LSP 客户端、Treesitter 语法高亮、Lua 插件体系。速度快，内存占用小，SSH 远程编辑神器。

跟 VS Code 比：少了 GUI 包袱，键盘操作更极致，配置用 Lua 写比 JSON 强。

## 安装

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

确认版本 ≥ 0.9：

```bash
nvim --version
```

## 退出 Vim（第一课）

```
Esc          # 回到 Normal 模式
:q           # 退出
:q!          # 不保存强制退出
:wq          # 保存并退出
ZZ           # 保存并退出（快捷键）
```

## 模式 — 最重要的概念

| 模式 | 进入方式 | 做什么 |
|------|---------|--------|
| Normal | `Esc` | 移动光标、删除、复制、粘贴 |
| Insert | `i` `a` `o` | 写字 |
| Visual | `v` `V` `Ctrl+v` | 选中文本 |
| Command | `:` | 执行命令 |

刚打开文件在 Normal 模式，按 `i` 进入 Insert 开始打字。打完按 `Esc` 回 Normal。

## 移动光标

方向键也能用，但 `hjkl` 手不离开主键盘区：

```
         k(上)
h(左)    j(下)    l(右)

w    下个单词开头
b    上个单词开头
0    行首
$    行尾
gg   文件开头
G    文件末尾
42gg 跳到第42行
```

## 基本编辑

```
x      删光标下字符
dd     删整行
yy     复制整行
p      粘贴到下面
u      撤销
Ctrl+r 重做
.      重复上一次操作
/关键词 搜索，n/N 跳上一个/下一个
:%s/旧/新/g  全文替换
```

## 配置文件

Neovim 配置在 `~/.config/nvim/`，入口是 `init.lua`：

```lua
-- ~/.config/nvim/init.lua

-- 行号
vim.opt.number = true
vim.opt.relativenumber = true  -- 相对行号，跳转方便

-- 缩进
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true       -- Tab 转空格

-- 搜索
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- 剪贴板（能用系统剪贴板）
vim.opt.clipboard = "unnamedplus"

-- 鼠标支持
vim.opt.mouse = "a"

-- 主题和外观
vim.opt.termguicolors = true
vim.opt.cursorline = true
```

## 插件管理 — Lazy.nvim

现代 Neovim 标配。`lazy.nvim` 是最流行的插件管理器，Lua 写配置，懒加载。

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
  -- 文件树
  { "nvim-neo-tree/neo-tree.nvim", branch = "v3.x",
    dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons", "MunifTanjim/nui.nvim" } },

  -- 模糊查找
  { "nvim-telescope/telescope.nvim", tag = "0.1.8",
    dependencies = { "nvim-lua/plenary.nvim" } },

  -- 状态栏
  { "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" } },

  -- 配色
  { "folke/tokyonight.nvim", lazy = false, priority = 1000 },

  -- LSP 自动补全
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp",
    dependencies = { "hrsh7th/cmp-nvim-lsp", "L3MON4D3/LuaSnip" } },
})

-- 加载主题
vim.cmd.colorscheme("tokyonight-night")
```

保存 `init.lua`，打开 nvim，`:Lazy` 查看插件状态，按 `i` 安装。

## 好用的键位映射

```lua
-- leader 键改空格
vim.g.mapleader = " "

-- <leader>e 打开文件树
vim.keymap.set("n", "<leader>e", ":Neotree toggle<CR>")

-- <leader>f 模糊搜文件
vim.keymap.set("n", "<leader>f", ":Telescope find_files<CR>")

-- <leader>g 全局搜文本
vim.keymap.set("n", "<leader>g", ":Telescope live_grep<CR>")

-- Ctrl+hjkl 在分屏间跳转
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")

-- 分屏
-- :split 水平，:vsplit 垂直
```

## LSP — 代码补全和跳转

Neovim 内置 LSP 客户端。装 `nvim-lspconfig` 和 `mason.nvim` 后：

```lua
-- 加到 lazy.setup({}) 里
{ "williamboman/mason.nvim" },
{ "williamboman/mason-lspconfig.nvim" },

-- 初始化
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "lua_ls", "pyright", "gopls", "rust_analyzer" },
  automatic_installation = true,
})

-- 自动补全配置
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

之后打开对应语言的文件，LSP 自动生效：`gd` 跳定义，`K` 查看文档，`<leader>rn` 重命名。

## 一套可用的最小 init.lua

把上面的拼起来差不多 80 行，放到 `~/.config/nvim/init.lua`，就有文件树、模糊搜索、LSP 补全、好看主题。

也可以直接用社区配置：

```bash
# LazyVim — 开箱即用的现代配置
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

打开 nvim 等插件装完就行。LazyVim 默认配好了 LSP、Telescope、Treesitter、哪个键做什么。

## 日常使用流程

```bash
nvim project/main.py

# 基本操作
<leader>e     # 打开文件树，选文件
<leader>f     # 模糊搜文件
<leader>g     # 搜索代码内容
gd            # 跳到函数定义
K             # 看函数文档
<leader>rn    # 重命名变量
:w            # 保存

# 终端
:term         # 打开内置终端
i             # 终端里按 i 进入输入模式
```

## 速查表

| 需求 | 操作 |
|------|------|
| 安装 | `brew install neovim` / `apt install neovim` |
| 退出 | `:q` / `:q!` / `:wq` |
| 配置文件 | `~/.config/nvim/init.lua` |
| 装插件 | 写到 lazy.setup({}) 里，打开 nvim 自动装 |
| 查看插件 | `:Lazy` |
| 搜索文件 | `<leader>f` (Telescope) |
| 搜索文本 | `<leader>g` |
| 分屏 | `:split` / `:vsplit` |
| 选字 | `viw` 选词，`V` 选行 |
| 注释 | `gc` + 动作（装了 Comment 插件的话） |

不用一口气学完。记住 `i` 打字、`Esc` 回 Normal、`:wq` 保存退出、`dd` 删行、`p` 粘贴。其他边用边查。
