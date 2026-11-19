import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { createServer } from "@/lib/agents/mcp";
import { SITE_URL } from "@/lib/site";

/*
 * The MCP server, over Streamable HTTP. Stateless: every request gets a
 * fresh server and transport, which suits serverless hosting, and replies
 * come back as plain JSON rather than a stream.
 */

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function POST(request: Request) {
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return withCors(await transport.handleRequest(request));
}

/** A stateless server has no stream to open, so GET explains what this is. */
export function GET() {
  return withCors(
    new Response(
      `This is the fancyborders MCP server (Streamable HTTP). Add ${SITE_URL}/mcp to your MCP client.\nSetup: ${SITE_URL}/docs/ai\n`,
      { status: 405, headers: { Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8" } },
    ),
  );
}

export function DELETE() {
  return withCors(new Response(null, { status: 405, headers: { Allow: "POST, OPTIONS" } }));
}

export function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
