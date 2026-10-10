import test from 'node:test';
import assert from 'node:assert/strict';
import { pack, bounds, radiusFor } from '../js/bubbles.js';

test('bubbles never overlap and keep their order', () => {
  const items = [5, 0, 12, 3, 8, 1, 0, 2, 20].map((n, k) => ({ k, r: radiusFor(n) }));
  const out = pack(items, 6);
  assert.deepEqual(out.map((b) => b.k), items.map((b) => b.k));
  for (let i = 0; i < out.length; i++)
    for (let j = i + 1; j < out.length; j++) {
      const d = Math.hypot(out[i].x - out[j].x, out[i].y - out[j].y);
      assert.ok(d >= out[i].r + out[j].r + 6 - 1e-9, `${i} and ${j} overlap`);
    }
  const b = bounds(out);
  assert.ok(b.maxX - b.minX < 700 && b.maxY - b.minY < 700, 'stays compact');
});

test('more habits = bigger bubble', () => {
  assert.ok(radiusFor(10) > radiusFor(2));
  assert.equal(Math.round(radiusFor(0)), 34);
});
