---
title: "GDB 入门：跑不动了就看看"
description: "GDB 是什么、怎么用、常见调试场景"
keywords: "GDB,调试,Linux,C/C++"

date: 2026-05-21T00:00:00+08:00
lastmod: 2026-05-21T00:00:00+08:00

math: false
mermaid: false

categories:
  - 后端
tags:
  - GDB
  - 调试
  - C
---

你写的程序崩了。段错误。什么都没输出。你盯着代码看了一个小时。

别看了。用 GDB。

<!--more-->

## 什么是 GDB

GDB 是 GNU Debugger。它能让你看程序运行时的内部状态。

你可以在某一行停下来。查看变量的值。单步执行。看调用栈。

不需要猜哪里出了问题。问 GDB 就行。

## 安装

Linux：

```bash
apt install gdb
```

macOS：

```bash
brew install gdb
```

装完运行 `gdb --version`。有输出就对了。

## 编译

要让 GDB 工作，编译时加 `-g` 选项。

```bash
gcc -g -o myprogram myprogram.c
# 或者
g++ -g -o myprogram myprogram.cpp
```

`-g` 告诉编译器保留调试信息。没有它，GDB 不知道变量名和行号。

不要加 `-O2` 之类的优化选项。优化过的代码和源码对不上。GDB 会迷路。

## 启动

```bash
gdb ./myprogram
```

看到 `(gdb)` 提示符就对了。

## 运行

在 GDB 里运行程序：

```bash
(gdb) run
```

如果程序需要命令行参数：

```bash
(gdb) run arg1 arg2 arg3
```

程序会一直运行直到结束或出错。

## 断点

在你关心的行停下来：

```bash
(gdb) break main.c:42
(gdb) break main
(gdb) break my_function
```

`break main` 在 `main` 函数入口停下。`break main.c:42` 在第 42 行停下。

查看所有断点：

```bash
(gdb) info breakpoints
```

删除断点：

```bash
(gdb) delete 1
```

## 步进

断点命中后，你可以控制执行节奏：

| 命令 | 作用 |
|------|------|
| `next` (或 `n`) | 执行下一行，不进入函数 |
| `step` (或 `s`) | 执行下一行，进入函数 |
| `finish` | 运行到当前函数返回 |
| `continue` (或 `c`) | 继续运行到下一个断点 |
| `until` | 运行到指定行 |

## 查看变量

```bash
(gdb) print x
(gdb) print &x
(gdb) print arr[2]
(gdb) print *ptr
```

`print` 会显示变量当前的值。加 `&` 显示地址。

查看所有局部变量：

```bash
(gdb) info locals
```

查看函数参数：

```bash
(gdb) info args
```

## 调用栈

程序崩了之后，第一个问题：它在哪里崩的？

```bash
(gdb) backtrace
# 或简写
(gdb) bt
```

GDB 会显示从 `main` 到崩溃位置的完整调用链。每一帧是一个函数调用。

切换到不同的帧看看：

```bash
(gdb) frame 2
(gdb) info locals
```

## 常见场景

### 段错误

```bash
gdb ./myprogram
(gdb) run
# 程序崩溃，GDB 会停在崩溃位置
(gdb) bt
# 看到是哪一行、哪个指针出了问题
(gdb) print ptr
# 哦，果然是空指针
```

### 条件断点

只在特定条件下停下：

```bash
(gdb) break main.c:42 if i > 100
```

这样就不用手动按 `continue` 一百次了。

### 监视点

变量发生变化时停下：

```bash
(gdb) watch x
```

当 `x` 的值被修改时，GDB 会立即停下。

### 修改变量

调试时可以直接改值：

```bash
(gdb) set var i = 0
```

这在测试循环或边界条件时很有用。

## .gdbinit

每次启动 GDB 都要敲一遍 `set pagination off`？写进配置文件。

`~/.gdbinit`：

```
set pagination off
set confirm off
set print pretty on
```

GDB 启动时自动加载。省事。

## 实用技巧

- **`Enter`** 重复上一条命令。连续 `next` 时很有用。
- **`list`** 显示源码上下文。`list 20,30` 显示 20 到 30 行。
- **`display x`** 每次停下时自动打印 `x` 的值。
- **`quit`** 退出 GDB。
- **`help`** 记不住命令时用。

## 总结

调试不是猜谜。GDB 告诉你真相。

编译加 `-g`。崩了就用 `bt`。看变量就用 `print`。单步就用 `n` 和 `s`。

先记住这三个。遇到新问题再学新命令。
