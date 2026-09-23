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

/**
 * 卡片悬浮强调色色板。
 *
 * 参考站 axi404.top 的悬浮色取自 heroImage 的主色调; 本站在没配 heroImage 时用随机图 API 兜底,
 * 构建期拿不到图片主色, 所以改成从固定色板里取一个, 至少保住"每张卡片一个颜色"的观感。
 * 选了中等明度的色, 因为在暗色模式下它会被当成 hsl(..., 20%) 的背景铺在深色底上。
 */
const ACCENT_PALETTE = [
  '#7C8CB8', // 钢蓝
  '#8A6D54', // 棕
  '#5F7D6B', // 灰绿
  '#8C6A7F', // 藕紫
  '#6E7A9C', // 石板蓝
  '#9A7B4F', // 赭黄
  '#5C7E8C', // 青
  '#7A6B9E' // 紫
]

/**
 * 文章卡片的悬浮强调色。按 seed 确定性取色 —— 同一篇文章每次构建、以及服务端 / 客户端
 * 都会得到同一个值, 不会出现两边算出不同颜色导致的水合不一致。
 */
export function coverAccent(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return ACCENT_PALETTE[Math.abs(hash) % ACCENT_PALETTE.length]
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
