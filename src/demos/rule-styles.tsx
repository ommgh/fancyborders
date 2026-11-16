import { PageRails } from "@/components/page-rails";
import { SectionRule } from "@/components/section-rule";

export default function RuleStyles() {
  return (
    <div className="w-full overflow-x-clip">
      <PageRails className="mx-auto w-full max-w-xs">
        <p className="p-5 font-mono text-sm">Plus marks</p>
        <SectionRule bleed={32} mark="plus" />
        <p className="p-5 font-mono text-sm">Dashed, no marks</p>
        <SectionRule bleed={32} mark={false} dash={4} gap={4} />
        <p className="p-5 font-mono text-sm">Thicker, in colour</p>
        <SectionRule bleed className="frame-line-2 frame-color-sky-500/60" />
        <p className="p-5 font-mono text-sm">To the page edges</p>
      </PageRails>
    </div>
  );
}
