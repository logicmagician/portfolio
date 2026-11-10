// Server-only: reads article files at build time. Import only from server components and generateStaticParams.
import fs from "fs";
import path from "path";
import { buildPost, sortByDateDesc } from "@/lib/blog";
import type { BlogPost } from "@/types/content";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Every article file, validated. Throws if any file has invalid frontmatter, so the build fails. */
export function loadAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => buildPost(name, fs.readFileSync(path.join(BLOG_DIR, name), "utf8")));
}

/** Only published articles, newest first. Unpublished files are never returned to a page. */
export function getPublishedPosts(): BlogPost[] {
  return sortByDateDesc(loadAllPosts().filter((post) => post.published));
}

export function getPublishedPost(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}
