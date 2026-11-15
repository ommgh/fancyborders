import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A CSS length. Numbers are treated as pixels. */
export type Length = number | string;
export type Corner = "tl" | "tr" | "br" | "bl";
export type Side = "top" | "right" | "bottom" | "left";

const CORNERS: readonly Corner[] = ["tl", "tr", "br", "bl"];
const SIDES: readonly Side[] = ["top", "right", "bottom", "left"];

/** A length prop as CSS. Shared with the other frame layers. */
export function len(value: Length | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Builds an inline style from custom properties, skipping the unset ones so
 * the defaults in frame.css (or a utility class) still apply.
 */
export function vars(
  properties: Record<`--${string}`, string | undefined>,
  style?: CSSProperties,
): CSSProperties {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(properties)) {
    if (value !== undefined) out[name] = value;
  }
  return { ...out, ...style };
}

/** Props every decoration layer accepts. */
export type LayerProps = Omit<ComponentProps<"div">, "children" | "color">;

/* ── Frame ─────────────────────────────────────────────────────────────── */

export type FrameProps = Omit<ComponentProps<"div">, "color"> & {
  /** Corner radius shared by the frame and its layers. */
  radius?: Length;
  /** Line width shared by borders, rules and marks. */
  line?: Length;
  /** Line colour for borders, rules and fills. */
  color?: string;
};

/**
 * The enclosure. Put decoration layers and content inside it, in any order:
 * layers are absolutely positioned and never take part in layout.
 */
export function Frame({
  radius,
  line,
  color,
  className,
  style,
  ...props
}: FrameProps) {
  return (
    <div
      data-slot="frame"
      className={cn("fb-frame", className)}
      style={vars(
        {
          "--fb-radius": len(radius),
          "--fb-line": len(line),
          "--fb-line-color": color,
        },
        style,
      )}
      {...props}
    />
  );
}

/* ── Border ────────────────────────────────────────────────────────────── */

export type FrameBorderProps = LayerProps & {
  variant?: "solid" | "dashed" | "dotted" | "double";
  /** Distance from the frame edge. Positive is outward, negative inward. */
  offset?: Length;
  /** Overrides the frame's radius for this layer. */
  radius?: Length;
  color?: string;
};

/** A real CSS border, so it follows the radius. */
export function FrameBorder({
  variant,
  offset,
  radius,
  color,
  className,
  style,
  ...props
}: FrameBorderProps) {
  return (
    <div
      aria-hidden
      data-slot="frame-border"
      className={cn("fb-border", className)}
      style={vars(
        {
          "--fb-border-style": variant,
          "--fb-offset": len(offset),
          "--fb-border-radius": len(radius),
          "--fb-line-color": color,
        },
        style,
      )}
      {...props}
    />
  );
}

/* ── Rules ─────────────────────────────────────────────────────────────── */

export type FrameRulesProps = LayerProps & {
  /** Which sides get a line. Defaults to all four. */
  sides?: readonly Side[];
  /**
   * How far the lines run past the corners. `x` extends the horizontal
   * lines, `y` the vertical ones.
   */
  overshoot?: Length | { x?: Length; y?: Length };
  /** Dash length. Setting `dash` or `gap` makes the lines dashed. */
  dash?: Length;
  /** Space between dashes. */
  gap?: Length;
  /**
   * Marching ants: the dashes travel clockwise around the frame. A number
   * is the time, in seconds, a dash takes to reach the next one's place.
   */
  march?: boolean | number;
  offset?: Length;
  color?: string;
};

/**
 * Four independent straight lines. Unlike a border they can overshoot the
 * corners, be switched off per side, and take any dash pattern. They ignore
 * the radius.
 */
