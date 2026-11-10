import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { LinkOrPending } from "@/components/ui/LinkOrPending";
import { profile } from "@/data/profile";
import { INQUIRY_TYPES, buildMailto, contactFormEndpoint, isContactFormConfigured } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact | MD. Rakebul Hassan",
  description: "Contact MD. Rakebul Hassan by email or social profile.",
};

export default function ContactPage() {
  const formReady = isContactFormConfigured(contactFormEndpoint);
  const channels = [
    { label: "Email", value: profile.email, href: buildMailto(profile.email, "Hello") , external: false },
    { label: "GitHub", value: "github.com/logicmagician", href: profile.github, external: true },
    { label: "LinkedIn", value: "linkedin.com/in/rakebulhassan", href: profile.linkedin, external: true },
    { label: "X", value: "x.com/rakebulwrites", href: profile.x, external: true },
    { label: "Instagram", value: "instagram.com/rakebulwrites", href: profile.instagram, external: true },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow="07 / START A CONVERSATION"
        title="Get in touch."
        description="Email is the most direct way to reach me. Social profiles are listed below for other channels."
      />

      <section className="content-section section-wrap contact-layout">
        <div className="detail-panel">
          <p className="micro-label">CHANNELS</p>
          <ul className="channel-list">
            {channels.map((channel) => (
              <li key={channel.label}>
                <span className="micro-label">{channel.label}</span>
                <LinkOrPending href={channel.href} external={channel.external}>{channel.value}</LinkOrPending>
              </li>
            ))}
          </ul>
          <p className="micro-label">INQUIRY TYPES</p>
          <div className="skill-tags">{INQUIRY_TYPES.map((type) => <span key={type}>{type}</span>)}</div>
        </div>

        <div className="detail-panel">
          <p className="micro-label">SEND A MESSAGE</p>
          {formReady ? (
            <ContactForm endpoint={contactFormEndpoint} />
          ) : (
            <div className="form-fallback">
              <p>The contact form is not configured for this deployment. Please email directly; it is the reliable route.</p>
              <a className="button button-primary" href={buildMailto(profile.email, "Collaboration inquiry", "Name:\nInquiry type:\nMessage:\n")}>
                Email {profile.email}
              </a>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
