"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CircuitBoard, Menu, X } from "lucide-react";
import type { NavItem } from "@/data/navigation";
import { isAnchor, isHomePath, isRouteActive, resolveNavHref } from "@/lib/navigation";

/**
 * Site header shared by every page. Route items link to pages; section items link to
 * homepage anchors. On the homepage, the section in view is highlighted.
 */
export function SiteHeader({ items }: { items: NavItem[] }) {
  const pathname = usePathname() ?? "/";
  const home = isHomePath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the mobile menu and returns focus to its toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Track the visible homepage section. Only runs on the homepage.
  useEffect(() => {
    if (!home || typeof IntersectionObserver === "undefined") return;
    const sections = items
      .filter(isAnchor)
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items, home]);

  const ariaCurrentFor = (item: NavItem): "page" | "true" | undefined => {
    if (isAnchor(item)) {
      return home && item.href.slice(1) === activeId ? "true" : undefined;
    }
    return isRouteActive(item.href, pathname) ? "page" : undefined;
  };

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Go to homepage">
          <span className="brand-symbol"><CircuitBoard size={19} /></span>
          <span>RH<span className="brand-dot">.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {items.map((item) => (
            <Link key={item.href} href={resolveNavHref(item.href, pathname)} aria-current={ariaCurrentFor(item)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-contact" href={resolveNavHref("#contact", pathname)}>
          LET&apos;S CONNECT <ArrowUpRight size={15} />
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      {menuOpen && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {items.map((item) => (
            <Link key={item.href} href={resolveNavHref(item.href, pathname)} aria-current={ariaCurrentFor(item)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
