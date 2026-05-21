---
title: "Docker入門：怖がらなくても大丈夫"
description: "コンテナにまったく触れたことがない人向けに、Dockerのインストールから最初のコンテナ起動、Dockerfileを書いて自分のプロジェクトをデプロイするまでを解説"
keywords: "docker,コンテナ,デプロイ,チュートリアル,入門"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Docker
  - コンテナ
  - デプロイ
  - チュートリアル
  - ツール
---

正直なところ、私も最初はDockerに戸惑いました。イメージ、コンテナ、Dockerfile…いくつかのチュートリアルを読んでようやくnginxを立ち上げられました。その後仕事で使い続けるうちに、核となる概念は片手で数えられるほどだと気づきました。この記事ではできるだけわかりやすく説明します。

<!--more-->

## Dockerは一体何を解決するのか

あなたが自分のPCでPythonプロジェクトを書いたと想像してください。Python 3.12、たくさんのpipパッケージをインストール済み。それを友達に渡して動かそうとすると、友達の環境はPython 3.9でパッケージのバージョンも違い、動きません。

Dockerがやること：コードと**それに必要なすべて**（Pythonのバージョン、システムライブラリ、環境変数）を1つの標準化された箱にパッケージ化します。この箱はDockerがインストールされたどんなマシンでも、全く同じように動作します。

## インストール

```bash
# macOS — OrbStack推奨、Docker Desktopより軽快
brew install orbstack

# または公式Docker Desktopをインストール
brew install --cask docker

# Windows
winget install Docker.DockerDesktop

# Ubuntu
sudo apt install docker.io
sudo usermod -aG docker $USER  # 毎回sudoしなくて済む
```

確認：

```bash
docker run hello-world
```

"Hello from Docker!" と表示されればOKです。

## 3つの核となる概念

### イメージ(Image) — レシピ

イメージは読み取り専用のテンプレートです。例えば `python:3.12` イメージにはUbuntu + Python 3.12が入っています。「環境が整ったzipパッケージ」だと想像してください。

### コンテナ(Container) — 出来上がった料理

コンテナはイメージの実行インスタンスです。1つのイメージから複数のコンテナを起動でき、それぞれ互いに隔離されています。コンテナを停止して再起動してもデータは失われません（明示的に削除しない限り）。

### Dockerfile — 自分でレシピを書く

プロジェクトでPython以外にも特定の依存関係や設定ファイルが必要な場合、Dockerfileに「ゼロからどうやってこの環境を構築するか」を記述します。

## よく使うコマンド

```bash
# ローカルのイメージ一覧
docker images

# 実行中のコンテナ一覧
docker ps

# すべてのコンテナ一覧（停止済み含む）
docker ps -a

# コンテナを実行
docker run -d --name myapp -p 8080:80 nginx
# -d  バックグラウンド実行
# --name コンテナに名前を付ける
# -p 8080:80  ホストの8080番ポートをコンテナ内の80番ポートにマッピング

# コンテナ内で操作
docker exec -it myapp bash

# 停止 / 起動 / 削除
docker stop myapp
docker start myapp
docker rm myapp       # コンテナ削除
docker rmi nginx      # イメージ削除

# 使っていないコンテナ、イメージ、ネットワークを掃除
docker system prune -a
```

## Pythonプロジェクトを動かす

シンプルな `main.py` があるとします：

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### Dockerfileを書く

```dockerfile
# 公式Pythonイメージをベースに
FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存ファイルを先にコピー（キャッシュを活用、再インストール防止）
COPY requirements.txt .
RUN pip install -r requirements.txt

# プロジェクトコードをコピー
COPY . .

# ポートを公開
EXPOSE 5000

# 起動コマンド
CMD ["python", "main.py"]
```

### ビルドと実行

```bash
# イメージをビルド
docker build -t my-python-app .

# コンテナを実行
docker run -d -p 5000:5000 --name myapp my-python-app

# http://localhost:5000 にアクセスすると Hello from Docker! が表示される
```

## Docker Compose — 複数サービスをまとめて起動

app + データベース + Redisなど複数のコンテナがある場合、いちいち `docker run` するのは面倒です。`docker-compose.yml` で一括管理：

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# 全サービスを一発起動
docker compose up -d

# ログを確認
docker compose logs -f app

# 停止
docker compose down
```

## データ永続化 — Volume

コンテナを削除すると中のデータも消えます。データを残したい場合はVolumeをマウントします：

```bash
# 名前付きボリュームを作成
docker volume create mydata

# コンテナにマウント
docker run -v mydata:/app/data myapp

# またはホストのディレクトリを直接マウント
docker run -v ./local_folder:/app/data myapp
```

Docker Compose内で `volumes:` と書くのも同じです。

## 実際の開発での使い方

私はだいたいこうしています：

1. **ローカル開発**：Pythonを直接実行（デバッグが便利）
2. **テスト環境**：`docker compose up` で一式起動
3. **人に渡すとき**：Dockerfile + composeを渡して、`git clone` 後1行のコマンドで起動
4. **デプロイ**：サーバーでも `docker compose up -d`

一番のメリット：サーバーを変えても環境を再セットアップする必要がなく、プロジェクトの移行はcomposeとDockerfileを一式持っていくだけです。

## よくある落とし穴

**イメージが大きすぎる**：`python:3.12-slim` を使ってください。`python:3.12` は数百MB大きいです。

**ビルドが遅い**：`COPY requirements.txt .` と `RUN pip install` を `COPY . .` より前に置きましょう。コードを変更してもパッケージの再インストールが発生しなくなります。

**ポートマッピングを間違える**：`-p ホストポート:コンテナポート` の順番です。逆にしないように。

**コンテナが起動直後に終了する**：`docker logs コンテナ名` でログを確認しましょう。ほとんどの場合、起動コマンドが実行完了して終了しているだけです。フォアグラウンドに常駐プロセスがないのが原因です。

## クイックリファレンス

| 要件 | コマンド |
|------|----------|
| コンテナを実行 | `docker run -d -p 8080:80 --name xxx イメージ名` |
| コンテナ内に入る | `docker exec -it xxx bash` |
| ログを見る | `docker logs -f xxx` |
| イメージをビルド | `docker build -t 名前 .` |
| 複数サービスを管理 | `docker compose up -d` |
| すべて停止 | `docker compose down` |
| 大掃除 | `docker system prune -a` |
| リソース使用量を確認 | `docker stats` |

私が初心者だった頃に踏んだ落とし穴はだいたい書きました。Dockerの入門は難しくありません。本当に複雑なのはクラスタリングとオーケストレーションですが、それは最初から気にする必要はありません。まずは単一プロジェクトのイメージ構築とコンテナ起動をマスターすれば、日常使いでは十分です。
