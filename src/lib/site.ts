export const SITE_NAME = "fancyborders";

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Where the site and its registry are served. Set NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

export function installCommand(item: string) {
  return `npx shadcn@latest add ${SITE_URL}/r/${item}.json`;
}
