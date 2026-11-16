import Link from "next/link";

import { HatchDivider } from "@/components/hatch-divider";
import { PageRails } from "@/components/page-rails";
import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { PlaygroundPreview } from "@/components/site/playground";
import { PreviewWall } from "@/components/site/preview-wall";
import { stageClass } from "@/components/site/stage";
import { Frame, FrameRules } from "@/components/ui/frame";
import {
  CATEGORIES,
  COMPONENTS,
  componentDoc,
  componentsIn,
  type Category,
} from "@/content/docs";
import { GITHUB_URL, registryUrl, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The component that stands for each category on the landing page. */
const FEATURED: Record<Category, string> = {
  frames: "bracket-frame",
  structure: "section-grid",
  shapes: "shape-frame",
  lines: "marching-ants",
  effects: "glow",
};

const STEPS = [
  {
    title: "Add a component",
    text: "One command copies it into your project, with everything it is built on.",
    code: `npx shadcn@latest add ${registryUrl("glow-frame")}`,
    lang: "bash",
  },
  {
    title: "Wrap your content",
    text: "Use a preset as it is, or compose your own frame from layers.",
    code: `<Frame className="p-6">
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>`,
    lang: "tsx",
  },
  {
    title: "Style it with Tailwind",
    text: "Colour, line width and radius are utilities, variants included.",
    code: `<Frame className="frame-line-2
  frame-color-sky-500/50
  hover:frame-color-sky-500">`,
    lang: "tsx",
  },
] as const;

const ROADMAP = [
  [
    "More shapes",
    "Folder tabs, speech bubbles, scalloped, wavy and zigzag edges.",
  ],
] as const;

export default function Home() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* ── Hero: the pitch on the left, every component live on the right. */}
      <section className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
        <div className="flex min-w-0 flex-col justify-center py-16 lg:min-h-[calc(100vh-3.5rem)] lg:py-10">
          <p className="font-mono text-xs text-foreground/50">
            Open source · React · Tailwind CSS · shadcn registry
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Borders, frames and enclosures for React and Tailwind.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-foreground/60 text-pretty">
            {COMPONENTS.length} copy-paste components for the edges of your
            interface: structural frames, page rails and grids, shaped
            outlines, line styles, and borders that glow, travel and turn to
            metal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/components"
              className="bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Browse components →
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/50"
            >
              Star on GitHub
            </a>
          </div>
          <div className="mt-10 max-w-xl">
            <InstallCommand url={registryUrl("frame")} />
          </div>
        </div>

        <PreviewWall className="h-[26rem] lg:h-[calc(100vh-3.5rem)]" />
      </section>

      {/* ── Below the hero: a column between two rails, as the site began. */}
      <div className="px-4 sm:px-8">
        <PageRails className="mx-auto w-full max-w-5xl">
          <HatchDivider bleed />

          <section className="px-6 py-16 sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Five kinds of border
            </h2>
            <p className="mt-2 max-w-prose text-foreground/60">
              Everything is a frame with layers inside it, so the pieces
              combine: a beam around a bevelled shape, a glow behind a ticket.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {CATEGORIES.map((category, index) => {
                const featured = componentDoc(FEATURED[category.id])!;
                return (
                  <Link
                    key={category.id}
                    href={`/docs/components#${category.id}`}
                    className={cn(
                      "group flex flex-col border border-foreground/10 transition-colors hover:border-foreground/30",
                      // An odd one out at the end takes the whole row.
                      index === CATEGORIES.length - 1 &&
                        index % 2 === 0 &&
                        "sm:col-span-2",
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none grid min-h-52 flex-1 place-items-center overflow-hidden p-8",
                        stageClass(featured.stage),
                      )}
                    >
                      <PlaygroundPreview slug={featured.slug} />
                    </div>
                    <div className="border-t border-foreground/10 p-5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-medium">{category.title}</h3>
                        <span className="font-mono text-xs text-foreground/50">
                          {componentsIn(category.id).length} components →
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/60">
                        {category.lead}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <HatchDivider bleed />

          <section className="px-6 py-16 sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Yours in three steps
            </h2>
            <p className="mt-2 max-w-prose text-foreground/60">
              No package to install. The code lands in your project, and it is
              yours to change.
            </p>
            <ol className="mt-10 grid gap-8 lg:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex min-w-0 flex-col">
                  <p className="font-mono text-xs text-foreground/50">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-medium">{step.title}</h3>
                  <p className="mt-1 mb-4 text-sm text-foreground/60">
                    {step.text}
                  </p>
                  <CodeBlock
                    code={step.code}
                    lang={step.lang}
                    className="flex-1"
                  />
                </li>
              ))}
            </ol>
            <Link
              href="/docs/installation"
              className="mt-8 inline-block text-sm underline underline-offset-4"
            >
              Read the installation guide
            </Link>
          </section>

          <HatchDivider bleed />

          <section id="roadmap" className="scroll-mt-20 px-6 py-16 sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight">Roadmap</h2>
            <p className="mt-2 max-w-prose text-foreground/60">
              Not built yet. This is what comes next.
            </p>
            <dl className="mt-8 grid gap-8 sm:grid-cols-2">
              {ROADMAP.map(([name, text]) => (
                <Frame key={name} className="p-5">
                  <FrameRules dash={2} gap={4} />
                  <dt className="font-medium">{name}</dt>
                  <dd className="mt-1 text-sm text-foreground/60">{text}</dd>
                </Frame>
              ))}
            </dl>
          </section>

          <HatchDivider bleed />

          <footer className="flex flex-wrap items-baseline justify-between gap-4 px-6 py-8 font-mono text-xs text-foreground/50 sm:px-10">
            <p>{SITE_NAME} · free and open source</p>
            <p className="flex gap-5">
              <Link href="/docs" className="hover:text-foreground">
                Docs
              </Link>
              <Link href="/docs/components" className="hover:text-foreground">
                Components
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                GitHub
              </a>
            </p>
          </footer>
        </PageRails>
      </div>
    </main>
  );
}
