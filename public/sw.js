// 一次性清理脚本, 沿用旧 Hugo 站(reimu 主题) 的 SW 地址 /sw.js。
// 旧 SW 对同源 GET 走 cache-first, 迁移后老访客会一直被喂旧站缓存。
// 这里在 install 阶段就清空缓存 —— 此时旧 SW 仍控制着页面, 清掉之后它的
// caches.match 必然落空, 下一次请求就会走网络拿到新站内容, 不必等接管。
// 等旧访客基本转换完成后(约数周), 本文件可以删除。
async function purgeCaches() {
  const keys = await caches.keys()
  await Promise.allSettled(keys.map((key) => caches.delete(key)))
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await purgeCaches()
      self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await purgeCaches()
      await self.clients.claim()
      try {
        await self.registration.unregister()
      } catch {
        // 注销失败也无需补救: 本 SW 的 fetch 一律走网络
      }
    })()
  )
})

// 接管期间一律放行到网络, 避免继续回旧站内容
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
