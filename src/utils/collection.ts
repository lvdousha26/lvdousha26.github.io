import { type CollectionEntry, getCollection } from 'astro:content'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

/**
 * 全量文章, 按更新时间倒序, 生产构建里过滤草稿。
 *
 * 本站在定义 postCollections 之后 CollectionKey 变成联合类型, 而 astro-pure 的
 * getBlogCollection / sortMDByDate 都是非泛型签名, 会把类型抹成 CollectionEntry<CollectionKey> 联合,
 * 于是 post.data.title 这类访问全部报错。这里收敛一次, 调用方拿到的就是明确的 blog 条目。
 */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = (await getBlogCollection()) as CollectionEntry<'blog'>[]
  return sortMDByDate(posts) as CollectionEntry<'blog'>[]
}

/** 全部合集。手工清单没有日期字段, 按 id 排序让每次构建顺序一致 */
export async function getPostCollections() {
  const collections = await getCollection('postCollections')
  return collections.sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * 合集内的文章, 顺序与清单里的 bloglist 一致。
 *
 * 本站文章 id 是扁平文件名(如 autodl-tutorial), 没有 axi404 那种 xxx/index.md 形态, 所以不需要 id 归一化。
 */
export async function getPostsForCollection(
  collection: CollectionEntry<'postCollections'>
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getBlogPosts()
  const byId = new Map(posts.map((post) => [post.id.toLowerCase(), post]))

  const bloglist = collection.data.bloglist
  const resolved = bloglist.map((id) => byId.get(id.toLowerCase()))

  const missing = bloglist.filter((_, i) => !resolved[i])
  if (missing.length) {
    console.warn(`[collection] ${collection.id}: unresolved post ids -> ${missing.join(', ')}`)
  }

  return resolved.filter((post): post is CollectionEntry<'blog'> => post !== undefined)
}
