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
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer border border-foreground/15 px-2.5 py-1 font-mono text-xs"
      >
        {open ? "Close" : "Menu"}
      </button>
      {/* Hung from the header rather than fixed: the header's backdrop
          blur makes it the containing block for fixed descendants. */}
      {open && (
        <div className="absolute inset-x-0 top-full h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-foreground/10 bg-background px-4 py-6 sm:px-6">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
