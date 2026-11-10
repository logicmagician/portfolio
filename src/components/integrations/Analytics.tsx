import Script from "next/script";
import { analyticsId, isAnalyticsEnabled } from "@/lib/integrations/analytics";

/** Renders nothing unless a valid GA4 measurement ID is configured. */
export function Analytics() {
  if (!isAnalyticsEnabled(analyticsId)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${analyticsId}');`}
      </Script>
    </>
  );
}
