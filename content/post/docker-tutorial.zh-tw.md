---
title: "Docker 入門：別怕，真的沒那麼難"
description: "寫給完全沒接觸過容器的人，從裝好 Docker 到跑起第一個容器，再到寫 Dockerfile 部署自己的項目"
keywords: "docker,容器,部署,教程,入門"

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


實話說，我當初接觸 Docker 也是一頭霧水。什麼鏡像、容器、Dockerfile，看了好幾篇教程才勉強跑起來一個 nginx。後來工作裏用多了，發現核心概念其實一隻手數得過來。這篇儘量用大白話講清楚。

<!--more-->

## Docker 到底解決了什麼

想象你在自己電腦上寫了一個 Python 項目，Python 3.12，裝了一堆 pip 包。給同學跑，他 Python 3.9，包版本也不一樣，跑不起來。

Docker 做的事：把代碼**和它需要的一切**（Python 版本、系統庫、環境變量）打包成一個標準化的箱子。這個箱子在任何裝了 Docker 的機器上都能跑，一模一樣。

## 安裝

```bash
# macOS — 推薦 OrbStack，比 Docker Desktop 輕快多了
brew install orbstack

# 或者裝官方 Docker Desktop
brew install --cask docker

# Windows
winget install Docker.DockerDesktop

# Ubuntu
sudo apt install docker.io
sudo usermod -aG docker $USER  # 不用每次 sudo
```

驗證：

```bash
docker run hello-world
```

看到 "Hello from Docker!" 就 OK。

## 三個核心概念

### 鏡像(Image) — 一份食譜

鏡像是一個只讀的模板。比如 `python:3.12` 鏡像裏裝了 Ubuntu + Python 3.12。你可以把它想象成"配好環境的 zip 包"。

### 容器(Container) — 做好的菜

容器是鏡像的運行實例。一個鏡像可以起很多個容器，每個互相隔離。容器關了再開不會丟數據（除非你主動刪了它）。

### Dockerfile — 自己寫食譜

如果你的項目除了 Python 還要裝特定依賴、複製配置文件，就寫 Dockerfile 描述"怎麼從零構建這個環境"。

## 常用命令

```bash
# 看本地有哪些鏡像
docker images

# 看正在運行的容器
docker ps

# 看所有容器（包括關掉的）
docker ps -a

# 運行一個容器
docker run -d --name myapp -p 8080:80 nginx
# -d  後臺運行
# --name 給容器起名
# -p 8080:80  把本機 8080 端口映射到容器內 80 端口

# 進容器裏操作
docker exec -it myapp bash

# 停止 / 啓動 / 刪除
docker stop myapp
docker start myapp
docker rm myapp       # 刪容器
docker rmi nginx      # 刪鏡像

# 清理沒用的容器、鏡像、網絡
docker system prune -a
```

## 跑一個 Python 項目

假設有個簡單的 `main.py`：

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### 寫 Dockerfile

```dockerfile
# 基於官方 Python 鏡像
FROM python:3.12-slim

# 設置工作目錄
WORKDIR /app

# 先複製依賴文件（利用緩存，不重複裝包）
COPY requirements.txt .
RUN pip install -r requirements.txt

# 複製項目代碼
COPY . .

# 暴露端口
EXPOSE 5000

# 啓動命令
CMD ["python", "main.py"]
```

### 構建和運行

```bash
# 構建鏡像
docker build -t my-python-app .

# 運行容器
docker run -d -p 5000:5000 --name myapp my-python-app

# 訪問 http://localhost:5000 就能看到 Hello from Docker!
```

## Docker Compose — 多個服務一起跑

如果你有 app + 數據庫 + Redis 好幾個容器，一個個 `docker run` 太麻煩。用 `docker-compose.yml` 一次性編排：

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
# 一鍵啓動所有服務
docker compose up -d

# 查看日誌
docker compose logs -f app

# 停止
docker compose down
```

## 數據持久化 — Volume

容器刪了裏面的數據就沒了。想讓數據留下，掛載 Volume：

```bash
# 創建命名卷
docker volume create mydata

# 掛載到容器
docker run -v mydata:/app/data myapp

# 或者直接掛宿主機目錄
docker run -v ./local_folder:/app/data myapp
```

Docker Compose 裏寫 `volumes:` 也一樣。

## 實際開發中怎麼用

我一般這樣：

1. **本地開發**：直接跑 Python，不用 Docker（調試方便）
2. **測試環境**：`docker compose up` 起整套
3. **給別人跑**：給 Dockerfile + compose，他 `git clone` 後一行命令就跑起來
4. **部署**：服務器上也是 `docker compose up -d`

最常見的好處：換服務器不用重裝環境，項目遷移就是一坨 compose 和 Dockerfile。

## 常見坑

**鏡像太大**：用 `python:3.12-slim` 別用 `python:3.12`，後者大幾百 MB。

**構建慢**：`COPY requirements.txt .` 和 `RUN pip install` 放在 `COPY . .` 前面，這樣改代碼不會觸發重新裝包。

**端口映射搞反**：`-p 本機端口:容器端口`，別寫反了。

**容器一啓動就退出**：看日誌 `docker logs 容器名`。大概率是啓動命令執行完就結束了，比如前臺沒常駐進程。

## 速查表

| 需求 | 命令 |
|------|------|
| 跑一個容器 | `docker run -d -p 8080:80 --name xxx 鏡像名` |
| 進容器看情況 | `docker exec -it xxx bash` |
| 看日誌 | `docker logs -f xxx` |
| 構建鏡像 | `docker build -t 名字 .` |
| 多服務編排 | `docker compose up -d` |
| 停止全部 | `docker compose down` |
| 大掃除 | `docker system prune -a` |
| 看資源佔用 | `docker stats` |

我剛入門時踩的坑大都寫了。Docker 入門不難，真正複雜的是集羣和編排——但那不是你一開始需要操心的東西。先把單個項目的鏡像構建和容器跑通，日常夠用很久了。
