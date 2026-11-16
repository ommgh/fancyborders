import type { ComponentType } from "react";

import BeamShape from "./beam-shape";
import BeamUtilities from "./beam-utilities";
import DividerRails from "./divider-rails";
import FrameCustomMark from "./frame-custom-mark";
import FrameTokens from "./frame-tokens";
import GlowShape from "./glow-shape";
import GradientComet from "./gradient-comet";
import GradientUtilities from "./gradient-utilities";
import GridHover from "./grid-hover";
import GridResponsive from "./grid-responsive";
import PageLayout from "./page-layout";
import RuleStyles from "./rule-styles";
import ShapeMixed from "./shape-mixed";
import ShapeVariants from "./shape-variants";

/**
 * Static examples, by file name. A page shows the example running and, read
 * from the same file, its source.
 */
export const DEMOS: Record<string, ComponentType> = {
  "beam-shape": BeamShape,
  "beam-utilities": BeamUtilities,
  "divider-rails": DividerRails,
  "frame-custom-mark": FrameCustomMark,
  "frame-tokens": FrameTokens,
  "glow-shape": GlowShape,
  "gradient-comet": GradientComet,
  "gradient-utilities": GradientUtilities,
  "grid-hover": GridHover,
  "grid-responsive": GridResponsive,
  "page-layout": PageLayout,
  "rule-styles": RuleStyles,
  "shape-mixed": ShapeMixed,
  "shape-variants": ShapeVariants,
};
