---
title: "SSH入門"
description: "初心者向けSSH実用チュートリアル。鍵認証、ポートフォワーディング、よく使う設定をカバー"
keywords: "ssh,リモート接続,サーバー,セキュリティ,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - SSH
  - チュートリアル
  - ツール
---

## SSHとは

SSH（Secure Shell）は、暗号化されたチャネルを通じてリモートサーバーにログインするための標準プロトコル。リモートコマンドの実行だけでなく、ファイルの安全な転送、ポートフォワーディング、トンネルの構築も可能。

<!--more-->

## 基本接続

```bash
# パスワードでログイン
ssh user@192.168.1.100

# ポートを指定（デフォルトは22）
ssh -p 2222 user@host

# 1つのコマンドを実行
ssh user@host "ls -la /var/log"
```

## 鍵認証：より安全でパスワード入力不要

パスワードログインには2つの大きな問題がある：毎回入力が必要、ブルートフォース攻撃を受けやすい。鍵認証が標準的な方法。

```bash
# 1. ローカルで鍵ペアを生成
ssh-keygen -t ed25519 -C "your@email.com"
# 公開鍵：~/.ssh/id_ed25519.pub
# 秘密鍵：~/.ssh/id_ed25519 （絶対に外部に出さない）

# 2. 公開鍵をサーバーにコピー
ssh-copy-id user@host

# 3. 以降はパスワードなしで直接ログイン
ssh user@host
```

RSAではなくEd25519アルゴリズムを推奨：同じセキュリティ強度で鍵が短く、処理がより高速。

## SSH Config：マシンごとにエイリアスを設定

`~/.ssh/config` を編集：

```
Host my-server
    HostName 123.45.67.89
    User root
    Port 2222
    IdentityFile ~/.ssh/my-server.key

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

以後 `ssh my-server` と入力するだけでよく、毎回IPやポートを覚える必要がない。

## ファイル転送

```bash
# scp：ファイルの安全なコピー
scp local.txt user@host:/remote/path/    # ローカルからアップロード
scp user@host:/remote/file ./            # リモートからダウンロード
scp -r src/ user@host:/remote/           # ディレクトリを再帰的に転送
scp -P 2222 file user@host:/path/        # ポートを指定

# rsync：差分同期（より高速で、途中からの再開をサポート）
rsync -avz ./dist/ user@host:/var/www/   # ディレクトリ同期
rsync -avz --delete ./dist/ user@host:/var/www/  # リモートの余分なファイルを削除
```

scpは単一ファイルの転送に適し、rsyncは大規模ディレクトリの同期やデプロイに適する。

## ポートフォワーディング（トンネル）

```bash
# ローカルポートフォワーディング：ローカルの8080がリモートの3000に相当
ssh -L 8080:localhost:3000 user@host
# これで http://localhost:8080 を開けばリモートの3000番ポートにアクセスできる

# リモートポートフォワーディング：リモートサーバーがローカルのサービスにアクセス可能に
ssh -R 9090:localhost:3000 user@host

# 動的フォワーディング（SOCKSプロキシ）
ssh -D 1080 user@host
```

ローカルポートフォワーディングが最もよく使われる：例えばリモートサーバーでJupyterを動かしている場合、ポートを公開する必要はなく、SSHトンネル経由で直接アクセスできる。

## Keep Alive：アイドル切断の防止

`~/.ssh/config` に以下を追加：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

60秒ごとにハートビートを送り、連続3回応答がない場合に切断。VS Code Remoteユーザー必携の設定。

## セキュリティ推奨設定

```bash
# サーバー側 /etc/ssh/sshd_config の推奨設定：
PermitRootLogin no              # rootの直接ログインを禁止
PasswordAuthentication no        # パスワード認証を無効化、鍵のみ許可
Port 2222                        # デフォルトの22番ポートを変更
```

- 秘密鍵ファイルのパーミッションは600必須：`chmod 600 ~/.ssh/id_ed25519`
- 秘密鍵は決して共有しない
- 定期的に `ssh -v` で接続問題を診断

## よく使うコマンド一覧

| コマンド | 用途 |
|---------|------|
| `ssh user@host` | リモートログイン |
| `ssh-keygen -t ed25519` | 鍵ペアの生成 |
| `ssh-copy-id user@host` | 公開鍵のアップロード |
| `scp file user@host:/path` | ファイル転送 |
| `rsync -avz src/ dest/` | ディレクトリ同期 |
| `ssh -L 8080:localhost:3000 proxy` | ローカルポートフォワーディング |
| `~/.ssh/config` | 接続設定のエイリアス |
