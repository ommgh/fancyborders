import { SectionRule } from "@/components/section-rule";
import { cn } from "@/lib/utils";

/**
 * A line across the whole window between two sections, with a mark where
 * it crosses each of the page rails. The library's own SectionRule.
 */
export function SiteRule({ className }: { className?: string }) {
  return <SectionRule bleed className={cn("site-lines shrink-0", className)} />;
}
