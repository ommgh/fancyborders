import { Frame } from "@/components/ui/frame";
import { FrameGradient } from "@/components/ui/frame-effects";

export default function GradientUtilities() {
  return (
    <Frame
      radius={10}
      line={2}
      className="w-full max-w-xs p-6 frame-from-emerald-300 frame-via-sky-400 frame-to-violet-500"
    >
      <FrameGradient angle={90} />
      <p className="font-mono text-sm">frame-via-sky-400</p>
    </Frame>
  );
}
