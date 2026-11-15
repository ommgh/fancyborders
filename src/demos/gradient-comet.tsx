import { Frame, FrameBorder, FrameCorners } from "@/components/ui/frame";
import { FrameGradient } from "@/components/ui/frame-effects";

export default function GradientComet() {
  return (
    <Frame
      line={2}
      className="w-full max-w-xs p-6 frame-from-emerald-400 frame-via-emerald-400/0 frame-to-emerald-400/0"
    >
      <FrameBorder className="opacity-40" />
      <FrameGradient spin={3} />
      <FrameCorners mark="square" />
      <p className="font-mono text-sm">spin</p>
    </Frame>
  );
}
