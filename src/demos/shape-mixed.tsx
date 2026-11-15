import { ShapeFrame } from "@/components/ui/shape-frame";

export default function ShapeMixed() {
  return (
    <ShapeFrame
      corner={{ tl: "round", tr: "bevel", br: "scoop", bl: "notch" }}
      size={14}
      fill="var(--background)"
      className="w-full max-w-xs p-6 drop-shadow-lg"
    >
      <p className="font-mono text-sm">One of each</p>
    </ShapeFrame>
  );
}
