import { OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "fancyborders docs: Theming";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageImage({
    eyebrow: "Docs",
    title: "Theming",
    description: "Colour, line width, radius and effect palettes are Tailwind utilities, variants included.",
    footer: "frame-color-sky-500/50",
    visual: "grid",
  });
}
