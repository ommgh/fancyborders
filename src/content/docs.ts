/*
 * What the docs contain: the component pages and how they are grouped.
 * Plain data, so server components, the sitemap and the sidebar can all read
 * it. Each page's live preview is defined in src/content/playgrounds.
 */

export type Category = "frames" | "shapes" | "lines" | "effects";

export const CATEGORIES: { id: Category; title: string; lead: string }[] = [
  {
    id: "frames",
    title: "Frames",
    lead: "Structural frames: brackets, rails, marks and hatching.",
  },
  {
    id: "shapes",
    title: "Shapes",
    lead: "Outlines that are not rectangles, with borders that follow them.",
  },
  {
    id: "lines",
    title: "Lines",
    lead: "Line styles for any frame: dashes, native styles and motion.",
  },
  {
    id: "effects",
    title: "Effects",
    lead: "Gradient, glow and moving light, as more layers for a frame.",
  },
];

export type Example = {
  /** File in src/demos, without its extension. */
  demo: string;
  title: string;
  description?: string;
  stage?: "dark";
};

export type ComponentDoc = {
  slug: string;
  title: string;
  /** One line under the title, also the page's meta description. */
  description: string;
  category: Category;
  /** Registry item the install command adds. */
  item: string;
  /** A composition of a primitive's layers rather than an item of its own. */
  recipe?: boolean;
  /** Preview on a dark stage whatever the colour scheme. */
  stage?: "dark";
  /** Things worth knowing before using it, one paragraph each. */
  notes?: string[];
  examples?: Example[];
  /** Components whose props the API reference lists, from src/content/api. */
  api: string[];
};

