import { EdgeFrame } from "@/components/edge-frame";
import { FrameGlow, FrameGradient } from "@/components/ui/frame-effects";

export default function EdgeEffects() {
  return (
    <EdgeFrame
      edge="scallop"
      sides={["top", "right", "bottom", "left"]}
      size={18}
      line={2}
      fill="var(--card)"
      className="w-full max-w-xs p-8 frame-from-amber-300 frame-to-rose-400"
    >
      <FrameGlow />
      <FrameGradient spin />
      <p className="font-medium">Limited edition</p>
      <p className="mt-1 text-sm text-muted">A gradient on a scalloped edge.</p>
    </EdgeFrame>
  );
}
