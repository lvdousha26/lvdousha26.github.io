---
title: "Claude Code CLI Getting Started Guide"
description: "AI programming partner in the command line: installation, basic workflow, project context, and practical tips"
keywords: "claude code,claude,cli,ai programming,tutorial"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Claude Code
  - AI
  - CLI
  - Tutorial
  - Mini Tools
---

Claude Code is Anthropic's command-line AI programming tool. It reads code, fixes bugs, and writes features directly in the terminal. Unlike Copilot, which only provides completions, it's a true conversational collaborator.

<!--more-->

## Installation

```bash
# Global npm installation (recommended)
npm install -g @anthropic-ai/claude-code

# Verify
claude --version
```

First use requires an Anthropic API Key or a Claude subscription:

```bash
# Option 1: API Key (pay-as-you-go)
export ANTHROPIC_API_KEY="sk-ant-..."

# Option 2: Log in with a Claude subscription account
claude login
```

## Basic Usage

```bash
# Direct conversation
claude "explain this project's directory structure"

# Interactive mode (most commonly used)
claude

# With files
claude "what are the potential issues in src/main.py?"
```

Once in interactive mode, make requests as if you're chatting:

```
> add a logging middleware to this project
> the README is missing installation steps, fill them in
> this function is too long, split it into two
```

Claude Code automatically reads the code, makes changes, runs tests, and iterates until it's satisfied.

## Project Context — CLAUDE.md

Claude Code can't read minds. Place a `CLAUDE.md` file in the project root to tell it about project rules, code style, and important notes:

```markdown
# CLAUDE.md

## Project
FastAPI backend, Python 3.11, Poetry for dependency management

## Rules
- Read code first, then modify — never guess
- Don't introduce new dependencies unless necessary
- When modifying function signatures, update all call sites
- Never hardcode keys or tokens

## Testing
pytest, run pytest -x after making changes
```

This file is automatically loaded by Claude Code every time, effectively serving as a project manual.

## Permission Control

By default, Claude Code requires your confirmation to execute Shell commands. You can whitelist operations by type in settings:

```bash
# View current permission settings
claude config

# Allow reading files (no confirmation needed)
claude config allow read
```

Or write directly to `~/.claude/settings.json`:

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

## Core Workflow

```
1. Describe the requirement
      ↓
2. Claude Code reads the code, checks documentation
      ↓
3. Displays the proposed changes
      ↓
4. You confirm → it automatically modifies the code
      ↓
5. Runs tests → fixes issues → done
```

In practice: describe a bug's symptoms, and it can handle the entire pipeline from locating the root cause to fixing and verifying.

## Practical Tips

### Multi-turn Conversations, Take It Slow

Don't dump a large requirement all at once. Start by having it understand the current state:

```
> read src/auth.py and explain the authentication flow
> now I need to add login failure rate limiting: lock out after 5 attempts for 30 minutes
> use Redis as the counter, keys should have an expiration time
```

### @ Reference Files

```
> @src/models.py @src/routes.py is there a circular import between these two files?
> @.github/workflows/ help me upgrade Node 16 to Node 20 in the CI
```

### Let It Look Up Documentation

Claude Code knows its own limitations and will proactively say, "I'm not sure about the API changes, let me check":

```
> rewrite the database query using Prisma 5.x new syntax
```

### Code Review

```bash
# Review changes on the current branch
claude "review the changes in git diff main...HEAD"
```

### Writing Commit Messages

```bash
git diff | claude "write a conventional commit message"
```

## Quick Command Reference

| Action | Command |
|--------|---------|
| Interactive mode | `claude` |
| One-shot question | `claude "question"` |
| Continue last session | `claude --continue` |
| List sessions | `claude sessions` |
| Switch model | `/model opus` / `/model sonnet` / `/model haiku` |
| View help | `/help` |
| Clear context | `/clear` |
| Exit | `/exit` or `Ctrl+C` |

## Differences from Copilot / Cursor

| | Claude Code | Copilot | Cursor |
|---|------------|---------|--------|
| Runtime | CLI terminal | IDE plugin | IDE (VS Code fork) |
| Interaction | Conversational | Completions + inline chat | Completions + sidebar chat |
| Code modification scope | Entire project | Current file primarily | Entire project |
| Automated execution | Can run tests, install dependencies | No | Partially supported |
| Pricing | API pay-as-you-go / Subscription $20/mo | $10/mo | $20/mo |

Copilot is great for line-level completions, and Cursor has a GUI preference. Claude Code excels at terminal-native operation, multi-file refactoring, and automated workflows.

## Advice for Beginners

1. **Write a CLAUDE.md first** — this is your project manual for the AI
2. **Start with small tasks** — let it fix typos, add comments, gradually build trust
3. **Don't trust blindly** — review its changes before committing
4. **Use @ references wisely** — providing precise context beats vague descriptions
5. **Break down complex requirements** — one big task is worse than several small steps

Keep the context well-managed, and Claude Code can save you a ton of repetitive work. The more you use it, the more familiar it becomes with your project.
