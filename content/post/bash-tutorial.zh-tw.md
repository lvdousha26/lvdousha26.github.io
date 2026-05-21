---
title: "Bash 入門"
description: "面向初學者的 Bash 實用教程，涵蓋基礎語法、常用命令和腳本技巧"
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


## 爲什麼要學 Bash

日常開發中大量重複操作——編譯、打包、部署、查日誌、批量改名——如果每次手動敲一遍，效率極低。Bash 讓你用幾行命令自動完成這些事。

Bash 是 Unix/Linux 默認的命令行解釋器，macOS 自帶，Windows 可通過 WSL 或 Git Bash 使用。

<!--more-->

## 基礎操作

```bash
# 文件與目錄
ls          # 列出文件
cd dir      # 切換目錄
pwd         # 當前路徑
mkdir dir   # 創建目錄
rm file     # 刪除文件
rm -r dir   # 遞歸刪除目錄
cp src dst  # 複製
mv src dst  # 移動/重命名

# 查看文件內容
cat file           # 全文輸出
head -n 20 file    # 前 20 行
tail -f file       # 實時追蹤末尾（看日誌）
less file          # 分頁瀏覽

# 權限
chmod +x script.sh   # 添加可執行權限
chmod 755 script.sh  # 數字方式設置權限
```

## 管道與重定向

```bash
# 管道：前一個命令的輸出作爲後一個命令的輸入
cat log.txt | grep ERROR | wc -l    # 統計 ERROR 出現次數

# 重定向：將輸出寫入文件
ls > output.txt          # 覆蓋寫入
ls >> output.txt         # 追加寫入
command 2>&1             # 標準錯誤重定向到標準輸出
command > /dev/null      # 丟棄所有輸出
```

## 最常用的命令組合

```bash
# grep：搜索文本
grep "關鍵詞" file
grep -r "TODO" src/          # 遞歸搜索目錄
ps aux | grep nginx           # 查找進程

# find：搜索文件
find . -name "*.log"          # 按名稱查找
find . -mtime -7              # 最近 7 天修改的文件
find . -name "*.tmp" -delete  # 查找並刪除

# awk / sed：文本處理
awk '{print $1}' file         # 打印第一列
sed 's/old/new/g' file        # 全文替換
sed -i 's/old/new/g' file     # 直接修改文件
```

## 變量與循環

```bash
# 變量（注意等號兩邊不能有空格）
name="world"
echo "Hello, $name"
echo "文件數: $(ls | wc -l)"

# for 循環
for file in *.txt; do
    echo "處理: $file"
    wc -l "$file"
done

# while 循環
count=1
while [ $count -le 5 ]; do
    echo "第 $count 次"
    count=$((count + 1))
done
```

## 條件判斷

```bash
# 文件測試
[ -f file ]   # 是普通文件
[ -d dir ]    # 是目錄
[ -x file ]   # 可執行

# 字符串比較
[ "$a" = "$b" ]     # 相等
[ -z "$str" ]       # 字符串爲空

# if 語句
if [ -f "config.yml" ]; then
    echo "配置文件存在"
else
    echo "請創建 config.yml"
fi
```

## 簡單腳本模板

```bash
#!/bin/bash
set -euo pipefail   # 遇到錯誤立即退出，未定義變量報錯

echo "=== 開始部署 ==="

# 構建
cd /path/to/project
npm run build

# 同步到服務器
rsync -avz dist/ user@server:/var/www/html/

echo "=== 部署完成 ==="
```

`set -euo pipefail` 是腳本安全標配，防止命令失敗後繼續執行。

## 實用別名

在 `~/.bashrc` 中加入：

```bash
alias ll='ls -alF'
alias gs='git status'
alias gp='git push'
alias gc='git commit'
alias ..='cd ..'
alias ...='cd ../..'

# 重新加載配置
alias reload='source ~/.bashrc'
```

## 總結

| 命令 | 用途 |
|------|------|
| `ls / cd / pwd` | 文件和目錄導航 |
| `cat / head / tail / less` | 查看文件內容 |
| `grep` | 文本搜索 |
| `|` (管道) | 連接命令 |
| `>` / `>>` | 輸出重定向 |
| `for / while / if` | 控制流 |
| `$(...)` | 命令替換 |
| `chmod` | 權限管理 |

Bash 的核心思想：組合小工具完成複雜任務。掌握管道、重定向、變量和控制流，你就能寫出高效的命令行工作流。
