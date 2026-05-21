---
title: "Redis: Straight to the Point"
description: "What Redis is, how to use it, and when not to use it"
keywords: "Redis,caching,getting started,tutorial"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Backend
tags:
  - Redis
  - Caching
  - Database
---

Redis is fast. Very fast.

It keeps data in memory. No disk writes. That's why it's fast.

<!--more-->

## What Is Redis

Redis is a key-value store. You give it a key, it gives you a value.

But it's not just key-value. It understands data structures. Strings, lists, sets, sorted sets, hashes, streams. It knows them all.

Most people use it for caching. But it can do much more.

## Installation

On Linux:

```bash
apt install redis
```

On macOS:

```bash
brew install redis
```

With Docker:

```bash
docker run --name redis -p 6379:6379 -d redis
```

Once installed, run `redis-cli`. Type `PING`. It replies `PONG`. You're all set.

## Basic Commands

Set a key:

```bash
SET name "lihua"
```

Read it:

```bash
GET name
# "lihua"
```

Set with expiration (seconds):

```bash
SET token "abc123" EX 3600
```

Check how much time is left:

```bash
TTL token
# 3557
```

Delete a key:

```bash
DEL name
```

Simple as that.

## Data Structures

### Lists

Use these for queues.

```bash
LPUSH tasks "send_email"
LPUSH tasks "resize_image"
RPOP tasks
# "send_email"
```

`LPUSH` pushes from the left. `RPOP` pops from the right. First in, first out.

### Sets

Unordered, no duplicates.

```bash
SADD tags:post:42 "redis" "tutorial" "backend"
SISMEMBER tags:post:42 "redis"
# 1
```

Sets are common for tag systems.

### Sorted Sets

Sets with scores.

```bash
ZADD leaderboard 100 "alice"
ZADD leaderboard 85 "bob"
ZADD leaderboard 92 "charlie"
ZREVRANGE leaderboard 0 -1
# alice, charlie, bob
```

Use this for leaderboards.

### Hashes

Store objects.

```bash
HSET user:1 name "lihua" age "25" city "beijing"
HGET user:1 name
# "lihua"
HGETALL user:1
# name, lihua, age, 25, city, beijing
```

Better than storing a JSON string. You can read just one field.

## Caching Patterns

### Cache-Aside

This is the most common pattern.

1. Check Redis.
2. If found, return it.
3. If not found, query the database.
4. Store the result in Redis.
5. Set an expiration time.

In Python:

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

Expiration is important. Never cache forever. Data changes.

## When Not to Use Redis

Redis needs memory. Memory is expensive.

All your data must fit in memory. 10 GB of data? Prepare 10 GB of memory.

Don't use Redis for large files. Storing images, videos? Wrong. Store the file path instead.

Don't use Redis for complex queries. It has no SQL. No JOIN. No WHERE age > 25. Use Elasticsearch for search. Use PostgreSQL for complex queries.

Persistence is not Redis's primary job. It has RDB and AOF. But it's designed for speed, not safety. Don't put bank transactions only in Redis.

## Publish / Subscribe

Redis can send messages.

```bash
# Terminal 1
SUBSCRIBE notifications
```

```bash
# Terminal 2
PUBLISH notifications "new_user_signed_up"
```

Terminal 1 will receive the message. Simple, lightweight. Unreliable. Messages are not persisted. Offline subscribers miss them.

Use this for WebSocket broadcasting, chat messages. Not for important messages.

## Distributed Locks

Redis can act as a lock.

```bash
SET lock:resource "unique-id" NX EX 10
```

`NX` means only set if the key doesn't exist. `EX 10` means auto-release after 10 seconds.

Whoever gets the lock does the work. Delete the key when done.

Be careful. Locks expire. Your task might not finish before the lock is gone. Use the Redlock algorithm or a well-established library.

## Practical Tips

Name your keys with colons. `user:1:profile`. Not `user_1_profile`. Colons make keys display in groups in Redis clients.

Always set expiration on cached data. Always. Keys without expiration will eat up memory forever.

Configure `maxmemory`. Don't let it grow unbounded. Set a limit and an eviction policy. `allkeys-lru` is a good choice. It evicts the least recently used keys.

Use `MONITOR` to watch the live command stream. Great for debugging. Don't leave it on in production.

Use `SLOWLOG` to find slow commands. Redis is single-threaded. One slow command blocks everything.

## Summary

Redis is fast because it uses memory. Because the design is simple.

It can do caching, queues, leaderboards, locks. But don't treat it as your only data store. It works best alongside other databases.

Getting started is simple. Install. Use `SET` and `GET`. Then learn what you need as you go.
