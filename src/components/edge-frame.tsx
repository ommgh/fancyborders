"use client";

import { useEffect, useRef, useState } from "react";

import type { Side } from "@/components/ui/frame";
import {
  polygonPaths,
  ShapeFrame,
  type OutlinePoint,
  type ShapeFrameProps,
} from "@/components/ui/shape-frame";

export type Edge = "zigzag" | "wave" | "scallop" | "bite";

export type EdgeFrameProps = Omit<
  ShapeFrameProps,
  "corner" | "corners" | "punch" | "size" | "path"
> & {
  /**
   * The pattern cut into the edges: `zigzag` teeth, a `wave`, a `scallop`
   * of round bumps, or round `bite`s like the edge of a stamp.
   */
  edge?: Edge;
  /** Which edges get the pattern. Defaults to top and bottom. */
  sides?: readonly Side[];
  /**
   * Length of one tooth, wave or bump, in pixels. Each edge fits a whole
   * number of them, so the real length is the closest that divides it.
   */
  size?: number;
  /** How far the pattern reaches in from the edge, in pixels. */
  depth?: number;
};

const SIDES: readonly Side[] = ["top", "right", "bottom", "left"];
const DEFAULT_SIDES: readonly Side[] = ["top", "bottom"];

/**
 * One period of an edge, as [how far along it, from 0 to 1, and how many
 * pixels out from it]. The last point, back on the line, belongs to the
 * next period.
 */
function period(edge: Edge, length: number, depth: number): [number, number][] {
  switch (edge) {
    case "zigzag":
      return [
        [0, 0],
        [0.5, depth],
      ];
    case "wave":
      return Array.from({ length: 12 }, (_, i) => [
        i / 12,
        (depth * (1 - Math.cos((i / 12) * 2 * Math.PI))) / 2,
      ]);
    default: {
      // An arc that rises by the depth: a full semicircle when the depth is
      // half its width, flatter when it is less. A scallop's arc spans the
      // whole period. A bite's leaves flat paper either side of it.
      const span = edge === "bite" ? 0.6 * length : length;
      const half = span / 2;
      const rise = Math.min(depth, half);
      const radius = (half * half + rise * rise) / (2 * rise);
      const sweep = Math.asin(Math.min(1, half / radius));
      const arc = Array.from({ length: 13 }, (_, i): [number, number] => {
        const angle = -sweep + (2 * sweep * i) / 12;
        return [
          (length / 2 + radius * Math.sin(angle)) / length,
          radius * Math.cos(angle) - (radius - rise),
        ];
      });
      return edge === "bite" ? [[0, 0], ...arc] : arc.slice(0, -1);
    }
  }
}

function outline(
  width: number,
  height: number,
  edge: Edge,
  sides: readonly Side[],
  size: number,
  depth: number,
): OutlinePoint[] {
  // Bites are cut into the box. The others stand on a line set in from it.
  const outward = edge === "bite" ? -1 : 1;
  const set = (side: Side) => (sides.includes(side) && edge !== "bite" ? depth : 0);
  const top = set("top");
  const right = set("right");
  const bottom = set("bottom");
  const left = set("left");

  // Each edge: where it starts, which way it runs, and which way is out.
  const runs: Record<Side, { from: [number, number]; along: [number, number]; out: [number, number]; length: number }> = {
    top: { from: [left, top], along: [1, 0], out: [0, -1], length: width - left - right },
    right: { from: [width - right, top], along: [0, 1], out: [1, 0], length: height - top - bottom },
    bottom: { from: [width - right, height - bottom], along: [-1, 0], out: [0, 1], length: width - left - right },
    left: { from: [left, height - bottom], along: [0, -1], out: [-1, 0], length: height - top - bottom },
  };

  return SIDES.flatMap((side, index) => {
    const { from, along, out, length } = runs[side];
    const corner = { x: from[0], y: from[1] };
    if (!sides.includes(side) || length <= 0) return [corner];

    // Bites stay clear of a corner shared with another bitten edge, where
    // the two would otherwise cut into each other.
    const clear = (neighbour: Side) =>
      edge === "bite" && sides.includes(neighbour) ? depth : 0;
    const lead = clear(SIDES[(index + 3) % 4]);
    const usable = length - lead - clear(SIDES[(index + 1) % 4]);
    if (usable <= 0) return [corner];

    const count = Math.max(1, Math.round(usable / size));
    const step = usable / count;
    const shape = period(edge, step, depth);
    const points = Array.from({ length: count }, (_, i) =>
      shape.map(([s, o]) => ({
        x: from[0] + along[0] * (lead + (i + s) * step) + out[0] * o * outward,
        y: from[1] + along[1] * (lead + (i + s) * step) + out[1] * o * outward,
      })),
    ).flat();
    return lead > 0 ? [corner, ...points] : points;
  });
}

/**
 * A frame with a pattern cut into its edges: zigzag, wavy, scalloped or
 * bitten. The pattern is a whole number of repeats along each edge, so the
 * frame measures itself in the browser; until then it is a plain rectangle.
 */
export function EdgeFrame({
  edge = "zigzag",
  sides = DEFAULT_SIDES,
  size = 16,
  depth = 8,
  line = 1,
  ...props
}: EdgeFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setBox({ width: element.offsetWidth, height: element.offsetHeight });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const path =
    box && box.width > 0 && box.height > 0
      ? polygonPaths(outline(box.width, box.height, edge, sides, size, depth), line)
      : undefined;

  return <ShapeFrame ref={ref} corner="square" path={path} line={line} {...props} />;
}
