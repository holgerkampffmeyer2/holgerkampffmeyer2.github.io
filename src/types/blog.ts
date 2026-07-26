export interface BlogPostData {
  slug: string;
  title: string;
  key: string;
  url: string;
  created_time: string;
  src: string;
  description: string;
  picture: string;
  audio_length: number;
  tags: string[];
  useCases: string[];
  tracklist: string[];
  hasTracklist: boolean;
  heroImage?: string;
  ogImage?: string;
}

export interface BlogData {
  posts: BlogPostData[];
}

export interface SearchablePost {
  slug: string;
  title: string;
  picture: string;
  description: string;
  tags: string[];
  tracklist: string[];
}
