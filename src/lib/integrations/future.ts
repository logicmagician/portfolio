// Interfaces for integrations that are planned but NOT implemented. Nothing here calls an external service.
// Each entry documents what a future module needs before it can be built.

export type FutureIntegration = {
  id: string;
  name: string;
  purpose: string;
  requires: string[];
  notes: string;
};

export const futureIntegrations: FutureIntegration[] = [
  {
    id: "youtube",
    name: "YouTube",
    purpose: "List engineering tutorials and demonstrations.",
    requires: ["YouTube Data API key (server-side build secret)", "Channel ID"],
    notes: "The API key must never be placed in NEXT_PUBLIC_ variables, because those values are visible in the browser.",
  },
  {
    id: "hashnode",
    name: "Hashnode",
    purpose: "Cross-list technical articles from Hashnode.",
    requires: ["Publication host name", "GraphQL endpoint access (public read)"],
    notes: "Use the same build-time pattern as Dev.to.",
  },
  {
    id: "google-scholar",
    name: "Google Scholar",
    purpose: "Link to an external author profile.",
    requires: ["Profile URL"],
    notes: "Google Scholar has no official public API. It is a reference link only and is not a data integration.",
  },
  {
    id: "ai-engineering-tools",
    name: "AI-assisted engineering tools",
    purpose: "Interactive utilities that call a language model.",
    requires: ["A server-side proxy or serverless function (not available on GitHub Pages)", "Provider API key kept on the server"],
    notes: "A static site cannot hold a model key safely. Any such tool needs a backend that you host and secure.",
  },
];
