import { BeamFrame } from "@/components/beam-frame";

export default function BeamUtilities() {
  return (
    <BeamFrame
      count={2}
      duration={5}
      className="w-full max-w-xs p-6 frame-from-slate-400 frame-to-indigo-400"
    >
      <p className="font-mono text-sm">frame-from-slate-400</p>
    </BeamFrame>
  );
}
