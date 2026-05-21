---
title: "Claude Code CLI 上手指南"
description: "命令行裏的 AI 編程搭檔：安裝、基本工作流、項目上下文、常用技巧"
keywords: "claude code,claude,cli,ai編程,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Claude Code
  - AI
  - CLI
  - 教程
  - 小工具
---


Claude Code 是 Anthropic 出的命令行 AI 編程工具。直接在終端裏讓它讀代碼、改 bug、寫功能。不像 Copilot 只補全，它是真正的對話式協作。

<!--more-->

## 安裝

```bash
# npm 全局安裝（推薦）
npm install -g @anthropic-ai/claude-code

# 驗證
claude --version
```

首次使用需要 Anthropic API Key 或者 Claude 訂閱：

```bash
# 方式一：API Key（按量計費）
export ANTHROPIC_API_KEY="sk-ant-..."

# 方式二：Claude 訂閱賬號登錄
claude login
```

## 基本用法

```bash
# 直接對話
claude "解釋這個項目的目錄結構"

# 交互模式（最常用）
claude

# 帶文件
claude "src/main.py 裏有什麼潛在問題？"
```

進入交互模式後，像聊天一樣提需求：

```
> 給這個項目加一個日誌中間件
> README 裏少寫了安裝步驟，補上
> 這個函數太長了，拆成兩個
```

Claude Code 會自動讀代碼、做出修改、運行測試、迭代直到滿意。

## 項目上下文 — CLAUDE.md

Claude Code 不會讀心。在項目根目錄放 `CLAUDE.md`，告訴它項目規則、代碼風格、注意事項：

```markdown
# CLAUDE.md

## 項目
FastAPI 後端，Python 3.11，Poetry 管理依賴

## 規則
- 先讀代碼，再改代碼，不要猜
- 不要引入新的依賴除非必要
- 修改函數簽名時同步更新所有調用點
- 禁止硬編碼密鑰、token

## 測試
pytest，改完代碼跑 pytest -x
```

這個文件會被 Claude Code 每次自動加載，相當於給了它一份項目說明書。

## 權限控制

默認 Claude Code 執行 Shell 命令需要你確認。可以在設置裏按操作類型加白名單：

```bash
# 查看當前權限設置
claude config

# 允許讀取文件（不需要確認）
claude config allow read
```

或者在 `~/.claude/settings.json` 裏手寫：

```json
{
  "permissions": {
    "allow": [
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(npm test:*)"
    ]
  }
}
```

## 核心工作流

```
1. 描述需求
      ↓
2. Claude Code 讀代碼、查文檔
      ↓
3. 展示修改方案
      ↓
4. 你確認 → 它自動改代碼
      ↓
5. 跑測試 → 修問題 → 完成
```

實際效果：描述一個 bug 現象，它能從定位原因到修復到驗證一條龍完成。

## 實用技巧

### 多輪對話，慢慢來

不要一上來就給大需求。先讓它理解現狀：

```
> 讀一下 src/auth.py，解釋認證流程
> 現在要加登錄失敗次數限制，5 次鎖 30 分鐘
> 用 Redis 做計數器，鍵要有過期時間
```

### @ 引用文件

```
> @src/models.py @src/routes.py 這兩個文件之間有沒有循環導入？
> @.github/workflows/ 幫我把 CI 裏的 Node 16 升級到 20
```

### 讓它自己查文檔

Claude Code 知道自身的限制，會主動說"我不確定這個 API 的變化，讓我查一下"：

```
> 用 Prisma 5.x 的新語法改寫數據庫查詢
```

### 代碼審查

```bash
# 審查當前分支的改動
claude "審查 git diff main...HEAD 的改動"
```

### 寫 commit message

```bash
git diff | claude "寫一個 conventional commit message"
```

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 交互模式 | `claude` |
| 單次問答 | `claude "問題"` |
| 繼續上次會話 | `claude --continue` |
| 查看會話列表 | `claude sessions` |
| 切換模型 | `/model opus` / `/model sonnet` / `/model haiku` |
| 查看幫助 | `/help` |
| 清除上下文 | `/clear` |
| 退出 | `/exit` 或 `Ctrl+C` |

## 和 Copilot / Cursor 的區別

| | Claude Code | Copilot | Cursor |
|------|-----------|---------|--------|
| 運行方式 | CLI 終端 | IDE 插件 | IDE（VS Code fork） |
| 交互模式 | 對話式 | 補全+內聯對話 | 補全+側邊欄對話 |
| 改代碼範圍 | 整個項目 | 當前文件爲主 | 整個項目 |
| 自動執行 | 可以跑測試、安裝依賴 | 不行 | 部分支持 |
| 價格 | API 按量 / 訂閱 $20/月 | $10/月 | $20/月 |

Copilot 適合行級補全，Cursor 有 GUI 偏好。Claude Code 強在終端原生、多文件重構、自動化工作流。

## 給初學者的建議

1. **先寫 CLAUDE.md** — 這是你給 AI 的項目說明書
2. **從小任務開始** — 先讓它修 typo、加註釋，逐步信任
3. **不要盲信** — 看一遍它的改動再提交
4. **善用 @ 引用** — 提供精確上下文優於模糊描述
5. **複雜需求分步給** — 一次一個大任務不如拆成小步驟

控制好上下文，Claude Code 能省掉大量重複勞動。用得越久，它對你的項目越熟悉。
