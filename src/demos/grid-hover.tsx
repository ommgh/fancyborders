import { SectionGrid } from "@/components/ui/section-grid";

const LINKS = ["Docs", "Components", "Theming", "GitHub"];

export default function GridHover() {
  return (
    <SectionGrid outline className="w-full max-w-md section-cols-2 sm:section-cols-4">
      {LINKS.map((name) => (
        <a
          key={name}
          href="#"
          className="px-4 py-6 text-center font-mono text-xs transition-colors hover:bg-foreground/5"
        >
          {name} →
        </a>
      ))}
    </SectionGrid>
  );
}
