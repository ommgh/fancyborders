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

function convert(container) {
  const out = {};
  for (const node of container.nodes ?? []) {
    if (node.type === "rule") {
      const declarations = {};
      node.walkDecls((decl) => {
        declarations[decl.prop] = tidy(decl.value);
      });
      out[tidy(node.selector)] = declarations;
    } else if (node.type === "atrule") {
      const key = tidy(`@${node.name} ${node.params}`);
      if (node.name === "utility") {
        const declarations = {};
        node.each((child) => {
          if (child.type === "decl") declarations[child.prop] = tidy(child.value);
        });
        out[key] = declarations;
      } else {
        out[key] = convert(node);
      }
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
  ],
};

writeFileSync("registry.json", `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items, served from ${site}`);
