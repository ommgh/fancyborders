/*
 * The theming guide's tables and snippets, shared by the page and its
 * Markdown version for agents.
 */

export const UTILITIES: [utility: string, sets: string][] = [
  ["frame-color-*", "Line colour of borders, rules and fills"],
  ["frame-line-*", "Line width, in pixels"],
  ["frame-radius-*", "Corner radius, from the theme or an arbitrary length"],
  ["frame-mark-*", "Colour of corner marks"],
  ["frame-fill-*", "Colour of fill patterns"],
  ["frame-surface-*", "Colour painted behind hollow marks"],
  ["frame-bg-*", "Background inside a shape frame"],
  ["frame-from-*", "First colour of the effect layers"],
  ["frame-via-*", "Middle colour of the effect layers"],
  ["frame-to-*", "Last colour of the effect layers"],
  ["frame-duration-*", "Time for one turn of a gradient or one lap of a beam, in milliseconds"],
  ["section-cols-*", "Columns of a section grid, from 1 to 8"],
];

export const PROPERTIES: [property: string, sets: string][] = [
  ["--fb-line", "Line width"],
  ["--fb-line-color", "Line colour"],
  ["--fb-radius", "Corner radius"],
  ["--fb-surface", "Colour behind hollow marks; defaults to --background"],
  ["--fb-mark-color", "Colour of corner marks"],
  ["--fb-fill-color", "Colour of fill patterns"],
  ["--fb-from, --fb-via, --fb-to", "Effect palette"],
  ["--fb-duration", "Effect timing"],
];

export const VARIANTS = `<Frame className="frame-color-zinc-300 dark:frame-color-zinc-700 hover:frame-color-sky-500">
  <FrameBorder />
</Frame>`;

export const SCOPE = `<section className="frame-color-sky-500/40 frame-radius-lg">
  <Frame>…</Frame>
  <Frame>…</Frame>
</section>`;
