"use client";

import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Light, dark or the system's, kept as a class on <html>. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

/**
 * Switches between light and dark. Both icons are rendered and CSS shows
 * the right one, so the server and the first client render agree.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Switch colour theme"
      title="Switch colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "grid size-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
        className,
      )}
    >
      {/* Sun, for switching to light. */}
      <svg viewBox="0 0 24 24" aria-hidden className="hidden size-4 dark:block" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon, for switching to dark. */}
      <svg viewBox="0 0 24 24" aria-hidden className="size-4 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
    </button>
  );
}
