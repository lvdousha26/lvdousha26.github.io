---
title: "Conda入門"
description: "初心者向けConda実用チュートリアル。仮想環境、パッケージ管理、プロジェクト分離をマスターする"
keywords: "conda,anaconda,python,環境管理,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Conda
  - Python
  - チュートリアル
  - ツール
---

## なぜCondaを使うのか

Pythonプロジェクト最大の痛点：プロジェクトごとに異なるバージョンのPythonやライブラリに依存する。グローバルにインストールすると必ず衝突する——Aプロジェクトはpandas 1.x、Bプロジェクトはpandas 2.xが必要。

Condaは**仮想環境**によってこの問題を解決する：各プロジェクトに独立したPythonバージョンとパッケージセットを持たせ、互いに干渉しない。

<!--more-->

## インストール

**Miniconda**（基本コンポーネントのみで軽量）を推奨。Anaconda（何百もの使わないパッケージがプリインストールされている）は入れないこと。

```bash
# Minicondaのダウンロード
# https://docs.anaconda.com/miniconda/

# インストール後に初期化（使用するshellを指定）
conda init bash
# ターミナル再起動後に有効
```

## 環境管理

```bash
# 環境の作成（Pythonバージョンを指定）
conda create -n myproject python=3.12

# 環境作成と同時にパッケージをインストール
conda create -n ml-env python=3.11 numpy pandas matplotlib

# 全環境の一覧表示
conda env list

# 環境のアクティベート / 非アクティベート
conda activate myproject
conda deactivate

# 環境の削除
conda remove -n myproject --all

# 環境設定のエクスポート
conda env export > environment.yml

# 設定ファイルから環境を再構築
conda env create -f environment.yml
```

## パッケージ管理

```bash
# パッケージのインストール
conda install numpy pandas
conda install -c conda-forge pytorch    # 指定したチャンネルからインストール

# インストール済みパッケージの確認
conda list
conda list | grep numpy

# パッケージの更新
conda update numpy
conda update --all           # 全パッケージを更新（慎重に使用）

# パッケージのアンインストール
conda remove numpy
```

## Channel（ソフトウェアソース）

Condaはchannelからパッケージをダウンロードする。デフォルトの `defaults` channelは公式ソースだが、`conda-forge` コミュニティソースの方がパッケージが豊富で更新も早い。

```bash
# conda-forge をデフォルトチャンネルに設定（推奨）
conda config --add channels conda-forge
conda config --set channel_priority strict

# 現在の設定を確認
conda config --show channels
```

conda-forgeをデフォルトソースに設定することを推奨。パッケージのバージョンがより充実しており、互換性も高い。

## ベストプラクティス

```bash
# プロジェクトごとに1つの環境を作成し、baseを汚染しない
conda create -n project-a python=3.12
conda activate project-a
pip install -r requirements.txt    # condaでインストールできないパッケージはpipを使用

# base環境には何もインストールしない
# conda install xxx  ← 非推奨！
```

condaとpipは併用可能だが、経験則として：**まずconda install、次にpip install**。condaで解決できるものはcondaを使い、condaにないものはpipを使う。

## 高速化のコツ

```bash
# libmamba solverの使用（デフォルトのソルバーより10倍以上高速）
conda install -n base conda-libmamba-solver
conda config --set solver libmamba

# 国内ミラーの使用（中国国内の場合）
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

`libmamba solver` はここ2年で最も重要な最適化であり、環境依存関係の解決時間が数分から数秒に短縮される。

## よく使うコマンド一覧

| コマンド | 用途 |
|---------|------|
| `conda create -n name python=3.12` | 環境の作成 |
| `conda activate name` | 環境のアクティベート |
| `conda deactivate` | 環境の非アクティベート |
| `conda env list` | 全環境の一覧表示 |
| `conda install pkg` | パッケージのインストール |
| `conda list` | 現在の環境のパッケージ一覧 |
| `conda env export > env.yml` | 環境のエクスポート |
| `conda remove -n name --all` | 環境の削除 |