export function FrameRules({
  sides = SIDES,
  overshoot,
  dash,
  gap,
  march = false,
  offset,
  color,
  className,
  style,
  ...props
}: FrameRulesProps) {
  const split = typeof overshoot === "object";
  const hidden = (side: Side) => (sides.includes(side) ? undefined : "0px");
  const marching = march !== false;
  const dashed = marching || dash !== undefined || gap !== undefined;

  return (
    <div
      aria-hidden
      data-slot="frame-rules"
      data-dashed={dashed ? "" : undefined}
      data-march={marching ? "" : undefined}
      className={cn("fb-rules", className)}
      style={vars(
        {
          "--fb-overshoot": split ? undefined : len(overshoot),
          "--fb-overshoot-x": split ? len(overshoot.x) : undefined,
          "--fb-overshoot-y": split ? len(overshoot.y) : undefined,
          "--fb-dash": len(dash),
          "--fb-gap": len(gap),
          "--fb-march-duration":
            typeof march === "number" ? `${march}s` : undefined,
          "--fb-offset": len(offset),
          "--fb-line-color": color,
          "--fb-rule-top": hidden("top"),
          "--fb-rule-right": hidden("right"),
          "--fb-rule-bottom": hidden("bottom"),
          "--fb-rule-left": hidden("left"),
        },
        style,
      )}
      {...props}
    />
  );
}

/* ── Corners ───────────────────────────────────────────────────────────── */

export type FrameMark = "bracket" | "square" | "plus" | "dot";

export type FrameCornersProps = LayerProps & {
  /** Built-in mark. Ignored when `children` is given. */
  mark?: FrameMark;
  /** A custom mark, drawn for the top-left corner and repeated on the rest. */
  children?: ReactNode;
  /** Which corners get a mark. Defaults to all four. */
  corners?: readonly Corner[];
  /** Width and height of each mark. */
  size?: Length;
  /** Line width of the mark, when different from the frame's. */
  thickness?: Length;
  /**
   * `inside` tucks the mark into the corner, `center` centres it on the
   * frame's line. Brackets and custom marks default to `inside`.
   */
  align?: "inside" | "center";
  /** Rotate each mark to face its corner. Turn off for upright content. */
  rotate?: boolean;
  offset?: Length;
  radius?: Length;
  color?: string;
};

/** A mark at each corner. */
export function FrameCorners({
  mark = "bracket",
  children,
  corners = CORNERS,
  size,
  thickness,
  align,
  rotate = true,
  offset,
  radius,
  color,
  className,
  style,
  ...props
}: FrameCornersProps) {
  const custom = children !== undefined;
  const resolvedAlign =
    align ?? (custom || mark === "bracket" ? "inside" : "center");

  return (
    <div
      aria-hidden
      data-slot="frame-corners"
      data-mark={custom ? "custom" : mark}
      data-align={resolvedAlign}
      data-rotate={rotate ? undefined : "false"}
      className={cn("fb-corners", className)}
      style={vars(
        {
          "--fb-mark-size": len(size),
          "--fb-mark-line": len(thickness),
          "--fb-mark-color": color,
          "--fb-offset": len(offset),
          "--fb-mark-radius": len(radius),
        },
        style,
      )}
      {...props}
    >
      {corners.map((corner) => (
        <span key={corner} className="fb-mark" data-corner={corner}>
          {children}
        </span>
      ))}
    </div>
  );
}

/* ── Fill ──────────────────────────────────────────────────────────────── */

export type FrameFillProps = LayerProps & {
  pattern?: "hatch" | "cross" | "dots" | "grid";
  /** Spacing between lines or dots. */
  size?: Length;
  /** Line width, or dot radius. */
  thickness?: Length;
  /** Direction of the hatch lines' gradient, e.g. `45deg`. */
  angle?: string;
  /** Distance kept clear from the frame edge. */
  inset?: Length;
  color?: string;
};

/** A pattern painted behind the frame's content. */
export function FrameFill({
  pattern = "hatch",
  size,
  thickness,
  angle,
  inset,
  color,
  className,
  style,
  ...props
}: FrameFillProps) {
  return (
    <div
      aria-hidden
      data-slot="frame-fill"
      data-pattern={pattern}
      className={cn("fb-fill", className)}
      style={vars(
        {
          "--fb-fill-size": len(size),
          "--fb-fill-line": len(thickness),
          "--fb-fill-angle": angle,
          "--fb-fill-inset": len(inset),
          "--fb-fill-color": color,
        },
        style,
      )}
      {...props}
    />
  );
}
