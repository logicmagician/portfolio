/**
 * Minimal frontmatter parser for the blog format:
 *   ---
 *   key: value
 *   list:
 *     - item
 *   inline: [a, b]
 *   ---
 * Supports strings (quoted or bare), true/false, and string lists. Not a full YAML parser.
 */
export type FrontmatterValue = string | boolean | string[];

export function parseFrontmatter(source: string): { data: Record<string, FrontmatterValue>; body: string } {
  const text = source.replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) return { data: {}, body: text };

  const end = text.indexOf("\n---", 4);
  if (end === -1) return { data: {}, body: text };

  const block = text.slice(4, end);
  const rest = text.slice(end + 4).replace(/^\n/, "");
  const data: Record<string, FrontmatterValue> = {};
  let pendingKey: string | null = null;

  block.split("\n").forEach((line) => {
    if (!line.trim()) return;
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && pendingKey) {
      const current = data[pendingKey];
      const list = Array.isArray(current) ? current : [];
      list.push(unquote(listItem[1]));
      data[pendingKey] = list;
      return;
    }
    const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!pair) return;
    const [, key, raw] = pair;
    if (raw === "") {
      pendingKey = key;
      data[key] = [];
      return;
    }
    pendingKey = null;
    data[key] = parseValue(raw);
  });

  return { data, body: rest };
}

function parseValue(raw: string): FrontmatterValue {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => unquote(item.trim()))
      .filter((item) => item.length > 0);
  }
  return unquote(value);
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
