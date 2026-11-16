import { BubbleFrame } from "@/components/bubble-frame";
import { EdgeFrame, type Edge } from "@/components/edge-frame";
import { FolderFrame } from "@/components/folder-frame";
import { TicketFrame } from "@/components/ticket-frame";
import type { Corner, Side } from "@/components/ui/frame";
import { ShapeFrame, type CornerShape } from "@/components/ui/shape-frame";

import { definePlayground, el, importing, raw, snippet } from "./define";

const ALL: readonly Corner[] = ["tl", "tr", "br", "bl"];

export const shapeFrame = definePlayground<{
  corner: Exclude<CornerShape, "square">;
  size: number;
  line: number;
  tl: boolean;
  tr: boolean;
  br: boolean;
  bl: boolean;
  punch: boolean;
}>({
  defaults: {
    corner: "bevel",
    size: 16,
    line: 1,
    tl: true,
    tr: false,
    br: true,
    bl: false,
    punch: false,
  },
  controls: {
    corner: {
      type: "select",
      label: "Corner",
      options: ["bevel", "notch", "scoop", "round"],
    },
    size: { type: "range", label: "Size", min: 4, max: 28, unit: "px" },
    line: { type: "range", label: "Line", min: 1, max: 4, unit: "px" },
    tl: { type: "toggle", label: "Top left" },
    tr: { type: "toggle", label: "Top right" },
    br: { type: "toggle", label: "Bottom right" },
    bl: { type: "toggle", label: "Bottom left" },
    punch: { type: "toggle", label: "Punched edges" },
  },
  render: (v) => (
    <ShapeFrame
      corner={v.corner}
      corners={ALL.filter((corner) => v[corner])}
      size={v.size}
      line={v.line}
      punch={v.punch ? { radius: 8 } : undefined}
      fill="var(--background)"
      className="w-full max-w-xs p-6 drop-shadow-lg"
    >
      <p className="font-mono text-sm">
        {v.corner}, {v.size}px
      </p>
    </ShapeFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["ShapeFrame"], "@/components/ui/shape-frame")],
      el(
        "ShapeFrame",
        [
          ["corner", v.corner, "bevel"],
          ["corners", ALL.filter((corner) => v[corner]), ALL],
          ["size", v.size, 12],
          ["line", v.line, 1],
          ["punch", v.punch ? { radius: 8 } : undefined],
          ["fill", "var(--background)"],
          ["className", "p-6 drop-shadow-lg"],
        ],
        "Content",
      ),
    ),
});

export const ticketFrame = definePlayground({
  defaults: { stubWidth: 112, punchRadius: 9, radius: 12, line: 1 },
  controls: {
    stubWidth: { type: "range", label: "Stub width", min: 72, max: 160, step: 4, unit: "px" },
    punchRadius: { type: "range", label: "Punch radius", min: 4, max: 16, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
    line: { type: "range", label: "Line", min: 1, max: 3, unit: "px" },
  },
  render: (v) => (
    <TicketFrame
      stubWidth={v.stubWidth}
      punchRadius={v.punchRadius}
      radius={v.radius}
      line={v.line}
      fill="var(--background)"
      className="w-full max-w-sm drop-shadow-md"
      stub={
        <div className="grid h-full place-items-center p-4 text-center">
          <p className="font-mono text-xs text-foreground/60">
            ADMIT
            <br />
            <span className="text-2xl text-foreground">01</span>
          </p>
        </div>
      }
    >
      <div className="p-5">
        <p className="font-mono text-xs text-foreground/60">ROW C · SEAT 14</p>
        <p className="mt-1 text-lg font-medium">Evening show</p>
      </div>
    </TicketFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["TicketFrame"], "@/components/ticket-frame")],
      el(
        "TicketFrame",
        [
          ["stub", raw("<Stub />")],
          ["stubWidth", v.stubWidth, 112],
          ["punchRadius", v.punchRadius, 9],
          ["radius", v.radius, 12],
          ["line", v.line, 1],
          ["fill", "var(--background)"],
          ["className", "drop-shadow-md"],
        ],
        "Your content",
      ),
    ),
});

