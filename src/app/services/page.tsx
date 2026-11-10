import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { services, servicesScopeNote } from "@/data/services";
import { profile } from "@/data/profile";
import { buildMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Services | MD. Rakebul Hassan",
  description: "Areas of software, data, documentation and engineering work.",
};

const steps = [
  { title: "Share a brief", text: "Describe the problem, the data or hardware involved, and any deadline." },
  { title: "Agree the scope", text: "We confirm what is included, what is not, and how progress will be reviewed." },
  { title: "Deliver and review", text: "Work is delivered in agreed stages, with a chance to review before it is final." },
];

export default function ServicesPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="SERVICES & COLLABORATION"
        title="Engineering work,"
        accent="shaped around your brief."
        description={servicesScopeNote}
      />

      <section className="content-section section-wrap">
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <h2 className="service-title">{service.title}</h2>
              <p>{service.summary}</p>
              <div className="skill-tags">{service.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <p className="micro-label">EXAMPLES</p>
              <ul className="feature-list">{service.examples.map((item) => <li key={item}>{item}</li>)}</ul>
              <a
                className="text-link"
                href={buildMailto(profile.email, `Enquiry: ${service.title}`, "Hello, I would like to discuss ")}
              >
                Ask about this service →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section section-wrap">
        <p className="section-index">HOW WE WORK TOGETHER</p>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <article className="step-card" key={step.title}>
              <span className="card-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
