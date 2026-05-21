---
title: "GDB 入門：跑不動了就看看"
description: "GDB 是什麼、怎麼用、常見調試場景"
keywords: "GDB,調試,Linux,C/C++"

date: 2026-05-21T00:00:00+08:00
lastmod: 2026-05-21T00:00:00+08:00

math: false
mermaid: false

categories:
  - 後端
tags:
  - GDB
  - 調試
  - C
---


你寫的程序崩了。段錯誤。什麼都沒輸出。你盯着代碼看了一個小時。

別看了。用 GDB。

<!--more-->

## 什麼是 GDB

GDB 是 GNU Debugger。它能讓你看程序運行時的內部狀態。

你可以在某一行停下來。查看變量的值。單步執行。看調用棧。

不需要猜哪裏出了問題。問 GDB 就行。

## 安裝

Linux：

```bash
apt install gdb
```

macOS：

```bash
brew install gdb
```

裝完運行 `gdb --version`。有輸出就對了。

## 編譯

要讓 GDB 工作，編譯時加 `-g` 選項。

```bash
gcc -g -o myprogram myprogram.c
# 或者
g++ -g -o myprogram myprogram.cpp
```

`-g` 告訴編譯器保留調試信息。沒有它，GDB 不知道變量名和行號。

不要加 `-O2` 之類的優化選項。優化過的代碼和源碼對不上。GDB 會迷路。

## 啓動

```bash
gdb ./myprogram
```

看到 `(gdb)` 提示符就對了。

## 運行

在 GDB 裏運行程序：

```bash
(gdb) run
```

如果程序需要命令行參數：

```bash
(gdb) run arg1 arg2 arg3
```

程序會一直運行直到結束或出錯。

## 斷點

在你關心的行停下來：

```bash
(gdb) break main.c:42
(gdb) break main
(gdb) break my_function
```

`break main` 在 `main` 函數入口停下。`break main.c:42` 在第 42 行停下。

查看所有斷點：

```bash
(gdb) info breakpoints
```

刪除斷點：

```bash
(gdb) delete 1
```

## 步進

斷點命中後，你可以控制執行節奏：

| 命令 | 作用 |
|------|------|
| `next` (或 `n`) | 執行下一行，不進入函數 |
| `step` (或 `s`) | 執行下一行，進入函數 |
| `finish` | 運行到當前函數返回 |
| `continue` (或 `c`) | 繼續運行到下一個斷點 |
| `until` | 運行到指定行 |

## 查看變量

```bash
(gdb) print x
(gdb) print &x
(gdb) print arr[2]
(gdb) print *ptr
```

`print` 會顯示變量當前的值。加 `&` 顯示地址。

查看所有局部變量：

```bash
(gdb) info locals
```

查看函數參數：

```bash
(gdb) info args
```

## 調用棧

程序崩了之後，第一個問題：它在哪裏崩的？

```bash
(gdb) backtrace
# 或簡寫
(gdb) bt
```

GDB 會顯示從 `main` 到崩潰位置的完整調用鏈。每一幀是一個函數調用。

切換到不同的幀看看：

```bash
(gdb) frame 2
(gdb) info locals
```

## 常見場景

### 段錯誤

```bash
gdb ./myprogram
(gdb) run
# 程序崩潰，GDB 會停在崩潰位置
(gdb) bt
# 看到是哪一行、哪個指針出了問題
(gdb) print ptr
# 哦，果然是空指針
```

### 條件斷點

只在特定條件下停下：

```bash
(gdb) break main.c:42 if i > 100
```

這樣就不用手動按 `continue` 一百次了。

### 監視點

變量發生變化時停下：

```bash
(gdb) watch x
```

當 `x` 的值被修改時，GDB 會立即停下。

### 修改變量

調試時可以直接改值：

```bash
(gdb) set var i = 0
```

這在測試循環或邊界條件時很有用。

## .gdbinit

每次啓動 GDB 都要敲一遍 `set pagination off`？寫進配置文件。

`~/.gdbinit`：

```
set pagination off
set confirm off
set print pretty on
```

GDB 啓動時自動加載。省事。

## 實用技巧

- **`Enter`** 重複上一條命令。連續 `next` 時很有用。
- **`list`** 顯示源碼上下文。`list 20,30` 顯示 20 到 30 行。
- **`display x`** 每次停下時自動打印 `x` 的值。
- **`quit`** 退出 GDB。
- **`help`** 記不住命令時用。

## 總結

調試不是猜謎。GDB 告訴你真相。

編譯加 `-g`。崩了就用 `bt`。看變量就用 `print`。單步就用 `n` 和 `s`。

先記住這三個。遇到新問題再學新命令。
