export const SITE_NAME = "fancyborders";

export const SITE_TAGLINE =
  "Borders, frames and enclosures for React and Tailwind.";

export const GITHUB_REPO = "ommgh/fancyborders";

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Where the site and its registry are served. Set NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Address the shadcn CLI installs a registry item from. */
export function registryUrl(item: string) {
  return `${SITE_URL}/r/${item}.json`;
}

export function installCommand(item: string) {
  return `npx shadcn@latest add ${registryUrl(item)}`;
}
