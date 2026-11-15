import { CopyButton } from "@/components/site/copy-button";
import { highlight, type CodeLanguage } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/** Highlighted code with no chrome, for putting inside another panel. */
export async function Code({
  code,
  lang = "tsx",
  className,
}: {
  code: string;
  lang?: CodeLanguage;
  className?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <div
      className={cn("site-code", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const LABEL: Record<CodeLanguage, string> = {
  tsx: "tsx",
  css: "css",
  bash: "Terminal",
};

/** A code panel: a file name or label, a copy button and the code. */
export function CodeBlock({
  code,
  lang = "tsx",
  title,
  scroll = false,
  className,
}: {
  code: string;
  lang?: CodeLanguage;
  /** File name shown above the code. Defaults to the language. */
  title?: string;
  /** Limit the height and scroll, for whole source files. */
  scroll?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-foreground/10 bg-foreground/[0.03]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-foreground/10 pr-1 pl-4">
        <span className="truncate py-2 font-mono text-xs text-foreground/50">
          {title ?? LABEL[lang]}
        </span>
        <CopyButton text={code} />
      </div>
      <Code
        code={code}
        lang={lang}
        className={cn(scroll && "max-h-96 overflow-y-auto")}
      />
    </div>
  );
}
