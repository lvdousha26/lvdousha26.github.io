---
title: "Git入門"
description: "初心者向けのGit実用チュートリアル。コアコンセプト、よく使うコマンド、ワークフローを網羅"
keywords: "git,github,version control,バージョン管理,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Git
  - チュートリアル
  - ツール
---

## なぜGitを学ぶのか

プログラミングで最も怖いことは2つあります：変更を元に戻せなくなることと、複数人での協業で互いの変更を上書きしてしまうことです。Gitが解決するのはこの2つ——**バージョンの巻き戻し**と**協業の並行化**です。

簡単に言えば：Gitはプロジェクトのスナップショットを撮り、いつでも任意の過去の状態に戻れます。各協力者は自分のブランチで作業し、最後にマージします。

<!--more-->

## 基本概念

| 概念 | 説明 |
|------|------|
| **リポジトリ (Repository)** | Gitで管理されるプロジェクトディレクトリ。完全な履歴を含む |
| **ワークツリー (Working Directory)** | 編集中のファイル、ステージングされていない状態 |
| **ステージングエリア (Staging Area)** | `git add` 後の一時領域、コミット準備状態 |
| **コミット (Commit)** | スナップショット。ファイル変更を記録し、一意のIDを持つ |
| **ブランチ (Branch)** | 独立した開発ライン。並行作業とマージが可能 |
| **リモート (Remote)** | GitHub/GitLab等のサーバーにホストされたリポジトリのコピー |

ワークフロー：**ファイルを変更 → `git add` でステージング → `git commit` でリポジトリに保存 → `git push` でリモートに送信**

```
ワークツリー  ──add──▶  ステージングエリア  ──commit──▶  ローカルリポジトリ  ──push──▶  リモートリポジトリ
  ◀──────────────── checkout ─────────────────  ◀── pull ─────────────────
```

## 初期設定

```bash
# ユーザー名とメールアドレスを設定（必須）
git config --global user.name "あなたの名前"
git config --global user.email "your@email.com"

# デフォルトブランチ名をmainに設定
git config --global init.defaultBranch main

# 設定を確認
git config --list
```

## 日常使い：個人プロジェクト

```bash
# 新規リポジトリを初期化
git init
git add .
git commit -m "init: プロジェクト初期化"

# リモートを関連付けてプッシュ
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main

# 日常の作業ループ
git add .                    # すべての変更をステージング
git commit -m "feat: ログイン機能を追加"
git push                     # リモートにプッシュ

# 状態と履歴を確認
git status                   # 現在の変更状態
git log --oneline            # 簡潔なコミット履歴
git diff                     # 具体的な変更内容
```

## コミットメッセージの規約

[Conventional Commits](https://www.conventionalcommits.org/ja/) を推奨：

```
<type>: <description>

type の主な値：
feat     新機能
fix      bug修正
docs     ドキュメント
refactor リファクタリング（機能変更なし）
chore    雑務（ビルド、依存関係など）
test     テスト
```

良いコミットメッセージは一目で何をしたかわかります。"update" や "fix bug" のような曖昧な記述は避けましょう。

## ブランチ操作：協業の核心

```bash
# 新しいブランチを作成して切り替え
git checkout -b feature/login

# すべてのブランチを表示
git branch -a

# ブランチで開発してマージ
git checkout main
git merge feature/login        # feature/login を main にマージ

# マージ済みブランチを削除
git branch -d feature/login

# ブランチを切り替え
git switch feature/login       # 新しい書き方（推奨）
git checkout feature/login     # 古い書き方
```

典型的なワークフロー：

```
main ───●───●───●──────────●────────── (安定版)
             \            / (merge)
feature ──────●────●─────●  (新機能開発)
```

## リモート連携

```bash
# リポジトリをクローン
git clone https://github.com/ユーザー名/リポジトリ名.git

# リモートの更新を取得
git pull                      # = fetch + merge
git pull --rebase             # 推奨：コミット履歴を一直線に保つ

# ローカルブランチをリモートにプッシュ
git push origin feature/login

# リモートリポジトリ情報を表示
git remote -v
```

## 操作の取り消し：やり直し薬

```bash
# ワークツリーの変更を取り消す（最後のコミット状態に戻す）
git checkout -- ファイル名
git restore ファイル名             # 新しい書き方

# ステージングを解除（addしすぎた）
git reset HEAD ファイル名
git restore --staged ファイル名    # 新しい書き方

# 最後のコミットメッセージを修正
git commit --amend -m "新しいコミットメッセージ"

# 特定の歴史バージョンに戻す（変更は保持）
git reset --soft HEAD~1       # コミットを取り消し、変更はステージングエリアに残る
git reset --mixed HEAD~1      # コミットとステージングを取り消し、変更はワークツリーに残る

# 完全に戻す（変更を破棄、注意して使用）
git reset --hard HEAD~1       # 前のコミットに戻り、すべての変更を破棄
```

## コンフリクト解決

2つのブランチが同じファイルの同じ行を変更した場合、マージ時にコンフリクトが発生します：

```bash
git merge feature/login
# Auto-merging src/main.py
# CONFLICT (content): Merge conflict in src/main.py
```

コンフリクトファイルには以下のようなマーカーが現れます：

```
<<<<<<< HEAD
print("main ブランチの内容")
=======
print("feature ブランチの内容")
>>>>>>> feature/login
```

手動で必要な部分を残して編集 → マーカーを削除 → `git add` → `git commit` でマージ完了。

**コンフリクトを減らすコツ：**
- こまめにメインブランチの変更を取り込む：`git pull --rebase`
- ブランチの生存期間を長くしすぎない
- 1人で1つのモジュールだけを変更するよう心がける

## 便利なテクニック

```bash
# 現在の変更を一時退避して、他のブランチに切り替える
git stash                     # 退避
git stash pop                 # 最新の退避を復元

# 各行のコードを誰が書いたか確認
git blame ファイル名           # 各行に作者とコミットを表示

# 特定のコミットの変更内容を確認
git show <commit-id>

# タグ付け（リリースバージョンのマーキング）
git tag v1.0.0
git push --tags

# ファイルを無視：プロジェクトルートに .gitignore を作成
# node_modules/
# .env
# *.log
# dist/
```

## 推奨ワークフロー：GitHub Flow

```
1. mainから機能ブランチを作成
2. ブランチで開発とコミット
3. リモートにプッシュし、Pull Requestを作成
4. コードレビュー通過後、mainにマージ
5. 機能ブランチを削除
```

シンプルで効果的。個人プロジェクトや中小チームに最適です。

## まとめ

| コマンド | 用途 |
|----------|------|
| `git init / clone` | リポジトリの作成または取得 |
| `git add` | 変更をステージング |
| `git commit` | ローカルリポジトリにコミット |
| `git push / pull` | リモートと同期 |
| `git branch / switch` | ブランチ操作 |
| `git merge` | ブランチのマージ |
| `git stash` | 一時的な変更の退避 |
| `git reset` | 操作の取り消し |
| `git log / status / diff` | 情報確認 |

Gitのコマンドはたくさんありますが、日常生活で使うのはこの10数個だけです。重要なのは**ワークツリー → ステージングエリア → リポジトリ**という流れと、**ブランチの作成とマージ**の概念を理解することです。残りは使いながら調べれば十分です。
