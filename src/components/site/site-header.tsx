import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { MobileNav } from "@/components/site/mobile-nav";
import { GITHUB_URL } from "@/lib/site";

const LINKS = [
  ["Docs", "/docs"],
  ["Components", "/docs/components"],
] as const;

/** The bar across the top of every page. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <span className="flex-1" />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-current">
            <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <MobileNav />
      </div>
    </header>
  );
}
