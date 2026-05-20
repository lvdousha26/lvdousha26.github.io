---
title: "Postman 接口调试入门"
description: "用 Postman 发请求、管理环境变量、写测试脚本、导出文档，前后端联调不再靠猜"
keywords: "postman,api,调试,接口测试,教程"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - Postman
  - API
  - 调试
  - 教程
  - 小工具
---

后端给个接口文档，你用 curl 一遍遍手动敲 URL、拼 JSON、看返回——也不是不行，但 Postman 把这事做得舒服很多。保存请求、切换环境、写断言、导出文档，都在一个界面里。

<!--more-->

## 安装

```bash
# macOS
brew install --cask postman

# Windows
winget install Postman.Postman

# 或者直接官网下：https://www.postman.com/downloads/
```

注册免费账号即可用全部基础功能。

## 界面长这样

```
┌───────────┬──────────────────┐
│  Collections  │  GET /api/users  │
│  (请求文件夹)  │  Params Headers   │
│               │  Body   Tests     │
│  History      │                   │
│               │  { response }     │
└───────────┴──────────────────┘
```

左上角 Collections 组织请求，中间是请求构造区，下面是响应区。

## 发第一个请求

```
1. 新建 Collection：My API
2. Collection 右键 → Add Request → 起名 "Get Users"
3. Method 选 GET，URL 填 https://jsonplaceholder.typicode.com/users
4. 点 Send
```

右侧看到响应 JSON 和状态 200 OK。

POST 请求同理：

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

## 变量 — 不用每次改 URL

{{base_url}}/users 这样的写法，base_url 是变量，切换环境自动换值。

右上角 Environments → 新建：

```
变量名: base_url
初始值: http://localhost:8000
当前值: http://localhost:8000
```

再新建一个 Production 环境：

```
base_url: https://api.example.com
```

右上角切环境，请求里的 `{{base_url}}` 自动跟着变。

## Pre-request Script — 发请求前自动做的事

比如先调登录接口拿 token，放到变量里：

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

然后请求的 Authorization 标签页选 Bearer Token，填 `{{token}}`。

## Tests — 自动验证返回值

用 JavaScript 写断言，请求发完后自动跑：

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

## Collection Runner — 批量跑

Collection 右边点 Run：

```
选 Collection → 选要跑的请求 → 设置迭代次数 → Run
```

全部跑一遍，自动汇总 Pass/Fail。适合接口回归测试。

## 导出文档

Collection 右边箭头 → View in Web → 自动生成漂亮的接口文档页面。发给前端同事即可。

或者 Export → 导出为 OpenAPI / Swagger JSON。

## 实际工作流

1. 拿到接口文档 → 建 Collection
2. 把每个接口做成一个 Request，填上 URL、Headers、Body
3. 设好环境变量（开发 / 测试 / 生产三套）
4. 写 Tests 验证关键返回值
5. 调通了导出文档或分享 Collection
6. 改代码后跑一遍 Collection Runner 确认没搞坏

## 速查

| 需求 | 操作 |
|------|------|
| 发请求 | 填 URL → Send |
| 环境切换 | 右上角下拉 |
| 引用变量 | `{{变量名}}` |
| 提取返回值 | `pm.response.json()` |
| 设变量 | `pm.environment.set("key", value)` |
| 断言 | `pm.test("描述", () => { pm.expect(...) })` |
| 批量跑 | Collection → Run |
| 导出文档 | Collection → View in Web |
