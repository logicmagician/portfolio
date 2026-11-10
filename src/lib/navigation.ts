import type { NavItem } from "@/data/navigation";

/** Remove trailing slashes so "/projects/" and "/projects" compare equal. */
export function normalizePath(pathname: string): string {
  const trimmed = (pathname || "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isHomePath(pathname: string): boolean {
  return normalizePath(pathname) === "/";
}

/**
 * Section anchors ("#about") only work on the homepage. From any other page they
 * become "/#about" so the link returns to the homepage at that section.
 */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return isHomePath(pathname) ? href : `/${href}`;
}

/** True when a route item is the current page or a parent of it (for example /projects for /projects/x). */
export function isRouteActive(href: string, pathname: string): boolean {
  if (href.startsWith("#")) return false;
  const current = normalizePath(pathname);
  return current === href || current.startsWith(`${href}/`);
}

export function isAnchor(item: NavItem): boolean {
  return item.href.startsWith("#");
}
