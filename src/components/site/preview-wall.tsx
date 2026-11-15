import { ComponentTile } from "@/components/site/component-tile";
import { COMPONENTS } from "@/content/docs";
import { cn } from "@/lib/utils";

/*
 * Mix the categories up so neighbouring tiles differ, then deal them into
 * two columns.
 */
const ORDER = [
  "bracket-frame",
  "glow",
  "shape-frame",
  "beam",
  "crosshair",
  "liquid-metal",
  "ticket-frame",
  "spotlight",
  "marching-ants",
  "gradient",
  "blueprint",
  "pulse",
  "hatch-divider",
  "border-styles",
  "frame",
  "dash-patterns",
];

const TILES = ORDER.map((slug) => COMPONENTS.find((doc) => doc.slug === slug)!);

const COLUMNS = [
  TILES.filter((_, index) => index % 2 === 0),
  TILES.filter((_, index) => index % 2 === 1),
];

/**
 * The landing page's wall: every component running live, drifting past in
 * two columns. Each column is listed twice so the drift can loop; the
 * repeat is hidden from assistive technology and the tab order.
 */
export function PreviewWall({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "site-wall grid gap-4 overflow-hidden sm:grid-cols-2",
        "[mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      {COLUMNS.map((column, index) => (
        <div
          key={index}
          data-reverse={index === 1 ? "" : undefined}
          style={{ "--wall-time": index === 1 ? "95s" : "80s" } as React.CSSProperties}
          className={cn(
            "site-wall-column flex flex-col gap-4 self-start pb-4",
            index === 1 && "hidden sm:flex",
          )}
        >
          {[false, true].flatMap((repeat) =>
            column.map((doc) => (
              <ComponentTile
                key={`${doc.slug}-${repeat}`}
                doc={doc}
                compact
                inert={repeat}
              />
            )),
          )}
        </div>
      ))}
    </div>
  );
}
