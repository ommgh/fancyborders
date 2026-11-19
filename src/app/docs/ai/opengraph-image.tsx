import { OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "fancyborders docs: AI & agents";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageImage({
    eyebrow: "Docs",
    title: "AI & agents",
    description: "A hosted MCP server, an agent skill, llms.txt and every page as Markdown.",
    footer: "fancyborders.vercel.app/mcp",
    visual: "glow",
  });
}
