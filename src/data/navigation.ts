export type NavItem = {
  label: string;
  /**
   * "#id" for a homepage section, or "/route" for a page. Add a route here only in the
   * change that creates its page, so no navigation item points to a missing page.
   */
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Journey", href: "/journey" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Routes listed in the footer. Only pages that exist are included. */
export const footerNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Lab", href: "/lab" },
  { label: "Services", href: "/services" },
  { label: "Skills", href: "/skills" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "/contact" },
];
