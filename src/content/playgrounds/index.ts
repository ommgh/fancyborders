import type { Playground } from "./define";
import {
  beam,
  glow,
  gradient,
  liquidMetal,
  pulse,
  spotlight,
} from "./effects";
import { blueprint, bracketFrame, crosshair, frame, hatchDivider } from "./frames";
import { borderStyles, dashPatterns, marchingAnts } from "./lines";
import { shapeFrame, ticketFrame } from "./shapes";
import { pageRails, sectionGrid, sectionRule } from "./structure";

/** The playground for each component page, by its slug. */
export const PLAYGROUNDS: Record<string, Playground> = {
  frame,
  "bracket-frame": bracketFrame,
  "hatch-divider": hatchDivider,
  crosshair,
  blueprint,
  "page-rails": pageRails,
  "section-rule": sectionRule,
  "section-grid": sectionGrid,
  "shape-frame": shapeFrame,
  "ticket-frame": ticketFrame,
  "dash-patterns": dashPatterns,
  "border-styles": borderStyles,
  "marching-ants": marchingAnts,
  beam,
  glow,
  gradient,
  pulse,
  spotlight,
  "liquid-metal": liquidMetal,
};
