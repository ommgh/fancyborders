import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { PlaygroundPreview } from "@/components/site/playground";
import { PreviewWall } from "@/components/site/preview-wall";
import { SiteRule } from "@/components/site/site-rule";
import { stageClass } from "@/components/site/stage";
import {
  CATEGORIES,
  COMPONENTS,
  componentDoc,
  componentsIn,
  type Category,
} from "@/content/docs";
import { registryUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The component that stands for each category, and how wide its cell is. */
const FEATURED: Record<Category, { slug: string; wide?: boolean }> = {
  frames: { slug: "bracket-frame", wide: true },
  structure: { slug: "section-grid" },
  shapes: { slug: "shape-frame" },
  lines: { slug: "marching-ants" },
  effects: { slug: "glow" },
};

const WRAP = `<Frame className="p-6">
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>`;

const STYLE = `<Frame className="frame-line-2
  frame-color-sky-500/50
  hover:frame-color-sky-500">`;

export default function Home() {
  return (
    <main className="flex-1">
      {/* ── Hero: a line of pitch and two ways in; the components run beside it. */}
      <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-20">
          <Link
            href="/docs/components"
            className="group flex w-fit items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            <span className="rounded-full bg-foreground px-2 py-0.5 font-medium text-background">
              {COMPONENTS.length}
            </span>
            components, free forever
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            Borders, but fancy.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted text-pretty">
            Copy-paste frames, outlines and effects for React and Tailwind.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/components"
              className="flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Browse components
            </Link>
            <Link
              href="/docs"
              className="flex h-10 items-center rounded-lg border border-line bg-surface px-4 text-sm font-medium transition-colors hover:border-foreground/25"
            >
              Get started
            </Link>
          </div>
        </div>

        <PreviewWall className="h-[26rem] border-t border-line px-4 sm:px-6 lg:h-[36rem] lg:border-t-0 lg:border-l" />
      </section>

      {/* ── The five kinds, one live preview each. */}
      <SiteRule />
      <SectionHeading
        title="Five kinds of border"
        lead="They're all frames with layers, so they stack."
        link={["All components", "/docs/components"]}
      />
      <SiteRule />
      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const { slug, wide } = FEATURED[category.id];
          const featured = componentDoc(slug)!;
          return (
            <Link
              key={category.id}
              href={`/docs/components#${category.id}`}
              className={cn(
                "group flex flex-col bg-background p-3 transition-colors hover:bg-surface",
                wide && "sm:col-span-2",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none grid min-h-60 flex-1 place-items-center overflow-hidden rounded-lg p-8",
                  stageClass(featured.stage),
                  !featured.stage && "border border-line bg-surface",
                )}
              >
                <PlaygroundPreview slug={featured.slug} />
              </div>
              <div className="px-2 pt-4 pb-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-medium">{category.title}</h3>
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-foreground">
                    {componentsIn(category.id).length} →
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{category.lead}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Install, as a bento: the command gets a whole row to itself. */}
      <SiteRule />
      <SectionHeading
        title="Yours in three steps"
        lead="No package. The code lands in your project."
        link={["Installation guide", "/docs/installation"]}
      />
      <SiteRule />
      <ol className="grid gap-px bg-line lg:grid-cols-2">
        <Step
          number={1}
          title="Add it"
          text="One command, any package manager."
          className="lg:col-span-2 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-center lg:gap-10"
        >
          <InstallCommand url={registryUrl("glow-frame")} />
        </Step>
        <Step number={2} title="Wrap it" text="Use a preset, or stack your own layers.">
          <CodeBlock code={WRAP} lang="tsx" className="h-full" />
        </Step>
        <Step number={3} title="Style it" text="Colour, width and radius are Tailwind utilities.">
          <CodeBlock code={STYLE} lang="tsx" className="h-full" />
        </Step>
      </ol>
    </main>
  );
}

function SectionHeading({
  title,
  lead,
  link: [label, href],
}: {
  title: string;
  lead: string;
  link: [string, string];
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h2>
        <p className="mt-1.5 text-muted">{lead}</p>
      </div>
      <Link href={href} className="text-sm text-muted transition-colors hover:text-foreground">
        {label} →
      </Link>
    </div>
  );
}

function Step({
  number,
  title,
  text,
  className,
  children,
}: {
  number: number;
  title: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={cn("flex min-w-0 flex-col gap-5 bg-background px-6 py-8 sm:px-10", className)}>
      <div>
        <p className="font-mono text-xs text-muted">0{number}</p>
        <h3 className="mt-2 text-lg font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}
