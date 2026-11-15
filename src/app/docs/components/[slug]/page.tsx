import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/site/code-block";
import { DocPage, H2, H3, InlineCode, P, PageTitle } from "@/components/site/doc-page";
import { Example } from "@/components/site/example";
import { Install } from "@/components/site/install";
import { Playground } from "@/components/site/playground";
import { PropsTable } from "@/components/site/props-table";
import type { Heading } from "@/components/site/table-of-contents";
import { API } from "@/content/api";
import {
  CATEGORIES,
  COMPONENTS,
  componentDoc,
  componentHref,
} from "@/content/docs";
import { registryItem } from "@/lib/registry";

// Only the pages listed here exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/docs/components/[slug]">): Promise<Metadata> {
  const doc = componentDoc((await params).slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: componentHref(doc.slug) },
  };
}

const anchor = (name: string) => name.toLowerCase();

export default async function ComponentPage({
  params,
}: PageProps<"/docs/components/[slug]">) {
  const doc = componentDoc((await params).slug);
  if (!doc) notFound();

  const category = CATEGORIES.find(({ id }) => id === doc.category)!;
  const item = registryItem(doc.item);

  const headings: Heading[] = [
    { id: "installation", title: "Installation" },
    ...(doc.examples
      ? [
          { id: "examples", title: "Examples" },
          ...doc.examples.map((example) => ({
            id: example.demo,
            title: example.title,
            depth: 3 as const,
          })),
        ]
      : []),
    ...(doc.notes ? [{ id: "notes", title: "Good to know" }] : []),
    { id: "api", title: "API reference" },
    ...doc.api.map((name) => ({
      id: anchor(name),
      title: name,
      depth: 3 as const,
    })),
  ];

  return (
    <DocPage href={componentHref(doc.slug)} headings={headings}>
      <PageTitle
        eyebrow={
          <>
            <Link href="/docs/components" className="hover:text-foreground">
              Components
            </Link>
            {" / "}
            <Link
              href={`/docs/components#${category.id}`}
              className="hover:text-foreground"
            >
              {category.title}
            </Link>
          </>
        }
        title={doc.title}
        lead={doc.description}
      />

      <Playground slug={doc.slug} stage={doc.stage} />

      <H2 id="installation">Installation</H2>
      {doc.recipe && (
        <P>
          {doc.title} is a recipe: a few layers of{" "}
          <InlineCode>{item.name}</InlineCode> put together, not a component of
          its own. Install <InlineCode>{item.name}</InlineCode>, then copy the
          code from the preview above.
        </P>
      )}
      <Install item={doc.item} />

      {doc.examples && (
        <>
          <H2 id="examples">Examples</H2>
          {doc.examples.map((example) => (
            <section key={example.demo}>
              <H3 id={example.demo}>{example.title}</H3>
              {example.description && <P>{example.description}</P>}
              <Example example={example} />
            </section>
          ))}
        </>
      )}

      {doc.notes && (
        <>
          <H2 id="notes">Good to know</H2>
          <ul className="grid gap-3">
            {doc.notes.map((note) => (
              <li
                key={note}
                className="border-l-2 border-foreground/15 pl-4 leading-7 text-foreground/80"
              >
                {note}
              </li>
            ))}
          </ul>
        </>
      )}

      <H2 id="api">API reference</H2>
      {doc.api.map((name) => {
        const table = API[name];
        return (
          <section key={name}>
            <H3 id={anchor(name)}>{name}</H3>
            <CodeBlock code={`import { ${name} } from "${table.from}";`} />
            <div className="mt-4">
              <PropsTable table={table} />
            </div>
            {table.extends && (
              <p className="mt-3 text-sm text-foreground/60">{table.extends}</p>
            )}
          </section>
        );
      })}
    </DocPage>
  );
}
