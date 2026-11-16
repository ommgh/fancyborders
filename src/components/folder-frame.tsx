import type { ReactNode } from "react";

import {
  polygonPaths,
  roundCorners,
  ShapeFrame,
  type OutlinePoint,
  type ShapeFrameProps,
} from "@/components/ui/shape-frame";

export type FolderFrameProps = Omit<
  ShapeFrameProps,
  "corner" | "corners" | "punch" | "size" | "path"
> & {
  /** Content of the tab, such as a label. */
  tab?: ReactNode;
  /** Which end of the top edge the tab sits on. */
  tabSide?: "left" | "right";
  /** Width of the tab's top edge, in pixels. */
  tabWidth?: number;
  /** Height of the tab, in pixels. */
  tabHeight?: number;
  /** How far the tab's shoulder runs sideways on its way down, in pixels. */
  slope?: number;
  /** Radius of the corners, in pixels. */
  radius?: number;
};

/**
 * A folder: a tab standing on one end of the top edge, with a sloping
 * shoulder down to the body. The tab's content goes in `tab` and the rest
 * are the children, which start below the tab.
 */
export function FolderFrame({
  tab,
  tabSide = "left",
  tabWidth = 112,
  tabHeight = 28,
  slope = 14,
  radius = 10,
  line = 1,
  children,
  ...props
}: FolderFrameProps) {
  const r = radius;
  const left: OutlinePoint[] = [
    { x: 0, y: 0, r },
    { x: tabWidth, y: 0, r },
    { x: tabWidth + slope, y: tabHeight, r },
    { x: 0, y: tabHeight, ax: 100, r },
    { x: 0, y: 0, ax: 100, ay: 100, r },
    { x: 0, y: 0, ay: 100, r },
  ];
  const points =
    tabSide === "left"
      ? left
      : left.map((point) => ({ ...point, x: -point.x, ax: 100 - (point.ax ?? 0) }));

  return (
    <ShapeFrame path={polygonPaths(roundCorners(points), line)} line={line} {...props}>
      <div
        className="flex items-center px-3 text-xs"
        style={{
          width: tabWidth,
          height: tabHeight,
          marginLeft: tabSide === "right" ? "auto" : undefined,
        }}
      >
        {tab}
      </div>
      {children}
    </ShapeFrame>
  );
}
