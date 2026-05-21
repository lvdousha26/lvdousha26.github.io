---
title: "uv 入門"
description: "面向初學者的 uv 實用教程，用 Rust 寫的 pip 替代品，快 10-100 倍"
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


## 什麼是 uv

[uv](https://github.com/astral-sh/uv) 是 Astral（Ruff 的團隊）用 Rust 寫的 Python 包和項目管理器，一個工具替代 `pip`、`pip-tools`、`virtualenv`、`pyenv`。

核心賣點：**快 10-100 倍**。解析依賴和安裝包幾乎瞬間完成。

<!--more-->

## 安裝

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
# 安裝包（比 pip install 快 10-100 倍）
uv pip install numpy pandas requests
uv pip install -r requirements.txt

# 卸載
uv pip uninstall numpy

# 列出已安裝
uv pip list

# 凍結當前依賴
uv pip freeze > requirements.txt

# 編譯依賴（生成精確鎖定的依賴文件）
uv pip compile requirements.in -o requirements.txt
```

`uv pip compile` 是 pip-tools 的替代，能從寬鬆的 `requirements.in` 生成帶版本鎖定的 `requirements.txt`。

## 虛擬環境（替代 virtualenv）

```bash
# 創建虛擬環境
uv venv
uv venv myenv --python 3.12

# 激活（和標準 venv 一樣）
source .venv/bin/activate    # Linux/macOS
.venv\Scripts\activate       # Windows
```

## Python 版本管理（替代 pyenv）

```bash
# 安裝指定 Python 版本
uv python install 3.12
uv python install 3.11 3.12 3.13   # 一次裝多個

# 列出已安裝的 Python
uv python list

# 創建環境時指定版本
uv venv --python 3.12
```

## 項目管理（uv init）

uv 支持類似 `poetry` 或 `npm` 的項目管理模式：

```bash
# 初始化項目（創建 pyproject.toml）
uv init my-project
cd my-project

# 添加依賴
uv add numpy pandas
uv add --dev pytest ruff       # 開發依賴

# 運行腳本
uv run python main.py
uv run pytest                  # 直接運行工具

# 鎖定依賴
uv lock
uv sync                        # 安裝所有依賴
```

## uv vs 傳統工具

| 操作 | 傳統方式 | uv |
|------|----------|-----|
| 安裝包 | `pip install` | `uv pip install` |
| 虛擬環境 | `python -m venv` | `uv venv` |
| 安裝 Python | `pyenv install` | `uv python install` |
| 依賴鎖定 | `pip-tools` | `uv pip compile` |
| 項目管理 | `poetry` | `uv init / add / run` |

一個工具打通所有環節，且速度碾壓。

## 遷移建議

| 場景 | 建議 |
|------|------|
| 新項目 | 直接用 `uv init` + `uv add` |
| 已有項目 | `uv pip install -r requirements.txt` 替換 pip |
| 已有 conda 環境 | 用 uv 替代 pip 部分，conda 管理 Python 版本 |
| CI/CD | 把 `pip install` 換成 `uv pip install`，構建快很多 |

## 常用速查

| 命令 | 用途 |
|------|------|
| `uv pip install pkg` | 安裝包 |
| `uv pip compile requirements.in` | 鎖定依賴 |
| `uv venv --python 3.12` | 創建虛擬環境 |
| `uv python install 3.12` | 安裝 Python |
| `uv init project` | 初始化項目 |
| `uv add pkg` | 添加項目依賴 |
| `uv run script.py` | 運行腳本 |
| `uv sync` | 同步依賴 |
