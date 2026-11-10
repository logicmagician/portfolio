/** Input parsing shared by all calculators. Raw form text is converted here, never in components. */

export type ParseResult = { ok: true; value: number } | { ok: false; error: string };

/** Empty means "not entered". Non-numeric text is an error. */
export function parseNumber(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(trimmed)) return NaN;
  return Number(trimmed);
}

export function parsePositive(raw: string | undefined, label: string): ParseResult {
  const n = parseNumber(raw);
  if (n === null) return { ok: false, error: `${label} is required.` };
  if (!Number.isFinite(n)) return { ok: false, error: `${label} must be a number.` };
  if (n <= 0) return { ok: false, error: `${label} must be greater than zero.` };
  return { ok: true, value: n };
}

export function parseNonNegative(raw: string | undefined, label: string): ParseResult {
  const n = parseNumber(raw);
  if (n === null) return { ok: false, error: `${label} is required.` };
  if (!Number.isFinite(n)) return { ok: false, error: `${label} must be a number.` };
  if (n < 0) return { ok: false, error: `${label} cannot be negative.` };
  return { ok: true, value: n };
}

/** Comma- or space-separated list of positive numbers. */
export function parsePositiveList(raw: string | undefined, label: string): { ok: true; values: number[] } | { ok: false; error: string } {
  const parts = (raw ?? "").split(/[\s,;]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: `${label} needs at least one value.` };
  const values: number[] = [];
  for (const part of parts) {
    const result = parsePositive(part, `Each value in ${label.toLowerCase()}`);
    if (!result.ok) return result;
    values.push(result.value);
  }
  return { ok: true, values };
}

/** Compact display: four significant figures, no exponent for ordinary values. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) >= 1e6 || Math.abs(value) < 1e-3)) return value.toExponential(3);
  return String(Number(value.toPrecision(4)));
}
