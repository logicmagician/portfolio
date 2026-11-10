import type { Resource } from "@/types/content";

export const ALL_RESOURCE_CATEGORIES = "All";

export function getResourceCategories(resources: Resource[]): string[] {
  const seen: string[] = [];
  resources.forEach((resource) => {
    if (!seen.includes(resource.category)) seen.push(resource.category);
  });
  return [ALL_RESOURCE_CATEGORIES, ...seen];
}

export function filterResources<T extends Resource>(
  resources: T[],
  { query, category }: { query: string; category: string },
): T[] {
  const needle = query.trim().toLowerCase();
  return resources.filter((resource) => {
    if (category !== ALL_RESOURCE_CATEGORIES && resource.category !== category) return false;
    if (!needle) return true;
    return [resource.title, resource.description, resource.category, resource.fileType].join(" ").toLowerCase().includes(needle);
  });
}

/** Checks that every resource has exactly the fields its type needs. Returns problems, empty when valid. */
export function validateResources(resources: Resource[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  resources.forEach((resource) => {
    if (ids.has(resource.id)) problems.push(`duplicate id ${resource.id}`);
    ids.add(resource.id);
    if (resource.fileType === "LINK" && !resource.externalUrl) problems.push(`${resource.id}: link resource needs externalUrl`);
    if (resource.fileType !== "LINK" && !resource.file && !resource.externalUrl) problems.push(`${resource.id}: file resource needs file`);
    if (resource.file && !resource.file.startsWith("/")) problems.push(`${resource.id}: file must start with "/"`);
  });
  return problems;
}
