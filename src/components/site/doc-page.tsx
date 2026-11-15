import Link from "next/link";
import type { ReactNode } from "react";

import {
  TableOfContents,
  type Heading,
} from "@/components/site/table-of-contents";
import { neighbours } from "@/content/docs";
import { cn } from "@/lib/utils";

/**
 * The body of a docs page: the content column, the "on this page" outline
 * beside it, and links to the pages before and after.
 */
export function DocPage({
  href,
  headings = [],
  children,
}: {
  /** This page's address, to find its neighbours. */
  href: string;
  headings?: Heading[];
  children: ReactNode;
}) {
  const { previous, next } = neighbours(href);

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
      <article className="min-w-0 pt-10 pb-20">
        <div className="mx-auto max-w-3xl">
          {children}

          <nav
            aria-label="Pages"
            className="mt-20 grid gap-4 border-t border-foreground/10 pt-6 sm:grid-cols-2"
          >
            {previous ? (
              <PagerLink page={previous} label="Previous" />
            ) : (
              <span />
            )}
            {next && <PagerLink page={next} label="Next" align="right" />}
          </nav>
        </div>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10">
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </div>
  );
}

function PagerLink({
  page,
  label,
  align,
}: {
  page: { title: string; href: string };
  label: string;
  align?: "right";
}) {
  return (
    <Link
      href={page.href}
      className={cn(
        "group border border-foreground/10 px-4 py-3 transition-colors hover:border-foreground/30",
        align === "right" && "sm:text-right",
      )}
    >
      <span className="block font-mono text-xs text-foreground/50">{label}</span>
      <span className="mt-1 block font-medium">{page.title}</span>
    </Link>
  );
}

/* ── Prose ─────────────────────────────────────────────────────────────── */

export function PageTitle({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  lead: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs text-foreground/50">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-foreground/60 text-pretty">{lead}</p>
      {children}
    </header>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 mb-4 scroll-mt-20 text-xl font-semibold tracking-tight"
    >
      <a href={`#${id}`}>{children}</a>
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-8 mb-3 scroll-mt-20 font-semibold">
      <a href={`#${id}`}>{children}</a>
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="my-4 leading-7 text-foreground/80">{children}</p>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-foreground/[0.07] px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}
