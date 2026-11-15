import type { CSSProperties } from "react";

import {
  len,
  vars,
  type LayerProps,
  type Length,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

/** A duration. Numbers are treated as seconds. */
export type Time = number | string;

function time(value: Time | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}s` : value;
}

/**
 * The palette custom properties for a list of colours. With no list the
 * layer keeps whatever the frame, a utility or the stylesheet gives it.
 */
function palette(colors: readonly string[] | undefined) {
  if (!colors || colors.length === 0) return {};
  const first = colors[0];
  const last = colors[colors.length - 1];
  return {
    "--fb-from": first,
    "--fb-to": last,
    "--fb-stops": colors.length > 1 ? colors.join(", ") : `${first}, ${first}`,
  } as const;
}

type PaintProps = {
  /**
   * Colour stops, in order. Without them the layer reads `--fb-from`,
   * `--fb-via` and `--fb-to`, which the `frame-from-*`, `frame-via-*` and
   * `frame-to-*` utilities set.
   */
  colors?: readonly string[];
  /** Any CSS image, in place of the gradient built from the colours. */
  gradient?: string;
  /** Direction of the gradient. Numbers are degrees. */
  angle?: number | string;
  /**
   * Turn the gradient around the frame. A number is the time for one turn,
   * in seconds.
   */
  spin?: boolean | number;
  /** Distance from the frame edge. Positive is outward, negative inward. */
  offset?: Length;
  /** Overrides the frame's radius for this layer. */
  radius?: Length;
};

function paint({ colors, gradient, angle, spin, offset, radius }: PaintProps) {
  return {
    ...palette(colors),
    "--fb-gradient": gradient,
    "--fb-gradient-angle": typeof angle === "number" ? `${angle}deg` : angle,
    "--fb-duration": typeof spin === "number" ? `${spin}s` : undefined,
    "--fb-offset": len(offset),
    "--fb-radius": len(radius),
  } as const;
}

/* ── Gradient ──────────────────────────────────────────────────────────── */

export type FrameGradientProps = LayerProps &
  PaintProps & {
    /** Line width, when different from the frame's. */
    thickness?: Length;
  };

/**
 * A gradient drawn on the frame's line. It follows the radius, and inside a
 * shape frame it follows the shape.
 */
export function FrameGradient({
  colors,
  gradient,
  angle,
  spin = false,
  offset,
  radius,
  thickness,
  className,
  style,
  ...props
}: FrameGradientProps) {
  return (
    <div
      aria-hidden
      data-slot="frame-gradient"
      data-spin={spin !== false ? "" : undefined}
      className={cn("fb-gradient", className)}
      style={vars(
        {
          ...paint({ colors, gradient, angle, spin, offset, radius }),
          "--fb-line": len(thickness),
        },
        style,
      )}
      {...props}
    />
  );
}

/* ── Glow ──────────────────────────────────────────────────────────────── */

export type FrameGlowProps = LayerProps &
  PaintProps & {
    /** Blur radius of the halo. */
    blur?: Length;
    /** Width of the band that is blurred. Wider is brighter. */
    spread?: Length;
    /** Strength of the halo, from 0 to 1. */
    opacity?: number;
    /**
     * Breathe in and out. A number is the time for one breath in, in
     * seconds.
     */
    pulse?: boolean | number;
  };

/**
 * The frame's gradient blurred into a halo around its line. It is painted
 * behind the content. Give it the same colours as a `FrameGradient`, or put
 * the palette utilities on the frame so both layers read them.
 */
export function FrameGlow({
  colors,
  gradient,
  angle,
  spin = false,
  offset,
  radius,
  blur,
  spread,
  opacity,
  pulse = false,
  className,
  style,
  ...props
}: FrameGlowProps) {
  return (
    <div
      aria-hidden
      data-slot="frame-glow"
      data-spin={spin !== false ? "" : undefined}
      data-pulse={pulse !== false ? "" : undefined}
      className={cn("fb-glow", className)}
      style={vars(
        {
          ...paint({ colors, gradient, angle, spin, offset, radius }),
          "--fb-glow-blur": len(blur),
          "--fb-glow-spread": len(spread),
          "--fb-glow-opacity": opacity?.toString(),
          "--fb-pulse-duration":
            typeof pulse === "number" ? `${pulse}s` : undefined,
        },
        style,
      )}
      {...props}
    />
  );
}

/* ── Beam ──────────────────────────────────────────────────────────────── */

export type FrameBeamProps = LayerProps & {
  /**
   * The beam's colours: the first for its head, the last for its tail.
   * Without them it reads `--fb-from` and `--fb-to`.
   */
  colors?: readonly string[];
  /** Length of the beam. */
  size?: Length;
  /** Time for one lap of the frame. Numbers are seconds. */
  duration?: Time;
  /** Number of beams, spaced evenly around the frame. */
  count?: number;
  /** Travel anticlockwise. */
  reverse?: boolean;
  /**
   * Strength, from 0 to 1, of the light the beam casts on either side of
   * the line. `false` leaves only the line itself.
   */
  bloom?: number | false;
  /** Line width, when different from the frame's. */
  thickness?: Length;
  offset?: Length;
  radius?: Length;
};

/**
 * A light that travels around the frame's line at a steady speed, whatever
 * the frame's proportions. Needs `offset-path`; without it nothing is drawn.
 */
export function FrameBeam({
  colors,
  size,
  duration,
  count = 1,
  reverse = false,
  bloom,
  thickness,
  offset,
  radius,
  className,
  style,
  ...props
}: FrameBeamProps) {
  const beams = Math.max(1, Math.floor(count));

  return (
    <div
      aria-hidden
      data-slot="frame-beam"
      data-reverse={reverse ? "" : undefined}
      className={cn("fb-beam", className)}
      style={vars(
        {
          ...palette(colors),
          "--fb-beam-size": len(size),
          "--fb-duration": time(duration),
          "--fb-beam-bloom": bloom === false ? undefined : bloom?.toString(),
          "--fb-beam-line": len(thickness),
          "--fb-offset": len(offset),
          "--fb-radius": len(radius),
        },
        style,
      )}
      {...props}
    >
      {Array.from({ length: beams }, (_, i) => {
        const phase =
          i === 0
            ? undefined
            : ({ "--fb-beam-phase": i / beams } as CSSProperties);
        return [
          bloom !== false && (
            <span key={`bloom-${i}`} className="fb-beam-bloom" style={phase} />
          ),
          <span key={`stroke-${i}`} className="fb-beam-stroke" style={phase} />,
        ];
      })}
    </div>
  );
}
