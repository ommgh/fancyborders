import { Frame, FrameBorder, FrameCorners } from "@/components/ui/frame";

export default function FrameCustomMark() {
  return (
    <Frame className="w-full max-w-xs p-6">
      <FrameBorder />
      <FrameCorners size={14} align="center">
        <svg viewBox="0 0 14 14" className="size-full fill-background">
          <path d="M7 1 13 7 7 13 1 7Z" stroke="currentColor" />
        </svg>
      </FrameCorners>
      <p className="font-mono text-sm">Diamond marks</p>
    </Frame>
  );
}
