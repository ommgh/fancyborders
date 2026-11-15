import { FrameBeam } from "@/components/ui/frame-effects";
import { ShapeFrame } from "@/components/ui/shape-frame";

export default function BeamShape() {
  return (
    <ShapeFrame corner="notch" size={10} className="w-full max-w-xs p-6">
      <FrameBeam />
      <p className="font-mono text-sm">Around a notched frame</p>
    </ShapeFrame>
  );
}
