import Link from "next/link";
import type { BlogPostSummary } from "@/types/content";

/** Links to the older (previous) and newer (next) article. */
export function ArticleNav({ older, newer }: { older?: BlogPostSummary; newer?: BlogPostSummary }) {
  if (!older && !newer) return null;
  return (
    <nav className="article-nav section-wrap" aria-label="Article navigation">
      <div>
        {older && (
          <Link href={`/blog/${older.slug}/`}>
            <span className="micro-label">← OLDER ARTICLE</span>
            <span>{older.title}</span>
          </Link>
        )}
      </div>
      <div className="article-nav-next">
        {newer && (
          <Link href={`/blog/${newer.slug}/`}>
            <span className="micro-label">NEWER ARTICLE →</span>
            <span>{newer.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
