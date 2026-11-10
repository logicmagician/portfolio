"use client";

import { useId, useMemo, useState } from "react";
import { withBasePath } from "@/lib/site";
import { ALL_RESOURCE_CATEGORIES, filterResources, getResourceCategories } from "@/lib/resources";
import type { Resource } from "@/types/content";

export type ResourceView = Resource & { available: boolean };

export function ResourceDirectory({ resources }: { resources: ResourceView[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_RESOURCE_CATEGORIES);
  const searchId = useId();
  const categories = useMemo(() => getResourceCategories(resources), [resources]);
  const results = useMemo(() => filterResources(resources, { query, category }), [resources, query, category]);

  return (
    <section className="section-wrap directory">
      <div className="filter-bar">
        <div className="search-field">
          <label htmlFor={searchId}>Search resources</label>
          <input id={searchId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or file type" autoComplete="off" />
        </div>
        <div className="filter-chips" role="group" aria-label="Filter by category">
          {categories.map((name) => (
            <button key={name} type="button" className="filter-chip" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>
          ))}
        </div>
      </div>
      <p className="result-count" role="status" aria-live="polite">SHOWING {results.length} OF {resources.length} RESOURCES</p>
      {results.length === 0 ? (
        <div className="empty-state"><p>No resources match this search.</p></div>
      ) : (
        <ul className="resource-list">
          {results.map((resource) => (
            <li className="resource-item" key={resource.id}>
              <div>
                <span className="file-badge">{resource.fileType}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <p className="micro-label">{resource.category}</p>
              </div>
              <div className="resource-action">
                {resource.fileType === "LINK" && resource.externalUrl && (
                  <a className="button button-ghost" href={resource.externalUrl} target="_blank" rel="noopener noreferrer">Open link</a>
                )}
                {resource.fileType !== "LINK" && resource.file && resource.available && (
                  <a className="button button-primary" href={withBasePath(resource.file)} download>Download</a>
                )}
                {resource.fileType !== "LINK" && resource.file && !resource.available && (
                  <span className="button button-ghost button-disabled" aria-disabled="true">File not yet added</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
