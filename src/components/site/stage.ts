/**
 * Classes for the surface a preview sits on. A dark stage stays dark in
 * either colour scheme, for effects that are made of light.
 */
export function stageClass(stage?: "dark") {
  return stage === "dark"
    ? "bg-(--stage-dark) text-[oklch(0.92_0_0)] [--background:var(--stage-dark)] [--foreground:oklch(0.92_0_0)]"
    : "bg-background";
}
