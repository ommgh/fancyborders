"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  // Keep the last argument (the item address) together when the line wraps.
  const split = command.lastIndexOf(" ");
  const head = command.slice(0, split);
  const target = command.slice(split + 1);

  function copy() {
    navigator.clipboard
      .writeText(command)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex w-full cursor-pointer items-start gap-3 bg-foreground/5 px-3 py-2 text-left font-mono text-xs text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
    >
      <span className="min-w-0 flex-1">
        {head}{" "}
        <span className="inline-block max-w-full break-all">{target}</span>
      </span>
      <span className="shrink-0 text-foreground/50" aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