export const folderFrame = definePlayground<{
  tabSide: "left" | "right";
  tabWidth: number;
  tabHeight: number;
  slope: number;
  radius: number;
}>({
  defaults: { tabSide: "left", tabWidth: 112, tabHeight: 28, slope: 14, radius: 10 },
  controls: {
    tabSide: { type: "select", label: "Tab side", options: ["left", "right"] },
    tabWidth: { type: "range", label: "Tab width", min: 64, max: 180, step: 4, unit: "px" },
    tabHeight: { type: "range", label: "Tab height", min: 16, max: 44, step: 2, unit: "px" },
    slope: { type: "range", label: "Slope", min: 0, max: 32, step: 2, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 16, unit: "px" },
  },
  render: (v) => (
    <FolderFrame
      tab={<span className="font-mono text-foreground/60">invoices</span>}
      tabSide={v.tabSide}
      tabWidth={v.tabWidth}
      tabHeight={v.tabHeight}
      slope={v.slope}
      radius={v.radius}
      fill="var(--background)"
      className="w-full max-w-xs drop-shadow-md"
    >
      <div className="px-5 pt-4 pb-5">
        <p className="font-medium">March 2026</p>
        <p className="mt-1 text-sm text-foreground/60">14 files · 2.1 MB</p>
      </div>
    </FolderFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["FolderFrame"], "@/components/folder-frame")],
      el(
        "FolderFrame",
        [
          ["tab", "invoices"],
          ["tabSide", v.tabSide, "left"],
          ["tabWidth", v.tabWidth, 112],
          ["tabHeight", v.tabHeight, 28],
          ["slope", v.slope, 14],
          ["radius", v.radius, 10],
          ["fill", "var(--background)"],
          ["className", "drop-shadow-md"],
        ],
        '<div className="p-5">Your content</div>',
      ),
    ),
});

export const speechBubble = definePlayground<{
  side: Side;
  at: number;
  tailSize: number;
  tailWidth: number;
  lean: number;
  radius: number;
}>({
  defaults: { side: "bottom", at: 28, tailSize: 10, tailWidth: 16, lean: 0, radius: 14 },
  controls: {
    side: { type: "select", label: "Side", options: ["bottom", "top", "left", "right"] },
    at: { type: "range", label: "Position", min: 20, max: 60, unit: "px" },
    tailSize: { type: "range", label: "Tail size", min: 4, max: 20, unit: "px" },
    tailWidth: { type: "range", label: "Tail width", min: 6, max: 28, step: 2, unit: "px" },
    lean: { type: "range", label: "Lean", min: -12, max: 12, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 20, unit: "px" },
  },
  render: (v) => (
    <BubbleFrame
      side={v.side}
      at={v.at}
      tailSize={v.tailSize}
      tailWidth={v.tailWidth}
      lean={v.lean}
      radius={v.radius}
      fill="var(--background)"
      className="w-full max-w-64 px-5 py-4 drop-shadow-md"
    >
      <p className="font-medium">Shipped it.</p>
      <p className="mt-1 text-sm text-foreground/60">The border goes round the tail.</p>
    </BubbleFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["BubbleFrame"], "@/components/bubble-frame")],
      el(
        "BubbleFrame",
        [
          ["side", v.side, "bottom"],
          ["at", v.at, 28],
          ["tailSize", v.tailSize, 10],
          ["tailWidth", v.tailWidth, 16],
          ["lean", v.lean, 0],
          ["radius", v.radius, 14],
          ["fill", "var(--background)"],
          ["className", "px-5 py-4 drop-shadow-md"],
        ],
        "Shipped it.",
      ),
    ),
});

const EDGE_SIDES = (horizontal: boolean, vertical: boolean): Side[] => [
  ...(horizontal ? (["top", "bottom"] as const) : []),
  ...(vertical ? (["left", "right"] as const) : []),
];

