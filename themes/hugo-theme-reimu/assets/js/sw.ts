const VERSION = "{{ time.Now.Unix }}";

const preCache = [
  '{{ "images/taichi.png" | relURL }}',
  '{{ "css/loader.css" | relURL }}',
  '{{ "css/main.css" | relURL }}',
  '{{ "js/main.js" | relURL }}',
  '{{ .Site.Params.banner | relURL }}',
];

const cacheDomain = [
  "fonts.googleapis.com",
  "npm.webcache.cn",
  "unpkg.com",
  "fastly.jsdelivr.net",
  "cdn.jsdelivr.net",
];

// 安装时预加载必要内容
self.addEventListener("install", (event: ExtendableEvent) => {
  console.log(`Service Worker ${VERSION} installing.`);
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(preCache)));
});

async function cacheRequest(request, options?) {
  try {
    const responseToCache = await fetch(request);
    const cache = await caches.open(VERSION);
    if (!/^https?:$/i.test(new URL(request.url).protocol))
      return responseToCache;
    cache.put(request, responseToCache.clone());
    return responseToCache;
  } catch (e) {
    const responseToCache = await fetch(request, options);
    const cache = await caches.open(VERSION);
    if (!/^https?:$/i.test(new URL(request.url).protocol))
      return responseToCache;
    cache.put(request, responseToCache.clone());
    return responseToCache;
  }
}

async function respondRequest(request, options?) {
  const response = await caches.match(request);
  if (response) {
    return response;
  }
  return cacheRequest(request, options);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Proxy sinaimg.cn images with Referer: weibo.com to avoid 403
  if (url.hostname.endsWith('.sinaimg.cn') || url.hostname === 'sinaimg.cn') {
    const proxied = new Request(event.request, {
      referrer: 'https://weibo.com/',
    } as RequestInit);
    event.respondWith(fetch(proxied));
    return;
  }

  // Proxy /api/iw233 to api.cnmiw.com with CORS headers
  if (url.pathname === '/api/iw233') {
    const num = url.searchParams.get('num') || '10';
    const apiUrl = `https://api.cnmiw.com/api.php?sort=iw233&type=json&num=${num}`;
    const apiReq = new Request(apiUrl, {
      referrer: 'https://weibo.com/',
    } as RequestInit);
    event.respondWith(
      fetch(apiReq).then(res => {
        const h = new Headers(res.headers);
        h.set('Access-Control-Allow-Origin', '*');
        return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
      })
    );
    return;
  }

  // 检查请求的域名是否在 CacheDomain 中
  if (cacheDomain.includes(url.hostname)) {
    event.respondWith(respondRequest(event.request));
  } else {
    // 检查请求是否为 POST 或带有查询参数的 GET 这样可避免错误缓存
    if (
      event.request.method === "POST" ||
      (event.request.method === "GET" && url.search)
    ) {
      try {
        event.respondWith(fetch(event.request));
      } catch (e) {
        event.respondWith(fetch(event.request, { mode: "no-cors" }));
      }
    } else {
      event.respondWith(respondRequest(event.request, { mode: "no-cors" }));
    }
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (VERSION !== cacheName) {
              console.log(`Service Worker: deleting old cache ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      });
      // Take control of all clients immediately, not just future navigations
      await (self as any).clients.claim();
    })()
  );
  console.log(`Service Worker ${VERSION} activated.`);
});

self.addEventListener("message", (event) => {
  console.log("Service Worker: message received");
  if (event.data === "skipWaiting") {
    (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
  }
});
