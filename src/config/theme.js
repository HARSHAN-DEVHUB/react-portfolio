/**
 * Colour themes. Change ACTIVE_THEME to switch the whole site
 * (CSS and the 3D scenes both read from here).
 */
export const THEMES = {
  acid_graphite: {
    scheme: "dark",
    background: "#0D0D0D",
    surface: "#171717",
    textPrimary: "#EDEDE6",
    textMuted: "#8A8A82",
    accent: "#D4FF3A",
    accentSecondary: "#FF5B2E",
    // 3D clay tones derived from the palette
    clay: "#D9D6CC",
    clayDark: "#2A2A28",
  },
  bone_cobalt: {
    scheme: "light",
    background: "#EFEBE3",
    surface: "#E2DCD1",
    textPrimary: "#111111",
    textMuted: "#6B665E",
    accent: "#2B3BFF",
    accentSecondary: "#FF7A1A",
    clay: "#F7F4EE",
    clayDark: "#3A3732",
  },
  forest_clay: {
    scheme: "dark",
    background: "#0F1A14",
    surface: "#17251D",
    textPrimary: "#F2EDE4",
    textMuted: "#9AA59C",
    accent: "#E8C468",
    accentSecondary: "#D9643A",
    clay: "#E3DCCD",
    clayDark: "#22302A",
  },
};

export const ACTIVE_THEME = "acid_graphite";

export const theme = THEMES[ACTIVE_THEME];

/** Writes the active palette into CSS custom properties on <html>. */
export function applyTheme(t = theme) {
  const root = document.documentElement;
  const vars = {
    "--bg": t.background,
    "--surface": t.surface,
    "--text": t.textPrimary,
    "--muted": t.textMuted,
    "--accent": t.accent,
    "--accent-2": t.accentSecondary,
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.style.colorScheme = t.scheme;
  root.dataset.scheme = t.scheme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t.background);
}
