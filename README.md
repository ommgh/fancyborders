# fancyborders

Borders, frames and enclosures for React and Tailwind CSS.

Copy-paste components for the edges of your interface: structural frames (corner brackets, hatched dividers and intersection marks), page structure (rails, section rules and section grids), shaped outlines (bevelled, notched and scooped corners, tickets), line styles, and effects (gradient, glow, a travelling beam, a pointer spotlight and liquid metal). Every component installs with one shadcn CLI command and is styled with Tailwind utilities.

**[fancyborders.vercel.app](https://fancyborders.vercel.app)** shows every component live, with controls to tune it, its install command and its props.

## Install

The components install through the [shadcn CLI](https://ui.shadcn.com/docs/cli) into a project that uses React and Tailwind CSS v4. If the project has no `components.json` yet, run `npx shadcn@latest init` first.

```bash
npx shadcn@latest add https://fancyborders.vercel.app/r/bracket-frame.json
```

The CLI copies the component into your project, installs anything it depends on (here, the `frame` primitive) and adds its CSS to your global stylesheet. The code is yours to edit afterwards.

## Components

| Item | What it is |
| --- | --- |
| `frame` | The primitive: an enclosure plus border, rule, corner-mark and fill layers. |
| `shape-frame` | A frame whose outline follows a shape: bevel, notch, scoop or round corners, and punched edges. |
| `bracket-frame` | Corner brackets around a dashed border. |
| `hatch-divider` | A hatched band for separating page sections, with marks where it meets the page rails. |
| `page-rails` | The column a page is laid out in: a vertical rail down each side, optionally with a patterned gutter. |
| `section-rule` | A line between page sections that runs past the rails, with a mark on each intersection. |
| `section-grid` | A grid whose cells share one line between them, with a mark on every crossing. |
| `ticket-frame` | A ticket with rounded corners, a perforation and a tear-off stub. |
| `frame-effects` | Effect layers in plain CSS: a gradient line, a glow, and a beam of light that travels the border. |
| `frame-spotlight` | A light on the border that follows the pointer. |
| `frame-metal` | Liquid metal on the border, drawn with WebGL. |
| `beam-frame` | A quiet border with a light travelling around it. |
| `glow-frame` | A gradient border with a halo of the same colours behind it. |

Replace the item name in the URL above to install any of them.

## Usage

Presets work as wrappers:

```tsx
import { BracketFrame } from "@/components/bracket-frame";

<BracketFrame className="p-5">
  <Card />
</BracketFrame>;
```

Every preset is a short recipe over `Frame`. Put layers inside a frame in any order; they are absolutely positioned and never affect layout:

```tsx
import { Frame, FrameCorners, FrameFill, FrameRules } from "@/components/ui/frame";

<Frame className="p-6">
  <FrameFill pattern="grid" size={16} />
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>;
```

| Layer | Draws |
| --- | --- |
| `FrameBorder` | A real CSS border that follows the radius: solid, dashed, dotted or double, optionally offset in or out. |
| `FrameRules` | Four straight lines that can overshoot the corners, be switched off per side, or take any dash pattern. |
| `FrameCorners` | A mark at each corner: `bracket`, `square`, `plus`, `dot`, or your own content. |
| `FrameFill` | A pattern behind the content: `hatch`, `cross`, `dots` or `grid`. |

Shaped frames take a corner treatment, for all four corners, a subset, or one per corner:

```tsx
import { ShapeFrame } from "@/components/ui/shape-frame";

<ShapeFrame corner="bevel" corners={["tl", "br"]} size={18} className="p-6 drop-shadow-lg">
  Content
</ShapeFrame>;
```

## Page structure

Three components lay out a whole page on the same lines. `PageRails` is the column, `SectionRule` separates its sections, and `SectionGrid` divides one into cells:

```tsx
import { PageRails } from "@/components/page-rails";
import { SectionRule } from "@/components/section-rule";
import { SectionGrid } from "@/components/ui/section-grid";

<div className="overflow-x-clip">
  <PageRails className="mx-auto max-w-5xl">
    <header className="p-10">…</header>
    <SectionRule bleed />
    <SectionGrid mark="plus" className="section-cols-1 sm:section-cols-3">
      <div className="p-8">One</div>
      <div className="p-8">Two</div>
      <div className="p-8">Three</div>
    </SectionGrid>
    <SectionRule bleed />
    <footer className="p-10">…</footer>
  </PageRails>
</div>;
```

Everything inside the rails sits flush with them, so pad the sections rather than the column. A rule crosses the rails and puts a mark on each intersection; with `bleed` it runs on to the page edges. A section grid draws each line between its cells once and none on its outer edge, so it meets the rails and the rules around it exactly. Pass `outline` to use one on its own.

Set a grid's columns with `section-cols-1` to `section-cols-8` rather than `grid-cols-*`: the grid counts its cells to find its last column and last row. The utilities take variants, so the columns can change at a breakpoint.

## Effects

Effects are more layers for the same frames. `FrameGradient`, `FrameGlow` and `FrameBeam` are plain CSS, so they render on the server and need no JavaScript:

```tsx
import { Frame, FrameBorder } from "@/components/ui/frame";
import { FrameBeam, FrameGlow, FrameGradient } from "@/components/ui/frame-effects";

<Frame radius={14} className="p-6">
  <FrameGlow spin />
  <FrameGradient spin />
  Content
</Frame>;

<Frame radius={14} className="p-6">
  <FrameBorder />
  <FrameBeam duration={6} />
  Content
</Frame>;
```

| Layer | Draws |
| --- | --- |
| `FrameGradient` | A gradient on the frame's line. `spin` turns it around the frame. |
| `FrameGlow` | The same gradient blurred into a halo behind the content. `spin` turns it and `pulse` makes it breathe. |
| `FrameBeam` | A light that travels the border at a steady speed, whatever the frame's proportions. Takes a `size`, a `duration`, a `count` and `reverse`. |
| `FrameSpotlight` | A light on the line that follows the pointer, and with `wash` across the surface too. A client component, from `frame-spotlight`. |
| `FrameMetal` | Liquid metal on the line in `chromatic`, `silver` or `gold`. A client component, from `frame-metal`. |

All of them take `colors`. Leave it out and they read a shared palette from the frame, so one set of utilities colours every effect layer inside it:

```tsx
<Frame className="frame-from-amber-300 frame-to-rose-500">
  <FrameGlow />
  <FrameGradient />
</Frame>
```

`FrameRules` can also animate its dashes, for a marching-ants selection:

```tsx
<FrameRules dash={6} gap={4} march />
```

Inside a `ShapeFrame` the effect layers follow the shape instead of the rectangle. The glow becomes the whole shape blurred behind it, so give the shape a `fill`.

Every animation stops for people who ask for reduced motion.

## Tailwind utilities

Frames read their colours and sizes from custom properties, and each one has a utility. Put them on a frame, or on any ancestor, to restyle every layer inside it. They accept theme values, opacity modifiers and variants:

```tsx
<Frame className="frame-color-sky-500/50 frame-line-2 frame-radius-xl hover:frame-color-sky-500">
```

| Utility | Sets |
| --- | --- |
| `frame-color-*` | Line colour of borders, rules and fills |
| `frame-line-*` | Line width, in pixels |
| `frame-radius-*` | Corner radius, from the theme or an arbitrary length |
| `frame-mark-*` | Colour of corner marks |
| `frame-fill-*` | Colour of fill patterns |
| `frame-surface-*` | Colour painted behind hollow marks |
| `frame-bg-*` | Background inside a shape frame |
| `frame-from-*`, `frame-via-*`, `frame-to-*` | Colours of the effect layers |
| `section-cols-*` | Columns of a section grid, from 1 to 8 |
| `frame-duration-*` | Time for one turn of a gradient or one lap of a beam, in milliseconds |

## Browser support

Structural frames and page structure use only widely supported CSS (gradients, custom properties and `color-mix()`).

Shape frames draw their outline with `clip-path`, so the border, fill and `drop-shadow` follow the shape everywhere. Where the newer [`border-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-shape) property is supported (Chromium 147 and later), the focus outline and `box-shadow` follow the shape too. Curved corners (`round` and `scoop`) need the CSS `shape()` function and fall back to a plain rectangular border without it.

Effects need a browser that Tailwind CSS v4 itself supports. `FrameBeam` moves along the outline with `offset-path` (Chromium 116, Firefox 122, Safari 18) and draws nothing without it. Spinning gradients and marching dashes animate registered custom properties (`@property`). `FrameMetal` needs WebGL and shows the frame's plain line without it.

## Development

The site and the registry are one Next.js app.

```bash
bun install
bun dev                  # site at http://localhost:3000
bun run registry:build   # writes registry.json and public/r/*.json
bun run build            # registry, then the production build
```

- Primitives live in `src/components/ui/`, presets in `src/components/`, and each primitive's CSS sits next to it.
- A layer that needs the browser (`frame-spotlight`, `frame-metal`) is its own registry item and its own client component, so the rest stay server components.
- `registry/items.json` lists the registry items. `scripts/build-registry.mjs` turns it into `registry.json`, converting each stylesheet into the registry's `css` field (which is how the shadcn CLI installs CSS), then `shadcn build` writes the JSON the CLI downloads. The site reads the same list to show each item's source for a manual install.
- Install commands and registry addresses use `NEXT_PUBLIC_SITE_URL`. On Vercel they fall back to the production URL, and locally to `http://localhost:3000`.

### How the site is put together

| Path | What it holds |
| --- | --- |
| `src/app/page.tsx` | The landing page. |
| `src/app/docs/` | The docs: guides, the component gallery, and one page per component at `/docs/components/<slug>`. |
| `src/content/docs.ts` | Every component page and how the sidebar groups them. |
| `src/content/playgrounds/` | The live preview for each page: its controls, how to render them, and the code to print. |
| `src/content/api.ts` | The props tables. |
| `src/demos/` | Static examples. A page shows each one running and, read from the same file, its source. |
| `src/components/site/` | The site's own chrome: header, sidebar, code blocks, playground. |

### Adding a component

1. Build it from the existing primitives where possible and put it in `src/components/`.
2. Add an item for it to `registry/items.json`, listing the items it is built on in `requires`.
3. Give it a page: an entry in `src/content/docs.ts`, a playground in `src/content/playgrounds/` (registered in its `index.ts` under the page's slug), and its props in `src/content/api.ts`. The gallery, the sidebar, the landing page and the sitemap pick it up from there.
4. Run `bun run registry:build` and test the install from `http://localhost:3000/r/<name>.json` in a separate project.

## Credits

The effects were inspired by Jakub Antalik's [Border Beam](https://libraries.dev/beam) and [Metal FX](https://github.com/Jakubantalik/metal-fx). The shader and palettes in `frame-metal` are adapted from Metal FX under its MIT License; the full notice is in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
