import { Frame, type FrameProps } from "@/components/ui/frame";
import {
  FrameGlow,
  FrameGradient,
  type FrameGlowProps,
} from "@/components/ui/frame-effects";

export type GlowFrameProps = FrameProps &
  Pick<FrameGlowProps, "colors" | "spin" | "pulse" | "blur" | "spread">;

/**
 * A gradient border with a halo of the same colours behind it. The colours
 * come from `colors`, or from the `frame-from-*`, `frame-via-*` and
 * `frame-to-*` utilities.
 */
export function GlowFrame({
  colors,
  spin,
  pulse,
  blur,
  spread,
  children,
  ...props
}: GlowFrameProps) {
  return (
    <Frame {...props}>
      <FrameGlow
        colors={colors}
        spin={spin}
        pulse={pulse}
        blur={blur}
        spread={spread}
      />
      <FrameGradient colors={colors} spin={spin} />
      {children}
    </Frame>
  );
}
