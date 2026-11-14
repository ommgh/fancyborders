import type { ReactNode } from "react";

import { ShapeFrame, type ShapeFrameProps } from "@/components/ui/shape-frame";
import { cn } from "@/lib/utils";

export type TicketFrameProps = Omit<
  ShapeFrameProps,
  "corner" | "corners" | "punch" | "size"
> & {
  /** Content of the tear-off stub on the right. */
  stub: ReactNode;
  /** Width of the stub, in pixels. */
  stubWidth?: number;
  /** Radius of the bites at the top and bottom of the perforation. */
  punchRadius?: number;
  /** Radius of the outer corners. */
  radius?: number;
};

/**
 * A ticket: rounded corners, a perforated line, and a bite out of the top
 * and bottom edges where the stub tears off.
 */
export function TicketFrame({
  stub,
  stubWidth = 112,
  punchRadius = 9,
  radius = 12,
  className,
  children,
  ...props
}: TicketFrameProps) {
  const perforation = `calc(100% - ${stubWidth}px)`;

  return (
    <ShapeFrame
      corner="round"
      size={radius}
      punch={{ sides: ["top", "bottom"], at: perforation, radius: punchRadius }}
      className={cn("flex", className)}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <span
        aria-hidden
        className="pointer-events-none absolute w-0 border-l border-dashed border-(--fb-line-color)"
        style={{
          left: perforation,
          top: punchRadius + 6,
          bottom: punchRadius + 6,
        }}
      />
      <div className="shrink-0" style={{ width: stubWidth }}>
        {stub}
      </div>
    </ShapeFrame>
  );
}
