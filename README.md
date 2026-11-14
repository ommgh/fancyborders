# fancyborders

Borders, frames and enclosures for React and Tailwind CSS.

Copy-paste components for the edges of your interface: structural frames (corner brackets, hatched dividers, rails and intersection marks), shaped outlines (bevelled, notched and scooped corners, tickets) and line styles. Every component installs with one shadcn CLI command and is styled with Tailwind utilities.

**[fancyborders.vercel.app](https://fancyborders.vercel.app)** shows every component live, with its install command.

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
| `ticket-frame` | A ticket with rounded corners, a perforation and a tear-off stub. |

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

## Browser support

Structural frames use only widely supported CSS (gradients, custom properties and `color-mix()`).

Shape frames draw their outline with `clip-path`, so the border, fill and `drop-shadow` follow the shape everywhere. Where the newer [`border-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-shape) property is supported (Chromium 147 and later), the focus outline and `box-shadow` follow the shape too. Curved corners (`round` and `scoop`) need the CSS `shape()` function and fall back to a plain rectangular border without it.

## Development

The site and the registry are one Next.js app.

```bash
bun install
bun dev                  # site at http://localhost:3000
bun run registry:build   # writes registry.json and public/r/*.json
bun run build            # registry, then the production build
```

- Primitives live in `src/components/ui/`, presets in `src/components/`, and each primitive's CSS sits next to it.
- `scripts/build-registry.mjs` defines the registry items. It converts each stylesheet into the registry's `css` field, which is how the shadcn CLI installs CSS, then `shadcn build` writes the JSON the CLI downloads.
- Install commands and registry addresses use `NEXT_PUBLIC_SITE_URL`. On Vercel they fall back to the production URL, and locally to `http://localhost:3000`.

### Adding a component

1. Build it from the existing primitives where possible and put it in `src/components/`.
2. Add an item for it in `scripts/build-registry.mjs`, listing the primitives it uses in `registryDependencies`.
3. Add a card for it to the showcase in `src/app/page.tsx`.
4. Run `bun run registry:build` and test the install from `http://localhost:3000/r/<name>.json` in a separate project.
