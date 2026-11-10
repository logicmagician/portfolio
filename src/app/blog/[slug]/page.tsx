import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleNav } from "@/components/blog/ArticleNav";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog-source";
import { getAdjacentPosts, getRelatedPosts, toSummary } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { parseBlocks } from "@/lib/markdown";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = getPublishedPost(params.slug);
  if (!post) return { title: "Article not found | MD. Rakebul Hassan" };
  return {
    title: `${post.title} | MD. Rakebul Hassan`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default function ArticlePage({ params }: { params: Params }) {
  const posts = getPublishedPosts();
  const post = posts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  const summaries = posts.map(toSummary);
  const current = summaries.find((item) => item.slug === post.slug);
  if (!current) notFound();
  const { older, newer } = getAdjacentPosts(summaries, post.slug);
  const related = getRelatedPosts(summaries, current);
  const blocks = parseBlocks(post.body);

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog/" }, { label: post.title }]} />
      <article className="article section-wrap">
        <header className="article-header">
          <p className="micro-label">{post.category} · {formatDate(post.date)} · {post.readingMinutes} MIN READ</p>
          <h1>{post.title}</h1>
          <p className="page-description">{post.description}</p>
        </header>
        <ArticleBody blocks={blocks} />
      </article>
      <ArticleNav older={older} newer={newer} />
      {related.length > 0 && (
        <section className="content-section section-wrap">
          <p className="section-index">RELATED ARTICLES</p>
          <div className="article-list">
            {related.map((item) => <ArticleCard key={item.slug} post={item} />)}
          </div>
        </section>
      )}
      <section className="section-wrap back-link">
        <Link className="text-link" href="/blog/">← Back to all articles</Link>
      </section>
    </PageLayout>
  );
}
