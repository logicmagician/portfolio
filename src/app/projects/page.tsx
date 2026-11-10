import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectDirectory } from "@/components/projects/ProjectDirectory";
import { projects } from "@/data/projects";
import { fetchPublicRepos } from "@/lib/integrations/github";
import { RepoCard } from "@/components/integrations/RepoCards";

export const metadata: Metadata = {
  title: "Projects | MD. Rakebul Hassan",
  description: "Software and hardware projects by MD. Rakebul Hassan, with search and category filters.",
};

export default async function ProjectsPage() {
  // Build-time fetch. Only public repositories; shown only when the fetch succeeds.
  const repos = await fetchPublicRepos(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN);
  return (
    <PageLayout>
      <PageHero
        eyebrow="PROJECTS / DIRECTORY"
        title="Engineering projects"
        accent="from software to hardware."
        description="Software and hardware projects, described from the owner's GitHub profile. Search by name, tag or technology, or filter by category."
      />
      <ProjectDirectory projects={projects} />
      {repos.status === "ok" && repos.data.length > 0 && (
        <section className="content-section section-wrap">
          <p className="section-index">PUBLIC REPOSITORIES</p>
          <p className="page-note">Fetched from GitHub when this site was built on {new Date(repos.fetchedAt).toISOString().slice(0, 10)}.</p>
          <div className="service-grid">
            {repos.data.map((repo) => <RepoCard key={repo.url} repo={repo} />)}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
