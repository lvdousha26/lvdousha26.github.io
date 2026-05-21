---
title: "Getting Started with Vim"
description: "A practical Vim tutorial for beginners — master the core operations and double your editing efficiency"
keywords: "vim,editor,terminal,linux,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Vim
  - Tutorial
  - Gadgets
---

## Why Learn Vim

When you need to edit configuration files on a server or work in an environment without a GUI, a terminal editor is your only option. Vim comes pre-installed on almost every Linux distribution — once you learn it, you can work on any machine.

Its design philosophy: **Most of your time is spent reading or editing code, not typing new code.** That is why the default is "normal mode" — the keyboard becomes a set of shortcut operations.

<!--more-->

## Three Core Modes

```
           Press i / a / o         Press Esc
  Insert ←──────────── Normal ────────────→ Command
        ────────────▶      ←────────────
         Press Esc               Press : / /
```

| Mode | Purpose | How to Enter |
|------|---------|-------------|
| **Normal Mode** | Browse, delete, copy, move | Press `Esc` |
| **Insert Mode** | Type text normally | `i` (before cursor) `a` (after cursor) `o` (new line) |
| **Command Mode** | Save, quit, search, replace | `:` or `/` |

Core principle: **Keep your fingers on the home row — never leave the keyboard.**

## Movement: Ditch the Arrow Keys

```
h ← left    j ↓ down    k ↑ up    l → right

w       Jump to the beginning of the next word
b       Jump to the beginning of the previous word
e       Jump to the end of a word
0       Jump to the beginning of the line
^       Jump to the first non-blank character of the line
$       Jump to the end of the line
gg      Jump to the beginning of the file
G       Jump to the end of the file
:42     Jump to line 42
```

Why not use the arrow keys? Because they are too far from the home row — lifting your hand every time is a waste of time.

## Editing Operations

```vim
" Deleting
x         Delete the character under the cursor
dw        Delete a word
dd        Delete the entire line
d$        Delete to the end of the line

" Copy and paste
yy        Copy (yank) the entire line
yw        Copy a word
p         Paste after the cursor
P         Paste before the cursor

" Undo and redo
u         Undo
Ctrl+r    Redo

" Other
.         Repeat the last operation (very useful shortcut)
>>        Indent the current line to the right
<<        Indent the current line to the left
```

## Search and Replace

```vim
" Search: press /, type your keyword, press Enter
/search_word     " n for next match, N for previous match

" Replace in the entire file
:%s/old/new/g    " Replace all matches in the file

" Replace with confirmation
:%s/old/new/gc   " y to replace, n to skip
```

## Multiple Files and Splits

```vim
:split file2.py       " Open another file in a horizontal split
:vsplit file2.py      " Open another file in a vertical split
Ctrl+w hjkl            " Move the cursor between splits
Ctrl+w =               " Equalize split sizes
:bd                    " Close the current buffer
```

## Useful Configuration

Add these to `~/.vimrc`:

```vim
syntax on              " Syntax highlighting
set number             " Show line numbers
set relativenumber     " Show relative line numbers (easier jumping)
set expandtab          " Convert tabs to spaces
set tabstop=4          " Tab display width
set shiftwidth=4       " Indent width
set autoindent         " Auto-indent
set hlsearch           " Highlight search results
set incsearch          " Incremental search
set ignorecase         " Ignore case
set smartcase          " Case-sensitive when uppercase is present
set mouse=a            " Enable mouse support
```

## Minimum Viable Commands

Learning Vim in one day is unrealistic, but remembering these 10 operations is enough to get work done:

| Operation | Command |
|-----------|---------|
| Start editing | `i` |
| Exit editing | `Esc` |
| Save | `:w` |
| Quit | `:q` |
| Force quit without saving | `:q!` |
| Save and quit | `:wq` or `ZZ` |
| Delete a line | `dd` |
| Copy a line | `yy` |
| Paste | `p` |
| Undo | `u` |

## Learning Path

1. Run the `vimtutor` command (Vim's built-in tutorial) to go through the basics
2. Install a terminal-based practice tool (e.g., VimBeater)
3. Force yourself to use Vim for daily config edits and note-taking — stick with it for two weeks
4. Gradually add plugins (NERDtree, fzf, coc.nvim)

Do not pile on plugins from day one. First, master the fundamentals of **movement and editing**.
