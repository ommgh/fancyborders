"use client";

/*
 * The shader and the palettes are adapted from metal-fx
 * (https://github.com/Jakubantalik/metal-fx), Copyright (c) 2026 Jakub
 * Antalik, used under the MIT License. The simplex noise is from
 * webgl-noise (https://github.com/stegu/webgl-noise), Copyright (C) 2011
 * Ashima Arts, also under the MIT License.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import {
  len,
  vars,
  type LayerProps,
  type Length,
} from "@/components/ui/frame";
import { cn } from "@/lib/utils";

/* ── Palettes ──────────────────────────────────────────────────────────── */

export type MetalPreset = "chromatic" | "silver" | "gold";
type Scheme = "dark" | "light";

type Metal = {
  /** Five colours the moving field is mapped through, dark to bright. */
  colors: readonly [string, string, string, string, string];
  /** Size of the pattern. Smaller is chunkier. */
  zoom: number;
  speed: number;
  opacity: number;
};

const PRESETS: Record<MetalPreset, Record<Scheme, Metal>> = {
  chromatic: {
    dark: {
      colors: ["#000000", "#aae8ff", "#c5fe9e", "#f7888d", "#0d0d0d"],
      zoom: 1.6,
      speed: 1.2,
      opacity: 1,
    },
    light: {
      colors: ["#ffffff", "#ffffff", "#ffffff", "#ffb3b3", "#adadad"],
      zoom: 2.5,
      speed: 1.2,
      opacity: 1,
    },
  },
  silver: {
    dark: {
      colors: ["#000000", "#dedede", "#747270", "#e5e5e5", "#0d0d0d"],
      zoom: 2.5,
      speed: 1.2,
      opacity: 0.88,
    },
    light: {
      colors: ["#f6f6f6", "#ffffff", "#ffffff", "#f7f7f7", "#c9c9c9"],
      zoom: 2.5,
      speed: 1.2,
      opacity: 1,
    },
  },
  gold: {
    dark: {
      colors: ["#000000", "#ffffff", "#ffffff", "#f7d488", "#0d0d0d"],
      zoom: 2.5,
      speed: 1,
      opacity: 0.92,
    },
    light: {
      colors: ["#fff8e1", "#fffbe0", "#ffffff", "#fff6d6", "#d2c7a7"],
      zoom: 2.5,
      speed: 1.2,
      opacity: 1,
    },
  },
};

/* ── Shader ────────────────────────────────────────────────────────────── */

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

/*
 * Four sine bands, warped by a little noise, mapped through the palette.
 * Coordinates are measured from the centre of the frame in pixels, so the
 * pattern keeps its size whatever the frame's.
 */
const FRAGMENT = `
precision highp float;

uniform vec2 u_size;
uniform float u_time;
uniform float u_density;
uniform vec3 u_colors[5];
uniform float u_light;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0, amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float t) {
  t = clamp(t, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 color = vec3(0.0);
  float total = 0.0001;
  for (int i = 0; i < 5; i++) {
    float d = t - float(i) * 0.25;
    float w = exp(-64.0 * d * d);
    color += u_colors[i] * w;
    total += w;
  }
  return color / total;
}

void main() {
  float t = u_time;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_size) * u_density;
  p += vec2(0.1736, 0.9848) * t * 0.15;

  float value = sin(p.x * 8.44 + t)
    + sin(p.y * 8.44 + t * 1.3)
    + sin((p.x + p.y) * 5.908 + t * 0.7)
    + sin(length(p) * 6.752 - t * 1.5);
  vec2 warp = vec2(fbm(p + vec2(t * 0.1, 0.0)), fbm(p + vec2(0.0, t * 0.12) + 5.0));
  value += (warp.x + warp.y) * 0.18;

  vec3 color = pow(palette(value * 0.4 + 0.5), vec3(1.3));

  // On a dark surface metal adds light, so black is transparent; on a light
  // one it adds shade, so white is. The colour is premultiplied.
  float lit = max(max(color.r, color.g), color.b);
  float shade = 1.0 - min(min(color.r, color.g), color.b);
  float alpha = mix(lit, shade, u_light);
  gl_FragColor = vec4(mix(color, color - (1.0 - alpha), u_light), alpha);
}
`;

/* ── Renderer ──────────────────────────────────────────────────────────── */

/*
 * Browsers allow only a handful of WebGL contexts, so every metal layer on
 * the page shares one. Each frame it draws a layer's metal into a hidden
 * canvas and copies the result to the layer's own 2D canvas. Only the band
 * near the edges is drawn, because the mask hides everything else.
 */
