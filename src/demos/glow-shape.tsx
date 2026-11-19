import { FrameGlow, FrameGradient } from "@/components/ui/frame-effects";
import { ShapeFrame } from "@/components/ui/shape-frame";

export default function GlowShape() {
  return (
    <ShapeFrame
      corner="bevel"
      corners={["tl", "br"]}
      size={16}
      fill="var(--card)"
      className="w-full max-w-xs p-6 frame-from-indigo-300 frame-to-violet-400"
    >
      <FrameGlow />
      <FrameGradient />
      <p className="font-mono text-sm">Gradient and glow</p>
    </ShapeFrame>
  );
}
