import "server-only";

import { API, type ApiTable } from "@/content/api";
import {
  CATEGORIES,
  COMPONENTS,
  GUIDES,
  componentDoc,
  componentHref,
  componentsIn,
  type ComponentDoc,
} from "@/content/docs";
import { PLAYGROUNDS } from "@/content/playgrounds";
import { PROPERTIES, SCOPE, UTILITIES, VARIANTS } from "@/content/theming";
import { readSource, registryItem, withDependencies } from "@/lib/registry";
import {
  GITHUB_URL,
  MCP_URL,
  REGISTRY_NAMESPACE,
  SITE_NAME,
  SITE_URL,
  installCommand,
  markdownPath,
  registryUrl,
} from "@/lib/site";

/*
 * Every docs page as Markdown, for AI agents and anything else that would
 * rather not parse HTML. Built from the same data as the site, so the two
 * never disagree. Served at each page's address with `.md` on the end, in
 * /llms.txt and /llms-full.txt, and through the MCP server.
 */

const url = (href: string) => `${SITE_URL}${href}`;
const mdUrl = (href: string) => url(markdownPath(href));

const fence = (code: string, lang = "tsx") => `\`\`\`${lang}\n${code}\n\`\`\``;

function table(head: string[], rows: string[][]) {
  const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n");
}

/** The pitch, shared by llms.txt, the introduction and the MCP server. */
export const SUMMARY =
  "fancyborders is a free, open-source collection of borders, frames and enclosures for React and Tailwind CSS v4: structural frames (corner brackets, hatched dividers, intersection marks), page structure (rails, section rules, section grids), shaped outlines (bevelled, notched and scooped corners, tickets, folders, speech bubbles, zigzag and scalloped edges), line styles, and effects (gradient, glow, a travelling beam, a pointer spotlight, liquid metal). Components are copied into the project with the shadcn CLI, not installed as a package.";

/** How to work with the library, for agents. Shared by several outputs. */
export const AGENT_NOTES = `- Install a component with the shadcn CLI: \`${installCommand("frame")}\`. The CLI copies the source into the project, adds the items it is built on, and writes its CSS into the global stylesheet. With the registry namespace set up (\`npx shadcn@latest registry add ${REGISTRY_NAMESPACE}=${SITE_URL}/r/{name}.json\`), \`npx shadcn@latest add ${REGISTRY_NAMESPACE}/frame\` works too.
- Everything is a \`Frame\` (from \`@/components/ui/frame\`) with decoration layers inside it, next to the content. Layers are absolutely positioned, never affect layout, and can go in any order. Presets such as \`BracketFrame\` and \`GlowFrame\` are short recipes over those layers.
- Pages marked "recipe" have no registry item of their own: install the item they name, then copy the code from the page.
- Style frames with Tailwind utilities rather than props where you can: \`frame-color-*\`, \`frame-line-*\`, \`frame-radius-*\`, and \`frame-from-*\` / \`frame-via-*\` / \`frame-to-*\` for effect colours. They take variants (\`hover:\`, \`dark:\`) and inherit, so a utility on a section themes every frame inside it.
- Pad the frame, not the layers: give a frame the padding its content needs, and at least as much as any inset or bracket gap.
- Effects work in light and dark mode. Give an effect card a background of its own (\`bg-card\`), and give shape frames a \`fill\` when using a glow, because the halo is the whole shape blurred behind it.
- \`frame-spotlight\`, \`frame-metal\` and \`edge-frame\` are client components. Everything else renders on the server and is plain CSS.
- Every animation stops for people who prefer reduced motion.`;

/* ── Components ────────────────────────────────────────────────────────── */

