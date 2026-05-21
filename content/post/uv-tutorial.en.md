---
title: "uv Getting Started"
description: "A practical uv tutorial for beginners: a pip replacement written in Rust, 10-100x faster"
keywords: "uv,python,package manager,pip,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - uv
  - Python
  - Tutorial
  - Tools
---

## What is uv

[uv](https://github.com/astral-sh/uv) is a Python package and project manager written in Rust by Astral (the team behind Ruff). It replaces `pip`, `pip-tools`, `virtualenv`, and `pyenv` with a single tool.

The core selling point: **10-100x faster**. Dependency resolution and package installation happen almost instantly.

<!--more-->

## Installation

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or use pip
pip install uv
```

## Package Management (Replacing pip)

```bash
# Install packages (10-100x faster than pip install)
uv pip install numpy pandas requests
uv pip install -r requirements.txt

# Uninstall
uv pip uninstall numpy

# List installed packages
uv pip list

# Freeze current dependencies
uv pip freeze > requirements.txt

# Compile dependencies (generate a fully locked dependency file)
uv pip compile requirements.in -o requirements.txt
```

`uv pip compile` replaces pip-tools, generating version-locked `requirements.txt` from a loose `requirements.in`.

## Virtual Environments (Replacing virtualenv)

```bash
# Create a virtual environment
uv venv
uv venv myenv --python 3.12

# Activate (same as standard venv)
source .venv/bin/activate    # Linux/macOS
.venv\Scripts\activate        # Windows
```

## Python Version Management (Replacing pyenv)

```bash
# Install a specific Python version
uv python install 3.12
uv python install 3.11 3.12 3.13   # Install multiple versions at once

# List installed Python versions
uv python list

# Specify a version when creating an environment
uv venv --python 3.12
```

## Project Management (uv init)

uv supports a project management mode similar to `poetry` or `npm`:

```bash
# Initialize a project (creates pyproject.toml)
uv init my-project
cd my-project

# Add dependencies
uv add numpy pandas
uv add --dev pytest ruff       # Dev dependencies

# Run scripts
uv run python main.py
uv run pytest                  # Run tools directly

# Lock dependencies
uv lock
uv sync                        # Install all dependencies
```

## uv vs Traditional Tools

| Operation | Traditional Approach | uv |
|-----------|---------------------|-----|
| Install packages | `pip install` | `uv pip install` |
| Virtual environments | `python -m venv` | `uv venv` |
| Install Python | `pyenv install` | `uv python install` |
| Lock dependencies | `pip-tools` | `uv pip compile` |
| Project management | `poetry` | `uv init / add / run` |

One tool handles everything end-to-end, and it's orders of magnitude faster.

## Migration Recommendations

| Scenario | Recommendation |
|----------|---------------|
| New projects | Use `uv init` + `uv add` directly |
| Existing projects | Replace pip with `uv pip install -r requirements.txt` |
| Existing conda environments | Use uv for the pip part, conda for managing Python versions |
| CI/CD | Replace `pip install` with `uv pip install` — builds are much faster |

## Quick Reference

| Command | Purpose |
|---------|---------|
| `uv pip install pkg` | Install a package |
| `uv pip compile requirements.in` | Lock dependencies |
| `uv venv --python 3.12` | Create a virtual environment |
| `uv python install 3.12` | Install Python |
| `uv init project` | Initialize a project |
| `uv add pkg` | Add a project dependency |
| `uv run script.py` | Run a script |
| `uv sync` | Sync dependencies |