export const COMPONENTS: ComponentDoc[] = [
  /* ── Frames ──────────────────────────────────────────────────────────── */
  {
    slug: "frame",
    title: "Frame",
    description:
      "The primitive everything else is built from: an enclosure plus border, rule, corner-mark and fill layers you compose yourself.",
    category: "frames",
    item: "frame",
    notes: [
      "Layers are absolutely positioned and never take part in layout, so they can go inside a frame in any order, before or after the content.",
      "Every layer reads its line width, colour and radius from the frame, so setting them once on the frame restyles all of them.",
    ],
    examples: [
      {
        demo: "frame-tokens",
        title: "Tailwind tokens",
        description:
          "Colour, line width and radius are ordinary utilities, so they take variants like hover and dark.",
      },
      {
        demo: "frame-custom-mark",
        title: "Custom corner marks",
        description:
          "Pass children to FrameCorners to draw your own mark. It is drawn for the top-left corner and rotated onto the others.",
      },
    ],
    api: ["Frame", "FrameBorder", "FrameRules", "FrameCorners", "FrameFill"],
  },
  {
    slug: "bracket-frame",
    title: "Bracket Frame",
    description: "Corner brackets around a dashed border.",
    category: "frames",
    item: "bracket-frame",
    notes: [
      "The brackets sit on the box edge and the dashed border is drawn inside them, so give the frame at least as much padding as the gap.",
    ],
    api: ["BracketFrame"],
  },
  {
    slug: "hatch-divider",
    title: "Hatch Divider",
    description:
      "A hatched band between two lines for separating page sections, with marks where it meets the page rails.",
    category: "frames",
    item: "hatch-divider",
    notes: [
      "Set bleed to true to run the lines a full viewport width each way. The page then needs overflow-x: clip on an ancestor.",
    ],
    examples: [
      {
        demo: "divider-rails",
        title: "Between page rails",
        description:
          "In a column that draws its own side rails, the marks land on the intersections. This site's pages are built this way.",
      },
    ],
    api: ["HatchDivider"],
  },
  {
    slug: "crosshair",
    title: "Crosshair",
    description: "Rules that overshoot their corners, with a mark on each one.",
    category: "frames",
    item: "frame",
    recipe: true,
    api: ["FrameRules", "FrameCorners"],
  },
  {
    slug: "blueprint",
    title: "Blueprint",
    description: "A pattern fill behind a border, with marks at the corners.",
    category: "frames",
    item: "frame",
    recipe: true,
    api: ["FrameFill", "FrameBorder", "FrameCorners"],
  },

  /* ── Shapes ──────────────────────────────────────────────────────────── */
  {
    slug: "shape-frame",
    title: "Shape Frame",
    description:
      "A frame whose outline follows a shape: bevelled, notched, scooped or rounded corners, and edges with a bite taken out.",
    category: "shapes",
    item: "shape-frame",
    notes: [
      "The border, fill and drop-shadow filter follow the shape in every browser. Where border-shape is supported (Chromium 147 and later) the focus outline, box-shadow and hit area follow it too.",
      "Curved corners (round and scoop) need the CSS shape() function and fall back to a plain rectangular border without it.",
      "A shape frame is still a frame, so corner marks, fills and effect layers compose inside it.",
    ],
    examples: [
      {
        demo: "shape-mixed",
        title: "A different corner each",
        description: "Pass an object to give every corner its own treatment.",
      },
      {
        demo: "shape-variants",
        title: "With Tailwind variants",
        description:
          "The fill and line colour are utilities, so they change on hover like any other.",
      },
    ],
    api: ["ShapeFrame"],
  },
  {
    slug: "ticket-frame",
    title: "Ticket Frame",
    description:
      "A ticket with rounded corners, a perforated line and a tear-off stub.",
    category: "shapes",
    item: "ticket-frame",
    notes: [
      "Use a drop-shadow filter rather than box-shadow for a shadow that follows the bites in every browser.",
    ],
    api: ["TicketFrame"],
  },

  /* ── Lines ───────────────────────────────────────────────────────────── */
  {
    slug: "dash-patterns",
    title: "Dash Patterns",
    description:
      "Dashed lines with the dash and the gap set independently, which a CSS border cannot do.",
    category: "lines",
    item: "frame",
    recipe: true,
    notes: [
      "Rules are four straight lines, so they ignore the radius. For a dashed line that follows rounded corners use FrameBorder with the dashed variant.",
    ],
    api: ["FrameRules"],
  },
  {
    slug: "border-styles",
    title: "Border Styles",
    description:
      "Solid, dashed, dotted and double borders that follow the radius and can sit inside or outside the frame's edge.",
    category: "lines",
    item: "frame",
    recipe: true,
    notes: ["A double border needs a line at least 3 pixels wide to show both lines."],
    api: ["FrameBorder"],
  },
  {
    slug: "marching-ants",
    title: "Marching Ants",
    description:
      "Dashed rules whose dashes travel around the frame, like a selection rectangle.",
    category: "lines",
    item: "frame",
    recipe: true,
    notes: ["The dashes stand still for people who ask for reduced motion."],
    api: ["FrameRules"],
  },

  /* ── Effects ─────────────────────────────────────────────────────────── */
  {
    slug: "beam",
    title: "Beam",
    description:
      "A light that travels the border at a steady speed, around any proportions and any corner.",
    category: "effects",
    item: "beam-frame",
    stage: "dark",
    notes: [
      "BeamFrame is a preset: a Frame with a FrameBorder and a FrameBeam. Use the FrameBeam layer directly, from frame-effects, to add a beam to any frame.",
      "The beam follows the outline with offset-path, which needs Chromium 116, Firefox 122 or Safari 18. Without it nothing is drawn and the plain border remains.",
    ],
    examples: [
      {
        demo: "beam-shape",
        title: "On a shape",
        description: "Inside a shape frame the beam follows the shape's outline.",
        stage: "dark",
      },
      {
        demo: "beam-utilities",
        title: "Coloured by utilities",
        description:
          "Leave out the colours and the beam reads frame-from-* and frame-to-* from the frame.",
        stage: "dark",
      },
    ],
    api: ["BeamFrame", "FrameBeam"],
  },
  {
    slug: "glow",
    title: "Glow",
    description:
      "A gradient border with a halo of the same colours glowing behind it, still or turning.",
    category: "effects",
    item: "glow-frame",
    stage: "dark",
    notes: [
      "GlowFrame is a preset: a Frame with a FrameGlow and a FrameGradient that share their colours. Both layers come from frame-effects.",
      "The halo is painted behind the frame's content but in front of the frame's own background.",
    ],
    examples: [
      {
        demo: "glow-shape",
        title: "On a shape",
        description:
          "Inside a shape frame the halo is the whole shape blurred behind it, so give the shape a fill.",
        stage: "dark",
      },
    ],
    api: ["GlowFrame", "FrameGlow"],
  },
  {
    slug: "gradient",
    title: "Gradient",
    description:
      "A gradient drawn on the frame's line, in any colours and at any angle, optionally turning around the frame.",
    category: "effects",
    item: "frame-effects",
    stage: "dark",
    examples: [
      {
        demo: "gradient-utilities",
        title: "Coloured by utilities",
        description:
          "frame-from-*, frame-via-* and frame-to-* on the frame colour every effect layer inside it.",
        stage: "dark",
      },
      {
        demo: "gradient-comet",
        title: "A turning comet",
        description:
          "Fade the gradient to transparent and spin it for a light that sweeps the border.",
        stage: "dark",
      },
    ],
    api: ["FrameGradient"],
  },
  {
    slug: "pulse",
    title: "Pulse",
    description:
      "A halo that breathes in and out, for something that is live, recording or waiting.",
    category: "effects",
    item: "frame-effects",
    recipe: true,
    stage: "dark",
    notes: ["The halo holds still for people who ask for reduced motion."],
    api: ["FrameGlow", "FrameGradient"],
  },
  {
    slug: "spotlight",
    title: "Spotlight",
    description:
      "Borders that light up near the pointer, across every frame on the page at once.",
    category: "effects",
    item: "frame-spotlight",
    stage: "dark",
    notes: [
      "Every spotlight on the page shares one pointer listener, and updates at most once a frame.",
      "This is a client component. Put it over a faint FrameBorder so the frame keeps an edge where the light does not reach.",
    ],
    api: ["FrameSpotlight"],
  },
  {
    slug: "liquid-metal",
    title: "Liquid Metal",
    description:
      "A moving metal ring drawn with WebGL, in chromatic, silver and gold.",
    category: "effects",
    item: "frame-metal",
    stage: "dark",
    notes: [
      "Every metal layer on the page shares one WebGL context and one animation loop, and layers scrolled out of view are skipped.",
      "The metal is laid over the frame's ordinary line colour and is see-through where it has nothing to add, so the frame keeps a continuous edge. Without WebGL that plain line is all there is.",
      "This is a client component. The shader is adapted from metal-fx by Jakub Antalik, under the MIT License.",
    ],
    api: ["FrameMetal"],
  },
];

export function componentDoc(slug: string) {
  return COMPONENTS.find((doc) => doc.slug === slug);
}

export function componentsIn(category: Category) {
  return COMPONENTS.filter((doc) => doc.category === category);
}

export function componentHref(slug: string) {
  return `/docs/components/${slug}`;
}

/* ── Navigation ────────────────────────────────────────────────────────── */

export type NavLink = { title: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };

export const GUIDES: NavLink[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Theming", href: "/docs/theming" },
  { title: "All components", href: "/docs/components" },
];

export const NAV: NavGroup[] = [
  { title: "Get started", links: GUIDES },
  ...CATEGORIES.map(({ id, title }) => ({
    title,
    links: componentsIn(id).map((doc) => ({
      title: doc.title,
      href: componentHref(doc.slug),
    })),
  })),
];

/** Every docs page in reading order, for the previous and next links. */
export const PAGES: NavLink[] = NAV.flatMap((group) => group.links);

export function neighbours(href: string) {
  const index = PAGES.findIndex((page) => page.href === href);
  return {
    previous: index > 0 ? PAGES[index - 1] : undefined,
    next: index >= 0 && index < PAGES.length - 1 ? PAGES[index + 1] : undefined,
  };
}
