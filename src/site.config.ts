import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [Basic]
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: '绿豆沙の小窝',
  /** Will be used in index page & copyright declaration */
  author: 'lvdousha',
  /** Description metadata for your website. Can be used in page metadata. */
  description: '绿豆沙の小窝',
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: '/favicon/favicon.ico',
  /** The default social card image for your site which should be a path to an image in the `public/` directory. */
  socialCard: '/images/social-card.png',
  /** Specify the default language for this site. */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // Date locale
    dateLocale: 'en-US',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  logo: {
    src: '/src/assets/avatar.webp',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true, // pagefind search is not supported with prerendering disabled
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [
    /* Telegram channel */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: [
      { title: 'Blog', link: '/blog' },
      { title: 'Archives', link: '/archives' },
      { title: 'Links', link: '/links' },
      { title: 'About', link: '/about' }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    // Year format
    year: `© 2025 - ${new Date().getFullYear()}`,
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: true,
    /** Optional details about the social media accounts for this site. */
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/lvdousha26' },
      { icon: 'rss', label: 'RSS', href: '/rss.xml' }
    ]
  },

  // [Content]
  content: {
    /** External links configuration */
    externalLinks: {
      content: ' ↗',
      /** Properties for the external links element */
      properties: { style: 'user-select:none' }
    },
    /** Blog page size for pagination (optional) */
    blogPageSize: 15,
    /** Share buttons to show */
    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
    /** Enable image captions (default false) */
    // imageCaption: true
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  // https://astro-pure.js.org/docs/integrations/links
  links: {
    // Friend logbook
    logbook: [{ date: '2025-03-10', content: '博客建立' }],
    // Yourself link info
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: 'https://lvdousha26.github.io/' },
      { name: 'Avatar', val: 'https://lvdousha26.github.io/avatar/avatar.webp' }
    ],
    // Cache avatars in `public/avatars/` to improve user experience.
    cacheAvatar: false
  },
  // [Search]
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  // See: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // [Quote]
  quote: {
    // - Hitokoto
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    server: 'https://v1.hitokoto.cn/?c=i',
    target: `(data) => (data.hitokoto || 'Error')`
  },
  // [Typography]
  // https://unocss.dev/presets/typography
  typography: {
    // 不带 text-base: 它会带上 line-height:1.5rem, 覆盖 typography 默认的 1.75
    class: 'prose prose-headings:font-medium',
    // The style of blockquote font `normal` / `italic` (default to italic in typography)
    blockquoteStyle: 'italic',
    // The style of inline code block `code` / `modern` (default to code in typography)
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  // A lightbox library that can add zoom effect
  // https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // [Waline]
  // 已改用 giscus, 见文件底部的 comments 导出。组件本体(src/components/waline)已删除,
  // 要切回来得先从 git 历史里捞回来。这一块保留为空壳是因为 astro-pure 的 zod schema
  // 把 waline 定为必填键, 整个删掉会让配置校验失败。
  waline: {
    enable: false,
    // Server service link
    server: '',
    // Show meta info for comments
    showMeta: false,
    // Refer https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // Refer https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: '欢迎评论(填写邮箱可收到回复通知,无需注册)'
      },
      imageUploader: false
    }
  }
}

/** Extra site metadata, kept outside the strict theme schema. */
export const siteMeta = {
  /** Start date for the "Days Online" counter */
  birthday: '2025-03-10',
  /** Contribution graph data source, also read by scripts/fetch-contributions.mjs */
  githubUsername: 'lvdousha26'
}

/**
 * 评论系统与阅读量统计。
 *
 * 放在这里而不是 integ 里, 是因为 integ 受 astro-pure 的 zod schema 约束, 加新键会被剥掉。
 *
 * giscus 基于 GitHub Discussions, 不需要任何后端服务。下面的值最终以 data-* 属性写进 HTML,
 * 都是公开信息, 不含密钥。前置条件有两个, 缺一个就只会看到报错 iframe:
 *   1. 仓库开启 Discussions
 *   2. 在该仓库上安装 giscus App (https://github.com/apps/giscus/installations/new)
 *
 * repoId / categoryId 是 GitHub 的 node id, 换仓库或换分类后需要重新取:
 *   gh api graphql -f query='{repository(owner:"lvdousha26",name:"lvdousha26.github.io"){id discussionCategories(first:25){nodes{id name}}}}'
 */
export const comments = {
  giscus: {
    enable: true,
    repo: 'lvdousha26/lvdousha26.github.io',
    repoId: 'R_kgDOOF-9tA',
    /** 必须是 Announcements 类型的分类, giscus 才有权限自动新建讨论 */
    category: 'Announcements',
    categoryId: 'DIC_kwDOOF-9tM4C9HLY',
    /** 是否开启表情回应 */
    reactionsEnabled: true,
    /** 输入框位置: top / bottom */
    inputPosition: 'top',
    lang: 'zh-CN'
  }
}

const config = { ...theme, integ } as Config
export default config
