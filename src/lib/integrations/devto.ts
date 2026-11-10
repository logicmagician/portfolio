// Build-time Dev.to integration (public API, no key). Lists published articles for the blog page.
import { fetchWithTimeout, ok, unavailable, type IntegrationResult } from "@/lib/integrations/types";

export type DevtoArticle = { title: string; url: string; publishedAt: string; readingMinutes: number | null };

export function normalizeDevtoArticles(raw: unknown): DevtoArticle[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): DevtoArticle | null => {
      const a = item as Record<string, unknown>;
      if (typeof a.title !== "string" || typeof a.url !== "string" || typeof a.published_at !== "string") return null;
      if (!/^https:\/\//.test(a.url)) return null;
      return {
        title: a.title,
        url: a.url,
        publishedAt: a.published_at,
        readingMinutes: typeof a.reading_time_minutes === "number" ? a.reading_time_minutes : null,
      };
    })
    .filter((item): item is DevtoArticle => item !== null);
}

export async function fetchDevtoArticles(username: string | undefined): Promise<IntegrationResult<DevtoArticle[]>> {
  if (!username) return unavailable("DEVTO_USERNAME is not set in the build environment.");
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(username)) return unavailable("DEVTO_USERNAME is not valid.");
  try {
    const response = await fetchWithTimeout(`https://dev.to/api/articles?username=${username}&per_page=20`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return unavailable(`Dev.to returned status ${response.status}.`);
    return ok(normalizeDevtoArticles(await response.json()));
  } catch {
    return unavailable("Dev.to could not be reached during build.");
  }
}