function apiMarkdown(name: string, table_: ApiTable) {
  return [
    `### ${name}`,
    fence(`import { ${name} } from "${table_.from}";`),
    table(
      ["Prop", "Type", "Default", "Description"],
      table_.props.map((prop) => [
        `\`${prop.name}\``,
        `\`${prop.type}\``,
        prop.default ? `\`${prop.default}\`` : "–",
        prop.description,
      ]),
    ),
    table_.extends ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Install instructions for a registry item, with what it brings along. */
export function installMarkdown(item: string, cli = "npx shadcn@latest add") {
  const chain = withDependencies(item);
  const builtOn = chain.slice(0, -1).map((entry) => `\`${entry.name}\``);
  return [
    fence(`${cli} ${registryUrl(item)}`, "bash"),
    `With the registry namespace: \`npx shadcn@latest add ${REGISTRY_NAMESPACE}/${item}\`.`,
    builtOn.length
      ? `The CLI also adds what \`${item}\` is built on: ${builtOn.join(", ")}.`
      : "",
    `Files it adds: ${chain
      .flatMap((entry) => entry.files)
      .map((file) => `\`${file.replace(/^src\//, "")}\``)
      .join(", ")}, and its CSS goes into the global stylesheet after the Tailwind import.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function componentMarkdown(doc: ComponentDoc) {
  const category = CATEGORIES.find(({ id }) => id === doc.category)!;
  const item = registryItem(doc.item);
  const playground = PLAYGROUNDS[doc.slug];

  const sections = [
    `# ${doc.title}`,
    `> ${doc.description}`,
    [
      `- Category: ${category.title} (${category.lead})`,
      `- Registry item: \`${item.name}\`${doc.recipe ? ` — ${doc.title} is a recipe: a few layers of \`${item.name}\` put together, not an item of its own. Install \`${item.name}\` and copy the code below.` : ""}`,
      `- Live preview with controls: ${url(componentHref(doc.slug))}`,
    ].join("\n"),
    "## Installation",
    installMarkdown(item.name),
    "## Usage",
    "The code for the preview at its default settings:",
    fence(playground.code(playground.defaults)),
  ];

  if (doc.examples?.length) {
    sections.push("## Examples");
    for (const example of doc.examples) {
      sections.push(
        `### ${example.title}`,
        example.description ?? "",
        fence(readSource(`src/demos/${example.demo}.tsx`)),
      );
    }
  }

  if (doc.notes?.length) {
    sections.push("## Good to know", doc.notes.map((note) => `- ${note}`).join("\n"));
  }

  sections.push(
    "## API reference",
    ...doc.api.map((name) => apiMarkdown(name, API[name])),
  );

  return sections.filter(Boolean).join("\n\n") + "\n";
}

/** Every component, grouped, one line each. */
export function catalogMarkdown(link: (href: string) => string = mdUrl) {
  return CATEGORIES.map((category) =>
    [
      `### ${category.title}`,
      category.lead,
      componentsIn(category.id)
        .map(
          (doc) =>
            `- [${doc.title}](${link(componentHref(doc.slug))}): ${doc.description} Item: \`${doc.item}\`${doc.recipe ? " (recipe)" : ""}.`,
        )
        .join("\n"),
    ].join("\n\n"),
  ).join("\n\n");
}

/* ── Guides ────────────────────────────────────────────────────────────── */

function introduction() {
  return `# Introduction

> ${SUMMARY}

Most component libraries stop at \`border\` and \`rounded\`. This one is only about the edges of an interface: corner brackets and hatched dividers, outlines that are not rectangles, dash patterns a CSS border cannot draw, and borders that glow, travel or turn to metal.

## Frames and layers

Everything is built from one primitive. A \`Frame\` is a positioned box, and you put decoration layers inside it next to your content: a border, rules, corner marks, a pattern fill, an effect. Layers are absolutely positioned, so they never affect layout and can go in any order.

${fence(`import { Frame, FrameCorners, FrameFill, FrameRules } from "@/components/ui/frame";

<Frame className="p-6">
  <FrameFill pattern="grid" size={16} />
  <FrameRules overshoot={10} />
  <FrameCorners mark="plus" />
  Content
</Frame>`)}

The named components are short recipes over those layers, so you can use them as they are, or open them up and change them.

${fence(`import { BracketFrame } from "@/components/bracket-frame";

<BracketFrame className="p-5">
  <Card />
</BracketFrame>`)}

## Quick start

In a project that uses React, Tailwind CSS v4 and the shadcn CLI, add any component with one command:

${fence(installCommand("bracket-frame"), "bash")}

## Working with it

${AGENT_NOTES}

## Components

${catalogMarkdown()}
`;
}

