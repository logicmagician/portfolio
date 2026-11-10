import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/integrations/Analytics";

const description =
  "Personal portfolio of MD. Rakebul Hassan — Computer Engineering, embedded systems, software, intelligent systems and innovation.";

export const metadata: Metadata = {
  title: "MD. Rakebul Hassan | Computer Engineering Student",
  description,
  keywords: ["Computer Engineering", "Embedded Systems", "Software", "Portfolio"],
  openGraph: {
    title: "MD. Rakebul Hassan | Computer Engineering Student",
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
