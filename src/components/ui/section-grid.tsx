import { Frame, len, vars, type FrameProps, type Length } from "@/components/ui/frame";
import { cn } from "@/lib/utils";

export type SectionGridProps = FrameProps & {
  /** Line style of the lines between cells, and of the outline. */
  variant?: "solid" | "dashed" | "dotted";
  /** Mark drawn on every crossing of two lines, or `false` for none. */
  mark?: "plus" | "square" | "dot" | false;
  /** Width and height of each mark. */
  markSize?: Length;
  /** Draw a border around the whole grid as well. */
  outline?: boolean;
};

/**
 * A grid whose cells share one line between them. Every direct child is a
 * cell. Set the number of columns with a `section-cols-*` utility, which
 * takes variants: `section-cols-1 sm:section-cols-3`.
 *
 * Only the lines between cells are drawn, so the grid sits flush inside
 * page rails or a frame of your own. Pass `outline` for a border around it.
 */
export function SectionGrid({
  variant,
  mark = false,
  markSize,
  outline = false,
  className,
  style,
  ...props
}: SectionGridProps) {
  return (
    <Frame
      data-slot="section-grid"
      data-mark={mark || undefined}
      data-outline={outline ? "" : undefined}
      className={cn("fb-grid", className)}
      style={vars(
        {
          "--fb-border-style": variant,
          "--fb-mark-size": len(markSize),
        },
        style,
      )}
      {...props}
    />
  );
}
