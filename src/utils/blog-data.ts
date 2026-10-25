import type { BlogPostData, BlogData, SearchablePost } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPostData[]> {
  try {
    const imported = await import('../data/blog-posts.json');
    if (imported && imported.default && Array.isArray(imported.default.posts)) {
      const blogData = imported.default as unknown as BlogData;
      return blogData.posts || [];
    }
    throw new Error('blog-posts.json has invalid structure: missing default.posts array');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to load blog-posts.json: ${msg}`, { cause: e });
  }
}

export function createSearchablePosts(posts: BlogPostData[]): SearchablePost[] {
  return posts
    .filter(post => post.hasTracklist)
    .map(post => ({
      slug: post.slug,
      title: post.title,
      picture: post.picture,
      description: post.description?.substring(0, 300) || '',
      tags: post.tags,
      tracklist: post.tracklist || []
    }));
}
