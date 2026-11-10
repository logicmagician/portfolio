/**
 * Small, dependency-free Markdown parser for blog articles. It produces a token tree that the
 * page renders as React elements, so no raw HTML from article files ever reaches the DOM.
 *
 * Supported: headings (#, ##, ###), paragraphs, unordered and ordered lists, blockquotes,
 * fenced code blocks, horizontal rules, inline `code`, **strong**, *emphasis* and [links](url).
 * Not supported (rendered as plain text): images, tables, raw HTML, nested lists, nested emphasis.
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; href: string; label: string };

export type Block =
  | { type: "heading"; level: 1 | 2 | 3; inlines: Inline[] }
  | { type: "paragraph"; inlines: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; inlines: Inline[] }
  | { type: "code"; language: string; value: string }
  | { type: "rule" };

/** Allowed link targets: https/http, mailto, site-relative paths and in-page anchors. Protocol-relative URLs are refused. */
export function isSafeHref(href: string): boolean {
  if (/\s/.test(href)) return false;
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href);
}

const INLINE_TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ type: "text", value: text.slice(last, index) });
    if (match[1] !== undefined) {
      out.push({ type: "code", value: match[1] });
    } else if (match[2] !== undefined) {
      if (isSafeHref(match[3])) out.push({ type: "link", href: match[3], label: match[2] });
      else out.push({ type: "text", value: match[0] });
    } else if (match[4] !== undefined) {
      out.push({ type: "strong", value: match[4] });
    } else if (match[5] !== undefined) {
      out.push({ type: "em", value: match[5] });
    }
    last = index + match[0].length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}

const HEADING = /^(#{1,3})\s+(.*)$/;
const RULE = /^(-{3,}|\*{3,})\s*$/;
const QUOTE = /^>\s?(.*)$/;
const UNORDERED = /^[-*]\s+(.*)$/;
const ORDERED = /^\d+\.\s+(.*)$/;
const FENCE = /^```\s*([\w+-]*)\s*$/;

function isBlockStart(line: string): boolean {
  return HEADING.test(line) || RULE.test(line) || QUOTE.test(line) || UNORDERED.test(line) || ORDERED.test(line) || FENCE.test(line);
}

export function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const language = fence[1] ?? "";
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence (or end of file)
      blocks.push({ type: "code", language, value: code.join("\n") });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, inlines: parseInline(heading[2]) });
      i++;
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    if (QUOTE.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        parts.push(lines[i].match(QUOTE)![1]);
        i++;
      }
      blocks.push({ type: "quote", inlines: parseInline(parts.join(" ")) });
      continue;
    }

    const listMatch = line.match(UNORDERED) ? UNORDERED : line.match(ORDERED) ? ORDERED : null;
    if (listMatch) {
      const ordered = listMatch === ORDERED;
      const items: Inline[][] = [];
      while (i < lines.length) {
        const item = lines[i].match(ordered ? ORDERED : UNORDERED);
        if (!item) break;
        items.push(parseInline(item[1]));
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      paragraph.push(lines[i].trim());
      i++;
    }
    if (paragraph.length === 0) {
      // Defensive: a line that matched no rule would otherwise loop forever.
      paragraph.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", inlines: parseInline(paragraph.join(" ")) });
  }

  return blocks;
}

/** Plain-text word count of Markdown source, ignoring frontmatter-free fence markers. */
export function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\-[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
