---
title: "uv入門"
description: "初心者向けuv実用チュートリアル。Rustで書かれたpipの代替品、10〜100倍高速"
keywords: "uv,python,パッケージマネージャー,pip,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - uv
  - Python
  - チュートリアル
  - ツール
---

## uvとは

[uv](https://github.com/astral-sh/uv) はAstral（Ruffのチーム）がRustで書いたPythonパッケージ兼プロジェクトマネージャーで、`pip`、`pip-tools`、`virtualenv`、`pyenv` を1つのツールで代替する。

核となるセールスポイント：**10〜100倍高速**。依存関係の解決とパッケージのインストールがほぼ瞬時に完了する。

<!--more-->

## インストール

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# またはpipを使用
pip install uv
```

## パッケージ管理（pipの代替）

```bash
# パッケージのインストール（pip installより10〜100倍高速）
uv pip install numpy pandas requests
uv pip install -r requirements.txt

# アンインストール
uv pip uninstall numpy

# インストール済みパッケージの一覧
uv pip list

# 現在の依存関係を凍結
uv pip freeze > requirements.txt

# 依存関係のコンパイル（バージョン固定された依存ファイルを生成）
uv pip compile requirements.in -o requirements.txt
```

`uv pip compile` はpip-toolsの代替で、緩やかな `requirements.in` からバージョンロックされた `requirements.txt` を生成する。

## 仮想環境（virtualenvの代替）

```bash
# 仮想環境の作成
uv venv
uv venv myenv --python 3.12

# アクティベート（標準のvenvと同じ）
source .venv/bin/activate    # Linux/macOS
.venv\Scripts\activate       # Windows
```

## Pythonバージョン管理（pyenvの代替）

```bash
# 指定したPythonバージョンのインストール
uv python install 3.12
uv python install 3.11 3.12 3.13   # 一度に複数インストール

# インストール済みPythonの一覧
uv python list

# 環境作成時にバージョンを指定
uv venv --python 3.12
```

## プロジェクト管理（uv init）

uvは `poetry` や `npm` に似たプロジェクト管理モードをサポート：

```bash
# プロジェクトの初期化（pyproject.tomlを作成）
uv init my-project
cd my-project

# 依存関係の追加
uv add numpy pandas
uv add --dev pytest ruff       # 開発用依存関係

# スクリプトの実行
uv run python main.py
uv run pytest                  # ツールを直接実行

# 依存関係のロック
uv lock
uv sync                        # 全依存関係をインストール
```

## uv vs 従来のツール

| 操作 | 従来の方法 | uv |
|------|-----------|-----|
| パッケージインストール | `pip install` | `uv pip install` |
| 仮想環境 | `python -m venv` | `uv venv` |
| Pythonのインストール | `pyenv install` | `uv python install` |
| 依存関係ロック | `pip-tools` | `uv pip compile` |
| プロジェクト管理 | `poetry` | `uv init / add / run` |

1つのツールですべての工程を貫通し、速度も圧倒的。

## 移行のすすめ

| シナリオ | 提案 |
|---------|------|
| 新規プロジェクト | 直接 `uv init` + `uv add` を使用 |
| 既存プロジェクト | `uv pip install -r requirements.txt` でpipを置き換え |
| 既存のconda環境 | uvでpip部分を代替、condaはPythonバージョン管理に |
| CI/CD | `pip install` を `uv pip install` に変更するだけでビルドが大幅に高速化 |

## よく使うコマンド一覧

| コマンド | 用途 |
|---------|------|
| `uv pip install pkg` | パッケージのインストール |
| `uv pip compile requirements.in` | 依存関係のロック |
| `uv venv --python 3.12` | 仮想環境の作成 |
| `uv python install 3.12` | Pythonのインストール |
| `uv init project` | プロジェクトの初期化 |
| `uv add pkg` | プロジェクト依存関係の追加 |
| `uv run script.py` | スクリプトの実行 |
| `uv sync` | 依存関係の同期 |
