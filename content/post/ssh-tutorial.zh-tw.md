---
title: "SSH 入門"
description: "面向初學者的 SSH 實用教程，涵蓋密鑰認證、端口轉發和常用配置"
keywords: "ssh,遠程連接,服務器,安全,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - SSH
  - 教程
  - 小工具
---


## 什麼是 SSH

SSH（Secure Shell）是通過加密通道遠程登錄服務器的標準協議。不僅用於遠程執行命令，還能安全傳輸文件、轉發端口、搭建隧道。

<!--more-->

## 基礎連接

```bash
# 用密碼登錄
ssh user@192.168.1.100

# 指定端口（默認 22）
ssh -p 2222 user@host

# 執行單條命令
ssh user@host "ls -la /var/log"
```

## 密鑰認證：更安全且不用輸密碼

密碼登錄有兩大問題：每次要輸，容易暴破。密鑰認證是標準做法。

```bash
# 1. 在本地生成密鑰對
ssh-keygen -t ed25519 -C "your@email.com"
# 公鑰：~/.ssh/id_ed25519.pub
# 私鑰：~/.ssh/id_ed25519 （絕不外傳）

# 2. 把公鑰複製到服務器
ssh-copy-id user@host

# 3. 之後直接登錄，無需密碼
ssh user@host
```

推薦 Ed25519 算法而不是 RSA：同等安全強度下密鑰更短、速度更快。

## SSH Config：給每臺機器起別名

編輯 `~/.ssh/config`：

```
Host my-server
    HostName 123.45.67.89
    User root
    Port 2222
    IdentityFile ~/.ssh/my-server.key

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

之後直接 `ssh my-server`，不用每次記 IP 和端口。

## 文件傳輸

```bash
# scp：安全複製文件
scp local.txt user@host:/remote/path/    # 本地上傳
scp user@host:/remote/file ./            # 下載到本地
scp -r src/ user@host:/remote/           # 遞歸傳目錄
scp -P 2222 file user@host:/path/        # 指定端口

# rsync：增量同步（更快，支持斷點續傳）
rsync -avz ./dist/ user@host:/var/www/   # 同步目錄
rsync -avz --delete ./dist/ user@host:/var/www/  # 刪除遠程多餘文件
```

scp 適合傳單個文件，rsync 適合大型目錄同步和部署。

## 端口轉發（隧道）

```bash
# 本地端口轉發：訪問本地 8080 等於訪問遠程 3000
ssh -L 8080:localhost:3000 user@host
# 現在打開 http://localhost:8080 就能訪問遠程的 3000 端口

# 遠程端口轉發：讓遠程服務器能訪問你本地的服務
ssh -R 9090:localhost:3000 user@host

# 動態轉發（SOCKS 代理）
ssh -D 1080 user@host
```

本地端口轉發最常用：比如遠程服務器上跑了 Jupyter，你不需要暴露端口，直接通過 SSH 隧道訪問。

## Keep Alive：防止空閒斷連

在 `~/.ssh/config` 中加入：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

每 60 秒發一次心跳，連續 3 次無響應才斷開。VS Code Remote 用戶必備。

## 安全建議

```bash
# 服務器端 /etc/ssh/sshd_config 推薦配置：
PermitRootLogin no              # 禁止 root 直接登錄
PasswordAuthentication no        # 禁用密碼，只允許密鑰
Port 2222                        # 改掉默認 22 端口
```

- 私鑰文件權限必須是 600：`chmod 600 ~/.ssh/id_ed25519`
- 永遠不要分享私鑰
- 定期 `ssh -v` 排查連接問題

## 常用速查

| 命令 | 用途 |
|------|------|
| `ssh user@host` | 遠程登錄 |
| `ssh-keygen -t ed25519` | 生成密鑰對 |
| `ssh-copy-id user@host` | 上傳公鑰 |
| `scp file user@host:/path` | 傳輸文件 |
| `rsync -avz src/ dest/` | 同步目錄 |
| `ssh -L 8080:localhost:3000 proxy` | 本地端口轉發 |
| `~/.ssh/config` | 連接配置別名 |
