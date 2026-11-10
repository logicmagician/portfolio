// Build-time DOI metadata via Crossref. Public API; no key. Use to check or fill publication records.
import { isValidDoi } from "@/lib/research";
import { fetchWithTimeout, ok, unavailable, type IntegrationResult } from "@/lib/integrations/types";

export type DoiMetadata = {
  doi: string;
  title: string;
  authors: string[];
  year: string | null;
  container: string | null;
};

/** Validates a Crossref "works" response. Returns null when the title is missing. */
export function normalizeCrossref(raw: unknown, doi: string): DoiMetadata | null {
  const message = (raw as { message?: Record<string, any> })?.message;
  if (!message) return null;
  const title = Array.isArray(message.title) && typeof message.title[0] === "string" ? message.title[0].trim() : "";
  if (!title) return null;
  const authors = Array.isArray(message.author)
    ? message.author
        .map((a: any) => [a?.given, a?.family].filter((p: unknown) => typeof p === "string").join(" ").trim())
        .filter(Boolean)
    : [];
  const year = message.issued?.["date-parts"]?.[0]?.[0];
  const container = Array.isArray(message["container-title"]) && typeof message["container-title"][0] === "string"
    ? message["container-title"][0]
    : null;
  return { doi, title, authors, year: typeof year === "number" ? String(year) : null, container };
}

export async function fetchDoiMetadata(doi: string, mailto?: string): Promise<IntegrationResult<DoiMetadata>> {
  if (!isValidDoi(doi)) return unavailable("DOI is not in a valid format.");
  try {
    const response = await fetchWithTimeout(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: {
        Accept: "application/json",
        ...(mailto ? { "User-Agent": `portfolio-site/1.0 (mailto:${mailto})` } : {}),
      },
    });
    if (response.status === 404) return unavailable("Crossref has no record for this DOI.");
    if (!response.ok) return unavailable(`Crossref returned status ${response.status}.`);
    const data = normalizeCrossref(await response.json(), doi);
    return data ? ok(data) : unavailable("Crossref record has no title.");
  } catch {
    return unavailable("Crossref could not be reached during build.");
  }
}
