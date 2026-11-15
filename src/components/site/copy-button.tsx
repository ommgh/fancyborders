"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  /** What goes on the clipboard. */
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      .writeText(text)
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
      aria-live="polite"
      className={cn(
        "shrink-0 cursor-pointer px-2 py-1 font-mono text-xs text-foreground/50 transition-colors hover:text-foreground",
        className,
      )}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
