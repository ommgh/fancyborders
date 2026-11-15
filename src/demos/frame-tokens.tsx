import { Frame, FrameBorder, FrameCorners } from "@/components/ui/frame";

export default function FrameTokens() {
  return (
    <Frame className="w-full max-w-xs p-6 transition-colors frame-color-sky-500/50 frame-line-2 frame-mark-sky-500 frame-radius-xl hover:frame-color-sky-500">
      <FrameBorder variant="dashed" offset={-6} radius={8} />
      <FrameCorners mark="bracket" size={20} />
      <p className="font-mono text-sm">frame-color-sky-500/50</p>
    </Frame>
  );
}
