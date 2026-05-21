---
title: "Git for Beginners"
description: "A practical Git tutorial for beginners, covering core concepts, common commands, and workflows"
keywords: "git,github,version control,vc,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Git
  - Tutorial
  - Mini Tools
---

## Why Learn Git

When writing code, two things are most dreaded: breaking something and not being able to revert, and collaborators overwriting each other's work. Git solves both of these — **version rollback** and **parallel collaboration**.

Simply put: Git takes snapshots of your project, allowing you to go back to any point in history at any time. Each collaborator works on their own branch, and finally, everything gets merged together.

<!--more-->

## Basic Concepts

| Concept | Explanation |
|---------|-------------|
| **Repository** | A project directory managed by Git, containing the full history |
| **Working Directory** | The files you are currently editing, not yet staged |
| **Staging Area** | The temporary area after `git add`, ready to be committed |
| **Commit** | A snapshot recording file changes, with a unique ID |
| **Branch** | An independent line of development, can be parallel and merged |
| **Remote** | A copy of the repository hosted on a server like GitHub/GitLab |

Workflow: **Modify files → `git add` to staging → `git commit` to the repository → `git push` to remote**

```
Working Dir  ──add──▶  Staging Area  ──commit──▶  Local Repo  ──push──▶  Remote Repo
  ◀──────────────── checkout ────────────  ◀── pull ───────────
```

## Initial Setup

```bash
# Set your username and email (required)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Set the default branch name to main
git config --global init.defaultBranch main

# View configuration
git config --list
```

## Daily Use: Solo Project

```bash
# Initialize a new repository
git init
git add .
git commit -m "init: project initialization"

# Link remote and push
git remote add origin https://github.com/username/repo-name.git
git push -u origin main

# Daily work loop
git add .                    # stage all changes
git commit -m "feat: add login functionality"
git push                     # push to remote

# View status and history
git status                   # see current changes
git log --oneline            # compact commit history
git diff                     # see what exactly changed
```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/en/):

```
<type>: <description>

Common types:
feat     New feature
fix      Bug fix
docs     Documentation
refactor Refactoring (no behavior change)
chore    Housekeeping (build, dependencies, etc.)
test     Tests
```

Good commit messages should make it immediately clear what was done. Avoid vague descriptions like "update" or "fix bug."

## Branch Operations: The Core of Collaboration

```bash
# Create and switch to a new branch
git checkout -b feature/login

# List all branches
git branch -a

# Develop on a branch, then merge
git checkout main
git merge feature/login        # merge feature/login into main

# Delete a merged branch
git branch -d feature/login

# Switch branches
git switch feature/login       # newer syntax (recommended)
git checkout feature/login     # older syntax
```

A typical workflow:

```
main ───●───●───●──────────●────────── (stable version)
             \            / (merge)
feature ──────●────●─────●  (developing new feature)
```

## Remote Collaboration

```bash
# Clone a repository
git clone https://github.com/username/repo-name.git

# Pull remote updates
git pull                      # = fetch + merge
git pull --rebase             # recommended: keep commit history linear

# Push a local branch to remote
git push origin feature/login

# View remote repository info
git remote -v
```

## Undoing Operations: Regret Medicine

```bash
# Undo changes in the working directory (restore to last commit state)
git checkout -- filename
git restore filename          # newer syntax

# Unstage (staged too many files)
git reset HEAD filename
git restore --staged filename # newer syntax

# Amend the last commit message
git commit --amend -m "new commit message"

# Rollback to a specific version (keep changes)
git reset --soft HEAD~1       # undo commit, changes back to staging
git reset --mixed HEAD~1      # undo commit and staging, changes back to working dir

# Hard rollback (discard changes, use with caution)
git reset --hard HEAD~1       # go back to previous commit, discard all changes
```

## Resolving Conflicts

When two branches modify the same line of the same file, a conflict occurs on merge:

```bash
git merge feature/login
# Auto-merging src/main.py
# CONFLICT (content): Merge conflict in src/main.py
```

Conflict markers appear in the file:

```
<<<<<<< HEAD
print("main branch content")
=======
print("feature branch content")
>>>>>>> feature/login
```

Manually edit to keep what you need → delete the markers → `git add` → `git commit` to complete the merge.

**Tips to reduce conflicts:**
- Frequently pull and merge from the main branch: `git pull --rebase`
- Keep branches short-lived
- Each person should try to work on only one module at a time

## Useful Tricks

```bash
# Stash current changes, switch to another branch
git stash                     # stash
git stash pop                 # restore the most recent stash

# See who wrote a specific line of code
git blame filename            # shows author and commit per line

# View changes in a specific commit
git show <commit-id>

# Tag (mark release versions)
git tag v1.0.0
git push --tags

# Ignore files: create .gitignore in the project root
# node_modules/
# .env
# *.log
# dist/
```

## Recommended Workflow: GitHub Flow

```
1. Check out a feature branch from main
2. Develop and commit on the branch
3. Push to remote, create a Pull Request
4. Merge to main after code review
5. Delete the feature branch
```

Simple and effective — suitable for solo projects and small to medium teams.

## Summary

| Command | Purpose |
|---------|---------|
| `git init / clone` | Create or clone a repository |
| `git add` | Stage changes |
| `git commit` | Commit to local repository |
| `git push / pull` | Sync with remote |
| `git branch / switch` | Branch operations |
| `git merge` | Merge branches |
| `git stash` | Temporarily stash changes |
| `git reset` | Undo operations |
| `git log / status / diff` | View information |

Git has many commands, but you'll only use a dozen or so in daily work. The key is understanding the flow of **Working Directory → Staging Area → Repository**, and **creating and merging branches**. The rest you can learn as you go.
