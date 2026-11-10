// Build-time GitHub integration. Server-only: reads GITHUB_USERNAME and GITHUB_TOKEN from the build
// environment. Only public repositories are requested. The token is never sent to the browser.
import { fetchWithTimeout, ok, unavailable, type IntegrationResult } from "@/lib/integrations/types";

export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string;
  homepage: string | null;
};

const isString = (v: unknown): v is string => typeof v === "string";

/** Validates one repository object from the GitHub API. Returns null for anything malformed. */
export function normalizeRepo(raw: unknown): GithubRepo | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!isString(r.name) || !isString(r.html_url) || !isString(r.updated_at)) return null;
  if (r.fork === true || r.archived === true || r.private === true) return null;
  return {
    name: r.name,
    description: isString(r.description) && r.description.trim() ? r.description.trim() : null,
    url: r.html_url,
    language: isString(r.language) ? r.language : null,
    stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
    updatedAt: r.updated_at,
    homepage: isString(r.homepage) && /^https:\/\//.test(r.homepage) ? r.homepage : null,
  };
}

export function normalizeRepoList(raw: unknown): GithubRepo[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeRepo).filter((repo): repo is GithubRepo => repo !== null);
}

const USERNAME = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

export async function fetchPublicRepos(username: string | undefined, token?: string): Promise<IntegrationResult<GithubRepo[]>> {
  if (!username) return unavailable("GITHUB_USERNAME is not set in the build environment.");
  if (!USERNAME.test(username)) return unavailable("GITHUB_USERNAME is not a valid GitHub username.");
  try {
    const response = await fetchWithTimeout(
      `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    if (response.status === 403 || response.status === 429) return unavailable("GitHub rate limit reached during build.");
    if (!response.ok) return unavailable(`GitHub returned status ${response.status}.`);
    const repos = normalizeRepoList(await response.json());
    return ok(repos);
  } catch {
    return unavailable("GitHub could not be reached during build.");
  }
}
