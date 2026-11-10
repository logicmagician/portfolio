import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { primaryNav } from "@/data/navigation";

/** Shell for every page except the homepage: ambient background, header, main landmark, footer. */
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteHeader items={primaryNav} />
      <main id="main" tabIndex={-1} className="page-main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
