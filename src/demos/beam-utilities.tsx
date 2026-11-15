import { BeamFrame } from "@/components/beam-frame";

export default function BeamUtilities() {
  return (
    <BeamFrame
      count={2}
      duration={5}
      className="w-full max-w-xs p-6 frame-from-amber-300 frame-to-rose-500"
    >
      <p className="font-mono text-sm">frame-from-amber-300</p>
    </BeamFrame>
  );
}
