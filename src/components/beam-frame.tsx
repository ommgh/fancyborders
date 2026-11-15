import { Frame, FrameBorder, type FrameProps } from "@/components/ui/frame";
import { FrameBeam, type FrameBeamProps } from "@/components/ui/frame-effects";

export type BeamFrameProps = FrameProps &
  Pick<FrameBeamProps, "colors" | "size" | "duration" | "count" | "reverse">;

/**
 * A quiet border with a light travelling around it. The beam's colours come
 * from `colors`, or from the `frame-from-*` and `frame-to-*` utilities.
 */
export function BeamFrame({
  colors,
  size,
  duration,
  count,
  reverse,
  children,
  ...props
}: BeamFrameProps) {
  return (
    <Frame {...props}>
      <FrameBorder />
      <FrameBeam
        colors={colors}
        size={size}
        duration={duration}
        count={count}
        reverse={reverse}
      />
      {children}
    </Frame>
  );
}
