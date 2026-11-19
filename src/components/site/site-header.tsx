import Link from "next/link";
import { Suspense } from "react";

import { CommandMenu } from "@/components/site/command-menu";
import { GithubIcon, GithubStars } from "@/components/site/github-stars";
import { Logo } from "@/components/site/logo";
import { MobileNav } from "@/components/site/mobile-nav";
import { SiteRule } from "@/components/site/site-rule";
import { ThemeToggle } from "@/components/site/theme";
import { GITHUB_URL } from "@/lib/site";

const LINKS = [
  ["Docs", "/docs"],
  ["Components", "/docs/components"],
] as const;

/** The bar across the top of every page, between the rails. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 text-sm sm:flex">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <span className="flex-1" />
        <CommandMenu />
        <span aria-hidden className="mx-1 hidden h-4 w-px bg-line sm:block" />
        <Suspense
          fallback={
            <a href={GITHUB_URL} aria-label="GitHub" className="grid size-8 place-items-center text-muted">
              <GithubIcon className="size-4" />
            </a>
          }
        >
          <GithubStars />
        </Suspense>
        <ThemeToggle />
        <MobileNav />
      </div>
      <SiteRule className="absolute inset-x-0 bottom-0" />
    </header>
  );
}
