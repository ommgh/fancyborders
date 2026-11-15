import { BeamFrame } from "@/components/beam-frame";
import { GlowFrame } from "@/components/glow-frame";
import { Frame, FrameBorder } from "@/components/ui/frame";
import { FrameGlow, FrameGradient } from "@/components/ui/frame-effects";
import { FrameMetal, type MetalPreset } from "@/components/ui/frame-metal";
import { FrameSpotlight } from "@/components/ui/frame-spotlight";

import { definePlayground, el, importing, snippet } from "./define";

const FRAME = "@/components/ui/frame";
const EFFECTS = "@/components/ui/frame-effects";

/** The palette the effect layers fall back to. */
const FROM = "#38bdf8";
const TO = "#e879f9";

const muted = "mt-1 font-mono text-sm text-neutral-400";

export const beam = definePlayground({
  defaults: {
    size: 120,
    duration: 6,
    count: 1,
    reverse: false,
    radius: 14,
    from: FROM,
    to: TO,
  },
  controls: {
    size: { type: "range", label: "Length", min: 40, max: 280, step: 10, unit: "px" },
    duration: { type: "range", label: "Lap time", min: 1.5, max: 12, step: 0.5, unit: "s" },
    count: { type: "range", label: "Beams", min: 1, max: 4 },
    radius: { type: "range", label: "Radius", min: 0, max: 32, unit: "px" },
    from: { type: "color", label: "Head" },
    to: { type: "color", label: "Tail" },
    reverse: { type: "toggle", label: "Reverse" },
  },
  render: (v) => (
    <BeamFrame
      size={v.size}
      duration={v.duration}
      count={v.count}
      reverse={v.reverse}
      radius={v.radius}
      colors={[v.from, v.to]}
      className="w-full max-w-xs bg-neutral-900/60 p-6"
    >
      <p className="font-medium">Deploying to production</p>
      <p className={muted}>step 4 of 6 · 38s</p>
    </BeamFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["BeamFrame"], "@/components/beam-frame")],
      el(
        "BeamFrame",
        [
          ["colors", [v.from, v.to], [FROM, TO]],
          ["size", v.size, 120],
          ["duration", v.duration, 6],
          ["count", v.count, 1],
          ["reverse", v.reverse, false],
          ["radius", v.radius, 0],
          ["className", "p-6"],
        ],
        "Your content",
      ),
    ),
});

export const glow = definePlayground({
  defaults: {
    spin: true,
    pulse: false,
    blur: 10,
    spread: 14,
    radius: 14,
    from: "#22d3ee",
    via: "#818cf8",
    to: "#fb7185",
  },
  controls: {
    blur: { type: "range", label: "Blur", min: 2, max: 30, unit: "px" },
    spread: { type: "range", label: "Spread", min: 2, max: 30, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 32, unit: "px" },
    from: { type: "color", label: "From" },
    via: { type: "color", label: "Via" },
    to: { type: "color", label: "To" },
    spin: { type: "toggle", label: "Spin" },
    pulse: { type: "toggle", label: "Pulse" },
  },
  render: (v) => (
    <GlowFrame
      spin={v.spin}
      pulse={v.pulse}
      blur={v.blur}
      spread={v.spread}
      radius={v.radius}
      colors={[v.from, v.via, v.to]}
      className="w-full max-w-xs bg-neutral-950 p-6"
    >
      <p className="font-medium">Pro plan</p>
      <p className={muted}>Everything, unlimited</p>
    </GlowFrame>
  ),
  code: (v) =>
    snippet(
      [importing(["GlowFrame"], "@/components/glow-frame")],
      el(
        "GlowFrame",
        [
          ["colors", [v.from, v.via, v.to]],
          ["spin", v.spin, false],
          ["pulse", v.pulse, false],
          ["blur", v.blur, 10],
          ["spread", v.spread, 14],
          ["radius", v.radius, 0],
          ["className", "p-6"],
        ],
        "Your content",
      ),
    ),
});

export const gradient = definePlayground({
  defaults: {
    angle: 90,
    line: 2,
    radius: 12,
    from: "#fcd34d",
    to: "#f43f5e",
    spin: false,
    duration: 4,
  },
  controls: {
    angle: { type: "range", label: "Angle", min: 0, max: 360, step: 5, unit: "°" },
    line: { type: "range", label: "Line", min: 1, max: 6, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 32, unit: "px" },
    from: { type: "color", label: "From" },
    to: { type: "color", label: "To" },
    spin: { type: "toggle", label: "Spin" },
    duration: { type: "range", label: "Turn time", min: 1, max: 10, step: 0.5, unit: "s" },
  },
  render: (v) => (
    <Frame radius={v.radius} line={v.line} className="w-full max-w-xs p-6">
      <FrameGradient
        colors={[v.from, v.to]}
        angle={v.angle}
        spin={v.spin ? v.duration : false}
      />
      <p className="font-medium">Gradient border</p>
      <p className={muted}>
        {v.spin ? `one turn in ${v.duration}s` : `${v.angle}°`}
      </p>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [importing(["Frame"], FRAME), importing(["FrameGradient"], EFFECTS)],
      el(
        "Frame",
        [
          ["radius", v.radius, 0],
          ["line", v.line, 1],
          ["className", "p-6"],
        ],
        el("FrameGradient", [
          ["colors", [v.from, v.to]],
          ["angle", v.spin ? undefined : v.angle, 135],
          ["spin", v.spin ? (v.duration === 4 ? true : v.duration) : undefined],
        ]),
        "Your content",
      ),
    ),
});

