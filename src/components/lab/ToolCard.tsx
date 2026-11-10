import Link from "next/link";
import type { LabTool } from "@/data/lab";

/** Available tools link to their page. Planned tools are shown without a link. */
export function ToolCard({ tool }: { tool: LabTool }) {
  const body = (
    <>
      <div className="tool-card-top">
        <span className="micro-label">{tool.category}</span>
        <span className={`status-badge status-${tool.status}`}>{tool.status === "available" ? "AVAILABLE" : "PLANNED"}</span>
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.summary}</p>
    </>
  );
  if (tool.status === "available") {
    return <Link className="tool-card" href={`/lab/${tool.slug}/`}>{body}<span className="text-link">Open tool →</span></Link>;
  }
  return <div className="tool-card tool-card-planned" aria-disabled="true">{body}</div>;
}
