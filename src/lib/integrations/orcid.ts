// Build-time ORCID integration. ORCID public records are readable without a key.
import { isValidOrcid } from "@/lib/research";
import { fetchWithTimeout, ok, unavailable, type IntegrationResult } from "@/lib/integrations/types";

export type OrcidWork = { title: string; year: string | null; type: string | null; url: string | null };

const text = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Reads work summaries from an ORCID v3 works response. Malformed entries are skipped. */
export function normalizeOrcidWorks(raw: unknown): OrcidWork[] {
  if (!raw || typeof raw !== "object") return [];
  const groups = (raw as { group?: unknown }).group;
  if (!Array.isArray(groups)) return [];
  const works: OrcidWork[] = [];
  for (const group of groups) {
    const summaries = (group as { "work-summary"?: unknown })?.["work-summary"];
    if (!Array.isArray(summaries) || summaries.length === 0) continue;
    const s = summaries[0] as Record<string, any>;
    const title = text(s?.title?.title?.value);
    if (!title) continue;
    works.push({
      title,
      year: text(s?.["publication-date"]?.year?.value),
      type: text(s?.type)?.replace(/_/g, " ").toLowerCase() ?? null,
      url: text(s?.url?.value) && /^https:\/\//.test(s.url.value) ? s.url.value : null,
    });
  }
  return works;
}

export async function fetchOrcidWorks(orcid: string | undefined): Promise<IntegrationResult<OrcidWork[]>> {
  if (!orcid) return unavailable("ORCID_ID is not set in the build environment.");
  if (!isValidOrcid(orcid)) return unavailable("ORCID_ID is not in the 0000-0000-0000-0000 format.");
  try {
    const response = await fetchWithTimeout(`https://pub.orcid.org/v3.0/${orcid}/works`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return unavailable(`ORCID returned status ${response.status}.`);
    return ok(normalizeOrcidWorks(await response.json()));
  } catch {
    return unavailable("ORCID could not be reached during build.");
  }
}
