---
title: "Git 入門"
description: "面向初學者的 Git 實用教程，涵蓋核心概念、常用命令和工作流程"
keywords: "git,github,version control,版本控制,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Git
  - 教程
  - 小工具
---


## 爲什麼要學 Git

寫代碼最怕兩件事：改崩了回不去，多人協作互相覆蓋。Git 解決的就是這兩個問題——**版本回溯**和**協作並行**。

簡單理解：Git 給你的項目拍快照，隨時可以回到任意歷史節點，每個協作者各自在自己的分支上幹活，最後合併到一起。

<!--more-->

## 基礎概念

| 概念 | 解釋 |
|------|------|
| **倉庫 (Repository)** | 被 Git 管理的項目目錄，包含完整歷史 |
| **工作區 (Working Directory)** | 你正在編輯的文件，未暫存 |
| **暫存區 (Staging Area)** | `git add` 後的臨時區域，準備提交 |
| **提交 (Commit)** | 一次快照，記錄文件變更，有唯一 ID |
| **分支 (Branch)** | 一條獨立的開發線，可並行、可合併 |
| **遠程 (Remote)** | 託管在 GitHub/GitLab 等服務器上的倉庫副本 |

工作流程：**修改文件 → `git add` 到暫存區 → `git commit` 提交到倉庫 → `git push` 推送到遠程**

```
工作區  ──add──▶  暫存區  ──commit──▶  本地倉庫  ──push──▶  遠程倉庫
  ◀─────────── checkout ───────────  ◀── pull ───────────
```

## 上手配置

```bash
# 設置用戶名和郵箱（必做）
git config --global user.name "你的名字"
git config --global user.email "your@email.com"

# 設置默認分支名爲 main
git config --global init.defaultBranch main

# 查看配置
git config --list
```

## 日常使用：單人項目

```bash
# 初始化新倉庫
git init
git add .
git commit -m "init: 項目初始化"

# 關聯遠程並推送
git remote add origin https://github.com/用戶名/倉庫名.git
git push -u origin main

# 日常工作循環
git add .                    # 暫存所有修改
git commit -m "feat: 添加登錄功能"
git push                     # 推送到遠程

# 查看狀態和歷史
git status                   # 當前有哪些改動
git log --oneline            # 簡潔的提交歷史
git diff                     # 查看具體改了什麼
```

## 提交信息規範

推薦[約定式提交](https://www.conventionalcommits.org/zh-hans/)：

```
<type>: <description>

type 常見取值：
feat     新功能
fix      修復 bug
docs     文檔
refactor 重構（不改變功能）
chore    雜項（構建、依賴等）
test     測試
```

好的提交信息一眼能看懂做了什麼，別寫 "update"、"fix bug" 這種模糊描述。

## 分支操作：多人協作的核心

```bash
# 創建並切換到新分支
git checkout -b feature/login

# 查看所有分支
git branch -a

# 在分支上開發然後合併
git checkout main
git merge feature/login        # 把 feature/login 合併到 main

# 刪除已合併的分支
git branch -d feature/login

# 切換分支
git switch feature/login       # 新版寫法（推薦）
git checkout feature/login     # 舊版寫法
```

一個典型的工作流：

```
main ───●───●───●──────────●────────── (穩定版本)
             \            / (merge)
feature ──────●────●─────●  (開發新功能)
```

## 遠程協作

```bash
# 克隆倉庫
git clone https://github.com/用戶名/倉庫名.git

# 拉取遠程更新
git pull                      # = fetch + merge
git pull --rebase             # 推薦：保持提交歷史線性

# 推送本地分支到遠程
git push origin feature/login

# 查看遠程倉庫信息
git remote -v
```

## 撤銷操作：後悔藥

```bash
# 撤銷工作區修改（恢復到上次提交狀態）
git checkout -- 文件名
git restore 文件名             # 新版寫法

# 取消暫存（add 多了）
git reset HEAD 文件名
git restore --staged 文件名    # 新版寫法

# 修改最後一次提交信息
git commit --amend -m "新的提交信息"

# 回退到某個歷史版本（保留修改）
git reset --soft HEAD~1       # 撤銷提交，改動回到暫存區
git reset --mixed HEAD~1      # 撤銷提交和暫存，改動回到工作區

# 徹底回退（丟棄修改，謹慎使用）
git reset --hard HEAD~1       # 回到上一個提交，丟棄所有改動
```

## 解決衝突

當兩個分支修改了同一文件的同一行，合併時會產生衝突：

```bash
git merge feature/login
# Auto-merging src/main.py
# CONFLICT (content): Merge conflict in src/main.py
```

衝突文件中會出現標記：

```
<<<<<<< HEAD
print("main 分支的內容")
=======
print("feature 分支的內容")
>>>>>>> feature/login
```

手動編輯保留需要的部分 → 刪除標記 → `git add` → `git commit` 完成合並。

**減少衝突的技巧：**
- 經常拉取主分支合併：`git pull --rebase`
- 分支存活週期不要太長
- 一個人儘量只改一個模塊

## 實用技巧

```bash
# 暫存當前修改，切換到其他分支
git stash                     # 暫存
git stash pop                 # 恢復最近一次暫存

# 查看某行代碼是誰寫的
git blame 文件名              # 每行代碼顯示作者和提交

# 查看某個提交的改動
git show <commit-id>

# 打標籤（標記發佈版本）
git tag v1.0.0
git push --tags

# 忽略文件：在項目根目錄創建 .gitignore
# node_modules/
# .env
# *.log
# dist/
```

## 推薦工作流：GitHub Flow

```
1. 從 main 拉出功能分支
2. 在分支上開發和提交
3. 推送到遠程，創建 Pull Request
4. 代碼審查通過後合併到 main
5. 刪除功能分支
```

簡單有效，適合個人項目和中小團隊。

## 總結

| 命令 | 用途 |
|------|------|
| `git init / clone` | 創建或獲取倉庫 |
| `git add` | 暫存修改 |
| `git commit` | 提交到本地倉庫 |
| `git push / pull` | 與遠程同步 |
| `git branch / switch` | 分支操作 |
| `git merge` | 合併分支 |
| `git stash` | 暫存臨時改動 |
| `git reset` | 撤銷操作 |
| `git log / status / diff` | 查看信息 |

Git 命令很多，但日常用到的就這十幾個。關鍵是理解**工作區 → 暫存區 → 倉庫**的流轉，和**分支的創建與合併**。剩下的邊用邊查即可。
