import type { ReactNode } from "react";
import { isPlaceholder } from "@/lib/content";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  /** Open in a new tab. Defaults to true; set false for same-page and mailto links. */
  external?: boolean;
};

/**
 * Renders a real link, or a disabled block while the address is still a placeholder,
 * so visitors never land on a dead URL.
 */
export function LinkOrPending({ href, className, children, external = true }: Props) {
  if (isPlaceholder(href)) {
    return (
      <div
        className={`${className ?? ""} link-pending`.trim()}
        aria-disabled="true"
        title="Link to be added by the site owner"
      >
        {children}
      </div>
    );
  }
  return (
    <a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
