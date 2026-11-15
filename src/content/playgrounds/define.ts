import type { ReactNode } from "react";

/*
 * A playground is a live preview with controls: a set of values, a control
 * for each, a function that renders them and one that writes the matching
 * code. The same definition draws the component's page, its tile in the
 * gallery and its tile on the landing page.
 */

export type Control =
  | { type: "range"; label: string; min: number; max: number; step?: number; unit?: string }
  | { type: "select"; label: string; options: readonly string[] }
  | { type: "toggle"; label: string }
  | { type: "color"; label: string };

export type Values = Record<string, number | string | boolean>;

export type Playground<V extends Values = Values> = {
  defaults: V;
  controls: { [K in keyof V]: Control };
  render: (values: V) => ReactNode;
  code: (values: V) => string;
};

export function definePlayground<V extends Values>(playground: Playground<V>) {
  // Stored together in one map, so the value type is widened here.
  return playground as unknown as Playground;
}

/* ── Writing code ──────────────────────────────────────────────────────── */

/** A prop to print: its name, its value, and the default it is left out at. */
export type PropEntry = [name: string, value: unknown, fallback?: unknown];

export type JsxNode =
  | string
  | { tag: string; props: PropEntry[]; children: JsxNode[] };

/** A JavaScript expression to print as it is, rather than as a string. */
export const raw = (expression: string) => ({ raw: expression });

export function el(
  tag: string,
  props: PropEntry[] = [],
  ...children: (JsxNode | false | undefined)[]
): JsxNode {
  return {
    tag,
    props,
    children: children.filter((child): child is JsxNode => Boolean(child)),
  };
}

function literal(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(literal).join(", ")}]`;
  if (value && typeof value === "object") {
    if ("raw" in value) return String(value.raw);
    const entries = Object.entries(value).map(
      ([key, entry]) => `${key}: ${literal(entry)}`,
    );
    return `{ ${entries.join(", ")} }`;
  }
  return String(value);
}

function attribute([name, value]: PropEntry) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
  return `${name}={${literal(value)}}`;
}

const same = (a: unknown, b: unknown) => literal(a) === literal(b);

/** Lines longer than this are broken, one prop to a line. */
const WIDTH = 72;

function print(node: JsxNode, depth: number): string {
  const pad = "  ".repeat(depth);
  if (typeof node === "string") return pad + node;

  const attributes = node.props
    .filter(([, value, fallback]) => value !== undefined && !same(value, fallback))
    .map(attribute);
  const close = node.children.length === 0 ? " />" : ">";
  const oneLine = [`<${node.tag}`, ...attributes].join(" ") + close;

  const open =
    pad.length + oneLine.length <= WIDTH || attributes.length === 0
      ? pad + oneLine
      : [
          `${pad}<${node.tag}`,
          ...attributes.map((text) => `${pad}  ${text}`),
          pad + close.trim(),
        ].join("\n");

  if (node.children.length === 0) return open;
  return [
    open,
    ...node.children.map((child) => print(child, depth + 1)),
    `${pad}</${node.tag}>`,
  ].join("\n");
}

/** A complete snippet: the imports, a blank line, then the JSX. */
export function snippet(imports: string[], node: JsxNode) {
  return `${imports.join("\n")}\n\n${print(node, 0)}`;
}

/** An import, with only the names that are used. Long ones are broken. */
export function importing(names: (string | false | undefined)[], from: string) {
  const used = names.filter(Boolean);
  const oneLine = `import { ${used.join(", ")} } from "${from}";`;
  if (oneLine.length <= WIDTH) return oneLine;
  return `import {\n${used.map((name) => `  ${name},`).join("\n")}\n} from "${from}";`;
}
