// Generates registry.json for the shadcn CLI from registry/items.json.
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

// The items themselves live in registry/items.json, which the site also
// reads to show each item's source for a manual install.
const items = JSON.parse(readFileSync("registry/items.json", "utf8"));

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "fancyborders",
  homepage: site,
  items: items.map(({ requires, files, css: stylesheet, ...rest }) => ({
    ...rest,
    ...(requires && { registryDependencies: requires.map(item) }),
    files: files.map((path) => ({ path, type: rest.type })),
    ...(stylesheet && { css: css(stylesheet) }),
  })),
};

writeFileSync("registry.json", `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items, served from ${site}`);
