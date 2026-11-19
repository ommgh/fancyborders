"use client";

import { useSyncExternalStore } from "react";

import { CopyButton } from "@/components/site/copy-button";
import { TabList } from "@/components/site/tabs";

const MANAGERS = {
  npm: "npx shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
} as const;

type Manager = keyof typeof MANAGERS;

const NAMES = Object.keys(MANAGERS) as Manager[];
const KEY = "fancyborders:package-manager";
const CHANGED = "fancyborders:package-manager-changed";

/*
 * The chosen package manager is remembered across pages and visits, and
 * every command on a page switches together.
 */
function subscribe(notify: () => void) {
  window.addEventListener(CHANGED, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(CHANGED, notify);
    window.removeEventListener("storage", notify);
  };
}

function stored(): Manager {
  try {
    const value = localStorage.getItem(KEY);
    return NAMES.includes(value as Manager) ? (value as Manager) : "npm";
  } catch {
    return "npm";
  }
}

function choose(manager: Manager) {
  try {
    localStorage.setItem(KEY, manager);
  } catch {
    // Storage can be unavailable; the choice then lasts for this page only.
  }
  window.dispatchEvent(new Event(CHANGED));
}

/** The CLI command for a registry address, per package manager. */
export function InstallCommand({ url }: { url: string }) {
  const manager = useSyncExternalStore(subscribe, stored, () => "npm" as const);
  const command = `${MANAGERS[manager]} ${url}`;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-1.5 py-1">
        <TabList tabs={NAMES} value={manager} onChange={choose} />
        <CopyButton text={command} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed">
        <span className="text-muted">{MANAGERS[manager]} </span>
        {url}
      </pre>
    </div>
  );
}