export const pulse = definePlayground({
  defaults: { speed: 2.4, blur: 8, spread: 10, from: "#f43f5e", to: "#fb923c" },
  controls: {
    speed: { type: "range", label: "Breath time", min: 0.6, max: 5, step: 0.2, unit: "s" },
    blur: { type: "range", label: "Blur", min: 2, max: 24, unit: "px" },
    spread: { type: "range", label: "Spread", min: 2, max: 24, unit: "px" },
    from: { type: "color", label: "From" },
    to: { type: "color", label: "To" },
  },
  render: (v) => (
    <Frame radius={999} className="bg-neutral-950 px-5 py-2.5">
      <FrameGlow
        colors={[v.from, v.to]}
        pulse={v.speed}
        blur={v.blur}
        spread={v.spread}
      />
      <FrameGradient colors={[v.from, v.to]} />
      <p className="flex items-center gap-2 text-sm font-medium">
        <span className="size-2 rounded-full" style={{ background: v.from }} />
        Recording
      </p>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [
        importing(["Frame"], FRAME),
        importing(["FrameGlow", "FrameGradient"], EFFECTS),
      ],
      el(
        "Frame",
        [
          ["radius", 999],
          ["className", "px-5 py-2.5"],
        ],
        el("FrameGlow", [
          ["colors", [v.from, v.to]],
          ["pulse", v.speed === 2.4 ? true : v.speed],
          ["blur", v.blur, 10],
          ["spread", v.spread, 14],
        ]),
        el("FrameGradient", [["colors", [v.from, v.to]]]),
        "Recording",
      ),
    ),
});

const CELLS = ["A1", "A2", "A3", "B1", "B2", "B3"];

export const spotlight = definePlayground({
  defaults: { size: 140, wash: true, radius: 10, color: "#ffffff" },
  controls: {
    size: { type: "range", label: "Light radius", min: 60, max: 400, step: 10, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
    color: { type: "color", label: "Colour" },
    wash: { type: "toggle", label: "Wash the surface" },
  },
  render: (v) => (
    <div className="grid w-full max-w-xs grid-cols-3 gap-3">
      {CELLS.map((cell) => (
        <Frame key={cell} radius={v.radius} className="p-4">
          <FrameBorder />
          <FrameSpotlight size={v.size} wash={v.wash} colors={[v.color]} />
          <p className="font-mono text-sm text-neutral-400">{cell}</p>
        </Frame>
      ))}
    </div>
  ),
  code: (v) =>
    snippet(
      [
        importing(["Frame", "FrameBorder"], FRAME),
        importing(["FrameSpotlight"], "@/components/ui/frame-spotlight"),
      ],
      el(
        "Frame",
        [
          ["radius", v.radius, 0],
          ["className", "p-4"],
        ],
        el("FrameBorder"),
        el("FrameSpotlight", [
          ["colors", [v.color], ["#ffffff"]],
          ["size", v.size, 220],
          ["wash", v.wash, false],
        ]),
        "Your content",
      ),
    ),
});

export const liquidMetal = definePlayground<{
  preset: MetalPreset;
  line: number;
  radius: number;
  scale: number;
  speed: number;
  paused: boolean;
}>({
  defaults: {
    preset: "chromatic",
    line: 2,
    radius: 24,
    scale: 1,
    speed: 1,
    paused: false,
  },
  controls: {
    preset: {
      type: "select",
      label: "Finish",
      options: ["chromatic", "silver", "gold"],
    },
    line: { type: "range", label: "Line", min: 1, max: 5, unit: "px" },
    radius: { type: "range", label: "Radius", min: 0, max: 24, unit: "px" },
    scale: { type: "range", label: "Pattern size", min: 0.4, max: 3, step: 0.1, unit: "×" },
    speed: { type: "range", label: "Speed", min: 0.2, max: 3, step: 0.1, unit: "×" },
    paused: { type: "toggle", label: "Paused" },
  },
  render: (v) => (
    <Frame
      radius={v.radius}
      line={v.line}
      className="bg-neutral-900 px-7 py-3"
    >
      <FrameMetal
        preset={v.preset}
        theme="dark"
        scale={v.scale}
        speed={v.speed}
        paused={v.paused}
      />
      <span className="font-medium">Upgrade to Pro</span>
    </Frame>
  ),
  code: (v) =>
    snippet(
      [
        importing(["Frame"], FRAME),
        importing(["FrameMetal"], "@/components/ui/frame-metal"),
      ],
      el(
        "Frame",
        [
          ["radius", v.radius, 0],
          ["line", v.line, 1],
          ["className", "px-7 py-3"],
        ],
        el("FrameMetal", [
          ["preset", v.preset, "chromatic"],
          ["scale", v.scale, 1],
          ["speed", v.speed, 1],
          ["paused", v.paused, false],
        ]),
        "Upgrade to Pro",
      ),
    ),
});
