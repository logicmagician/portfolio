import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CalculatorPanel } from "@/components/lab/CalculatorPanel";
import { labTools } from "@/data/lab";
import { calculatorSpecs } from "@/lib/lab/calculators";

type Params = { slug: string };

// Only tools with a working calculator get a page.
const availableTools = labTools.filter((tool) => tool.status === "available" && calculatorSpecs.some((spec) => spec.slug === tool.slug));

export function generateStaticParams(): Params[] {
  return availableTools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const tool = availableTools.find((item) => item.slug === params.slug);
  if (!tool) return { title: "Tool not found | MD. Rakebul Hassan" };
  return { title: `${tool.title} | Engineering Lab`, description: tool.summary };
}

export default function LabToolPage({ params }: { params: Params }) {
  const tool = availableTools.find((item) => item.slug === params.slug);
  if (!tool) notFound();

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Lab", href: "/lab/" }, { label: tool.title }]} />
      <section className="page-hero section-wrap">
        <p className="section-index">{tool.category.toUpperCase()}</p>
        <h1>{tool.title}</h1>
        <p className="page-description">{tool.summary}</p>
      </section>
      <section className="section-wrap calc-layout">
        <CalculatorPanel slug={tool.slug} />
        <aside className="detail-panel" aria-label="Assumptions and limitations">
          <p className="micro-label">ASSUMPTIONS</p>
          <ul className="feature-list">{tool.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="micro-label">LIMITATIONS</p>
          <ul className="feature-list">{tool.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
      </section>
      <section className="section-wrap back-link">
        <Link className="text-link" href="/lab/">← Back to the lab</Link>
      </section>
    </PageLayout>
  );
}
