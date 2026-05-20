---
title: "SSH 入门"
description: "面向初学者的 SSH 实用教程，涵盖密钥认证、端口转发和常用配置"
keywords: "ssh,远程连接,服务器,安全,教程"

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

## 什么是 SSH

SSH（Secure Shell）是通过加密通道远程登录服务器的标准协议。不仅用于远程执行命令，还能安全传输文件、转发端口、搭建隧道。

<!--more-->

## 基础连接

```bash
# 用密码登录
ssh user@192.168.1.100

# 指定端口（默认 22）
ssh -p 2222 user@host

# 执行单条命令
ssh user@host "ls -la /var/log"
```

## 密钥认证：更安全且不用输密码

密码登录有两大问题：每次要输，容易暴破。密钥认证是标准做法。

```bash
# 1. 在本地生成密钥对
ssh-keygen -t ed25519 -C "your@email.com"
# 公钥：~/.ssh/id_ed25519.pub
# 私钥：~/.ssh/id_ed25519 （绝不外传）

# 2. 把公钥复制到服务器
ssh-copy-id user@host

# 3. 之后直接登录，无需密码
ssh user@host
```

推荐 Ed25519 算法而不是 RSA：同等安全强度下密钥更短、速度更快。

## SSH Config：给每台机器起别名

编辑 `~/.ssh/config`：

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

之后直接 `ssh my-server`，不用每次记 IP 和端口。

## 文件传输

```bash
# scp：安全复制文件
scp local.txt user@host:/remote/path/    # 本地上传
scp user@host:/remote/file ./            # 下载到本地
scp -r src/ user@host:/remote/           # 递归传目录
scp -P 2222 file user@host:/path/        # 指定端口

# rsync：增量同步（更快，支持断点续传）
rsync -avz ./dist/ user@host:/var/www/   # 同步目录
rsync -avz --delete ./dist/ user@host:/var/www/  # 删除远程多余文件
```

scp 适合传单个文件，rsync 适合大型目录同步和部署。

## 端口转发（隧道）

```bash
# 本地端口转发：访问本地 8080 等于访问远程 3000
ssh -L 8080:localhost:3000 user@host
# 现在打开 http://localhost:8080 就能访问远程的 3000 端口

# 远程端口转发：让远程服务器能访问你本地的服务
ssh -R 9090:localhost:3000 user@host

# 动态转发（SOCKS 代理）
ssh -D 1080 user@host
```

本地端口转发最常用：比如远程服务器上跑了 Jupyter，你不需要暴露端口，直接通过 SSH 隧道访问。

## Keep Alive：防止空闲断连

在 `~/.ssh/config` 中加入：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

每 60 秒发一次心跳，连续 3 次无响应才断开。VS Code Remote 用户必备。

## 安全建议

```bash
# 服务器端 /etc/ssh/sshd_config 推荐配置：
PermitRootLogin no              # 禁止 root 直接登录
PasswordAuthentication no        # 禁用密码，只允许密钥
Port 2222                        # 改掉默认 22 端口
```

- 私钥文件权限必须是 600：`chmod 600 ~/.ssh/id_ed25519`
- 永远不要分享私钥
- 定期 `ssh -v` 排查连接问题

## 常用速查

| 命令 | 用途 |
|------|------|
| `ssh user@host` | 远程登录 |
| `ssh-keygen -t ed25519` | 生成密钥对 |
| `ssh-copy-id user@host` | 上传公钥 |
| `scp file user@host:/path` | 传输文件 |
| `rsync -avz src/ dest/` | 同步目录 |
| `ssh -L 8080:localhost:3000 proxy` | 本地端口转发 |
| `~/.ssh/config` | 连接配置别名 |
