import {
  Frame,
  FrameBorder,
  FrameCorners,
  FrameRules,
} from "@/components/ui/frame";

import { definePlayground, el, importing, snippet } from "./define";

const FRAME = "@/components/ui/frame";

export const dashPatterns = definePlayground({
  defaults: { dash: 6, gap: 4, line: 1, overshoot: 0 },
  controls: {
    dash: { type: "range", label: "Dash", min: 1, max: 24, unit: "px" },
    gap: { type: "range", label: "Gap", min: 1, max: 24, unit: "px" },
    line: { type: "range", label: "Line", min: 1, max: 4, unit: "px" },
    overshoot: { type: "range", label: "Overshoot", min: 0, max: 16, unit: "px" },
  },
  render: (v) => (
    <Frame line={v.line} className="w-full max-w-xs p-6">
      <FrameRules dash={v.dash} gap={v.gap} overshoot={v.overshoot} />
      <p className="font-mono text-sm">
        dash {v.dash} · gap {v.gap}
      </p>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame", "FrameRules"], FRAME)],
      el(
        "Frame",
        [
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        el("FrameRules", [
          ["dash", v.dash],
          ["gap", v.gap],
          ["overshoot", v.overshoot, 0],
        ]),
        "Content",
      ),
    ),
});

export const borderStyles = definePlayground<{
  variant: "solid" | "dashed" | "dotted" | "double";
  line: number;
  radius: number;
  offset: number;
}>({
  defaults: { variant: "double", line: 3, radius: 10, offset: 0 },
  controls: {
    variant: {
      type: "select",
      label: "Variant",
      options: ["solid", "dashed", "dotted", "double"],
    },
    line: { type: "range", label: "Line", min: 1, max: 6, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
    offset: { type: "range", label: "Offset", min: -8, max: 8, unit: "px" },
  },
  render: (v) => (
    <Frame radius={v.radius} line={v.line} className="w-full max-w-xs p-6">
      <FrameBorder variant={v.variant} offset={v.offset} />
      <p className="font-mono text-sm">{v.variant}</p>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame", "FrameBorder"], FRAME)],
      el(
        "Frame",
        [
          ["radius", v.radius, 0],
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        el("FrameBorder", [
          ["variant", v.variant, "solid"],
          ["offset", v.offset, 0],
        ]),
        "Content",
      ),
    ),
});

export const marchingAnts = definePlayground({
  defaults: { dash: 6, gap: 4, speed: 0.6, line: 1, marks: true },
  controls: {
    dash: { type: "range", label: "Dash", min: 2, max: 20, unit: "px" },
    gap: { type: "range", label: "Gap", min: 2, max: 20, unit: "px" },
    speed: { type: "range", label: "Step time", min: 0.2, max: 2, step: 0.1, unit: "s" },
    line: { type: "range", label: "Line", min: 1, max: 3, unit: "px" },
    marks: { type: "toggle", label: "Corner handles" },
  },
  render: (v) => (
    <Frame line={v.line} className="w-full max-w-xs p-6">
      <FrameRules dash={v.dash} gap={v.gap} march={v.speed} />
      {v.marks && <FrameCorners mark="square" />}
      <p className="font-mono text-sm">Selection</p>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame", v.marks && "FrameCorners", "FrameRules"], FRAME)],
      el(
        "Frame",
        [
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        el("FrameRules", [
          ["dash", v.dash],
          ["gap", v.gap],
          ["march", v.speed === 0.6 ? true : v.speed],
        ]),
        v.marks && el("FrameCorners", [["mark", "square"]]),
        "Content",
      ),
    ),
});
