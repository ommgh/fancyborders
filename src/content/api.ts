/*
 * Props of every exported component, for the API reference on each page.
 * Keep these in step with the types in src/components.
 */

export type Prop = {
  name: string;
  type: string;
  /** Left out when the prop has no default. */
  default?: string;
  description: string;
};

export type ApiTable = {
  /** Where the component is imported from. */
  from: string;
  /** What else the component accepts, in a sentence. */
  extends?: string;
  props: Prop[];
};

const FRAME = "@/components/ui/frame";
const EFFECTS = "@/components/ui/frame-effects";

const offset: Prop = {
  name: "offset",
  type: "number | string",
  default: "0",
  description:
    "Distance from the frame's edge. Positive is outward, negative inward.",
};

const radius: Prop = {
  name: "radius",
  type: "number | string",
  description: "Overrides the frame's radius for this layer.",
};

const color: Prop = {
  name: "color",
  type: "string",
  description: "Overrides the frame's line colour for this layer.",
};

const thickness: Prop = {
  name: "thickness",
  type: "number | string",
  description: "Line width, when different from the frame's.",
};

const colors: Prop = {
  name: "colors",
  type: "string[]",
  description:
    "Colour stops, in order. Without them the layer reads the frame-from-*, frame-via-* and frame-to-* utilities.",
};

const paint: Prop[] = [
  colors,
  {
    name: "gradient",
    type: "string",
    description: "Any CSS image, in place of the gradient built from the colours.",
  },
  {
    name: "angle",
    type: "number | string",
    default: "135",
    description: "Direction of the gradient. Numbers are degrees.",
  },
  {
    name: "spin",
    type: "boolean | number",
    default: "false",
    description:
      "Turn the gradient around the frame. A number is the seconds one turn takes; true is 4.",
  },
];

const LAYER = "Also accepts every div attribute, such as className and style.";
const FRAME_PROPS = "Also accepts every Frame prop and every div attribute.";
const SHAPE_PROPS = "Also accepts line, fill, color and every div attribute.";