function installation() {
  return `# Installation

> Components are copied into your project, one command each. There is no package to install or keep up to date.

## Requirements

- React 18 or later.
- Tailwind CSS v4.
- A \`components.json\` file, which the shadcn CLI reads to know where your components and stylesheet live. Create one with \`npx shadcn@latest init\`.

## Install with the CLI

Every component page has its own command. This one adds the bracket frame:

${fence(installCommand("bracket-frame"), "bash")}

The CLI copies the component into your components folder (for example \`components/bracket-frame.tsx\`), adds anything it is built on (here the \`frame\` primitive in \`components/ui/frame.tsx\`), and writes the component's CSS into your global stylesheet.

Other package managers: \`pnpm dlx shadcn@latest add …\`, \`yarn dlx shadcn@latest add …\`, \`bunx --bun shadcn@latest add …\`.

## The registry namespace

Add the registry to \`components.json\` once, then install by name:

${fence(`npx shadcn@latest registry add ${REGISTRY_NAMESPACE}=${SITE_URL}/r/{name}.json
npx shadcn@latest add ${REGISTRY_NAMESPACE}/bracket-frame`, "bash")}

That writes this to \`components.json\`:

${fence(JSON.stringify({ registries: { [REGISTRY_NAMESPACE]: `${SITE_URL}/r/{name}.json` } }, null, 2), "json")}

The registry index is at ${SITE_URL}/r/registry.json.

## Use it

${fence(`import { BracketFrame } from "@/components/bracket-frame";

export function Feature() {
  return (
    <BracketFrame className="p-5">
      <h3>Corner brackets</h3>
      <p>Around anything you put inside.</p>
    </BracketFrame>
  );
}`)}

## Install by hand

Copy every file the item lists, dependencies first, from its registry JSON (${SITE_URL}/r/<item>.json) or its page. The CSS belongs in your global stylesheet after the Tailwind import, so its rules land in Tailwind's \`components\` layer and utilities can still override them:

${fence(`@import "tailwindcss";

/* Component CSS goes here, after Tailwind. */
@layer components {
  .fb-frame {
    /* … */
  }
}`, "css")}

Components import a \`cn\` helper from \`@/lib/utils\`, the same one shadcn/ui uses. Without it, install \`clsx\` and \`tailwind-merge\` and add:

${fence(`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`, "ts")}

## Browser support

Structural frames and line styles use only widely supported CSS. Curved shape corners need the CSS \`shape()\` function and fall back to a rectangular border. The beam needs \`offset-path\` (Chromium 116, Firefox 122, Safari 18) and leaves the plain border without it. Liquid metal needs WebGL and shows the frame's plain line without it.
`;
}

function theming() {
  return `# Theming

> Frames read their colours and sizes from custom properties, and each one has a Tailwind utility. Style a frame the way you style anything else.

## Utilities

Put these on a frame to restyle every layer inside it. Colour utilities take theme colours, arbitrary values and opacity modifiers, such as \`frame-color-sky-500/50\`.

${table(["Utility", "Sets"], UTILITIES.map(([name, sets]) => [`\`${name}\``, sets]))}

## Variants

They are ordinary utilities, so they work with every Tailwind variant: hover, focus, dark, breakpoints, group and peer states.

${fence(VARIANTS)}

## Theming a whole section

The properties inherit, so a utility on any ancestor themes every frame beneath it.

${fence(SCOPE)}

## Effect palettes

Gradient, glow and beam layers share one palette. Set it once on the frame and every effect layer inside uses it, or pass \`colors\` to a single layer.

${fence(readSource("src/demos/gradient-utilities.tsx"))}

## Custom properties

The utilities set these properties. You can set them yourself, in a stylesheet or a style attribute.

${table(["Property", "Sets"], PROPERTIES.map(([name, sets]) => [`\`${name}\``, sets]))}
`;
}

export function aiGuide() {
  return `# AI & agents

