import { isValidDoi, doiUrl, isHttpsUrl } from "@/lib/research";
import { formatPublicationDate } from "@/lib/format";
import type { Publication } from "@/types/content";

/** One publication. Links are shown only when they pass format checks. */
export function PublicationCard({ publication }: { publication: Publication }) {
  const hasDoi = Boolean(publication.doi && isValidDoi(publication.doi));
  const hasUrl = Boolean(publication.url && isHttpsUrl(publication.url));
  return (
    <article className="publication-card">
      <p className="micro-label">{publication.type.toUpperCase()} · {formatPublicationDate(publication.publicationDate)}</p>
      <h3>{publication.title}</h3>
      <p className="publication-authors">{publication.authors.join(", ")}</p>
      {publication.venue && <p className="publication-venue">{publication.venue}</p>}
      <div className="detail-links">
        {hasDoi && <a className="text-link" href={doiUrl(publication.doi!)} target="_blank" rel="noopener noreferrer">DOI: {publication.doi}</a>}
        {hasUrl && <a className="text-link" href={publication.url} target="_blank" rel="noopener noreferrer">Publisher page</a>}
        {!hasDoi && !hasUrl && <span className="placeholder">No DOI or publisher link added</span>}
      </div>
    </article>
  );
}
