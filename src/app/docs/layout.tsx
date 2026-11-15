import { SidebarNav } from "@/components/site/sidebar-nav";

/** The docs shell: the navigation down the left, the page beside it. */
export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto w-full max-w-[90rem] flex-1 px-4 sm:px-6 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden border-r border-foreground/10 lg:block">
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10 pr-6">
          <SidebarNav />
        </div>
      </aside>
      {children}
    </div>
  );
}
