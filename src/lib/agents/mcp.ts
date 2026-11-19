import "server-only";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  CATEGORIES,
  COMPONENTS,
  componentDoc,
  componentHref,
  componentsIn,
  type Category,
  type ComponentDoc,
} from "@/content/docs";
import { readSource, registryItem, withDependencies } from "@/lib/registry";
import {
  REGISTRY_NAMESPACE,
  SITE_NAME,
  SITE_URL,
  markdownPath,
} from "@/lib/site";

import {
  AGENT_NOTES,
  GUIDE_TOPICS,
  SUMMARY,
  catalogMarkdown,
  componentMarkdown,
  installMarkdown,
  llmsTxt,
  pageMarkdown,
} from "./markdown";

/*
 * The hosted MCP server: the docs, the catalogue and the install commands
 * as tools an agent can call. Read-only, and built from the same data as
 * the site.
 */

const INSTRUCTIONS = `${SUMMARY}

Typical flow: search_components or list_components to find a fit, get_component for its install command, usage code, examples and props, then run the install command in the user's project and use the code. get_guide("theming") covers the Tailwind utilities.

${AGENT_NOTES}`;

const ITEMS = [...new Set(COMPONENTS.map((doc) => doc.item))];
const CATEGORY_IDS = CATEGORIES.map(({ id }) => id) as [Category, ...Category[]];

const MANAGERS = {
  npm: "npx shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
} as const;

const text = (value: string) => ({ content: [{ type: "text" as const, text: value }] });

const line = (doc: ComponentDoc) =>
  `- ${doc.title} (slug: \`${doc.slug}\`, item: \`${doc.item}\`${doc.recipe ? ", recipe" : ""}): ${doc.description}`;

const FILLER = new Set(["a", "an", "the", "with", "and", "or", "for", "of", "to", "in", "on", "that", "around", "some", "my", "component", "components", "border", "borders"]);

/** Edits between two words, counting a swap of neighbours as one: a typo is one or two. */
function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** Whether a typed word is probably a misspelling of a part of a name. */
const nearly = (word: string, name: string) =>
  word.length > 3 &&
  name.split(/[\s-]+/).some((part) => distance(part, word) <= (word.length > 6 ? 2 : 1));

/**
 * Components ranked against a query. Each word scores where it appears: in
 * the name most, then the description, then the notes, examples and API.
 * Filler words are skipped, and a word that is nearly a component's name
 * (a typo) still counts.
 */
