---
title: "GDB入門：動かないなら覗いてみよう"
description: "GDBとは何か、使い方、よくあるデバッグシナリオ"
keywords: "GDB,デバッグ,Linux,C/C++"

date: 2026-05-21T00:00:00+08:00
lastmod: 2026-05-21T00:00:00+08:00

math: false
mermaid: false

categories:
  - バックエンド
tags:
  - GDB
  - デバッグ
  - C
---

書いたプログラムがクラッシュした。セグメンテーションフォールト。何も出力されない。コードを1時間見つめてもわからない。

そんな時は、見つめるな。GDBを使え。

<!--more-->

## GDBとは

GDBはGNU Debugger（GNUデバッガ）です。プログラム実行時の内部状態を確認できます。

特定の行で停止できる。変数の値を確認できる。1行ずつ実行できる。コールスタックを確認できる。

どこに問題があるか推測する必要はありません。GDBに聞けばいいのです。

## インストール

Linux：

```bash
apt install gdb
```

macOS：

```bash
brew install gdb
```

インストール後、`gdb --version` を実行。出力があれば成功です。

## コンパイル

GDBを動作させるには、コンパイル時に `-g` オプションを付けます。

```bash
gcc -g -o myprogram myprogram.c
# または
g++ -g -o myprogram myprogram.cpp
```

`-g` はコンパイラにデバッグ情報を保持するよう指示します。これがないと、GDBは変数名や行番号を認識できません。

`-O2` などの最適化オプションは付けないでください。最適化されたコードとソースコードが一致しなくなり、GDBが迷子になります。

## 起動

```bash
gdb ./myprogram
```

`(gdb)` プロンプトが表示されれば成功です。

## 実行

GDB内でプログラムを実行：

```bash
(gdb) run
```

プログラムにコマンドライン引数が必要な場合：

```bash
(gdb) run arg1 arg2 arg3
```

プログラムは終了するかエラーが発生するまで実行されます。

## ブレークポイント

気になる行で停止：

```bash
(gdb) break main.c:42
(gdb) break main
(gdb) break my_function
```

`break main` は `main` 関数の入り口で停止。`break main.c:42` は42行目で停止。

全てのブレークポイントを表示：

```bash
(gdb) info breakpoints
```

ブレークポイントを削除：

```bash
(gdb) delete 1
```

## ステップ実行

ブレークポイントで停止後、実行のペースを制御できます：

| コマンド | 効果 |
|----------|------|
| `next` (または `n`) | 次の行を実行、関数の中には入らない |
| `step` (または `s`) | 次の行を実行、関数の中に入る |
| `finish` | 現在の関数が戻るまで実行 |
| `continue` (または `c`) | 次のブレークポイントまで実行 |
| `until` | 指定行まで実行 |

## 変数の確認

```bash
(gdb) print x
(gdb) print &x
(gdb) print arr[2]
(gdb) print *ptr
```

`print` で変数の現在値を表示。`&` を付けるとアドレスを表示。

全てのローカル変数を表示：

```bash
(gdb) info locals
```

関数の引数を表示：

```bash
(gdb) info args
```

## コールスタック

プログラムがクラッシュした後、最初の疑問：どこでクラッシュしたのか？

```bash
(gdb) backtrace
# または短縮形
(gdb) bt
```

GDBは `main` からクラッシュ位置までの完全な呼び出し連鎖を表示します。各フレームは関数呼び出しです。

別のフレームに切り替えて確認：

```bash
(gdb) frame 2
(gdb) info locals
```

## よくあるシナリオ

### セグメンテーションフォールト

```bash
gdb ./myprogram
(gdb) run
# プログラムがクラッシュ、GDBはクラッシュ位置で停止
(gdb) bt
# どの行で、どのポインタが問題か確認
(gdb) print ptr
# やはりNULLポインタだった
```

### 条件付きブレークポイント

特定の条件でのみ停止：

```bash
(gdb) break main.c:42 if i > 100
```

これで手動で `continue` を100回押す必要がなくなります。

### ウォッチポイント

変数が変更された時に停止：

```bash
(gdb) watch x
```

`x` の値が変更されると、GDBが即座に停止します。

### 変数の変更

デバッグ中に直接値を変更：

```bash
(gdb) set var i = 0
```

これはループや境界条件のテストに便利です。

## .gdbinit

GDBを起動するたびに `set pagination off` を入力するのは面倒。設定ファイルに書きましょう。

`~/.gdbinit`：

```
set pagination off
set confirm off
set print pretty on
```

GDB起動時に自動で読み込まれます。手間いらず。

## 実用的なヒント

- **`Enter`** 直前のコマンドを繰り返す。連続で `next` する時に便利。
- **`list`** ソースコードのコンテキストを表示。`list 20,30` で20行目から30行目を表示。
- **`display x`** 停止するたびに自動で `x` の値を表示。
- **`quit`** GDBを終了。
- **`help`** コマンドを忘れた時に使う。

## まとめ

デバッグは推理ゲームではありません。GDBが真実を教えてくれます。

コンパイル時に `-g` を付ける。クラッシュしたら `bt` を使う。変数を見るなら `print`。ステップ実行には `n` と `s`。

まずはこの3つを覚えましょう。新しい問題に直面した時に、さらにコマンドを学べばいいのです。
