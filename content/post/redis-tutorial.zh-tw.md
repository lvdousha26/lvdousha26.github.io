---
title: "Redis 入門：簡單直接"
description: "Redis 是什麼、怎麼用、什麼時候不該用"
keywords: "Redis,緩存,入門,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 後端
tags:
  - Redis
  - 緩存
  - 數據庫
---


Redis 很快。非常快。

它把數據放在內存裏。不寫磁盤。所以快。

<!--more-->

## 什麼是 Redis

Redis 是一個鍵值存儲。你給它一個 key，它還你一個 value。

但它不只是 key-value。它懂數據結構。字符串、列表、集合、有序集合、哈希、流。它都懂。

大多數人用它做緩存。但它能做的更多。

## 安裝

Linux 上：

```bash
apt install redis
```

macOS 上：

```bash
brew install redis
```

Docker 裏：

```bash
docker run --name redis -p 6379:6379 -d redis
```

裝完運行 `redis-cli`。輸入 `PING`。它回 `PONG`。好了。

## 基本命令

設置一個 key：

```bash
SET name "lihua"
```

讀取它：

```bash
GET name
# "lihua"
```

設過期時間（秒）：

```bash
SET token "abc123" EX 3600
```

檢查還剩多久：

```bash
TTL token
# 3557
```

刪掉一個 key：

```bash
DEL name
```

就這麼簡單。

## 數據結構

### 列表

隊列用這個。

```bash
LPUSH tasks "send_email"
LPUSH tasks "resize_image"
RPOP tasks
# "send_email"
```

`LPUSH` 從左邊推。`RPOP` 從右邊彈出。先進先出。

### 集合

無序、不重複。

```bash
SADD tags:post:42 "redis" "tutorial" "backend"
SISMEMBER tags:post:42 "redis"
# 1
```

標籤系統常用集合。

### 有序集合

帶分數的集合。

```bash
ZADD leaderboard 100 "alice"
ZADD leaderboard 85 "bob"
ZADD leaderboard 92 "charlie"
ZREVRANGE leaderboard 0 -1
# alice, charlie, bob
```

排行榜就用這個。

### 哈希

存儲對象。

```bash
HSET user:1 name "lihua" age "25" city "beijing"
HGET user:1 name
# "lihua"
HGETALL user:1
# name, lihua, age, 25, city, beijing
```

比存 JSON 字符串好。你可以只讀一個字段。

## 緩存模式

### 旁路緩存

這是最常見的用法。

1. 查 Redis。
2. 有就返回。
3. 沒有就查數據庫。
4. 把結果存進 Redis。
5. 設個過期時間。

Python 代碼像這樣：

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

過期時間很重要。不要永遠緩存。數據會變化。

## 什麼時候不該用 Redis

Redis 需要內存。內存貴。

你的數據必須全部放進內存。10GB 數據？準備好 10GB 內存。

不要用 Redis 存大文件。存圖片、存視頻？不對。存文件路徑就行。

不要用 Redis 做複雜查詢。它沒有 SQL。沒有 JOIN。沒有 WHERE age > 25。搜索用 Elasticsearch。複雜查詢用 PostgreSQL。

持久化不是 Redis 的首要任務。它有 RDB 和 AOF。但它的設計是爲了快，不是爲了安全。別把銀行交易記錄只放在 Redis 裏。

## 發佈 / 訂閱

Redis 可以發消息。

```bash
# 終端 1
SUBSCRIBE notifications
```

```bash
# 終端 2
PUBLISH notifications "new_user_signed_up"
```

終端 1 會收到消息。簡單、輕量。不可靠。消息不會持久化。訂戶離線就收不到了。

WebSocket 廣播、聊天消息可以用這個。重要消息別用。

## 分佈式鎖

Redis 可以當鎖用。

```bash
SET lock:resource "unique-id" NX EX 10
```

`NX` 表示 key 不存在才設置。`EX 10` 表示 10 秒後自動釋放。

拿到鎖才能幹活。幹完刪除 key。

小心。鎖會過期。你的任務可能還沒跑完鎖就沒了。用 Redlock 算法或者直接用成熟的庫。

## 實用建議

給 key 命名時用冒號分隔。`user:1:profile`。不用 `user_1_profile`。冒號在 Redis 客戶端裏會分組顯示。

給所有緩存設過期時間。永遠設。忘記設的 key 會一直佔內存。

配置 `maxmemory`。不要讓它無限制增長。設一個上限，再設一個淘汰策略。`allkeys-lru` 是不錯的選擇。它刪除最近最少使用的 key。

用 `MONITOR` 看實時命令流。調試時很有用。生產環境不要一直開着。

用 `SLOWLOG` 看慢命令。Redis 是單線程的。一個慢命令會阻塞所有請求。

## 總結

Redis 就是快。因爲它用內存。因爲設計簡單。

它可以做緩存、做隊列、做排行榜、做鎖。但不要把它當成唯一的數據存儲。它配合其他數據庫使用。

開始很簡單。裝好。用 `SET` 和 `GET`。然後需要什麼學什麼。
