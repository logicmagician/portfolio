import type { ReactNode } from "react";

/** Consistent top section for inner pages. Keeps headings and spacing identical across routes. */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero section-wrap">
      <p className="section-index">{eyebrow}</p>
      <h1>
        {title}
        {accent && <><br /><span>{accent}</span></>}
      </h1>
      {description && <p className="page-description">{description}</p>}
      {children}
    </section>
  );
}
