import { llmsTxt } from "@/lib/agents/markdown";

export const dynamic = "force-static";

/** The docs index for language models, in the llms.txt format. */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
