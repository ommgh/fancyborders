"use client";

import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
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
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-1.5 py-1">
        <TabList tabs={TABS} value={tab} onChange={setTab} />
        <div className="flex items-center">
          {tab === "Code" ? (
            <CopyButton text={code} />
          ) : (
            <button
              type="button"
              onClick={() => setRun((count) => count + 1)}
              className="cursor-pointer px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-foreground"
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

      <div className="border-t border-line">
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="font-mono text-xs text-muted">Customize</p>
          <button
            type="button"
            disabled={!changed}
            onClick={() => setValues(playground.defaults)}
            className="cursor-pointer font-mono text-xs text-muted transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-0"
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

/*
 * The controls are Base UI's slider, select and switch, styled to match the
 * rounded panels around them rather than the browser's own widgets.
 */
function ControlRow({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: Value;
  onChange: (value: Value) => void;
}) {
  const row = "flex min-h-10 items-center gap-3 text-sm";
  const name = <span className="w-28 shrink-0 text-foreground/75">{control.label}</span>;

  switch (control.type) {
    case "range":
      return (
        <div className={row}>
          {name}
          <Slider.Root
            value={Number(value)}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
            aria-label={control.label}
            className="min-w-0 flex-1"
          >
            <Slider.Control className="flex h-5 cursor-pointer touch-none items-center">
              <Slider.Track className="relative h-1.5 w-full rounded-full bg-foreground/10">
                <Slider.Indicator className="rounded-full bg-foreground/70" />
                <Slider.Thumb className="size-4 rounded-full border border-line bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.18)] transition-[scale,box-shadow] duration-150 outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-foreground/15 data-[dragging]:scale-110" />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
          <span className="w-12 shrink-0 text-right font-mono text-xs text-muted tabular-nums">
            {String(value)}
            {control.unit}
          </span>
        </div>
      );

    case "select":
      return (
        <div className={row}>
          {name}
          <Select.Root value={String(value)} onValueChange={(next) => next !== null && onChange(next)}>
            <Select.Trigger
              aria-label={control.label}
              className="flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 rounded-lg border border-line bg-background pr-2 pl-3 font-mono text-xs transition-colors outline-none hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-foreground/10 data-[popup-open]:border-foreground/20"
            >
              <Select.Value className="truncate" />
              <Select.Icon className="text-muted">
                <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 6.5 3-3 3 3M5 9.5l3 3 3-3" />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-50 outline-none">
                <Select.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-xl border border-line bg-surface p-1 shadow-lg shadow-black/10 transition-[opacity,scale] duration-150 ease-out outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                  {control.options.map((option) => (
                    <Select.Item
                      key={option}
                      value={option}
                      className="flex h-8 cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 font-mono text-xs outline-none select-none data-[highlighted]:bg-foreground/[0.07]"
                    >
                      <Select.ItemText>{option}</Select.ItemText>
                      <Select.ItemIndicator>
                        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      );

    case "toggle":
      return (
        <div className={row}>
          {name}
          <span className="flex-1" />
          <Switch.Root
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
            aria-label={control.label}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-foreground/15 p-0.5 transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-foreground/15 data-[checked]:bg-foreground/80"
          >
            <Switch.Thumb className="size-4 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] data-[checked]:translate-x-4" />
          </Switch.Root>
        </div>
      );

    case "color":
      return (
        <label className={cn(row, "cursor-pointer")}>
          {name}
          <span className="flex-1" />
          <span className="font-mono text-xs text-muted">{String(value)}</span>
          <span className="relative size-6 shrink-0 overflow-hidden rounded-full border border-line shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
            <span className="absolute inset-0" style={{ background: String(value) }} />
            <input
              type="color"
              value={String(value)}
              onChange={(event) => onChange(event.target.value)}
              aria-label={control.label}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </span>
        </label>
      );
  }
}
