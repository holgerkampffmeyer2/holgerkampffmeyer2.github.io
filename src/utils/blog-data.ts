import type { BlogPostData, BlogData, SearchablePost } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPostData[]> {
  let blogData: BlogData = { posts: [] };

  try {
    const imported = await import('../data/blog-posts.json');
    if (imported && imported.default && Array.isArray(imported.default.posts)) {
      blogData = imported.default as unknown as BlogData;
    }
  } catch (e) {
    console.warn('Could not load blog-posts.json:', e);
  }

  return blogData.posts || [];
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
