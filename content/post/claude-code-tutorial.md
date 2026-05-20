---
title: "Claude Code CLI 上手指南"
description: "命令行里的 AI 编程搭档：安装、基本工作流、项目上下文、常用技巧"
keywords: "claude code,claude,cli,ai编程,教程"

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

Claude Code 是 Anthropic 出的命令行 AI 编程工具。直接在终端里让它读代码、改 bug、写功能。不像 Copilot 只补全，它是真正的对话式协作。

<!--more-->

## 安装

```bash
# npm 全局安装（推荐）
npm install -g @anthropic-ai/claude-code

# 验证
claude --version
```

首次使用需要 Anthropic API Key 或者 Claude 订阅：

```bash
# 方式一：API Key（按量计费）
export ANTHROPIC_API_KEY="sk-ant-..."

# 方式二：Claude 订阅账号登录
claude login
```

## 基本用法

```bash
# 直接对话
claude "解释这个项目的目录结构"

# 交互模式（最常用）
claude

# 带文件
claude "src/main.py 里有什么潜在问题？"
```

进入交互模式后，像聊天一样提需求：

```
> 给这个项目加一个日志中间件
> README 里少写了安装步骤，补上
> 这个函数太长了，拆成两个
```

Claude Code 会自动读代码、做出修改、运行测试、迭代直到满意。

## 项目上下文 — CLAUDE.md

Claude Code 不会读心。在项目根目录放 `CLAUDE.md`，告诉它项目规则、代码风格、注意事项：

```markdown
# CLAUDE.md

## 项目
FastAPI 后端，Python 3.11，Poetry 管理依赖

## 规则
- 先读代码，再改代码，不要猜
- 不要引入新的依赖除非必要
- 修改函数签名时同步更新所有调用点
- 禁止硬编码密钥、token

## 测试
pytest，改完代码跑 pytest -x
```

这个文件会被 Claude Code 每次自动加载，相当于给了它一份项目说明书。

## 权限控制

默认 Claude Code 执行 Shell 命令需要你确认。可以在设置里按操作类型加白名单：

```bash
# 查看当前权限设置
claude config

# 允许读取文件（不需要确认）
claude config allow read
```

或者在 `~/.claude/settings.json` 里手写：

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
2. Claude Code 读代码、查文档
      ↓
3. 展示修改方案
      ↓
4. 你确认 → 它自动改代码
      ↓
5. 跑测试 → 修问题 → 完成
```

实际效果：描述一个 bug 现象，它能从定位原因到修复到验证一条龙完成。

## 实用技巧

### 多轮对话，慢慢来

不要一上来就给大需求。先让它理解现状：

```
> 读一下 src/auth.py，解释认证流程
> 现在要加登录失败次数限制，5 次锁 30 分钟
> 用 Redis 做计数器，键要有过期时间
```

### @ 引用文件

```
> @src/models.py @src/routes.py 这两个文件之间有没有循环导入？
> @.github/workflows/ 帮我把 CI 里的 Node 16 升级到 20
```

### 让它自己查文档

Claude Code 知道自身的限制，会主动说"我不确定这个 API 的变化，让我查一下"：

```
> 用 Prisma 5.x 的新语法改写数据库查询
```

### 代码审查

```bash
# 审查当前分支的改动
claude "审查 git diff main...HEAD 的改动"
```

### 写 commit message

```bash
git diff | claude "写一个 conventional commit message"
```

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 交互模式 | `claude` |
| 单次问答 | `claude "问题"` |
| 继续上次会话 | `claude --continue` |
| 查看会话列表 | `claude sessions` |
| 切换模型 | `/model opus` / `/model sonnet` / `/model haiku` |
| 查看帮助 | `/help` |
| 清除上下文 | `/clear` |
| 退出 | `/exit` 或 `Ctrl+C` |

## 和 Copilot / Cursor 的区别

| | Claude Code | Copilot | Cursor |
|------|-----------|---------|--------|
| 运行方式 | CLI 终端 | IDE 插件 | IDE（VS Code fork） |
| 交互模式 | 对话式 | 补全+内联对话 | 补全+侧边栏对话 |
| 改代码范围 | 整个项目 | 当前文件为主 | 整个项目 |
| 自动执行 | 可以跑测试、安装依赖 | 不行 | 部分支持 |
| 价格 | API 按量 / 订阅 $20/月 | $10/月 | $20/月 |

Copilot 适合行级补全，Cursor 有 GUI 偏好。Claude Code 强在终端原生、多文件重构、自动化工作流。

## 给初学者的建议

1. **先写 CLAUDE.md** — 这是你给 AI 的项目说明书
2. **从小任务开始** — 先让它修 typo、加注释，逐步信任
3. **不要盲信** — 看一遍它的改动再提交
4. **善用 @ 引用** — 提供精确上下文优于模糊描述
5. **复杂需求分步给** — 一次一个大任务不如拆成小步骤

控制好上下文，Claude Code 能省掉大量重复劳动。用得越久，它对你的项目越熟悉。
