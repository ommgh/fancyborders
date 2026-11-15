import { ShapeFrame } from "@/components/ui/shape-frame";

export default function ShapeVariants() {
  return (
    <ShapeFrame
      corner="bevel"
      size={16}
      className="w-full max-w-xs p-6 transition-colors frame-bg-sky-500/10 frame-color-sky-500/60 hover:frame-bg-sky-500/25 hover:frame-color-sky-500"
    >
      <p className="font-mono text-sm">hover:frame-color-sky-500</p>
    </ShapeFrame>
  );
}
