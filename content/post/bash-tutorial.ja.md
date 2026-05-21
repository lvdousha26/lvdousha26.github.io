---
title: "Bash入門"
description: "初心者向けBash実用チュートリアル。基本構文、よく使うコマンド、スクリプト作成のコツを解説"
keywords: "bash,shell,コマンドライン,linux,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Bash
  - チュートリアル
  - 便利ツール
---

## なぜBashを学ぶのか

日常の開発では、コンパイル、パッケージング、デプロイ、ログ確認、一括リネームなど、大量の反復作業があります。毎回手動で実行するのは非効率です。Bashを使えば、数行のコマンドでこれらの作業を自動化できます。

BashはUnix/Linux標準のコマンドラインインタプリタで、macOSには標準搭載、WindowsではWSLやGit Bash経由で使用できます。

<!--more-->

## 基本操作

```bash
# 文件与目录
ls          # 列出文件
cd dir      # 切换目录
pwd         # 当前路径
mkdir dir   # 创建目录
rm file     # 删除文件
rm -r dir   # 递归删除目录
cp src dst  # 复制
mv src dst  # 移动/重命名

# 查看文件内容
cat file           # 全文输出
head -n 20 file    # 前 20 行
tail -f file       # 实时追踪末尾（看日志）
less file          # 分页浏览

# 权限
chmod +x script.sh   # 添加可执行权限
chmod 755 script.sh  # 数字方式设置权限
```

## パイプとリダイレクト

```bash
# 管道：前一个命令的输出作为后一个命令的输入
cat log.txt | grep ERROR | wc -l    # 统计 ERROR 出现次数

# 重定向：将输出写入文件
ls > output.txt          # 覆盖写入
ls >> output.txt         # 追加写入
command 2>&1             # 标准错误重定向到标准输出
command > /dev/null      # 丢弃所有输出
```

## 最もよく使うコマンドの組み合わせ

```bash
# grep：搜索文本
grep "关键词" file
grep -r "TODO" src/          # 递归搜索目录
ps aux | grep nginx           # 查找进程

# find：搜索文件
find . -name "*.log"          # 按名称查找
find . -mtime -7              # 最近 7 天修改的文件
find . -name "*.tmp" -delete  # 查找并删除

# awk / sed：文本处理
awk '{print $1}' file         # 打印第一列
sed 's/old/new/g' file        # 全文替换
sed -i 's/old/new/g' file     # 直接修改文件
```

## 変数とループ

```bash
# 变量（注意等号两边不能有空格）
name="world"
echo "Hello, $name"
echo "文件数: $(ls | wc -l)"

# for 循环
for file in *.txt; do
    echo "处理: $file"
    wc -l "$file"
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo "第 $count 次"
    count=$((count + 1))
done
```

## 条件分岐

```bash
# 文件测试
[ -f file ]   # 是普通文件
[ -d dir ]    # 是目录
[ -x file ]   # 可执行

# 字符串比较
[ "$a" = "$b" ]     # 相等
[ -z "$str" ]       # 字符串为空

# if 语句
if [ -f "config.yml" ]; then
    echo "配置文件存在"
else
    echo "请创建 config.yml"
fi
```

## シンプルなスクリプトテンプレート

```bash
#!/bin/bash
set -euo pipefail   # 遇到错误立即退出，未定义变量报错

echo "=== 开始部署 ==="

# 构建
cd /path/to/project
npm run build

# 同步到服务器
rsync -avz dist/ user@server:/var/www/html/

echo "=== 部署完成 ==="
```

`set -euo pipefail` はスクリプトの安全対策の標準で、コマンドが失敗した後に処理が継続実行されるのを防ぎます。

## 便利なエイリアス

`~/.bashrc` に追加：

```bash
alias ll='ls -alF'
alias gs='git status'
alias gp='git push'
alias gc='git commit'
alias ..='cd ..'
alias ...='cd ../..'

# 重新加载配置
alias reload='source ~/.bashrc'
```

## まとめ

| コマンド | 用途 |
|------|------|
| `ls / cd / pwd` | ファイル・ディレクトリ操作 |
| `cat / head / tail / less` | ファイル内容の表示 |
| `grep` | テキスト検索 |
| `|` (パイプ) | コマンド連結 |
| `>` / `>>` | 出力リダイレクト |
| `for / while / if` | 制御フロー |
| `$(...)` | コマンド置換 |
| `chmod` | 権限管理 |

Bashの核心理念は、小さなツールを組み合わせて複雑なタスクを実行することです。パイプ、リダイレクト、変数、制御フローをマスターすれば、効率的なコマンドラインの作業フローを構築できます。
