"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";

/** Route-level error boundary. Shows a neutral message; technical details are not displayed. */
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageLayout>
      <PageHero eyebrow="SYSTEM NOTICE" title="Something went wrong." description="This section could not be displayed. You can try again or return to the homepage.">
        <div className="hero-actions">
          <button type="button" className="button button-primary" onClick={() => reset()}>Try again</button>
          <a className="button button-ghost" href="/">Return to homepage</a>
        </div>
      </PageHero>
    </PageLayout>
  );
}