export const edgeFrame = definePlayground<{
  edge: Edge;
  size: number;
  depth: number;
  horizontal: boolean;
  vertical: boolean;
  line: number;
}>({
  defaults: { edge: "scallop", size: 16, depth: 8, horizontal: true, vertical: true, line: 1 },
  controls: {
    edge: { type: "select", label: "Edge", options: ["scallop", "zigzag", "wave", "bite"] },
    size: { type: "range", label: "Size", min: 8, max: 40, step: 2, unit: "px" },
    depth: { type: "range", label: "Depth", min: 2, max: 16, unit: "px" },
    horizontal: { type: "toggle", label: "Top and bottom" },
    vertical: { type: "toggle", label: "Left and right" },
    line: { type: "range", label: "Line", min: 1, max: 3, unit: "px" },
  },
  render: (v) => (
    <EdgeFrame
      edge={v.edge}
      sides={EDGE_SIDES(v.horizontal, v.vertical)}
      size={v.size}
      depth={v.depth}
      line={v.line}
      fill="var(--background)"
      className="w-full max-w-xs p-8 drop-shadow-md"
    >
      <p className="font-mono text-sm">
        {v.edge}, {v.size}px
      </p>
    </EdgeFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["EdgeFrame"], "@/components/edge-frame")],
      el(
        "EdgeFrame",
        [
          ["edge", v.edge, "zigzag"],
          ["sides", EDGE_SIDES(v.horizontal, v.vertical), ["top", "bottom"]],
          ["size", v.size, 16],
          ["depth", v.depth, 8],
          ["line", v.line, 1],
          ["fill", "var(--background)"],
          ["className", "p-8 drop-shadow-md"],
        ],
        "Content",
      ),
    ),
});

export const receipt = definePlayground<{
  size: number;
  depth: number;
  top: boolean;
}>({
  defaults: { size: 12, depth: 6, top: false },
  controls: {
    size: { type: "range", label: "Tooth", min: 6, max: 24, step: 2, unit: "px" },
    depth: { type: "range", label: "Depth", min: 2, max: 12, unit: "px" },
    top: { type: "toggle", label: "Torn at the top too" },
  },
  render: (v) => (
    <EdgeFrame
      edge="zigzag"
      sides={v.top ? ["top", "bottom"] : ["bottom"]}
      size={v.size}
      depth={v.depth}
      fill="var(--background)"
      className="w-full max-w-56 px-5 pt-5 pb-7 font-mono text-xs drop-shadow-md"
    >
      <p className="text-center text-foreground/60">CORNER SHOP</p>
      <div className="mt-3 flex justify-between">
        <span>Coffee</span>
        <span>3.50</span>
      </div>
      <div className="flex justify-between">
        <span>Bagel</span>
        <span>2.75</span>
      </div>
      <div className="mt-2 flex justify-between border-t border-dashed border-foreground/25 pt-2 font-medium">
        <span>Total</span>
        <span>6.25</span>
      </div>
    </EdgeFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["EdgeFrame"], "@/components/edge-frame")],
      el(
        "EdgeFrame",
        [
          ["edge", "zigzag"],
          ["sides", v.top ? ["top", "bottom"] : ["bottom"], ["top", "bottom"]],
          ["size", v.size, 16],
          ["depth", v.depth, 8],
          ["fill", "var(--background)"],
          ["className", "px-5 pt-5 pb-7 drop-shadow-md"],
        ],
        "Your receipt",
      ),
    ),
});

const ALL_SIDES: Side[] = ["top", "right", "bottom", "left"];

export const stamp = definePlayground<{ size: number; depth: number }>({
  defaults: { size: 12, depth: 4 },
  controls: {
    size: { type: "range", label: "Bite", min: 8, max: 24, step: 2, unit: "px" },
    depth: { type: "range", label: "Depth", min: 2, max: 10, unit: "px" },
  },
  render: (v) => (
    <EdgeFrame
      edge="bite"
      sides={ALL_SIDES}
      size={v.size}
      depth={v.depth}
      fill="var(--background)"
      className="w-40 p-3 drop-shadow-md"
    >
      <div className="grid aspect-[4/5] place-items-center border border-foreground/20 bg-foreground/5">
        <p className="text-center font-mono text-xs text-foreground/60">
          <span className="text-3xl text-foreground">25</span>
          <br />
          POSTAGE
        </p>
      </div>
    </EdgeFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["EdgeFrame"], "@/components/edge-frame")],
      el(
        "EdgeFrame",
        [
          ["edge", "bite"],
          ["sides", ALL_SIDES],
          ["size", v.size, 16],
          ["depth", v.depth, 8],
          ["fill", "var(--background)"],
          ["className", "w-40 p-3 drop-shadow-md"],
        ],
        "Your picture",
      ),
    ),
});
