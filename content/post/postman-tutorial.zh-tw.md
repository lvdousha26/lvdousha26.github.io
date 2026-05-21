---
title: "Postman 接口調試入門"
description: "用 Postman 發請求、管理環境變量、寫測試腳本、導出文檔，前後端聯調不再靠猜"
keywords: "postman,api,調試,接口測試,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Postman
  - API
  - 調試
  - 教程
  - 小工具
---


後端給個接口文檔，你用 curl 一遍遍手動敲 URL、拼 JSON、看返回——也不是不行，但 Postman 把這事做得舒服很多。保存請求、切換環境、寫斷言、導出文檔，都在一個界面裏。

<!--more-->

## 安裝

```bash
# macOS
brew install --cask postman

# Windows
winget install Postman.Postman

# 或者直接官網下：https://www.postman.com/downloads/
```

註冊免費賬號即可用全部基礎功能。

## 界面長這樣

```
┌───────────┬──────────────────┐
│  Collections  │  GET /api/users  │
│  (請求文件夾)  │  Params Headers   │
│               │  Body   Tests     │
│  History      │                   │
│               │  { response }     │
└───────────┴──────────────────┘
```

左上角 Collections 組織請求，中間是請求構造區，下面是響應區。

## 發第一個請求

```
1. 新建 Collection：My API
2. Collection 右鍵 → Add Request → 起名 "Get Users"
3. Method 選 GET，URL 填 https://jsonplaceholder.typicode.com/users
4. 點 Send
```

右側看到響應 JSON 和狀態 200 OK。

POST 請求同理：

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

## 變量 — 不用每次改 URL

{{base_url}}/users 這樣的寫法，base_url 是變量，切換環境自動換值。

右上角 Environments → 新建：

```
變量名: base_url
初始值: http://localhost:8000
當前值: http://localhost:8000
```

再新建一個 Production 環境：

```
base_url: https://api.example.com
```

右上角切環境，請求裏的 `{{base_url}}` 自動跟着變。

## Pre-request Script — 發請求前自動做的事

比如先調登錄接口拿 token，放到變量裏：

```javascript
// Pre-request Script 標籤頁
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

然後請求的 Authorization 標籤頁選 Bearer Token，填 `{{token}}`。

## Tests — 自動驗證返回值

用 JavaScript 寫斷言，請求發完後自動跑：

```javascript
// Tests 標籤頁

pm.test("狀態碼是 200", () => {
  pm.response.to.have.status(200);
});

pm.test("返回的是數組", () => {
  const json = pm.response.json();
  pm.expect(Array.isArray(json)).to.be.true;
});

pm.test("第一個用戶有 id", () => {
  const json = pm.response.json();
  pm.expect(json[0]).to.have.property("id");
});

// 把某字段存成變量供後續請求用
const json = pm.response.json();
pm.collectionVariables.set("userId", json[0].id);
```

## Collection Runner — 批量跑

Collection 右邊點 Run：

```
選 Collection → 選要跑的請求 → 設置迭代次數 → Run
```

全部跑一遍，自動彙總 Pass/Fail。適合接口迴歸測試。

## 導出文檔

Collection 右邊箭頭 → View in Web → 自動生成漂亮的接口文檔頁面。發給前端同事即可。

或者 Export → 導出爲 OpenAPI / Swagger JSON。

## 實際工作流

1. 拿到接口文檔 → 建 Collection
2. 把每個接口做成一個 Request，填上 URL、Headers、Body
3. 設好環境變量（開發 / 測試 / 生產三套）
4. 寫 Tests 驗證關鍵返回值
5. 調通了導出文檔或分享 Collection
6. 改代碼後跑一遍 Collection Runner 確認沒搞壞

## 速查

| 需求 | 操作 |
|------|------|
| 發請求 | 填 URL → Send |
| 環境切換 | 右上角下拉 |
| 引用變量 | `{{變量名}}` |
| 提取返回值 | `pm.response.json()` |
| 設變量 | `pm.environment.set("key", value)` |
| 斷言 | `pm.test("描述", () => { pm.expect(...) })` |
| 批量跑 | Collection → Run |
| 導出文檔 | Collection → View in Web |
