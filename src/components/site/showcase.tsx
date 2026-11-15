import type { ReactNode } from "react";

import { CopyCommand } from "@/components/site/copy-command";
import { installCommand } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 px-6 py-16 sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-prose text-foreground/60">{lead}</p>
      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export function Card({
  title,
  description,
  item,
  recipe = false,
  stage = "page",
  className,
  children,
}: {
  title: string;
  description: ReactNode;
  /** Registry item the install command adds. */
  item: string;
  /** True when the preview is a composition rather than its own item. */
  recipe?: boolean;
  /**
   * Surface behind the preview. `dark` is a dark stage whatever the page's
   * colour scheme, for effects that are made of light.
   */
  stage?: "page" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className="flex min-w-0 flex-col">
      <div
        className={cn(
          "grid min-h-60 flex-1 place-items-center p-8",
          stage === "dark"
            ? "bg-neutral-950 text-neutral-100 [--background:var(--color-neutral-950)]"
            : "bg-foreground/[0.03]",
          className,
        )}
      >
        {children}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-medium">{title}</h3>
        {recipe && (
          <span className="font-mono text-xs text-foreground/50">recipe</span>
        )}
      </div>
      <p className="mt-1 mb-3 text-sm text-foreground/60">{description}</p>
      <CopyCommand command={installCommand(item)} />
    </article>
  );
}
