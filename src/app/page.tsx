import { BeamFrame } from "@/components/beam-frame";
import { BracketFrame } from "@/components/bracket-frame";
import { GlowFrame } from "@/components/glow-frame";
import { HatchDivider } from "@/components/hatch-divider";
import { CopyCommand } from "@/components/site/copy-command";
import { Card, Section } from "@/components/site/showcase";
import { TicketFrame } from "@/components/ticket-frame";
import {
  Frame,
  FrameBorder,
  FrameCorners,
  FrameFill,
  FrameRules,
} from "@/components/ui/frame";
import {
  FrameBeam,
  FrameGlow,
  FrameGradient,
} from "@/components/ui/frame-effects";
import { FrameMetal } from "@/components/ui/frame-metal";
import { FrameSpotlight } from "@/components/ui/frame-spotlight";
import { ShapeFrame } from "@/components/ui/shape-frame";
import { installCommand, SITE_NAME } from "@/lib/site";

const NAV = [
  ["Frames", "#frames"],
  ["Shapes", "#shapes"],
  ["Lines", "#lines"],
  ["Effects", "#effects"],
  ["Tailwind", "#tailwind"],
  ["Roadmap", "#roadmap"],
] as const;

const ROADMAP = [
  [
    "Page structure",
    "Rails, section grids and intersection marks as a layout system.",
  ],
  [
    "More shapes",
    "Folder tabs, speech bubbles, scalloped, wavy and zigzag edges.",
  ],
] as const;

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip px-4 sm:px-8">
      {/* The page column: two rails, with dividers landing on them. */}
      <Frame className="mx-auto min-h-screen w-full max-w-5xl">
        <FrameRules sides={["left", "right"]} />

        <header className="px-6 pt-10 pb-16 sm:px-10">
          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-sm">
            <span className="mr-auto font-semibold">{SITE_NAME}</span>
            {NAV.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-foreground/60 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <h1 className="mt-16 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Borders, frames and enclosures for React and Tailwind.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-foreground/60">
            Copy-paste components for the edges of your interface: structural
            frames, shaped outlines, line styles and effects. Free and open
            source. Install any of them with the shadcn CLI.
          </p>
          <div className="mt-8 max-w-xl">
            <CopyCommand command={installCommand("frame")} />
          </div>
        </header>

        <HatchDivider bleed />

        <Section
          id="frames"
          title="Frames"
          lead="Structural frames: brackets, rails, marks and hatching. Each one is a short recipe over the Frame primitive, so you can take them apart and build your own."
        >
          <Card
            title="Bracket Frame"
            description="Corner brackets around a dashed border."
            item="bracket-frame"
          >
            <BracketFrame className="w-full max-w-xs p-5">
              <Frame className="aspect-video bg-foreground/5">
                <FrameFill pattern="dots" size={12} />
              </Frame>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="font-medium">Project name</p>
                <span className="font-mono text-sm text-foreground/60">
                  ★ 922
                </span>
              </div>
            </BracketFrame>
          </Card>

          <Card
            title="Hatch Divider"
            description="A hatched band for separating sections. It is also the divider between the sections of this page."
            item="hatch-divider"
          >
            <div className="grid w-full gap-8 px-2">
              <HatchDivider />
              <HatchDivider mark="plus" className="h-3" />
              <HatchDivider mark={false} className="h-8" />
            </div>
          </Card>

          <Card
            title="Crosshair"
            description="Rules that overshoot their corners, with plus marks."
            item="frame"
            recipe
          >
            <Frame className="w-full max-w-xs p-6">
              <FrameRules overshoot={10} />
              <FrameCorners mark="plus" />
              <p className="font-mono text-sm">Overshoot 10px</p>
            </Frame>
          </Card>

          <Card
            title="Blueprint"
            description="A grid fill behind a border with square marks."
            item="frame"
            recipe
          >
            <Frame className="w-full max-w-xs p-6">
              <FrameFill pattern="grid" size={16} />
              <FrameBorder />
              <FrameCorners mark="square" />
              <p className="font-mono text-sm">Grid 16px</p>
            </Frame>
          </Card>
        </Section>

        <HatchDivider bleed />

        <Section
          id="shapes"
          title="Shapes"
          lead="Outlines that are not rectangles. The border, fill and drop shadow follow the shape in every browser, and where border-shape is supported the focus ring and hit area do too."
        >
          <Card
            title="Bevel"
            description="Cut corners. Choose which ones."
            item="shape-frame"
          >
            <ShapeFrame
              corner="bevel"
              corners={["tl", "br"]}
              size={18}
              fill="var(--background)"
              className="w-full max-w-xs p-6 drop-shadow-lg"
            >
              <p className="font-mono text-sm">Two corners, 18px</p>
            </ShapeFrame>
          </Card>

          <Card
            title="Notch"
            description="Stepped corners, with a thicker line."
            item="shape-frame"
          >
            <ShapeFrame
              corner="notch"
              size={10}
              line={2}
              fill="var(--background)"
              className="w-full max-w-xs p-6"
            >
              <p className="font-mono text-sm">Four corners, 2px line</p>
            </ShapeFrame>
          </Card>

          <Card
            title="Scoop"
            description="Concave corners, and a different treatment per corner."
            item="shape-frame"
          >
            <div className="grid w-full max-w-xs gap-6">
              <ShapeFrame
                corner="scoop"
                size={14}
                fill="var(--background)"
                className="p-6"
              >
                <p className="font-mono text-sm">Scooped</p>
              </ShapeFrame>
              <ShapeFrame
                corner={{ tl: "round", tr: "bevel", br: "scoop", bl: "notch" }}
                size={14}
                fill="var(--background)"
                className="p-6"
              >
                <p className="font-mono text-sm">One of each</p>
              </ShapeFrame>
            </div>
          </Card>

          <Card
            title="Ticket Frame"
            description="Rounded corners, a perforation and a tear-off stub."
            item="ticket-frame"
          >
            <TicketFrame
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
                <p className="font-mono text-xs text-foreground/60">
                  ROW C · SEAT 14
                </p>
                <p className="mt-1 text-lg font-medium">Evening show</p>
              </div>
            </TicketFrame>
          </Card>
        </Section>

        <HatchDivider bleed />

        <Section
          id="lines"
          title="Lines"
          lead="Line styles for any frame. Borders follow the radius and take the native styles; rules take any dash pattern and can be switched off per side."
        >
          <Card
            title="Dash patterns"
            description="Set the dash and the gap independently."
            item="frame"
            recipe
          >
            <div className="grid w-full max-w-xs gap-5">
              {(
                [
                  [2, 4],
                  [6, 4],
                  [12, 6],
                ] as const
              ).map(([dash, gap]) => (
                <Frame key={dash} className="px-4 py-3">
                  <FrameRules dash={dash} gap={gap} />
                  <p className="font-mono text-sm">
                    dash {dash} · gap {gap}
                  </p>
                </Frame>
              ))}
            </div>
          </Card>

          <Card
            title="Border styles"
            description="Dashed, dotted and double borders, with a radius."
            item="frame"
            recipe
          >
            <div className="grid w-full max-w-xs gap-5">
              {(["dashed", "dotted", "double"] as const).map((variant) => (
                <Frame
                  key={variant}
                  radius={10}
                  line={variant === "double" ? 3 : 1}
                  className="px-4 py-3"
                >
                  <FrameBorder variant={variant} />
                  <p className="font-mono text-sm">{variant}</p>
                </Frame>
              ))}
            </div>
          </Card>
        </Section>

        <HatchDivider bleed />

        <Section
          id="effects"
          title="Effects"
          lead="Gradient, glow and motion, as more layers for the same frames. Most are plain CSS and render on the server; the spotlight and the metal are small client components."
        >
          <Card
            title="Beam Frame"
            description="A light that travels the border at a steady speed, around any proportions and any corner."
            item="beam-frame"
            stage="dark"
          >
            <BeamFrame
              radius={14}
              className="w-full max-w-xs bg-neutral-900/60 p-6"
            >
              <p className="font-medium">Deploying to production</p>
              <p className="mt-1 font-mono text-sm text-neutral-400">
                step 4 of 6 · 38s
              </p>
            </BeamFrame>
          </Card>

          <Card
            title="Glow Frame"
            description="A turning gradient border, with a halo of the same colours glowing behind it."
            item="glow-frame"
            stage="dark"
          >
            <GlowFrame
              spin
              radius={14}
              colors={["#22d3ee", "#818cf8", "#e879f9", "#fb7185"]}
              className="w-full max-w-xs bg-neutral-950 p-6"
            >
              <p className="font-medium">Pro plan</p>
              <p className="mt-1 font-mono text-sm text-neutral-400">
                Everything, unlimited
              </p>
            </GlowFrame>
          </Card>

          <Card
            title="Liquid Metal"
            description="A moving metal ring drawn with WebGL, in three finishes. Every ring on the page shares one context."
            item="frame-metal"
            stage="dark"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              {(["chromatic", "silver", "gold"] as const).map((preset) => (
                <Frame
                  key={preset}
                  radius={999}
                  line={2}
                  className="bg-neutral-900 px-5 py-2.5"
                >
                  <FrameMetal preset={preset} theme="dark" />
                  <span className="text-sm font-medium capitalize">
                    {preset}
                  </span>
                </Frame>
              ))}
            </div>
          </Card>

          <Card
            title="Spotlight"
            description="Borders that light up near the pointer, across every frame at once. Move over the grid."
            item="frame-spotlight"
            stage="dark"
          >
            <div className="grid w-full max-w-xs grid-cols-3 gap-3">
              {["A1", "A2", "A3", "B1", "B2", "B3"].map((cell) => (
                <Frame key={cell} radius={10} className="p-4">
                  <FrameBorder />
                  <FrameSpotlight size={140} wash />
                  <p className="font-mono text-sm text-neutral-400">{cell}</p>
                </Frame>
              ))}
            </div>
          </Card>

          <Card
            title="Gradient"
            description="A gradient on the line, coloured by props or by frame-from-*, frame-via-* and frame-to-* utilities."
            item="frame-effects"
            recipe
            stage="dark"
          >
            <div className="grid w-full max-w-xs gap-5">
              <Frame radius={10} className="px-4 py-3">
                <FrameGradient />
                <p className="font-mono text-sm">default</p>
              </Frame>
              <Frame
                radius={10}
                line={2}
                className="px-4 py-3 frame-from-amber-300 frame-to-rose-500"
              >
                <FrameGradient angle={90} />
                <p className="font-mono text-sm">frame-from-amber-300</p>
              </Frame>
              <Frame
                line={2}
                className="px-4 py-3 frame-from-emerald-400 frame-via-emerald-400/0 frame-to-emerald-400/0"
              >
                <FrameGradient spin={3} />
                <FrameCorners mark="square" />
                <p className="font-mono text-sm">spin</p>
              </Frame>
            </div>
          </Card>

          <Card
            title="Pulse"
            description="A halo that breathes in and out, for something that is live, recording or waiting."
            item="frame-effects"
            recipe
            stage="dark"
          >
            <Frame
              radius={999}
              className="bg-neutral-950 px-5 py-2.5 frame-from-rose-500 frame-to-orange-400"
            >
              <FrameGlow pulse blur={8} spread={10} />
              <FrameGradient />
              <p className="flex items-center gap-2 text-sm font-medium">
                <span className="size-2 rounded-full bg-rose-500" />
                Recording
              </p>
            </Frame>
          </Card>

          <Card
            title="Marching ants"
            description="Dashed rules whose dashes travel around the frame, like a selection rectangle."
            item="frame"
            recipe
            stage="dark"
          >
            <Frame className="w-full max-w-xs p-6">
              <FrameRules dash={6} gap={4} march />
              <FrameCorners mark="square" />
              <p className="font-mono text-sm">march</p>
            </Frame>
          </Card>

          <Card
            title="On shapes"
            description="Inside a shape frame the effect layers follow the shape instead of the rectangle."
            item="frame-effects"
            recipe
            stage="dark"
          >
            <div className="grid w-full max-w-xs gap-6">
              <ShapeFrame
                corner="bevel"
                corners={["tl", "br"]}
                size={16}
                fill="var(--color-neutral-950)"
                className="p-5 frame-from-cyan-300 frame-to-violet-500"
              >
                <FrameGlow />
                <FrameGradient />
                <p className="font-mono text-sm">gradient and glow</p>
              </ShapeFrame>
              <ShapeFrame corner="notch" size={10} className="p-5">
                <FrameBeam />
                <p className="font-mono text-sm">beam</p>
              </ShapeFrame>
            </div>
          </Card>
        </Section>

        <HatchDivider bleed />

        <Section
          id="tailwind"
          title="Tailwind"
          lead="Every frame reads its tokens from utilities, so colour, line width and radius are ordinary classes, and they work with variants like hover and dark."
        >
          <Card
            title="Token utilities"
            description="frame-color, frame-line, frame-radius, frame-mark, frame-fill and frame-bg."
            item="frame"
            recipe
          >
            <Frame className="w-full max-w-xs p-6 frame-color-sky-500/50 frame-line-2 frame-mark-sky-500 frame-radius-xl">
              <FrameBorder variant="dashed" offset={-6} radius={8} />
              <FrameCorners mark="bracket" size={20} />
              <p className="font-mono text-sm">frame-color-sky-500/50</p>
            </Frame>
          </Card>

          <Card
            title="With variants"
            description="Tokens change on hover, focus or in dark mode like any other utility."
            item="shape-frame"
            recipe
          >
            <ShapeFrame
              corner="bevel"
              size={16}
              className="w-full max-w-xs p-6 transition-colors frame-bg-sky-500/10 frame-color-sky-500/60 hover:frame-bg-sky-500/25 hover:frame-color-sky-500"
            >
              <p className="font-mono text-sm">hover:frame-color-sky-500</p>
            </ShapeFrame>
          </Card>
        </Section>

        <HatchDivider bleed />

        <section id="roadmap" className="scroll-mt-8 px-6 py-16 sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight">Roadmap</h2>
          <p className="mt-2 max-w-prose text-foreground/60">
            Not built yet. These are the categories still to come.
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
      </Frame>
    </div>
  );
}
