import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

/** The wordmark: four corner brackets and the name. */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-semibold">
      <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" />
        <rect x="5.25" y="5.25" width="5.5" height="5.5" strokeWidth="1" strokeDasharray="1.5 1.5" />
      </svg>
      {SITE_NAME}
    </Link>
  );
}
