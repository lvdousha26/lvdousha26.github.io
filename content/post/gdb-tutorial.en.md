---
title: "GDB Basics: When Your Program Crashes, Take a Look"
description: "What GDB is, how to use it, and common debugging scenarios"
keywords: "GDB,Debugging,Linux,C/C++"

date: 2026-05-21T00:00:00+08:00
lastmod: 2026-05-21T00:00:00+08:00

math: false
mermaid: false

categories:
  - Backend
tags:
  - GDB
  - Debugging
  - C
---

Your program crashed. Segmentation fault. No output. You stare at the code for an hour.

Stop staring. Use GDB.

<!--more-->

## What is GDB

GDB is the GNU Debugger. It lets you see the internal state of a program while it runs.

You can stop at a specific line. Inspect variable values. Step through execution. Look at the call stack.

No need to guess where the problem is. Just ask GDB.

## Installation

Linux:

```bash
apt install gdb
```

macOS:

```bash
brew install gdb
```

After installation, run `gdb --version`. If you see output, you are good to go.

## Compilation

To make GDB work, add the `-g` flag when compiling.

```bash
gcc -g -o myprogram myprogram.c
# or
g++ -g -o myprogram myprogram.cpp
```

`-g` tells the compiler to keep debugging information. Without it, GDB doesn't know variable names or line numbers.

Do not add optimization flags like `-O2`. Optimized code does not match the source. GDB will get lost.

## Starting

```bash
gdb ./myprogram
```

When you see the `(gdb)` prompt, you are ready.

## Running

Run the program inside GDB:

```bash
(gdb) run
```

If the program needs command-line arguments:

```bash
(gdb) run arg1 arg2 arg3
```

The program will run until it finishes or crashes.

## Breakpoints

Stop at a line you care about:

```bash
(gdb) break main.c:42
(gdb) break main
(gdb) break my_function
```

`break main` stops at the entry of `main`. `break main.c:42` stops at line 42.

List all breakpoints:

```bash
(gdb) info breakpoints
```

Delete a breakpoint:

```bash
(gdb) delete 1
```

## Stepping

Once a breakpoint is hit, you can control execution:

| Command | Effect |
|---------|--------|
| `next` (or `n`) | Execute next line, do not enter functions |
| `step` (or `s`) | Execute next line, enter functions |
| `finish` | Run until the current function returns |
| `continue` (or `c`) | Continue running until next breakpoint |
| `until` | Run until a specified line |

## Inspecting Variables

```bash
(gdb) print x
(gdb) print &x
(gdb) print arr[2]
(gdb) print *ptr
```

`print` shows the current value of a variable. Add `&` to show the address.

View all local variables:

```bash
(gdb) info locals
```

View function arguments:

```bash
(gdb) info args
```

## Call Stack

After your program crashes, the first question: where did it crash?

```bash
(gdb) backtrace
# or shorthand
(gdb) bt
```

GDB shows the full call chain from `main` to the crash location. Each frame is a function call.

Switch to a different frame to look around:

```bash
(gdb) frame 2
(gdb) info locals
```

## Common Scenarios

### Segmentation Fault

```bash
gdb ./myprogram
(gdb) run
# Program crashes, GDB stops at the crash location
(gdb) bt
# See which line and which pointer caused the issue
(gdb) print ptr
# Ah, a null pointer indeed
```

### Conditional Breakpoints

Stop only under a specific condition:

```bash
(gdb) break main.c:42 if i > 100
```

That way you do not have to manually press `continue` a hundred times.

### Watchpoints

Stop when a variable changes:

```bash
(gdb) watch x
```

GDB will stop immediately whenever the value of `x` is modified.

### Modifying Variables

You can change values during debugging:

```bash
(gdb) set var i = 0
```

This is useful for testing loops or boundary conditions.

## .gdbinit

Tired of typing `set pagination off` every time you start GDB? Put it in the config file.

`~/.gdbinit`:

```
set pagination off
set confirm off
set print pretty on
```

Loaded automatically when GDB starts. Saves effort.

## Practical Tips

- **`Enter`** repeats the last command. Useful for consecutive `next` commands.
- **`list`** shows source code context. `list 20,30` shows lines 20 to 30.
- **`display x`** automatically prints the value of `x` each time execution stops.
- **`quit`** exits GDB.
- **`help`** use it when you cannot remember a command.

## Summary

Debugging is not guessing. GDB tells you the truth.

Compile with `-g`. Use `bt` when it crashes. Use `print` to inspect variables. Use `n` and `s` for stepping.

Start with these three. Learn new commands as new problems come up.
