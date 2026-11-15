import { BracketFrame } from "@/components/bracket-frame";
import { HatchDivider } from "@/components/hatch-divider";
import {
  Frame,
  FrameBorder,
  FrameCorners,
  FrameFill,
  FrameRules,
  type FrameMark,
} from "@/components/ui/frame";

import { definePlayground, el, importing, snippet } from "./define";

const FRAME = "@/components/ui/frame";

type Mark = FrameMark | "none";
type Border = "none" | "solid" | "dashed" | "dotted" | "double";
type Pattern = "none" | "hatch" | "cross" | "dots" | "grid";

const MARKS = ["none", "bracket", "square", "plus", "dot"] as const;

/** A spacing that suits each pattern. */
const PATTERN_SIZE = { hatch: 6, cross: 8, dots: 12, grid: 16 } as const;

const label = (text: string) => (
  <p className="font-mono text-sm">{text}</p>
);

export const frame = definePlayground<{
  rules: boolean;
  overshoot: number;
  border: Border;
  corners: Mark;
  fill: Pattern;
  radius: number;
  line: number;
}>({
  defaults: {
    rules: true,
    overshoot: 10,
    border: "none",
    corners: "plus",
    fill: "none",
    radius: 0,
    line: 1,
  },
  controls: {
    rules: { type: "toggle", label: "Rules" },
    overshoot: { type: "range", label: "Overshoot", min: 0, max: 24, unit: "px" },
    border: {
      type: "select",
      label: "Border",
      options: ["none", "solid", "dashed", "dotted", "double"],
    },
    corners: { type: "select", label: "Corners", options: MARKS },
    fill: {
      type: "select",
      label: "Fill",
      options: ["none", "hatch", "cross", "dots", "grid"],
    },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
    line: { type: "range", label: "Line", min: 1, max: 4, unit: "px" },
  },
  render: (v) => (
    <Frame radius={v.radius} line={v.line} className="w-full max-w-xs p-6">
      {v.fill !== "none" && (
        <FrameFill pattern={v.fill} size={PATTERN_SIZE[v.fill]} />
      )}
      {v.border !== "none" && <FrameBorder variant={v.border} />}
      {v.rules && <FrameRules overshoot={v.overshoot} />}
      {v.corners !== "none" && <FrameCorners mark={v.corners} />}
      {label("Content")}
    </Frame>
  ),
  code: (v) =>
    snippet(
      [
        importing(
          [
            "Frame",
            v.border !== "none" && "FrameBorder",
            v.corners !== "none" && "FrameCorners",
            v.fill !== "none" && "FrameFill",
            v.rules && "FrameRules",
          ],
          FRAME,
        ),
      ],
      el(
        "Frame",
        [
          ["radius", v.radius, 0],
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        v.fill !== "none" &&
          el("FrameFill", [
            ["pattern", v.fill, "hatch"],
            ["size", PATTERN_SIZE[v.fill], 6],
          ]),
        v.border !== "none" && el("FrameBorder", [["variant", v.border, "solid"]]),
        v.rules && el("FrameRules", [["overshoot", v.overshoot, 0]]),
        v.corners !== "none" && el("FrameCorners", [["mark", v.corners, "bracket"]]),
        "Content",
      ),
    ),
});

export const bracketFrame = definePlayground({
  defaults: { bracket: 14, thickness: 2, gap: 6, radius: 0 },
  controls: {
    bracket: { type: "range", label: "Bracket", min: 6, max: 32, unit: "px" },
    thickness: { type: "range", label: "Thickness", min: 1, max: 4, unit: "px" },
    gap: { type: "range", label: "Gap", min: 0, max: 16, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
  },
  render: (v) => (
    <BracketFrame
      bracket={v.bracket}
      thickness={v.thickness}
      gap={v.gap}
      radius={v.radius}
      className="w-full max-w-xs p-5"
    >
      <Frame className="aspect-video bg-foreground/5">
        <FrameFill pattern="dots" size={12} />
      </Frame>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="font-medium">Project name</p>
        <span className="font-mono text-sm text-foreground/60">★ 922</span>
      </div>
    </BracketFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["BracketFrame"], "@/components/bracket-frame")],
      el(
        "BracketFrame",
        [
          ["bracket", v.bracket, 14],
          ["thickness", v.thickness, 2],
          ["gap", v.gap, 6],
          ["radius", v.radius, 0],
          ["className", "p-5"],
        ],
        "Your content",
      ),
    ),
});

