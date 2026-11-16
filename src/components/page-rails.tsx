import {
  Frame,
  FrameFill,
  FrameRules,
  len,
  type FrameFillProps,
  type FrameProps,
  type Length,
} from "@/components/ui/frame";

export type PageRailsProps = FrameProps & {
  /**
   * How far the rails run past the top and bottom of the column. `true`
   * runs them a full viewport height each way; the page then needs
   * `overflow-y: clip` on an ancestor.
   */
  bleed?: boolean | Length;
  /**
   * Width of a gutter down each side: a second pair of rails is drawn this
   * far inside the first, and the content sits between the inner pair.
   */
  gutter?: Length;
  /** Pattern drawn in the gutters. */
  fill?: FrameFillProps["pattern"];
  /** Dash length. Setting `dash` or `gap` makes the rails dashed. */
  dash?: Length;
  /** Space between dashes. */
  gap?: Length;
};

/**
 * The column a page is laid out in: a vertical rail down each side, for
 * section rules, dividers and grids to meet. Everything inside sits flush
 * with the rails, so pad the sections rather than the column.
 */
export function PageRails({
  bleed = false,
  gutter,
  fill,
  dash,
  gap,
  style,
  children,
  ...props
}: PageRailsProps) {
  const overshoot = bleed === true ? "100vh" : bleed === false ? 0 : bleed;
  const width = gutter ? len(gutter) : undefined;
  const rails = {
    sides: ["left", "right"],
    overshoot: { y: overshoot },
    dash,
    gap,
  } as const;

  // A gutter's pattern, between its two rails and as tall as they are.
  const strip = (side: "left" | "right") => (
    <FrameFill
      pattern={fill}
      style={{
        inset: `calc(${len(overshoot)} * -1) auto`,
        [side]: "var(--fb-line)",
        width: `calc(${width} - var(--fb-line))`,
      }}
    />
  );

  return (
    <Frame
      data-slot="page-rails"
      style={width ? { paddingInline: width, ...style } : style}
      {...props}
    >
      <FrameRules {...rails} />
      {width && <FrameRules {...rails} offset={`calc(${width} * -1)`} />}
      {width && fill && strip("left")}
      {width && fill && strip("right")}
      {children}
    </Frame>
  );
}
