// Per-category default logo placement presets for the UniversalVisualizer.
//
// These are DEFAULTS only — the user can still drag, resize, and rotate the
// logo freely after a preset is applied. To tweak any category's default
// placement, edit the values below.
//
// Coordinate space (matches the visualizer's logo transform):
//   x, y        — center-based position in percent (50 = centered)
//   width       — logo width as a percentage of the preview frame width
//   height      — logo height as a percentage of the preview frame height
//   rotation    — degrees of clockwise rotation

import type { CategorySlug } from "@/lib/catalog";

export type LogoPreset = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export const VISUALIZER_PRESETS: Record<string, LogoPreset> = {
  pens: {
    x: 52,
    y: 50,
    width: 30,
    height: 10,
    rotation: 0,
  },

  notebooks: {
    x: 50,
    y: 50,
    width: 45,
    height: 45,
    rotation: 0,
  },

  bags: {
    x: 50,
    y: 55,
    width: 50,
    height: 40,
    rotation: 0,
  },

  keychains: {
    x: 50,
    y: 50,
    width: 25,
    height: 25,
    rotation: 0,
  },

  display: {
    x: 50,
    y: 45,
    width: 70,
    height: 70,
    rotation: 0,
  },

  // Catalog-specific aliases (the visualizer keys presets by CategorySlug,
  // so each real catalog slug resolves to one of the presets above).
  usb: {
    x: 50,
    y: 50,
    width: 25,
    height: 25,
    rotation: 0,
  },
  xbanner: {
    x: 50,
    y: 45,
    width: 70,
    height: 70,
    rotation: 0,
  },
  rollup: {
    x: 50,
    y: 45,
    width: 70,
    height: 70,
    rotation: 0,
  },
};

const FALLBACK_PRESET: LogoPreset = {
  x: 50,
  y: 50,
  width: 40,
  height: 40,
  rotation: 0,
};

export function getPreset(slug: CategorySlug | string): LogoPreset {
  return VISUALIZER_PRESETS[slug] ?? FALLBACK_PRESET;
}
