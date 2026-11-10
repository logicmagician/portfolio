import type { Project } from "@/types/content";

export const ALL_CATEGORIES = "All";

/** Distinct categories in first-appearance order, preceded by "All". */
export function getProjectCategories(projects: Project[]): string[] {
  const seen: string[] = [];
  projects.forEach((project) => {
    if (!seen.includes(project.category)) seen.push(project.category);
  });
  return [ALL_CATEGORIES, ...seen];
}

/** Case-insensitive search over title, summary, category, status and tags, combined with a category filter. */
export function filterProjects(
  projects: Project[],
  { query, category }: { query: string; category: string },
): Project[] {
  const needle = query.trim().toLowerCase();
  return projects.filter((project) => {
    if (category !== ALL_CATEGORIES && project.category !== category) return false;
    if (!needle) return true;
    const haystack = [project.title, project.summary, project.category, project.status, ...project.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function getProjectBySlug(projects: Project[], slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.featured);
}

/** Other projects in the same category, excluding the current one. */
export function getRelatedProjects(projects: Project[], current: Project, limit = 3): Project[] {
  return projects
    .filter((project) => project.slug !== current.slug && project.category === current.category)
    .slice(0, limit);
}
