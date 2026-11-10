import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { BlogDirectory } from "@/components/blog/BlogDirectory";
import { getPublishedPosts } from "@/lib/blog-source";
import { toSummary } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | MD. Rakebul Hassan",
  description: "Technical articles, engineering notes and writing by MD. Rakebul Hassan.",
};

export default function BlogPage() {
  const summaries = getPublishedPosts().map(toSummary);
  return (
    <PageLayout>
      <PageHero
        eyebrow="06 / TECHNICAL WRITING"
        title="Notes from the workshop."
        description="Technical articles and engineering notes. Search by topic, or filter by category."
      />
      <BlogDirectory posts={summaries} />
    </PageLayout>
  );
}
