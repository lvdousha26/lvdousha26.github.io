---
title: "Redis 入門：シンプル・ストレート"
description: "Redisとは何か、使い方、使うべきでない時"
keywords: "Redis,キャッシュ,入門,チュートリアル"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - バックエンド
tags:
  - Redis
  - キャッシュ
  - データベース
---

Redisは速い。とても速い。

データをメモリに置く。ディスクには書き込まない。だから速い。

<!--more-->

## Redisとは何か

Redisはキー・バリューストアです。キーを与えると、バリューを返します。

しかし、それは単なるkey-valueではありません。データ構造を理解しています。文字列、リスト、セット、ソート済みセット、ハッシュ、ストリーム。すべて理解しています。

ほとんどの人はキャッシュとして使います。しかし、それ以上のことができます。

## インストール

Linuxの場合：

```bash
apt install redis
```

macOSの場合：

```bash
brew install redis
```

Dockerの場合：

```bash
docker run --name redis -p 6379:6379 -d redis
```

インストールが終わったら `redis-cli` を実行します。`PING` と入力すれば、`PONG` と返ってきます。完了です。

## 基本コマンド

キーを設定する：

```bash
SET name "lihua"
```

読み取る：

```bash
GET name
# "lihua"
```

有効期限を設定する（秒）：

```bash
SET token "abc123" EX 3600
```

残り時間を確認する：

```bash
TTL token
# 3557
```

キーを削除する：

```bash
DEL name
```

これだけ簡単です。

## データ構造

### リスト

キューとして使います。

```bash
LPUSH tasks "send_email"
LPUSH tasks "resize_image"
RPOP tasks
# "send_email"
```

`LPUSH` で左からプッシュ。`RPOP` で右からポップ。先入れ先出しです。

### セット

順序なし、重複なし。

```bash
SADD tags:post:42 "redis" "tutorial" "backend"
SISMEMBER tags:post:42 "redis"
# 1
```

タグシステムによく使われます。

### ソート済みセット

スコア付きのセット。

```bash
ZADD leaderboard 100 "alice"
ZADD leaderboard 85 "bob"
ZADD leaderboard 92 "charlie"
ZREVRANGE leaderboard 0 -1
# alice, charlie, bob
```

ランキングに最適です。

### ハッシュ

オブジェクトの保存に使います。

```bash
HSET user:1 name "lihua" age "25" city "beijing"
HGET user:1 name
# "lihua"
HGETALL user:1
# name, lihua, age, 25, city, beijing
```

JSON文字列を保存するより優れています。1つのフィールドだけを読み取れます。

## キャッシュパターン

### キャッシュ・アサイド（旁路キャッシュ）

これが最も一般的な使い方です。

1. Redisを確認する。
2. あれば返す。
3. なければデータベースを確認する。
4. 結果をRedisに保存する。
5. 有効期限を設定する。

Pythonコードは次のようになります：

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

有効期限は重要です。永久にキャッシュしてはいけません。データは変わります。

## Redisを使うべきでない時

Redisにはメモリが必要です。メモリは高価です。

すべてのデータをメモリに収めなければなりません。10GBのデータ？10GBのメモリを用意してください。

大きなファイルをRedisに保存してはいけません。画像や動画を保存する？違います。ファイルパスを保存すれば十分です。

複雑なクエリにRedisを使ってはいけません。SQLはありません。JOINもありません。WHERE age > 25もありません。検索にはElasticsearch。複雑なクエリにはPostgreSQLです。

永続化はRedisの主目的ではありません。RDBやAOFはありますが、設計は速度のためであり、安全性のためではありません。銀行の取引記録をRedisだけに保存してはいけません。

## パブリッシュ／サブスクライブ

Redisはメッセージを送れます。

```bash
# 端末 1
SUBSCRIBE notifications
```

```bash
# 端末 2
PUBLISH notifications "new_user_signed_up"
```

端末1がメッセージを受信します。シンプル、軽量。信頼性はありません。メッセージは永続化されません。購読者がオフラインだとメッセージを受信できません。

WebSocketのブロードキャストやチャットメッセージに使えます。重要なメッセージには使わないでください。

## 分散ロック

Redisはロックとして使えます。

```bash
SET lock:resource "unique-id" NX EX 10
```

`NX` はキーが存在しない場合のみ設定することを意味します。`EX 10` は10秒後に自動解放することを意味します。

ロックを取得したら処理を実行します。処理が終わったらキーを削除します。

注意してください。ロックは期限切れになります。タスクが終わる前にロックが切れるかもしれません。Redlockアルゴリズムを使うか、成熟したライブラリを直接利用してください。

## 実用的なアドバイス

キーに名前を付けるときはコロンで区切ります。`user:1:profile` のように。`user_1_profile` ではありません。コロンを使うと、Redisクライアント上でグループ化して表示されます。

すべてのキャッシュに有効期限を設定してください。必ず設定してください。設定し忘れたキーはずっとメモリを占有し続けます。

`maxmemory` を設定してください。際限なく増やさないでください。上限を決め、追い出しポリシーも設定します。`allkeys-lru` は良い選択肢です。最も最近使われていないキーを削除します。

`MONITOR` でリアルタイムのコマンドストリームを確認できます。デバッグに便利です。本番環境では常時オンにしないでください。

`SLOWLOG` で低速コマンドを確認します。Redisはシングルスレッドです。1つの低速コマンドがすべてのリクエストをブロックします。

## まとめ

Redisはとにかく速いです。メモリを使うからです。設計がシンプルだからです。

キャッシュ、キュー、ランキング、ロックとして使えます。しかし、唯一のデータストアとしては使わないでください。他のデータベースと組み合わせて使うものです。

始めるのは簡単です。インストールして、`SET` と `GET` を使う。そして、必要に応じて学んでいけばよいのです。
