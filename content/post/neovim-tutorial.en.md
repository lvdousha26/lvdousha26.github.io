---
title: "Neovim: From Beginner to Not Giving Up"
description: "Neovim beginner-friendly guide: installation, configuration, basic operations, plugin management, building a modern editor"
keywords: "neovim,vim,editor,tutorial,lazyvim"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Neovim
  - Vim
  - Editor
  - Tutorial
  - Tool
---

Many people cannot figure out how to exit Vim the first time they open it. This guide takes you from installation to comfortably writing code.

<!--more-->

## Why Choose Neovim

A modern fork of Vim. Built-in LSP client, Treesitter syntax highlighting, Lua plugin architecture. Fast, low memory footprint, excellent for SSH remote editing.

Compared to VS Code: no GUI overhead, more extreme keyboard-centric operation, and configuration in Lua is far superior to JSON.

## Installation

```bash
# macOS
brew install neovim

# Ubuntu/Debian
sudo apt install neovim

# Windows
winget install Neovim.Neovim

# Or download AppImage directly (Linux)
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
chmod +x nvim.appimage && sudo mv nvim.appimage /usr/local/bin/nvim
```

Make sure the version is >= 0.9:

```bash
nvim --version
```

## Exiting Vim (Lesson One)

```
Esc          # Return to Normal mode
:q           # Quit
:q!          # Force quit without saving
:wq          # Save and quit
ZZ           # Save and quit (shortcut)
```

## Modes — The Most Important Concept

| Mode | How to Enter | What It Does |
|------|-------------|--------------|
| Normal | `Esc` | Move cursor, delete, copy, paste |
| Insert | `i` `a` `o` | Write text |
| Visual | `v` `V` `Ctrl+v` | Select text |
| Command | `:` | Execute commands |

When you open a file, you start in Normal mode. Press `i` to enter Insert mode and start typing. Press `Esc` to return to Normal when done.

## Cursor Movement

Arrow keys work too, but `hjkl` keeps your hands on the home row:

```
         k(up)
h(left)  j(down)  l(right)

w    next word beginning
b    previous word beginning
0    beginning of line
$    end of line
gg   beginning of file
G    end of file
42gg jump to line 42
```

## Basic Editing

```
x      delete character under cursor
dd     delete entire line
yy     copy entire line
p      paste below
u      undo
Ctrl+r redo
.      repeat last operation
/keyword  search, n/N next/previous match
:%s/old/new/g  global search and replace
```

## Configuration File

Neovim configuration is in `~/.config/nvim/`, with the entry point `init.lua`:

```lua
-- ~/.config/nvim/init.lua

-- Line numbers
vim.opt.number = true
vim.opt.relativenumber = true  -- Relative line numbers for easy navigation

-- Indentation
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true       -- Convert tabs to spaces

-- Search
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- Clipboard (use system clipboard)
vim.opt.clipboard = "unnamedplus"

-- Mouse support
vim.opt.mouse = "a"

-- Theme and appearance
vim.opt.termguicolors = true
vim.opt.cursorline = true
```

## Plugin Management — Lazy.nvim

The modern standard for Neovim. `lazy.nvim` is the most popular plugin manager, with Lua-based configuration and lazy loading.

```bash
git clone https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim
```

Add to `init.lua`:

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
  -- File explorer
  { "nvim-neo-tree/neo-tree.nvim", branch = "v3.x",
    dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons", "MunifTanjim/nui.nvim" } },

  -- Fuzzy finder
  { "nvim-telescope/telescope.nvim", tag = "0.1.8",
    dependencies = { "nvim-lua/plenary.nvim" } },

  -- Statusline
  { "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" } },

  -- Colorscheme
  { "folke/tokyonight.nvim", lazy = false, priority = 1000 },

  -- LSP completion
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp",
    dependencies = { "hrsh7th/cmp-nvim-lsp", "L3MON4D3/LuaSnip" } },
})

-- Load theme
vim.cmd.colorscheme("tokyonight-night")
```

Save `init.lua`, open nvim, run `:Lazy` to check plugin status, press `i` to install.

## Useful Key Mappings

```lua
-- Set leader key to space
vim.g.mapleader = " "

-- <leader>e toggle file tree
vim.keymap.set("n", "<leader>e", ":Neotree toggle<CR>")

-- <leader>f fuzzy find files
vim.keymap.set("n", "<leader>f", ":Telescope find_files<CR>")

-- <leader>g global text search
vim.keymap.set("n", "<leader>g", ":Telescope live_grep<CR>")

-- Ctrl+hjkl navigate between splits
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")

-- Splits
-- :split horizontal, :vsplit vertical
```

## LSP — Code Completion and Navigation

Neovim has a built-in LSP client. After installing `nvim-lspconfig` and `mason.nvim`:

```lua
-- Add to lazy.setup({})
{ "williamboman/mason.nvim" },
{ "williamboman/mason-lspconfig.nvim" },

-- Initialize
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "lua_ls", "pyright", "gopls", "rust_analyzer" },
  automatic_installation = true,
})

-- Completion configuration
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

After that, open a file in the corresponding language and LSP will work automatically: `gd` go to definition, `K` show documentation, `<leader>rn` rename.

## A Minimal Working init.lua

Putting all of the above together comes to about 80 lines. Place it in `~/.config/nvim/init.lua` and you get a file tree, fuzzy search, LSP completion, and a nice theme.

You can also use a community configuration directly:

```bash
# LazyVim — a modern, batteries-included configuration
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

Open nvim and wait for plugins to install. LazyVim comes pre-configured with LSP, Telescope, Treesitter, and keybindings.

## Daily Workflow

```bash
nvim project/main.py

# Basic operations
<leader>e     # open file tree, select files
<leader>f     # fuzzy find files
<leader>g     # search code content
gd            # jump to function definition
K             # view function documentation
<leader>rn    # rename variable
:w            # save

# Terminal
:term         # open built-in terminal
i             # press i in terminal to enter input mode
```

## Quick Reference

| Need | Action |
|------|--------|
| Install | `brew install neovim` / `apt install neovim` |
| Exit | `:q` / `:q!` / `:wq` |
| Config file | `~/.config/nvim/init.lua` |
| Install plugins | Add to lazy.setup({}), open nvim — auto-installs |
| View plugins | `:Lazy` |
| Search files | `<leader>f` (Telescope) |
| Search text | `<leader>g` |
| Split screen | `:split` / `:vsplit` |
| Select text | `viw` select word, `V` select line |
| Comment | `gc` + motion (if Comment plugin is installed) |

Do not try to learn everything at once. Just remember `i` to type, `Esc` to return to Normal, `:wq` to save and exit, `dd` to delete a line, and `p` to paste. Look up the rest as you go.
