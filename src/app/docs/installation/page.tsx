import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/site/code-block";
import { DocPage, H2, InlineCode, P, PageTitle, docMetadata } from "@/components/site/doc-page";
import { InstallCommand } from "@/components/site/install-command";
import { registryUrl } from "@/lib/site";

export const metadata: Metadata = docMetadata({
  href: "/docs/installation",
  title: "Installation",
  description:
    "Add fancyborders components to a React and Tailwind CSS project with the shadcn CLI, or copy them in by hand.",
});

const USAGE = `import { BracketFrame } from "@/components/bracket-frame";

export function Feature() {
  return (
    <BracketFrame className="p-5">
      <h3>Corner brackets</h3>
      <p>Around anything you put inside.</p>
    </BracketFrame>
  );
}`;

const CSS = `@import "tailwindcss";

/* Component CSS goes here, after Tailwind. */
@layer components {
  .fb-frame {
    /* … */
  }
}`;

export default function Installation() {
  return (
    <DocPage
      href="/docs/installation"
      headings={[
        { id: "requirements", title: "Requirements" },
        { id: "cli", title: "Install with the CLI" },
        { id: "use", title: "Use it" },
        { id: "manual", title: "Install by hand" },
        { id: "support", title: "Browser support" },
      ]}
    >
      <PageTitle
        title="Installation"
        lead="Components are copied into your project, one command each. There is no package to install or keep up to date."
      />

      <H2 id="requirements">Requirements</H2>
      <ul className="my-4 grid list-disc gap-2 pl-5 leading-7 text-foreground/80">
        <li>React 18 or later.</li>
        <li>Tailwind CSS v4.</li>
        <li>
          A <InlineCode>components.json</InlineCode> file, which the shadcn CLI
          reads to know where your components and stylesheet live.
        </li>
      </ul>
      <P>
        If the project has no <InlineCode>components.json</InlineCode> yet,
        create one first:
      </P>
      <CodeBlock code="npx shadcn@latest init" lang="bash" />

      <H2 id="cli">Install with the CLI</H2>
      <P>
        Every component page has its own command. This one adds the bracket
        frame:
      </P>
      <InstallCommand url={registryUrl("bracket-frame")} />
      <P>The CLI does three things:</P>
      <ul className="my-4 grid list-disc gap-2 pl-5 leading-7 text-foreground/80">
        <li>
          copies the component into your components folder, for example{" "}
          <InlineCode>components/bracket-frame.tsx</InlineCode>;
        </li>
        <li>
          adds anything it is built on, here the <InlineCode>frame</InlineCode>{" "}
          primitive in <InlineCode>components/ui/frame.tsx</InlineCode>;
        </li>
        <li>writes the component&apos;s CSS into your global stylesheet.</li>
      </ul>

      <H2 id="use">Use it</H2>
      <P>Import the component from your own project and wrap your content:</P>
      <CodeBlock code={USAGE} />
      <P>
        Each page in the{" "}
        <Link href="/docs/components" className="underline underline-offset-4">
          component list
        </Link>{" "}
        has a live preview with controls. Set it up the way you want, then copy
        the code it writes.
      </P>

      <H2 id="manual">Install by hand</H2>
      <P>
        Without the CLI, open a component&apos;s page and choose{" "}
        <strong>Manual</strong> under Installation. It lists every file to
        copy, dependencies first, and the CSS to add.
      </P>
      <P>
        The CSS belongs in your global stylesheet after the Tailwind import, so
        its rules land in Tailwind&apos;s <InlineCode>components</InlineCode>{" "}
        layer and utilities can still override them:
      </P>
      <CodeBlock code={CSS} lang="css" />
      <P>
        Components import a <InlineCode>cn</InlineCode> helper from{" "}
        <InlineCode>@/lib/utils</InlineCode>, the same one shadcn/ui uses. If
        you do not have it, install <InlineCode>clsx</InlineCode> and{" "}
        <InlineCode>tailwind-merge</InlineCode> and add it:
      </P>
      <CodeBlock
        title="lib/utils.ts"
        code={`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
      />

      <H2 id="support">Browser support</H2>
      <P>
        Structural frames and line styles use only widely supported CSS and
        work wherever Tailwind CSS v4 does. A few components reach for newer
        features and fall back when they are missing:
      </P>
      <ul className="my-4 grid list-disc gap-2 pl-5 leading-7 text-foreground/80">
        <li>
          Curved shape corners need the CSS <InlineCode>shape()</InlineCode>{" "}
          function, and fall back to a rectangular border.
        </li>
        <li>
          The beam needs <InlineCode>offset-path</InlineCode> (Chromium 116,
          Firefox 122, Safari 18), and leaves the plain border without it.
        </li>
        <li>
          Liquid metal needs WebGL, and shows the frame&apos;s plain line
          without it.
        </li>
      </ul>
    </DocPage>
  );
}
