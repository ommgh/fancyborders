import { readFileSync } from "node:fs";
import path from "node:path";

import items from "../../registry/items.json";

export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  /** Other items this one is built on. */
  requires?: string[];
  files: string[];
  css?: string;
};

export function registryItem(name: string): RegistryItem {
  const item = (items as RegistryItem[]).find((entry) => entry.name === name);
  if (!item) throw new Error(`No registry item named "${name}"`);
  return item;
}

/**
 * A source file as text, by its path from the project root. Only runs on
 * the server, at build time. Everything shown on the site lives under src,
 * and saying so keeps the bundler from tracing the whole project.
 */
export function readSource(file: string) {
  if (!file.startsWith("src/")) throw new Error(`"${file}" is not under src`);
  return readFileSync(
    path.join(process.cwd(), "src", file.slice("src/".length)),
    "utf8",
  ).trimEnd();
}

/**
 * An item together with everything it is built on, dependencies first, so
 * a manual install can list every file to copy in order.
 */
export function withDependencies(name: string): RegistryItem[] {
  const seen = new Set<string>();
  const ordered: RegistryItem[] = [];
  const visit = (current: string) => {
    if (seen.has(current)) return;
    seen.add(current);
    const item = registryItem(current);
    item.requires?.forEach(visit);
    ordered.push(item);
  };
  visit(name);
  return ordered;
}
