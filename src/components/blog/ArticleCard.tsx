import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { BlogPostSummary } from "@/types/content";

export function ArticleCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link className="article-card" href={`/blog/${post.slug}/`}>
      <p className="micro-label">{post.category} · {formatDate(post.date)} · {post.readingMinutes} MIN READ</p>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      {post.tags.length > 0 && <div className="project-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
    </Link>
  );
}
