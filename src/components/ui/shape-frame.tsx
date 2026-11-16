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
export function shapePaths(options: ShapeOptions, line: number): ShapePath {
  const outer = outline(options, 0);
  const inner = outline(options, line);
  const curved = [...outer, ...inner].some((point) => point.arc);

  if (!curved) {
    const list = (points: Point[]) =>
      [...points, points[0]].map(({ x, y }) => `${x} ${y}`).join(", ");
    return {
      kind: "polygon",
      outer: `polygon(${list(outer)})`,
      // One polygon that walks the outline, then the inset outline. With
      // the even-odd rule only the band between them is kept.
      ring: `polygon(evenodd, ${list(outer)}, ${list(inner)})`,
    };
  }

  const subpath = (points: Point[]) =>
    `${points[0].x} ${points[0].y}, ${commands(points)}, close`;
  return {
    kind: "shape",
    outer: `shape(from ${subpath(outer)})`,
    ring: `shape(evenodd from ${subpath(outer)}, move to ${subpath(inner)})`,
  };
}

/* ── Free-form outlines ────────────────────────────────────────────────── */

/** The CSS a shape frame draws: its outline, and the ring of its line. */
export type ShapePath = {
  kind: "polygon" | "shape";
  outer: string;
  ring: string;
};

/**
 * A point of a free-form outline: pixel offsets from an anchor, which is a
 * percentage of the box. `{ x: -8, y: 0, ax: 100 }` is 8 pixels in from the
 * top-right corner. `r` rounds the corner at this point.
 */
export type OutlinePoint = {
  x: number;
  y: number;
  ax?: number;
  ay?: number;
  r?: number;
};

/*
 * Anchored points are measured on a box far larger than any feature, so
 * the geometry around one anchor never meets the geometry around another.
 * The result is then written back as offsets from the same anchors, which
 * holds for a box of any size as long as the stretches between different
 * anchors are straight horizontal or vertical lines.
 */
const NOMINAL = 100000;

type XY = { x: number; y: number };

const resolve = (point: OutlinePoint): XY => ({
  x: ((point.ax ?? 0) / 100) * NOMINAL + point.x,
  y: ((point.ay ?? 0) / 100) * NOMINAL + point.y,
});

const anchored = (point: OutlinePoint, xy: XY): OutlinePoint => ({
  ax: point.ax,
  ay: point.ay,
  x: xy.x - ((point.ax ?? 0) / 100) * NOMINAL,
  y: xy.y - ((point.ay ?? 0) / 100) * NOMINAL,
});

function unit(from: XY, to: XY) {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length, length };
}

/**
 * Replaces each point that has an `r` with an arc of that radius, drawn as
 * short straight lines so the outline stays a polygon.
 */
export function roundCorners(points: OutlinePoint[]): OutlinePoint[] {
  const xy = points.map(resolve);
  const count = points.length;

  return points.flatMap((point, i) => {
    const { r, ...plain } = point;
    if (!r || r <= 0) return [plain];

    const here = xy[i];
    const before = unit(here, xy[(i - 1 + count) % count]);
    const after = unit(here, xy[(i + 1) % count]);
    const angle = Math.acos(
      Math.max(-1, Math.min(1, before.x * after.x + before.y * after.y)),
    );
    if (angle < 0.01 || angle > Math.PI - 0.01) return [plain];

    // Distance from the corner to where the arc touches each edge, kept to
    // half of the shorter edge so neighbouring arcs cannot overlap.
    const tan = Math.tan(angle / 2);
    const reach = Math.min(r / tan, before.length / 2, after.length / 2);
    const radius = reach * tan;
    const bisector = unit({ x: 0, y: 0 }, { x: before.x + after.x, y: before.y + after.y });
    const centre = {
      x: here.x + bisector.x * (radius / Math.sin(angle / 2)),
      y: here.y + bisector.y * (radius / Math.sin(angle / 2)),
    };
    const start = Math.atan2(
      here.y + before.y * reach - centre.y,
      here.x + before.x * reach - centre.x,
    );
    const end = Math.atan2(
      here.y + after.y * reach - centre.y,
      here.x + after.x * reach - centre.x,
    );
    let sweep = end - start;
    if (sweep > Math.PI) sweep -= 2 * Math.PI;
    if (sweep < -Math.PI) sweep += 2 * Math.PI;

    const steps = Math.max(2, Math.min(24, Math.ceil((Math.abs(sweep) * radius) / 1.5)));
    return Array.from({ length: steps + 1 }, (_, step) => {
      const a = start + (sweep * step) / steps;
      return anchored(point, {
        x: centre.x + Math.cos(a) * radius,
        y: centre.y + Math.sin(a) * radius,
      });
    });
  });
}

/**
 * Builds the paths for a free-form outline, given as the points of a
 * polygon in either direction. Pass the result to `ShapeFrame` as `path`.
 */
export function polygonPaths(points: OutlinePoint[], line: number): ShapePath {
  // Drop repeated points, which have no direction to offset along.
  let outer = points.filter((point, i) => {
    const a = resolve(point);
    const b = resolve(points[(i + 1) % points.length]);
    return Math.hypot(a.x - b.x, a.y - b.y) > 1e-6;
  });

  // Walk clockwise, so that inward is always to the right.
  const area = outer.map(resolve).reduce((sum, a, i, all) => {
    const b = all[(i + 1) % all.length];
    return sum + a.x * b.y - b.x * a.y;
  }, 0);
  if (area < 0) outer = [...outer].reverse();

  const xy = outer.map(resolve);
  const count = xy.length;
  const inner = outer.flatMap((point, i) => {
    const a = unit(xy[(i - 1 + count) % count], xy[i]);
    const b = unit(xy[i], xy[(i + 1) % count]);
    const cos = a.x * b.x + a.y * b.y;
    const move = (x: number, y: number) =>
      anchored(point, { x: xy[i].x + x * line, y: xy[i].y + y * line });

    // Where the outline turns sharply away from the inside, a mitre would
    // be a spike. Go round the point instead, as a round line join does.
    if (a.x * b.y - a.y * b.x < 0 && cos < 0.5) {
      const middle = unit({ x: 0, y: 0 }, { x: -a.y - b.y, y: a.x + b.x });
      return [move(-a.y, a.x), move(middle.x, middle.y), move(-b.y, b.x)];
    }
    // Each edge's inward normal. Their sum, scaled, is the mitre.
    const scale = 1 / Math.max(0.1, 1 + cos);
    return [move((-a.y - b.y) * scale, (a.x + b.x) * scale)];
  });

  const list = (path: OutlinePoint[]) =>
    [...path, path[0]]
      .map(
        ({ x, y, ax = 0, ay = 0 }) => `${at(`${ax}%`, x)} ${at(`${ay}%`, y)}`,
      )
      .join(", ");

  return {
    kind: "polygon",
    outer: `polygon(${list(outer)})`,
    ring: `polygon(evenodd, ${list(outer)}, ${list(inner)})`,
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
  /**
   * A ready-made outline, from `polygonPaths`, in place of the corners and
   * the punch. The line width it was built with should match `line`.
   */
  path?: ShapePath;
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
  path,
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

  const paths =
    path ??
    shapePaths(
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
