"use client";

import { useState } from "react";

import { CopyButton } from "@/components/site/copy-button";
import { stageClass } from "@/components/site/stage";
import { TabList } from "@/components/site/tabs";
import { PLAYGROUNDS } from "@/content/playgrounds";
import type { Control, Values } from "@/content/playgrounds/define";
import { tokenize } from "@/lib/tokenize";
import { cn } from "@/lib/utils";

/** A component's preview at its default settings, with no controls. */
export function PlaygroundPreview({ slug }: { slug: string }) {
  const playground = PLAYGROUNDS[slug];
  return playground.render(playground.defaults);
}

const TABS = ["Preview", "Code"] as const;

/**
 * The live preview on a component's page: the component, controls for its
 * props, and the code for whatever the controls are set to.
 */
export function Playground({ slug, stage }: { slug: string; stage?: "dark" }) {
  const playground = PLAYGROUNDS[slug];
  const [values, setValues] = useState<Values>(playground.defaults);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Preview");
  // Changing the key remounts the preview, which restarts its animations.
  const [run, setRun] = useState(0);

  const code = playground.code(values);
  const changed = Object.keys(values).some(
    (name) => values[name] !== playground.defaults[name],
  );

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between border-b border-foreground/10 px-1.5 py-1">
        <TabList tabs={TABS} value={tab} onChange={setTab} />
        <div className="flex items-center">
          {tab === "Code" ? (
            <CopyButton text={code} />
          ) : (
            <button
              type="button"
              onClick={() => setRun((count) => count + 1)}
              className="cursor-pointer px-2 py-1 font-mono text-xs text-foreground/50 transition-colors hover:text-foreground"
            >
              Replay
            </button>
          )}
        </div>
      </div>

      {tab === "Preview" ? (
        <div
          key={run}
          className={cn(
            "grid min-h-80 place-items-center overflow-hidden p-8",
            stageClass(stage),
          )}
        >
          {playground.render(values)}
        </div>
      ) : (
        <LiveCode code={code} className="min-h-80 bg-foreground/[0.03]" />
      )}

      <div className="border-t border-foreground/10">
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="font-mono text-xs text-foreground/50">Customize</p>
          <button
            type="button"
            disabled={!changed}
            onClick={() => setValues(playground.defaults)}
            className="cursor-pointer font-mono text-xs text-foreground/50 transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-0"
          >
            Reset
          </button>
        </div>
        <div className="grid gap-x-6 gap-y-1 p-4 pt-2 sm:grid-cols-2">
          {Object.entries(playground.controls).map(([name, control]) => (
            <ControlRow
              key={name}
              control={control}
              value={values[name]}
              onChange={(value) =>
                setValues((current) => ({ ...current, [name]: value }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Code ──────────────────────────────────────────────────────────────── */

const TOKEN_COLOR = {
  plain: undefined,
  keyword: "var(--code-token-keyword)",
  string: "var(--code-token-string-expression)",
  comment: "var(--code-token-comment)",
  constant: "var(--code-token-constant)",
  function: "var(--code-token-function)",
} as const;

function LiveCode({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cn("site-code", className)}>
      <pre>
        <code>
          {tokenize(code).map((token, index) => (
            <span key={index} style={{ color: TOKEN_COLOR[token.kind] }}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────────── */

type Value = Values[string];

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: Value;
  onChange: (value: Value) => void;
}) {
  const row = "flex min-h-9 items-center gap-3 text-sm";
  const name = <span className="w-28 shrink-0 text-foreground/70">{control.label}</span>;

  switch (control.type) {
    case "range":
      return (
        <label className={row}>
          {name}
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={Number(value)}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-foreground"
          />
          <span className="w-14 shrink-0 text-right font-mono text-xs text-foreground/60 tabular-nums">
            {String(value)}
            {control.unit}
          </span>
        </label>
      );

    case "select":
      return (
        <label className={row}>
          {name}
          <select
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 cursor-pointer border border-foreground/15 bg-background px-2 py-1 font-mono text-xs"
          >
            {control.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      );

    case "toggle":
      return (
        <label className={cn(row, "cursor-pointer")}>
          {name}
          <span className="flex-1" />
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 shrink-0 bg-foreground/15 transition-colors peer-checked:bg-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground peer-checked:[&>span]:translate-x-4">
            <span className="absolute top-0.5 left-0.5 size-4 bg-background transition-transform" />
          </span>
        </label>
      );

    case "color":
      return (
        <label className={row}>
          {name}
          <span className="flex-1" />
          <span className="font-mono text-xs text-foreground/60">
            {String(value)}
          </span>
          <input
            type="color"
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
            className="size-6 shrink-0 cursor-pointer border border-foreground/15 bg-transparent p-0"
          />
        </label>
      );
  }
}