export const API: Record<string, ApiTable> = {
  Frame: {
    from: FRAME,
    extends: "Also accepts every div attribute, such as className and style.",
    props: [
      {
        name: "radius",
        type: "number | string",
        default: "0",
        description: "Corner radius shared by the frame and its layers.",
      },
      {
        name: "line",
        type: "number | string",
        default: "1",
        description: "Line width shared by borders, rules and marks.",
      },
      {
        name: "color",
        type: "string",
        default: "22% of the text colour",
        description: "Line colour for borders, rules and fills.",
      },
    ],
  },
  FrameBorder: {
    from: FRAME,
    extends: LAYER,
    props: [
      {
        name: "variant",
        type: '"solid" | "dashed" | "dotted" | "double"',
        default: '"solid"',
        description: "The CSS border style.",
      },
      offset,
      radius,
      color,
    ],
  },
  FrameRules: {
    from: FRAME,
    extends: LAYER,
    props: [
      {
        name: "sides",
        type: '("top" | "right" | "bottom" | "left")[]',
        default: "all four",
        description: "Which sides get a line.",
      },
      {
        name: "overshoot",
        type: "number | string | { x?, y? }",
        default: "0",
        description:
          "How far the lines run past the corners. x extends the horizontal lines, y the vertical ones.",
      },
      {
        name: "dash",
        type: "number | string",
        default: "4",
        description: "Dash length. Setting dash or gap makes the lines dashed.",
      },
      {
        name: "gap",
        type: "number | string",
        default: "4",
        description: "Space between dashes.",
      },
      {
        name: "march",
        type: "boolean | number",
        default: "false",
        description:
          "Make the dashes travel clockwise. A number is the seconds a dash takes to reach the next one's place; true is 0.6.",
      },
      offset,
      color,
    ],
  },
  FrameCorners: {
    from: FRAME,
    extends: LAYER,
    props: [
      {
        name: "mark",
        type: '"bracket" | "square" | "plus" | "dot"',
        default: '"bracket"',
        description: "Built-in mark. Ignored when children are given.",
      },
      {
        name: "children",
        type: "ReactNode",
        description:
          "A custom mark, drawn for the top-left corner and repeated on the rest.",
      },
      {
        name: "corners",
        type: '("tl" | "tr" | "br" | "bl")[]',
        default: "all four",
        description: "Which corners get a mark.",
      },
      {
        name: "size",
        type: "number | string",
        default: "12, 7, 11 or 5",
        description:
          "Width and height of each mark. The default depends on the mark: bracket, square, plus, dot.",
      },
      {
        name: "thickness",
        type: "number | string",
        description: "Line width of the mark, when different from the frame's.",
      },
      {
        name: "align",
        type: '"inside" | "center"',
        description:
          "inside tucks the mark into the corner, center centres it on the frame's line. Brackets and custom marks default to inside.",
      },
      {
        name: "rotate",
        type: "boolean",
        default: "true",
        description: "Rotate each mark to face its corner. Turn off for upright content.",
      },
      offset,
      {
        name: "radius",
        type: "number | string",
        description: "Radius of a bracket's corner, when different from the frame's.",
      },
      { ...color, description: "Colour of the marks. Defaults to the text colour." },
    ],
  },
  FrameFill: {
    from: FRAME,
    extends: LAYER,
    props: [
      {
        name: "pattern",
        type: '"hatch" | "cross" | "dots" | "grid"',
        default: '"hatch"',
        description: "The pattern painted behind the content.",
      },
      {
        name: "size",
        type: "number | string",
        default: "6",
        description: "Spacing between lines or dots.",
      },
      {
        name: "thickness",
        type: "number | string",
        default: "1",
        description: "Line width, or dot radius.",
      },
      {
        name: "angle",
        type: "string",
        default: '"135deg"',
        description: "Direction of the hatch lines.",
      },
      {
        name: "inset",
        type: "number | string",
        default: "0",
        description: "Distance kept clear from the frame's edge.",
      },
      { ...color, description: "Colour of the pattern. Defaults to the line colour." },
    ],
  },
  BracketFrame: {
    from: "@/components/bracket-frame",
    extends: FRAME_PROPS,
    props: [
      {
        name: "bracket",
        type: "number | string",
        default: "14",
        description: "Length of each bracket arm.",
      },
      {
        name: "thickness",
        type: "number | string",
        default: "2",
        description: "Line width of the brackets.",
      },
      {
        name: "gap",
        type: "number",
        default: "6",
        description: "Space between the brackets and the dashed border inside them.",
      },
    ],
  },
  HatchDivider: {
    from: "@/components/hatch-divider",
    extends: FRAME_PROPS + " Set its height with a class such as h-5.",
    props: [
      {
        name: "bleed",
        type: "boolean | number | string",
        default: "false",
        description:
          "How far the top and bottom lines run past the band. true runs them a full viewport width each way.",
      },
      {
        name: "mark",
        type: '"bracket" | "square" | "plus" | "dot" | false',
        default: '"square"',
        description: "Mark drawn where the band's lines meet its sides.",
      },
    ],
  },
  PageRails: {
    from: "@/components/page-rails",
    extends: FRAME_PROPS,
    props: [
      {
        name: "bleed",
        type: "boolean | number | string",
        default: "false",
        description:
          "How far the rails run past the top and bottom of the column. true runs them a full viewport height each way.",
      },
      {
        name: "gutter",
        type: "number | string",
        description:
          "Width of a gutter down each side. A second pair of rails is drawn this far inside the first, and the content sits between the inner pair.",
      },
      {
        name: "fill",
        type: '"hatch" | "cross" | "dots" | "grid"',
        description: "Pattern drawn in the gutters.",
      },
      {
        name: "dash",
        type: "number | string",
        default: "4",
        description: "Dash length. Setting dash or gap makes the rails dashed.",
      },
      {
        name: "gap",
        type: "number | string",
        default: "4",
        description: "Space between dashes.",
      },
    ],
  },
  SectionRule: {
    from: "@/components/section-rule",
    extends: FRAME_PROPS,
    props: [
      {
        name: "bleed",
        type: "boolean | number | string",
        default: "false",
        description:
          "How far the line runs past each end. true runs it a full viewport width each way.",
      },
      {
        name: "mark",
        type: '"bracket" | "square" | "plus" | "dot" | false',
        default: '"square"',
        description: "Mark drawn on each end of the line.",
      },
      {
        name: "dash",
        type: "number | string",
        default: "4",
        description: "Dash length. Setting dash or gap makes the line dashed.",
      },
      {
        name: "gap",
        type: "number | string",
        default: "4",
        description: "Space between dashes.",
      },
    ],
  },
  SectionGrid: {
    from: "@/components/ui/section-grid",
    extends:
      FRAME_PROPS +
      " Set the columns with a class from section-cols-1 to section-cols-8.",
    props: [
      {
        name: "variant",
        type: '"solid" | "dashed" | "dotted"',
        default: '"solid"',
        description: "Line style of the lines between cells, and of the outline.",
      },
      {
        name: "mark",
        type: '"plus" | "square" | "dot" | false',
        default: "false",
        description: "Mark drawn on every crossing of two lines.",
      },
      {
        name: "markSize",
        type: "number | string",
        default: "11, 7 or 5",
        description:
          "Width and height of each mark. The default depends on the mark: plus, square, dot.",
      },
      {
        name: "outline",
        type: "boolean",
        default: "false",
        description: "Draw a border around the whole grid as well.",
      },
    ],
  },
  ShapeFrame: {
    from: "@/components/ui/shape-frame",
    extends: "Also accepts every Frame prop except radius, and every div attribute.",
    props: [
      {
        name: "corner",
        type: "CornerShape | Partial<Record<Corner, CornerShape>>",
        default: '"bevel"',
        description:
          'Corner treatment: "square", "round", "bevel", "notch" or "scoop". One for every corner, or an object with one per corner.',
      },
      {
        name: "corners",
        type: '("tl" | "tr" | "br" | "bl")[]',
        default: "all four",
        description: "Limits a single corner treatment to these corners.",
      },
      {
        name: "size",
        type: "number",
        default: "12",
        description: "Size of the corner treatment, in pixels.",
      },
      {
        name: "line",
        type: "number",
        default: "1",
        description: "Line width, in pixels.",
      },
      {
        name: "punch",
        type: "{ sides?, at?, radius? }",
        description:
          "Semicircular bites out of the edges: which sides (left and right by default), where along the edge (the middle), and their radius (8).",
      },
      {
        name: "fill",
        type: "string",
        description: "Background painted inside the shape. Any CSS background works.",
      },
      {
        name: "path",
        type: "ShapePath",
        description:
          "A ready-made outline from polygonPaths, in place of the corners and the punch.",
      },
    ],
  },
  FolderFrame: {
    from: "@/components/folder-frame",
    extends: SHAPE_PROPS,
    props: [
      {
        name: "tab",
        type: "ReactNode",
        description: "Content of the tab, such as a label.",
      },
      {
        name: "tabSide",
        type: '"left" | "right"',
        default: '"left"',
        description: "Which end of the top edge the tab sits on.",
      },
      {
        name: "tabWidth",
        type: "number",
        default: "112",
        description: "Width of the tab's top edge, in pixels.",
      },
      {
        name: "tabHeight",
        type: "number",
        default: "28",
        description: "Height of the tab, in pixels.",
      },
      {
        name: "slope",
        type: "number",
        default: "14",
        description:
          "How far the tab's shoulder runs sideways on its way down, in pixels.",
      },
      {
        name: "radius",
        type: "number",
        default: "10",
        description: "Radius of the corners, in pixels.",
      },
    ],
  },
  BubbleFrame: {
    from: "@/components/bubble-frame",
    extends: SHAPE_PROPS,
    props: [
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "The edge the tail points out of.",
      },
      {
        name: "at",
        type: "number | `${number}%`",
        default: "28",
        description:
          "Where the tail sits along its edge: pixels from the left or top, pixels from the other end when negative, or a percentage.",
      },
      {
        name: "tailSize",
        type: "number",
        default: "10",
        description: "How far the tail sticks out, in pixels.",
      },
      {
        name: "tailWidth",
        type: "number",
        default: "16",
        description: "Width of the tail where it joins the bubble, in pixels.",
      },
      {
        name: "lean",
        type: "number",
        default: "0",
        description:
          "How far the tip leans along the edge, in pixels. Negative leans back.",
      },
      {
        name: "radius",
        type: "number",
        default: "14",
        description: "Radius of the corners, in pixels.",
      },
    ],
  },
  EdgeFrame: {
    from: "@/components/edge-frame",
    extends: SHAPE_PROPS,
    props: [
      {
        name: "edge",
        type: '"zigzag" | "wave" | "scallop" | "bite"',
        default: '"zigzag"',
        description:
          "The pattern cut into the edges: zigzag teeth, a wave, a scallop of round bumps, or round bites like the edge of a stamp.",
      },
      {
        name: "sides",
        type: '("top" | "right" | "bottom" | "left")[]',
        default: "top and bottom",
        description: "Which edges get the pattern.",
      },
      {
        name: "size",
        type: "number",
        default: "16",
        description:
          "Length of one tooth, wave or bump, in pixels. Each edge fits a whole number of them, so the real length is the closest that divides it.",
      },
      {
        name: "depth",
        type: "number",
        default: "8",
        description: "How far the pattern reaches in from the edge, in pixels.",
      },
    ],
  },
  TicketFrame: {
    from: "@/components/ticket-frame",
    extends: "Also accepts line, fill, color and every div attribute.",
    props: [
      {
        name: "stub",
        type: "ReactNode",
        description: "Content of the tear-off stub on the right. Required.",
      },
      {
        name: "stubWidth",
        type: "number",
        default: "112",
        description: "Width of the stub, in pixels.",
      },
      {
        name: "punchRadius",
        type: "number",
        default: "9",
        description: "Radius of the bites at the top and bottom of the perforation.",
      },
      {
        name: "radius",
        type: "number",
        default: "12",
        description: "Radius of the outer corners.",
      },
    ],
  },
  FrameGradient: {
    from: EFFECTS,
    extends: LAYER,
    props: [...paint, thickness, offset, radius],
  },
  FrameGlow: {
    from: EFFECTS,
    extends: LAYER,
    props: [
      ...paint,
      {
        name: "pulse",
        type: "boolean | number",
        default: "false",
        description:
          "Breathe in and out. A number is the seconds one breath in takes; true is 2.4.",
      },
      {
        name: "blur",
        type: "number | string",
        default: "10",
        description: "Blur radius of the halo.",
      },
      {
        name: "spread",
        type: "number | string",
        default: "14",
        description: "Width of the band that is blurred. Wider is brighter.",
      },
      {
        name: "opacity",
        type: "number",
        default: "0.75",
        description: "Strength of the halo, from 0 to 1.",
      },
      offset,
      radius,
    ],
  },
  FrameBeam: {
    from: EFFECTS,
    extends: LAYER,
    props: [
      {
        ...colors,
        description:
          "The beam's colours: the first for its head, the last for its tail. Without them it reads frame-from-* and frame-to-*.",
      },
      {
        name: "size",
        type: "number | string",
        default: "120",
        description: "Length of the beam.",
      },
      {
        name: "duration",
        type: "number | string",
        default: "6",
        description: "Time for one lap of the frame. Numbers are seconds.",
      },
      {
        name: "count",
        type: "number",
        default: "1",
        description: "Number of beams, spaced evenly around the frame.",
      },
      {
        name: "reverse",
        type: "boolean",
        default: "false",
        description: "Travel anticlockwise.",
      },
      {
        name: "bloom",
        type: "number | false",
        default: "0.25",
        description:
          "Strength of the light the beam casts on either side of the line. false leaves only the line.",
      },
      thickness,
      offset,
      radius,
    ],
  },
  BeamFrame: {
    from: "@/components/beam-frame",
    extends: FRAME_PROPS,
    props: [
      {
        ...colors,
        description:
          "The beam's colours: the first for its head, the last for its tail.",
      },
      {
        name: "size",
        type: "number | string",
        default: "120",
        description: "Length of the beam.",
      },
      {
        name: "duration",
        type: "number | string",
        default: "6",
        description: "Time for one lap of the frame. Numbers are seconds.",
      },
      {
        name: "count",
        type: "number",
        default: "1",
        description: "Number of beams, spaced evenly around the frame.",
      },
      {
        name: "reverse",
        type: "boolean",
        default: "false",
        description: "Travel anticlockwise.",
      },
    ],
  },
  GlowFrame: {
    from: "@/components/glow-frame",
    extends: FRAME_PROPS,
    props: [
      { ...colors, description: "Colour stops shared by the border and the halo." },
      {
        name: "spin",
        type: "boolean | number",
        default: "false",
        description:
          "Turn the colours around the frame. A number is the seconds one turn takes.",
      },
      {
        name: "pulse",
        type: "boolean | number",
        default: "false",
        description: "Make the halo breathe. A number is the seconds one breath in takes.",
      },
      {
        name: "blur",
        type: "number | string",
        default: "10",
        description: "Blur radius of the halo.",
      },
      {
        name: "spread",
        type: "number | string",
        default: "14",
        description: "Width of the band that is blurred. Wider is brighter.",
      },
    ],
  },
  FrameSpotlight: {
    from: "@/components/ui/frame-spotlight",
    extends: LAYER,
    props: [
      {
        name: "colors",
        type: "string[]",
        default: "the text colour",
        description:
          "Colour of the light, or two colours for its centre and its edge.",
      },
      {
        name: "size",
        type: "number | string",
        default: "220",
        description: "Radius of the light.",
      },
      {
        name: "wash",
        type: "boolean | number",
        default: "false",
        description:
          "Also wash the frame's surface with the light. A number is the wash's strength; true is 0.08.",
      },
      thickness,
      offset,
      radius,
    ],
  },
  FrameMetal: {
    from: "@/components/ui/frame-metal",
    extends: LAYER,
    props: [
      {
        name: "preset",
        type: '"chromatic" | "silver" | "gold"',
        default: '"chromatic"',
        description: "The finish.",
      },
      {
        name: "theme",
        type: '"dark" | "light" | "auto"',
        default: '"auto"',
        description:
          "Which palette to use: the one tuned for dark surfaces or for light ones. auto follows the page's color-scheme (set by most theme switchers), and the system's when the page sets none.",
      },
      {
        name: "scale",
        type: "number",
        default: "1",
        description: "Size of the pattern. 2 doubles it, 0.5 halves it.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Speed of the motion. 0.5 is half speed.",
      },
      {
        name: "paused",
        type: "boolean",
        default: "false",
        description: "Hold the metal still on its current frame.",
      },
      thickness,
      offset,
      radius,
    ],
  },
};
