import {
  Frame,
  FrameCorners,
  FrameRules,
  type FrameMark,
  type FrameProps,
  type Length,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

export type SectionRuleProps = Omit<FrameProps, "children"> & {
  /**
   * How far the line runs past each end. `true` runs it a full viewport
   * width each way, for a line that reaches the page edges; the page then
   * needs `overflow-x: clip` on an ancestor.
   */
  bleed?: boolean | Length;
  /** Mark drawn on each end of the line, or `false` for none. */
  mark?: FrameMark | false;
  /** Dash length. Setting `dash` or `gap` makes the line dashed. */
  dash?: Length;
  /** Space between dashes. */
  gap?: Length;
};

/**
 * A line between two page sections. Place it in a column that draws its own
 * side rails and its ends, and their marks, land on the intersections.
 */
export function SectionRule({
  bleed = false,
  mark = "square",
  dash,
  gap,
  className,
  ...props
}: SectionRuleProps) {
  const overshoot = bleed === true ? "100vw" : bleed === false ? 0 : bleed;

  return (
    <Frame
      role="separator"
      data-slot="section-rule"
      className={cn("h-(--fb-line)", className)}
      {...props}
    >
      <FrameRules
        sides={["top"]}
        overshoot={{ x: overshoot }}
        dash={dash}
        gap={gap}
      />
      {mark && (
        <FrameCorners
          mark={mark}
          corners={["tl", "tr"]}
          color="color-mix(in oklab, currentColor 45%, var(--fb-surface))"
        />
      )}
    </Frame>
  );
}
