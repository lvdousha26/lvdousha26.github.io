---
title: "Postman APIデバッグ入門"
description: "Postmanでリクエスト送信、環境変数管理、テストスクリプト作成、ドキュメントエクスポートまで。フロントエンドとバックエンドの連携デバッグを推測に頼らずスムーズに"
keywords: "postman,api,デバッグ,APIテスト,チュートリアル"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - Postman
  - API
  - デバッグ
  - チュートリアル
  - 便利ツール
---

バックエンドからAPIドキュメントをもらったら、curlで毎回手動でURLを叩き、JSONを組み立て、レスポンスを確認する——それでもできないことはありませんが、Postmanを使えばもっと快適に作業できます。リクエストの保存、環境の切り替え、アサーションの記述、ドキュメントのエクスポートまで、すべて一つの画面で完結します。

<!--more-->

## インストール

```bash
# macOS
brew install --cask postman

# Windows
winget install Postman.Postman

# 或者直接官网下：https://www.postman.com/downloads/
```

無料アカウントに登録すれば、すべての基本機能を使用できます。

## インターフェースの概要

```
┌───────────┬──────────────────┐
│  Collections  │  GET /api/users  │
│  (请求文件夹)  │  Params Headers   │
│               │  Body   Tests     │
│  History      │                   │
│               │  { response }     │
└───────────┴──────────────────┘
```

左上のCollectionsでリクエストを整理し、中央はリクエスト構築エリア、下部はレスポンスエリアです。

## 最初のリクエスト

```
1. 新しいCollectionを作成：My API
2. Collectionを右クリック → Add Request → 名前を「Get Users」に設定
3. MethodをGETに選択、URLに https://jsonplaceholder.typicode.com/users を入力
4. Sendをクリック
```

右側にレスポンスJSONとステータス200 OKが表示されます。

POSTリクエストも同様です：

```
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Body → raw → JSON:
{
  "title": "test",
  "body": "hello",
  "userId": 1
}
```

## 変数 — 毎回URLを変更しなくていい

`{{base_url}}/users` のように書けば、`base_url` は変数として扱われ、環境を切り替えると自動的に値が変わります。

右上のEnvironments → 新規作成：

```
変数名: base_url
初期値: http://localhost:8000
現在値: http://localhost:8000
```

さらにProduction環境を新規作成：

```
base_url: https://api.example.com
```

右上で環境を切り替えれば、リクエスト内の `{{base_url}}` が自動的に追随します。

## Pre-request Script — リクエスト前に自動実行

たとえば、ログインAPIを先に叩いてトークンを取得し、変数に格納する：

```javascript
// Pre-request Script 标签页
pm.sendRequest({
  url: "{{base_url}}/auth/login",
  method: "POST",
  header: { "Content-Type": "application/json" },
  body: { mode: "raw", raw: JSON.stringify({ username: "admin", password: "123456" }) }
}, (err, res) => {
  const json = res.json();
  pm.environment.set("token", json.access_token);
});
```

その後、リクエストのAuthorizationタブでBearer Tokenを選択し、`{{token}}` と入力します。

## Tests — 戻り値を自動検証

JavaScriptでアサーションを記述し、リクエスト送信後に自動実行されます：

```javascript
// Tests 标签页

pm.test("状态码是 200", () => {
  pm.response.to.have.status(200);
});

pm.test("返回的是数组", () => {
  const json = pm.response.json();
  pm.expect(Array.isArray(json)).to.be.true;
});

pm.test("第一个用户有 id", () => {
  const json = pm.response.json();
  pm.expect(json[0]).to.have.property("id");
});

// 把某字段存成变量供后续请求用
const json = pm.response.json();
pm.collectionVariables.set("userId", json[0].id);
```

## Collection Runner — 一括実行

Collectionの右側にあるRunをクリック：

```
Collectionを選択 → 実行するリクエストを選択 → イテレーション回数を設定 → Run
```

すべてのリクエストを実行し、Pass/Failを自動集計します。APIのリグレッションテストに最適です。

## ドキュメントのエクスポート

Collectionの右側にある矢印 → View in Web → 自動的に見やすいAPIドキュメントページが生成されます。フロントエンドの同僚に共有しましょう。

または Export → OpenAPI / Swagger JSONとしてエクスポートも可能です。

## 実際のワークフロー

1. APIドキュメントを受け取る → Collectionを作成
2. 各エンドポイントをRequestとして作成し、URL、Headers、Bodyを記入
3. 環境変数を設定（開発 / テスト / 本番の3セット）
4. Testsを記述して重要な戻り値を検証
5. 動作確認ができたらドキュメントをエクスポート、またはCollectionを共有
6. コード変更後にCollection Runnerを実行して影響がないことを確認

## クイックリファレンス

| 目的 | 操作 |
|------|------|
| リクエスト送信 | URLを入力 → Send |
| 環境切替 | 右上のドロップダウン |
| 変数の参照 | `{{変数名}}` |
| 戻り値の取得 | `pm.response.json()` |
| 変数の設定 | `pm.environment.set("key", value)` |
| アサーション | `pm.test("説明", () => { pm.expect(...) })` |
| 一括実行 | Collection → Run |
| ドキュメント出力 | Collection → View in Web |
