// Packs circles for the Life map bubble chart: biggest first, each one placed at the
// closest free spot on a spiral around the middle. Pure maths, so it can be tested.

/** items: [{ r }] → [{ ...item, x, y }] centred on (0, 0), no overlaps (gap between). */
export function pack(items, gap = 6) {
  const placed = [];
  const order = items.map((it, i) => ({ ...it, i })).sort((a, b) => b.r - a.r);
  for (const it of order) {
    if (!placed.length) {
      placed.push({ ...it, x: 0, y: 0 });
      continue;
    }
    let best = null;
    // Walk outwards on a spiral; take the first spot that fits.
    for (let step = 0; step < 4000 && !best; step++) {
      const angle = step * 0.35;
      const dist = 2 + step * 0.9;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + it.r + gap)) best = { x, y };
    }
    placed.push({ ...it, ...(best || { x: 0, y: 0 }) });
  }
  return placed.sort((a, b) => a.i - b.i).map(({ i, ...rest }) => rest);
}

/** Bounding box of packed bubbles. */
export function bounds(bubbles) {
  const xs = bubbles.flatMap((b) => [b.x - b.r, b.x + b.r]);
  const ys = bubbles.flatMap((b) => [b.y - b.r, b.y + b.r]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

/** Bubble radius for a count: area grows with the count, with a readable minimum. */
export const radiusFor = (count, min = 34, per = 15) => Math.sqrt(min * min + count * per * per);
