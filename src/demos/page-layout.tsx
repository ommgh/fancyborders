import { PageRails } from "@/components/page-rails";
import { SectionRule } from "@/components/section-rule";
import { SectionGrid } from "@/components/ui/section-grid";

const FEATURES = [
  ["Rails", "Two lines the page hangs from."],
  ["Rules", "Lines that cross the rails."],
  ["Grids", "Cells that share their lines."],
  ["Marks", "One on every crossing."],
];

export default function PageLayout() {
  return (
    <div className="w-full overflow-x-clip">
      <PageRails bleed={32} className="mx-auto w-full max-w-md">
        <header className="p-6">
          <p className="text-lg font-semibold tracking-tight">Acme</p>
          <p className="mt-1 text-sm text-foreground/60">
            A page laid out on its own lines.
          </p>
        </header>
        <SectionRule bleed={32} />
        <SectionGrid mark="plus" className="section-cols-2">
          {FEATURES.map(([name, text]) => (
            <div key={name} className="p-4">
              <p className="font-mono text-xs">{name}</p>
              <p className="mt-1 text-xs text-foreground/60">{text}</p>
            </div>
          ))}
        </SectionGrid>
        <SectionRule bleed={32} />
        <footer className="p-6 font-mono text-xs text-foreground/50">
          Free and open source
        </footer>
      </PageRails>
    </div>
  );
}
