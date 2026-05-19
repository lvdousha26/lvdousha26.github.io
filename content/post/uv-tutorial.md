---
title: "uv 从入门到熟练：下一代 Python 包管理器"
description: "面向初学者的 uv 实用教程，用 Rust 写的 pip 替代品，快 10-100 倍"
keywords: "uv,python,包管理器,pip,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - uv
  - Python
  - 教程
  - 小工具
---

## 什么是 uv

[uv](https://github.com/astral-sh/uv) 是 Astral（Ruff 的团队）用 Rust 写的 Python 包和项目管理器，一个工具替代 `pip`、`pip-tools`、`virtualenv`、`pyenv`。

核心卖点：**快 10-100 倍**。解析依赖和安装包几乎瞬间完成。

<!--more-->

## 安装

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或者用 pip
pip install uv
```

## 包管理（替代 pip）

```bash
# 安装包（比 pip install 快 10-100 倍）
uv pip install numpy pandas requests
uv pip install -r requirements.txt

# 卸载
uv pip uninstall numpy

# 列出已安装
uv pip list

# 冻结当前依赖
uv pip freeze > requirements.txt

# 编译依赖（生成精确锁定的依赖文件）
uv pip compile requirements.in -o requirements.txt
```

`uv pip compile` 是 pip-tools 的替代，能从宽松的 `requirements.in` 生成带版本锁定的 `requirements.txt`。

## 虚拟环境（替代 virtualenv）

```bash
# 创建虚拟环境
uv venv
uv venv myenv --python 3.12

# 激活（和标准 venv 一样）
source .venv/bin/activate    # Linux/macOS
.venv\Scripts\activate       # Windows
```

## Python 版本管理（替代 pyenv）

```bash
# 安装指定 Python 版本
uv python install 3.12
uv python install 3.11 3.12 3.13   # 一次装多个

# 列出已安装的 Python
uv python list

# 创建环境时指定版本
uv venv --python 3.12
```

## 项目管理（uv init）

uv 支持类似 `poetry` 或 `npm` 的项目管理模式：

```bash
# 初始化项目（创建 pyproject.toml）
uv init my-project
cd my-project

# 添加依赖
uv add numpy pandas
uv add --dev pytest ruff       # 开发依赖

# 运行脚本
uv run python main.py
uv run pytest                  # 直接运行工具

# 锁定依赖
uv lock
uv sync                        # 安装所有依赖
```

## uv vs 传统工具

| 操作 | 传统方式 | uv |
|------|----------|-----|
| 安装包 | `pip install` | `uv pip install` |
| 虚拟环境 | `python -m venv` | `uv venv` |
| 安装 Python | `pyenv install` | `uv python install` |
| 依赖锁定 | `pip-tools` | `uv pip compile` |
| 项目管理 | `poetry` | `uv init / add / run` |

一个工具打通所有环节，且速度碾压。

## 迁移建议

| 场景 | 建议 |
|------|------|
| 新项目 | 直接用 `uv init` + `uv add` |
| 已有项目 | `uv pip install -r requirements.txt` 替换 pip |
| 已有 conda 环境 | 用 uv 替代 pip 部分，conda 管理 Python 版本 |
| CI/CD | 把 `pip install` 换成 `uv pip install`，构建快很多 |

## 常用速查

| 命令 | 用途 |
|------|------|
| `uv pip install pkg` | 安装包 |
| `uv pip compile requirements.in` | 锁定依赖 |
| `uv venv --python 3.12` | 创建虚拟环境 |
| `uv python install 3.12` | 安装 Python |
| `uv init project` | 初始化项目 |
| `uv add pkg` | 添加项目依赖 |
| `uv run script.py` | 运行脚本 |
| `uv sync` | 同步依赖 |
