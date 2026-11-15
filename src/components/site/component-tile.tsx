import Link from "next/link";

import { PlaygroundPreview } from "@/components/site/playground";
import { stageClass } from "@/components/site/stage";
import { componentHref, type ComponentDoc } from "@/content/docs";
import { cn } from "@/lib/utils";

/**
 * A component as a tile: its live preview, with its name underneath. The
 * whole tile is a link to the component's page.
 */
export function ComponentTile({
  doc,
  compact = false,
  inert = false,
}: {
  doc: ComponentDoc;
  /** A smaller tile with the name as a label, for the landing page wall. */
  compact?: boolean;
  /** A decorative repeat that should not be focusable. */
  inert?: boolean;
}) {
  return (
    <Link
      href={componentHref(doc.slug)}
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
      className="group flex flex-col border border-foreground/10 transition-colors hover:border-foreground/30"
    >
      {compact && (
        <div className="border-b border-foreground/10 px-3 py-1.5 font-mono text-xs text-foreground/50 transition-colors group-hover:text-foreground">
          {doc.slug}
        </div>
      )}
      <div
        className={cn(
          "pointer-events-none grid flex-1 place-items-center overflow-hidden",
          compact ? "min-h-44 p-6" : "min-h-52 p-6",
          stageClass(doc.stage),
        )}
      >
        <PlaygroundPreview slug={doc.slug} />
      </div>
      {!compact && (
        <div className="border-t border-foreground/10 px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <div className="font-medium">{doc.title}</div>
            {doc.recipe && (
              <div className="font-mono text-xs text-foreground/50">recipe</div>
            )}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-foreground/60">
            {doc.description}
          </div>
        </div>
      )}
    </Link>
  );
}
