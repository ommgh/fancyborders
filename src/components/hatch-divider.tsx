import {
  Frame,
  FrameCorners,
  FrameFill,
  FrameRules,
  type FrameMark,
  type FrameProps,
  type Length,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

export type HatchDividerProps = Omit<FrameProps, "children"> & {
  /**
   * How far the top and bottom lines run past the band. `true` runs them a
   * full viewport width each way, for lines that reach the page edges; the
   * page then needs `overflow-x: clip` on an ancestor.
   */
  bleed?: boolean | Length;
  /** Mark drawn where the band's lines meet its sides, or `false` for none. */
  mark?: FrameMark | false;
};

/**
 * A hatched band between two lines, for separating page sections. Place it
 * in a column that draws its own side rails and the marks land on the
 * intersections.
 */
export function HatchDivider({
  bleed = false,
  mark = "square",
  className,
  ...props
}: HatchDividerProps) {
  const overshoot = bleed === true ? "100vw" : bleed === false ? 0 : bleed;

  return (
    <Frame
      role="separator"
      className={cn("h-5", className)}
      {...props}
    >
      <FrameFill pattern="hatch" />
      <FrameRules sides={["top", "bottom"]} overshoot={{ x: overshoot }} />
      {mark && (
        <FrameCorners
          mark={mark}
          color="color-mix(in oklab, currentColor 45%, var(--fb-surface))"
        />
      )}
    </Frame>
  );
}
