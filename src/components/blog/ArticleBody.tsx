import Link from "next/link";
import type { Block, Inline } from "@/lib/markdown";

/** Renders parsed Markdown as React elements. No raw HTML is ever inserted. */
function renderInlines(inlines: Inline[]) {
  return inlines.map((item, i) => {
    switch (item.type) {
      case "code":
        return <code key={i}>{item.value}</code>;
      case "strong":
        return <strong key={i}>{item.value}</strong>;
      case "em":
        return <em key={i}>{item.value}</em>;
      case "link":
        // Site-relative links use next/link so the GitHub Pages base path is applied.
        if (item.href.startsWith("/")) return <Link key={i} href={item.href}>{item.label}</Link>;
        return <a key={i} href={item.href} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>{item.label}</a>;
      default:
        return <span key={i}>{item.value}</span>;
    }
  });
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return block.level === 3
              ? <h3 key={i}>{renderInlines(block.inlines)}</h3>
              : <h2 key={i}>{renderInlines(block.inlines)}</h2>;
          case "paragraph":
            return <p key={i}>{renderInlines(block.inlines)}</p>;
          case "list":
            return block.ordered ? (
              <ol key={i}>{block.items.map((item, j) => <li key={j}>{renderInlines(item)}</li>)}</ol>
            ) : (
              <ul key={i}>{block.items.map((item, j) => <li key={j}>{renderInlines(item)}</li>)}</ul>
            );
          case "quote":
            return <blockquote key={i}>{renderInlines(block.inlines)}</blockquote>;
          case "code":
            return (
              <pre key={i} className="code-block" data-language={block.language || undefined}>
                <code>{block.value}</code>
              </pre>
            );
          case "rule":
            return <hr key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
