import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { DocPage, H2, InlineCode, P, PageTitle } from "@/components/site/doc-page";
import { Example } from "@/components/site/example";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Style fancyborders frames with Tailwind utilities: line colour, width, radius, marks, fills and effect palettes.",
  alternates: { canonical: "/docs/theming" },
};

const UTILITIES: [utility: string, sets: string][] = [
  ["frame-color-*", "Line colour of borders, rules and fills"],
  ["frame-line-*", "Line width, in pixels"],
  ["frame-radius-*", "Corner radius, from the theme or an arbitrary length"],
  ["frame-mark-*", "Colour of corner marks"],
  ["frame-fill-*", "Colour of fill patterns"],
  ["frame-surface-*", "Colour painted behind hollow marks"],
  ["frame-bg-*", "Background inside a shape frame"],
  ["frame-from-*", "First colour of the effect layers"],
  ["frame-via-*", "Middle colour of the effect layers"],
  ["frame-to-*", "Last colour of the effect layers"],
  ["frame-duration-*", "Time for one turn of a gradient or one lap of a beam, in milliseconds"],
];

const PROPERTIES: [property: string, sets: string][] = [
  ["--fb-line", "Line width"],
  ["--fb-line-color", "Line colour"],
  ["--fb-radius", "Corner radius"],
  ["--fb-surface", "Colour behind hollow marks; defaults to --background"],
  ["--fb-mark-color", "Colour of corner marks"],
  ["--fb-fill-color", "Colour of fill patterns"],
  ["--fb-from, --fb-via, --fb-to", "Effect palette"],
  ["--fb-duration", "Effect timing"],
];

const VARIANTS = `<Frame className="frame-color-zinc-300 dark:frame-color-zinc-700 hover:frame-color-sky-500">
  <FrameBorder />
</Frame>`;

const SCOPE = `<section className="frame-color-sky-500/40 frame-radius-lg">
  <Frame>…</Frame>
  <Frame>…</Frame>
</section>`;

export default function Theming() {
  return (
    <DocPage
      href="/docs/theming"
      headings={[
        { id: "utilities", title: "Utilities" },
        { id: "variants", title: "Variants" },
        { id: "scope", title: "Theming a whole section" },
        { id: "palette", title: "Effect palettes" },
        { id: "properties", title: "Custom properties" },
      ]}
    >
      <PageTitle
        title="Theming"
        lead="Frames read their colours and sizes from custom properties, and each one has a Tailwind utility. Style a frame the way you style anything else."
      />

      <H2 id="utilities">Utilities</H2>
      <P>
        Put these on a frame to restyle every layer inside it. Colour utilities
        take theme colours, arbitrary values and opacity modifiers, such as{" "}
        <InlineCode>frame-color-sky-500/50</InlineCode>.
      </P>
      <Table head={["Utility", "Sets"]} rows={UTILITIES} />
      <div className="mt-6">
        <Example example={{ demo: "frame-tokens", title: "Tokens" }} />
      </div>

      <H2 id="variants">Variants</H2>
      <P>
        Because they are ordinary utilities, they work with every Tailwind
        variant: hover, focus, dark, breakpoints, group and peer states.
      </P>
      <CodeBlock code={VARIANTS} />

      <H2 id="scope">Theming a whole section</H2>
      <P>
        The properties inherit, so a utility on any ancestor themes every frame
        beneath it.
      </P>
      <CodeBlock code={SCOPE} />

      <H2 id="palette">Effect palettes</H2>
      <P>
        Gradient, glow and beam layers share one palette. Set it once on the
        frame and every effect layer inside uses it, or pass{" "}
        <InlineCode>colors</InlineCode> to a single layer.
      </P>
      <Example
        example={{
          demo: "gradient-utilities",
          title: "Palette",
          stage: "dark",
        }}
      />

      <H2 id="properties">Custom properties</H2>
      <P>
        The utilities set these properties. You can set them yourself, in a
        stylesheet or a style attribute.
      </P>
      <Table head={["Property", "Sets"]} rows={PROPERTIES} />
    </DocPage>
  );
}

function Table({
  head,
  rows,
}: {
  head: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line font-mono text-xs text-muted">
            <th className="px-4 py-2 font-normal">{head[0]}</th>
            <th className="px-4 py-2 font-normal">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, sets]) => (
            <tr key={name} className="border-b border-line last:border-0">
              <td className="px-4 py-2.5 font-mono text-[0.8125rem] whitespace-nowrap">
                {name}
              </td>
              <td className="px-4 py-2.5 text-foreground/70">{sets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
