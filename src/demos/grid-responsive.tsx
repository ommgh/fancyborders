import { SectionGrid } from "@/components/ui/section-grid";

const STATS = [
  ["1.2M", "requests"],
  ["48ms", "median response"],
  ["99.98%", "uptime"],
  ["312", "deploys"],
  ["0", "incidents"],
];

export default function GridResponsive() {
  return (
    <SectionGrid
      outline
      mark="square"
      className="w-full max-w-lg section-cols-1 sm:section-cols-2 lg:section-cols-3"
    >
      {STATS.map(([value, label]) => (
        <div key={label} className="p-5">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 font-mono text-xs text-foreground/60">{label}</p>
        </div>
      ))}
    </SectionGrid>
  );
}
