import Link from "next/link";

import { LogoMark } from "@/components/site/logo";
import { SiteRule } from "@/components/site/site-rule";
import { GITHUB_URL, SITE_NAME } from "@/lib/site";

/** The last row between the rails, under a rule like every other section. */
export function SiteFooter() {
  return (
    <footer>
      <SiteRule />
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted sm:px-6">
        <p className="flex items-center gap-2">
          <LogoMark className="size-4" />
          {SITE_NAME} · free and open source
        </p>
        <p className="flex gap-5">
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
          <Link href="/docs/components" className="transition-colors hover:text-foreground">
            Components
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
