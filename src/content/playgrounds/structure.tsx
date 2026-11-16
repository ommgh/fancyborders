import { PageRails } from "@/components/page-rails";
import { SectionRule } from "@/components/section-rule";
import type { FrameMark } from "@/components/ui/frame";
import { SectionGrid } from "@/components/ui/section-grid";

import { definePlayground, el, importing, snippet } from "./define";

type Pattern = "none" | "hatch" | "cross" | "dots";

/* Written out in full so Tailwind finds each class in this file. */
const COLUMNS = [
  "section-cols-1",
  "section-cols-2",
  "section-cols-3",
  "section-cols-4",
] as const;

const CELLS = ["Rails", "Rules", "Grids", "Marks", "Dashes", "Fills", "Gaps", "Spans"];

export const pageRails = definePlayground<{
  gutter: number;
  fill: Pattern;
  bleed: number;
  dashed: boolean;
}>({
  defaults: { gutter: 16, fill: "hatch", bleed: 24, dashed: false },
  controls: {
    gutter: { type: "range", label: "Gutter", min: 0, max: 40, step: 4, unit: "px" },
    fill: {
      type: "select",
      label: "Gutter fill",
      options: ["none", "hatch", "cross", "dots"],
    },
    bleed: { type: "range", label: "Bleed", min: 0, max: 48, step: 4, unit: "px" },
    dashed: { type: "toggle", label: "Dashed" },
  },
  render: (v) => (
    <PageRails
      gutter={v.gutter}
      fill={v.fill === "none" ? undefined : v.fill}
      bleed={v.bleed}
      dash={v.dashed ? 4 : undefined}
      className="w-full max-w-xs"
    >
      <div className="px-5 py-8">
        <p className="font-medium">Page content</p>
        <p className="mt-1 text-sm text-foreground/60">
          Sections go here, flush with the rails.
        </p>
      </div>
    </PageRails>
  ),
  code: (v) =>
    snippet(
      [importing(["PageRails"], "@/components/page-rails")],
      el(
        "PageRails",
        [
          ["gutter", v.gutter, 0],
          ["fill", v.gutter > 0 && v.fill !== "none" ? v.fill : undefined],
          ["bleed", v.bleed, 0],
          ["dash", v.dashed ? 4 : undefined],
          ["className", "mx-auto max-w-5xl"],
        ],
        "Your sections",
      ),
    ),
});

export const sectionRule = definePlayground<{
  mark: FrameMark | "none";
  bleed: number;
  dashed: boolean;
  line: number;
}>({
  defaults: { mark: "square", bleed: 32, dashed: false, line: 1 },
  controls: {
    mark: {
      type: "select",
      label: "Mark",
      options: ["none", "square", "plus", "dot", "bracket"],
    },
    bleed: { type: "range", label: "Bleed", min: 0, max: 48, step: 4, unit: "px" },
    dashed: { type: "toggle", label: "Dashed" },
    line: { type: "range", label: "Line", min: 1, max: 3, unit: "px" },
  },
  render: (v) => (
    <PageRails line={v.line} className="w-full max-w-xs">
      <p className="p-5 font-mono text-sm">Section one</p>
      <SectionRule
        mark={v.mark === "none" ? false : v.mark}
        bleed={v.bleed}
        dash={v.dashed ? 4 : undefined}
      />
      <p className="p-5 font-mono text-sm">Section two</p>
    </PageRails>
  ),
  code: (v) =>
    snippet(
      [
        importing(["PageRails"], "@/components/page-rails"),
        importing(["SectionRule"], "@/components/section-rule"),
      ],
      el(
        "PageRails",
        [["line", v.line, 1]],
        "<section>Section one</section>",
        el("SectionRule", [
          ["mark", v.mark === "none" ? false : v.mark, "square"],
          ["bleed", v.bleed, 0],
          ["dash", v.dashed ? 4 : undefined],
        ]),
        "<section>Section two</section>",
      ),
    ),
});

export const sectionGrid = definePlayground<{
  columns: number;
  cells: number;
  mark: "none" | "plus" | "square" | "dot";
  variant: "solid" | "dashed" | "dotted";
  outline: boolean;
}>({
  defaults: { columns: 3, cells: 6, mark: "plus", variant: "solid", outline: true },
  controls: {
    columns: { type: "range", label: "Columns", min: 1, max: 4 },
    cells: { type: "range", label: "Cells", min: 1, max: 8 },
    mark: { type: "select", label: "Mark", options: ["none", "plus", "square", "dot"] },
    variant: { type: "select", label: "Line", options: ["solid", "dashed", "dotted"] },
    outline: { type: "toggle", label: "Outline" },
  },
  render: (v) => (
    <SectionGrid
      mark={v.mark === "none" ? false : v.mark}
      variant={v.variant}
      outline={v.outline}
      className={`w-full max-w-sm ${COLUMNS[v.columns - 1]}`}
    >
      {CELLS.slice(0, v.cells).map((name) => (
        <div key={name} className="px-3 py-5 text-center font-mono text-xs">
          {name}
        </div>
      ))}
    </SectionGrid>
  ),
  code: (v) =>
    snippet(
      [importing(["SectionGrid"], "@/components/ui/section-grid")],
      el(
        "SectionGrid",
        [
          ["mark", v.mark === "none" ? undefined : v.mark],
          ["variant", v.variant, "solid"],
          ["outline", v.outline, false],
          ["className", COLUMNS[v.columns - 1]],
        ],
        ...CELLS.slice(0, v.cells).map((name) => `<div className="p-5">${name}</div>`),
      ),
    ),
});
