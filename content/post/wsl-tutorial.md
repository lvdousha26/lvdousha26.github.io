---
title: "WSL 从入门到熟练：Windows 上的 Linux 开发环境"
description: "面向初学者的 WSL 实用教程，在 Windows 上无缝使用 Linux 的完整指南"
keywords: "wsl,windows,linux,开发环境,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - WSL
  - Linux
  - 教程
  - 小工具
---

## 什么是 WSL

WSL（Windows Subsystem for Linux）让你在 Windows 上直接跑原生 Linux 内核，不需要虚拟机。文件互通、网络共享、GPU 直通——相当于 Windows 自带了一个 Linux 开发环境。

目前推荐 **WSL 2**（完整 Linux 内核，性能更好）。

<!--more-->

## 安装

```powershell
# PowerShell 管理员模式，一条命令搞定
wsl --install
```

默认装 Ubuntu。重启后打开 Ubuntu 终端，设置用户名密码即可。

```bash
# 查看状态
wsl --status
wsl -l -v          # 列出已安装的发行版

# 关闭 WSL（释放内存，重启虚拟机）
wsl --shutdown
```

## 安装其他发行版

```bash
# 查看可用的发行版
wsl -l -o

# 安装指定发行版
wsl --install -d Debian
wsl --install -d Ubuntu-24.04

# 切换默认
wsl --set-default Ubuntu-24.04
```

## 文件互通

```bash
# 在 WSL 中访问 Windows 文件
cd /mnt/c/Users/用户名/
ls /mnt/e/blog/

# 在 Windows 中访问 WSL 文件
# 资源管理器地址栏输入：
\\wsl$\Ubuntu\home\用户名\
```

关键原则：**项目文件放 WSL 内**（`/home/xxx/projects/`），不要放 `/mnt/c/`。跨文件系统性能差 10 倍以上。

VS Code 装 `WSL` 扩展后，在 WSL 目录下 `code .` 即可打开。

## 开发环境配置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 装开发工具
sudo apt install build-essential git curl wget

# 装 Python（用 uv 管理版本，见 uv 教程）
sudo apt install python3 python3-pip

# 装 Node.js（用 nvm 管理版本）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
```

## 常用开发工具一键安装

```bash
# Git
sudo apt install git

# Docker（通过 Docker Desktop 的 WSL 集成）
# 装 Docker Desktop for Windows，设置中启用 WSL 集成即可

# VS Code Remote
# 在 Windows 装 VS Code + Remote WSL 扩展
# 在 WSL 终端中 code . 自动连接
```

## 性能与配置

### 限制内存使用

在 Windows 用户目录创建 `.wslconfig`：

```ini
# C:\Users\你的用户名\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=4GB
```

不加限制的话 WSL 会吃满内存。

### 网络问题

```bash
# 如果 Git 或 apt 很慢，换国内镜像
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list

# 设置代理（如果开了 Clash）
export http_proxy=http://$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):7890
export https_proxy=$http_proxy
```

### systemd 支持

WSL 2 已默认启用 systemd（`/etc/wsl.conf` 中配置）：

```ini
[boot]
systemd=true
```

## 实用技巧

```bash
# 在 WSL 中直接运行 Windows 程序
notepad.exe ~/.bashrc            # 用 Windows 记事本编辑
explorer.exe .                   # 打开当前目录的资源管理器

# 在 Windows 终端中运行 WSL 命令
# PowerShell 或 CMD 中：
wsl ls -la
wsl bash -c "cd /home && ./deploy.sh"
```

## 总结

| 命令 | 用途 |
|------|------|
| `wsl --install` | 安装 |
| `wsl -l -v` | 列出发行版 |
| `wsl --shutdown` | 关闭（释放内存） |
| `wsl --install -d Name` | 安装其他发行版 |
| `code .` | VS Code 打开当前目录 |
| `.wslconfig` | 限制资源使用 |
| `\\wsl$\` | 从 Windows 访问 WSL 文件 |

WSL 2 是目前 Windows 上最好的 Linux 开发方案——比虚拟机轻量，比双系统方便。
