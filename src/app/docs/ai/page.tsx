import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { DocPage, H2, InlineCode, P, PageTitle, docAlternates } from "@/components/site/doc-page";
import { Tabs } from "@/components/site/tabs";
import { GITHUB_URL, MCP_URL, REGISTRY_NAMESPACE, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI & agents",
  description:
    "Use fancyborders from AI coding agents: a hosted MCP server, an agent skill, the shadcn registry and MCP, llms.txt and every page as Markdown.",
  alternates: docAlternates("/docs/ai"),
};

const json = (value: unknown) => JSON.stringify(value, null, 2);

/** Setting up the MCP server, per client. */
const CLIENTS: { label: string; title: string; code: string; lang: "bash" | "tsx" }[] = [
  {
    label: "Claude Code",
    title: "Terminal",
    code: `claude mcp add --transport http ${SITE_NAME} ${MCP_URL}`,
    lang: "bash",
  },
  {
    label: "Cursor",
    title: ".cursor/mcp.json",
    code: json({ mcpServers: { [SITE_NAME]: { url: MCP_URL } } }),
    lang: "tsx",
  },
  {
    label: "VS Code",
    title: ".vscode/mcp.json",
    code: json({ servers: { [SITE_NAME]: { type: "http", url: MCP_URL } } }),
    lang: "tsx",
  },
  {
    label: "Windsurf",
    title: "~/.codeium/windsurf/mcp_config.json",
    code: json({ mcpServers: { [SITE_NAME]: { serverUrl: MCP_URL } } }),
    lang: "tsx",
  },
  {
    label: "Codex",
    title: "~/.codex/config.toml",
    code: `[mcp_servers.${SITE_NAME}]\nurl = "${MCP_URL}"`,
    lang: "bash",
  },
];

const TOOLS: [name: string, does: string][] = [
  ["search_components", "Find components by what they look like: “glowing card”, “corner brackets”, “ticket”."],
  ["list_components", "The whole catalogue, or one category, with slugs and registry items."],
  ["get_component", "One component's docs: install command, usage code, examples and props."],
  ["get_install_command", "The CLI command for any package manager, and what it brings along."],
  ["get_component_source", "The source and CSS of an item and everything it is built on."],
  ["get_guide", "The introduction, installation, theming or this guide."],
];

const PROMPT = `Use fancyborders (${SITE_URL}) to restyle the pricing section: a glowing border on the featured plan and corner brackets on the others. Read ${SITE_URL}/llms.txt first, install what you need with the shadcn CLI, and keep it working in light and dark mode.`;

export default function AiPage() {
  return (
    <DocPage
      href="/docs/ai"
      headings={[
        { id: "mcp", title: "MCP server" },
        { id: "skill", title: "Agent skill" },
        { id: "shadcn", title: "shadcn registry and MCP" },
        { id: "llms", title: "llms.txt and Markdown" },
        { id: "prompt", title: "A prompt to start with" },
      ]}
    >
      <PageTitle
        title="AI & agents"
        lead="Most UI gets written by agents now, so fancyborders is built for them too. Pick whichever your setup likes."
      />

      <H2 id="mcp">MCP server</H2>
      <P>
        A hosted server at <InlineCode>{MCP_URL}</InlineCode>. Nothing to
        install and no key: add the address to your client and your agent can
        search the components, read their docs and get install commands.
      </P>
      <Tabs labels={CLIENTS.map((client) => client.label)}>
        {CLIENTS.map((client) => (
          <CodeBlock key={client.label} title={client.title} code={client.code} lang={client.lang} />
        ))}
      </Tabs>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-xs text-muted">
              <th className="px-4 py-2 font-normal">Tool</th>
              <th className="px-4 py-2 font-normal">What it does</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map(([name, does]) => (
              <tr key={name} className="border-b border-line align-top last:border-0">
                <td className="px-4 py-2.5 font-mono text-[0.8125rem] whitespace-nowrap">{name}</td>
                <td className="px-4 py-2.5 text-foreground/75">{does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        It also serves every component&apos;s docs as a resource, and a{" "}
        <InlineCode>use_fancyborders</InlineCode> prompt for clients that show
        prompts as commands.
      </P>

      <H2 id="skill">Agent skill</H2>
      <P>
        A skill teaches an agent when to reach for fancyborders and how to use
        it well: which component fits which design, how frames and layers
        work, and the mistakes to avoid. Add it to your project:
      </P>
      <CodeBlock code={`npx skills add ommgh/${SITE_NAME}`} lang="bash" />
      <P>
        Or copy{" "}
        <a
          href={`${GITHUB_URL}/tree/master/skills/${SITE_NAME}`}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          skills/{SITE_NAME}
        </a>{" "}
        from the repository into <InlineCode>.claude/skills/</InlineCode> or
        wherever your agent looks for skills.
      </P>

      <H2 id="shadcn">shadcn registry and MCP</H2>
      <P>
        Add the registry to your project once, and every component installs
        by name. The shadcn MCP server can then browse, search and install
        from it too.
      </P>
      <CodeBlock
        code={`npx shadcn@latest registry add ${REGISTRY_NAMESPACE}=${SITE_URL}/r/{name}.json
npx shadcn@latest add ${REGISTRY_NAMESPACE}/glow-frame
npx shadcn@latest mcp init`}
        lang="bash"
      />

      <H2 id="llms">llms.txt and Markdown</H2>
      <ul className="my-4 grid list-disc gap-2 pl-5 leading-7 text-foreground/80">
        <li>
          <a href="/llms.txt" className="underline underline-offset-4">/llms.txt</a>{" "}
          is an index of the docs, in the{" "}
          <a href="https://llmstxt.org" className="underline underline-offset-4" target="_blank" rel="noreferrer">
            llms.txt
          </a>{" "}
          format.
        </li>
        <li>
          <a href="/llms-full.txt" className="underline underline-offset-4">/llms-full.txt</a>{" "}
          is every page in one file.
        </li>
        <li>
          Any docs page is Markdown with <InlineCode>.md</InlineCode> on the
          end, like{" "}
          <a href="/docs/components/glow.md" className="underline underline-offset-4">
            /docs/components/glow.md
          </a>
          , or at its usual address with <InlineCode>Accept: text/markdown</InlineCode>.
        </li>
        <li>
          Every page has a <strong>Copy page</strong> button under its title,
          for pasting into a chat.
        </li>
      </ul>

      <H2 id="prompt">A prompt to start with</H2>
      <P>No setup at all? Paste something like this into your agent:</P>
      <CodeBlock code={PROMPT} lang="bash" title="Prompt" />
    </DocPage>
  );
}
