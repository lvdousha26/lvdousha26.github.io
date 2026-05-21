---
title: "WSL 入門"
description: "面向初學者的 WSL 實用教程，在 Windows 上無縫使用 Linux 的完整指南"
keywords: "wsl,windows,linux,開發環境,教程"

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


## 什麼是 WSL

WSL（Windows Subsystem for Linux）讓你在 Windows 上直接跑原生 Linux 內核，不需要虛擬機。文件互通、網絡共享、GPU 直通——相當於 Windows 自帶了一個 Linux 開發環境。

目前推薦 **WSL 2**（完整 Linux 內核，性能更好）。

<!--more-->

## 安裝

```powershell
# PowerShell 管理員模式，一條命令搞定
wsl --install
```

默認裝 Ubuntu。重啓後打開 Ubuntu 終端，設置用戶名密碼即可。

```bash
# 查看狀態
wsl --status
wsl -l -v          # 列出已安裝的發行版

# 關閉 WSL（釋放內存，重啓虛擬機）
wsl --shutdown
```

## 安裝其他發行版

```bash
# 查看可用的發行版
wsl -l -o

# 安裝指定發行版
wsl --install -d Debian
wsl --install -d Ubuntu-24.04

# 切換默認
wsl --set-default Ubuntu-24.04
```

## 文件互通

```bash
# 在 WSL 中訪問 Windows 文件
cd /mnt/c/Users/用戶名/
ls /mnt/e/blog/

# 在 Windows 中訪問 WSL 文件
# 資源管理器地址欄輸入：
\\wsl$\Ubuntu\home\用戶名\
```

關鍵原則：**項目文件放 WSL 內**（`/home/xxx/projects/`），不要放 `/mnt/c/`。跨文件系統性能差 10 倍以上。

VS Code 裝 `WSL` 擴展後，在 WSL 目錄下 `code .` 即可打開。

## 開發環境配置

```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 裝開發工具
sudo apt install build-essential git curl wget

# 裝 Python（用 uv 管理版本，見 uv 教程）
sudo apt install python3 python3-pip

# 裝 Node.js（用 nvm 管理版本）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
```

## 常用開發工具一鍵安裝

```bash
# Git
sudo apt install git

# Docker（通過 Docker Desktop 的 WSL 集成）
# 裝 Docker Desktop for Windows，設置中啓用 WSL 集成即可

# VS Code Remote
# 在 Windows 裝 VS Code + Remote WSL 擴展
# 在 WSL 終端中 code . 自動連接
```

## 性能與配置

### 限制內存使用

在 Windows 用戶目錄創建 `.wslconfig`：

```ini
# C:\Users\你的用戶名\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=4GB
```

不加限制的話 WSL 會喫滿內存。

### 網絡問題

```bash
# 如果 Git 或 apt 很慢，換國內鏡像
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list

# 設置代理（如果開了 Clash）
export http_proxy=http://$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):7890
export https_proxy=$http_proxy
```

### systemd 支持

WSL 2 已默認啓用 systemd（`/etc/wsl.conf` 中配置）：

```ini
[boot]
systemd=true
```

## 實用技巧

```bash
# 在 WSL 中直接運行 Windows 程序
notepad.exe ~/.bashrc            # 用 Windows 記事本編輯
explorer.exe .                   # 打開當前目錄的資源管理器

# 在 Windows 終端中運行 WSL 命令
# PowerShell 或 CMD 中：
wsl ls -la
wsl bash -c "cd /home && ./deploy.sh"
```

## 總結

| 命令 | 用途 |
|------|------|
| `wsl --install` | 安裝 |
| `wsl -l -v` | 列出發行版 |
| `wsl --shutdown` | 關閉（釋放內存） |
| `wsl --install -d Name` | 安裝其他發行版 |
| `code .` | VS Code 打開當前目錄 |
| `.wslconfig` | 限制資源使用 |
| `\\wsl$\` | 從 Windows 訪問 WSL 文件 |

WSL 2 是目前 Windows 上最好的 Linux 開發方案——比虛擬機輕量，比雙系統方便。
