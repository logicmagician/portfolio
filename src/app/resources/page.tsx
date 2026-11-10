import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ResourceDirectory, type ResourceView } from "@/components/resources/ResourceDirectory";
import { resources } from "@/data/resources";
import { publicFileExists } from "@/lib/file-status";

export const metadata: Metadata = {
  title: "Resources | MD. Rakebul Hassan",
  description: "CV, documentation, reports and external references by MD. Rakebul Hassan.",
};

export default function ResourcesPage() {
  // File availability is checked at build time, so a missing file is never offered as a download.
  const views: ResourceView[] = resources.map((resource) => ({
    ...resource,
    available: resource.file ? publicFileExists(resource.file) : true,
  }));

  return (
    <PageLayout>
      <PageHero
        eyebrow="RESOURCES / DOWNLOADS"
        title="Documents and"
        accent="reference materials."
        description="Downloads are available only when the file has been added to the site. Missing files are labelled."
      />
      <ResourceDirectory resources={views} />
    </PageLayout>
  );
}
