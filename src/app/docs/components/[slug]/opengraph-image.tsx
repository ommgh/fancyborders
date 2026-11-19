import { CATEGORIES, COMPONENTS, componentDoc } from "@/content/docs";
import { CATEGORY_VISUAL, OG_SIZE, OG_TYPE, pageImage } from "@/lib/og";

export const alt = "A fancyborders component";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// One card per component page, all drawn at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const doc = componentDoc((await params).slug)!;
  const category = CATEGORIES.find(({ id }) => id === doc.category)!;
  return pageImage({
    eyebrow: `Components / ${category.title}`,
    title: doc.title,
    description: doc.description,
    footer: `npx shadcn add @fancyborders/${doc.item}`,
    visual: CATEGORY_VISUAL[doc.category],
  });
}
