import { getCollection, type CollectionEntry } from 'astro:content';

/** All posts, sorted newest first. */
export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Every unique tag across all posts, sorted alphabetically. */
export async function getAllTags(): Promise<string[]> {
  const posts = await getCollection('posts');
  const tags = new Set(posts.flatMap((post) => post.data.tags));
  return Array.from(tags).sort();
}
