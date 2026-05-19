---
title: "Bash 从入门到熟练：命令行效率指南"
description: "面向初学者的 Bash 实用教程，涵盖基础语法、常用命令和脚本技巧"
keywords: "bash,shell,命令行,linux,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Bash
  - 教程
  - 小工具
---

## 为什么要学 Bash

日常开发中大量重复操作——编译、打包、部署、查日志、批量改名——如果每次手动敲一遍，效率极低。Bash 让你用几行命令自动完成这些事。

Bash 是 Unix/Linux 默认的命令行解释器，macOS 自带，Windows 可通过 WSL 或 Git Bash 使用。

<!--more-->

## 基础操作

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

## 管道与重定向

```bash
# 管道：前一个命令的输出作为后一个命令的输入
cat log.txt | grep ERROR | wc -l    # 统计 ERROR 出现次数

# 重定向：将输出写入文件
ls > output.txt          # 覆盖写入
ls >> output.txt         # 追加写入
command 2>&1             # 标准错误重定向到标准输出
command > /dev/null      # 丢弃所有输出
```

## 最常用的命令组合

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

## 变量与循环

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

## 条件判断

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

## 简单脚本模板

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

`set -euo pipefail` 是脚本安全标配，防止命令失败后继续执行。

## 实用别名

在 `~/.bashrc` 中加入：

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

## 总结

| 命令 | 用途 |
|------|------|
| `ls / cd / pwd` | 文件和目录导航 |
| `cat / head / tail / less` | 查看文件内容 |
| `grep` | 文本搜索 |
| `|` (管道) | 连接命令 |
| `>` / `>>` | 输出重定向 |
| `for / while / if` | 控制流 |
| `$(...)` | 命令替换 |
| `chmod` | 权限管理 |

Bash 的核心思想：组合小工具完成复杂任务。掌握管道、重定向、变量和控制流，你就能写出高效的命令行工作流。
