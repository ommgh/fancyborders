import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/site/code-block";
import { DocPage, H2, InlineCode, P, PageTitle, docAlternates } from "@/components/site/doc-page";
import { InstallCommand } from "@/components/site/install-command";
import { CATEGORIES, componentsIn } from "@/content/docs";
import { registryUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What fancyborders is, how its frames and layers fit together, and where to start.",
  alternates: docAlternates("/docs"),
};

const LAYERS = `import { Frame, FrameCorners, FrameFill, FrameRules } from "@/components/ui/frame";

<Frame className="p-6">
  <FrameFill pattern="grid" size={16} />
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>`;

const PRESET = `import { BracketFrame } from "@/components/bracket-frame";

<BracketFrame className="p-5">
  <Card />
</BracketFrame>`;

export default function Introduction() {
  return (
    <DocPage
      href="/docs"
      headings={[
        { id: "idea", title: "Frames and layers" },
        { id: "start", title: "Quick start" },
        { id: "explore", title: "What is here" },
        { id: "principles", title: "Principles" },
      ]}
    >
      <PageTitle
        title="Introduction"
        lead="fancyborders is a collection of borders, frames and enclosures for React and Tailwind CSS. It is free and open source, and you copy the code into your project rather than installing a package."
      />

      <P>
        Most component libraries stop at <InlineCode>border</InlineCode> and{" "}
        <InlineCode>rounded</InlineCode>. This one is only about the edges of
        an interface: corner brackets and hatched dividers, outlines that are
        not rectangles, dash patterns a CSS border cannot draw, and borders
        that glow, travel or turn to metal.
      </P>

      <H2 id="idea">Frames and layers</H2>
      <P>
        Everything is built from one primitive. A <InlineCode>Frame</InlineCode>{" "}
        is a positioned box, and you put decoration layers inside it next to
        your content: a border, rules, corner marks, a pattern fill, an effect.
        Layers are absolutely positioned, so they never affect layout and can
        go in any order.
      </P>
      <CodeBlock code={LAYERS} />
      <P>
        The named components are short recipes over those layers, so you can
        use them as they are, or open them up and change them.
      </P>
      <CodeBlock code={PRESET} />

      <H2 id="start">Quick start</H2>
      <P>
        In a project that uses React, Tailwind CSS v4 and the shadcn CLI, add
        any component with one command:
      </P>
      <InstallCommand url={registryUrl("bracket-frame")} />
      <P>
        <Link href="/docs/installation" className="underline underline-offset-4">
          Installation
        </Link>{" "}
        covers setting up a new project and installing by hand.
      </P>

      <H2 id="explore">What is here</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/docs/components#${category.id}`}
            className="border border-line p-4 transition-colors hover:border-foreground/30"
          >
            <span className="flex items-baseline justify-between">
              <span className="font-medium">{category.title}</span>
              <span className="font-mono text-xs text-muted">
                {componentsIn(category.id).length}
              </span>
            </span>
            <span className="mt-1 block text-sm text-muted">
              {category.lead}
            </span>
          </Link>
        ))}
      </div>

      <H2 id="principles">Principles</H2>
      <ul className="grid gap-3">
        {[
          [
            "Yours to edit.",
            "The CLI copies source into your project. There is no package to update and nothing hidden.",
          ],
          [
            "Tailwind first.",
            "Colour, line width and radius are utilities, so they take variants like hover and dark.",
          ],
          [
            "CSS where possible.",
            "Most components are plain CSS and render on the server. The two that need the browser are separate client components.",
          ],
          [
            "Respectful motion.",
            "Every animation stops for people who ask for reduced motion.",
          ],
        ].map(([title, text]) => (
          <li
            key={title}
            className="border-l-2 border-line pl-4 leading-7 text-foreground/80"
          >
            <span className="font-medium text-foreground">{title}</span> {text}
          </li>
        ))}
      </ul>
    </DocPage>
  );
}
