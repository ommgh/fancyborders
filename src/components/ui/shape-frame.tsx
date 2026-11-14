import type { CSSProperties } from "react";

import {
  Frame,
  type Corner,
  type FrameProps,
  type Length,
  type Side,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

export type CornerShape = "square" | "round" | "bevel" | "notch" | "scoop";

export type Punch = {
  /** Edges that get a semicircular bite. Defaults to left and right. */
  sides?: readonly Side[];
  /** Position of the bite along its edge. Defaults to the middle. */
  at?: Length;
  /** Radius of the bite, in pixels. */
  radius?: number;
};

/* ── Geometry ──────────────────────────────────────────────────────────── */

/*
 * A path is a list of points. Each point may say it is reached by an arc
 * rather than a straight line. Coordinates are CSS strings so a path can
 * mix percentages of the box with pixel offsets.
 */
type Point = { x: string; y: string; arc?: { r: number; sweep: "cw" | "ccw" } };

/* A corner in its own coordinates: `a` runs along the horizontal edge and
   `b` along the vertical one, both measured inward from the corner. */
type Local = { a: number; b: number; arc?: Point["arc"] };

const CORNERS: readonly Corner[] = ["tl", "tr", "br", "bl"];

const round = (n: number) => Math.round(n * 1000) / 1000;

/** `base` plus a pixel offset, as a CSS length. */
function at(base: string, offset: number) {
  if (offset === 0) return base;
  if (base === "0%") return `${round(offset)}px`;
  const sign = offset < 0 ? "-" : "+";
  return `calc(${base} ${sign} ${round(Math.abs(offset))}px)`;
}

/**
 * One corner, offset inward by `inset`, listed from its vertical edge to
 * its horizontal edge.
 */
function cornerPoints(shape: CornerShape, size: number, inset: number): Local[] {
  const d = inset;

  switch (size > 0 ? shape : "square") {
    case "bevel": {
      const k = size + d * (Math.SQRT2 - 1);
      return [
        { a: d, b: k },
        { a: k, b: d },
      ];
    }
    case "notch":
      return [
        { a: d, b: size + d },
        { a: size + d, b: size + d },
        { a: size + d, b: d },
      ];
    case "scoop": {
      const r = size + d;
      const s = Math.sqrt(r * r - d * d);
      return [
        { a: d, b: s },
        { a: s, b: d, arc: { r, sweep: "ccw" } },
      ];
    }
    case "round": {
      const r = size - d;
      if (r <= 0) return [{ a: d, b: d }];
      return [
        { a: d, b: size },
        { a: size, b: d, arc: { r, sweep: "cw" } },
      ];
    }
    default:
      return [{ a: d, b: d }];
  }
}

/** Places a corner on the box, in clockwise drawing order. */
function placeCorner(corner: Corner, local: Local[]): Point[] {
  const right = corner === "tr" || corner === "br";
  const bottom = corner === "br" || corner === "bl";
  const place = ({ a, b }: Local) => ({
    x: right ? at("100%", -a) : at("0%", a),
    y: bottom ? at("100%", -b) : at("0%", b),
  });

  // Top-left and bottom-right are drawn vertical edge first; the other two
  // run the opposite way, which moves each arc onto the following point.
  if (corner === "tl" || corner === "br") {
    return local.map((point) => ({ ...place(point), arc: point.arc }));
  }
  const reversed = [...local].reverse();
  return reversed.map((point, i) => ({
    ...place(point),
    arc: i > 0 ? reversed[i - 1].arc : undefined,
  }));
}

/** The two ends of a semicircular bite out of one edge. */
function punchPoints(side: Side, punch: Required<Punch>, inset: number): Point[] {
  const r = punch.radius + inset;
  const s = Math.sqrt(r * r - inset * inset);
  const centre = typeof punch.at === "number" ? `${punch.at}px` : punch.at;
  const arc = { r, sweep: "ccw" } as const;

  switch (side) {
    case "top":
      return [
        { x: at(centre, -s), y: at("0%", inset) },
        { x: at(centre, s), y: at("0%", inset), arc },
      ];
    case "right":
      return [
        { x: at("100%", -inset), y: at(centre, -s) },
        { x: at("100%", -inset), y: at(centre, s), arc },
      ];
    case "bottom":
      return [
        { x: at(centre, s), y: at("100%", -inset) },
        { x: at(centre, -s), y: at("100%", -inset), arc },
      ];
    case "left":
      return [
        { x: at("0%", inset), y: at(centre, s) },
        { x: at("0%", inset), y: at(centre, -s), arc },
      ];
  }
}

type ShapeOptions = {
  corners: Record<Corner, CornerShape>;
  size: number;
  punch?: Required<Punch>;
};

function outline({ corners, size, punch }: ShapeOptions, inset: number) {
  const edgeAfter: Record<Corner, Side> = {
    tl: "top",
    tr: "right",
    br: "bottom",
    bl: "left",
  };

  return CORNERS.flatMap((corner) => {
    const points = placeCorner(
      corner,
      cornerPoints(corners[corner], size, inset),
    );
    const side = edgeAfter[corner];
    return punch?.sides.includes(side)
      ? [...points, ...punchPoints(side, punch, inset)]
      : points;
  });
}

function commands(points: Point[]) {
  return points
    .slice(1)
    .map(({ x, y, arc }) =>
      arc
        ? `arc to ${x} ${y} of ${round(arc.r)}px ${arc.sweep}`
        : `line to ${x} ${y}`,
    )
    .join(", ");
}

/**
 * Builds the CSS paths for a shape: its outline, and the ring between the
 * outline and the same shape inset by the line width.
 */
export function shapePaths(options: ShapeOptions, line: number) {
  const outer = outline(options, 0);
  const inner = outline(options, line);
  const curved = [...outer, ...inner].some((point) => point.arc);

  if (!curved) {
    const list = (points: Point[]) =>
      [...points, points[0]].map(({ x, y }) => `${x} ${y}`).join(", ");
    return {
      kind: "polygon" as const,
      outer: `polygon(${list(outer)})`,
      // One polygon that walks the outline, then the inset outline. With
      // the even-odd rule only the band between them is kept.
      ring: `polygon(evenodd, ${list(outer)}, ${list(inner)})`,
    };
  }

  const subpath = (points: Point[]) =>
    `${points[0].x} ${points[0].y}, ${commands(points)}, close`;
  return {
    kind: "shape" as const,
    outer: `shape(from ${subpath(outer)})`,
    ring: `shape(evenodd from ${subpath(outer)}, move to ${subpath(inner)})`,
  };
}

/* ── Component ─────────────────────────────────────────────────────────── */

export type ShapeFrameProps = Omit<FrameProps, "line" | "radius"> & {
  /** Corner treatment: one for every corner, or one per corner. */
  corner?: CornerShape | Partial<Record<Corner, CornerShape>>;
  /** Limits a single `corner` treatment to these corners. */
  corners?: readonly Corner[];
  /** Size of the corner treatment, in pixels. */
  size?: number;
  /** Line width, in pixels. */
  line?: number;
  /** Semicircular bites out of the edges, as on a ticket. */
  punch?: Punch;
  /** Background painted inside the shape. Any CSS background works. */
  fill?: string;
};

/**
 * A frame whose outline, fill and (where supported) focus ring follow a
 * shape instead of a rectangle. It is still a `Frame`, so corner marks,
 * rules and fills compose inside it. For a shadow use a `drop-shadow`
 * filter, which follows the shape in every browser.
 */
export function ShapeFrame({
  corner = "bevel",
  corners = CORNERS,
  size = 12,
  line = 1,
  punch,
  fill,
  className,
  style,
  children,
  ...props
}: ShapeFrameProps) {
  const resolved = Object.fromEntries(
    CORNERS.map((name) => [
      name,
      typeof corner === "string"
        ? corners.includes(name)
          ? corner
          : "square"
        : (corner[name] ?? "square"),
    ]),
  ) as Record<Corner, CornerShape>;

  const paths = shapePaths(
    {
      corners: resolved,
      size,
      punch: punch && {
        sides: punch.sides ?? ["left", "right"],
        at: punch.at ?? "50%",
        radius: punch.radius ?? 8,
      },
    },
    line,
  );

  return (
    <Frame
      data-slot="shape-frame"
      data-path={paths.kind}
      className={cn("fb-shape", className)}
      line={line}
      style={
        {
          "--fb-shape-outer": paths.outer,
          "--fb-shape-ring": paths.ring,
          ...(fill !== undefined && { "--fb-shape-bg": fill }),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span aria-hidden className="fb-shape-surface" />
      <span aria-hidden className="fb-shape-stroke" />
      {children}
    </Frame>
  );
}
