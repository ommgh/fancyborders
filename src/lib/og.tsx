import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import type { CSSProperties, ReactNode } from "react";

import type { Category } from "@/content/docs";
import { SITE_NAME } from "@/lib/site";

/*
 * The site's social cards, drawn with next/og (Satori). They take no
 * request data, so Next renders every one at build time and serves it as a
 * static file. Satori lays out with flexbox only and needs TTF fonts; the
 * fonts in src/assets/og are the site's own, subset to Latin.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

/** The site's dark theme, in hex: Satori does not read oklch(). */
const C = {
  bg: "#111111",
  fg: "#e4e4e4",
  muted: "#929292",
  surface: "#171717",
  line: "#282828",
  mark: "#5e5e5e",
  dash: "#4a4a4a",
};

const SANS = "Instrument Sans";
const SERIF = "Instrument Serif";
const MONO = "Geist Mono";

async function fonts() {
  const file = (name: string) => readFile(path.join(process.cwd(), "src/assets/og", name));
  const [regular, semibold, serif, mono] = await Promise.all([
    file("instrument-sans-400.ttf"),
    file("instrument-sans-600.ttf"),
    file("instrument-serif-italic.ttf"),
    file("geist-mono-400.ttf"),
  ]);
  return [
    { name: SANS, data: regular, weight: 400 as const, style: "normal" as const },
    { name: SANS, data: semibold, weight: 600 as const, style: "normal" as const },
    { name: SERIF, data: serif, weight: 400 as const, style: "italic" as const },
    { name: MONO, data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

async function render(children: ReactNode) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          background: C.bg,
          color: C.fg,
          fontFamily: SANS,
        }}
      >
        {children}
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/* ── Lines and marks ───────────────────────────────────────────────────── */

type Line = { x: number } | { y: number } | { x: number; y1: number; y2: number } | { y: number; x1: number; x2: number };

/**
 * The page's rails and rules: lines across the card, and a small square
 * wherever two of them cross, as on the site.
 */
function Lines({ lines, marks }: { lines: Line[]; marks: [number, number][] }) {
  return (
    <>
      {lines.map((line, index) => {
        const style: CSSProperties =
          "x" in line
            ? { left: line.x, top: "y1" in line ? line.y1 : 0, width: 1, height: "y1" in line ? line.y2 - line.y1 : OG_SIZE.height }
            : { top: line.y, left: "x1" in line ? line.x1 : 0, height: 1, width: "x1" in line ? line.x2 - line.x1 : OG_SIZE.width };
        return <div key={index} style={{ position: "absolute", background: C.line, ...style }} />;
      })}
      {marks.map(([x, y]) => (
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x - 4,
            top: y - 4,
            width: 9,
            height: 9,
            background: C.bg,
            border: `1px solid ${C.mark}`,
          }}
        />
      ))}
    </>
  );
}

/* ── Brand ─────────────────────────────────────────────────────────────── */

function Brand({ size = 48 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 20 20" fill="none" stroke={C.fg} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 9V4.5a2 2 0 0 1 2-2H9" />
        <path d="M17.5 11v4.5a2 2 0 0 1-2 2H11" />
      </svg>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: size, lineHeight: 1, marginBottom: -size * 0.12 }}>
        {SITE_NAME}
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "7px 13px",
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        background: C.surface,
        color: C.fg,
        fontFamily: MONO,
        fontSize: 17,
      }}
    >
      {children}
    </div>
  );
}

/* ── Small drawings, one per kind of border ────────────────────────────── */

export type Visual = "bracket" | "glow" | "bevel" | "selection" | "grid";

/** The drawing that stands for each category. */
export const CATEGORY_VISUAL: Record<Category, Visual> = {
  frames: "bracket",
  structure: "grid",
  shapes: "bevel",
  lines: "selection",
  effects: "glow",
};

function Bracket({ scale = 1 }: { scale?: number }) {
  const w = 190 * scale;
  const h = 124 * scale;
  const arm = 18 * scale;
  const corner = (style: CSSProperties) => (
    <div style={{ position: "absolute", width: arm, height: arm, borderColor: C.fg, borderStyle: "solid", borderWidth: 0, ...style }} />
  );
  return (
    <div style={{ display: "flex", position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", left: 12 * scale, top: 12 * scale, right: 12 * scale, bottom: 12 * scale, border: `1.5px dashed ${C.dash}` }} />
      <div style={{ position: "absolute", left: 26 * scale, top: 26 * scale, right: 26 * scale, bottom: 26 * scale, background: C.surface, borderRadius: 4 }} />
      {corner({ left: 0, top: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5 })}
      {corner({ right: 0, top: 0, borderTopWidth: 2.5, borderRightWidth: 2.5 })}
      {corner({ right: 0, bottom: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5 })}
      {corner({ left: 0, bottom: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5 })}
    </div>
  );
}

function Glow({ scale = 1 }: { scale?: number }) {
  return (
    <div
      style={{
        display: "flex",
        padding: 2,
        borderRadius: 16 * scale,
        backgroundImage: "linear-gradient(110deg, #7e9be9, #b593dc 55%, #e4a5a4)",
        boxShadow: "0 0 36px 6px rgba(126,155,233,0.28), 0 0 70px 14px rgba(228,165,164,0.16)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 190 * scale,
          padding: `${18 * scale}px ${20 * scale}px`,
          borderRadius: 14 * scale,
          background: C.surface,
        }}
      >
        <div style={{ fontSize: 22 * scale, fontWeight: 600 }}>Pro plan</div>
        <div style={{ marginTop: 4 * scale, fontFamily: MONO, fontSize: 13 * scale, color: C.muted }}>glow</div>
      </div>
    </div>
  );
}

function Bevel({ scale = 1 }: { scale?: number }) {
  const w = 190 * scale;
  const h = 108 * scale;
  const c = 20 * scale;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="champagne" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ccac7b" />
          <stop offset="1" stopColor="#c1727c" />
        </linearGradient>
      </defs>
      <polygon
        points={`${c},1.5 ${w - 1.5},1.5 ${w - 1.5},${h - c} ${w - c},${h - 1.5} 1.5,${h - 1.5} 1.5,${c}`}
        fill={C.surface}
        stroke="url(#champagne)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Selection({ scale = 1 }: { scale?: number }) {
  const handle = (style: CSSProperties) => (
    <div style={{ position: "absolute", width: 9, height: 9, background: C.surface, border: `1.5px solid ${C.fg}`, ...style }} />
  );
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 190 * scale,
        height: 104 * scale,
        border: `1.5px dashed ${C.fg}`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: 14 * scale,
        color: C.muted,
      }}
    >
      selection
      {handle({ left: -5, top: -5 })}
      {handle({ right: -5, top: -5 })}
      {handle({ right: -5, bottom: -5 })}
      {handle({ left: -5, bottom: -5 })}
    </div>
  );
}

