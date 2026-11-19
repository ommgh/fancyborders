"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { CATEGORIES, COMPONENTS, GUIDES, componentHref } from "@/content/docs";
import { GITHUB_URL, installCommand } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Anything that opens the menu dispatches this, so one dialog serves all. */
const OPEN = "fancyborders:open-search";

export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN));
}

/**
 * Search everything: the guides, every component by name, description or
 * category, and a few actions. Opens with ⌘K, Ctrl+K or /.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";
      if (
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing)
      ) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    const show = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN, show);
    };
  }, []);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:bg-black/50" />
          <Dialog.Popup className="fixed top-[12vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/10 transition-[opacity,scale] duration-150 ease-out outline-none data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
            <Dialog.Title className="sr-only">Search</Dialog.Title>
            <Command loop filter={rank} className="flex max-h-[min(32rem,70vh)] flex-col">
              <div className="flex items-center gap-3 border-b border-line px-4">
                <SearchIcon className="size-4 shrink-0 text-muted" />
                <Command.Input
                  autoFocus
                  placeholder="Search components, guides…"
                  className="h-12 w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-muted"
                />
                <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted sm:block">
                  esc
                </kbd>
              </div>

              <Command.List className="overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="py-10 text-center text-sm text-muted">
                  Nothing found.
                </Command.Empty>

                <Command.Group heading="Guides">
                  {GUIDES.map((page) => (
                    <Item
                      key={page.href}
                      value={`guide ${page.title}`}
                      onSelect={() => run(() => router.push(page.href))}
                      icon={<PageIcon />}
                    >
                      {page.title}
                    </Item>
                  ))}
                </Command.Group>

                {CATEGORIES.map((category) => (
                  <Command.Group key={category.id} heading={category.title}>
                    {COMPONENTS.filter((doc) => doc.category === category.id).map((doc) => (
                      <Item
                        key={doc.slug}
                        value={`${doc.title} ${doc.slug}`}
                        keywords={[category.title, doc.description]}
                        onSelect={() => run(() => router.push(componentHref(doc.slug)))}
                        icon={<FrameIcon />}
                        hint={doc.description}
                      >
                        {doc.title}
                      </Item>
                    ))}
                  </Command.Group>
                ))}

                <Command.Group heading="Actions">
                  <Item
                    value="switch theme light dark mode"
                    onSelect={() =>
                      run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
                    }
                    icon={<ThemeIcon />}
                  >
                    Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
                  </Item>
                  <Item
                    value="copy install command frame cli"
                    onSelect={() =>
                      run(() => void navigator.clipboard.writeText(installCommand("frame")).catch(() => {}))
                    }
                    icon={<CopyIcon />}
                  >
                    Copy install command for Frame
                  </Item>
                  <Item
                    value="github star repository source"
                    onSelect={() => run(() => window.open(GITHUB_URL, "_blank", "noreferrer"))}
                    icon={<ArrowIcon />}
                  >
                    Open on GitHub
                  </Item>
                </Command.Group>
              </Command.List>

              <div className="flex items-center gap-4 border-t border-line px-4 py-2 font-mono text-[0.6875rem] text-muted">
                <span>↑↓ to move</span>
                <span>↵ to open</span>
              </div>
            </Command>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/**
 * Whole-word substring matching rather than cmdk's fuzzy default, which lets
 * a long description match almost anything. Every word typed must appear;
 * a match in the name ranks above one in the description.
 */
function rank(value: string, search: string, keywords: string[] = []) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  const name = value.toLowerCase();
  const rest = keywords.join(" ").toLowerCase();
  let score = 0;
  for (const word of words) {
    if (name.startsWith(word)) score += 3;
    else if (name.includes(word)) score += 2;
    else if (rest.includes(word)) score += 1;
    else return 0;
  }
  return score / (words.length * 3);
}

function Item({
  icon,
  hint,
  children,
  ...props
}: React.ComponentProps<typeof Command.Item> & { icon: ReactNode; hint?: string }) {
  return (
    <Command.Item {...props}>
      <span className="grid size-6 shrink-0 place-items-center rounded-md border border-line text-muted [&>svg]:size-3.5">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{children}</span>
        {hint && <span className="block truncate text-xs text-muted">{hint}</span>}
      </span>
    </Command.Item>
  );
}

/** The search field in the header: a wide pill on larger screens, an icon on phones. */
function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      className={cn(
        "group flex h-8 cursor-pointer items-center gap-2 rounded-md text-sm text-muted transition-colors hover:text-foreground",
        "w-8 justify-center hover:bg-foreground/[0.06]",
        "md:w-56 md:justify-start md:border md:border-line md:bg-surface md:pr-1.5 md:pl-2.5 md:hover:border-foreground/20 md:hover:bg-surface",
      )}
    >
      <SearchIcon className="size-4 shrink-0" />
      <span className="hidden flex-1 text-left md:inline">Search…</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-line bg-background px-1.5 py-0.5 font-mono text-[0.6875rem] md:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────── */

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

const PageIcon = () => (
  <Svg>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Svg>
);

const FrameIcon = () => (
  <Svg>
    <path d="M4 10V6a2 2 0 0 1 2-2h4M20 14v4a2 2 0 0 1-2 2h-4" />
  </Svg>
);

const ThemeIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
  </Svg>
);

const CopyIcon = () => (
  <Svg>
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
