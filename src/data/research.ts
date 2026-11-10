import type { Publication, ResearchEntry, ResearchProfile } from "@/types/content";

// Research records. No publications, DOIs or research entries have been provided yet, so these
// lists are empty and the site shows neutral empty states. Add records only with verified details:
//   - publications: include a DOI or publisher URL when one exists
//   - externalProfiles: paste the full profile URL or ORCID iD once confirmed

export const researchProfile: ResearchProfile = {
  interests: [],
  externalProfiles: {
    // orcid: "0000-0000-0000-0000",
    // googleScholar: "https://scholar.google.com/citations?user=...",
    // ieeeXplore: "https://ieeexplore.ieee.org/author/...",
  },
};

export const researchEntries: ResearchEntry[] = [];

export const publications: Publication[] = [];
