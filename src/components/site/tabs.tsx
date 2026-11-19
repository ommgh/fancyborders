"use client";

import { Children, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A row of tab buttons. Shared by every tabbed panel on the site. */
export function TabList<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex gap-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === value}
          onClick={() => onChange(tab)}
          className={cn(
            "cursor-pointer rounded-md px-2.5 py-1 text-sm transition-colors",
            tab === value
              ? "bg-foreground/10 text-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/**
 * Tabs whose panels are rendered by the caller, so a server component can
 * pass in highlighted code. Children line up with the labels, in order.
 */
export function Tabs({
  labels,
  children,
  className,
}: {
  labels: readonly string[];
  children: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(labels[0]);
  const panels = Children.toArray(children);

  return (
    <div className={className}>
      <TabList tabs={labels} value={active} onChange={setActive} className="mb-3" />
      <div role="tabpanel">{panels[labels.indexOf(active)]}</div>
    </div>
  );
}
