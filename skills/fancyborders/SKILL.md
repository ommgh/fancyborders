---
name: fancyborders
description: Build decorative borders, frames and enclosures in React and Tailwind CSS v4 with fancyborders, a free shadcn registry. Use when a UI needs more than a plain border, such as corner brackets, crosshair or blueprint frames, hatched dividers, page rails, section rules and section grids, bevelled, notched or scooped corners, tickets, folders, speech bubbles, zigzag or scalloped edges, dashed or marching-ants lines, or gradient, glow, beam, spotlight and liquid-metal border effects.
---

# fancyborders

fancyborders is a collection of borders, frames and enclosures for React and Tailwind CSS v4. Components are copied into the project with the shadcn CLI, so the code is the project's own afterwards. Docs and live previews: https://fancyborders.vercel.app

## Before you start

Check the project has React, Tailwind CSS v4 and a `components.json`. Without `components.json`, run `npx shadcn@latest init` first. Use the project's package manager for the CLI (`npx`, `pnpm dlx`, `yarn dlx` or `bunx --bun`).

## Pick the component

Read `references/components.md` for the full catalogue. The common picks:

| The design wants | Use | Item |
| --- | --- | --- |
| Corner brackets around content | `BracketFrame` | `bracket-frame` |
| Lines that overshoot with marks at the corners | Crosshair recipe (`FrameRules` + `FrameCorners`) | `frame` |
| Grid or dot pattern behind a framed box | Blueprint recipe (`FrameFill` + `FrameBorder` + `FrameCorners`) | `frame` |
| A page column with side rails, rules between sections | `PageRails`, `SectionRule` | `page-rails`, `section-rule` |
| A grid of cells sharing one line, marks at crossings | `SectionGrid` | `section-grid` |
| A hatched band between page sections | `HatchDivider` | `hatch-divider` |
| Bevelled, notched, scooped or round corners | `ShapeFrame` | `shape-frame` |
| Ticket, folder, speech bubble | `TicketFrame`, `FolderFrame`, `BubbleFrame` | `ticket-frame`, `folder-frame`, `bubble-frame` |
| Zigzag, wavy, scalloped or bitten edges | `EdgeFrame` | `edge-frame` |
| Dashed, dotted or moving ("marching ants") lines | `FrameRules` with `dash`, `gap`, `march` | `frame` |
| Gradient border | `FrameGradient` | `frame-effects` |
| Glowing border | `GlowFrame` (or `FrameGlow` + `FrameGradient`) | `glow-frame` |
| A light travelling around the border | `BeamFrame` (or `FrameBeam`) | `beam-frame` |
| Borders lighting up near the pointer | `FrameSpotlight` | `frame-spotlight` |
| Liquid metal border | `FrameMetal` | `frame-metal` |

For a component's exact props, usage code and examples, fetch its docs as Markdown: `https://fancyborders.vercel.app/docs/components/<slug>.md`. If the fancyborders MCP server is connected, `search_components` and `get_component` give the same.

## Install

```bash
npx shadcn@latest add https://fancyborders.vercel.app/r/<item>.json
```

Or set the registry up once and install by name:

```bash
npx shadcn@latest registry add @fancyborders=https://fancyborders.vercel.app/r/{name}.json
npx shadcn@latest add @fancyborders/<item>
```

The CLI copies the component, adds the items it is built on (usually `frame`), and writes its CSS into the global stylesheet. Do not hand-copy the CSS when the CLI is available. Presets land in `components/`, primitives in `components/ui/`.

## How it works

Everything is a `Frame` with decoration layers inside it, next to the content. Layers are absolutely positioned, never affect layout, and can go in any order.

```tsx
import { Frame, FrameBorder, FrameCorners, FrameRules } from "@/components/ui/frame";

<Frame radius={12} className="p-6">
  <FrameBorder />
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>
```

Presets are short recipes over those layers, and wrap content directly:

```tsx
import { GlowFrame } from "@/components/glow-frame";

<GlowFrame spin radius={14} className="bg-card p-6">
  Pro plan
</GlowFrame>
```

## Rules of thumb

- **Style with utilities, not props**, where you can: `frame-color-*`, `frame-line-*`, `frame-radius-*`, and `frame-from-*` / `frame-via-*` / `frame-to-*` for effect colours. They take variants (`hover:`, `dark:`, breakpoints) and inherit, so one utility on a section themes every frame in it. See `references/theming.md`.
- **Pad the frame.** Layers do not add space; give the frame the padding its content needs, and at least as much as any bracket gap or inset.
- **Effects need a surface.** Give glow, gradient and beam cards their own background (`bg-card`), and give a `ShapeFrame` or `EdgeFrame` a `fill` when it has a glow, because the halo is the whole shape blurred behind it.
- **Keep colours calm and mid-tone** (for example `frame-from-indigo-300 frame-to-violet-400`) so effects read in light and dark mode. Avoid pure white light on light backgrounds; `FrameSpotlight` defaults to the text colour for that reason.
- **Section grids** take columns from `section-cols-1` to `section-cols-8`, not `grid-cols-*`.
- **Page structure**: put `PageRails` around the page column and `SectionRule bleed` between sections, inside an ancestor with `overflow-x-clip`.
- `FrameSpotlight`, `FrameMetal` and `EdgeFrame` are client components; everything else works in server components.
- Animations already stop for people who prefer reduced motion; do not add your own guards.

## More

- Everything as Markdown: https://fancyborders.vercel.app/llms.txt and https://fancyborders.vercel.app/llms-full.txt
- MCP server (Streamable HTTP, no auth): https://fancyborders.vercel.app/mcp
- Source: https://github.com/ommgh/fancyborders
