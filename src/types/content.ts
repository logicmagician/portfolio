// Shared content types. Data files in src/data/ must conform to these shapes.

export type ProjectLinks = {
  /** Source repository. Omit until a verified URL exists. */
  repo?: string;
  /** Live demonstration. Omit until a verified URL exists. */
  demo?: string;
};

export type ProjectImage = {
  /** Path under public/, for example "/images/projects/routinenest/home.png". */
  src: string;
  alt: string;
};

export type Project = {
  /** URL segment, unique across projects. Lowercase letters, digits and hyphens. */
  slug: string;
  title: string;
  category: string;
  /** Short text for cards. */
  summary: string;
  /** Longer text for the detail page. */
  description: string;
  /** Feature bullets taken only from verified sources. */
  features: string[];
  tags: string[];
  /** Short status label shown on cards, for example "Progressive Web App". */
  status: string;
  /** Shown on the homepage featured row. */
  featured: boolean;
  links: ProjectLinks;
  images: ProjectImage[];
};

export type SkillGroup = {
  title: string;
  /** Optional one-line context for the group. */
  description?: string;
  items: string[];
};

export type JourneyKind = "education" | "learning" | "experience" | "milestone";

export type JourneyEntry = {
  id: string;
  kind: JourneyKind;
  title: string;
  organization?: string;
  /** Free text such as "2024 – 2028" or "Date to be added". Never guessed. */
  period: string;
  detail: string;
  /** Upcoming entries are shown with a distinct status label. */
  upcoming?: boolean;
  /** Shown in the homepage journey preview. */
  featured: boolean;
};

// ---------- Phase 4 ----------

export type ResearchStatus = "ongoing" | "completed" | "planned";

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  /** Journal article, conference paper, preprint, working paper, thesis, etc. */
  type: string;
  venue?: string;
  /** "YYYY-MM" or "YYYY-MM-DD". */
  publicationDate: string;
  doi?: string;
  url?: string;
  /** Downloadable file under public/, when the owner has permission to host it. */
  file?: string;
};

export type ResearchEntry = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ResearchStatus;
  technologies: string[];
  methodology: string[];
  /** Publications associated with this entry, by Publication id. */
  publicationIds: string[];
};

export type ResearchProfile = {
  interests: string[];
  externalProfiles: {
    /** ORCID iD, format 0000-0000-0000-0000. */
    orcid?: string;
    googleScholar?: string;
    ieeeXplore?: string;
  };
};

export type ResourceCategory = string;

export type ResourceFileType = "PDF" | "DOCX" | "PPTX" | "XLSX" | "ZIP" | "LINK" | "OTHER";

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType: ResourceFileType;
  /** Path under public/, for example "/resume.pdf". Checked at build time. */
  file?: string;
  /** External URL for links. */
  externalUrl?: string;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  readingMinutes: number;
  body: string;
};

export type BlogPostSummary = Omit<BlogPost, "body">;
