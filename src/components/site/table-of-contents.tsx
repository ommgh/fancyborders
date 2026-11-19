"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type Heading = { id: string; title: string; depth?: 2 | 3 };

/** Where the line runs for each depth, in px from the list's left edge. */
const RAIL = { 2: 1.5, 3: 13.5 } as const;
/** How far up or down an item the line starts bending to the next depth. */
const BEND = 7;

type Geometry = {
  path: string;
  height: number;
  end: [number, number];
  /** Each item's top and bottom, for the highlight. */
  spans: [number, number][];
};

/*
 * One continuous line down the side of the list, set in for nested headings
 * and bending between depths, built from the items' measured positions.
 */
function measure(list: HTMLUListElement, headings: Heading[]): Geometry {
  const items = [...list.children] as HTMLElement[];
  const xs = headings.map((heading) => RAIL[heading.depth ?? 2]);
  const points: [number, number][] = [];
  const spans: [number, number][] = [];

  items.forEach((item, index) => {
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    const x = xs[index];
    const bendIn = index > 0 && xs[index - 1] !== x;
    const bendOut = index < items.length - 1 && xs[index + 1] !== x;
    points.push([x, top + (bendIn ? BEND : 0)], [x, bottom - (bendOut ? BEND : 0)]);
    spans.push([top, bottom]);
  });

  const end = points.at(-1) ?? [RAIL[2], 0];
  return {
    path: points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" "),
    height: list.offsetHeight,
    end: [end[0], end[1] - 1],
    spans,
  };
}

/**
 * The sections of the current page. The one being read is marked, by
 * watching which heading last crossed the top of the viewport.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const list = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const remeasure = () => setGeometry(measure(node, headings));
    remeasure();
    // Titles can wrap differently once fonts load or the column resizes.
    const observer = new ResizeObserver(remeasure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const index = Math.max(0, headings.findIndex((heading) => heading.id === active));
  const span = geometry?.spans[index];

  return (
    <nav aria-label="On this page">
      <p className="mb-3 flex items-center gap-2 text-sm text-muted">
        <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
        </svg>
        On this page
      </p>

      <div className="relative">
        {geometry && (
          <>
            <svg
              aria-hidden
              width="16"
              height={geometry.height}
              className="pointer-events-none absolute top-0 left-0 overflow-visible text-foreground/20"
            >
              <path d={geometry.path} fill="none" stroke="currentColor" strokeLinejoin="round" />
              <circle cx={geometry.end[0]} cy={geometry.end[1]} r="2.5" fill="currentColor" />
            </svg>
            {/* The same line in the foreground colour, cut down to the
                item being read; the cut slides as it changes. */}
            {span && (
              <svg
                aria-hidden
                width="16"
                height={geometry.height}
                className="pointer-events-none absolute top-0 left-0 overflow-visible text-foreground transition-[clip-path] duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
                style={{ clipPath: `inset(${span[0]}px -4px ${geometry.height - span[1]}px -4px)` }}
              >
                <path d={geometry.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </>
        )}

        <ul ref={list} className="grid">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1.5 text-sm leading-snug transition-colors",
                  heading.depth === 3 ? "pl-8" : "pl-5",
                  heading.id === active ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
