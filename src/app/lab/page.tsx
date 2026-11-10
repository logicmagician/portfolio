import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ToolCard } from "@/components/lab/ToolCard";
import { labCategories, labTools } from "@/data/lab";

export const metadata: Metadata = {
  title: "Engineering Lab | MD. Rakebul Hassan",
  description: "Engineering calculators and planned interactive tools.",
};

export default function LabPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="ENGINEERING LAB"
        title="Calculators and experiments."
        description="Working calculators are listed as available. Planned tools are shown for transparency and have no working code yet."
      />
      <section className="section-wrap lab-notice">
        <p>These tools are for learning and rough estimates. They are not design approvals. Check component datasheets, applicable standards and a qualified engineer before building or installing anything.</p>
      </section>
      {labCategories.map((category) => {
        const tools = labTools.filter((tool) => tool.category === category);
        if (tools.length === 0) return null;
        return (
          <section className="content-section section-wrap" key={category}>
            <p className="section-index">{category.toUpperCase()}</p>
            <div className="tool-grid">
              {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </section>
        );
      })}
    </PageLayout>
  );
}
