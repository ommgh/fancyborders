"use client";

import { Collapsible } from "@animate-ui/react/primitives/base-ui/collapsible";
import { Highlight } from "@animate-ui/react/primitives/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { openCommandMenu } from "@/components/site/command-menu";
import { CATEGORIES, GUIDES, componentHref, componentsIn } from "@/content/docs";
import { cn } from "@/lib/utils";

/*
 * Animate UI's sidebar motion on this site's own markup. Highlight finds the
 * buttons by their data-sidebar attributes and glides one shared surface
 * between them, painted with whatever background the hovered button's own
 * hover style gives it. A category's collapsible staggers its links in as it
 * opens, keyed on the data-slot names shadcn/ui's sidebar uses.
 */

const button =
  "relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2.5 text-left text-sm text-muted outline-none " +
  "hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20 " +
  "data-[active=true]:bg-foreground/[0.08] data-[active=true]:font-medium data-[active=true]:text-foreground";

/**
 * The docs navigation: the guides, then each category of components as a
 * group that folds. Used in the sidebar and in the menu on small screens.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <Highlight>
      <nav aria-label="Documentation" className="grid gap-6">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            openCommandMenu();
          }}
          className="flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-sm text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="flex-1 text-left">Search docs</span>
          <kbd className="font-mono text-[0.6875rem]">⌘K</kbd>
        </button>

        <div data-sidebar="group">
          <p data-sidebar="group-label" className="mb-1.5 px-2.5 font-mono text-[0.6875rem] text-muted">
            Get started
          </p>
          <ul data-sidebar="menu" className="grid gap-0.5">
            {GUIDES.map((link) => (
              <li key={link.href} data-sidebar="menu-item" data-slot="sidebar-menu-item" className="relative">
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  data-sidebar="menu-button"
                  data-active={pathname === link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={button}
                >
                  <span>{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-sidebar="group">
          <p data-sidebar="group-label" className="mb-1.5 px-2.5 font-mono text-[0.6875rem] text-muted">
            Components
          </p>
          <ul data-sidebar="menu" className="grid gap-0.5">
            {CATEGORIES.map((category) => {
              const docs = componentsIn(category.id);
              return (
                <Collapsible.Root
                  key={category.id}
                  defaultOpen
                  render={<li data-sidebar="menu-item" data-slot="sidebar-menu-item" className="relative" />}
                >
                  <Collapsible.Trigger data-sidebar="menu-button" className={cn(button, "group/trigger cursor-pointer")}>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="size-3 shrink-0 transition-transform duration-350 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-data-[panel-open]/trigger:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 4 4 4-4 4" />
                    </svg>
                    <span className="flex-1">{category.title}</span>
                    <span className="font-mono text-[0.6875rem] text-muted tabular-nums">{docs.length}</span>
                  </Collapsible.Trigger>
                  <Collapsible.Panel>
                    <ul
                      data-sidebar="menu-sub"
                      data-slot="sidebar-menu-sub"
                      className="mt-0.5 ml-4 grid gap-0.5 border-l border-line py-0.5 pl-2"
                    >
                      {docs.map((doc) => {
                        const href = componentHref(doc.slug);
                        const active = pathname === href;
                        return (
                          <li key={doc.slug} data-sidebar="menu-sub-item" data-slot="sidebar-menu-sub-item" className="relative">
                            <Link
                              href={href}
                              onClick={onNavigate}
                              data-sidebar="menu-sub-button"
                              data-active={active}
                              aria-current={active ? "page" : undefined}
                              className={cn(button, "h-7")}
                            >
                              <span className="truncate">{doc.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Collapsible.Panel>
                </Collapsible.Root>
              );
            })}
          </ul>
        </div>
      </nav>
    </Highlight>
  );
}
