"use client";

import { useId, useMemo, useState } from "react";
import type { BlogPostSummary } from "@/types/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ALL_BLOG_CATEGORIES, filterPosts, getBlogCategories } from "@/lib/blog";

export function BlogDirectory({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_BLOG_CATEGORIES);
  const searchId = useId();
  const categories = useMemo(() => getBlogCategories(posts), [posts]);
  const results = useMemo(() => filterPosts(posts, { query, category }), [posts, query, category]);

  if (posts.length === 0) {
    return (
      <section className="section-wrap directory">
        <EmptyState title="No articles have been published yet." />
      </section>
    );
  }

  return (
    <section className="section-wrap directory">
      <div className="filter-bar">
        <div className="search-field">
          <label htmlFor={searchId}>Search articles</label>
          <input id={searchId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, topic or tag" autoComplete="off" />
        </div>
        <div className="filter-chips" role="group" aria-label="Filter by category">
          {categories.map((name) => (
            <button key={name} type="button" className="filter-chip" aria-pressed={category === name} onClick={() => setCategory(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count" role="status" aria-live="polite">SHOWING {results.length} OF {posts.length} ARTICLES</p>
      {results.length > 0 ? (
        <div className="article-list">
          {results.map((post) => <ArticleCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <EmptyState title="No articles match this search.">
          <button type="button" className="button button-ghost" onClick={() => { setQuery(""); setCategory(ALL_BLOG_CATEGORIES); }}>Clear search and filters</button>
        </EmptyState>
      )}
    </section>
  );
}
