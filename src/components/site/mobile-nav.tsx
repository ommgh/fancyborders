"use client";

import { useState } from "react";

import { SidebarNav } from "@/components/site/sidebar-nav";

/** The docs navigation as a full-screen menu, for small screens. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>
      {/* Hung from the header rather than fixed: the header's backdrop
          blur makes it the containing block for fixed descendants. */}
      {open && (
        <div className="absolute inset-x-0 top-full h-[calc(100dvh-3.5rem)] overflow-y-auto bg-background px-4 py-6 sm:px-6">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
