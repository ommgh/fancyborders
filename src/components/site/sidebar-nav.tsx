"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAV } from "@/content/docs";
import { cn } from "@/lib/utils";

/**
 * The docs navigation: every page, grouped, with a filter. Used in the
 * sidebar and in the menu on small screens.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const wanted = query.trim().toLowerCase();

  const groups = NAV.map((group) => ({
    ...group,
    links: group.links.filter((link) =>
      link.title.toLowerCase().includes(wanted),
    ),
  })).filter((group) => group.links.length > 0);

  return (
    <nav aria-label="Documentation">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter pages"
        aria-label="Filter pages"
        className="mb-6 w-full border border-foreground/15 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
      />
      {groups.length === 0 && (
        <p className="text-sm text-foreground/50">Nothing matches.</p>
      )}
      <div className="grid gap-7">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 font-mono text-xs text-foreground/50">
              {group.title}
            </p>
            <ul className="grid border-l border-foreground/10">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "-ml-px block border-l py-1 pl-4 text-sm transition-colors",
                        active
                          ? "border-foreground font-medium text-foreground"
                          : "border-transparent text-foreground/60 hover:border-foreground/30 hover:text-foreground",
                      )}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
