import { GITHUB_REPO, GITHUB_URL } from "@/lib/site";

/** The repository's star count, fetched at most once an hour. */
async function starCount(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const { stargazers_count } = (await response.json()) as {
      stargazers_count?: number;
    };
    return typeof stargazers_count === "number" ? stargazers_count : null;
  } catch {
    return null;
  }
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
    </svg>
  );
}

/** A link to the repository that shows how many stars it has. */
export async function GithubStars() {
  const stars = await starCount();

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={stars === null ? "GitHub" : `Star on GitHub, ${stars} stars`}
      className="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-muted transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
    >
      <GithubIcon className="size-4" />
      {stars === null ? (
        <span className="hidden sm:inline">GitHub</span>
      ) : (
        <span className="flex items-center gap-1 font-mono text-xs tabular-nums">
          <svg viewBox="0 0 16 16" aria-hidden className="size-3" fill="currentColor">
            <path d="M8 .9l2.2 4.46 4.92.72-3.56 3.47.84 4.9L8 12.13l-4.4 2.32.84-4.9L.88 6.08l4.92-.72z" />
          </svg>
          {compact.format(stars)}
        </span>
      )}
    </a>
  );
}
