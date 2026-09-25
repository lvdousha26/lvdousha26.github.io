// 一次性清理脚本, 沿用旧 Hugo 站(reimu 主题) 的 SW 地址 /sw.js。
// 旧 SW 对同源 GET 走 cache-first, 迁移后老访客会一直被喂旧站缓存。
// 这里在 install 阶段就清空缓存 —— 此时旧 SW 仍控制着页面, 清掉之后它的
// caches.match 必然落空, 下一次请求就会走网络拿到新站内容, 不必等接管。
//
// 不要删除本文件。2026-09-22 曾删过一次(818da15), 理由是"SW 脚本 URL 返回 404
// 会被浏览器注销" —— 该前提不成立: 规范里更新检查拿到 404 只算更新失败, 已有
// 注册原样保留(提案 w3c/ServiceWorker#204 未采纳), 于是老访客手机上的旧 SW
// 长期存活, 一直回旧站页面。重新加回来才对。
// 真要下线它, 前提是确认已无旧访客; 删除动作本身不会通知任何浏览器去注销。

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
