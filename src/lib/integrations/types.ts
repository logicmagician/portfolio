/**
 * Shared result type for build-time integrations. Pages render external data only when status is "ok".
 * Every other status produces no external content, so visitors never see stale or invented data.
 */
export type IntegrationResult<T> =
  | { status: "ok"; data: T; fetchedAt: string }
  | { status: "unavailable"; reason: string };

export const FETCH_TIMEOUT_MS = 8000;

/** fetch with a timeout. Resolves to a Response or throws; callers convert failures to "unavailable". */
export async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function unavailable(reason: string): { status: "unavailable"; reason: string } {
  return { status: "unavailable", reason };
}

export function ok<T>(data: T): { status: "ok"; data: T; fetchedAt: string } {
  return { status: "ok", data, fetchedAt: new Date().toISOString() };
}
