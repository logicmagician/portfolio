import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";

export default function NotFound() {
  return (
    <PageLayout>
      <PageHero eyebrow="ERROR 404" title="Page not found." description="The page you requested does not exist or has moved.">
        <div className="hero-actions">
          <Link className="button button-primary" href="/">Return to homepage</Link>
          <Link className="button button-ghost" href="/projects/">Browse projects</Link>
        </div>
      </PageHero>
    </PageLayout>
  );
}
