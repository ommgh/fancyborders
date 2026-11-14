import { BracketFrame } from "@/components/bracket-frame";
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
import { ShapeFrame } from "@/components/ui/shape-frame";
import { installCommand, SITE_NAME } from "@/lib/site";

const NAV = [
  ["Frames", "#frames"],
  ["Shapes", "#shapes"],
  ["Lines", "#lines"],
  ["Tailwind", "#tailwind"],
  ["Roadmap", "#roadmap"],
] as const;

const ROADMAP = [
  [
    "Effects",
    "Gradient, glow and animated borders, built on the same frame layers.",
  ],
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
            frames, shaped outlines and line styles. Free and open source.
            Install any of them with the shadcn CLI.
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
          <dl className="mt-8 grid gap-8 sm:grid-cols-3">
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
