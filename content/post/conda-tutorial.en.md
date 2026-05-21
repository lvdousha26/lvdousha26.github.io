---
title: "Conda Getting Started"
description: "A practical Conda tutorial for beginners, covering virtual environments, package management, and project isolation"
keywords: "conda,anaconda,python,environment management,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Conda
  - Python
  - Tutorial
  - Tools
---

## Why Use Conda

The biggest pain point in Python projects: different projects depend on different versions of Python and libraries. Global installation inevitably leads to conflicts — Project A needs pandas 1.x, Project B needs pandas 2.x.

Conda solves this with **virtual environments**: each project has its own isolated Python version and package set, completely independent from one another.

<!--more-->

## Installation

**Miniconda** is recommended (only essential components, lightweight). Don't install Anaconda (it comes pre-loaded with hundreds of packages you'll never use).

```bash
# Download Miniconda
# https://docs.anaconda.com/miniconda/

# Initialize after installation (initialize whichever shell you use)
conda init bash
# Restart the terminal for changes to take effect
```

## Environment Management

```bash
# Create an environment (specify Python version)
conda create -n myproject python=3.12

# Create an environment and install packages at the same time
conda create -n ml-env python=3.11 numpy pandas matplotlib

# List all environments
conda env list

# Activate / deactivate an environment
conda activate myproject
conda deactivate

# Delete an environment
conda remove -n myproject --all

# Export environment configuration
conda env export > environment.yml

# Recreate an environment from a config file
conda env create -f environment.yml
```

## Package Management

```bash
# Install packages
conda install numpy pandas
conda install -c conda-forge pytorch    # Install from a specific channel

# List installed packages
conda list
conda list | grep numpy

# Update packages
conda update numpy
conda update --all           # Update all packages (use with caution)

# Remove packages
conda remove numpy
```

## Channels (Software Repositories)

Conda downloads packages from channels. The default `defaults` channel is the official repository, but the `conda-forge` community channel has more packages and faster updates.

```bash
# Set conda-forge as the default channel (recommended)
conda config --add channels conda-forge
conda config --set channel_priority strict

# View current configuration
conda config --show channels
```

Setting conda-forge as the default source is recommended — packages are more comprehensive with better compatibility.

## Best Practices

```bash
# One environment per project; don't pollute base
conda create -n project-a python=3.12
conda activate project-a
pip install -r requirements.txt    # Use pip for packages conda can't handle

# Don't install anything in the base environment
# conda install xxx  ← not recommended!
```

conda and pip can be used together, but there's a rule of thumb: **conda install first, then pip install**. Use conda for what conda can handle, pip for what conda doesn't have.

## Speed Tips

```bash
# Use the libmamba solver (10x+ faster than the default solver)
conda install -n base conda-libmamba-solver
conda config --set solver libmamba

# Use domestic mirrors (if in China)
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

The `libmamba solver` is the most important optimization in recent years, cutting dependency resolution from minutes down to seconds.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `conda create -n name python=3.12` | Create an environment |
| `conda activate name` | Activate an environment |
| `conda deactivate` | Deactivate an environment |
| `conda env list` | List all environments |
| `conda install pkg` | Install a package |
| `conda list` | List packages in the current environment |
| `conda env export > env.yml` | Export an environment |
| `conda remove -n name --all` | Delete an environment |
