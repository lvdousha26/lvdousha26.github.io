---
title: "Docker for Beginners: It's Really Not That Hard"
description: "Written for those completely new to containers — from installing Docker and running your first container, to writing a Dockerfile and deploying your own project"
keywords: "docker,container,deployment,tutorial,beginner"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Docker
  - Container
  - Deployment
  - Tutorial
  - Mini Tools
---

To be honest, when I first got into Docker, I was totally confused. Images, containers, Dockerfiles — I had to read several tutorials just to barely get an nginx running. After using it more at work, I realized the core concepts can actually be counted on one hand. This post aims to explain things in plain language.

<!--more-->

## What Problem Does Docker Actually Solve?

Imagine you wrote a Python project on your own machine — Python 3.12, with a bunch of pip packages installed. You send it to a friend to run; he has Python 3.9, different package versions, and it just won't run.

What Docker does: it packages your code **and everything it needs** (Python version, system libraries, environment variables) into a standardized box. This box can run on any machine with Docker installed, and it behaves identically.

## Installation

```bash
# macOS — OrbStack recommended, much lighter than Docker Desktop
brew install orbstack

# Or install official Docker Desktop
brew install --cask docker

# Windows
winget install Docker.DockerDesktop

# Ubuntu
sudo apt install docker.io
sudo usermod -aG docker $USER  # avoid typing sudo every time
```

Verify:

```bash
docker run hello-world
```

If you see "Hello from Docker!", you're good.

## Three Core Concepts

### Image — A Recipe

An image is a read-only template. For example, the `python:3.12` image contains Ubuntu + Python 3.12. Think of it as a "pre-configured environment zip file."

### Container — The Cooked Dish

A container is a running instance of an image. One image can spawn many containers, each isolated from the others. Containers don't lose data when stopped and restarted (unless you explicitly delete them).

### Dockerfile — Write Your Own Recipe

If your project needs specific dependencies or config files beyond just Python, write a Dockerfile describing "how to build this environment from scratch."

## Common Commands

```bash
# List local images
docker images

# List running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# Run a container
docker run -d --name myapp -p 8080:80 nginx
# -d  run in background
# --name  give the container a name
# -p 8080:80  map host port 8080 to container port 80

# Enter a container
docker exec -it myapp bash

# Stop / Start / Delete
docker stop myapp
docker start myapp
docker rm myapp       # delete container
docker rmi nginx      # delete image

# Clean up unused containers, images, networks
docker system prune -a
```

## Run a Python Project

Suppose you have a simple `main.py`:

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### Write a Dockerfile

```dockerfile
# Based on the official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy dependency file first (leverage caching, avoid reinstalling)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project code
COPY . .

# Expose port
EXPOSE 5000

# Startup command
CMD ["python", "main.py"]
```

### Build and Run

```bash
# Build the image
docker build -t my-python-app .

# Run the container
docker run -d -p 5000:5000 --name myapp my-python-app

# Visit http://localhost:5000 — you'll see Hello from Docker!
```

## Docker Compose — Running Multiple Services Together

If you have several containers (app + database + Redis), running `docker run` for each one is tedious. Use `docker-compose.yml` to orchestrate everything at once:

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
# Start all services with one command
docker compose up -d

# View logs
docker compose logs -f app

# Stop
docker compose down
```

## Data Persistence — Volumes

When a container is deleted, its data is lost. To keep data around, mount a volume:

```bash
# Create a named volume
docker volume create mydata

# Mount it to a container
docker run -v mydata:/app/data myapp

# Or mount a host directory directly
docker run -v ./local_folder:/app/data myapp
```

In Docker Compose, just write `volumes:` the same way.

## How to Use It in Real Development

Here's my typical workflow:

1. **Local development**: Run Python directly, no Docker (easier debugging)
2. **Test environment**: `docker compose up` to spin up the whole stack
3. **Share with others**: Give them the Dockerfile + compose file; after `git clone`, everything runs with a single command
4. **Deployment**: Also `docker compose up -d` on the server

The biggest benefit: switching servers doesn't require reinstalling environments. Migrating a project is just moving a compose file and Dockerfile.

## Common Pitfalls

**Image too large**: Use `python:3.12-slim` instead of `python:3.12` — the latter is several hundred MB larger.

**Slow builds**: Put `COPY requirements.txt .` and `RUN pip install` before `COPY . .`, so code changes won't trigger a full package reinstall.

**Port mapping reversed**: `-p host_port:container_port` — don't mix them up.

**Container exits immediately**: Check logs with `docker logs container_name`. It usually means the startup command finished and there's no foreground process running.

## Quick Reference

| Goal | Command |
|------|---------|
| Run a container | `docker run -d -p 8080:80 --name xxx image_name` |
| Enter a container | `docker exec -it xxx bash` |
| View logs | `docker logs -f xxx` |
| Build an image | `docker build -t name .` |
| Multi-service orchestration | `docker compose up -d` |
| Stop everything | `docker compose down` |
| Full cleanup | `docker system prune -a` |
| Check resource usage | `docker stats` |

I've written down most of the pitfalls I encountered when I was starting out. Docker basics aren't hard — what's truly complex is clustering and orchestration, but that's not something you need to worry about at the beginning. Just focus on building images and running containers for a single project, and that will serve you well for daily use.
