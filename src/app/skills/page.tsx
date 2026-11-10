import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills | MD. Rakebul Hassan",
  description: "Programming languages, web and database tools, engineering software and developer tools.",
};

export default function SkillsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="02 / TECHNICAL SKILLS"
        title="Tools and technologies"
        accent="used across coursework and projects."
        description="Grouped by area. Listed tools are ones used in study or project work; no proficiency levels are shown."
      />
      <section className="content-section section-wrap">
        <div className="skills-grid">
          {skills.map((group, i) => (
            <article className="skill-card" key={group.title}>
              <div className="skill-card-top"><span className="card-number">0{i + 1}</span></div>
              <h2 className="skill-group-title">{group.title}</h2>
              {group.description && <p className="skill-group-description">{group.description}</p>}
              <div className="skill-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
