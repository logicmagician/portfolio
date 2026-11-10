/** GitHub Pages base path ("" for a user site, "/repo" for a project site). Set in next.config.mjs. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative path (for example "/resume.pdf") with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
