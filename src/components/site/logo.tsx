import Link from "next/link";

import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The mark: two opposite corner brackets, the smallest drawing of a frame.
 * Also the favicon (src/app/icon.svg).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 9V4.5a2 2 0 0 1 2-2H9" />
      <path d="M17.5 11v4.5a2 2 0 0 1-2 2H11" />
    </svg>
  );
}

/** The mark and the name, set in a serif italic for its curved f. */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
      <LogoMark />
      <span className="-mb-0.5 font-logo text-[1.4rem] leading-none tracking-[-0.01em]">
        {SITE_NAME}
      </span>
    </Link>
  );
}
