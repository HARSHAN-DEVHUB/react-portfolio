import { theme } from "../config/theme";
import { asset } from "./device";

const cache = new Map();

const toneColor = (tone) =>
  ({
    accent: theme.accent,
    accent2: theme.accentSecondary,
    ink: theme.textPrimary,
    muted: theme.textMuted,
  })[tone] || theme.textPrimary;

/**
 * Builds a typographic project cover (used when a project has no screenshot).
 * Returns a data URL. Waits for Clash Display so the glyph renders in the right font.
 */
export async function makeCover(project, index) {
  if (project.image) return asset(project.image);
  const key = `${project.slug}-${index}`;
  if (cache.has(key)) return cache.get(key);

  try {
    await document.fonts.load('600 400px "Clash Display"');
    await document.fonts.load('400 24px "JetBrains Mono"');
  } catch {
    /* fall back to system fonts */
  }

  // 16:11 — the same ratio as the card previews, so nothing gets cropped.
  const W = 1600;
  const H = 1100;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const ink = toneColor(project.cover?.tone);

  // Surface
  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial light (the only gradient we allow)
  const g = ctx.createRadialGradient(W * 0.72, H * 0.38, 0, W * 0.72, H * 0.38, W * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.06)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = "rgba(237,237,230,0.08)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += W / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += H / 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Giant glyph, bleeding off the bottom-right edge
  const glyph = project.cover?.glyph || project.name.slice(0, 2).toUpperCase();
  const size = glyph.length > 3 ? 520 : glyph.length > 2 ? 620 : 780;
  ctx.font = `600 ${size}px "Clash Display", sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "right";
  ctx.fillStyle = ink;
  ctx.save();
  ctx.translate(W + size * 0.04, H + size * 0.16);
  ctx.fillText(glyph, 0, 0);
  ctx.restore();

  // Outline echo of the glyph, stacked one line above
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(237,237,230,0.28)";
  ctx.strokeText(glyph, W + size * 0.04, H + size * 0.16 - size * 0.8);

  // Labels
  ctx.textAlign = "left";
  ctx.font = '400 30px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText(project.year || "", 96, 150);
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(project.stack.slice(0, 3).join(" / ").toUpperCase(), 96, 200);

  // One accent mark
  ctx.fillStyle = theme.accent;
  ctx.fillRect(W - 128, 96, 32, 32);

  const url = c.toDataURL("image/webp", 0.82);
  cache.set(key, url);
  return url;
}
