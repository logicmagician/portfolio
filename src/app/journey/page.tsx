import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { journey } from "@/data/journey";

export const metadata: Metadata = {
  title: "Journey | MD. Rakebul Hassan",
  description: "Education, learning and professional journey of MD. Rakebul Hassan.",
};

const kindLabel = {
  education: "EDUCATION",
  learning: "LEARNING",
  experience: "EXPERIENCE",
  milestone: "MILESTONE",
} as const;

export default function JourneyPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="05 / THE JOURNEY"
        title="Learning by making."
        accent="Growing by questioning."
        description="Education, courses and professional roles. Entries without a confirmed date are marked as such."
      />
      <section className="content-section section-wrap">
        <div className="timeline">
          {journey.map((entry) => (
            <div className="timeline-item" key={entry.id}>
              <span className="timeline-year">{kindLabel[entry.kind]}</span>
              <span className="timeline-node" />
              <div>
                <p className="micro-label">{entry.period}{entry.upcoming ? " · UPCOMING" : ""}</p>
                <h3>{entry.title}</h3>
                {entry.organization && <p className="journey-org">{entry.organization}</p>}
                <p>{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
