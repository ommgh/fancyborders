import { SidebarNav } from "@/components/site/sidebar-nav";

/** The docs shell: the navigation down the left, the page beside it. */
export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="flex-1 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-line lg:block">
        <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto px-3 py-8">
          <SidebarNav />
        </div>
      </aside>
      <div className="min-w-0 px-4 sm:px-8">{children}</div>
    </div>
  );
}
