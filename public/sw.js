// 一次性清理脚本, 沿用旧 Hugo 站(reimu 主题) 的 SW 地址 /sw.js。
// 旧 SW 对同源 GET 走 cache-first, 迁移后老访客会一直被喂旧站缓存,
// 因此这里接管、清空所有缓存、放弃控制权并注销自身; 本站不再注册 SW。
// 等旧访客基本转换完成后(约数周), 本文件可以删除。
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.clients.claim()
      await self.registration.unregister()
    })()
  )
})

// 注销生效前仍可能接管请求, 一律放行到网络, 避免继续回旧站内容
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
