---
title: "AutoDL 免费算力白嫖指南：14 天实例与自动开关机"
description: "手把手教你利用 AutoDL 平台的自动开关机功能，在免费额度内高效跑深度学习实验"
keywords: "autodl,gpu,深度学习,免费算力,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - AutoDL
  - GPU
  - 深度学习
  - 教程
  - 小工具
---

## 什么是 AutoDL

[AutoDL](https://autodl.com/) 是国内最流行的 GPU 云平台之一，主打按量计费和性价比。对新用户提供**14 天免费实例**（含一张显卡），对学生尤其友好。

核心优势：

- 按小时计费，关机不收费（仅收少量存储费）
- 社区镜像丰富，PyTorch / TensorFlow 开箱即用
- 支持 SSH、JupyterLab、VS Code 远程开发
- 国内访问速度快，数据上传下载方便

<!--more-->

## 注册与领券

1. 打开 https://autodl.com → 注册账号
2. 完成学生认证（学生邮箱），领取免费额度
3. 新用户自动获得 14 天免费实例资格

进入控制台后，首页能看到你的余额和可用实例。

## 创建实例

```bash
# 关键配置
区域：就近选择（北京/上海/广州）
GPU：A100-40G / RTX 4090 / RTX 3090（按需选择）
镜像：选社区镜像，如 "PyTorch 2.x + Ubuntu 22.04"
计费：按量计费
```

创建后实例立即启动，获得 SSH 地址和端口号。

## 连接实例

```bash
# SSH 连接（最常用）
ssh -p 端口号 root@地区.autodl.com

# JupyterLab
# 在控制台点击 JupyterLab 按钮，自动打开

# VS Code Remote
# 在 VS Code 安装 Remote-SSH 扩展后配置
# ~/.ssh/config：
Host autodl
    HostName 地区.autodl.com
    Port 端口号
    User root
```

## 自动开关机：省钱关键

这是本文的核心。AutoDL 实例**关机后不收取 GPU 费用**，只收极少的存储费（几毛钱/天）。

### 平台内置自动关机

在控制台实例详情页 → 找到「自动关机」设置：

```
关机条件：
- 无任务运行超过 N 分钟自动关机
- 固定时间点自动关机

推荐设置：
- 无任务 30 分钟自动关机（防止忘了关白烧钱）
- 每天 23:00 定时关机（如果不需要通宵跑）
```

设置后即使忘了关，也不会一直烧钱。

### 利用 14 天免费期最大化利用率

14 天免费实例的关键策略：

```
每天 8:00 自动开机 → 跑一天实验 → 23:00 自动关机
相当于：14 天 × 15 小时 = 210 小时免费 GPU
如果 24 小时不关机：14 天 × 24 小时 = 336 小时
但每天的 8 小时睡眠时间 GPU 空转 = 浪费 112 小时
```

省下的额度可以用来开更好的卡（比如把 3090 换成 4090）。

### 手动开关机

```bash
# 网页控制台：实例列表 → 点击开关按钮

# 命令行（通过 AutoDL CLI）
pip install autodl
autodl login
autodl instance start <实例ID>
autodl instance stop <实例ID>
```

## 定时任务：自动开机后执行训练

关机后系统不会保存进程状态，所以开机后需要手动启动训练。可以用 `crontab` 让开机后自动执行：

```bash
# 在实例内编辑 crontab
crontab -e

# 添加开机自启动任务
@reboot sleep 30 && cd /root/project && python train.py
```

或者用 `tmux` / `screen` 保持会话：

```bash
# 创建一个 tmux 会话跑训练
tmux new -s training
cd /root/project
python train.py

# 按 Ctrl+B 然后 D 分离会话
# 即使 SSH 断开训练也不会中断

# 重新连接后恢复
tmux attach -t training
```

## 数据传输

```bash
# 从本地上传文件到实例
scp -P 端口号 ./data.zip root@地区.autodl.com:/root/

# 从实例下载结果
scp -P 端口号 root@地区.autodl.com:/root/results/ ./local_results/

# 挂载阿里云盘 / 百度网盘（部分镜像内置支持）
# 参考具体镜像的文档说明
```

## 实验数据持久化

关机后系统盘数据保留，但 AutoDL 的免费实例到期后会销毁。重要数据务必提前备份：

```bash
# 1. 训练过程中的 checkpoint 下载到本地
rsync -avz -e "ssh -p 端口号" root@地区.autodl.com:/root/project/checkpoints/ ./local_backup/

# 2. 代码推送到 GitHub
git push origin main

# 3. 大文件存到对象存储（OSS / COS / S3）
# 参考各厂商 SDK 上传
```

## 免费实例到期后

14 天到期后：

| 方案 | 费用 |
|------|------|
| 按量续费 | RTX 3090 ~2 元/小时，3090 ~3 元/小时 |
| 抢特价实例 | 偶尔有 0.99 元/小时的特价卡 |
| 注册新账号 | 再白嫖 14 天（不推荐，可能被封） |
| 用免费额度 | 学生认证送的券大概够跑几十小时 |

精打细算的话，学生身份送的额度足够做一个完整的课程项目或竞赛。

## 常用速查

| 操作 | 方法 |
|------|------|
| 创建实例 | 控制台 → 选区/选卡/选镜像 → 创建 |
| SSH 登录 | `ssh -p 端口 root@地区.autodl.com` |
| 上传文件 | `scp -P 端口 file root@host:/path` |
| 自动关机 | 控制台实例详情 → 设置无任务关机 |
| 手动关机 | 控制台或 `autodl instance stop` |
| tmux 持久化 | `tmux new -s name` → Ctrl+B D 分离 |
| 数据备份 | scp/rsync 下载 + git push |

AutoDL 是目前国内对学生最友好的 GPU 平台之一。用好自动开关机和 tmux，能在大作业和竞赛里省下不少奶茶钱。
