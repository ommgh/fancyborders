"use client";

import { Menu } from "@base-ui/react/menu";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { markdownPath } from "@/lib/site";

/*
 * Under every docs page's title: copy the page as Markdown for an AI
 * assistant, or open it in one directly. The site's address comes from
 * the server, where the hosting platform's variables are readable.
 */
export function PageActions({ siteUrl }: { siteUrl: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const markdown = markdownPath(pathname);
  const address = `${siteUrl}${markdown}`;
  const ask = encodeURIComponent(
    `Read ${address} so you can answer questions about it and help me use it in my project.`,
  );

  async function copy() {
    try {
      const response = await fetch(markdown);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1600);
  }

  const button =
    "flex h-8 cursor-pointer items-center gap-1.5 border border-line bg-surface px-2.5 text-xs text-muted transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-foreground/10";

  return (
    <div className="mt-5 flex items-center">
      <button type="button" onClick={copy} aria-live="polite" className={`${button} rounded-l-lg`}>
        <Icon>
          <rect x="8" y="8" width="13" height="13" rx="2" />
          <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </Icon>
        {state === "copied" ? "Copied" : state === "failed" ? "Could not copy" : "Copy page"}
      </button>
      <Menu.Root>
        <Menu.Trigger aria-label="More ways to use this page" className={`${button} -ml-px rounded-r-lg px-2 data-[popup-open]:text-foreground`}>
          <Icon>
            <path d="m6 9 6 6 6-6" />
          </Icon>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={6} align="start" className="z-50 outline-none">
            <Menu.Popup className="min-w-56 origin-(--transform-origin) rounded-xl border border-line bg-surface p-1 shadow-lg shadow-black/10 transition-[opacity,scale] duration-150 ease-out outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
              <Item href={markdown} label="View as Markdown" hint="Plain text for agents">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
              </Item>
              <Item href={`https://claude.ai/new?q=${ask}`} label="Open in Claude" hint="Ask about this page">
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
              </Item>
              <Item href={`https://chatgpt.com/?q=${ask}`} label="Open in ChatGPT" hint="Ask about this page">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M8.5 12h7M12 8.5v7" />
              </Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}

function Item({
  href,
  label,
  hint,
  children,
}: {
  href: string;
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <Menu.LinkItem
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-[highlighted]:bg-foreground/[0.07]"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line text-muted">
        <Icon>{children}</Icon>
      </span>
      <span>
        <span className="block">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </Menu.LinkItem>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
