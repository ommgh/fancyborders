import {
  polygonPaths,
  roundCorners,
  ShapeFrame,
  type OutlinePoint,
  type ShapeFrameProps,
} from "@/components/ui/shape-frame";
import type { Side } from "@/components/ui/frame";

export type BubbleFrameProps = Omit<
  ShapeFrameProps,
  "corner" | "corners" | "punch" | "size" | "path"
> & {
  /** The edge the tail points out of. */
  side?: Side;
  /**
   * Where the tail sits along its edge: pixels from the left or top, pixels
   * from the other end when negative, or a percentage.
   */
  at?: number | `${number}%`;
  /** How far the tail sticks out, in pixels. */
  tailSize?: number;
  /** Width of the tail where it joins the bubble, in pixels. */
  tailWidth?: number;
  /** How far the tip leans along the edge, in pixels. Negative leans back. */
  lean?: number;
  /** Radius of the corners, in pixels. */
  radius?: number;
};

const PADDING = {
  top: "paddingTop",
  right: "paddingRight",
  bottom: "paddingBottom",
  left: "paddingLeft",
} as const;

/**
 * A speech bubble: a rounded box with a tail. The tail is part of the
 * outline, so the border, fill and shadow run around it unbroken. It is
 * drawn inside the frame's box, and the content is kept clear of it.
 */
export function BubbleFrame({
  side = "bottom",
  at = 28,
  tailSize = 10,
  tailWidth = 16,
  lean = 0,
  radius = 14,
  line = 1,
  children,
  ...props
}: BubbleFrameProps) {
  const r = radius;
  const half = tailWidth / 2;
  // The tail's centre, as an anchor along the edge plus an offset.
  const centre =
    typeof at === "number"
      ? { ax: at < 0 ? 100 : 0, x: at }
      : { ax: parseFloat(at), x: 0 };

  // Drawn with the tail on the bottom edge, then turned onto its side.
  const bottom: OutlinePoint[] = [
    { x: 0, y: 0, r },
    { x: 0, y: 0, ax: 100, r },
    { x: 0, y: -tailSize, ax: 100, ay: 100, r },
    { x: centre.x + half, y: -tailSize, ax: centre.ax, ay: 100 },
    { x: centre.x + lean, y: 0, ax: centre.ax, ay: 100, r: 1.5 },
    { x: centre.x - half, y: -tailSize, ax: centre.ax, ay: 100 },
    { x: 0, y: -tailSize, ay: 100, r },
  ];
  const flip = (point: OutlinePoint) => ({
    ...point,
    y: -point.y,
    ay: 100 - (point.ay ?? 0),
  });
  const turn = ({ x, y, ax, ay, r }: OutlinePoint) => ({
    x: y,
    y: x,
    ax: ay,
    ay: ax,
    r,
  });
  const points = {
    bottom,
    top: bottom.map(flip),
    right: bottom.map(turn),
    left: bottom.map(flip).map(turn),
  }[side];

  return (
    <ShapeFrame path={polygonPaths(roundCorners(points), line)} line={line} {...props}>
      <div style={{ [PADDING[side]]: tailSize }}>{children}</div>
    </ShapeFrame>
  );
}
