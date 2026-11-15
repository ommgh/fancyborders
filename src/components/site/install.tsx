import Link from "next/link";

import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { Tabs } from "@/components/site/tabs";
import { readSource, withDependencies } from "@/lib/registry";
import { registryUrl } from "@/lib/site";

/**
 * How to add a registry item: the CLI command, or every file to copy by
 * hand, dependencies first.
 */
export function Install({ item }: { item: string }) {
  const items = withDependencies(item);
  const stylesheets = items.filter((entry) => entry.css);

  return (
    <Tabs labels={["CLI", "Manual"]}>
      <div>
        <InstallCommand url={registryUrl(item)} />
        <p className="mt-3 text-sm text-foreground/60">
          The CLI copies the component into your project, adds anything it is
          built on, and writes its CSS into your global stylesheet. New to the
          CLI? See{" "}
          <Link href="/docs/installation" className="underline underline-offset-4">
            Installation
          </Link>
          .
        </p>
      </div>

      <ol className="grid gap-8">
        <Step number={1} title="Copy the source">
          <div className="grid gap-4">
            {items.flatMap((entry) =>
              entry.files.map((file) => (
                <CodeBlock
                  key={file}
                  title={file.replace(/^src\//, "")}
                  code={readSource(file)}
                  scroll
                />
              )),
            )}
          </div>
        </Step>
        {stylesheets.length > 0 && (
          <Step number={2} title="Add the CSS to your global stylesheet, after Tailwind">
            <div className="grid gap-4">
              {stylesheets.map((entry) => (
                <CodeBlock
                  key={entry.name}
                  title={`${entry.name}.css`}
                  code={readSource(entry.css!)}
                  lang="css"
                  scroll
                />
              ))}
            </div>
          </Step>
        )}
      </ol>
    </Tabs>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="min-w-0">
      <p className="mb-3 flex items-baseline gap-3 text-sm font-medium">
        <span className="font-mono text-xs text-foreground/50">0{number}</span>
        {title}
      </p>
      {children}
    </li>
  );
}
