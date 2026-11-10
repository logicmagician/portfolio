"use client";

import { useId, useMemo, useState } from "react";
import type { Project } from "@/types/content";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ALL_CATEGORIES, filterProjects, getProjectCategories } from "@/lib/projects";

/** Searchable, filterable project grid. Filtering is client-side over static data. */
export function ProjectDirectory({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const searchId = useId();
  const categories = useMemo(() => getProjectCategories(projects), [projects]);
  const results = useMemo(() => filterProjects(projects, { query, category }), [projects, query, category]);

  return (
    <section className="section-wrap directory">
      <div className="filter-bar">
        <div className="search-field">
          <label htmlFor={searchId}>Search projects</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, tag or technology"
            autoComplete="off"
          />
        </div>
        <div className="filter-chips" role="group" aria-label="Filter by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className="filter-chip"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count" role="status" aria-live="polite">
        SHOWING {results.length} OF {projects.length} PROJECTS
      </p>

      {results.length > 0 ? (
        <div className="projects-grid">
          {results.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No projects match this search.</p>
          <button type="button" className="button button-ghost" onClick={() => { setQuery(""); setCategory(ALL_CATEGORIES); }}>
            Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}