type Layer = {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  /** The palette as the shader takes it: five RGB triples. */
  colors: Float32Array;
  /** True when the palette is one made for light surfaces. */
  light: boolean;
  /** Pattern units per CSS pixel. */
  density: number;
  speed: number;
  paused: boolean;
  visible: boolean;
  /** Set when the layer must be redrawn even though it is not animating. */
  stale: boolean;
  /** Size of the layer's canvas, and how many of its pixels make a CSS one. */
  width: number;
  height: number;
  quality: number;
  /** Width of the band to draw along each edge, or 0 for the whole box. */
  band: number;
};

type Shared = {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  size: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  density: WebGLUniformLocation | null;
  colors: WebGLUniformLocation | null;
  light: WebGLUniformLocation | null;
};

/** CSS pixels one unit of the pattern covers, before a palette's zoom. */
const PATTERN = 200;

/** The longest side a layer is drawn at, in canvas pixels. */
const MAX_SIDE = 1024;

const layers = new Set<Layer>();
/** `undefined` until first needed, `null` when WebGL is unavailable. */
let shared: Shared | null | undefined;
let request = 0;
let release: ReturnType<typeof setTimeout> | undefined;
/** True while the system asks for reduced motion. */
let still = false;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function createShared(): Shared | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { antialias: false, depth: false });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the whole viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.SCISSOR_TEST);
  gl.clearColor(0, 0, 0, 0);

  // If the browser takes the context away, build a new one on the next frame.
  canvas.addEventListener("webglcontextlost", () => {
    if (shared?.canvas !== canvas) return;
    shared = undefined;
    for (const layer of layers) layer.stale = true;
    wake();
  });

  return {
    canvas,
    gl,
    size: gl.getUniformLocation(program, "u_size"),
    time: gl.getUniformLocation(program, "u_time"),
    density: gl.getUniformLocation(program, "u_density"),
    colors: gl.getUniformLocation(program, "u_colors"),
    light: gl.getUniformLocation(program, "u_light"),
  };
}

function draw(layer: Layer, { canvas, gl, ...uniform }: Shared, now: number) {
  const { width, height, band } = layer;
  if (width === 0 || height === 0) return;

  // The hidden canvas only ever grows, so layers of different sizes do not
  // make it reallocate on every frame.
  if (canvas.width < width) canvas.width = width;
  if (canvas.height < height) canvas.height = height;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uniform.size, width, height);
  gl.uniform1f(uniform.time, (now / 1000) * layer.speed);
  gl.uniform1f(uniform.density, layer.density / layer.quality);
  gl.uniform3fv(uniform.colors, layer.colors);
  gl.uniform1f(uniform.light, layer.light ? 1 : 0);

  const fill = (x: number, y: number, w: number, h: number) => {
    gl.scissor(x, y, w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (band === 0 || band * 2 >= Math.min(width, height)) {
    fill(0, 0, width, height);
  } else {
    gl.scissor(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    fill(0, 0, width, band);
    fill(0, height - band, width, band);
    fill(0, band, band, height - band * 2);
    fill(width - band, band, band, height - band * 2);
  }

  // WebGL's origin is the bottom-left corner; the 2D canvas's is the top.
  layer.context.clearRect(0, 0, width, height);
  layer.context.drawImage(
    canvas,
    0,
    canvas.height - height,
    width,
    height,
    0,
    0,
    width,
    height,
  );
  layer.stale = false;
}

function frame(now: number) {
  request = 0;
  if (layers.size === 0) return;
  if (shared === undefined) shared = createShared();
  if (!shared) return;

  let animating = false;
  for (const layer of layers) {
    if (!layer.visible) continue;
    const moving = !layer.paused && !still;
    if (moving || layer.stale) draw(layer, shared, now);
    animating ||= moving;
  }
  if (animating) wake();
}

function wake() {
  if (!request) request = requestAnimationFrame(frame);
}

/** Reads the layer's size and how far its line strays from the edges. */
function measure(layer: Layer) {
  const { host, canvas } = layer;
  const longest = Math.max(host.offsetWidth, host.offsetHeight, 1);
  const quality = Math.min(1, MAX_SIDE / longest);
  const width = Math.round(host.offsetWidth * quality);
  const height = Math.round(host.offsetHeight * quality);

  const style = getComputedStyle(host);
  const line = parseFloat(style.paddingTop) || 0;
  const radius = parseFloat(style.borderTopLeftRadius) || 0;
  layer.quality = quality;
  // A clip-path means a shape frame, whose line can be anywhere in the box.
  layer.band =
    style.clipPath === "none"
      ? Math.ceil((Math.max(line, radius) + 2) * quality)
      : 0;

  if (layer.width !== width || layer.height !== height) {
    layer.width = canvas.width = width;
    layer.height = canvas.height = height;
  }
  // Resizing a canvas clears it, so redraw now rather than a frame late.
  layer.stale = true;
  if (shared) draw(layer, shared, performance.now());
  wake();
}

function mount(layer: Layer) {
  const { host } = layer;
  clearTimeout(release);
  layers.add(layer);

  const resize = new ResizeObserver(() => measure(layer));
  resize.observe(host);

  // Layers scrolled out of view are not drawn at all.
  const view = new IntersectionObserver(
    (entries) => {
      layer.visible = entries[entries.length - 1].isIntersecting;
      if (layer.visible) wake();
    },
    { rootMargin: "128px" },
  );
  view.observe(host);

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion = () => {
    still = motion.matches;
    wake();
  };
  motion.addEventListener("change", onMotion);
  onMotion();

  return () => {
    resize.disconnect();
    view.disconnect();
    motion.removeEventListener("change", onMotion);
    layers.delete(layer);
    if (layers.size > 0) return;
    // Give the context back once the last layer has been gone a moment;
    // a layer that remounts straight away keeps it.
    release = setTimeout(() => {
      if (layers.size > 0) return;
      shared?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      shared = undefined;
    }, 1000);
  };
}

function rgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

/* ── Colour scheme ─────────────────────────────────────────────────────── */

const DARK = "(prefers-color-scheme: dark)";

/*
 * The page's colour scheme: what a theme switcher has set with the
 * color-scheme property on <html> (next-themes does this), or else the
 * system's. Either can change, so both are watched.
 */
function subscribeScheme(notify: () => void) {
  const query = window.matchMedia(DARK);
  query.addEventListener("change", notify);
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"],
  });
  return () => {
    query.removeEventListener("change", notify);
    observer.disconnect();
  };
}

