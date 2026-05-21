---
title: "Conda 入門"
description: "面向初學者的 Conda 實用教程，掌握虛擬環境、包管理和項目隔離"
keywords: "conda,anaconda,python,環境管理,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Conda
  - Python
  - 教程
  - 小工具
---


## 爲什麼要用 Conda

Python 項目最大的痛點：不同項目依賴不同版本的 Python 和庫。全局安裝必然衝突——A 項目要 pandas 1.x，B 項目要 pandas 2.x。

Conda 通過**虛擬環境**解決這個問題：每個項目有獨立的 Python 版本和包集合，互不干擾。

<!--more-->

## 安裝

推薦 **Miniconda**（只有基礎組件，體量小），不要裝 Anaconda（預裝幾百個用不着的包）。

```bash
# 下載 Miniconda
# https://docs.anaconda.com/miniconda/

# 安裝後初始化（選哪個 shell 就初始化哪個）
conda init bash
# 重啓終端後生效
```

## 環境管理

```bash
# 創建環境（指定 Python 版本）
conda create -n myproject python=3.12

# 創建環境並同時裝包
conda create -n ml-env python=3.11 numpy pandas matplotlib

# 查看所有環境
conda env list

# 激活 / 退出環境
conda activate myproject
conda deactivate

# 刪除環境
conda remove -n myproject --all

# 導出環境配置
conda env export > environment.yml

# 從配置文件重建環境
conda env create -f environment.yml
```

## 包管理

```bash
# 安裝包
conda install numpy pandas
conda install -c conda-forge pytorch    # 從指定 channel 安裝

# 查看已安裝的包
conda list
conda list | grep numpy

# 更新包
conda update numpy
conda update --all           # 更新所有包（謹慎使用）

# 卸載包
conda remove numpy
```

## Channel（軟件源）

Conda 從 channel 下載包，默認的 `defaults` channel 是官方源，但 `conda-forge` 社區源包更多、更新更快。

```bash
# 設置 conda-forge 爲默認 channel（推薦）
conda config --add channels conda-forge
conda config --set channel_priority strict

# 查看當前配置
conda config --show channels
```

推薦設置 conda-forge 爲默認源，包版本更全，兼容性更好。

## 最佳實踐

```bash
# 每個項目一個環境，不要污染 base
conda create -n project-a python=3.12
conda activate project-a
pip install -r requirements.txt    # conda 裝不了的包用 pip

# 不要在 base 環境裝東西
# conda install xxx  ← 不推薦！
```

conda 和 pip 可以混用，但有一個經驗法則：**先 conda install，再 pip install**。conda 能解決的用 conda，conda 沒有的用 pip。

## 提速技巧

```bash
# 使用 libmamba solver（比默認求解器快 10 倍+）
conda install -n base conda-libmamba-solver
conda config --set solver libmamba

# 使用國內鏡像（如果在國內）
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

`libmamba solver` 是近兩年最關鍵的優化，求解環境依賴從幾分鐘縮短到幾秒。

## 常用速查

| 命令 | 用途 |
|------|------|
| `conda create -n name python=3.12` | 創建環境 |
| `conda activate name` | 激活環境 |
| `conda deactivate` | 退出環境 |
| `conda env list` | 列出所有環境 |
| `conda install pkg` | 安裝包 |
| `conda list` | 列出當前環境包 |
| `conda env export > env.yml` | 導出環境 |
| `conda remove -n name --all` | 刪除環境 |
