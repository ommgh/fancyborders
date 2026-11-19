import type { ApiTable } from "@/content/api";

/** The props of one component, as a table. */
export function PropsTable({ table }: { table: ApiTable }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line font-mono text-xs text-muted">
            <th className="px-4 py-2 font-normal">Prop</th>
            <th className="px-4 py-2 font-normal">Type</th>
            <th className="px-4 py-2 font-normal">Default</th>
          </tr>
        </thead>
        <tbody>
          {table.props.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-line align-top last:border-0"
            >
              <td className="px-4 py-3 font-mono text-[0.8125rem] whitespace-nowrap">
                {prop.name}
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[0.8125rem] text-(--code-token-constant)">
                  {prop.type}
                </code>
                <p className="mt-1 text-muted">{prop.description}</p>
              </td>
              <td className="px-4 py-3 font-mono text-[0.8125rem] whitespace-nowrap text-muted">
                {prop.default ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
