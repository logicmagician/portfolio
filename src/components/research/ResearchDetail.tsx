import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PublicationCard } from "@/components/research/PublicationCard";
import { publications, researchEntries } from "@/data/research";

/*
 * Research detail page logic. This file is NOT a route, so the static export builds without it.
 * Activate it when the first entry exists in src/data/research.ts, by creating
 * src/app/research/[slug]/page.tsx with exactly this content:
 *
 *   import { ResearchDetail, getResearchParams, getResearchMetadata } from "@/components/research/ResearchDetail";
 *   export const generateStaticParams = getResearchParams;
 *   export const generateMetadata = ({ params }: { params: { slug: string } }) => getResearchMetadata(params.slug);
 *   export default function Page({ params }: { params: { slug: string } }) {
 *     return <ResearchDetail slug={params.slug} />;
 *   }
 */

export function getResearchParams(): { slug: string }[] {
  return researchEntries.map((entry) => ({ slug: entry.slug }));
}

export function getResearchMetadata(slug: string): Metadata {
  const entry = researchEntries.find((item) => item.slug === slug);
  if (!entry) return { title: "Research not found | MD. Rakebul Hassan" };
  return { title: `${entry.title} | MD. Rakebul Hassan`, description: entry.description };
}

export function ResearchDetail({ slug }: { slug: string }) {
  const entry = researchEntries.find((item) => item.slug === slug);
  if (!entry) notFound();

  const linked = publications.filter((pub) => entry.publicationIds.includes(pub.id));
  const statusLabel = { ongoing: "Ongoing", completed: "Completed", planned: "Planned" }[entry.status];

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research", href: "/research/" }, { label: entry.title }]} />
      <section className="page-hero section-wrap">
        <p className="section-index">{entry.category.toUpperCase()} · {statusLabel.toUpperCase()}</p>
        <h1>{entry.title}</h1>
        <p className="page-description">{entry.description}</p>
      </section>
      <section className="detail-grid section-wrap">
        <div className="detail-panel">
          <p className="micro-label">METHODOLOGY</p>
          {entry.methodology.length > 0 ? (
            <ul className="feature-list">{entry.methodology.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <EmptyState title="Methodology not yet documented." />
          )}
        </div>
        <aside className="detail-panel" aria-label="Research details">
          <p className="micro-label">TECHNOLOGIES</p>
          {entry.technologies.length > 0 ? (
            <div className="project-tags">{entry.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div>
          ) : (
            <p className="placeholder">Not yet listed.</p>
          )}
        </aside>
      </section>
      <section className="content-section section-wrap">
        <p className="section-index">PUBLICATIONS</p>
        {linked.length > 0 ? (
          <div className="publication-list">{linked.map((pub) => <PublicationCard key={pub.id} publication={pub} />)}</div>
        ) : (
          <EmptyState title="No publications linked to this entry yet." />
        )}
      </section>
      <section className="section-wrap back-link">
        <Link className="text-link" href="/research/">← Back to research</Link>
      </section>
    </PageLayout>
  );
}
