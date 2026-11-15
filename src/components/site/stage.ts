/**
 * Classes for the surface a preview sits on. A dark stage stays dark in
 * either colour scheme, for effects that are made of light.
 */
export function stageClass(stage?: "dark") {
  return stage === "dark"
    ? "bg-neutral-950 text-neutral-100 [--background:var(--color-neutral-950)] [--foreground:var(--color-neutral-100)]"
    : "bg-foreground/[0.03]";
}
