"use client";

import { useState, type ReactNode } from "react";

import { TabList } from "@/components/site/tabs";

const TABS = ["Preview", "Code"] as const;

/** A panel that switches between a rendered preview and its code. */
export function PreviewTabs({
  preview,
  code,
  copy,
}: {
  preview: ReactNode;
  code: ReactNode;
  /** Shown beside the tabs while the code is open. */
  copy?: ReactNode;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Preview");

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex min-h-9 items-center justify-between border-b border-line px-1.5 py-1">
        <TabList tabs={TABS} value={tab} onChange={setTab} />
        {tab === "Code" && copy}
      </div>
      {tab === "Preview" ? preview : code}
    </div>
  );
}
