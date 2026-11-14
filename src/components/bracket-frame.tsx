import {
  Frame,
  FrameBorder,
  FrameCorners,
  type FrameProps,
  type Length,
} from "@/components/ui/frame";

export type BracketFrameProps = FrameProps & {
  /** Length of each bracket arm. */
  bracket?: Length;
  /** Line width of the brackets. */
  thickness?: Length;
  /** Space between the brackets and the dashed border inside them. */
  gap?: number;
};

/**
 * Corner brackets around a dashed border. The brackets sit on the box edge
 * and the border is drawn `gap` pixels inside it, so give the frame at least
 * that much padding.
 */
export function BracketFrame({
  bracket = 14,
  thickness = 2,
  gap = 6,
  children,
  ...props
}: BracketFrameProps) {
  return (
    <Frame {...props}>
      <FrameBorder
        variant="dashed"
        offset={-gap}
        radius={`max(0px, var(--fb-radius) - ${gap}px)`}
      />
      <FrameCorners mark="bracket" size={bracket} thickness={thickness} />
      {children}
    </Frame>
  );
}
