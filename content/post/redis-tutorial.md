---
title: "Redis 入门：简单直接"
description: "Redis 是什么、怎么用、什么时候不该用"
keywords: "Redis,缓存,入门,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 后端
tags:
  - Redis
  - 缓存
  - 数据库
---

Redis 很快。非常快。

它把数据放在内存里。不写磁盘。所以快。

<!--more-->

## 什么是 Redis

Redis 是一个键值存储。你给它一个 key，它还你一个 value。

但它不只是 key-value。它懂数据结构。字符串、列表、集合、有序集合、哈希、流。它都懂。

大多数人用它做缓存。但它能做的更多。

## 安装

Linux 上：

```bash
apt install redis
```

macOS 上：

```bash
brew install redis
```

Docker 里：

```bash
docker run --name redis -p 6379:6379 -d redis
```

装完运行 `redis-cli`。输入 `PING`。它回 `PONG`。好了。

## 基本命令

设置一个 key：

```bash
SET name "lihua"
```

读取它：

```bash
GET name
# "lihua"
```

设过期时间（秒）：

```bash
SET token "abc123" EX 3600
```

检查还剩多久：

```bash
TTL token
# 3557
```

删掉一个 key：

```bash
DEL name
```

就这么简单。

## 数据结构

### 列表

队列用这个。

```bash
LPUSH tasks "send_email"
LPUSH tasks "resize_image"
RPOP tasks
# "send_email"
```

`LPUSH` 从左边推。`RPOP` 从右边弹出。先进先出。

### 集合

无序、不重复。

```bash
SADD tags:post:42 "redis" "tutorial" "backend"
SISMEMBER tags:post:42 "redis"
# 1
```

标签系统常用集合。

### 有序集合

带分数的集合。

```bash
ZADD leaderboard 100 "alice"
ZADD leaderboard 85 "bob"
ZADD leaderboard 92 "charlie"
ZREVRANGE leaderboard 0 -1
# alice, charlie, bob
```

排行榜就用这个。

### 哈希

存储对象。

```bash
HSET user:1 name "lihua" age "25" city "beijing"
HGET user:1 name
# "lihua"
HGETALL user:1
# name, lihua, age, 25, city, beijing
```

比存 JSON 字符串好。你可以只读一个字段。

## 缓存模式

### 旁路缓存

这是最常见的用法。

1. 查 Redis。
2. 有就返回。
3. 没有就查数据库。
4. 把结果存进 Redis。
5. 设个过期时间。

Python 代码像这样：

```python
import redis
import json

r = redis.Redis()

def get_user(user_id):
    cached = r.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)

    user = db.query(f"SELECT * FROM users WHERE id = {user_id}")
    r.setex(f"user:{user_id}", 300, json.dumps(user))
    return user
```

过期时间很重要。不要永远缓存。数据会变化。

## 什么时候不该用 Redis

Redis 需要内存。内存贵。

你的数据必须全部放进内存。10GB 数据？准备好 10GB 内存。

不要用 Redis 存大文件。存图片、存视频？不对。存文件路径就行。

不要用 Redis 做复杂查询。它没有 SQL。没有 JOIN。没有 WHERE age > 25。搜索用 Elasticsearch。复杂查询用 PostgreSQL。

持久化不是 Redis 的首要任务。它有 RDB 和 AOF。但它的设计是为了快，不是为了安全。别把银行交易记录只放在 Redis 里。

## 发布 / 订阅

Redis 可以发消息。

```bash
# 终端 1
SUBSCRIBE notifications
```

```bash
# 终端 2
PUBLISH notifications "new_user_signed_up"
```

终端 1 会收到消息。简单、轻量。不可靠。消息不会持久化。订户离线就收不到了。

WebSocket 广播、聊天消息可以用这个。重要消息别用。

## 分布式锁

Redis 可以当锁用。

```bash
SET lock:resource "unique-id" NX EX 10
```

`NX` 表示 key 不存在才设置。`EX 10` 表示 10 秒后自动释放。

拿到锁才能干活。干完删除 key。

小心。锁会过期。你的任务可能还没跑完锁就没了。用 Redlock 算法或者直接用成熟的库。

## 实用建议

给 key 命名时用冒号分隔。`user:1:profile`。不用 `user_1_profile`。冒号在 Redis 客户端里会分组显示。

给所有缓存设过期时间。永远设。忘记设的 key 会一直占内存。

配置 `maxmemory`。不要让它无限制增长。设一个上限，再设一个淘汰策略。`allkeys-lru` 是不错的选择。它删除最近最少使用的 key。

用 `MONITOR` 看实时命令流。调试时很有用。生产环境不要一直开着。

用 `SLOWLOG` 看慢命令。Redis 是单线程的。一个慢命令会阻塞所有请求。

## 总结

Redis 就是快。因为它用内存。因为设计简单。

它可以做缓存、做队列、做排行榜、做锁。但不要把它当成唯一的数据存储。它配合其他数据库使用。

开始很简单。装好。用 `SET` 和 `GET`。然后需要什么学什么。
