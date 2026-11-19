import { OG_SIZE, OG_TYPE, homeImage } from "@/lib/og";

export const alt = "fancyborders: borders, but fancy. Frames, outlines and effects for React and Tailwind CSS.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return homeImage();
}
