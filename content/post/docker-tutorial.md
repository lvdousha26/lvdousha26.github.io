---
title: "Docker 入门：别怕，真的没那么难"
description: "写给完全没接触过容器的人，从装好 Docker 到跑起第一个容器，再到写 Dockerfile 部署自己的项目"
keywords: "docker,容器,部署,教程,入门"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Docker
  - 容器
  - 部署
  - 教程
  - 小工具
---

实话说，我当初接触 Docker 也是一头雾水。什么镜像、容器、Dockerfile，看了好几篇教程才勉强跑起来一个 nginx。后来工作里用多了，发现核心概念其实一只手数得过来。这篇尽量用大白话讲清楚。

<!--more-->

## Docker 到底解决了什么

想象你在自己电脑上写了一个 Python 项目，Python 3.12，装了一堆 pip 包。给同学跑，他 Python 3.9，包版本也不一样，跑不起来。

Docker 做的事：把代码**和它需要的一切**（Python 版本、系统库、环境变量）打包成一个标准化的箱子。这个箱子在任何装了 Docker 的机器上都能跑，一模一样。

## 安装

```bash
# macOS — 推荐 OrbStack，比 Docker Desktop 轻快多了
brew install orbstack

# 或者装官方 Docker Desktop
brew install --cask docker

# Windows
winget install Docker.DockerDesktop

# Ubuntu
sudo apt install docker.io
sudo usermod -aG docker $USER  # 不用每次 sudo
```

验证：

```bash
docker run hello-world
```

看到 "Hello from Docker!" 就 OK。

## 三个核心概念

### 镜像(Image) — 一份食谱

镜像是一个只读的模板。比如 `python:3.12` 镜像里装了 Ubuntu + Python 3.12。你可以把它想象成"配好环境的 zip 包"。

### 容器(Container) — 做好的菜

容器是镜像的运行实例。一个镜像可以起很多个容器，每个互相隔离。容器关了再开不会丢数据（除非你主动删了它）。

### Dockerfile — 自己写食谱

如果你的项目除了 Python 还要装特定依赖、复制配置文件，就写 Dockerfile 描述"怎么从零构建这个环境"。

## 常用命令

```bash
# 看本地有哪些镜像
docker images

# 看正在运行的容器
docker ps

# 看所有容器（包括关掉的）
docker ps -a

# 运行一个容器
docker run -d --name myapp -p 8080:80 nginx
# -d  后台运行
# --name 给容器起名
# -p 8080:80  把本机 8080 端口映射到容器内 80 端口

# 进容器里操作
docker exec -it myapp bash

# 停止 / 启动 / 删除
docker stop myapp
docker start myapp
docker rm myapp       # 删容器
docker rmi nginx      # 删镜像

# 清理没用的容器、镜像、网络
docker system prune -a
```

## 跑一个 Python 项目

假设有个简单的 `main.py`：

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### 写 Dockerfile

```dockerfile
# 基于官方 Python 镜像
FROM python:3.12-slim

# 设置工作目录
WORKDIR /app

# 先复制依赖文件（利用缓存，不重复装包）
COPY requirements.txt .
RUN pip install -r requirements.txt

# 复制项目代码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["python", "main.py"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t my-python-app .

# 运行容器
docker run -d -p 5000:5000 --name myapp my-python-app

# 访问 http://localhost:5000 就能看到 Hello from Docker!
```

## Docker Compose — 多个服务一起跑

如果你有 app + 数据库 + Redis 好几个容器，一个个 `docker run` 太麻烦。用 `docker-compose.yml` 一次性编排：

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# 一键启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f app

# 停止
docker compose down
```

## 数据持久化 — Volume

容器删了里面的数据就没了。想让数据留下，挂载 Volume：

```bash
# 创建命名卷
docker volume create mydata

# 挂载到容器
docker run -v mydata:/app/data myapp

# 或者直接挂宿主机目录
docker run -v ./local_folder:/app/data myapp
```

Docker Compose 里写 `volumes:` 也一样。

## 实际开发中怎么用

我一般这样：

1. **本地开发**：直接跑 Python，不用 Docker（调试方便）
2. **测试环境**：`docker compose up` 起整套
3. **给别人跑**：给 Dockerfile + compose，他 `git clone` 后一行命令就跑起来
4. **部署**：服务器上也是 `docker compose up -d`

最常见的好处：换服务器不用重装环境，项目迁移就是一坨 compose 和 Dockerfile。

## 常见坑

**镜像太大**：用 `python:3.12-slim` 别用 `python:3.12`，后者大几百 MB。

**构建慢**：`COPY requirements.txt .` 和 `RUN pip install` 放在 `COPY . .` 前面，这样改代码不会触发重新装包。

**端口映射搞反**：`-p 本机端口:容器端口`，别写反了。

**容器一启动就退出**：看日志 `docker logs 容器名`。大概率是启动命令执行完就结束了，比如前台没常驻进程。

## 速查表

| 需求 | 命令 |
|------|------|
| 跑一个容器 | `docker run -d -p 8080:80 --name xxx 镜像名` |
| 进容器看情况 | `docker exec -it xxx bash` |
| 看日志 | `docker logs -f xxx` |
| 构建镜像 | `docker build -t 名字 .` |
| 多服务编排 | `docker compose up -d` |
| 停止全部 | `docker compose down` |
| 大扫除 | `docker system prune -a` |
| 看资源占用 | `docker stats` |

我刚入门时踩的坑大都写了。Docker 入门不难，真正复杂的是集群和编排——但那不是你一开始需要操心的东西。先把单个项目的镜像构建和容器跑通，日常够用很久了。
