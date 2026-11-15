// Generates registry.json for the shadcn CLI.
//
// Each item's stylesheet lives next to its component as a normal CSS file.
// The CLI installs CSS from a JSON `css` field instead, so this script
// converts the files and writes them into the registry. Run it through
// `bun run registry:build`, which then calls `shadcn build`.
import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Address of another item in this registry. */
const item = (name) => `${site}/r/${name}.json`;

const tidy = (value) => value.replace(/\s+/g, " ").trim();

/**
 * The declarations directly inside a node. A property declared more than
 * once (a Tailwind utility giving a plain value and one with a modifier)
 * keeps every value: JSON has no duplicate keys, so the later ones ride
 * along in the first one's value, and the CLI writes them out as written.
 */
function declarations(node) {
  const out = {};
  node.each((child) => {
    if (child.type !== "decl") return;
    const value = tidy(child.value);
    out[child.prop] =
      child.prop in out ? `${out[child.prop]}; ${child.prop}: ${value}` : value;
  });
  return out;
}

function convert(container) {
  const out = {};
  const add = (key, value) => {
    // The same selector twice in one block would silently lose the first.
    if (key in out) throw new Error(`"${key}" appears twice in one block`);
    out[key] = value;
  };
  for (const node of container.nodes ?? []) {
    if (node.type === "rule") {
      add(tidy(node.selector), declarations(node));
    } else if (node.type === "atrule") {
      // Declarations first (@utility, @property), then anything nested.
      add(tidy(`@${node.name} ${node.params}`), {
        ...declarations(node),
        ...convert(node),
      });
    }
  }
  return out;
}

const css = (file) => convert(postcss.parse(readFileSync(file, "utf8")));

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "fancyborders",
  homepage: site,
  items: [
    {
      name: "frame",
      type: "registry:ui",
      title: "Frame",
      description:
        "The frame primitive: an enclosure plus composable border, rule, corner-mark and fill layers.",
      files: [{ path: "src/components/ui/frame.tsx", type: "registry:ui" }],
      css: css("src/components/ui/frame.css"),
      categories: ["primitives"],
    },
    {
      name: "shape-frame",
      type: "registry:ui",
      title: "Shape Frame",
      description:
        "A frame whose outline follows a shape: bevelled, notched, scooped or rounded corners and punched edges.",
      registryDependencies: [item("frame")],
      files: [{ path: "src/components/ui/shape-frame.tsx", type: "registry:ui" }],
      css: css("src/components/ui/shape-frame.css"),
      categories: ["primitives", "shapes"],
    },
    {
      name: "frame-effects",
      type: "registry:ui",
      title: "Frame Effects",
      description:
        "Effect layers for a frame in plain CSS: a gradient line, a glow, and a beam of light that travels around the border.",
      registryDependencies: [item("frame")],
      files: [
        { path: "src/components/ui/frame-effects.tsx", type: "registry:ui" },
      ],
      css: css("src/components/ui/frame-effects.css"),
      categories: ["primitives", "effects"],
    },
    {
      name: "frame-spotlight",
      type: "registry:ui",
      title: "Frame Spotlight",
      description:
        "A light on the frame's line that follows the pointer, shared across every frame on the page.",
      registryDependencies: [item("frame")],
      files: [
        { path: "src/components/ui/frame-spotlight.tsx", type: "registry:ui" },
      ],
      css: css("src/components/ui/frame-spotlight.css"),
      categories: ["primitives", "effects"],
    },
    {
      name: "frame-metal",
      type: "registry:ui",
      title: "Frame Metal",
      description:
        "Liquid metal on the frame's line, drawn with WebGL, in chromatic, silver and gold.",
      registryDependencies: [item("frame")],
      files: [
        { path: "src/components/ui/frame-metal.tsx", type: "registry:ui" },
      ],
      css: css("src/components/ui/frame-metal.css"),
      categories: ["primitives", "effects"],
    },
    {
      name: "bracket-frame",
      type: "registry:component",
      title: "Bracket Frame",
      description: "Corner brackets around a dashed border.",
      registryDependencies: [item("frame")],
      files: [
        { path: "src/components/bracket-frame.tsx", type: "registry:component" },
      ],
      categories: ["frames"],
    },
    {
      name: "hatch-divider",
      type: "registry:component",
      title: "Hatch Divider",
      description:
        "A hatched band between two lines for separating page sections, with marks where it meets the page rails.",
      registryDependencies: [item("frame")],
      files: [
        { path: "src/components/hatch-divider.tsx", type: "registry:component" },
      ],
      categories: ["frames"],
    },
    {
      name: "ticket-frame",
      type: "registry:component",
      title: "Ticket Frame",
      description:
        "A ticket with rounded corners, a perforated line and a tear-off stub.",
      registryDependencies: [item("shape-frame")],
      files: [
        { path: "src/components/ticket-frame.tsx", type: "registry:component" },
      ],
      categories: ["shapes"],
    },
    {
      name: "beam-frame",
      type: "registry:component",
      title: "Beam Frame",
      description: "A quiet border with a light travelling around it.",
      registryDependencies: [item("frame"), item("frame-effects")],
      files: [
        { path: "src/components/beam-frame.tsx", type: "registry:component" },
      ],
      categories: ["effects"],
    },
    {
      name: "glow-frame",
      type: "registry:component",
      title: "Glow Frame",
      description:
        "A gradient border with a halo of the same colours behind it.",
      registryDependencies: [item("frame"), item("frame-effects")],
      files: [
        { path: "src/components/glow-frame.tsx", type: "registry:component" },
      ],
      categories: ["effects"],
    },
  ],
};

writeFileSync("registry.json", `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items, served from ${site}`);
