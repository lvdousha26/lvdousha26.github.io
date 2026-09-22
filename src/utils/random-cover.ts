/**
 * 文章封面兜底图源。
 *
 * 站点没有为文章配置 heroImage 时, 用第三方随机图 API 当封面。
 * 这些 API 每次请求返回一张随机图, 所以列表里每篇文章的封面都不一样。
 * 按数组顺序做失败回退, 只收录实测可用且体积可接受的接口:
 *   - t.alcy.cc 返回 webp(约 100~700KB)
 *   - cnmiw.com / idnm.de 单图 2.5MB 以上或已 404, 故不收录
 */
export const COVER_APIS = ['https://t.alcy.cc/fj', 'https://t.alcy.cc/mp']

/** 服务端渲染用的初始封面地址; seed 保证每篇文章 URL 不同, 冷启动时不会共用同一张缓存图 */
export function coverSrc(seed: string): string {
  return `${COVER_APIS[0]}?seed=${encodeURIComponent(seed)}`
}

/**
 * 让 img 加载一张随机封面:
 * 追一个随机参数以便每次刷新换图(API 响应带 30 天缓存), 当前接口失败则轮换到下一个。
 */
function loadRandomCover(img: HTMLImageElement, seed: string, onLoad?: (src: string) => void) {
  let apiIndex = 0
  let failures = 0

  const load = () => {
    const params = new URLSearchParams({ seed, _: Math.random().toString(36).slice(2) })
    img.src = `${COVER_APIS[apiIndex]}?${params}`
  }

  img.addEventListener('error', () => {
    if (failures++ >= COVER_APIS.length * 2) return
    apiIndex = (apiIndex + 1) % COVER_APIS.length
    load()
  })

  if (onLoad) img.addEventListener('load', () => onLoad(img.src), { once: true })
  load()
}

/**
 * 处理页面上所有随机封面 img。可重复调用:
 * 同一个 img 只会被初始化一次, 因此多个组件各自引脚本也不会重复加载。
 * img 上的 data-mirror 指向另一个元素 id 时, 该元素会跟随同一张图(用于详情页的模糊背景)。
 */
export function initRandomCovers() {
  document.querySelectorAll<HTMLImageElement>('img[data-random-cover]').forEach((img) => {
    if (img.dataset.coverInit) return
    img.dataset.coverInit = '1'

    const mirrorId = img.dataset.mirror
    const mirror = mirrorId ? document.getElementById(mirrorId) : null
    loadRandomCover(img, img.dataset.seed ?? '', (src) => {
      if (mirror instanceof HTMLImageElement) mirror.src = src
    })
  })
}
