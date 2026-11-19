import type { Metadata } from "next";

import { ComponentTile } from "@/components/site/component-tile";
import { DocPage, PageTitle } from "@/components/site/doc-page";
import { CATEGORIES, COMPONENTS, componentsIn } from "@/content/docs";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Every fancyborders component, live: structural frames, page structure, shaped outlines, line styles and effects.",
  alternates: { canonical: "/docs/components" },
};

export default function ComponentsPage() {
  return (
    <DocPage
      href="/docs/components"
      headings={CATEGORIES.map(({ id, title }) => ({ id, title }))}
    >
      <PageTitle
        title="Components"
        lead={`All ${COMPONENTS.length} of them, running live. Pick one to tune it and take its code.`}
      />

      <div className="grid gap-16">
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-20">
            <h2 className="text-xl font-semibold tracking-tight">
              {category.title}
            </h2>
            <p className="mt-1 mb-6 text-muted">{category.lead}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {componentsIn(category.id).map((doc) => (
                <ComponentTile key={doc.slug} doc={doc} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocPage>
  );
}
