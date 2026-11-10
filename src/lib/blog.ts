import { parseFrontmatter, type FrontmatterValue } from "@/lib/frontmatter";
import { countWords } from "@/lib/markdown";
import type { BlogPost, BlogPostSummary } from "@/types/content";

export const ALL_BLOG_CATEGORIES = "All";
const WORDS_PER_MINUTE = 200;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function requireString(data: Record<string, FrontmatterValue>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file}: frontmatter "${key}" is required and must be text.`);
  }
  return value.trim();
}

/**
 * Builds a validated post from a file name and its source. Throws with the file name when the
 * frontmatter is invalid, so the build fails instead of publishing broken content.
 */
export function buildPost(fileName: string, source: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`${fileName}: file name must be lowercase letters, digits and hyphens (for example "my-article.md").`);
  }

  const { data, body } = parseFrontmatter(source);
  const date = requireString(data, "date", fileName);
  if (!DATE_PATTERN.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`${fileName}: frontmatter "date" must be in YYYY-MM-DD format.`);
  }

  const tags = data.tags;
  if (tags !== undefined && !Array.isArray(tags)) {
    throw new Error(`${fileName}: frontmatter "tags" must be a list.`);
  }

  return {
    slug,
    title: requireString(data, "title", fileName),
    description: requireString(data, "description", fileName),
    date,
    category: requireString(data, "category", fileName),
    tags: Array.isArray(tags) ? tags : [],
    // Unpublished unless explicitly set to true.
    published: data.published === true,
    readingMinutes: Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE)),
    body,
  };
}

export function toSummary(post: BlogPost): BlogPostSummary {
  const { body: _body, ...summary } = post;
  return summary;
}

/** Newest first. Ties keep the input order. */
export function sortByDateDesc<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getBlogCategories(posts: { category: string }[]): string[] {
  const seen: string[] = [];
  posts.forEach((post) => {
    if (!seen.includes(post.category)) seen.push(post.category);
  });
  return [ALL_BLOG_CATEGORIES, ...seen];
}

export function filterPosts<T extends { title: string; description: string; category: string; tags: string[] }>(
  posts: T[],
  { query, category }: { query: string; category: string },
): T[] {
  const needle = query.trim().toLowerCase();
  return posts.filter((post) => {
    if (category !== ALL_BLOG_CATEGORIES && post.category !== category) return false;
    if (!needle) return true;
    return [post.title, post.description, post.category, ...post.tags].join(" ").toLowerCase().includes(needle);
  });
}

/** Older and newer neighbours in date order. `newer` is the next article; `older` is the previous one. */
export function getAdjacentPosts<T extends { slug: string; date: string }>(
  sortedPosts: T[],
  slug: string,
): { older?: T; newer?: T } {
  const index = sortedPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    newer: index > 0 ? sortedPosts[index - 1] : undefined,
    older: index < sortedPosts.length - 1 ? sortedPosts[index + 1] : undefined,
  };
}

/** Posts sharing the category or tags, strongest matches first. */
export function getRelatedPosts<T extends { slug: string; category: string; tags: string[]; date: string }>(
  posts: T[],
  current: T,
  limit = 3,
): T[] {
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
      const score = (post.category === current.category ? 2 : 0) + sharedTags;
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map((item) => item.post);
}
