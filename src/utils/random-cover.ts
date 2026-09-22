/**
 * 文章封面兜底图源。
 *
 * 站点没有为文章配置 heroImage 时, 用第三方随机图 API 当封面。
 * 这些 API 每次请求返回一张随机图, 所以列表里每篇文章的封面都不一样。
 * 按数组顺序做失败回退, 只收录实测可用且体积可接受的接口:
 *   - t.alcy.cc 返回 webp(约 100~700KB)
 *   - cnmiw.com / idnm.de 单图 2.5MB 以上或已 404, 故不收录
 */
const COVER_APIS = ['https://t.alcy.cc/fj', 'https://t.alcy.cc/mp']

/**
 * 封面地址。seed 不决定图片内容, 只用来让每篇文章的 URL 不同;
 * 换图的随机性来自接口的 302 —— 它不带缓存头, 每次请求都指向新的随机图。
 *
 * 服务端与客户端必须生成逐字节相同的字符串: 否则 img.src 会被重新赋值,
 * 浏览器多取一次图, 表现为封面闪一下。
 */
export function coverSrc(seed: string, apiIndex = 0): string {
  return `${COVER_APIS[apiIndex]}?seed=${encodeURIComponent(seed)}`
}

/** 仅在地址变化时赋值, 避免重复赋值触发多余请求 */
function setIfChanged(el: HTMLImageElement, src: string) {
  if (el.src !== src) el.src = src
}

/** 让 img 加载一张随机封面; 当前接口失败则轮换到下一个 */
function loadRandomCover(img: HTMLImageElement, seed: string, onLoad?: (src: string) => void) {
  let apiIndex = 0
  let failures = 0

  const load = () => setIfChanged(img, coverSrc(seed, apiIndex))

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
 * 服务端已渲染好同一地址, 所以正常路径下这里不会改动 src, 只负责接口失败时的回退。
 */
export function initRandomCovers() {
  document.querySelectorAll<HTMLImageElement>('img[data-random-cover]').forEach((img) => {
    if (img.dataset.coverInit) return
    img.dataset.coverInit = '1'

    const mirrorId = img.dataset.mirror
    const mirror = mirrorId ? document.getElementById(mirrorId) : null
    loadRandomCover(img, img.dataset.seed ?? '', (src) => {
      if (mirror instanceof HTMLImageElement) setIfChanged(mirror, src)
    })
  })
}
