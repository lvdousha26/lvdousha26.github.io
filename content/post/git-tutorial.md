---
title: "Git 从入门到熟练：版本控制实用指南"
description: "面向初学者的 Git 实用教程，涵盖核心概念、常用命令和工作流程"
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
  - 工具
---

## 为什么要学 Git

写代码最怕两件事：改崩了回不去，多人协作互相覆盖。Git 解决的就是这两个问题——**版本回溯**和**协作并行**。

简单理解：Git 给你的项目拍快照，随时可以回到任意历史节点，每个协作者各自在自己的分支上干活，最后合并到一起。

<!--more-->

## 基础概念

| 概念 | 解释 |
|------|------|
| **仓库 (Repository)** | 被 Git 管理的项目目录，包含完整历史 |
| **工作区 (Working Directory)** | 你正在编辑的文件，未暂存 |
| **暂存区 (Staging Area)** | `git add` 后的临时区域，准备提交 |
| **提交 (Commit)** | 一次快照，记录文件变更，有唯一 ID |
| **分支 (Branch)** | 一条独立的开发线，可并行、可合并 |
| **远程 (Remote)** | 托管在 GitHub/GitLab 等服务器上的仓库副本 |

工作流程：**修改文件 → `git add` 到暂存区 → `git commit` 提交到仓库 → `git push` 推送到远程**

```
工作区  ──add──▶  暂存区  ──commit──▶  本地仓库  ──push──▶  远程仓库
  ◀─────────── checkout ───────────  ◀── pull ───────────
```

## 上手配置

```bash
# 设置用户名和邮箱（必做）
git config --global user.name "你的名字"
git config --global user.email "your@email.com"

# 设置默认分支名为 main
git config --global init.defaultBranch main

# 查看配置
git config --list
```

## 日常使用：单人项目

```bash
# 初始化新仓库
git init
git add .
git commit -m "init: 项目初始化"

# 关联远程并推送
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main

# 日常工作循环
git add .                    # 暂存所有修改
git commit -m "feat: 添加登录功能"
git push                     # 推送到远程

# 查看状态和历史
git status                   # 当前有哪些改动
git log --oneline            # 简洁的提交历史
git diff                     # 查看具体改了什么
```

## 提交信息规范

推荐[约定式提交](https://www.conventionalcommits.org/zh-hans/)：

```
<type>: <description>

type 常见取值：
feat     新功能
fix      修复 bug
docs     文档
refactor 重构（不改变功能）
chore    杂项（构建、依赖等）
test     测试
```

好的提交信息一眼能看懂做了什么，别写 "update"、"fix bug" 这种模糊描述。

## 分支操作：多人协作的核心

```bash
# 创建并切换到新分支
git checkout -b feature/login

# 查看所有分支
git branch -a

# 在分支上开发然后合并
git checkout main
git merge feature/login        # 把 feature/login 合并到 main

# 删除已合并的分支
git branch -d feature/login

# 切换分支
git switch feature/login       # 新版写法（推荐）
git checkout feature/login     # 旧版写法
```

一个典型的工作流：

```
main ───●───●───●──────────●────────── (稳定版本)
             \            / (merge)
feature ──────●────●─────●  (开发新功能)
```

## 远程协作

```bash
# 克隆仓库
git clone https://github.com/用户名/仓库名.git

# 拉取远程更新
git pull                      # = fetch + merge
git pull --rebase             # 推荐：保持提交历史线性

# 推送本地分支到远程
git push origin feature/login

# 查看远程仓库信息
git remote -v
```

## 撤销操作：后悔药

```bash
# 撤销工作区修改（恢复到上次提交状态）
git checkout -- 文件名
git restore 文件名             # 新版写法

# 取消暂存（add 多了）
git reset HEAD 文件名
git restore --staged 文件名    # 新版写法

# 修改最后一次提交信息
git commit --amend -m "新的提交信息"

# 回退到某个历史版本（保留修改）
git reset --soft HEAD~1       # 撤销提交，改动回到暂存区
git reset --mixed HEAD~1      # 撤销提交和暂存，改动回到工作区

# 彻底回退（丢弃修改，谨慎使用）
git reset --hard HEAD~1       # 回到上一个提交，丢弃所有改动
```

## 解决冲突

当两个分支修改了同一文件的同一行，合并时会产生冲突：

```bash
git merge feature/login
# Auto-merging src/main.py
# CONFLICT (content): Merge conflict in src/main.py
```

冲突文件中会出现标记：

```
<<<<<<< HEAD
print("main 分支的内容")
=======
print("feature 分支的内容")
>>>>>>> feature/login
```

手动编辑保留需要的部分 → 删除标记 → `git add` → `git commit` 完成合并。

**减少冲突的技巧：**
- 经常拉取主分支合并：`git pull --rebase`
- 分支存活周期不要太长
- 一个人尽量只改一个模块

## 实用技巧

```bash
# 暂存当前修改，切换到其他分支
git stash                     # 暂存
git stash pop                 # 恢复最近一次暂存

# 查看某行代码是谁写的
git blame 文件名              # 每行代码显示作者和提交

# 查看某个提交的改动
git show <commit-id>

# 打标签（标记发布版本）
git tag v1.0.0
git push --tags

# 忽略文件：在项目根目录创建 .gitignore
# node_modules/
# .env
# *.log
# dist/
```

## 推荐工作流：GitHub Flow

```
1. 从 main 拉出功能分支
2. 在分支上开发和提交
3. 推送到远程，创建 Pull Request
4. 代码审查通过后合并到 main
5. 删除功能分支
```

简单有效，适合个人项目和中小团队。

## 总结

| 命令 | 用途 |
|------|------|
| `git init / clone` | 创建或获取仓库 |
| `git add` | 暂存修改 |
| `git commit` | 提交到本地仓库 |
| `git push / pull` | 与远程同步 |
| `git branch / switch` | 分支操作 |
| `git merge` | 合并分支 |
| `git stash` | 暂存临时改动 |
| `git reset` | 撤销操作 |
| `git log / status / diff` | 查看信息 |

Git 命令很多，但日常用到的就这十几个。关键是理解**工作区 → 暂存区 → 仓库**的流转，和**分支的创建与合并**。剩下的边用边查即可。