export const hatchDivider = definePlayground<{
  mark: Mark;
  height: number;
  bleed: number;
}>({
  defaults: { mark: "square", height: 20, bleed: 0 },
  controls: {
    mark: { type: "select", label: "Mark", options: MARKS },
    height: { type: "range", label: "Height", min: 8, max: 48, step: 4, unit: "px" },
    bleed: { type: "range", label: "Bleed", min: 0, max: 40, step: 4, unit: "px" },
  },
  render: (v) => (
    <HatchDivider
      mark={v.mark === "none" ? false : v.mark}
      bleed={v.bleed}
      className="w-full max-w-xs"
      style={{ height: v.height }}
    />
  ),
  code: (v) =>
    snippet(
      [importing(["HatchDivider"], "@/components/hatch-divider")],
      el("HatchDivider", [
        ["mark", v.mark === "none" ? false : v.mark, "square"],
        ["bleed", v.bleed, 0],
        ["className", v.height === 20 ? undefined : `h-[${v.height}px]`],
      ]),
    ),
});

export const crosshair = definePlayground<{
  overshoot: number;
  mark: FrameMark;
  size: number;
  line: number;
}>({
  defaults: { overshoot: 10, mark: "plus", size: 11, line: 1 },
  controls: {
    overshoot: { type: "range", label: "Overshoot", min: 0, max: 24, unit: "px" },
    mark: { type: "select", label: "Mark", options: ["plus", "square", "dot"] },
    size: { type: "range", label: "Mark size", min: 5, max: 21, step: 2, unit: "px" },
    line: { type: "range", label: "Line", min: 1, max: 3, unit: "px" },
  },
  render: (v) => (
    <Frame line={v.line} className="w-full max-w-xs p-6">
      <FrameRules overshoot={v.overshoot} />
      <FrameCorners mark={v.mark} size={v.size} />
      {label(`Overshoot ${v.overshoot}px`)}
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame", "FrameCorners", "FrameRules"], FRAME)],
      el(
        "Frame",
        [
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        el("FrameRules", [["overshoot", v.overshoot, 0]]),
        el("FrameCorners", [
          ["mark", v.mark, "bracket"],
          ["size", v.size],
        ]),
        "Content",
      ),
    ),
});

export const blueprint = definePlayground<{
  pattern: Exclude<Pattern, "none">;
  size: number;
  mark: FrameMark;
  border: Exclude<Border, "none" | "double">;
}>({
  defaults: { pattern: "grid", size: 16, mark: "square", border: "solid" },
  controls: {
    pattern: {
      type: "select",
      label: "Pattern",
      options: ["grid", "dots", "cross", "hatch"],
    },
    size: { type: "range", label: "Spacing", min: 6, max: 32, step: 2, unit: "px" },
    mark: { type: "select", label: "Mark", options: ["square", "plus", "dot", "bracket"] },
    border: { type: "select", label: "Border", options: ["solid", "dashed", "dotted"] },
  },
  render: (v) => (
    <Frame className="w-full max-w-xs p-6">
      <FrameFill pattern={v.pattern} size={v.size} />
      <FrameBorder variant={v.border} />
      <FrameCorners mark={v.mark} />
      {label(`${v.pattern} ${v.size}px`)}
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame", "FrameBorder", "FrameCorners", "FrameFill"], FRAME)],
      el(
        "Frame",
        [["className", "p-6"]],
        el("FrameFill", [
          ["pattern", v.pattern, "hatch"],
          ["size", v.size, 6],
        ]),
        el("FrameBorder", [["variant", v.border, "solid"]]),
        el("FrameCorners", [["mark", v.mark, "bracket"]]),
        "Content",
      ),
    ),
});
