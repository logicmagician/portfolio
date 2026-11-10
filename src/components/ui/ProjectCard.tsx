import Link from "next/link";
import { Cpu, Layers3, Radio, Zap, ExternalLink } from "lucide-react";
import type { Project } from "@/types/content";

const artIcons = [Cpu, Zap, Radio, Layers3];

/** Card linking to a project's detail page. Used on the homepage and the projects directory. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = artIcons[index % artIcons.length];
  const number = String(index + 1).padStart(2, "0");
  return (
    <Link className="project-card" href={`/projects/${project.slug}/`}>
      <div className={`project-art art-${(index % 4) + 1}`}>
        <div className="art-grid" />
        <div className="art-orbit orbit-a" />
        <div className="art-orbit orbit-b" />
        <div className="art-core"><Icon /></div>
        <span className="art-index">{number}</span>
        <span className="art-open"><ExternalLink size={16} /></span>
      </div>
      <div className="project-info">
        <p className="micro-label">{project.category}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <span className="project-status">{project.status}</span>
      </div>
    </Link>
  );
}
