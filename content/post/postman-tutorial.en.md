---
title: "Getting Started with Postman API Debugging"
description: "Use Postman to send requests, manage environment variables, write test scripts, and export documentation — no more guesswork in front-end and back-end integration"
keywords: "postman,api,debugging,api testing,tutorial"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Postman
  - API
  - Debugging
  - Tutorial
  - Gadgets
---

The backend gives you an API doc, and you manually type URLs, piece together JSON, and check responses with curl over and over — that works, but Postman makes it much more comfortable. Save requests, switch environments, write assertions, and export documentation, all in one interface.

<!--more-->

## Installation

```bash
# macOS
brew install --cask postman

# Windows
winget install Postman.Postman

# Or download from the official site: https://www.postman.com/downloads/
```

Register a free account to use all basic features.

## The Interface

```
┌───────────┬──────────────────┐
│  Collections  │  GET /api/users  │
│  (Request folders)│  Params Headers   │
│               │  Body   Tests     │
│  History      │                   │
│               │  { response }     │
└───────────┴──────────────────┘
```

Collections on the top-left organize your requests, the center is the request builder, and the bottom shows the response.

## Sending Your First Request

```
1. Create a new Collection: My API
2. Right-click the Collection → Add Request → name it "Get Users"
3. Set Method to GET, URL to https://jsonplaceholder.typicode.com/users
4. Click Send
```

You will see the response JSON and status 200 OK on the right.

POST requests work the same way:

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

## Variables — No Need to Change the URL Every Time

Writing `{{base_url}}/users` means `base_url` is a variable that automatically changes its value when you switch environments.

Click Environments in the top-right → New:

```
Variable: base_url
Initial Value: http://localhost:8000
Current Value: http://localhost:8000
```

Then create a Production environment:

```
base_url: https://api.example.com
```

Switch environments from the top-right dropdown, and `{{base_url}}` in your requests will automatically update.

## Pre-request Script — Things That Happen Automatically Before a Request

For example, call the login endpoint first to get a token and store it in a variable:

```javascript
// Pre-request Script tab
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

Then in the Authorization tab of your request, select Bearer Token and fill in `{{token}}`.

## Tests — Automatically Validate Responses

Write assertions in JavaScript that run automatically after a request completes:

```javascript
// Tests tab

pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Response is an array", () => {
  const json = pm.response.json();
  pm.expect(Array.isArray(json)).to.be.true;
});

pm.test("First user has an id", () => {
  const json = pm.response.json();
  pm.expect(json[0]).to.have.property("id");
});

// Store a field as a variable for use in subsequent requests
const json = pm.response.json();
pm.collectionVariables.set("userId", json[0].id);
```

## Collection Runner — Run Requests in Batch

Click Run on the right side of a Collection:

```
Select Collection → Choose requests to run → Set iterations → Run
```

It runs everything and summarizes Pass/Fail results. Great for API regression testing.

## Exporting Documentation

Click the arrow on the right side of a Collection → View in Web → an automatically generated, beautiful API documentation page. Share it with your frontend colleagues.

Or use Export → export as OpenAPI / Swagger JSON.

## Real-World Workflow

1. Get the API doc → Create a Collection
2. Turn each endpoint into a Request, filling in URL, Headers, and Body
3. Set up environment variables (Dev / Test / Production)
4. Write Tests to validate key return values
5. Once everything is working, export the documentation or share the Collection
6. After changing code, run the Collection Runner to confirm nothing is broken

## Quick Reference

| Need | Action |
|------|--------|
| Send a request | Fill in URL → Send |
| Switch environment | Top-right dropdown |
| Reference a variable | `{{variable_name}}` |
| Extract response value | `pm.response.json()` |
| Set a variable | `pm.environment.set("key", value)` |
| Assertion | `pm.test("description", () => { pm.expect(...) })` |
| Batch run | Collection → Run |
| Export docs | Collection → View in Web |
