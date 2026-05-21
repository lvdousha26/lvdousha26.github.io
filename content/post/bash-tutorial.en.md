---
title: "Bash for Beginners"
description: "A practical Bash tutorial for beginners, covering basic syntax, common commands, and scripting tips"
keywords: "bash,shell,command line,linux,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Bash
  - Tutorial
  - Gadgets
---

## Why Learn Bash

A lot of repetitive tasks in daily development—compiling, packaging, deploying, checking logs, batch renaming—are extremely inefficient if done manually every time. Bash lets you automate all of these with just a few commands.

Bash is the default command-line interpreter on Unix/Linux, comes built-in on macOS, and can be used on Windows via WSL or Git Bash.

<!--more-->

## Basic Operations

```bash
# Files and directories
ls          # List files
cd dir      # Change directory
pwd         # Print working directory
mkdir dir   # Create directory
rm file     # Delete file
rm -r dir   # Recursively delete directory
cp src dst  # Copy
mv src dst  # Move / rename

# View file contents
cat file           # Output entire file
head -n 20 file    # First 20 lines
tail -f file       # Follow tail (view logs in real time)
less file          # Browse page by page

# Permissions
chmod +x script.sh   # Add execute permission
chmod 755 script.sh  # Set permissions using numeric mode
```

## Pipes and Redirection

```bash
# Pipe: output of one command becomes input of the next
cat log.txt | grep ERROR | wc -l    # Count occurrences of ERROR

# Redirection: write output to a file
ls > output.txt          # Overwrite
ls >> output.txt         # Append
command 2>&1             # Redirect stderr to stdout
command > /dev/null      # Discard all output
```

## Most Common Command Combinations

```bash
# grep: search text
grep "keyword" file
grep -r "TODO" src/          # Recursively search a directory
ps aux | grep nginx           # Find a process

# find: search files
find . -name "*.log"          # Find by name
find . -mtime -7              # Files modified in the last 7 days
find . -name "*.tmp" -delete  # Find and delete

# awk / sed: text processing
awk '{print $1}' file         # Print the first column
sed 's/old/new/g' file        # Replace all occurrences
sed -i 's/old/new/g' file     # Modify file in place
```

## Variables and Loops

```bash
# Variables (no spaces around the equals sign)
name="world"
echo "Hello, $name"
echo "File count: $(ls | wc -l)"

# for loop
for file in *.txt; do
    echo "Processing: $file"
    wc -l "$file"
done

# while loop
count=1
while [ $count -le 5 ]; do
    echo "Iteration $count"
    count=$((count + 1))
done
```

## Conditionals

```bash
# File tests
[ -f file ]   # Is a regular file
[ -d dir ]    # Is a directory
[ -x file ]   # Is executable

# String comparison
[ "$a" = "$b" ]     # Equal
[ -z "$str" ]       # String is empty

# if statement
if [ -f "config.yml" ]; then
    echo "Config file exists"
else
    echo "Please create config.yml"
fi
```

## Simple Script Template

```bash
#!/bin/bash
set -euo pipefail   # Exit on error, error on undefined variables

echo "=== Starting Deployment ==="

# Build
cd /path/to/project
npm run build

# Sync to server
rsync -avz dist/ user@server:/var/www/html/

echo "=== Deployment Complete ==="
```

`set -euo pipefail` is the standard for script safety—it prevents execution from continuing after a command fails.

## Useful Aliases

Add these to `~/.bashrc`:

```bash
alias ll='ls -alF'
alias gs='git status'
alias gp='git push'
alias gc='git commit'
alias ..='cd ..'
alias ...='cd ../..'

# Reload configuration
alias reload='source ~/.bashrc'
```

## Summary

| Command | Purpose |
|---------|---------|
| `ls / cd / pwd` | File and directory navigation |
| `cat / head / tail / less` | View file contents |
| `grep` | Text search |
| `|` (pipe) | Chain commands |
| `>` / `>>` | Output redirection |
| `for / while / if` | Control flow |
| `$(...)` | Command substitution |
| `chmod` | Permission management |

The core philosophy of Bash: combine small tools to accomplish complex tasks. Master pipes, redirection, variables, and control flow, and you will be able to write efficient command-line workflows.
