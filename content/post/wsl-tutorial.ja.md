---
title: "WSL入門"
description: "初心者向けWSL実用チュートリアル。Windows上でLinuxをシームレスに使うための完全ガイド"
keywords: "wsl,windows,linux,開発環境,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - WSL
  - Linux
  - チュートリアル
  - 便利ツール
---

## WSLとは

WSL（Windows Subsystem for Linux）を使うと、Windows上で仮想マシン不要でネイティブなLinuxカーネルを直接実行できます。ファイルの相互運用、ネットワーク共有、GPUパススルー——WindowsにLinux開発環境が組み込まれているようなものです。

現在推奨されているのは **WSL 2**（完全なLinuxカーネル、より高性能）です。

<!--more-->

## インストール

```powershell
# PowerShell 管理员模式，一条命令搞定
wsl --install
```

デフォルトではUbuntuがインストールされます。再起動後にUbuntuターミナルを開き、ユーザー名とパスワードを設定するだけです。

```bash
# 查看状态
wsl --status
wsl -l -v          # 列出已安装的发行版

# 关闭 WSL（释放内存，重启虚拟机）
wsl --shutdown
```

## 他のディストリビューションのインストール

```bash
# 查看可用的发行版
wsl -l -o

# 安装指定发行版
wsl --install -d Debian
wsl --install -d Ubuntu-24.04

# 切换默认
wsl --set-default Ubuntu-24.04
```

## ファイルの相互運用

```bash
# 在 WSL 中访问 Windows 文件
cd /mnt/c/Users/用户名/
ls /mnt/e/blog/

# 在 Windows 中访问 WSL 文件
# 资源管理器地址栏输入：
\\wsl$\Ubuntu\home\用户名\
```

重要な原則：**プロジェクトファイルはWSL内に置く**（`/home/xxx/projects/`）。`/mnt/c/` に置くと、ファイルシステムを跨ぐ処理のパフォーマンスが10倍以上低下します。

VS Codeに `WSL` 拡張機能をインストールすれば、WSLのディレクトリで `code .` と入力するだけで開けます。

## 開発環境の設定

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

## よく使う開発ツールの一発インストール

```bash
# Git
sudo apt install git

# Docker（通过 Docker Desktop 的 WSL 集成）
# 装 Docker Desktop for Windows，设置中启用 WSL 集成即可

# VS Code Remote
# 在 Windows 装 VS Code + Remote WSL 扩展
# 在 WSL 终端中 code . 自动连接
```

## パフォーマンスと設定

### メモリ使用量の制限

Windowsのユーザーディレクトリに `.wslconfig` を作成：

```ini
# C:\Users\你的用户名\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=4GB
```

制限をかけないと、WSLがメモリをすべて消費してしまうことがあります。

### ネットワークの問題

```bash
# 如果 Git 或 apt 很慢，换国内镜像
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list

# 设置代理（如果开了 Clash）
export http_proxy=http://$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):7890
export https_proxy=$http_proxy
```

### systemd サポート

WSL 2 ではデフォルトでsystemdが有効になっています（`/etc/wsl.conf` で設定）：

```ini
[boot]
systemd=true
```

## 便利なテクニック

```bash
# 在 WSL 中直接运行 Windows 程序
notepad.exe ~/.bashrc            # 用 Windows 记事本编辑
explorer.exe .                   # 打开当前目录的资源管理器

# 在 Windows 终端中运行 WSL 命令
# PowerShell 或 CMD 中：
wsl ls -la
wsl bash -c "cd /home && ./deploy.sh"
```

## まとめ

| コマンド | 用途 |
|------|------|
| `wsl --install` | インストール |
| `wsl -l -v` | ディストリビューション一覧 |
| `wsl --shutdown` | シャットダウン（メモリ解放） |
| `wsl --install -d Name` | 他のディストリビューションをインストール |
| `code .` | VS Codeでカレントディレクトリを開く |
| `.wslconfig` | リソース使用量の制限 |
| `\\wsl$\` | WindowsからWSLファイルへアクセス |

WSL 2 は現在Windows上で最良のLinux開発環境です——仮想マシンより軽量で、デュアルブートより便利です。