const systemScheme = (): Scheme => {
  const declared = getComputedStyle(document.documentElement).colorScheme;
  if (declared === "dark" || declared === "only dark") return "dark";
  if (declared === "light" || declared === "only light") return "light";
  return window.matchMedia(DARK).matches ? "dark" : "light";
};

const serverScheme = (): Scheme => "dark";

/* ── Component ─────────────────────────────────────────────────────────── */

export type FrameMetalProps = LayerProps & {
  preset?: MetalPreset;
  /**
   * Which palette to use: the one tuned for dark surfaces or for light
   * ones. `auto` follows the page's color-scheme, and the system's when
   * the page sets none.
   */
  theme?: Scheme | "auto";
  /** Size of the pattern. 2 doubles it, 0.5 halves it. */
  scale?: number;
  /** Speed of the motion. 0.5 is half speed. */
  speed?: number;
  /** Hold the metal still on its current frame. */
  paused?: boolean;
  /** Line width, when different from the frame's. */
  thickness?: Length;
  offset?: Length;
  radius?: Length;
};

/**
 * Liquid metal on the frame's line, drawn with WebGL. All the metal layers
 * on a page share one context and one animation loop, and layers scrolled
 * out of view are skipped. It stands still for people who prefer reduced
 * motion.
 */
export function FrameMetal({
  preset = "chromatic",
  theme = "auto",
  scale = 1,
  speed = 1,
  paused = false,
  thickness,
  offset,
  radius,
  className,
  style,
  ...props
}: FrameMetalProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<Layer | null>(null);
  const system = useSyncExternalStore(
    subscribeScheme,
    systemScheme,
    serverScheme,
  );
  const scheme = theme === "auto" ? system : theme;
  const metal = PRESETS[preset][scheme];

  // Joins the shared renderer once; the settings below are applied to the
  // same layer, so changing a prop never rebuilds anything.
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!host.current || !canvas.current || !context) return;

    const created: Layer = {
      host: host.current,
      canvas: canvas.current,
      context,
      colors: new Float32Array(15),
      light: false,
      density: 0,
      speed: 1,
      paused: false,
      visible: true,
      stale: true,
      width: 0,
      height: 0,
      quality: 1,
      band: 0,
    };
    layer.current = created;
    const unmount = mount(created);

    return () => {
      unmount();
      layer.current = null;
    };
  }, []);

  useEffect(() => {
    const current = layer.current;
    if (!current) return;
    current.colors.set(metal.colors.flatMap(rgb));
    current.light = scheme === "light";
    current.density = metal.zoom / (PATTERN * scale);
    current.speed = metal.speed * speed;
    current.paused = paused;
    current.stale = true;
    wake();
  }, [metal, scheme, scale, speed, paused]);

  return (
    <div
      ref={host}
      aria-hidden
      data-slot="frame-metal"
      className={cn("fb-metal", className)}
      style={vars(
        {
          "--fb-metal-opacity": `${metal.opacity}`,
          "--fb-line": len(thickness),
          "--fb-offset": len(offset),
          "--fb-radius": len(radius),
        },
        style,
      )}
      {...props}
    >
      <canvas ref={canvas} />
    </div>
  );
}
