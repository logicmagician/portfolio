import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { withBasePath } from "@/lib/site";
import { projects } from "@/data/projects";
import { getProjectBySlug, getRelatedProjects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = getProjectBySlug(projects, params.slug);
  if (!project) return { title: "Project not found | MD. Rakebul Hassan" };
  return {
    title: `${project.title} | MD. Rakebul Hassan`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({ params }: { params: Params }) {
  const project = getProjectBySlug(projects, params.slug);
  if (!project) notFound();

  const related = getRelatedProjects(projects, project);
  const hasDemo = Boolean(project.links.demo);
  const hasRepo = Boolean(project.links.repo);

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects/" },
          { label: project.title },
        ]}
      />

      <section className="page-hero section-wrap">
        <p className="section-index">{project.category.toUpperCase()}</p>
        <h1>{project.title}</h1>
        <p className="page-description">{project.summary}</p>
      </section>

      <section className="detail-grid section-wrap">
        <div className="detail-panel">
          <p className="micro-label">OVERVIEW</p>
          <p>{project.description}</p>

          {project.features.length > 0 && (
            <>
              <p className="micro-label">KEY FEATURES</p>
              <ul className="feature-list">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </>
          )}

          <p className="micro-label">GALLERY</p>
          {project.images.length > 0 ? (
            <div className="gallery-grid">
              {project.images.map((image) => (
                <img key={image.src} src={withBasePath(image.src)} alt={image.alt} loading="lazy" />
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              Screenshots will appear here once added to <code>public/images/projects/{project.slug}/</code>.
            </div>
          )}
        </div>

        <aside className="detail-panel" aria-label="Project details">
          <p className="micro-label">STATUS</p>
          <p>{project.status}</p>

          <p className="micro-label">TECHNOLOGIES</p>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

          <p className="micro-label">LINKS</p>
          <div className="detail-links">
            {hasDemo && (
              <a className="button button-primary" href={project.links.demo} target="_blank" rel="noopener noreferrer">
                Live demo <ExternalLink size={15} />
              </a>
            )}
            {hasRepo && (
              <a className="button button-ghost" href={project.links.repo} target="_blank" rel="noopener noreferrer">
                Source code <ExternalLink size={15} />
              </a>
            )}
            {!hasDemo && !hasRepo && <p className="placeholder">No public links added yet.</p>}
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="content-section section-wrap">
          <p className="section-index">RELATED PROJECTS</p>
          <div className="projects-grid">
            {related.map((item, i) => <ProjectCard key={item.slug} project={item} index={i} />)}
          </div>
        </section>
      )}

      <section className="section-wrap back-link">
        <Link className="text-link" href="/projects/">← Back to all projects</Link>
      </section>
    </PageLayout>
  );
}
