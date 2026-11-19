"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type Heading = { id: string; title: string; depth?: 2 | 3 };

/**
 * The sections of the current page. The one being read is marked, by
 * watching which heading last crossed the top of the viewport.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    function update() {
      // The last heading above a line a little way down the viewport.
      const line = 120;
      let current = elements[0]?.id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id;
      }
      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-3 font-mono text-xs text-muted">On this page</p>
      <ul className="grid border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l py-1 text-sm transition-colors",
                heading.depth === 3 ? "pl-7" : "pl-4",
                heading.id === active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
