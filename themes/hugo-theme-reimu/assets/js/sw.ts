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
  self.skipWaiting();
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.allSettled(
        preCache.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`Service Worker: failed to cache ${url}`, err);
          })
        )
      )
    )
  );
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

  // Proxy sinaimg.cn with Referer to avoid ORB/403
  if (url.hostname.endsWith('.sinaimg.cn') || url.hostname === 'sinaimg.cn') {
    event.respondWith(
      fetch(new Request(event.request, { referrer: 'https://weibo.com/' } as RequestInit))
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
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (VERSION !== cacheName) {
            console.log(`Service Worker: deleting old cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
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
