"use client";

import { useEffect, useRef } from "react";

import {
  len,
  vars,
  type LayerProps,
  type Length,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

/* ── Pointer tracking ──────────────────────────────────────────────────── */

/*
 * Every spotlight on the page shares one pointer listener. A move schedules
 * a single update for the next frame, which gives each layer the pointer's
 * position in its own coordinates. Layers light up together, so a row of
 * frames glows wherever the pointer is nearest.
 */
const layers = new Set<HTMLElement>();
let pointer: { x: number; y: number } | null = null;
let scheduled = 0;

function update() {
  scheduled = 0;
  for (const layer of layers) {
    if (!pointer) {
      delete layer.dataset.lit;
      continue;
    }
    const box = layer.getBoundingClientRect();
    layer.style.setProperty("--fb-x", `${pointer.x - box.left}px`);
    layer.style.setProperty("--fb-y", `${pointer.y - box.top}px`);
    layer.dataset.lit = "";
  }
}

function schedule() {
  if (!scheduled) scheduled = requestAnimationFrame(update);
}

function onMove(event: PointerEvent) {
  pointer = { x: event.clientX, y: event.clientY };
  schedule();
}

function onLeave() {
  pointer = null;
  schedule();
}

const SCROLL = { passive: true, capture: true } as const;

function track(layer: HTMLElement) {
  if (layers.size === 0) {
    window.addEventListener("pointermove", onMove, { passive: true });
    // Scrolling moves the frames under a pointer that is standing still.
    window.addEventListener("scroll", schedule, SCROLL);
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  layers.add(layer);
  schedule();

  return () => {
    layers.delete(layer);
    if (layers.size > 0) return;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", schedule, SCROLL);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    cancelAnimationFrame(scheduled);
    scheduled = 0;
  };
}

/* ── Component ─────────────────────────────────────────────────────────── */

export type FrameSpotlightProps = LayerProps & {
  /**
   * Colour of the light, or two colours for its centre and its edge.
   * Defaults to the text colour, so it suits light and dark surfaces.
   */
  colors?: readonly string[];
  /** Radius of the light. */
  size?: Length;
  /**
   * Also wash the frame's surface with the light. A number is the wash's
   * strength, from 0 to 1.
   */
  wash?: boolean | number;
  /** Line width, when different from the frame's. */
  thickness?: Length;
  offset?: Length;
  radius?: Length;
};

/**
 * A light on the frame's line that follows the pointer. Put it over a faint
 * `FrameBorder` so the frame keeps an edge where the light does not reach.
 */
export function FrameSpotlight({
  colors,
  size,
  wash = false,
  thickness,
  offset,
  radius,
  className,
  style,
  ...props
}: FrameSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) return track(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-slot="frame-spotlight"
      data-wash={wash !== false ? "" : undefined}
      className={cn("fb-spotlight", className)}
      style={vars(
        {
          "--fb-from": colors?.[0],
          "--fb-to": colors?.[colors.length - 1],
          "--fb-spot-size": len(size),
          "--fb-spot-wash": typeof wash === "number" ? `${wash}` : undefined,
          "--fb-line": len(thickness),
          "--fb-offset": len(offset),
          "--fb-radius": len(radius),
        },
        style,
      )}
      {...props}
    />
  );
}
