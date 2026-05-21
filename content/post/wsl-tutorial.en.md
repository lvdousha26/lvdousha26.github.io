---
title: "Getting Started with WSL"
description: "A practical WSL tutorial for beginners — a complete guide to seamlessly using Linux on Windows"
keywords: "wsl,windows,linux,development environment,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - WSL
  - Linux
  - Tutorial
  - Gadgets
---

## What is WSL

WSL (Windows Subsystem for Linux) lets you run a native Linux kernel directly on Windows without a virtual machine. File sharing, network sharing, GPU passthrough — it is like having a Linux development environment built into Windows.

**WSL 2** is recommended (full Linux kernel, better performance).

<!--more-->

## Installation

```powershell
# PowerShell as Administrator — one command is all it takes
wsl --install
```

Ubuntu is installed by default. After rebooting, open the Ubuntu terminal and set up your username and password.

```bash
# Check status
wsl --status
wsl -l -v          # List installed distributions

# Shut down WSL (free memory, restart the VM)
wsl --shutdown
```

## Installing Other Distributions

```bash
# List available distributions
wsl -l -o

# Install a specific distribution
wsl --install -d Debian
wsl --install -d Ubuntu-24.04

# Change the default distribution
wsl --set-default Ubuntu-24.04
```

## File Sharing Between Windows and WSL

```bash
# Access Windows files from within WSL
cd /mnt/c/Users/your-username/
ls /mnt/e/blog/

# Access WSL files from Windows
# Type in the File Explorer address bar:
\\wsl$\Ubuntu\home\your-username\
```

Key principle: **Keep project files inside WSL** (`/home/xxx/projects/`), not in `/mnt/c/`. Cross-filesystem performance is more than 10x slower.

After installing the `WSL` extension in VS Code, simply run `code .` in the WSL directory to open it.

## Development Environment Setup

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install development tools
sudo apt install build-essential git curl wget

# Install Python (use uv for version management, see the uv tutorial)
sudo apt install python3 python3-pip

# Install Node.js (use nvm for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
```

## One-Click Install of Common Development Tools

```bash
# Git
sudo apt install git

# Docker (via Docker Desktop's WSL integration)
# Install Docker Desktop for Windows, then enable WSL integration in settings

# VS Code Remote
# Install VS Code + Remote WSL extension on Windows
# Run code . in the WSL terminal — it connects automatically
```

## Performance and Configuration

### Limiting Memory Usage

Create a `.wslconfig` file in your Windows user directory:

```ini
# C:\Users\your-username\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=4GB
```

Without setting limits, WSL will consume all available memory.

### Network Issues

```bash
# If Git or apt is slow, switch to a domestic mirror
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list

# Set up a proxy (if using Clash)
export http_proxy=http://$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):7890
export https_proxy=$http_proxy
```

### systemd Support

WSL 2 has systemd enabled by default (configured in `/etc/wsl.conf`):

```ini
[boot]
systemd=true
```

## Practical Tips

```bash
# Run Windows programs directly from WSL
notepad.exe ~/.bashrc            # Edit with Windows Notepad
explorer.exe .                   # Open the current directory in File Explorer

# Run WSL commands from Windows Terminal
# In PowerShell or CMD:
wsl ls -la
wsl bash -c "cd /home && ./deploy.sh"
```

## Summary

| Command | Purpose |
|---------|---------|
| `wsl --install` | Install |
| `wsl -l -v` | List distributions |
| `wsl --shutdown` | Shut down (free memory) |
| `wsl --install -d Name` | Install another distribution |
| `code .` | Open current directory in VS Code |
| `.wslconfig` | Limit resource usage |
| `\\wsl$\` | Access WSL files from Windows |

WSL 2 is the best Linux development solution on Windows today — lighter than a VM, more convenient than dual booting.
