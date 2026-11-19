import type { NextConfig } from "next";

/** A request that asks for Markdown rather than HTML. */
const wantsMarkdown = [
  { type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Every docs page also exists as Markdown, for AI agents: at its address
  // with `.md` on the end, or at the address itself with an Accept header
  // asking for Markdown. Both lead to the route in src/app/md.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/docs.md", destination: "/md/docs" },
        { source: "/docs/:page.md", destination: "/md/docs/:page" },
        { source: "/docs/components/:slug.md", destination: "/md/docs/components/:slug" },
        { source: "/docs", has: wantsMarkdown, destination: "/md/docs" },
        { source: "/docs/:path*", has: wantsMarkdown, destination: "/md/docs/:path*" },
      ],
    };
  },

  // The MCP server reads component and demo sources at request time.
  outputFileTracingIncludes: {
    "/mcp": ["./src/components/**/*", "./src/demos/**/*"],
  },
};

export default nextConfig;
