import { Code } from "@/components/site/code-block";
import { CopyButton } from "@/components/site/copy-button";
import { PreviewTabs } from "@/components/site/preview-tabs";
import { stageClass } from "@/components/site/stage";
import type { Example as ExampleDoc } from "@/content/docs";
import { DEMOS } from "@/demos";
import { readSource } from "@/lib/registry";
import { cn } from "@/lib/utils";

/** A static example: the demo running, and the source of the same file. */
export function Example({ example }: { example: ExampleDoc }) {
  const Demo = DEMOS[example.demo];
  const source = readSource(`src/demos/${example.demo}.tsx`);

  return (
    <PreviewTabs
      copy={<CopyButton text={source} />}
      preview={
        <div
          className={cn(
            "grid min-h-64 place-items-center overflow-hidden p-8",
            stageClass(example.stage),
          )}
        >
          <Demo />
        </div>
      }
      code={<Code code={source} className="bg-foreground/[0.03]" />}
    />
  );
}
