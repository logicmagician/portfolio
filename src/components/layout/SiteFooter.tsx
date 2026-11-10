import Link from "next/link";
import { CircuitBoard } from "lucide-react";
import { profile } from "@/data/profile";
import { LinkOrPending } from "@/components/ui/LinkOrPending";
import { footerNav } from "@/data/navigation";

const socialLinks = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "X", href: profile.x },
  { label: "Instagram", href: profile.instagram },
];

export function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <Link className="brand" href="/">
        <span className="brand-symbol"><CircuitBoard size={18} /></span>
        <span>RH<span className="brand-dot">.</span></span>
      </Link>
      <nav className="footer-pages" aria-label="Site pages">
        {footerNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <nav className="footer-social" aria-label="Social links">
        {socialLinks.map((link) => (
          <LinkOrPending key={link.label} href={link.href} className="footer-link">
            {link.label}
          </LinkOrPending>
        ))}
      </nav>
      <span>DESIGNED AROUND CURIOSITY. BUILT WITH ENGINEERING.</span>
      <span>© {new Date().getFullYear()} {profile.name}</span>
    </footer>
  );
}
