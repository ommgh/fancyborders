import { OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "fancyborders docs: Installation";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageImage({
    eyebrow: "Docs",
    title: "Installation",
    description: "One command per component with the shadcn CLI. No package to install or keep up to date.",
    footer: "npx shadcn@latest add @fancyborders/frame",
    visual: "selection",
  });
}
