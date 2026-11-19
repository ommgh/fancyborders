import { llmsFullTxt } from "@/lib/agents/markdown";

export const dynamic = "force-static";

/** Every docs page as Markdown, in one file. */
export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