export function searchComponents(query: string) {
  const all = query.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
  const words = all.filter((word) => !FILLER.has(word));
  const wanted = words.length ? words : all;

  return COMPONENTS.map((doc) => {
    const category = CATEGORIES.find(({ id }) => id === doc.category)!;
    const name = `${doc.title} ${doc.slug} ${doc.item}`.toLowerCase();
    const about = `${doc.description} ${category.title} ${category.lead}`.toLowerCase();
    const more = [
      ...(doc.notes ?? []),
      ...doc.api,
      ...(doc.examples ?? []).map((example) => `${example.title} ${example.description ?? ""}`),
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const word of wanted) {
      // A rough stem, so "glowing" finds "glow" and "tickets" finds "ticket".
      const stem = word.replace(/(ing|es|s|ed)$/, "");
      const hit = (text: string) => text.includes(word) || (stem.length > 2 && text.includes(stem));
      if (hit(name)) score += 6;
      else if (hit(about)) score += 3;
      else if (hit(more)) score += 1;
      else if (nearly(word, name)) score += 4;
    }
    return { doc, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc);
}

/** A component by slug, or by the registry item it installs. */
function findComponent(name: string) {
  const key = name.trim().toLowerCase().replace(/^@fancyborders\//, "");
  return componentDoc(key) ?? COMPONENTS.find((doc) => doc.item === key && !doc.recipe);
}

function notFound(name: string) {
  const near = searchComponents(name).slice(0, 5);
  return text(
    `No component called "${name}".${near.length ? `\n\nClosest matches:\n${near.map(line).join("\n")}` : `\n\nAll components:\n${COMPONENTS.map(line).join("\n")}`}`,
  );
}

export function createServer() {
  const server = new McpServer(
    { name: SITE_NAME, title: "fancyborders", version: "1.0.0", websiteUrl: SITE_URL },
    { instructions: INSTRUCTIONS },
  );

  const readOnly = { readOnlyHint: true, openWorldHint: false } as const;

  server.registerTool(
    "list_components",
    {
      title: "List components",
      description:
        "Every fancyborders component, grouped by category (frames, structure, shapes, lines, effects), with its slug, registry item and a one-line description.",
      inputSchema: {
        category: z.enum(CATEGORY_IDS).optional().describe("Only list this category."),
      },
      annotations: readOnly,
    },
    async ({ category }) => {
      if (!category) return text(catalogMarkdown());
      const meta = CATEGORIES.find(({ id }) => id === category)!;
      return text(`## ${meta.title}\n\n${meta.lead}\n\n${componentsIn(category).map(line).join("\n")}`);
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Find components by what they look like or do, for example \"corner brackets\", \"glowing card\", \"dashed divider\", \"ticket\" or \"page layout\". Returns the best matches, best first.",
      inputSchema: {
        query: z.string().min(1).describe("Words describing the border, frame or effect wanted."),
        limit: z.number().int().min(1).max(24).optional().describe("Most results to return. Defaults to 8."),
      },
      annotations: readOnly,
    },
    async ({ query, limit = 8 }) => {
      const found = searchComponents(query).slice(0, limit);
      return text(
        found.length
          ? `${found.map(line).join("\n")}\n\nCall get_component with a slug for its install command, code and props.`
          : `Nothing matched "${query}". Every component:\n\n${COMPONENTS.map(line).join("\n")}`,
      );
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component's docs",
      description:
        "A component's full docs as Markdown: install command, usage code, examples with source, notes and the props of everything it exports.",
      inputSchema: {
        slug: z.string().min(1).describe("The component's slug, such as \"glow\" or \"bracket-frame\", or its registry item name."),
      },
      annotations: readOnly,
    },
    async ({ slug }) => {
      const doc = findComponent(slug);
      return doc ? text(componentMarkdown(doc)) : notFound(slug);
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Get an install command",
      description:
        "The shadcn CLI command that adds a component to a project, for a given package manager, and what else it brings along.",
      inputSchema: {
        slug: z.string().min(1).describe("A component slug or registry item name."),
        package_manager: z.enum(["npm", "pnpm", "yarn", "bun"]).optional().describe("Defaults to npm."),
      },
      annotations: readOnly,
    },
    async ({ slug, package_manager = "npm" }) => {
      const doc = findComponent(slug);
      const item = doc?.item ?? (ITEMS.includes(slug) ? slug : null);
      if (!item) return notFound(slug);
      const recipe = doc?.recipe
        ? `\n\n${doc.title} is a recipe over \`${item}\`: install it, then use the code from get_component("${doc.slug}").`
        : "";
      return text(
        `${installMarkdown(item, MANAGERS[package_manager])}${recipe}`,
      );
    },
  );

  server.registerTool(
    "get_component_source",
    {
      title: "Get a component's source",
      description:
        "The source files and CSS of a registry item and everything it is built on, dependencies first. For installing by hand or reading how it works; the CLI is usually simpler.",
      inputSchema: {
        item: z.enum(ITEMS as [string, ...string[]]).describe("The registry item name."),
      },
      annotations: readOnly,
    },
    async ({ item }) => {
      const parts = withDependencies(item).flatMap((entry) => [
        ...entry.files.map(
          (file) => `### ${file.replace(/^src\//, "")}\n\n\`\`\`tsx\n${readSource(file)}\n\`\`\``,
        ),
        ...(entry.css
          ? [`### ${entry.name}.css (add to the global stylesheet, after the Tailwind import)\n\n\`\`\`css\n${readSource(entry.css)}\n\`\`\``]
          : []),
      ]);
      return text(`# ${registryItem(item).title}\n\n${parts.join("\n\n")}`);
    },
  );

  server.registerTool(
    "get_guide",
    {
      title: "Get a guide",
      description:
        "A docs guide as Markdown: introduction (how frames and layers work), installation (CLI, registry namespace, manual), theming (Tailwind utilities and custom properties) or ai (MCP, skill, llms.txt).",
      inputSchema: {
        topic: z.enum(["introduction", "installation", "theming", "ai"]),
      },
      annotations: readOnly,
    },
    async ({ topic }) => text(pageMarkdown(GUIDE_TOPICS[topic])!),
  );

  server.registerResource(
    "llms.txt",
    `${SITE_URL}/llms.txt`,
    { title: "fancyborders docs index", description: "The docs index in the llms.txt format.", mimeType: "text/plain" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/plain", text: llmsTxt() }] }),
  );

  server.registerResource(
    "component",
    new ResourceTemplate(`${SITE_URL}/docs/components/{slug}.md`, {
      list: async () => ({
        resources: COMPONENTS.map((doc) => ({
          uri: `${SITE_URL}${markdownPath(componentHref(doc.slug))}`,
          name: doc.slug,
          title: doc.title,
          description: doc.description,
          mimeType: "text/markdown",
        })),
      }),
    }),
    { title: "Component docs", description: "Each component's docs as Markdown.", mimeType: "text/markdown" },
    async (uri, { slug }) => {
      const doc = findComponent(String(slug));
      return {
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: doc ? componentMarkdown(doc) : `No component called "${slug}".` },
        ],
      };
    },
  );

  server.registerPrompt(
    "use_fancyborders",
    {
      title: "Build with fancyborders",
      description: "Start a task that dresses up part of a UI with fancyborders frames, shapes or effects.",
      argsSchema: {
        goal: z.string().describe("What to build or restyle, for example \"a pricing card with a glowing border\"."),
      },
    },
    ({ goal }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use fancyborders (${SITE_URL}) for this: ${goal}

Find the components that fit with search_components, read each one with get_component, install them with the shadcn CLI command it gives (or ${REGISTRY_NAMESPACE}/<item> if the registry is set up in components.json), then write the code. Prefer Tailwind utilities (frame-color-*, frame-line-*, frame-radius-*, frame-from-*/frame-to-*) over inline styles, and keep it working in light and dark mode.`,
          },
        },
      ],
    }),
  );

  return server;
}
