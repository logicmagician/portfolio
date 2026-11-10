import type { Resource } from "@/types/content";

// Downloadable files live in public/ and are checked at build time. A file that is not present
// is shown as "not yet added" rather than as a working download.

export const resourceCategories = [
  "CV & Resume",
  "Engineering Documentation",
  "Research Papers",
  "Project Reports",
  "Presentations",
  "Technical Notes",
  "External References",
];

export const resources: Resource[] = [
  {
    id: "cv",
    title: "Curriculum vitae",
    description: "Current CV in PDF format.",
    category: "CV & Resume",
    fileType: "PDF",
    file: "/resume.pdf",
  },
  {
    id: "routinenest-demo",
    title: "RoutineNest (live demo)",
    description: "Progressive Web App listed in the owner's GitHub profile README.",
    category: "External References",
    fileType: "LINK",
    externalUrl: "https://logicmagician.github.io/RoutineNest/",
  },
  {
    id: "mcq-studio-demo",
    title: "MCQ Studio (live demo)",
    description: "Interactive quiz platform listed in the owner's GitHub profile README.",
    category: "External References",
    fileType: "LINK",
    externalUrl: "https://logicmagician.github.io/mcq-studio/",
  },
];