> fancyborders is built to be found and used by AI coding agents as well as people.

## MCP server

A hosted MCP server, nothing to install: ${MCP_URL} (Streamable HTTP, no auth).

${fence(`claude mcp add --transport http ${SITE_NAME} ${MCP_URL}`, "bash")}

Cursor (\`.cursor/mcp.json\`) and most other clients:

${fence(JSON.stringify({ mcpServers: { [SITE_NAME]: { url: MCP_URL } } }, null, 2), "json")}

Tools: \`list_components\`, \`search_components\`, \`get_component\`, \`get_install_command\`, \`get_component_source\`, \`get_guide\`.

## Agent skill

${fence(`npx skills add ommgh/${SITE_NAME}`, "bash")}

The skill is in the repository at \`skills/${SITE_NAME}\`: ${GITHUB_URL}/tree/master/skills/${SITE_NAME}

## shadcn registry and MCP

${fence(`npx shadcn@latest registry add ${REGISTRY_NAMESPACE}=${SITE_URL}/r/{name}.json
npx shadcn@latest mcp init`, "bash")}

The shadcn MCP server can then browse, search and install from the registry.

## llms.txt and Markdown

- ${SITE_URL}/llms.txt: an index of the docs.
- ${SITE_URL}/llms-full.txt: every page in one file.
- Any docs page as Markdown: add \`.md\` to its address, or request it with \`Accept: text/markdown\`.
`;
}

function componentsIndex() {
  return `# Components

> All ${COMPONENTS.length} of them. Each page has a live preview with controls, the install command, examples and props.

${catalogMarkdown()}
`;
}

/* ── Pages ─────────────────────────────────────────────────────────────── */

const GUIDE_PAGES: Record<string, () => string> = {
  "/docs": introduction,
  "/docs/installation": installation,
  "/docs/theming": theming,
  "/docs/ai": aiGuide,
  "/docs/components": componentsIndex,
};

/** Every docs page that has a Markdown version, by its address. */
export const MARKDOWN_PAGES: string[] = [
  ...GUIDES.map((guide) => guide.href),
  ...COMPONENTS.map((doc) => componentHref(doc.slug)),
];

/** A docs page as Markdown, by its address, or null if there is none. */
export function pageMarkdown(href: string): string | null {
  const guide = GUIDE_PAGES[href];
  if (guide) return guide();
  const slug = href.match(/^\/docs\/components\/([^/]+)$/)?.[1];
  const doc = slug ? componentDoc(slug) : undefined;
  return doc ? componentMarkdown(doc) : null;
}

/** The guides an MCP client can ask for by name. */
export const GUIDE_TOPICS = {
  introduction: "/docs",
  installation: "/docs/installation",
  theming: "/docs/theming",
  ai: "/docs/ai",
} as const;

/* ── llms.txt ──────────────────────────────────────────────────────────── */

/** The index, in the llms.txt format (https://llmstxt.org). */
export function llmsTxt() {
  return `# ${SITE_NAME}

> ${SUMMARY}

${AGENT_NOTES}
- MCP server (Streamable HTTP, no auth): ${MCP_URL}
- Agent skill: \`npx skills add ommgh/${SITE_NAME}\`

## Docs

${GUIDES.map((guide) => `- [${guide.title}](${mdUrl(guide.href)})`).join("\n")}

## Components

${catalogMarkdown()}

## Optional

- [Everything in one file](${SITE_URL}/llms-full.txt)
- [Registry index](${SITE_URL}/r/registry.json): every item as shadcn registry JSON; each item's JSON is at ${registryUrl("<item>")} and includes its source and CSS
- [Source code](${GITHUB_URL})
`;
}

/** Every page in one file. */
export function llmsFullTxt() {
  return [
    `# ${SITE_NAME}\n\n> ${SUMMARY}\n\nSource: ${SITE_URL}. Each section below is also served on its own at the address given.`,
    ...MARKDOWN_PAGES.map(
      (href) => `<!-- ${mdUrl(href)} -->\n\n${pageMarkdown(href)}`,
    ),
  ].join("\n\n---\n\n");
}