function Grid({ scale = 1 }: { scale?: number }) {
  const cell = 62 * scale;
  const rows = 2;
  const cols = 3;
  return (
    <div style={{ display: "flex", position: "relative", width: cell * cols, height: cell * rows, border: `1.5px solid ${C.dash}` }}>
      {[1, 2].map((i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: cell * i - 1, top: 0, bottom: 0, width: 1.5, background: C.dash }} />
      ))}
      <div style={{ position: "absolute", top: cell - 1, left: 0, right: 0, height: 1.5, background: C.dash }} />
      {[1, 2].map((i) => (
        <div
          key={`m${i}`}
          style={{ position: "absolute", left: cell * i - 7, top: cell - 7, width: 13, height: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ position: "absolute", width: 13, height: 1.5, background: C.fg }} />
          <div style={{ position: "absolute", width: 1.5, height: 13, background: C.fg }} />
        </div>
      ))}
    </div>
  );
}

function Drawing({ kind, scale }: { kind: Visual; scale?: number }) {
  switch (kind) {
    case "bracket":
      return <Bracket scale={scale} />;
    case "glow":
      return <Glow scale={scale} />;
    case "bevel":
      return <Bevel scale={scale} />;
    case "selection":
      return <Selection scale={scale} />;
    case "grid":
      return <Grid scale={scale} />;
  }
}

/* ── Cards ─────────────────────────────────────────────────────────────── */

/** The site's own card: the pitch over a row of four drawings. */
export function homeImage() {
  const cells = [48, 324, 600, 876, 1152];
  const visuals: Visual[] = ["bracket", "glow", "bevel", "selection"];
  return render(
    <>
      <Lines
        lines={[
          { y: 48 },
          { y: 330 },
          { y: 582 },
          { x: 48 },
          { x: 1152 },
          ...cells.slice(1, -1).map((x) => ({ x, y1: 330, y2: 582 })),
        ]}
        marks={[
          ...[48, 1152].flatMap((x) => [48, 330, 582].map((y) => [x, y] as [number, number])),
          ...cells.slice(1, -1).flatMap((x) => [[x, 330], [x, 582]] as [number, number][]),
        ]}
      />
      <div style={{ position: "absolute", left: 49, top: 49, width: 1103, height: 281, display: "flex", flexDirection: "column", padding: "38px 52px 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Brand />
          <div style={{ fontFamily: MONO, fontSize: 16, color: C.muted }}>fancyborders.vercel.app</div>
        </div>
        <div style={{ marginTop: "auto", fontSize: 76, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1 }}>
          Borders, but fancy.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, fontFamily: MONO, fontSize: 18, color: C.muted }}>
          Frames, outlines and effects for React + Tailwind
          <Chip>npx shadcn add</Chip>
        </div>
      </div>
      {visuals.map((kind, index) => (
        <div
          key={kind}
          style={{ position: "absolute", left: cells[index] + 1, top: 331, width: 275, height: 251, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Drawing kind={kind} scale={1.05} />
        </div>
      ))}
    </>,
  );
}

/** Trim to a length that fits three lines, at a word boundary. */
function clip(text: string, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,:;.]$/, "")}…`;
}

/**
 * A docs page's card: where it is, its title and lead, and how to install
 * it, beside the drawing for its kind of border.
 */
export function pageImage({
  eyebrow,
  title,
  description,
  footer,
  visual,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  visual: Visual;
}) {
  const split = 800;
  return render(
    <>
      <Lines
        lines={[{ y: 48 }, { y: 582 }, { x: 48 }, { x: 1152 }, { x: split, y1: 48, y2: 582 }]}
        marks={[
          [48, 48],
          [split, 48],
          [1152, 48],
          [48, 582],
          [split, 582],
          [1152, 582],
        ]}
      />
      <div style={{ position: "absolute", left: 49, top: 49, width: split - 49, height: 533, display: "flex", flexDirection: "column", padding: "40px 52px 40px" }}>
        <Brand size={38} />
        <div style={{ marginTop: "auto", fontFamily: MONO, fontSize: 18, color: C.muted }}>{eyebrow}</div>
        <div style={{ marginTop: 14, fontSize: title.length > 14 ? 64 : 76, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.4, color: C.muted }}>{clip(description)}</div>
        <div style={{ display: "flex", marginTop: 30 }}>
          <Chip>{footer}</Chip>
        </div>
      </div>
      <div style={{ position: "absolute", left: split + 1, top: 49, width: 1152 - split - 1, height: 533, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Drawing kind={visual} scale={1.35} />
      </div>
    </>,
  );
}
