import { HatchDivider } from "@/components/hatch-divider";
import { Frame, FrameRules } from "@/components/ui/frame";

export default function DividerRails() {
  return (
    <div className="w-full overflow-x-clip">
      <Frame className="mx-auto w-full max-w-xs">
        <FrameRules sides={["left", "right"]} />
        <p className="p-5 font-mono text-sm">Section one</p>
        <HatchDivider bleed={32} />
        <p className="p-5 font-mono text-sm">Section two</p>
        <HatchDivider bleed={32} mark="plus" className="h-3" />
        <p className="p-5 font-mono text-sm">Section three</p>
      </Frame>
    </div>
  );
}
