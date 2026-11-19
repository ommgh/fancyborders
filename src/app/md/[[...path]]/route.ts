import { MARKDOWN_PAGES, pageMarkdown } from "@/lib/agents/markdown";

/*
 * A docs page as Markdown. Reached through rewrites in next.config.ts: a
 * page's address with `.md` on the end, or the address itself requested
 * with `Accept: text/markdown`. Every page is written at build time.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return MARKDOWN_PAGES.map((href) => ({ path: href.split("/").filter(Boolean) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/md/[[...path]]">) {
  const { path = [] } = await params;
  const markdown = pageMarkdown(`/${path.join("/")}`);
  if (markdown === null) return new Response("Not found", { status: 404 });
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
    },
  });
}
