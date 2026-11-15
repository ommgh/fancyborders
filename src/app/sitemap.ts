import type { MetadataRoute } from "next";

import { PAGES } from "@/content/docs";
import { SITE_URL } from "@/lib/site";

/** Every page on the site, for search engines. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...PAGES.map((page) => page.href)].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
  }));
}
