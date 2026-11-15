import { TicketFrame } from "@/components/ticket-frame";
import type { Corner } from "@/components/ui/frame";
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
