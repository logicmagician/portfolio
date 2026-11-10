import type { GithubRepo } from "@/lib/integrations/github";
import { formatDate } from "@/lib/format";

/** Card for one public GitHub repository fetched at build time. Links open on GitHub. */
export function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <article className="service-card">
      <h2 className="service-title">{repo.name}</h2>
      <p>{repo.description ?? "No description provided on GitHub."}</p>
      <div className="skill-tags">
        {repo.language && <span>{repo.language}</span>}
        <span>★ {repo.stars}</span>
        <span>Updated {formatDate(repo.updatedAt.slice(0, 10))}</span>
      </div>
      <div className="detail-links">
        <a className="text-link" href={repo.url} target="_blank" rel="noopener noreferrer">Repository</a>
        {repo.homepage && <a className="text-link" href={repo.homepage} target="_blank" rel="noopener noreferrer">Live site</a>}
      </div>
    </article>
  );
}
