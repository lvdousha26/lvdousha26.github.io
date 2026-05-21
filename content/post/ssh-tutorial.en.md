---
title: "SSH Getting Started"
description: "A practical SSH tutorial for beginners, covering key authentication, port forwarding, and common configurations"
keywords: "ssh,remote connection,server,security,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - SSH
  - Tutorial
  - Tools
---

## What is SSH

SSH (Secure Shell) is the standard protocol for remotely logging into servers over an encrypted channel. It's not just for executing remote commands — it can also securely transfer files, forward ports, and set up tunnels.

<!--more-->

## Basic Connection

```bash
# Login with password
ssh user@192.168.1.100

# Specify a port (default is 22)
ssh -p 2222 user@host

# Execute a single command
ssh user@host "ls -la /var/log"
```

## Key Authentication: More Secure and Password-Free

Password login has two major problems: you have to type it every time, and it's vulnerable to brute force attacks. Key authentication is the standard practice.

```bash
# 1. Generate a key pair on your local machine
ssh-keygen -t ed25519 -C "your@email.com"
# Public key: ~/.ssh/id_ed25519.pub
# Private key: ~/.ssh/id_ed25519 (never share this)

# 2. Copy the public key to the server
ssh-copy-id user@host

# 3. From now on, log in directly without a password
ssh user@host
```

Ed25519 is recommended over RSA: it produces shorter keys and offers faster performance at the same security level.

## SSH Config: Give Each Machine an Alias

Edit `~/.ssh/config`:

```
Host my-server
    HostName 123.45.67.89
    User root
    Port 2222
    IdentityFile ~/.ssh/my-server.key

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

After this, just type `ssh my-server` — no need to remember the IP and port every time.

## File Transfer

```bash
# scp: securely copy files
scp local.txt user@host:/remote/path/    # Upload from local
scp user@host:/remote/file ./            # Download to local
scp -r src/ user@host:/remote/           # Recursively copy directories
scp -P 2222 file user@host:/path/        # Specify port

# rsync: incremental sync (faster, supports resuming interrupted transfers)
rsync -avz ./dist/ user@host:/var/www/   # Sync directories
rsync -avz --delete ./dist/ user@host:/var/www/  # Delete extra files on remote
```

scp is suitable for transferring single files; rsync is better for large directory syncs and deployments.

## Port Forwarding (Tunnels)

```bash
# Local port forwarding: accessing localhost:8080 reaches remote port 3000
ssh -L 8080:localhost:3000 user@host
# Now open http://localhost:8080 to access the remote server's port 3000

# Remote port forwarding: let the remote server access a service on your local machine
ssh -R 9090:localhost:3000 user@host

# Dynamic forwarding (SOCKS proxy)
ssh -D 1080 user@host
```

Local port forwarding is the most common use case: for example, when running Jupyter on a remote server, you don't need to expose the port directly — just access it through an SSH tunnel.

## Keep Alive: Prevent Idle Disconnections

Add the following to `~/.ssh/config`:

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

This sends a heartbeat every 60 seconds and only disconnects after 3 consecutive missed responses. Essential for VS Code Remote users.

## Security Recommendations

```bash
# Recommended server-side /etc/ssh/sshd_config settings:
PermitRootLogin no              # Disable direct root login
PasswordAuthentication no        # Disable passwords, allow keys only
Port 2222                        # Change from the default port 22
```

- Private key file permissions must be 600: `chmod 600 ~/.ssh/id_ed25519`
- Never share your private key
- Periodically use `ssh -v` to troubleshoot connection issues

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ssh user@host` | Remote login |
| `ssh-keygen -t ed25519` | Generate a key pair |
| `ssh-copy-id user@host` | Upload public key |
| `scp file user@host:/path` | Transfer files |
| `rsync -avz src/ dest/` | Sync directories |
| `ssh -L 8080:localhost:3000 proxy` | Local port forwarding |
| `~/.ssh/config` | Connection config aliases |
