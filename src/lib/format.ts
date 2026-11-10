const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-10" -> "10 Nov 2026". Locale-independent so builds are reproducible. Returns the input if it is not ISO. */
export function formatDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return iso;
  return `${Number(match[3])} ${MONTHS[month - 1]} ${match[1]}`;
}

/** "2026-11" -> "Nov 2026", "2026-11-10" -> "10 Nov 2026". */
export function formatPublicationDate(value: string): string {
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const index = Number(month) - 1;
    return index >= 0 && index < 12 ? `${MONTHS[index]} ${year}` : value;
  }
  return formatDate(value);
}
