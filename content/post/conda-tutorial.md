---
title: "Conda 入门"
description: "面向初学者的 Conda 实用教程，掌握虚拟环境、包管理和项目隔离"
keywords: "conda,anaconda,python,环境管理,教程"

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

## 为什么要用 Conda

Python 项目最大的痛点：不同项目依赖不同版本的 Python 和库。全局安装必然冲突——A 项目要 pandas 1.x，B 项目要 pandas 2.x。

Conda 通过**虚拟环境**解决这个问题：每个项目有独立的 Python 版本和包集合，互不干扰。

<!--more-->

## 安装

推荐 **Miniconda**（只有基础组件，体量小），不要装 Anaconda（预装几百个用不着的包）。

```bash
# 下载 Miniconda
# https://docs.anaconda.com/miniconda/

# 安装后初始化（选哪个 shell 就初始化哪个）
conda init bash
# 重启终端后生效
```

## 环境管理

```bash
# 创建环境（指定 Python 版本）
conda create -n myproject python=3.12

# 创建环境并同时装包
conda create -n ml-env python=3.11 numpy pandas matplotlib

# 查看所有环境
conda env list

# 激活 / 退出环境
conda activate myproject
conda deactivate

# 删除环境
conda remove -n myproject --all

# 导出环境配置
conda env export > environment.yml

# 从配置文件重建环境
conda env create -f environment.yml
```

## 包管理

```bash
# 安装包
conda install numpy pandas
conda install -c conda-forge pytorch    # 从指定 channel 安装

# 查看已安装的包
conda list
conda list | grep numpy

# 更新包
conda update numpy
conda update --all           # 更新所有包（谨慎使用）

# 卸载包
conda remove numpy
```

## Channel（软件源）

Conda 从 channel 下载包，默认的 `defaults` channel 是官方源，但 `conda-forge` 社区源包更多、更新更快。

```bash
# 设置 conda-forge 为默认 channel（推荐）
conda config --add channels conda-forge
conda config --set channel_priority strict

# 查看当前配置
conda config --show channels
```

推荐设置 conda-forge 为默认源，包版本更全，兼容性更好。

## 最佳实践

```bash
# 每个项目一个环境，不要污染 base
conda create -n project-a python=3.12
conda activate project-a
pip install -r requirements.txt    # conda 装不了的包用 pip

# 不要在 base 环境装东西
# conda install xxx  ← 不推荐！
```

conda 和 pip 可以混用，但有一个经验法则：**先 conda install，再 pip install**。conda 能解决的用 conda，conda 没有的用 pip。

## 提速技巧

```bash
# 使用 libmamba solver（比默认求解器快 10 倍+）
conda install -n base conda-libmamba-solver
conda config --set solver libmamba

# 使用国内镜像（如果在国内）
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

`libmamba solver` 是近两年最关键的优化，求解环境依赖从几分钟缩短到几秒。

## 常用速查

| 命令 | 用途 |
|------|------|
| `conda create -n name python=3.12` | 创建环境 |
| `conda activate name` | 激活环境 |
| `conda deactivate` | 退出环境 |
| `conda env list` | 列出所有环境 |
| `conda install pkg` | 安装包 |
| `conda list` | 列出当前环境包 |
| `conda env export > env.yml` | 导出环境 |
| `conda remove -n name --all` | 删除环境 |
