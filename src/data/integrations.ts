// Integration register. Status values:
//   live-at-build      Implemented. Fetches data during `next build` when its variables are set.
//   ready-to-configure Implemented as a module but not yet wired into a page.
//   reference-only     Links only; no data is fetched.
//   future             Planned; see src/lib/integrations/future.ts.
//   static-form        Works when NEXT_PUBLIC_FORMSPREE_ENDPOINT is set.
export type IntegrationStatus = "live-at-build" | "ready-to-configure" | "reference-only" | "future" | "static-form";

export type IntegrationEntry = {
  id: string;
  name: string;
  status: IntegrationStatus;
  variables: string[];
  wiredTo: string;
  limitation: string;
};

export const integrations: IntegrationEntry[] = [
  { id: "github", name: "GitHub repositories", status: "live-at-build", variables: ["GITHUB_USERNAME", "GITHUB_TOKEN (optional, server build only)"], wiredTo: "/projects", limitation: "Only public, non-fork, non-archived repositories. Shown only when the fetch succeeds." },
  { id: "orcid", name: "ORCID works", status: "live-at-build", variables: ["ORCID_ID"], wiredTo: "/research", limitation: "Lists work titles and years from the public ORCID record. Records are not verified against publisher data." },
  { id: "crossref", name: "DOI metadata (Crossref)", status: "ready-to-configure", variables: ["CROSSREF_MAILTO (optional)"], wiredTo: "not wired yet", limitation: "Module ready. Use it to check a DOI before adding a publication record." },
  { id: "devto", name: "Dev.to articles", status: "ready-to-configure", variables: ["DEVTO_USERNAME"], wiredTo: "not wired yet", limitation: "Module ready. Articles are not yet listed on /blog." },
  { id: "google-scholar", name: "Google Scholar", status: "reference-only", variables: [], wiredTo: "/research", limitation: "External profile link only. No official API." },
  { id: "ieee-xplore", name: "IEEE Xplore", status: "reference-only", variables: [], wiredTo: "/research", limitation: "External author page link only." },
  { id: "formspree", name: "Contact form (Formspree or similar)", status: "static-form", variables: ["NEXT_PUBLIC_FORMSPREE_ENDPOINT"], wiredTo: "/contact", limitation: "Shown only when configured. Success is reported only on a success response." },
  { id: "analytics", name: "Analytics (Google Analytics 4)", status: "ready-to-configure", variables: ["NEXT_PUBLIC_ANALYTICS_ID"], wiredTo: "root layout (when configured)", limitation: "Off by default. Enable only with a privacy notice in place." },
  { id: "youtube", name: "YouTube", status: "future", variables: ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"], wiredTo: "none", limitation: "Not implemented." },
  { id: "hashnode", name: "Hashnode", status: "future", variables: [], wiredTo: "none", limitation: "Not implemented." },
  { id: "ai-tools", name: "AI-assisted engineering tools", status: "future", variables: ["server-side only"], wiredTo: "none", limitation: "Needs a backend that GitHub Pages cannot host." },
];
