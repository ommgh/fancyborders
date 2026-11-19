import { COMPONENTS } from "@/content/docs";
import { OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "fancyborders: every component";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageImage({
    eyebrow: "Docs",
    title: "Components",
    description: `All ${COMPONENTS.length} of them: frames, page structure, shapes, line styles and effects, running live.`,
    footer: "npx shadcn add @fancyborders/<item>",
    visual: "bevel",
  });
}
