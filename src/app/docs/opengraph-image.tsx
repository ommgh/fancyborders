import { OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "fancyborders docs: Introduction";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageImage({
    eyebrow: "Docs",
    title: "Introduction",
    description: "Borders, frames and enclosures for React and Tailwind CSS. Copy them into your project and they are yours.",
    footer: "npx shadcn add",
    visual: "bracket",
  });
}
