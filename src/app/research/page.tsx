import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { PublicationCard } from "@/components/research/PublicationCard";
import { publications, researchEntries, researchProfile } from "@/data/research";
import { isValidOrcid, orcidUrl, isHttpsUrl } from "@/lib/research";
import { sortByDateDesc } from "@/lib/blog";
import { fetchOrcidWorks } from "@/lib/integrations/orcid";

export const metadata: Metadata = {
  title: "Research | MD. Rakebul Hassan",
  description: "Research interests, ongoing work, publications and external researcher profiles.",
};

export default async function ResearchPage() {
  // Build-time fetch from the public ORCID record. Shown only when the fetch succeeds.
  const orcidWorks = await fetchOrcidWorks(researchProfile.externalProfiles.orcid ?? process.env.ORCID_ID);
  const ongoing = researchEntries.filter((entry) => entry.status === "ongoing");
  const sortedPublications = sortByDateDesc(
    publications.map((pub) => ({ ...pub, date: pub.publicationDate })),
  );
  const { orcid, googleScholar, ieeeXplore } = researchProfile.externalProfiles;
  const profiles = [
    {
      name: "ORCID",
      href: orcid && isValidOrcid(orcid) ? orcidUrl(orcid) : undefined,
      note: "Researcher identifier.",
    },
    {
      name: "Google Scholar",
      href: googleScholar && isHttpsUrl(googleScholar) ? googleScholar : undefined,
      note: "External profile link. Not an official API integration.",
    },
    {
      name: "IEEE Xplore",
      href: ieeeXplore && isHttpsUrl(ieeeXplore) ? ieeeXplore : undefined,
      note: "External author page for IEEE publications.",
    },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow="04 / RESEARCH & PUBLICATIONS"
        title="Research and"
        accent="technical documentation."
        description="Research interests, ongoing work and publications. Only verified records are listed."
      />

      <section className="content-section section-wrap">
        <p className="section-index">INTERESTS</p>
        {researchProfile.interests.length > 0 ? (
          <div className="skill-tags">{researchProfile.interests.map((item) => <span key={item}>{item}</span>)}</div>
        ) : (
          <EmptyState title="Research interests will be listed here once confirmed." />
        )}
      </section>

      <section className="content-section section-wrap">
        <p className="section-index">ONGOING RESEARCH</p>
        {ongoing.length > 0 ? (
          <div className="projects-grid">
            {ongoing.map((entry) => (
              <Link key={entry.slug} className="project-card" href={`/research/${entry.slug}/`}>
                <div className="project-info">
                  <p className="micro-label">{entry.category} · ONGOING</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No ongoing research projects are listed yet." />
        )}
      </section>

      <section className="content-section section-wrap" id="publications">
        <p className="section-index">PUBLICATIONS & WORKING PAPERS</p>
        {sortedPublications.length > 0 ? (
          <div className="publication-list">
            {sortedPublications.map((pub) => <PublicationCard key={pub.id} publication={pub} />)}
          </div>
        ) : (
          <EmptyState title="No publications have been added yet.">
            <p>Each record can include a DOI or publisher link, which are checked for format before display.</p>
          </EmptyState>
        )}
      </section>

      {orcidWorks.status === "ok" && orcidWorks.data.length > 0 && (
        <section className="content-section section-wrap">
          <p className="section-index">WORKS LISTED ON ORCID</p>
          <p className="page-note">Titles and years from the public ORCID record, fetched when this site was built on {new Date(orcidWorks.fetchedAt).toISOString().slice(0, 10)}. Not verified against publisher records.</p>
          <ul className="resource-list">
            {orcidWorks.data.map((work) => (
              <li className="resource-item" key={`${work.title}-${work.year ?? ""}`}>
                <div>
                  <span className="file-badge">{(work.type ?? "WORK").toUpperCase()}</span>
                  <h3>{work.title}</h3>
                  <p>{work.year ?? "Year not listed"}</p>
                </div>
                {work.url && <a className="button button-ghost" href={work.url} target="_blank" rel="noopener noreferrer">Open record</a>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="content-section section-wrap">
        <p className="section-index">EXTERNAL RESEARCHER PROFILES</p>
        <div className="service-grid">
          {profiles.map((item) => (
            <article className="service-card" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
              {item.href ? (
                <a className="text-link" href={item.href} target="_blank" rel="noopener noreferrer">Open profile</a>
              ) : (
                <span className="placeholder">Profile link not yet added</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section section-wrap">
        <p className="section-index">METHODOLOGY</p>
        <EmptyState title="Methodology notes appear with each research entry.">
          <p>Entries list their methods and technologies once they are documented.</p>
        </EmptyState>
      </section>
    </PageLayout>
  );
}
